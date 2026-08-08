import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Play, Copy, Check, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

interface CommandLog {
  cmd: string;
  output: string;
  type?: 'input' | 'system' | 'success' | 'error';
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ isOpen, onClose, onOpenDemoModal }) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<CommandLog[]>([
    {
      cmd: 'kubesailor --version',
      output: 'KubeSailor CLI v2.4.0 (Multi-Cluster Bare-Metal Private Cloud Blueprint)\nType "help" or click a command preset below to test KubeSailor.',
      type: 'system',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const handleRunCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let output = '';
    let type: CommandLog['type'] = 'system';

    switch (trimmed.toLowerCase()) {
      case 'help':
        output = `Available KubeSailor CLI Commands:
  • kubesailor status           - View live HA health of Admin, Workload & Storage clusters
  • kubesailor check-hardware    - Run Linux kernel, raw disk & network pre-flight diagnostics
  • kubesailor deploy           - Simulate GitOps app push-to-deploy sync via ArgoCD
  • kubesailor storage-health    - Check Rook-Ceph NVMe block pool & S3 gateway health
  • kubesailor test-ha           - Simulate physical server node crash & auto-healing
  • kubesailor cost-summary      - View bare-metal vs EKS/GKE financial savings
  • clear                        - Clear terminal output`;
        break;

      case 'kubesailor status':
        output = `[CLUSTER STATUS REPORT]
--------------------------------------------------
1. ADMIN CLUSTER [kubeadm HA]
   - Status: HEALTHY | Nodes: admin-cp-01, admin-cp-02, admin-cp-03 (etcd quorum)
   - GitLab CE: LIVE (https://gitlab.homelab.internal)
   - Harbor Registry: READY (Cosign signing active)
   - ArgoCD Controller: SYNCED (0 drift)

2. WORKLOAD CLUSTER [kubeadm Production]
   - Status: HEALTHY | Workers: 3 Nodes Active
   - Service Mesh: Istio Ambient Mode (Gateway API routing)
   - Ingress: HAProxy + Keepalived LB Cluster (VIP: 192.168.159.100)
   - CI/CD: Jenkins + Cosign + Harbor pipeline

3. STORAGE CLUSTER [Rook-Ceph HA]
   - Status: HEALTH_OK | OSDs: 3 Drives Active
   - Triple Replication: ACTIVE
   - S3 Gateway: LIVE (Ceph RGW for Thanos/Loki/Tempo)`;
        type = 'success';
        break;

      case 'kubesailor check-hardware':
        output = `[PRE-FLIGHT HARDWARE DIAGNOSTICS]
[+] Scanning 19 Bare-Metal Ubuntu 24.04 LTS Nodes...
[OK] Node CPU: AMD EPYC 7003 / Intel Xeon Gold detected
[OK] Kernel: Linux 6.8.0-31-generic (Ubuntu 24.04 LTS)
[OK] Disk Health: Raw drives detected and ready for Rook-Ceph
[OK] Inter-Node Latency: 0.14ms avg across L2 network
[SUCCESS] Hardware & network verified for KubeSailor 1 Week Blueprint.`;
        type = 'success';
        break;

      case 'kubesailor deploy':
        output = `[GITOPS PUSH-TO-DEPLOY SIMULATION]
[+] Pushing commit 'feat: payments-v2' to https://gitlab.homelab.internal/app/payments
[+] Triggering Jenkins CI/CD pipeline...
[+] Building OCI Image: harbor.admin.homelab.internal/workload-project/payments:v2.4
[+] Cosign Image Signing: Signed with cosign private key
[+] ArgoCD Sync: Applied 4 Kubernetes Manifests to Workload Cluster
[+] Istio Gateway: Rolling update complete (Zero dropped packets)
[SUCCESS] Application 'payments-v2' live in production!`;
        type = 'success';
        break;

      case 'kubesailor storage-health':
        output = `[ROOK-CEPH STORAGE CLUSTER HEALTH]
  cluster:
    id:     a7f20194-019d-4318 border-amber-500
    health: HEALTH_OK
  services:
    mon: 3 in quorum (admin-01, storage-01, storage-02)
    mgr: active (storage-01)
    osd: 9 osds: 9 up, 9 in
  data:
    pools:   3 pools, 96 pgs
    objects: 1.42M objects, 3.82 TiB
    usage:   3.82 TiB used, 12.00 TiB total
    io:      2.41 KiB/s rd, 1.18 MiB/s wr, 412 op/s
[SUCCESS] Ceph S3 Object Gateway & Block CSI drivers operating nominally.`;
        type = 'success';
        break;

      case 'kubesailor test-ha':
        output = `[HIGH AVAILABILITY & DISASTER RECOVERY SIMULATION]
[!] Simulating unexpected power outage on node 'workload-worker-01'...
[+] HAProxy LB: Health check detected node down, traffic rerouted in 1.2s
[+] Istio Mesh: Re-routed L7 traffic to remaining worker nodes
[+] Rook-Ceph: Persistent volume failover mounted in 8.4s
[+] Pod Restarts: 0 customer requests dropped!
[SUCCESS] High Availability test passed with zero downtime.`;
        type = 'success';
        break;

      case 'kubesailor cost-summary':
        output = `[FINANCIAL COST DIFFERENTIAL SUMMARY]
Bare Metal (19 Nodes + KubeSailor): $3,475 / month
Public Cloud (19 EKS EC2 + Egress + S3 + Control Plane): $11,200 / month
--------------------------------------------------
MONTHLY SAVINGS: $7,725 / month (69.0% ROI)
ANNUAL SAVINGS: $92,700 / year`;
        type = 'success';
        break;

      default:
        output = `Command not recognized: "${trimmed}". Type "help" for available commands.`;
        type = 'error';
    }

    setHistory((prev) => [
      ...prev,
      { cmd: trimmed, output: '', type: 'input' },
      { cmd: '', output, type },
    ]);

    setInputVal('');
  };

  const presetCmds = [
    'kubesailor status',
    'kubesailor check-hardware',
    'kubesailor deploy',
    'kubesailor storage-health',
    'kubesailor test-ha',
    'kubesailor cost-summary',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono">KubeSailor CLI Shell Simulator</h3>
              <p className="text-[11px] text-slate-400 font-mono">Test live multi-cluster operations in interactive sandbox</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDemoModal('CLI Sandbox Technical Followup')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all hidden sm:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Full CLI Repo</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Buttons Bar */}
        <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-500 px-2">Presets:</span>
          {presetCmds.map((preset) => (
            <button
              key={preset}
              onClick={() => handleRunCommand(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-[11px] font-mono transition-all hover:border-cyan-500/50 cursor-pointer flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5 text-cyan-400" />
              <span>{preset.replace('kubesailor ', '')}</span>
            </button>
          ))}
        </div>

        {/* Output Window */}
        <div className="p-6 bg-slate-950 font-mono text-xs text-slate-200 overflow-y-auto flex-1 space-y-4">
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.type === 'input' ? (
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span>root@kubesailor-admin:~#</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
              ) : (
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${
                    item.type === 'success'
                      ? 'text-emerald-300'
                      : item.type === 'error'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  {item.output}
                </pre>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunCommand(inputVal);
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <span className="text-cyan-400 font-mono font-bold text-xs pl-2 shrink-0">root@kubesailor-admin:~#</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' or command..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
