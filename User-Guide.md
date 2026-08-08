# Prepare the Linux Servers

This document details how to prepare the Linux servers.

## 1. Prerequisites

* **Server OS**: Ubuntu 24.04 recommended
* **CPU Cores (K8s)**: 8 Cores minimum
* **RAM (K8s)**: 16 GB minimum
* **CPU Cores (other)**: 4 Cores minimum
* **RAM (other)**: 8 GB minimum
* **Root privileges**: (sudo) on all servers
* **Static IPs**: assigned to the servers
* **Hostnames**: assigned to the servers
* **Number of Servers**: 19 minimum
  * LB Cluster: 3
  * DNS Cluster: 3
  * Admin Cluster: 4
  * Workload Cluster: 4
  * Storage Cluster: 4
  * GitLab Server: 1
* **Number of Servers**: 25 recommended
  * LB Cluster: 3
  * DNS Cluster: 3
  * HA Admin Cluster: 6
  * HA Workload Cluster: 6
  * HA Storage Cluster: 6
  * GitLab Server: 1

<br>

## 2. Preparation Activities

**Set static IP address on all nodes (on all nodes):**
```bash
# Update LAST_OCTET for each node
sudo ./set-static-ip.sh
```
**Sync the time on all nodes (on all nodes):**
```bash
sudo ./sync-time.sh
```
**Fix the inotify limits (on all nodes):**
```bash
sudo ./fix-inotify-limits.sh
```
**Create the TLS wildcard certificates and keys for the Admin cluster (execute on admin control plane node):**
```bash
# Update DOMAIN="admin.homelab.internal"
sudo ./generate-cert-files.sh
```
**Create the TLS wildcard certificates and keys for the Workload cluster (execute on workload control plane node):**
```bash
# Update DOMAIN="workload.homelab.internal"
sudo ./generate-cert-files.sh
```
**Create the TLS wildcard certificates and keys for the Storage cluster (execute on storage control plane node):**
```bash
# Update DOMAIN="storage.homelab.internal"
sudo ./generate-cert-files.sh
```
**Create the TLS certificate and key for the GitLab server (execute on the GitLab server):**
```bash
# Update DOMAIN="gitlab.homelab.internal"
sudo ./generate-cert-files.sh
```

---

# Setup HA Kubernetes Cluster Instructions

This document details how to setup a highly available Kubernetes cluster on Ubuntu 24.04.

## 1. Prerequisites

* **4 Linux Servers** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (control plane):** `192.168.159.101`
    * **Node 2 (control plane):** `192.168.159.102`
    * **Node 3 (control plane):** `192.168.159.103`
    * **Node 4 (worker node):** `192.168.159.104`
* **Virtual IP (VIP):** `192.168.159.175` (the address that workers will use for control plane queries)

<br>

## 2. Setup Process

**Prepare and install binaries (on all nodes):**
```bash
sudo ./00-prepare-nodes.sh
```
**Generate the HAProxy and Keepalived configuration (on control plane node 1):**
```bash
# Update KUBERNETES_MASTER1_IP, KUBERNETES_MASTER2_IP, KUBERNETES_MASTER3_IP, APISERVER_VIP
sudo ./01-generate-ha-config-1.sh
```
**Generate the HAProxy and Keepalived configuration (on control plane node 2):**
```bash
# Update KUBERNETES_MASTER1_IP, KUBERNETES_MASTER2_IP, KUBERNETES_MASTER3_IP, APISERVER_VIP
sudo ./02-generate-ha-config-2.sh
```
**Generate the HAProxy and Keepalived configuration (on control plane node 3):**
```bash
# Update KUBERNETES_MASTER1_IP, KUBERNETES_MASTER2_IP, KUBERNETES_MASTER3_IP, APISERVER_VIP
sudo ./03-generate-ha-config-3.sh
```
**Initialize the cluster (on control plane node 1):**
```bash
# Update APISERVER_VIP, USER (non-root user)
sudo ./04-create-ha-control-plane.sh
```
**Join control plane node to the cluster (on control plane node 2):**
```bash
# Update APISERVER_VIP
sudo kubeadm join 192.168.159.175:8443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash> \
  --control-plane --certificate-key <certificate-key>

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
**Join control plane node to the cluster (on control plane node 3):**
```bash
# Update APISERVER_VIP
sudo kubeadm join 192.168.159.175:8443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash> \
  --control-plane --certificate-key <certificate-key>

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
**Join worker node to the cluster (on worker node 1):**
```bash
# Update APISERVER_VIP
sudo kubeadm join 192.168.159.175:8443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash>
```

<br>

## 3. Verification

**Check the nodes status (on control plane node):**
```bash
kubectl get nodes
```
**Check all pods status (on control plane node):**
```bash
kubectl get pods -A
```
**Check etcd member list (on control plane node):**
```bash
sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  member list -w table 2>/dev/null
```
**Check etcd endpoints health (on control plane node):**
```bash
sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  endpoint health --cluster -w=table 2>/dev/null

sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  endpoint status --cluster -w table 2>/dev/null
```

<br>

## 4. Failover

**Stop kube-apiserver (on control node 1):**
```bash
sudo systemctl stop kubelet
sudo kill -9 $(sudo ss -tlnp | grep ':6443' | awk '{print $6}' | cut -d= -f2 | cut -d, -f1)
```
**Check that kubectl works (on control node 1):**
```bash
kubectl get nodes
```
**Shutdown control node (on control node 1):**
```bash
sudo shutdown -h now
```
**Check etcd endpoints health (on control node 2):**
```bash
sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  endpoint health --cluster -w=table 2>/dev/null
```
**Check that kubectl works (on control node 2):**
```bash
kubectl get nodes
```

<br>

