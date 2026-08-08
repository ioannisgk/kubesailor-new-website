import React, { useState } from 'react';
import { BUILD_STEPS } from '../data/kubesailorData';
import { Calendar, Clock, CheckCircle2, Terminal, Copy, Check, ArrowRight, ShieldCheck, Play, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlueprintSequenceProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
  onOpenTerminal: () => void;
}

export const BlueprintSequence: React.FC<BlueprintSequenceProps> = ({ onOpenDemoModal, onOpenTerminal }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const currentStep = BUILD_STEPS.find((s) => s.day === activeDay) || BUILD_STEPS[0];

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="blueprint" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fixed, Ordered 1-Week Build Sequence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Raw Bare-Metal to Production Private Cloud in{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              1 Structured Week
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Eliminate months of trial-and-error platform engineering. Follow our battle-tested, numbered deployment sequence to stand up HA networking, storage, GitOps, and observability.
          </p>
        </div>

        {/* 1-Week Timeline Bar */}
        <div className="mt-12 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center justify-between min-w-[700px] border-b border-slate-800 pb-4">
            {BUILD_STEPS.map((step) => {
              const isActive = step.day === activeDay;
              return (
                <button
                  key={step.day}
                  onClick={() => setActiveDay(step.day)}
                  className={`flex flex-col items-center gap-2 relative group cursor-pointer px-3 transition-all ${
                    isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    D{step.day}
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold max-w-[100px] text-center truncate ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    Day {step.day}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans hidden sm:inline truncate max-w-[90px]">
                    {step.title.split(' ')[0]}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeDayIndicator"
                      className="absolute -bottom-[17px] w-full h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Details View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Summary, Tasks & Checklist (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono">
                      DAY {currentStep.day} OF 7
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {currentStep.estimatedHours}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-mono">{currentStep.title}</h3>
                  <p className="text-xs text-slate-400 font-sans">{currentStep.subtitle}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{currentStep.summary}</p>

              {/* Tasks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Key Tasks to Execute on Day {currentStep.day}:
                </h4>
                <div className="space-y-2">
                  {currentStep.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px]">
                        {tIdx + 1}
                      </div>
                      <span className="pt-0.5">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verification Checkpoint:</span>
                </div>
                <p className="text-xs text-slate-300 pl-6 font-mono">{currentStep.verificationCheck}</p>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Progress:</span>
                  <div className="w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${(currentStep.day / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 font-bold">{Math.round((currentStep.day / 7) * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  {currentStep.day < 7 ? (
                    <button
                      onClick={() => setActiveDay(currentStep.day + 1)}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Day {currentStep.day + 1} Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenDemoModal('Complete 1-Week Blueprint Package')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all cursor-pointer"
                    >
                      <span>Request Full Blueprint Repo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive CLI & Output Terminal Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Terminal Box */}
              <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full">
                {/* Terminal Header Bar */}
                <div className="p-3 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 pl-2">
                      kubesailor-cli — Day {currentStep.day}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopySnippet(currentStep.cliSnippet)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                    title="Copy command"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Snippet Box */}
                <div className="p-4 bg-slate-900/60 border-b border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{currentStep.cliSnippet}</pre>
                </div>

                {/* Simulated Output Log Area */}
                <div className="p-4 font-mono text-xs text-slate-300 bg-slate-950 space-y-2 flex-1 overflow-y-auto max-h-[300px]">
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-900">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Verification Output Preview:</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed text-[11px]">
                    {currentStep.outputPreview}
                  </pre>
                </div>

                {/* Terminal Footer Action */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Interactive CLI simulator ready</span>
                  <button
                    onClick={onOpenTerminal}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run in Web Shell</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
