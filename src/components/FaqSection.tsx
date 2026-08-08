import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/kubesailorData';
import { HelpCircle, ChevronDown, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqSectionProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenDemoModal }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical & Architecture Details
          </h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
            Everything platform engineers, CTOs, and technical leads need to know before evaluating KubeSailor for their bare-metal servers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search FAQs (hardware, upgrades, HA, networking)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none shadow-lg"
          />
        </div>

        {/* Accordion List */}
        <div className="mt-10 space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left font-mono text-sm font-bold text-white flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-800/60 bg-slate-900/40"
                    >
                      <div className="p-5 text-xs text-slate-300 font-sans leading-relaxed space-y-2">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <h3 className="font-bold text-white text-base font-mono">Have a specific networking or compliance requirement?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Book a 20-minute technical session with our platform engineering team to review your server inventory and network topology.
          </p>
          <button
            onClick={() => onOpenDemoModal('Technical Architecture Review Session')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book Architecture Review Call</span>
          </button>
        </div>
      </div>
    </section>
  );
};