**Stop kube-apiserver (on control node 2):**
```bash
# Make sure control node 1 is started before proceeding
sudo systemctl stop kubelet
sudo kill -9 $(sudo ss -tlnp | grep ':6443' | awk '{print $6}' | cut -d= -f2 | cut -d, -f1)
```
**Check that kubectl works (on control node 2):**
```bash
kubectl get nodes
```
**Shutdown control node (on control node 2):**
```bash
sudo shutdown -h now
```
**Check etcd endpoints health (on control node 3):**
```bash
sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  endpoint health --cluster -w=table 2>/dev/null
```
**Check that kubectl works (on control node 3):**
```bash
kubectl get nodes
```

<br>

**Stop kube-apiserver (on control node 3):**
```bash
# Make sure control node 2 is started before proceeding
sudo systemctl stop kubelet
sudo kill -9 $(sudo ss -tlnp | grep ':6443' | awk '{print $6}' | cut -d= -f2 | cut -d, -f1)
```
**Check that kubectl works (on control node 3):**
```bash
kubectl get nodes
```
**Shutdown control node (on control node 3):**
```bash
sudo shutdown -h now
```
**Check etcd endpoints health (on control node 1):**
```bash
sudo crictl exec --name etcd \
  etcdctl \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
  --endpoints=https://127.0.0.1:2379 \
  endpoint health --cluster -w=table 2>/dev/null
```
**Check that kubectl works (on control node 1):**
```bash
kubectl get nodes
```

---

# Setup Kubernetes Cluster Instructions

This document details how to setup a Kubernetes cluster on Ubuntu 24.04.

## 1. Prerequisites

* **12 Linux Servers** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Admin Node 1 (control plane):** `192.168.159.131` + 3 Worker Nodes
    * **Workload Node 1 (control plane):** `192.168.159.141` + 3 Worker Nodes
    * **Storage Node 1 (control plane):** `192.168.159.151` + 3 Worker Nodes

<br>

## 2. Setup Process

**Prepare and install binaries (on all nodes):**
```bash
sudo ./01-prepare-nodes.sh
```
**Initialize the cluster (on admin control plane node 1):**
```bash
# Update USER (non-root user)
sudo ./02-create-control-plane.sh
```
**Initialize the cluster (on workload control plane node 1):**
```bash
# Update USER (non-root user)
sudo ./02-create-control-plane.sh
```
**Initialize the cluster (on storage control plane node 1):**
```bash
# Update USER (non-root user)
sudo ./02-create-control-plane.sh
```
**Join worker node to the cluster (on all admin worker nodes):**
```bash
sudo kubeadm join 192.168.159.131:6443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash>
```
**Join worker node to the cluster (on all workload worker nodes):**
```bash
sudo kubeadm join 192.168.159.141:6443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash>
```
**Join worker node to the cluster (on all storage worker nodes):**
```bash
sudo kubeadm join 192.168.159.151:6443 --token <token> \
  --discovery-token-ca-cert-hash <discovery-token-hash>
```

<br>

## 3. Verification

**Check the nodes status (on all control planes):**
```bash
kubectl get nodes
```
**Check all pods status (on all control planes):**
```bash
kubectl get pods -A
```

---

# Create HA DNS Cluster Instructions

This document details how to deploy a highly available DNS infrastructure using Bind9 and Keepalived on Ubuntu 24.04.

## 1. Prerequisites

* **3 Linux Servers** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (primary):** `192.168.159.121`
    * **Node 2 (secondary):** `192.168.159.122`
    * **Node 3 (secondary):** `192.168.159.123`
* **DNS Virtual IP (VIP):** `192.168.159.53` (the address that clients will use for DNS queries)
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that points to the LB cluster)
* **GitLab Server IP (VIP):** `192.168.159.200`

<br>

## 2. Setup Process

**On node 1 (primary):**
```bash
# Update ZONE_NAME, DNS_SERVER_1_IP, DNS_SERVER_2_IP, DNS_SERVER_3_IP, DNS_VIRTUAL_IP, LB_VIRTUAL_IP, GITLAB_SERVER_IP
sudo ./setup-ha-dns-1.sh
```
**On node 2 (secondary):**
```bash
# Update ZONE_NAME, DNS_SERVER_1_IP, DNS_VIRTUAL_IP
sudo ./setup-ha-dns-2.sh
```
**On node 3 (secondary):**
```bash
# Update ZONE_NAME, DNS_SERVER_1_IP, DNS_VIRTUAL_IP
sudo ./setup-ha-dns-3.sh
```

<br>

## 3. Verification

**Check BIND status (on all nodes):**
```bash
sudo systemctl status bind9
```
**Verify primary-secondary replication (on nodes 2 and 3):**
```bash
ls -l /var/cache/bind/db.homelab.internal
```
**Check the VIP assignment (on all nodes, should be active on node 1):**
```bash
ip addr show | grep 192.168.159.53
```
**Test the DNS resolution (on a client computer):**
```bash
dig @192.168.159.53 test.homelab.internal +short
```

<br>

## 4. Failover

**Start monitoring logs (on node 2):**
```bash
journalctl -u keepalived -f
```
**Kill BIND on primary DNS (on node 1):**
```bash
# Ignore the sudo error
sudo systemctl stop bind9
```
**Verify the new VIP assignment (on node 2):**
```bash
ip addr show | grep 192.168.159.53
```
**Start monitoring logs (on node 3):**
```bash
journalctl -u keepalived -f
```
**Kill BIND on secondary DNS (on node 2):**
```bash
# Ignore the sudo error
sudo systemctl stop bind9
```
**Verify the new VIP assignment (on node 3):**
```bash
ip addr show | grep 192.168.159.53
```
**Test the DNS resolution (on a client computer):**
```bash
dig @192.168.159.53 test.homelab.internal +short
```
**Start BIND on secondary DNS (on node 2):**
```bash
# Ignore the sudo error
sudo systemctl start bind9
```
**Start BIND on primary DNS (on node 1):**
```bash
# Ignore the sudo error
sudo systemctl start bind9
```
**Verify the new VIP assignment (on node 1):**
```bash
ip addr show | grep 192.168.159.53
```

<br>

## 5. Maintenance

