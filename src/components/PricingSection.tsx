import React from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Building2, HelpCircle, ArrowRight, Clock, Award, Server } from 'lucide-react';

interface PricingSectionProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenDemoModal }) => {
  const tiers = [
    {
      id: 'private-cloud-platform',
      name: 'Private Cloud Platform',
      badge: '1-Week Deployment',
      price: '€55,000',
      period: 'one-time fee',
      description: 'Turnkey setup on your client servers within 1 week by experienced Kubernetes architects.',
      popular: false,
      features: [
        'Complete setup on client servers within 1 week',
        '3-Cluster Architecture (Admin, Compute, Rook-Ceph Storage)',
        'Istio Ambient service mesh & Ubuntu 24.04 LTS nodes',
        'Production shell scripts & GitOps deployment pipeline',
        'Turnkey cluster handoff documentation & operational guides',
        'Post-deployment cluster validation & security audit',
      ],
      cta: 'Request Private Cloud Platform',
      icon: Server,
      iconBoxColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800',
      borderColor: 'border-slate-800 hover:border-cyan-500/50',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'private-cloud-platform-plus',
      name: 'Private Cloud Platform +',
      badge: 'Most Popular Choice',
      price: '€65,000',
      period: 'one-time fee',
      description: 'Complete 1-week setup plus 30 days of dedicated engineering support and SLA coverage.',
      popular: true,
      features: [
        'Everything included in Private Cloud Platform',
        '1 Month of dedicated post-launch technical support',
        'Direct Slack / Microsoft Teams channel with senior engineers',
        'Guaranteed 1-hour priority incident response SLA',
        'Cluster upgrade & security patch maintenance guidance',
        'Performance tuning & DR backup drill simulation',
      ],
      cta: 'Request Platform +',
      icon: Zap,
      iconBoxColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800',
      borderColor: 'border-cyan-500/80 shadow-2xl shadow-cyan-500/10',
      badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold',
    },
    {
      id: 'whitelabel',
      name: 'Whitelabel & IP License',
      badge: 'Full Business IP Transfer',
      price: '€750,000',
      period: 'one-time fee',
      description: 'Complete source code delivery + workshop. Re-sell to clients, train teams, or offer managed services.',
      popular: false,
      features: [
        'Full source code repository delivery (Shell scripts, Manifests, Repos)',
        'Interactive engineering workshop & deep architectural walkthrough',
        'Unrestricted commercial right to re-sell to your own clients',
        'Right to build proprietary training materials & certifications',
        'Right to offer white-label managed cloud services to third parties',
        '100% IP ownership transfer with zero recurring royalty fees',
      ],
      cta: 'Request Whitelabel Package',
      icon: Sparkles,
      iconBoxColor: 'bg-amber-950 text-amber-400 border border-amber-800',
      borderColor: 'border-amber-500/50 hover:border-amber-400',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Transparent Service Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Transparent Engineering{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Pricing Tiers
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed font-sans">
            Choose the package that best aligns with your infrastructure roadmap — from rapid 1-week client server deployment to complete whitelabel business IP acquisition.
          </p>

          {/* VAT Disclaimer Banner */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-amber-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Note:</strong> All listed prices exclude VAT. Standard EU/International B2B reverse charge rules apply.</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <div
                key={tier.id}
                className={`relative bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${tier.borderColor} ${
                  tier.popular ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 ring-1 ring-cyan-500/50' : ''
                }`}
              >
                {/* Popular Highlight Badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RECOMMENDED FOR ENTERPRISE</span>
                  </div>
                )}

                <div>
                  {/* Tier Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-3 rounded-2xl ${tier.iconBoxColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono px-3 py-1 rounded-full border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-mono mb-2">{tier.name}</h3>
                  <p className="text-xs text-slate-400 font-sans min-h-[36px] mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price Tag */}
                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({tier.period})</span>
                    </div>
                    <p className="text-[11px] text-amber-400/90 font-mono mt-1">+ Applicable VAT</p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">Included Deliverables:</p>
                    <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-snug">
                          <div className="p-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 mt-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => onOpenDemoModal(tier.name, `Interested in the ${tier.name} tier (${tier.price} + VAT).`)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                      tier.buttonStyle || (tier.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600')
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature Box: Why Choose Whitelabel or Setup */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-slate-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex-shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">100% Bare Metal Control</h4>
              <p className="text-slate-400 font-sans leading-relaxed">
                We configure directly on Hetzner, OVH, or your on-premise hardware with zero vendor lock-in.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Guaranteed SLA & Handover</h4>
              <p className="text-slate-400 font-sans leading-relaxed">
                Full production readiness testing, load verification, and complete documentation provided upon handoff.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">High-Value Business IP</h4>
              <p className="text-slate-400 font-sans leading-relaxed">
                The €750k Whitelabel license unlocks commercial resale rights to scale your own cloud consulting business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Tag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l10 10 10-10L12 2z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
