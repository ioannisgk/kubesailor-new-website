import React, { useState } from 'react';
import { CLUSTERS } from '../data/kubesailorData';
import { ClusterType, ClusterComponent } from '../types';
import {
  Shield,
  Cpu,
  HardDrive,
  CheckCircle2,
  GitBranch,
  Box,
  ShieldCheck,
  RefreshCw,
  Lock,
  Network,
  Globe,
  Activity,
  Database,
  Server,
  Terminal,
  ArrowRight,
  Info,
  Sliders,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClusterArchitectureSectionProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const ClusterArchitectureSection: React.FC<ClusterArchitectureSectionProps> = ({ onOpenDemoModal }) => {
  const [activeClusterId, setActiveClusterId] = useState<ClusterType>('admin');
  const [selectedComponent, setSelectedComponent] = useState<ClusterComponent | null>(null);
  const [diagramView, setDiagramView] = useState<'architecture' | 'traffic' | 'gitops'>('architecture');

  const activeCluster = CLUSTERS.find((c) => c.id === activeClusterId) || CLUSTERS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-cyan-400" />;
      case 'Box':
        return <Box className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-teal-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-cyan-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-teal-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'HardDrive':
        return <HardDrive className="w-5 h-5 text-orange-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="architecture" className="py-24 bg-slate-900/60 border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-medium">
            <Layers className="w-3.5 h-3.5" />
            <span>3 Purpose-Built Clusters Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Separation of Concerns for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Zero Blast-Radius & Maximum HA
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Standardizing on three dedicated clusters isolates heavy developer CI builds and storage IOPS from production customer traffic. If a build pipeline breaks, customer apps stay 100% online.
          </p>
        </div>

        {/* Cluster Tabs Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {CLUSTERS.map((cluster) => {
            const isActive = cluster.id === activeClusterId;
            const clusterIcon =
              cluster.id === 'admin' ? (
                <Shield className="w-4 h-4" />
              ) : cluster.id === 'workload' ? (
                <Cpu className="w-4 h-4" />
              ) : (
                <HardDrive className="w-4 h-4" />
              );

            return (
              <button
                key={cluster.id}
                onClick={() => {
                  setActiveClusterId(cluster.id);
                  setSelectedComponent(null);
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-mono font-semibold transition-all flex items-center gap-2.5 cursor-pointer border ${
                  isActive
                    ? 'bg-slate-950 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {clusterIcon}
                </div>
                <span>{cluster.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {cluster.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Cluster Overview Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCluster.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Gradient */}
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${activeCluster.accentColor} opacity-10 blur-3xl pointer-events-none`} />

            {/* Cluster Top Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono">
                    {activeCluster.role}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white font-mono">{activeCluster.title}</h3>
                <p className="text-slate-400 text-sm">{activeCluster.summary}</p>
              </div>

              {/* Hardware Specs pill */}
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 shrink-0 w-full lg:w-auto">
                <div className="text-cyan-400 font-semibold flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" />
                  <span>Specs: {activeCluster.recommendedNodes}</span>
                </div>
                <div className="text-slate-400 text-[11px]">Min Hardware: {activeCluster.minSpecs}</div>
              </div>
            </div>

            {/* View Mode Toggle: Architecture vs Traffic Flow vs GitOps */}
            <div className="py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Diagram Layer:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDiagramView('architecture')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    diagramView === 'architecture'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Components
                </button>
                <button
                  onClick={() => setDiagramView('traffic')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    diagramView === 'traffic'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Traffic Flow
                </button>
                <button
                  onClick={() => setDiagramView('gitops')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    diagramView === 'gitops'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  GitOps Loop
                </button>
              </div>
            </div>

            {/* Visual Flow / Architectural Map */}
            {diagramView === 'traffic' && (
              <div className="my-6 p-4 rounded-2xl bg-slate-900/90 border border-cyan-900/40 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
                  <Globe className="w-4 h-4" />
                  <span>Incoming Ingress & Istio Ambient Mesh Routing</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Client Request</p>
                    <p className="font-bold text-white mt-1">External HTTPS / VIP</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-cyan-900/60 text-cyan-300">
                    <p className="text-slate-400 text-[10px]">L2 Keepalived VIP</p>
                    <p className="font-bold mt-1">HAProxy + Keepalived</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 text-emerald-300">
                    <p className="text-slate-400 text-[10px]">Sidecarless Mesh</p>
                    <p className="font-bold mt-1">Istio Ambient Mode</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-900/60 text-amber-300">
                    <p className="text-slate-400 text-[10px]">Persistent Storage</p>
                    <p className="font-bold mt-1">Rook-Ceph NVMe PVC</p>
                  </div>
                </div>
              </div>
            )}

            {diagramView === 'gitops' && (
              <div className="my-6 p-4 rounded-2xl bg-slate-900/90 border border-teal-900/40 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold border-b border-slate-800 pb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Declarative Push-To-Deploy GitOps Engine</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px]">1. Git Commit</p>
                    <p className="font-bold text-white mt-1">GitLab CE Repository</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-blue-900/60 text-blue-300">
                    <p className="text-slate-400 text-[10px]">2. OCI Image Build</p>
                    <p className="font-bold mt-1">Harbor + Trivy Scan</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-teal-900/60 text-teal-300">
                    <p className="text-slate-400 text-[10px]">3. Drift Sync</p>
                    <p className="font-bold mt-1">ArgoCD Reconciliation</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 text-emerald-300">
                    <p className="text-slate-400 text-[10px]">4. Production State</p>
                    <p className="font-bold mt-1">Rolling Pod Update</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6">
              {activeCluster.keyBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Components Grid */}
            <div className="mt-8">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Pre-Configured Components in {activeCluster.title}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCluster.components.map((comp) => {
                  const isSelected = selectedComponent?.name === comp.name;

                  return (
                    <div
                      key={comp.name}
                      onClick={() => setSelectedComponent(isSelected ? null : comp)}
                      className={`p-4 rounded-2xl bg-slate-900/80 border transition-all cursor-pointer group hover:bg-slate-900 ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20 bg-slate-900'
                          : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                            {getIcon(comp.iconName)}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white font-mono">{comp.name}</h5>
                            <span className="text-[10px] text-cyan-400 font-mono">{comp.tech}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {comp.status === 'ha-configured' ? '3x HA' : 'PROD'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-3 line-clamp-2">{comp.description}</p>

                      {/* Component Details List */}
                      <ul className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300 font-mono">
                        {comp.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>All components defined via GitOps manifests & production shell scripts.</span>
              </div>
              <button
                onClick={() =>
                  onOpenDemoModal(
                    `${activeCluster.title} Blueprint`,
                    `I am interested in the ${activeCluster.title} specification and cluster setup details.`
                  )
                }
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Request {activeCluster.id.toUpperCase()} Cluster Yaml</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