**Update the DNS records (on node 1):**
```bash
sudo vi /etc/bind/zones/db.homelab.internal
# 1. Increment the serial number
# 2. Add an 'a' record:
# newhost    IN    A    192.168.159.101
```
**Reload the BIND service (on node 1):**
```bash
# Ignore the sudo error
sudo systemctl reload bind9
```
**Verify the propagation (on nodes 2 and 3):**
```bash
journalctl -u named -n 20
```
**Test the DNS resolution (on a client computer):**
```bash
dig @192.168.159.53 newhost.homelab.internal +short
```

---

# Create HA LB Cluster Instructions

This document details how to deploy a highly available Load Balancer infrastructure using HAProxy and Keepalived on Ubuntu 24.04.

## 1. Prerequisites

* **3 Linux Servers** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (primary):** `192.168.159.111`
    * **Node 2 (secondary):** `192.168.159.112`
    * **Node 3 (secondary):** `192.168.159.113`
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that clients will use for DNS queries)

<br>

## 2. Setup Process

**Enable passwordless SSH authentication (on node 1):**
```bash
# Create ssh keys for the normal user
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N ""
ssh-copy-id user1@192.168.159.112
ssh-copy-id user1@192.168.159.113

# Add the private key to the root user directory
sudo cp ~/.ssh/id_rsa /root/.ssh/id_rsa
sudo chmod 600 /root/.ssh/id_rsa
```
**Execute on the primary node (on node 1):**
```bash
# Update all Kubernetes nodes IPs, DNS_VIRTUAL_IP, USER (non-root user)
sudo ./setup-ha-lb-1.sh
```
**Execute on the secondary node (on node 2):**
```bash
# Update all Kubernetes nodes IPs, DNS_VIRTUAL_IP, USER (non-root user)
sudo ./setup-ha-lb-2.sh
```
**Execute on the secondary node (on node 3):**
```bash
# Update all Kubernetes nodes IPs, DNS_VIRTUAL_IP, USER (non-root user)
sudo ./setup-ha-lb-3.sh
```
**Enable the HAProxy configuration sync (on node 1):**
```bash
# Update LB_SERVER_2_IP, LB_SERVER_3_IP, USER (non-root user)
sudo ./sync-haproxy.sh
```

<br>

## 3. Verification

**Check that Kubernetes services are accessible (on a client computer):**
```bash
curl -k https://bookinfo.admin.homelab.internal/productpage
```
**Check HAProxy status (on all nodes):**
```bash
sudo systemctl status haproxy
```
**Update the HAProxy configuration (on node 1):**
```bash
# Add a change at the end of the file
sudo vi /etc/haproxy/haproxy.cfg

# Restart the haproxy service
sudo systemctl restart haproxy

# Check the lsyncd logs
cat /var/log/lsyncd/lsyncd.log
```
**Verify primary-secondary replication (on nodes 2 and 3):**
```bash
cat /etc/haproxy/haproxy.cfg
sudo systemctl status haproxy
```
**Check the VIP assignment (on all nodes, should be active on node 1):**
```bash
ip addr show | grep 192.168.159.100
```

<br>

## 4. Failover

**Kill HAPRoxy service on primary node (on node 1):**
```bash
sudo systemctl stop haproxy
```
**Verify the new VIP assignment (on node 2):**
```bash
ip addr show | grep 192.168.159.100
```
**Test if the Kubernetes service is accessible (on a client computer):**
```bash
curl -k https://bookinfo.admin.homelab.internal/productpage
```
**Kill HAPRoxy service on secondary node (on node 2):**
```bash
sudo systemctl stop haproxy
```
**Verify the new VIP assignment (on node 3):**
```bash
ip addr show | grep 192.168.159.100
```
**Test if the Kubernetes service is accessible (on a client computer):**
```bash
curl -k https://bookinfo.admin.homelab.internal/productpage
```
**Start HAPRoxy service on secondary node (on node 2):**
```bash
sudo systemctl start haproxy
```
**Start HAPRoxy service on primary node (on node 1):**
```bash
sudo systemctl start haproxy
```
**Verify the new VIP assignment (on node 1):**
```bash
ip addr show | grep 192.168.159.100
```

---

# Create GitLab Server Instructions

This document details how to deploy a GitLab service on Ubuntu 24.04.

## 1. Prerequisites

* **1 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (primary):** `192.168.159.200`

<br>

## 2. Setup Process

**Change the default SSH port and reboot (on node 1):**
```bash
sudo ./prepare-server.sh
```
**Generate the TLS certificate and key files (on node 1):**
```bash
# Update DOMAIN="gitlab.homelab.internal"
sudo ./generate-cert-files.sh
```
**Install docker and deploy GitLab CE (on node 1):**
```bash
# Update GITLAB_HOSTNAME, USER (non-root user)
sudo ./setup-gitlab-server.sh
```
**Enable GitLab backup (on node 1):**
```bash
sudo ./enable-gitlab-backup.sh
```

<br>

## 3. GitLab Backup & Restore

**Backup GitLab data (on node 1):**
```bash
sudo gitlab-backup
```
**List backup archives (on node 1):**
```bash
sudo gitlab-backup list
```
**Restore GitLab data (on node 1):**
```bash
sudo gitlab-backup restore gitlab-backup-2026-01-31_13-15.tar.gz
```
**Show backup/restore logs (on node 1):**
```bash
cat /var/log/gitlab-backup.log
```

---

# Deploy Argo CD & Enable GitOps

This document details how to deploy Argo CD and enable GitOps in the Kubernetes clusters.

## 1. Prerequisites

* **4 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (gitlab server):** `192.168.159.200`
    * **Admin Node 2 (kubernetes control plane 1):** `192.168.159.131`
    * **Workload Node 3 (kubernetes control plane 2):** `192.168.159.141`
    * **Storage Node 4 (kubernetes control plane 3):** `192.168.159.151`
* **DNS Virtual IP (VIP):** `192.168.159.53` (the address that clients will use for DNS queries)

<br>

## 2. Preparation

