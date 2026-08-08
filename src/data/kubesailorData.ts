import { ClusterInfo, BuildStep, TechStackItem, ComparisonFeature } from '../types';

export const CLUSTERS: ClusterInfo[] = [
  {
    id: 'admin',
    title: 'Admin & Control Cluster',
    role: 'Central Governance, Registry, GitOps Engine & Observability Hub',
    recommendedNodes: '3 Control Plane + 3 Worker Nodes (HA)',
    minSpecs: '8 vCPU, 16 GB RAM, 100 GB SSD per node',
    accentColor: 'from-blue-500 to-cyan-500',
    summary: 'Isolated management cluster powering your GitOps pipelines, private image registry, centralized monitoring with Thanos, and Istio service mesh ingress.',
    keyBenefits: [
      'Total isolation: CI/CD & secrets never share compute with customer workloads',
      'Self-signed wildcard TLS certificates for all cluster ingress domains',
      'Air-gapped capable Harbor registry with Cosign image signing',
      'GitOps push-to-deploy sync via ArgoCD & GitLab Git server'
    ],
    components: [
      {
        name: 'GitLab CE',
        category: 'GitOps & CI/CD',
        description: 'Self-hosted Git platform with Docker-based deployment',
        iconName: 'GitBranch',
        tech: 'GitLab CE + Jenkins',
        status: 'ha-configured',
        details: [
          'Self-contained code repos with automated backup & restore',
          'Zero external dependency on GitHub/GitLab SaaS uptime',
          'Integrated with Jenkins CI/CD pipelines for build automation'
        ]
      },
      {
        name: 'Harbor Registry',
        category: 'Infrastructure',
        description: 'Enterprise OCI container registry with vulnerability scanning',
        iconName: 'Box',
        tech: 'Harbor OCI Registry',
        status: 'production-ready',
        details: [
          'Automated image vulnerability scanning on git push',
          'Internal mirror caching for Docker Hub rate-limits',
          'Signed images with Cosign verification'
        ]
      },
      {
        name: 'Istio Service Mesh',
        category: 'Networking & Ingress',
        description: 'Ambient mode service mesh with Gateway API routing',
        iconName: 'Network',
        tech: 'Istio Ambient + Gateway API',
        status: 'ha-configured',
        details: [
          'Gateway API CRDs for modern HTTPRoute-based traffic routing',
          'Wildcard TLS termination via self-signed certificates',
          'Kiali dashboard for real-time service mesh visualization'
        ]
      },
      {
        name: 'Argo CD',
        category: 'GitOps & CI/CD',
        description: 'Declarative, GitOps continuous delivery tool for K8s',
        iconName: 'RefreshCw',
        tech: 'ArgoCD Multi-Cluster',
        status: 'production-ready',
        details: [
          'Manages Admin, Workload & Storage cluster states via GitLab repos',
          'Automated drift detection & self-healing reconciliation',
          'Granular rollbacks and canary deployment support'
        ]
      },
      {
        name: 'Prometheus & Thanos',
        category: 'Observability',
        description: 'Centralized multi-cluster metrics with long-term S3 storage',
        iconName: 'Activity',
        tech: 'Prometheus + Thanos + Grafana',
        status: 'ha-configured',
        details: [
          'Thanos sidecar connects all cluster Prometheus instances',
          'S3-based long-term metric storage via Rook-Ceph Object Gateway',
          'Pre-built Grafana dashboards for nodes, pods, Ceph & ingress'
        ]
      }
    ]
  },
  {
    id: 'workload',
    title: 'Application Workload Cluster',
    role: 'Production Compute Engine for Microservices & Web Apps',
    recommendedNodes: '3 Control Plane + 3 Worker Nodes (HA)',
    minSpecs: '8 vCPU, 16 GB RAM, 200 GB SSD per worker',
    accentColor: 'from-emerald-500 to-teal-500',
    summary: 'High-performance Kubernetes cluster dedicated strictly to running user applications with Istio service mesh, Jenkins CI/CD, and HAProxy-based ingress routing.',
    keyBenefits: [
      'Istio ambient mode service mesh with zero-config mTLS encryption',
      'HA load balancing via external HAProxy + Keepalived cluster',
      'Zero-downtime rolling upgrades and automated node health checks',
      'Jenkins CI/CD pipelines with Harbor image scanning & Cosign signing'
    ],
    components: [
      {
        name: 'Istio Ambient CNI',
        category: 'Infrastructure',
        description: 'Service mesh with ambient mode for transparent L4/L7 networking',
        iconName: 'Network',
        tech: 'Istio Ambient Mode',
        status: 'production-ready',
        details: [
          'No sidecar overhead — ambient mode runs at the node level',
          'Kiali UI for real-time microservice traffic flow visualization',
          'Gateway API HTTPRoute for declarative ingress routing'
        ]
      },
      {
        name: 'HAProxy + Keepalived LB',
        category: 'Infrastructure',
        description: 'HA load balancer cluster with VIP failover for ingress traffic',
        iconName: 'Globe',
        tech: 'HAProxy + Keepalived + Lsyncd',
        status: 'ha-configured',
        details: [
          'Virtual IP failover across 3 dedicated LB nodes',
          'Automatic HAProxy config sync via Lsyncd replication',
          'Health-check based failover with sub-second VIP migration'
        ]
      },
      {
        name: 'Jenkins CI/CD',
        category: 'GitOps & CI/CD',
        description: 'Pipeline automation for build, scan, sign & deploy workflows',
        iconName: 'Cpu',
        tech: 'Jenkins + Cosign + Harbor',
        status: 'production-ready',
        details: [
          'Automated CI/CD pipeline: build → Trivy scan → Cosign sign → deploy',
          'Harbor robot account integration for secure image push/pull',
          'ArgoCD token-based deployment trigger for GitOps sync'
        ]
      },
      {
        name: 'Kube-Prometheus Stack',
        category: 'Observability',
        description: 'Local node metrics, container monitoring & Thanos sidecar',
        iconName: 'Activity',
        tech: 'Prometheus + Thanos Sidecar',
        status: 'ha-configured',
        details: [
          'Pre-configured alert rules for OOMKills, pod crashes, disk pressure',
          'Thanos sidecar shipping metrics to central Admin Cluster Thanos',
          'Near-zero CPU overhead on app workloads'
        ]
      }
    ]
  },
  {
    id: 'storage',
    title: 'Distributed Storage Cluster',
    role: 'Rook-Ceph High-Availability Block, File & S3 Object Storage',
    recommendedNodes: '3 Control Plane + 3 Worker Nodes (NVMe/SSD heavy)',
    minSpecs: '8 vCPU, 16 GB RAM, 200 GB additional raw drive per worker',
    accentColor: 'from-amber-500 to-orange-500',
    summary: 'Dedicated distributed storage backbone delivering cloud-like persistent volumes (RWO, RWX) and S3-compatible object buckets on raw drives, connected to Admin and Workload clusters.',
    keyBenefits: [
      'True HA: Triple replication across physical storage worker nodes',
      'Cloud S3 API replacement with zero per-GB bandwidth/egress fees',
      'External Ceph cluster connection for Admin and Workload clusters',
      'Rook-Ceph dashboard accessible via Istio Gateway for monitoring'
    ],
    components: [
      {
        name: 'Rook-Ceph Storage Engine',
        category: 'Storage & Backup',
        description: 'Production-grade distributed block, filesystem & object storage',
        iconName: 'Database',
        tech: 'Rook Ceph Operator',
        status: 'ha-configured',
        details: [
          'Automatic failover: Node outage causes zero data loss or downtime',
          'Ceph CSI driver delivering high IOPS block volumes',
          'Self-healing scrubbing and background replica balancing'
        ]
      },
      {
        name: 'Ceph Object Gateway (RGW)',
        category: 'Storage & Backup',
        description: 'S3-compatible object storage for Thanos, Loki & Tempo backends',
        iconName: 'HardDrive',
        tech: 'Ceph RGW S3 API',
        status: 'production-ready',
        details: [
          '100% S3 SDK compatible (AWS SDK, Boto3, MinIO Client)',
          'Used as backend storage for Thanos metrics and Loki logs',
          'Unlimited internal bandwidth with no transfer cost'
        ]
      },
      {
        name: 'GitLab Backup System',
        category: 'Storage & Backup',
        description: 'Automated GitLab backup & restore with scheduled cron jobs',
        iconName: 'Server',
        tech: 'GitLab Backup + Cron',
        status: 'ha-configured',
        details: [
          'Automated scheduled GitLab data backups with rotation',
          'One-command full GitLab restore from backup archive',
          'Backup/restore logging for audit and compliance'
        ]
      }
    ]
  }
];

