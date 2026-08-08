import React, { useState } from 'react';
import { ArrowRight, Shield, Server, CheckCircle2, Copy, Check, Terminal, Zap, HardDrive, Cpu, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
  onOpenTerminal: () => void;
  onScrollToBlueprint: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemoModal, onOpenTerminal, onScrollToBlueprint }) => {
  const [copied, setCopied] = useState(false);
  const quickInstallCmd = 'curl -fsSL https://get.kubesailor.io/bootstrap.sh | bash';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(quickInstallCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950">
      {/* Background Radial Glow & Grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 shadow-lg shadow-cyan-950/40 text-cyan-300 text-xs font-mono font-medium"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 absolute" />
            <span className="pl-3">Production-Grade Bare Metal Blueprint v2.4</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-sans">Zero Cloud Lock-in</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Your own private cloud.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Live in 1 week.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans"
          >
            A Multi-Cluster Private Cloud Platform, deployed on your own servers — three purpose-built Kubernetes clusters with HA, GitOps, observability, and CI/CD already built in.
          </motion.p>

          {/* Key Value Prop Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-300 pt-1"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Save 60-80% vs EKS/GKE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>100% Data Sovereignty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>3 Dedicated HA Clusters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero Vendor Lock-in</span>
            </div>
          </motion.div>

          {/* CTA Buttons & Shell Command Snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            <button
              onClick={() => onOpenDemoModal('Blueprint & Architecture Package', 'I would like to receive the full KubeSailor private cloud blueprint package and schedule an architecture review.')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get KubeSailor Blueprint</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onScrollToBlueprint}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 font-mono text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>1-Week Build Sequence ↓</span>
            </button>

          </motion.div>

          {/* Terminal Command Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="pt-2 max-w-xl mx-auto"
          >
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-2.5 px-3.5 flex items-center justify-between gap-3 shadow-2xl font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="text-cyan-400 font-bold">$</span>
                <span className="text-slate-200 truncate">{quickInstallCmd}</span>
              </div>
              <button
                onClick={handleCopyCmd}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
              Runs pre-flight hardware, network & disk health diagnostics on your servers.
            </p>
          </motion.div>
        </div>

        {/* 3 Clusters Visual Interactive Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 relative max-w-5xl mx-auto"
        >
          {/* Card Wrapper */}
          <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

            {/* Header bar of visual */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
                  topology-status: <span className="text-emerald-400 font-semibold">3 CLUSTERS HEALTHY (HA)</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  <Server className="w-3 h-3" /> Bare Metal Hardware
                </span>
                <span className="text-slate-600">•</span>
                <span>Keepalived VIP Failover</span>
              </div>
            </div>

            {/* 3 Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {/* Cluster 1: Admin */}
              <div className="rounded-xl bg-slate-950/80 border border-blue-900/40 p-4 hover:border-blue-500/60 transition-all group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">ADMIN CLUSTER</h3>
                      <p className="text-[10px] text-slate-400">Management & Control</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                    3 HA Nodes
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Prometheus + Thanos + Grafana</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>GitLab CE + Jenkins</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Harbor OCI + ArgoCD</span>
                  </li>
                </ul>
              </div>

              {/* Cluster 2: Workload */}
              <div className="rounded-xl bg-slate-950/80 border border-emerald-900/40 p-4 hover:border-emerald-500/60 transition-all group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">WORKLOAD CLUSTER</h3>
                      <p className="text-[10px] text-slate-400">Production App Compute</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                    Auto-scaling
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Istio Ambient Mode</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Istio Gateway + TLS</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>HAProxy + Keepalived</span>
                  </li>
                </ul>
              </div>

              {/* Cluster 3: Storage */}
              <div className="rounded-xl bg-slate-950/80 border border-amber-900/40 p-4 hover:border-amber-500/60 transition-all group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">STORAGE CLUSTER</h3>
                      <p className="text-[10px] text-slate-400">Distributed NVMe & S3</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                    Rook-Ceph HA
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Ceph Block (RWO / NVMe)</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>S3 Object Gateway (RGW)</span>
                  </li>
                  <li className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>GitLab Backup System</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Zero single points of failure. Tested against multi-node outages.</span>
              </div>
              <div className="text-cyan-400 font-semibold">
                Time-to-Deploy: <span className="text-white">1 Week</span> (vs 6 Months custom)
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