**Update the Primary DNS server on all Kubernetes nodes (execute on all 12 nodes):**
```bash
# Update DNS_VIRTUAL_IP
sudo ./update-dns-server.sh
```
**Show the current DNS configuration on all Kubernetes nodes (execute on all 12 nodes):**
```bash
resolvectl status
dig gitlab.homelab.internal +short
```
**Copy files from the GitLab server to the Kubernetes control plane nodes (execute on gitlab server):**
```bash
sudo scp -r credentials user1@192.168.159.131:
sudo scp -r certs/gitlab.homelab.internal user1@192.168.159.131:

sudo scp -r credentials user1@192.168.159.141:
sudo scp -r certs/gitlab.homelab.internal user1@192.168.159.141:

sudo scp -r credentials user1@192.168.159.151:
sudo scp -r certs/gitlab.homelab.internal user1@192.168.159.151:
```

<br>

## 3. Setup Process

**Deploy Argo CD and enable GitOps (on admin control plane node):**
```bash
# Update GITLAB_HOSTNAME
sudo ./deploy-argocd-1.sh
```
**Deploy Argo CD and enable GitOps (on workload control plane node):**
```bash
# Update GITLAB_HOSTNAME
sudo ./deploy-argocd-2.sh
```
**Deploy Argo CD and enable GitOps (on storage control plane node):**
```bash
# Update GITLAB_HOSTNAME
sudo ./deploy-argocd-3.sh
```

<br>

## 4. Verification

**Configure the Argo CD cli in the Admin cluster (on control plane node):**
```bash
ARGOCD_PASSWORD=$(cat credentials/argocd_root_password)
INTERNAL_IP=$(kubectl get service argocd-server -n argocd -o jsonpath='{.spec.clusterIP}')
argocd --insecure login $INTERNAL_IP:443 --username admin --password "$ARGOCD_PASSWORD"
argocd version
```
**Show the connected Argo CD repositories in the Admin cluster (on control plane node):**
```bash
argocd repo list
```
**Show the Argo CD projects in the Admin cluster (on control plane node):**
```bash
argocd proj list
```
**Configure the Argo CD cli in the Workload cluster (on control plane node):**
```bash
ARGOCD_PASSWORD=$(cat credentials/argocd_root_password)
INTERNAL_IP=$(kubectl get service argocd-server -n argocd -o jsonpath='{.spec.clusterIP}')
argocd --insecure login $INTERNAL_IP:443 --username admin --password "$ARGOCD_PASSWORD"
argocd version
```
**Show the connected Argo CD repositories in the Workload cluster (on control plane node):**
```bash
argocd repo list
```
**Show the Argo CD projects in the Workload cluster (on control plane node):**
```bash
argocd proj list
```
**Configure the Argo CD cli in the Storage cluster (on control plane node):**
```bash
ARGOCD_PASSWORD=$(cat credentials/argocd_root_password)
INTERNAL_IP=$(kubectl get service argocd-server -n argocd -o jsonpath='{.spec.clusterIP}')
argocd --insecure login $INTERNAL_IP:443 --username admin --password "$ARGOCD_PASSWORD"
argocd version
```
**Show the connected Argo CD repositories in the Storage cluster (on control plane node):**
```bash
argocd repo list
```
**Show the Argo CD projects in the Storage cluster (on control plane node):**
```bash
argocd proj list
```

---

# Import Git Repositories Instructions

This document details how to import the Git repositories in the GitLab server.

## 1. Prerequisites

* **1 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Node 1 (primary):** `192.168.159.200`

<br>

## 2. Preparation Activities

**Make sure that the repository files are downloaded to the current folder (on gitlab server):**
```bash
git clone https://github.com/ioannisgk/homelab-medium.git
cd homelab-medium/00-repos
```

<br>

## 3. Setup Process

**Import the Admin Cluster git repository (on gitlab server):**
```bash
./01-import-admin-cluster-repo.sh
```
**Import the Workload Cluster git repository (on gitlab server):**
```bash
./02-import-workload-cluster-repo.sh
```
**Import the Storage Cluster git repository (on gitlab server):**
```bash
./03-import-storage-cluster-repo.sh
```
**Import the Demo App git repository (on gitlab server):**
```bash
./04-import-demo-app-repo.sh
```

---

# Deploy Istio & Rook Ceph

This document details how to deploy Istio and Rook Ceph in the Kubernetes clusters.

## 1. Prerequisites

* **4 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Admin Node 1 (kubernetes control plane 1):** `192.168.159.131`
    * **Workload Node 1 (kubernetes control plane 2):** `192.168.159.141`
    * **Storage Node 1 (kubernetes control plane 3):** `192.168.159.151`
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that clients will use for DNS queries)

<br>

## 2. Preparation

**Generate the TLS certificate and key files (on node 1 of admin cluster):**
```bash
sudo kubectl create secret tls admin-homelab-tls \
  --cert=certs/admin.homelab.internal/admin.homelab.internal.crt \
  --key=certs/admin.homelab.internal/admin.homelab.internal.key \
  --dry-run=client \
  -o yaml > admin-homelab-tls.yaml
```
**Update the homelab-tls secret (on node 1 of admin cluster):**
```bash
# Replace the tls.crt and tls.key in the admin cluster repository
admin-cluster/istio-mesh/manifests/homelab-tls.yaml
```
**Generate the TLS certificate and key files (on node 1 of workload cluster):**
```bash
sudo kubectl create secret tls workload-homelab-tls \
  --cert=certs/workload.homelab.internal/workload.homelab.internal.crt \
  --key=certs/workload.homelab.internal/workload.homelab.internal.key \
  --dry-run=client \
  -o yaml > workload-homelab-tls.yaml
```
**Update the homelab-tls secret (on node 1 of workload cluster):**
```bash
# Replace the tls.crt and tls.key in the workload cluster repository
workload-cluster/istio-mesh/manifests/homelab-tls.yaml
```
**Generate the TLS certificate and key files (on node 1 of storage cluster):**
```bash
sudo kubectl create secret tls storage-homelab-tls \
  --cert=certs/storage.homelab.internal/storage.homelab.internal.crt \
  --key=certs/storage.homelab.internal/storage.homelab.internal.key \
  --dry-run=client \
  -o yaml > storage-homelab-tls.yaml
```
**Update the homelab-tls secret (on node 1 of storage cluster):**
```bash
# Replace the tls.crt and tls.key in the storage cluster repository
storage-cluster/istio-mesh/manifests/homelab-tls.yaml
```