export const BUILD_STEPS: BuildStep[] = [
  {
    day: 1,
    title: 'Bare Metal & Network Topology',
    subtitle: 'Hardware validation, Ubuntu 24.04 base OS, static IPs, DNS & LB setup',
    estimatedHours: '4-6 hours',
    summary: 'Prepare 19+ physical or dedicated servers with Ubuntu Server 24.04 LTS, configure static IPs, time sync, inotify limits, and generate self-signed TLS wildcard certificates.',
    tasks: [
      'Install Ubuntu 24.04 LTS on all servers & set static IP addresses',
      'Sync time and fix inotify limits on all nodes',
      'Generate self-signed TLS wildcard certificates for all cluster domains',
      'Deploy HA DNS cluster (Bind9 + Keepalived) and HA LB cluster (HAProxy + Keepalived)'
    ],
    cliSnippet: `# Prepare all Linux servers for KubeSailor deployment
sudo ./set-static-ip.sh
sudo ./sync-time.sh
sudo ./fix-inotify-limits.sh
sudo ./generate-cert-files.sh`,
    outputPreview: `[OK] 19 Nodes detected (LB: 3, DNS: 3, Admin: 4, Workload: 4, Storage: 4, GitLab: 1)
[OK] Ubuntu 24.04 LTS installed on all nodes
[OK] Static IPs assigned and time synchronized
[OK] TLS wildcard certificates generated for all domains
[SUCCESS] Pre-flight server preparation complete. Ready for Day 2.`,
    verificationCheck: 'All nodes reachable via SSH key-auth with static IPs and synchronized time.'
  },
  {
    day: 2,
    title: 'HA Kubernetes Clusters & GitLab Server',
    subtitle: 'Deploying HA K8s clusters with kubeadm and self-hosted GitLab CE',
    estimatedHours: '3-5 hours',
    summary: 'Initialize 3 HA Kubernetes clusters (Admin, Workload, Storage) using kubeadm with HAProxy + Keepalived control plane HA, and deploy GitLab CE on a dedicated server.',
    tasks: [
      'Bootstrap HA kubeadm control planes with 3 master nodes and embedded etcd',
      'Configure HAProxy + Keepalived for API server VIP failover',
      'Join worker nodes to each cluster using kubeadm join',
      'Deploy GitLab CE with Docker, enable automated backups'
    ],
    cliSnippet: `# Initialize HA Kubernetes cluster with kubeadm
sudo ./00-prepare-nodes.sh
sudo ./01-generate-ha-config-1.sh
sudo ./04-create-ha-control-plane.sh
kubectl get nodes`,
    outputPreview: `NAME           STATUS   ROLES           AGE   VERSION
admin-cp-01    Ready    control-plane   12m   v1.31.0
admin-cp-02    Ready    control-plane   10m   v1.31.0
admin-cp-03    Ready    control-plane   8m    v1.31.0
admin-wk-01    Ready    <none>          5m    v1.31.0
[SUCCESS] HA Admin Cluster live with 3 control planes + 1 worker node`,
    verificationCheck: 'All 3 HA clusters healthy with etcd quorum and VIP failover verified.'
  },
  {
    day: 3,
    title: 'Distributed Rook-Ceph Storage Cluster',
    subtitle: 'Mounting raw drives into a multi-node HA block & object pool',
    estimatedHours: '4-6 hours',
    summary: 'Attach raw unformatted drives to Storage cluster worker nodes, deploy Rook-Ceph operator, create block and filesystem storage classes, plus S3 object endpoints.',
    tasks: [
      'Add 200GB+ raw unformatted drives to 3 storage worker nodes',
      'Deploy Rook-Ceph operator and cluster via ArgoCD',
      'Create block (ceph-block) and filesystem (cephfs) storage classes',
      'Set up Ceph Object Gateway (RGW) for S3-compatible object storage'
    ],
    cliSnippet: `# Deploy Rook-Ceph cluster via ArgoCD
kubectl apply -f rook-ceph-parent.yaml
kubectl apply -f rook-ceph-resources.yaml
kubectl exec -it deploy/rook-ceph-tools -n rook-ceph -- ceph status`,
    outputPreview: `  cluster:
    id:     a7f20194-019d-4318
    health: HEALTH_OK
  services:
    mon: 3 in quorum
    osd: 3 osds: 3 up, 3 in
  data:
    pools:   3 pools, 96 pgs
    usage:   600 GiB used, 600 GiB total
[SUCCESS] Ceph cluster HEALTH_OK with triple replication active.`,
    verificationCheck: 'Ceph cluster status HEALTH_OK with triple replication active.'
  },
  {
    day: 4,
    title: 'Istio Service Mesh & ArgoCD GitOps',
    subtitle: 'Deploying Istio ambient mode, ArgoCD, and connecting clusters to GitLab',
    estimatedHours: '4-5 hours',
    summary: 'Deploy Istio service mesh in ambient mode with Gateway API on all clusters, install ArgoCD connected to GitLab repositories, and configure GitOps reconciliation.',
    tasks: [
      'Deploy Gateway API CRDs and Istio in ambient mode on all clusters',
      'Install istioctl CLI and verify Istio mesh health',
      'Deploy ArgoCD on all clusters connected to GitLab repositories',
      'Connect external Rook-Ceph storage to Admin and Workload clusters'
    ],
    cliSnippet: `# Deploy Istio ambient mode and ArgoCD
kubectl apply -f gateway-api.yaml
kubectl apply -f istio-mesh-parent.yaml
sudo ./deploy-argocd-1.sh
argocd repo list`,
    outputPreview: `[+] Gateway API CRDs installed successfully.
[+] Istio 1.29.0 ambient mode deployed.
[+] Kiali dashboard accessible via Istio Gateway.
[+] ArgoCD deployed and connected to GitLab repositories.
[SUCCESS] All clusters have Istio + ArgoCD operational.`,
    verificationCheck: 'ArgoCD synced with GitLab repos and Istio Gateway routing verified.'
  },
  {
    day: 5,
    title: 'Harbor Registry & Jenkins CI/CD',
    subtitle: 'Setting up Harbor container registry and Jenkins build pipelines',
    estimatedHours: '3-4 hours',
    summary: 'Deploy Harbor registry on Admin cluster, configure Jenkins CI/CD on Workload cluster with Cosign image signing, and create automated build-scan-deploy pipelines.',
    tasks: [
      'Deploy Harbor OCI image registry with robot account for workload project',
      'Trust Harbor TLS certificates on all Workload cluster worker nodes',
      'Deploy Jenkins with CA certificate configmaps for GitLab, ArgoCD, Harbor',
      'Create Jenkins pipelines: demo-app-pipeline-cicd and demo-app-pipeline-deploy'
    ],
    cliSnippet: `# Deploy Harbor and Jenkins via ArgoCD
kubectl apply -f harbor-parent.yaml
kubectl apply -f harbor-resources.yaml
kubectl apply -f jenkins-parent.yaml
kubectl apply -f jenkins-resources.yaml`,
    outputPreview: `[+] Harbor Registry deployed at https://harbor.admin.homelab.internal
[+] Harbor robot account created for workload-project
[+] Jenkins deployed at https://jenkins.workload.homelab.internal
[+] CI/CD Pipeline: build → Trivy scan → Cosign sign → ArgoCD deploy
[SUCCESS] Full CI/CD pipeline operational with image signing.`,
    verificationCheck: 'Jenkins pipeline builds, scans, signs, and deploys images via ArgoCD.'
  },
  {
    day: 6,
    title: 'Full-Stack Observability Suite',
    subtitle: 'Prometheus, Thanos, Grafana, Loki, Tempo & Grafana Alloy',
    estimatedHours: '3-5 hours',
    summary: 'Deploy Prometheus with Thanos for centralized metrics, Grafana Alloy for log collection, Loki for log aggregation, and Tempo for distributed tracing across all clusters.',
    tasks: [
      'Deploy Kube-Prometheus stack with Thanos sidecar on all clusters',
      'Connect Thanos query to external Prometheus instances across clusters',
      'Deploy Grafana Alloy and Loki for centralized log ingestion from all clusters',
      'Deploy Grafana Tempo for distributed tracing with OpenTelemetry'
    ],
    cliSnippet: `# Deploy Prometheus + Thanos + Grafana Alloy + Loki + Tempo
kubectl apply -f kube-prometheus-stack.yaml
kubectl apply -f kube-prometheus-resources.yaml
kubectl apply -f grafana-loki-alloy-parent.yaml
kubectl apply -f grafana-tempo-parent.yaml`,
    outputPreview: `NAME                                     READY   STATUS    RESTARTS   AGE
prometheus-k8s-0                         2/2     Running   0          5m
thanos-query-0                           1/1     Running   0          4m
loki-0                                   1/1     Running   0          4m
tempo-0                                  1/1     Running   0          3m
grafana-579899d9d4-x92kz                 1/1     Running   0          3m
[SUCCESS] Grafana dashboards ready at https://grafana.admin.homelab.internal`,
    verificationCheck: 'Grafana dashboard displaying live metrics, logs, and traces from all clusters.'
  },
  {
    day: 7,
    title: 'Demo App, DR Testing & Production Handover',
    subtitle: 'Spring MVC demo deployment, HA failover drills & documentation handover',
    estimatedHours: '2-4 hours',
    summary: 'Deploy the Spring MVC demo application via Jenkins pipeline, run HA failover drills across DNS, LB, and K8s clusters, and deliver complete documentation handover.',
    tasks: [
      'Deploy Spring MVC demo app via Jenkins CI/CD pipeline on Workload cluster',
      'Run HA failover tests: DNS VIP failover, LB VIP failover, K8s control plane failover',
      'Verify GitLab backup & restore procedure',
      'Generate team operational guides, architecture diagrams, and credential documentation'
    ],
    cliSnippet: `# Deploy demo app and run HA failover tests
kubectl apply -f spring-mvc-demo-app.yaml
# Run Jenkins pipeline: demo-app-pipeline-cicd
curl -k https://spring-mvc-demo.workload.homelab.internal
# Test HA failover
dig @192.168.159.53 test.homelab.internal +short`,
    outputPreview: `[+] Spring MVC Demo App deployed at https://spring-mvc-demo.workload.homelab.internal
[+] DNS Failover: VIP migrated to node 2 in 1.2s
[+] LB Failover: VIP migrated to node 2, services accessible
[+] K8s Failover: Control plane VIP migrated, kubectl operational
[SUCCESS] All HA failover tests passed. Private Cloud is 100% Operational!`,
    verificationCheck: 'Full platform operational with HA failover verified and documentation delivered.'
  }
];

