import React from 'react';
import { Anchor, Terminal, Shield, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemoModal, onOpenTerminal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Anchor className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white font-mono">
                Kube<span className="text-cyan-400">Sailor</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Productized multi-cluster private cloud blueprint for startups building on bare-metal servers with 100% data sovereignty and HA.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Blueprint Status: v2.4 HA Stable</span>
            </div>
          </div>

          {/* Architecture Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">3-Cluster Architecture</h4>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li>
                <a href="#architecture" className="hover:text-cyan-400 transition-colors">
                  Admin & Control Cluster
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-cyan-400 transition-colors">
                  Workload Compute Cluster
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-cyan-400 transition-colors">
                  Rook-Ceph Storage Cluster
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-cyan-400 transition-colors">
                  Istio Ambient Service Mesh
                </a>
              </li>
            </ul>
          </div>

          {/* Tooling & Calculators */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Interactive Tools & Rates</h4>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors font-semibold text-cyan-300">
                  Pricing Tiers & Whitelabel
                </a>
              </li>
              <li>
                <button onClick={onOpenTerminal} className="hover:text-cyan-400 transition-colors text-left">
                  CLI Terminal Simulator
                </button>
              </li>
              <li>
                <a href="#calculator" className="hover:text-cyan-400 transition-colors">
                  TCO & ROI Cost Calculator
                </a>
              </li>
              <li>
                <a href="#blueprint" className="hover:text-cyan-400 transition-colors">
                  1-Week Build Sequence
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-cyan-400 transition-colors">
                  EKS/GKE vs Bare Metal Matrix
                </a>
              </li>
            </ul>
          </div>

          {/* Blueprint Access */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Get Started</h4>
            <p className="text-slate-400 text-xs font-sans">
              Ready to break free from cloud lock-in? Request the full shell scripts, Kubernetes manifests & deployment guides.
            </p>
            <button
              onClick={() => onOpenDemoModal('Footer Blueprint Request')}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Get Blueprint Package</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} KubeSailor Private Cloud Blueprint. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Open CNCF Native</span>
            <span>•</span>
            <span>Zero Vendor Lock-in</span>
            <span>•</span>
            <span>Ubuntu 24.04 LTS Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