<br>

## 3. Deploy Istio Service Mesh

**Install the Gateway API CRDs (on all control plane nodes):**
```bash
kubectl apply -f gateway-api.yaml
# Wait until the health status is healthy
kubectl get application gateway-api -n argocd
```
**Deploy Istio in Ambient mode (on all control plane nodes):**
```bash
kubectl apply -f istio-mesh-parent.yaml
watch kubectl get pods -n istio-system
kubectl apply -f istio-mesh-resources.yaml
watch kubectl get pods -n istio-system
kubectl get gateway -A
```
**Install the istioctl cli (on all control plane nodes):**
```bash
export ISTIO_VERSION=1.29.0
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=$ISTIO_VERSION sh -
sudo mv istio-1.29.0/bin/istioctl /usr/local/bin/
sudo chmod +x /usr/local/bin/istioctl
istioctl version
```
**Deploy and test a sample application (on all control plane nodes):**
```bash
kubectl apply -f bookinfo-app.yaml
watch kubectl get pods -n bookinfo
kubectl exec deploy/curl -n bookinfo \
  -- sh -c \
  "for i in \$(seq 1 30); \
     do curl -s http://productpage:9080/productpage | grep reviews-v.-; \
  done"
```
**Expose the Argo CD server service (on all control plane nodes):**
```bash
kubectl apply -f argocd-resources.yaml
kubectl get httproute -A
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 argocd.admin.homelab.internal bookinfo.admin.homelab.internal kiali.admin.homelab.internal
192.168.159.100 argocd.workload.homelab.internal bookinfo.workload.homelab.internal kiali.workload.homelab.internal
192.168.159.100 argocd.storage.homelab.internal bookinfo.storage.homelab.internal kiali.storage.homelab.internal

# Access the services URLs
https://argocd.admin.homelab.internal
https://argocd.workload.homelab.internal
https://argocd.storage.homelab.internal
https://bookinfo.admin.homelab.internal/productpage
https://bookinfo.workload.homelab.internal/productpage
https://bookinfo.storage.homelab.internal/productpage
https://kiali.admin.homelab.internal
https://kiali.workload.homelab.internal
https://kiali.storage.homelab.internal
```

<br>

## 4. Create the Rook-Ceph Cluster

**Add an additional hard drive on the worker nodes (on 3 worker nodes of storage cluster):**
```bash
# The minimum size of the hard drives should be 200GB
# The size of the hard drives should be the same for all 3 worker nodes
# The hard drives should remain unformatted
```
**Deploy the Rook-Ceph operator and cluster (on node 1 of storage cluster):**
```bash
kubectl apply -f rook-ceph-parent.yaml
# Wait until all pods healthy (it may take more than 15 min)
watch kubectl get pods -n rook-ceph
```
**Create the block and filesystem storage classes (on node 1 of storage cluster):**
```bash
kubectl apply -f rook-ceph-resources.yaml
kubectl apply -f rook-ceph-extras.yaml
watch kubectl get pods -n rook-ceph

# Get the dashboard URL and admin password
kubectl get httproute -n rook-ceph
kubectl -n rook-ceph get secret rook-ceph-dashboard-password \
  -o jsonpath="{['data']['password']}" | base64 --decode > credentials/rook_admin_password
```
**Check the Rook-Ceph cluster health status (on node 1 of storage cluster):**
```bash
# Check that the ceph cluster is healthy
kubectl exec -it deploy/rook-ceph-tools -n rook-ceph -- ceph status
kubectl exec -it deploy/rook-ceph-tools -n rook-ceph -- ceph osd status

# OPTIONAL: In case of health warnings, you can increase the max number of pg per osd
kubectl patch cm rook-config-override -n rook-ceph --type merge -p '
{
  "data": {
    "config": "[global]\nmon_max_pg_per_osd = 500\n"
  }
}'
kubectl rollout restart deployment -n rook-ceph -l app=rook-ceph-mon
kubectl rollout restart deployment -n rook-ceph -l app=rook-ceph-mgr

# OPTIONAL: Reboot all nodes of the storage cluster
$ sudo reboot
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 rook-ceph.storage.homelab.internal

# Access the service URL
https://rook-ceph.storage.homelab.internal
```

<br>

## 5. Connect to the External Rook-Ceph Cluster

**Export the Ceph configuration for the other clusters (on node 1 of storage cluster):**
```bash
# Copy all variables from the export script output, to the admin cluster
# e.g. export NAMESPACE=...
sudo ./export-ceph-for-admin.sh

# Copy all variables from the export script output, to the workload cluster
# e.g. export NAMESPACE=...
sudo ./export-ceph-for-workload.sh
```
**Deploy Rook-Ceph and connect to the external Ceph cluster (on node 1 of admin cluster):**
```bash
kubectl apply -f rook-ceph-parent.yaml
sudo -E ./connect-to-external-ceph.sh
watch kubectl get pods -n rook-ceph
kubectl get CephCluster -n rook-ceph
```
**Create the block and filesystem storage classes (on node 1 of admin cluster):**
```bash
kubectl apply -f rook-ceph-resources.yaml
kubectl apply -f rook-ceph-extras.yaml
watch kubectl get pods -n rook-ceph
kubectl get sc
```
**Deploy Rook-Ceph and connect to the external Ceph cluster (on node 1 of workload cluster):**
```bash
kubectl apply -f rook-ceph-parent.yaml
sudo -E ./connect-to-external-ceph.sh
watch kubectl get pods -n rook-ceph
kubectl get CephCluster -n rook-ceph
```
**Create the block and filesystem storage classes (on node 1 of workload cluster):**
```bash
kubectl apply -f rook-ceph-resources.yaml
kubectl apply -f rook-ceph-extras.yaml
watch kubectl get pods -n rook-ceph
kubectl get sc
```

