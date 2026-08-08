import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClusterArchitectureSection } from './components/ClusterArchitectureSection';
import { BlueprintSequence } from './components/BlueprintSequence';
import { TechStackGrid } from './components/TechStackGrid';
import { CostCalculator } from './components/CostCalculator';
import { PricingSection } from './components/PricingSection';
import { WhitelabelSection } from './components/WhitelabelSection';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { ReadinessAssessment } from './components/ReadinessAssessment';
import { FaqSection } from './components/FaqSection';
import { DemoModal } from './components/DemoModal';
import { TerminalSimulator } from './components/TerminalSimulator';
import { Footer } from './components/Footer';
import { DemoModalState } from './types';

export default function App() {
  const [demoModalState, setDemoModalState] = useState<DemoModalState>({
    isOpen: false,
    selectedPlan: '',
    initialMessage: '',
  });

  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleOpenDemoModal = (plan?: string, message?: string) => {
    setDemoModalState({
      isOpen: true,
      selectedPlan: plan || 'Get KubeSailor Blueprint Package',
      initialMessage: message || '',
    });
  };

  const handleCloseDemoModal = () => {
    setDemoModalState({ isOpen: false });
  };

  const handleScrollToBlueprint = () => {
    const el = document.getElementById('blueprint');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Header */}
      <Navbar
        onOpenDemoModal={handleOpenDemoModal}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenDemoModal={handleOpenDemoModal}
          onOpenTerminal={() => setTerminalOpen(true)}
          onScrollToBlueprint={handleScrollToBlueprint}
        />

        {/* 3-Cluster Architecture Deep-Dive */}
        <ClusterArchitectureSection onOpenDemoModal={handleOpenDemoModal} />

        {/* 1-Week Fixed Build Sequence */}
        <BlueprintSequence
          onOpenDemoModal={handleOpenDemoModal}
          onOpenTerminal={() => setTerminalOpen(true)}
        />

        {/* Open CNCF Tech Stack Grid */}
        <TechStackGrid onOpenDemoModal={handleOpenDemoModal} />

        {/* Transparent Service & Whitelabel Pricing Tiers */}
        <PricingSection onOpenDemoModal={handleOpenDemoModal} />

        {/* Whitelabel IP License & Business Platform Section */}
        <WhitelabelSection onOpenDemoModal={handleOpenDemoModal} />

        {/* TCO & ROI Cost Savings Calculator */}
        <CostCalculator onOpenDemoModal={handleOpenDemoModal} />

        {/* Public Cloud vs DIY vs KubeSailor Comparison Matrix */}
        <ComparisonMatrix onOpenDemoModal={handleOpenDemoModal} />

        {/* Readiness Assessment Quiz */}
        <ReadinessAssessment onOpenDemoModal={handleOpenDemoModal} />

        {/* Frequently Asked Questions */}
        <FaqSection onOpenDemoModal={handleOpenDemoModal} />
      </main>

      {/* Footer */}
      <Footer
        onOpenDemoModal={handleOpenDemoModal}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      {/* Interactive Modals & Drawers */}
      <DemoModal state={demoModalState} onClose={handleCloseDemoModal} />

      <TerminalSimulator
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenDemoModal={handleOpenDemoModal}
      />
    </div>
  );
}
