import React, { useState, useEffect } from 'react';
import { Anchor, Server, Terminal, Calculator, FileText, HelpCircle, Menu, X, Shield, Cpu, Tag, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Architecture', href: '#architecture', icon: Server },
    { name: '1-Week Blueprint', href: '#blueprint', icon: FileText },
    { name: 'Tech Stack', href: '#techstack', icon: Cpu },
    { name: 'Pricing', href: '#pricing', icon: Tag },
    { name: 'Whitelabel IP', href: '#whitelabel', icon: Sparkles },
    { name: 'TCO Calculator', href: '#calculator', icon: Calculator },
    { name: 'Comparison', href: '#comparison', icon: Shield },
    { name: 'FAQ', href: '#faq', icon: HelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-slate-950/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Anchor className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white font-mono">
                  Kube<span className="text-cyan-400">Sailor</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  v2.4 HA
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tracking-wide font-sans hidden sm:inline">
                Multi-Cluster Private Cloud
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
                >
                  <link.icon className="w-3.5 h-3.5 text-slate-400" />
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenTerminal}
              className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 sm:hidden"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-slate-900/95 rounded-2xl border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/80 flex items-center gap-3"
              >
                <link.icon className="w-4 h-4 text-cyan-400" />
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