---

# Deploy Prometheus Grafana Stack

This document details how to deploy the Prometheus Grafana stack in the Kubernetes clusters.

## 1. Prerequisites

* **4 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Admin Node 1 (kubernetes control plane 1):** `192.168.159.131`
    * **Workload Node 1 (kubernetes control plane 2):** `192.168.159.141`
    * **Storage Node 1 (kubernetes control plane 3):** `192.168.159.151`
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that clients will use for DNS queries)

<br>

## 2. Preparation

**Get the S3 bucket access key and secret key (on node 1 of storage cluster):**
```bash
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-thanos-rgw-user \
  -o jsonpath='{.data.AccessKey}' | base64 -d
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-thanos-rgw-user \
  -o jsonpath='{.data.SecretKey}' | base64 -d
```
**Update the S3 bucket secret (on gitlab server admin repository):**
```bash
# Replace the access key and secret key in the admin cluster repository
admin-cluster/monitoring/manifests/thanos-objstore-secret.yaml
```
**Update the S3 bucket secret (on gitlab server workload repository):**
```bash
# Replace the access key and secret key in the workload cluster repository
workload-cluster/monitoring/manifests/thanos-objstore-secret.yaml
```
**Update the S3 bucket secret (on gitlab server storage repository):**
```bash
# Replace the access key and secret key in the workload cluster repository
storage-cluster/monitoring/manifests/thanos-objstore-secret.yaml
```

<br>

## 3. Deploy Prometheus, Thanos, Grafana in Admin Cluster

