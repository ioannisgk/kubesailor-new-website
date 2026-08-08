import React, { useState } from 'react';
import { DemoModalState } from '../types';
import { X, CheckCircle2, Shield, ArrowRight, Building, Mail, User, Server } from 'lucide-react';

interface DemoModalProps {
  state: DemoModalState;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ state, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serverLocation: 'Hetzner / Bare Metal Rental',
    serverCount: '6-15 Servers',
    message: state.initialMessage || '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!state.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                {state.selectedPlan || 'Get KubeSailor Blueprint Package'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Deploy your own private cloud in 1 week</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white font-mono">Blueprint Request Received!</h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you, <span className="text-cyan-400 font-bold">{formData.name}</span>. Our platform engineering team has sent the KubeSailor Blueprint specifications & repository access details to <span className="text-cyan-400 font-bold">{formData.email}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Your Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Work Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="alex@startup.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Company / Organization *</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Acme Technologies"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hardware / Server Setup</label>
                <div className="relative">
                  <Server className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={formData.serverLocation}
                    onChange={(e) => setFormData({ ...formData, serverLocation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Hetzner / Bare Metal Rental">Hetzner / Bare Metal Cloud</option>
                    <option value="Colocation Facility Rack">Colocation Facility Rack</option>
                    <option value="On-Premises Servers">On-Premises Company Servers</option>
                    <option value="Evaluating Hardware Vendors">Evaluating Hardware Vendors</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Architecture Notes or Questions (Optional)</label>
              <textarea
                rows={3}
                placeholder="Details on current cloud provider, vCPU needs, or timeline..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Request Blueprint Package & Repository</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              🔒 We respect your privacy. No spam. Technical architecture follow-up only.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
