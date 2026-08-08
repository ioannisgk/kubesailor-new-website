import React, { useState } from 'react';
import { TECH_STACK } from '../data/kubesailorData';
import { TechStackItem } from '../types';
import { Cpu, Network, Database, GitBranch, ShieldCheck, RefreshCw, Box, Activity, Terminal, CheckCircle2, Search, ArrowRight } from 'lucide-react';

interface TechStackGridProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ onOpenDemoModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Networking & Security', 'Distributed Storage', 'Developer Platform', 'Load Balancing & HA', 'GitOps Deployment', 'Observability'];

  const filteredStack = TECH_STACK.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whyChosen.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTechIcon = (icon: string) => {
    switch (icon) {
      case 'Network':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-teal-400" />;
      case 'Box':
        return <Box className="w-5 h-5 text-blue-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-amber-300" />;
      default:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="techstack" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Best-in-Class Open Cloud Native Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Battle-Tested CNCF Infrastructure,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Zero Proprietary Locks
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Every layer of KubeSailor is built on standard, open-source CNCF projects. Your engineering team gets modern developer experience without per-user licensing or custom proprietary vendor lock-in.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search stack components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredStack.map((item) => (
            <div
              key={item.name}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {getTechIcon(item.icon)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white font-mono">{item.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{item.role}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
                  <span className="text-slate-300 font-semibold block mb-1 font-mono text-[11px]">Why it's in KubeSailor:</span>
                  {item.whyChosen}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CNCF Standard</span>
                </div>
                <span>GitOps Managed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-white text-base font-mono">
              Need custom integrations (S3 storage, LDAP, Grafana targets, Ceph RGW)?
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl">
              KubeSailor blueprints use modular shell scripts & Kubernetes manifest patterns. You can swap or extend any component in the stack with simple Git commits.
            </p>
          </div>
          <button
            onClick={() => onOpenDemoModal('Custom Tooling & Stack Architecture')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Ask Infrastructure Team</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