**Deploy Prometheus, Thanos, Grafana (on node 1 of admin cluster):**
```bash
kubectl apply -f kube-prometheus-stack.yaml
# Ignore thanos secret related errors in pod health status
watch kubectl get pods -n monitoring

# Allow internal kubernetes targets for prometheus scraping
sudo ./allow-kubernetes-targets.sh

# Get the grafana dashboard admin password
kubectl -n monitoring get secret kube-prometheus-helm-grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode > credentials/grafana_admin_password
```
**Deploy extra resources for Thanos (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-ceph-rgw-external
  namespace: monitoring
  labels:
    kubernetes.io/service-name: admin-ceph-rgw-external
addressType: IPv4
ports:
- name: s3
  port: 7480
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

kubectl apply -f kube-prometheus-resources.yaml
watch kubectl get pods -n monitoring
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 alertmanager.admin.homelab.internal prometheus.admin.homelab.internal grafana.admin.homelab.internal thanos.admin.homelab.internal

# Access the services URLs
https://alertmanager.admin.homelab.internal
https://prometheus.admin.homelab.internal/targets
https://grafana.admin.homelab.internal
https://thanos.admin.homelab.internal/targets
```

<br>

## 4. Deploy Prometheus in Workload Cluster & connect to Thanos

**Deploy Prometheus (on node 1 of workload cluster):**
```bash
kubectl apply -f kube-prometheus-stack.yaml
# Ignore thanos secret related errors in pod health status
watch kubectl get pods -n monitoring

# Allow internal kubernetes targets for prometheus scraping
sudo ./allow-kubernetes-targets.sh
```
**Deploy extra resources for Thanos (on node 1 of workload cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: workload-ceph-rgw-external
  namespace: monitoring
  labels:
    kubernetes.io/service-name: workload-ceph-rgw-external
addressType: IPv4
ports:
- name: s3
  port: 7480
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

kubectl apply -f kube-prometheus-resources.yaml
watch kubectl get pods -n monitoring
```
**Connect Thanos to external Prometheus (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: workload-thanos-sidecar-external
  namespace: monitoring
  labels:
    kubernetes.io/service-name: workload-thanos-sidecar-external
addressType: IPv4
ports:
- name: grpc
  port: 30901
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.142"
- addresses:
  - "192.168.159.143"
- addresses:
  - "192.168.159.144"
EOF

# Go to Grafana > Explore > Queries > code > type the query:
# up{cluster=~"admin-cluster|workload-cluster"}
# click on run query and check that results from all clusters appear
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 prometheus.workload.homelab.internal

# Access the services URLs
https://prometheus.workload.homelab.internal/targets
```

<br>

## 5. Deploy Prometheus in Storage Cluster & connect to Thanos

**Deploy Prometheus (on node 1 of storage cluster):**
```bash
kubectl apply -f kube-prometheus-stack.yaml
# Ignore thanos secret related errors in pod health status
watch kubectl get pods -n monitoring

# Allow internal kubernetes targets for prometheus scraping
sudo ./allow-kubernetes-targets.sh
```
**Deploy extra resources for Thanos (on node 1 of storage cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: storage-ceph-rgw-external
  namespace: monitoring
  labels:
    kubernetes.io/service-name: storage-ceph-rgw-external
addressType: IPv4
ports:
- name: s3
  port: 7480
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

kubectl apply -f kube-prometheus-resources.yaml
watch kubectl get pods -n monitoring
```
**Connect Thanos to external Prometheus (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: storage-thanos-sidecar-external
  namespace: monitoring
  labels:
    kubernetes.io/service-name: storage-thanos-sidecar-external
addressType: IPv4
ports:
- name: grpc
  port: 30901
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

# Go to Grafana > Explore > Queries > code > type the query:
# up{cluster=~"admin-cluster|workload-cluster|storage-cluster"}
# click on run query and check that results from all clusters appear
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 prometheus.storage.homelab.internal

# Access the services URLs
https://prometheus.storage.homelab.internal/targets
```

---

# Deploy Alloy Loki Tempo Stack

This document details how to deploy the Deploy Alloy Loki Tempo stack in the Kubernetes clusters.

## 1. Prerequisites

* **4 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Admin Node 1 (kubernetes control plane 1):** `192.168.159.131`
    * **Workload Node 1 (kubernetes control plane 2):** `192.168.159.141`
    * **Storage Node 1 (kubernetes control plane 3):** `192.168.159.151`
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that clients will use for DNS queries)

<br>

## 2. Preparation

**Get the S3 bucket access key and secret key (on node 1 of storage cluster):**
```bash
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-loki-rgw-user \
  -o jsonpath='{.data.AccessKey}' | base64 -d
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-loki-rgw-user \
  -o jsonpath='{.data.SecretKey}' | base64 -d
```
**Update the S3 bucket secret (on gitlab server admin repository):**
```bash
# Replace the access key and secret key in the admin cluster repository
admin-cluster/logging/manifests/loki-s3-credentials.yaml
```
**Get the S3 bucket access key and secret key (on node 1 of storage cluster):**
```bash
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-tempo-rgw-user \
  -o jsonpath='{.data.AccessKey}' | base64 -d
kubectl -n rook-ceph get secret rook-ceph-object-user-admin-ceph-objectstore-admin-tempo-rgw-user \
  -o jsonpath='{.data.SecretKey}' | base64 -d
```
**Update the S3 bucket secret (on gitlab server admin repository):**
```bash
# Replace the access key and secret key in the admin cluster repository
admin-cluster/tracing/manifests/tempo-s3-credentials.yaml
```

<br>

## 3. Deploy Grafana Alloy and Loki

**Deploy Grafana Alloy (on node 1 of storage cluster):**
```bash
kubectl apply -f grafana-alloy-parent.yaml
```
**Deploy extra resources for Loki (on node 1 of storage cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-loki-external
  namespace: logging
  labels:
    kubernetes.io/service-name: admin-loki-external
addressType: IPv4
ports:
- name: http
  port: 30100
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f grafana-alloy-resources.yaml
watch kubectl get pods -n logging
```
**Deploy Grafana Alloy (on node 1 of workload cluster):**
```bash
kubectl apply -f grafana-alloy-parent.yaml
```
**Deploy extra resources for Loki (on node 1 of workload cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-loki-external
  namespace: logging
  labels:
    kubernetes.io/service-name: admin-loki-external
addressType: IPv4
ports:
- name: http
  port: 30100
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f grafana-alloy-resources.yaml
watch kubectl get pods -n logging
```
**Deploy Grafana Alloy and Loki (on node 1 of admin cluster):**
```bash
kubectl apply -f grafana-loki-alloy-parent.yaml
```
**Deploy extra resources for Loki (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-loki-external
  namespace: logging
  labels:
    kubernetes.io/service-name: admin-loki-external
addressType: IPv4
ports:
- name: http
  port: 30100
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-ceph-rgw-external
  namespace: logging
  labels:
    kubernetes.io/service-name: admin-ceph-rgw-external
addressType: IPv4
ports:
- name: s3
  port: 7480
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

kubectl apply -f grafana-loki-alloy-resources.yaml
watch kubectl get pods -n logging

# Go to Grafana > Logs > Add label tag > Cluster
# The logs of the cluster will appear here
```

<br>

## 4. Deploy Grafana Tempo and enable Alloy tracing

**Deploy Grafana Tempo (on node 1 of admin cluster):**
```bash
kubectl apply -f grafana-tempo-parent.yaml
```
**Deploy extra resources for Tempo (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-ceph-rgw-external
  namespace: tracing
  labels:
    kubernetes.io/service-name: admin-ceph-rgw-external
addressType: IPv4
ports:
- name: s3
  port: 7480
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.152"
- addresses:
  - "192.168.159.153"
- addresses:
  - "192.168.159.154"
EOF

kubectl apply -f grafana-tempo-resources.yaml
watch kubectl get pods -n tracing
```
**Deploy extra resources for Tempo (on node 1 of admin cluster):**
```bash
kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-tempo-external
  namespace: tracing
  labels:
    kubernetes.io/service-name: admin-tempo-external
addressType: IPv4
ports:
- name: otlp-grpc
  port: 30317
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f telemetrygen-app.yaml
watch kubectl get pods -n telemetrygen

# Go to Grafana > Drilldown > Traces
# The traces of the cluster will appear here
```
**Deploy extra resources for Tempo (on node 1 of workload cluster):**
```bash
kubectl apply -f grafana-tempo-resources.yaml

kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-tempo-external
  namespace: tracing
  labels:
    kubernetes.io/service-name: admin-tempo-external
addressType: IPv4
ports:
- name: otlp-grpc
  port: 30317
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f telemetrygen-app.yaml
watch kubectl get pods -n telemetrygen

# Go to Grafana > Drilldown > Traces
# The traces of the cluster will appear here
```
**Deploy extra resources for Tempo (on node 1 of storage cluster):**
```bash
kubectl apply -f grafana-tempo-resources.yaml

kubectl apply -f - <<EOF
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: admin-tempo-external
  namespace: tracing
  labels:
    kubernetes.io/service-name: admin-tempo-external
addressType: IPv4
ports:
- name: otlp-grpc
  port: 30317
  protocol: TCP
endpoints:
- addresses:
  - "192.168.159.132"
- addresses:
  - "192.168.159.133"
- addresses:
  - "192.168.159.134"
EOF

kubectl apply -f telemetrygen-app.yaml
watch kubectl get pods -n telemetrygen

# Go to Grafana > Drilldown > Traces
# The traces of the cluster will appear here
```

---

# Deploy Harbor and Jenkins

This document details how to deploy Harbor and Jenkins in the Kubernetes clusters.

## 1. Prerequisites

* **4 Linux Server** (Ubuntu 24.04 recommended)
* **Root privileges** (sudo) on all servers
* **Static IPs** assigned to the servers as follows:
    * **Admin Node 1 (kubernetes control plane 1):** `192.168.159.131`
    * **Workload Node 1 (kubernetes control plane 2):** `192.168.159.141`
    * **Storage Node 1 (kubernetes control plane 3):** `192.168.159.151`
* **LB Virtual IP (VIP):** `192.168.159.100` (the address that clients will use for DNS queries)

<br>

## 2. Deploy Harbor Registry

**Deploy Harbor Registry (on node 1 of admin cluster):**
```bash
kubectl apply -f harbor-parent.yaml
kubectl apply -f harbor-resources.yaml
watch kubectl get pods -n harbor
```
**Get the Harbor admin password (on node 1 of admin cluster):**
```bash
kubectl -n harbor get secret harbor-admin-secret \
  -o jsonpath='{.data.HARBOR_ADMIN_PASSWORD}' | base64 -d > credentials/harbor_admin_password
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 harbor.admin.homelab.internal

# Access the services URLs
https://harbor.admin.homelab.internal
```
**Create the workload project and a robot user in Harbor (on node 1 of admin cluster):**
```bash
# Update HARBOR_URL
./create-harbor-project-account.sh

# Go to Harbor > Projects > workload-project > Robot Accounts
# check that the robot account is created
```
**Trust the TLS certificate of Harbor (on all worker nodes of workload cluster):**
```bash
# Update HARBOR_HOST
sudo ./trust-harbor-certificate.sh
```

<br>

## 3. Deploy & Configure Jenkins

**Generate the CA certificate configmaps (on node 1 of workload cluster):**
```bash
# Place the script in its own temporary folder
./generate-ca-configmaps.sh
```
**Update the Jenkins configmaps for the CA certificates (on gitlab server workload repository):**
```bash
# Replace the ca.crt in the workload cluster repository
workload-cluster/jenkins/manifests/argocd-ca-cert.yaml
workload-cluster/jenkins/manifests/gitlab-ca-cert.yaml
workload-cluster/jenkins/manifests/harbor-ca-cert.yaml
workload-cluster/jenkins/manifests/internal-ca-bundle.yaml
```
**Deploy Jenkins (on node 1 of workload cluster):**
```bash
kubectl apply -f jenkins-parent.yaml
kubectl apply -f jenkins-resources.yaml
watch kubectl get pods -n jenkins
```
**Get the Jenkins admin password (on node 1 of workload cluster):**
```bash
kubectl -n jenkins get secret jenkins-admin-secret \
  -o jsonpath='{.data.jenkins-admin-password}' | base64 -d > credentials/jenkins_admin_password
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 jenkins.workload.homelab.internal

# Access the services URLs
https://jenkins.workload.homelab.internal
```
**Configure Jenkins (on Jenkins):**
```bash
# Manage Jenkins > Credentials > Add credentials > Username with password > ID: harbor-robot-credentials
# Manage Jenkins > Credentials > Add credentials > Username with password > ID: gitlab-bot-credentials

# Install cosign and create a keypair (enter a password)
$ COSIGN_VERSION="v2.6.3"
$ curl -L "https://github.com/sigstore/cosign/releases/download/${COSIGN_VERSION}/cosign-linux-amd64" -o cosign
$ chmod +x cosign
$ sudo mv cosign /usr/local/bin/
$ cosign generate-key-pair

# Manage Jenkins > Credentials > Add credentials > Secret file > ID: cosign-private-key (cosign.key)
# Manage Jenkins > Credentials > Add credentials > Secret text > ID: cosign-password (password)

# Create a jenkins account and generate a token (on node 1 of workload cluster)
./create-argocd-token.sh
# Manage Jenkins > Credentials > Add credentials > Secret text > ID: argocd-token-credentials (token)
```
**Create Jenkins Pipelines (on Jenkins):**
```bash
# New > Pipeline > demo-app-pipeline-cicd > Pipeline script from SCM > Repository URL: https://gitlab.homelab.internal/automationbot/demo-app.git (main) - Jenkinsfile
# New > Pipeline > demo-app-pipeline-deploy > Pipeline script from SCM > Repository URL: https://gitlab.homelab.internal/automationbot/demo-app.git (main) - Jenkinsfile.deploy
```
**Action needed in case of node restart without draining (on node 1 of workload cluster):**
```bash
kubectl delete pod jenkins-helm-0 -n jenkins --grace-period=0 --force
```

<br>

## 4. Deploy the Spring MVC Demo App

**Create the Harbor secret for the Spring MVC demo app (on node 1 of workload cluster):**
```bash
kubectl create secret docker-registry harbor-registry-secret \
  --docker-server='harbor.admin.homelab.internal' \
  --docker-username='<harbor-robot-account-username>' \
  --docker-password='<harbor-robot-account-token>' \
  --namespace="spring-mvc-demo" \
  --dry-run=client -o yaml > harbor-secret.yaml
```
**Update the Harbor secret for the Spring MVC demo app (on gitlab server workload repository):**
```bash
# Replace the harbor-registry-secret.yaml in the workload cluster repository
workload-cluster/spring-mvc-demo/manifests/harbor-registry-secret.yaml
```
**Deploy the Spring MVC demo app (on node 1 of workload cluster):**
```bash
kubectl apply -f spring-mvc-demo-app.yaml

# Go to Jenkins and run the pipeline "demo-app-pipeline-cicd" to generate the image
watch kubectl get pods -n spring-mvc-demo

# OPTIONAL: In case of DNS timeout errors, you can scale up the Core DNS pods
kubectl -n kube-system patch deployment coredns --type='strategic' -p='{
  "spec": {
    "replicas": 3,
    "template": {
      "spec": {
        "containers": [{
          "name": "coredns",
          "resources": {
            "requests": {
              "cpu": "200m",
              "memory": "100Mi"
            },
            "limits": {
              "cpu": "500m",
              "memory": "200Mi"
            }
          }
        }]
      }
    }
  }
}'
```
**Check the services access (on client hosts):**
```bash
# Make sure you have added this in your main DNS server
192.168.159.100 spring-mvc-demo.workload.homelab.internal

# Access the services URLs
https://spring-mvc-demo.workload.homelab.internal
```
**Check the pipelines (on Jenkins):**
```bash
# New > Pipeline > demo-app-pipeline-cicd > Run
# New > Pipeline > demo-app-pipeline-deploy > Run
```