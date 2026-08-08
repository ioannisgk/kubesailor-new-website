import React, { useState } from 'react';
import { ReadinessQuizAnswers } from '../types';
import { ShieldCheck, Server, ArrowRight, RefreshCw, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReadinessAssessmentProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const ReadinessAssessment: React.FC<ReadinessAssessmentProps> = ({ onOpenDemoModal }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<ReadinessQuizAnswers>({
    serverLocation: 'hetzner-ovh',
    serverCount: '6-15',
    monthlyCloudBill: '5k-20k',
    primaryMotivation: 'cost-reduction',
    inHouseK8sExperience: 'moderate',
    complianceNeeds: [],
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const handleReset = () => setStep(1);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive Assessment</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Are You Ready for Your Own Private Cloud?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Take 30 seconds to answer 4 quick questions about your current infrastructure scale and goals to receive a tailored KubeSailor deployment report.
          </p>
        </div>

        {/* Assessment Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Progress Indicator */}
          {step <= 4 && (
            <div className="mb-8 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-400 font-bold">Question {step} of 4</span>
                <span className="text-slate-500">{step * 25}% Completed</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Server Location */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-white font-mono">
                  1. Where do you plan to run or host your bare-metal servers?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'hetzner-ovh', title: 'Bare-Metal Hosting', desc: 'Hetzner, OVHcloud, Latitude.sh, Equinix' },
                    { id: 'colo-rack', title: 'Colocation Rack', desc: 'Leased rack space in Equinix / Digital Realty' },
                    { id: 'on-prem', title: 'On-Premises Office/DC', desc: 'Company owned server racks & hardware' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, serverLocation: opt.id });
                        handleNext();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        answers.serverLocation === opt.id
                          ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white font-mono">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Server Count */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-white font-mono">
                  2. How many physical server machines or nodes will be in your pool?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: '3-6', title: '3 to 6 Servers', desc: 'Initial Startup HA Cluster Setup' },
                    { id: '6-15', title: '6 to 15 Servers', desc: 'Recommended Standard 3-Cluster Blueprint' },
                    { id: '15-50+', title: '15+ Servers', desc: 'Scale-up High Volume Production Fleet' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, serverCount: opt.id });
                        handleNext();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        answers.serverCount === opt.id
                          ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white font-mono">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Monthly Cloud Bill */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-white font-mono">
                  3. What is your current monthly public cloud bill (AWS/GCP/Azure)?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: '2k-5k', title: '$2,000 - $5,000 / mo', desc: 'Early stage startup spend' },
                    { id: '5k-20k', title: '$5,000 - $20,000 / mo', desc: 'Growing scale-up cloud bill' },
                    { id: '20k-100k+', title: '$20,000+ / mo', desc: 'Heavy compute & egress cost pain' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, monthlyCloudBill: opt.id });
                        handleNext();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        answers.monthlyCloudBill === opt.id
                          ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white font-mono">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Primary Motivation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-white font-mono">
                  4. What is your primary business driver for building a private cloud?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'cost-reduction', title: 'Cost Reduction', desc: 'Cut infrastructure spend by 60-80%' },
                    { id: 'sovereignty', title: 'Data Sovereignty', desc: 'Compliance, GDPR, HIPAA, Local Hosting' },
                    { id: 'platform-control', title: 'Platform Control', desc: 'Predictable IOPS, no noisy neighbors' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, primaryMotivation: opt.id });
                        handleNext();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        answers.primaryMotivation === opt.id
                          ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white font-mono">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Generated Tailored Report */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-white font-mono text-sm">
                        KubeSailor Readiness Report Generated
                      </h3>
                      <p className="text-xs text-cyan-300">
                        Tailored for {answers.serverCount} servers on {answers.serverLocation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">RECOMMENDED BLUEPRINT</span>
                    <p className="font-bold text-cyan-400 text-sm">3-Cluster HA Blueprint</p>
                    <p className="text-slate-400 text-[11px]">Admin + Workload + Storage</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">ESTIMATED DEPLOYMENT</span>
                    <p className="font-bold text-emerald-400 text-sm">7 Business Days</p>
                    <p className="text-slate-400 text-[11px]">Fixed sequence handover</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">ESTIMATED ROI SAVINGS</span>
                    <p className="font-bold text-amber-400 text-sm">~$3,500 - $12,000 / mo</p>
                    <p className="text-slate-400 text-[11px]">Zero egress / control plane fees</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <span className="font-bold text-cyan-400 font-mono">Platform Summary & Next Steps:</span>
                  <p className="leading-relaxed">
                    Based on your profile, running KubeSailor on {answers.serverLocation} servers will eliminate your public cloud management tax while providing 100% data sovereignty.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      onOpenDemoModal(
                        'Readiness Report Follow-up',
                        `I completed the readiness quiz: ${answers.serverCount} servers on ${answers.serverLocation}, currently spending ${answers.monthlyCloudBill}/mo. Please send the tailored architecture package.`
                      )
                    }
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Receive Tailored Architecture PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls for quiz */}
          {step <= 4 && (
            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`px-3 py-1.5 rounded-lg border border-slate-800 ${
                  step === 1 ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer"
              >
                Skip / Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
