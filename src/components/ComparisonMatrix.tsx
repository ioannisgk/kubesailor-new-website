import React, { useState } from 'react';
import { COMPARISON_DATA } from '../data/kubesailorData';
import { Shield, Check, X, HelpCircle, ArrowRight, Zap } from 'lucide-react';

interface ComparisonMatrixProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ onOpenDemoModal }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <section id="comparison" className="py-24 bg-slate-900/60 border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Side-by-Side Trade-off Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How KubeSailor Compares to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Public Cloud & DIY
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Evaluate the real trade-offs between public cloud spend, months of custom platform engineering, and KubeSailor’s 1-week productized bare-metal private cloud.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono">
                <th className="p-4 pl-6 text-slate-400 uppercase tracking-wider w-1/4">Feature / Dimension</th>
                <th className="p-4 text-slate-400 uppercase tracking-wider w-1/4">Public Cloud (EKS/GKE)</th>
                <th className="p-4 text-slate-400 uppercase tracking-wider w-1/4">DIY Build From Scratch</th>
                <th className="p-4 pr-6 text-cyan-400 uppercase tracking-wider w-1/4 bg-cyan-950/40 border-l border-cyan-800/50">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>KubeSailor Blueprint</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  {/* Feature & Tooltip */}
                  <td className="p-4 pl-6 font-semibold text-white">
                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-400 block">{row.category}</span>
                      <span className="flex items-center gap-1.5 text-sm font-sans font-bold">
                        {row.feature}
                        <button
                          onClick={() => setActiveTooltip(activeTooltip === row.feature ? null : row.feature)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="View trade-off details"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </span>
                      {activeTooltip === row.feature && (
                        <p className="text-[11px] text-slate-400 font-sans font-normal bg-slate-900 p-2 rounded-lg border border-slate-800">
                          {row.explanation}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Public Cloud */}
                  <td className="p-4 text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="p-0.5 rounded bg-rose-950 text-rose-400 shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </span>
                      <span>{row.publicCloud}</span>
                    </div>
                  </td>

                  {/* Build From Scratch */}
                  <td className="p-4 text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="p-0.5 rounded bg-amber-950 text-amber-400 shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </span>
                      <span>{row.buildFromScratch}</span>
                    </div>
                  </td>

                  {/* KubeSailor */}
                  <td className="p-4 pr-6 bg-cyan-950/20 border-l border-cyan-800/50 text-emerald-300 font-semibold">
                    <div className="flex items-start gap-2">
                      <span className="p-0.5 rounded bg-emerald-950 text-emerald-400 shrink-0 mt-0.5 border border-emerald-800">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{row.kubesailor}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onOpenDemoModal('Comparison & Migration Architecture Review')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-semibold shadow-xl shadow-cyan-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Evaluate KubeSailor for Your Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