export const TECH_STACK: TechStackItem[] = [
  {
    name: 'Istio (Ambient Mode)',
    category: 'Networking & Security',
    role: 'Service mesh with Gateway API for L4/L7 traffic routing',
    logoText: 'Istio',
    icon: 'Network',
    whyChosen: 'Ambient mode eliminates sidecar overhead, provides mTLS encryption, and Gateway API HTTPRoute for modern ingress routing with Kiali visualization.'
  },
  {
    name: 'Rook-Ceph',
    category: 'Distributed Storage',
    role: 'Block (RWO), File (RWX), and S3 Object Storage engine',
    logoText: 'Ceph',
    icon: 'Database',
    whyChosen: 'Transforms bare-metal drives into a cloud-grade, self-healing distributed storage pool with triple replication and S3-compatible object gateway.'
  },
  {
    name: 'GitLab CE / Jenkins',
    category: 'Developer Platform',
    role: 'Self-hosted Git repositories & CI/CD pipeline automation',
    logoText: 'GitLab',
    icon: 'GitBranch',
    whyChosen: 'Docker-based GitLab CE with automated backups, plus Jenkins pipelines for build, scan, sign, and deploy workflows.'
  },
  {
    name: 'HAProxy + Keepalived',
    category: 'Load Balancing & HA',
    role: 'HA Load Balancer with VIP failover and config sync',
    logoText: 'HAProxy',
    icon: 'ShieldCheck',
    whyChosen: 'Provides HA load balancing across all Kubernetes cluster ingress with automatic VIP failover via Keepalived and Lsyncd config replication.'
  },
  {
    name: 'ArgoCD',
    category: 'GitOps Deployment',
    role: 'Declarative GitOps controller for multi-cluster delivery',
    logoText: 'ArgoCD',
    icon: 'RefreshCw',
    whyChosen: 'Industry standard for GitOps: guarantees state in GitLab matches reality on Kubernetes with automatic drift correction.'
  },
  {
    name: 'Harbor',
    category: 'OCI Container Registry',
    role: 'Enterprise container image registry with vulnerability scanning',
    logoText: 'Harbor',
    icon: 'Box',
    whyChosen: 'Includes Trivy vulnerability scanning, robot accounts, Cosign image signing, and Docker Hub pull-through caching.'
  },
  {
    name: 'Prometheus, Thanos & Grafana',
    category: 'Metrics & Dashboards',
    role: 'Multi-cluster metrics with Thanos aggregation and Grafana dashboards',
    logoText: 'Grafana',
    icon: 'Activity',
    whyChosen: 'Thanos enables centralized multi-cluster metrics queries with S3 long-term storage via Rook-Ceph Object Gateway.'
  },
  {
    name: 'Loki, Tempo & Alloy',
    category: 'Logs & Traces',
    role: 'Log aggregation via Grafana Alloy and distributed tracing via Tempo',
    logoText: 'Loki',
    icon: 'Terminal',
    whyChosen: 'Grafana Alloy collects logs from all clusters into centralized Loki, while Tempo provides distributed tracing with S3 storage backend.'
  }
];

