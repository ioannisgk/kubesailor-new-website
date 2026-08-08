import React from 'react';
import { Sparkles, DollarSign, BookOpen, GraduationCap, Headphones, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WhitelabelSectionProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const WhitelabelSection: React.FC<WhitelabelSectionProps> = ({ onOpenDemoModal }) => {
  const unlocks = [
    {
      icon: DollarSign,
      title: "Resell KubeSailor as your own offering",
      description: "Deploy the same production-grade, multi-cluster private cloud platform for your own clients, under your own brand and pricing — without paying the €55,000–€65,000 Setup fee per client, and without building the underlying platform engineering yourself.",
      highlight: "Zero per-client royalties",
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400"
    },
    {
      icon: BookOpen,
      title: "Build and sell training material",
      description: "With full access to the source code and an in-depth workshop on how every piece works, you can create your own documentation, guides, and reference material — and package it as a paid resource for engineers who want to learn multi-cluster Kubernetes, GitOps, and private cloud architecture the way KubeSailor implements it.",
      highlight: "Custom branded IP docs",
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400"
    },
    {
      icon: GraduationCap,
      title: "Launch training courses",
      description: "Turn the workshop content into structured courses — live cohorts, recorded video training, or certification-style programs — for engineering teams who want to build this competency in-house. The architecture itself, spanning HA networking, GitOps, service mesh, distributed storage, and full-stack observability, is substantial enough to support a genuine curriculum, not just a single webinar.",
      highlight: "Complete curriculum base",
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400"
    },
    {
      icon: Headphones,
      title: "Offer ongoing support as a service",
      description: "Position yourself as the go-to support and operations partner for any client running KubeSailor — whether they bought it through you or came to you afterward looking for expertise. You set the terms, the pricing, and the scope.",
      highlight: "Recurring SLA revenue",
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400"
    },
    {
      icon: Wrench,
      title: "Extend and customize freely",
      description: "Because you hold the source, you're not limited to the platform as delivered — adapt it for specific verticals (e.g. a compliance-heavy variant for fintech, a leaner variant for smaller teams), and offer those as differentiated products of your own.",
      highlight: "Unrestricted source modification",
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400"
    },
    {
      icon: ShieldCheck,
      title: "One-time cost, unlimited internal use",
      description: "The €750,000 (+VAT) price is a single transfer of the underlying IP — not a per-deployment or per-client license. Every deployment, course, or support contract you build on top of it after that is yours to monetize without paying KubeSailor again.",
      highlight: "Single IP buyout fee",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
    }
  ];

  return (
    <section id="whitelabel" class="py-24 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      {/* Background Accent Lights */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-mono shadow-inner">
            <Sparkles class="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Full Business IP Acquisition</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight leading-tight">
            Whitelabel — <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Own the Platform</span>, Build a Business On It
          </h2>

          <p class="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            The Whitelabel tier isn't a bigger version of the Setup engagement — it's a different kind of purchase entirely. Instead of KubeSailor being built once for your infrastructure, you receive the complete source code and the knowledge to run it yourself, indefinitely, for as many clients as you choose.
          </p>
        </div>

        <!-- 6 Unlocks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {unlocks.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                class="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group backdrop-blur-xl"
              >
                <div>
                  <div class="flex items-center justify-between mb-5">
                    <div class={`p-3 rounded-2xl bg-gradient-to-br ${item.color} border shadow-lg`}>
                      <IconComponent class="w-6 h-6" />
                    </div>
                    <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                      {item.highlight}
                    </span>
                  </div>

                  <h3 class="text-lg font-bold text-white font-mono mb-3 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p class="text-xs text-slate-300 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div class="pt-5 mt-5 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <CheckCircle2 class="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Included in €750,000 + VAT IP License</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div class="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div class="space-y-3 max-w-3xl">
              <div class="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Sparkles class="w-4 h-4" />
                <span>THE STRATEGIC CATEGORY SHIFT</span>
              </div>
              <p class="text-base sm:text-lg font-semibold text-slate-100 font-sans leading-relaxed">
                In short: the Whitelabel tier turns KubeSailor from <span class="text-white underline decoration-amber-400/80 decoration-2 underline-offset-4">"a platform we bought"</span> into <span class="text-amber-300 font-bold underline decoration-amber-400 underline-offset-4">"a product line we run"</span> — the same category of decision as licensing a franchise or acquiring a productized service, not a larger consulting invoice.
              </p>
            </div>

            <button
              onClick={() => onOpenDemoModal('Whitelabel & IP License', 'Interested in acquiring full Whitelabel & IP License (€750,000 + VAT).')}
              class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-bold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <span>Inquire About IP License</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