export const COMPARISON_DATA: ComparisonFeature[] = [
  {
    category: 'Cost Control',
    feature: 'Data Egress & Bandwidth Fees',
    publicCloud: 'Expensive ($0.08 - $0.12 / GB egress fee)',
    buildFromScratch: 'Free (Included in bare-metal line)',
    kubesailor: 'Zero fees (Unlimited internal & external pipe bandwidth)',
    explanation: 'Public cloud charges steep penalties whenever your apps stream video, big data, or analytics to users or S3 buckets.'
  },
  {
    category: 'Cost Control',
    feature: 'Managed Kubernetes Control Plane',
    publicCloud: '$73 - $150 / month per cluster base fee',
    buildFromScratch: 'Free but high maintenance effort',
    kubesailor: 'Free HA control planes built-in',
    explanation: 'Public cloud providers charge recurring hourly cluster management fees before you even add worker compute nodes.'
  },
  {
    category: 'Data Sovereignty',
    feature: 'Physical Infrastructure Control',
    publicCloud: 'Shared multi-tenant cloud datacenters',
    buildFromScratch: '100% Dedicated local servers',
    kubesailor: '100% Dedicated local servers or private colo',
    explanation: 'Guarantees compliance with strict jurisdiction, healthcare, finance, or government data sovereignty rules.'
  },
  {
    category: 'Platform Engineering',
    feature: 'Time to Production Readiness',
    publicCloud: '1-2 Months (IAM, VPC, Terraform, EKS setup)',
    buildFromScratch: '4-8 Months for experienced platform team',
    kubesailor: '1 Week (Fixed, tested blueprint)',
    explanation: 'Skip months of trial-and-error architecting networking, storage CSI, security, and GitOps pipelines from scratch.'
  },
  {
    category: 'Architecture',
    feature: 'Multi-Cluster Isolation',
    publicCloud: 'Expensive (Requires multiple VPCs/Accounts)',
    buildFromScratch: 'Hard to configure & keep consistent',
    kubesailor: 'Standard 3-Cluster (Admin, Workload, Storage)',
    explanation: 'Strict separation ensures CI builds or disk IOPS never starve production customer workloads.'
  },
  {
    category: 'Tooling',
    feature: 'GitOps, CI/CD, Registry & Security Included',
    publicCloud: 'SaaS Add-ons (GitHub Actions, ECR, Okta costs extra)',
    buildFromScratch: 'Must manually evaluate, configure & glue together',
    kubesailor: 'Pre-integrated (GitLab, Harbor, ArgoCD, Jenkins)',
    explanation: 'One coherent ecosystem where container scanning, image signing, and push-to-deploy work out of the box.'
  },
  {
    category: 'Observability',
    feature: 'Metrics, Logs & Distributed Traces',
    publicCloud: 'CloudWatch / Datadog ($$$ per GB log ingested)',
    buildFromScratch: 'Complex DIY Prometheus/Loki cluster setup',
    kubesailor: 'Unified Grafana + Thanos + Loki + Tempo + Alloy',
    explanation: 'Full-stack observability pre-configured with dashboards and alerts, without recurring SaaS bill spikes.'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Where can I run KubeSailor servers? Can I use bare-metal hosting providers?',
    answer: 'KubeSailor runs anywhere you can boot Ubuntu Server 24.04 LTS with raw disk access. You need a minimum of 19 servers (8 cores / 16 GB RAM for K8s nodes, 4 cores / 8 GB RAM for others). You can use your own owned hardware in a company rack/colocation center (Dell, HPE, Supermicro) OR bare-metal cloud providers like Hetzner, OVHcloud, Latitude.sh, Equinix Metal, or PhoenixNAP.'
  },
  {
    question: 'Why three separate clusters instead of one big Kubernetes cluster?',
    answer: 'Single-cluster setups blend build workloads, storage IOPS, and production user traffic together, creating noise, security leakage, and blast-radius risks. KubeSailor\'s multi-cluster blueprint enforces zero-trust boundaries: Admin (ArgoCD/Harbor/Monitoring), Workload (Jenkins/production pods), Storage (Rook-Ceph Block/S3), plus dedicated HA LB (HAProxy + Keepalived) and HA DNS (Bind9 + Keepalived) clusters. If a noisy developer pipeline runs, it can never crash your storage layer or degrade production customer traffic.'
  },
  {
    question: 'How do upgrades work? Will I be locked into a custom Kubernetes distribution?',
    answer: 'No custom forks! KubeSailor uses standard upstream CNCF-certified Kubernetes binaries via kubeadm on Ubuntu 24.04, configured via declarative shell scripts, Kubernetes manifests, and GitOps applications managed by ArgoCD. Upgrades are performed rolling-node by rolling-node via ArgoCD without downtime.'
  },
  {
    question: 'What happens if a physical server node dies?',
    answer: 'Every layer of KubeSailor is engineered for High Availability (HA). K8s control planes run 3-node etcd consensus with HAProxy + Keepalived VIP failover. The DNS cluster uses Bind9 + Keepalived with primary-secondary replication. The LB cluster uses HAProxy + Keepalived with Lsyncd config sync. Rook-Ceph replicates storage data 3x across physical machines. If any node dies, VIPs automatically migrate and services remain available.'
  },
  {
    question: 'Can our internal team maintain KubeSailor after setup?',
    answer: 'Yes! KubeSailor is designed to eliminate obscure platform engineering glue so a standard SysAdmin, DevOps engineer, or full-stack developer can maintain it. Because all state is held in Git (GitOps) and monitored via Grafana, day-2 operations like scaling worker nodes, adding namespaces, or rotating TLS certificates require simple git commits.'
  },
  {
    question: 'What is included in the KubeSailor product blueprint package?',
    answer: 'You receive the full open-architecture blueprint repository containing production shell scripts for server preparation, kubeadm HA cluster setup, Bind9 DNS configuration, HAProxy LB configuration, GitLab deployment, Istio service mesh manifests, Rook-Ceph storage profiles, ArgoCD app-of-apps manifests, Prometheus/Thanos/Grafana observability stack, Loki/Tempo/Alloy logging and tracing, Harbor registry, Jenkins CI/CD pipelines, and step-by-step operational deployment guides.'
  }
];
