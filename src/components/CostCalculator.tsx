import React, { useState, useMemo } from 'react';
import { CostCalculatorInputs } from '../types';
import { Calculator, DollarSign, TrendingDown, Server, HardDrive, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CostCalculatorProps {
  onOpenDemoModal: (plan?: string, message?: string) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ onOpenDemoModal }) => {
  const [inputs, setInputs] = useState<CostCalculatorInputs>({
    nodesCount: 9,
    cpuPerNode: 32,
    ramGbPerNode: 64,
    storageTb: 12,
    egressTbMonth: 10,
    cloudProvider: 'aws',
    hardwarePurchaseType: 'rent',
  });

  // Calculate costs based on industry standards (2026 EKS/GKE vs Hetzner/OVH/Colo rates)
  const calculation = useMemo(() => {
    const { nodesCount, cpuPerNode, ramGbPerNode, storageTb, egressTbMonth, cloudProvider, hardwarePurchaseType } = inputs;

    // 1. PUBLIC CLOUD COSTS (AWS EKS / GCP GKE)
    // Control Plane Fee: $73/mo per cluster * 3 clusters = $219
    const controlPlaneFee = 3 * 73;

    // Compute Cost:
    // AWS c6i.2xlarge (8 vCPU, 16GB) ~$0.34/hr (~$248/mo)
    // Roughly $0.035 per vCPU/hour + $0.005 per GB RAM/hour
    const cpuCostPerHour = 0.032;
    const ramCostPerHour = 0.004;
    const nodeCostPerHour = cpuPerNode * cpuCostPerHour + ramGbPerNode * ramCostPerHour;
    const monthlyCompute = nodesCount * nodeCostPerHour * 730;

    // Egress Cost: ~$0.085 per GB ($85 per TB)
    const egressCost = egressTbMonth * 85;

    // Storage Cost (gp3 SSD / Persistent Disk SSD): ~$0.08 per GB/mo ($80 per TB/mo) + IOPS/Throughput
    const storageCost = storageTb * 85;

    // NAT Gateway & Load Balancer fees (Base + GB data processed)
    const networkingBaseFees = 180 + egressTbMonth * 45;

    const totalPublicCloudMonthly = Math.round(controlPlaneFee + monthlyCompute + egressCost + storageCost + networkingBaseFees);

    // 2. KUBESAILOR BARE METAL COSTS
    // Bare Metal Server Rental (e.g. Hetzner AX102 / OVH Scale / Latitude.sh):
    // 32 vCPU AMD EPYC, 64GB RAM, 2x 1.92TB NVMe ~$140 - $220 / mo per server
    const serverRateMonthly = hardwarePurchaseType === 'rent' ? 175 : 85; // $175/mo rental OR $85/mo colocation power/rack
    const bareMetalCompute = nodesCount * serverRateMonthly;

    // Egress: Included 100TB per server on Hetzner/OVH -> $0
    const bareMetalEgress = 0;

    // Raw Storage hardware included on server NVMe drives -> $0 extra per TB
    const bareMetalStorage = 0;

    // Additional network switch / IP block / BGP bandwidth fee
    const networkAndIps = 150;

    const totalKubeSailorMonthly = Math.round(bareMetalCompute + bareMetalEgress + bareMetalStorage + networkAndIps);

    // 3. SAVINGS CALCULATIONS
    const monthlySavings = totalPublicCloudMonthly - totalKubeSailorMonthly;
    const savingsPercent = Math.round((monthlySavings / totalPublicCloudMonthly) * 100);
    const yearlySavings = monthlySavings * 12;
    const threeYearSavings = yearlySavings * 3;
    const fiveYearSavings = yearlySavings * 5;

    return {
      publicCloudMonthly: totalPublicCloudMonthly,
      kubesailorMonthly: totalKubeSailorMonthly,
      monthlySavings,
      savingsPercent,
      yearlySavings,
      threeYearSavings,
      fiveYearSavings,
      controlPlaneFee,
      monthlyCompute: Math.round(monthlyCompute),
      egressCost: Math.round(egressCost),
      storageCost: Math.round(storageCost),
    };
  }, [inputs]);

  return (
    <section id="calculator" className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-medium">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive TCO & ROI Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop Paying the Public Cloud{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Compute & Egress Tax
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Public cloud managed Kubernetes, bandwidth egress, and storage IOPS scale exponentially as your startup grows. See your projected savings on bare-metal servers running KubeSailor.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white font-mono flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>Your Hardware & Workload Scale</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Inputs
              </span>
            </div>

            {/* Provider & Model Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Cloud Baseline</label>
                <select
                  value={inputs.cloudProvider}
                  onChange={(e) => setInputs({ ...inputs, cloudProvider: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="aws">AWS (EKS + EC2 + EBS)</option>
                  <option value="gcp">GCP (GKE + GCE)</option>
                  <option value="azure">Azure (AKS + VMs)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Bare-Metal Model</label>
                <select
                  value={inputs.hardwarePurchaseType}
                  onChange={(e) => setInputs({ ...inputs, hardwarePurchaseType: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="rent">Rent Server (Hetzner/OVH/Latitude)</option>
                  <option value="buy">Own Hardware (Colocation Rack)</option>
                </select>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5 pt-2">
              {/* Nodes Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Total Server Nodes across 3 Clusters</span>
                  <span className="text-cyan-400 font-bold">{inputs.nodesCount} Nodes</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={40}
                  step={1}
                  value={inputs.nodesCount}
                  onChange={(e) => setInputs({ ...inputs, nodesCount: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>6 Nodes (Min HA)</span>
                  <span>40 Nodes (Scale-Up)</span>
                </div>
              </div>

              {/* vCPU per Node */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">vCPUs per Node</span>
                  <span className="text-cyan-400 font-bold">{inputs.cpuPerNode} vCPU</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  step={8}
                  value={inputs.cpuPerNode}
                  onChange={(e) => setInputs({ ...inputs, cpuPerNode: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* RAM GB per Node */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">RAM per Node</span>
                  <span className="text-cyan-400 font-bold">{inputs.ramGbPerNode} GB</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={256}
                  step={16}
                  value={inputs.ramGbPerNode}
                  onChange={(e) => setInputs({ ...inputs, ramGbPerNode: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Storage TB */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Total Persistent Storage (NVMe / SSD)</span>
                  <span className="text-amber-400 font-bold">{inputs.storageTb} TB</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={80}
                  step={2}
                  value={inputs.storageTb}
                  onChange={(e) => setInputs({ ...inputs, storageTb: parseInt(e.target.value) })}
                  className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Egress Bandwidth */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Monthly Internet Egress Bandwidth</span>
                  <span className="text-emerald-400 font-bold">{inputs.egressTbMonth} TB / mo</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={inputs.egressTbMonth}
                  onChange={(e) => setInputs({ ...inputs, egressTbMonth: parseInt(e.target.value) })}
                  className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>
            </div>
          </div>

          {/* Results Comparison Box (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Highlighted Savings Banner */}
            <motion.div
              key={calculation.monthlySavings}
              initial={{ scale: 0.98, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/60 border border-emerald-500/40 p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Projected Infrastructure Cost Savings</span>
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1">
                    Save ${calculation.monthlySavings.toLocaleString()}{' '}
                    <span className="text-emerald-400 text-lg sm:text-xl font-normal">/ month</span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xl font-bold flex items-center gap-1">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <span>-{calculation.savingsPercent}%</span>
                </div>
              </div>

              {/* 1, 3, 5 Year Cumulative Savings Cards */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono">1-Year Savings</span>
                  <p className="font-bold text-sm text-white font-mono">
                    ${(calculation.yearlySavings / 1000).toFixed(1)}k
                  </p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-emerald-900/60 text-center space-y-1">
                  <span className="text-[10px] text-emerald-400 font-mono">3-Year Savings</span>
                  <p className="font-bold text-base text-emerald-300 font-mono">
                    ${(calculation.threeYearSavings / 1000).toFixed(1)}k
                  </p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-emerald-500/60 text-center space-y-1">
                  <span className="text-[10px] text-emerald-300 font-mono font-bold">5-Year Runway</span>
                  <p className="font-bold text-base text-emerald-300 font-mono">
                    ${(calculation.fiveYearSavings / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Monthly Cost Breakdown Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Public Cloud Monthly Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-rose-900/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <h4 className="font-bold text-sm text-white font-mono uppercase">
                      {inputs.cloudProvider.toUpperCase()} Cloud Bill
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    ${calculation.publicCloudMonthly.toLocaleString()} / mo
                  </span>
                </div>

                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex justify-between">
                    <span className="text-slate-400">EC2/GCE Compute ({inputs.nodesCount} Nodes):</span>
                    <span>${calculation.monthlyCompute.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Internet Egress ({inputs.egressTbMonth} TB):</span>
                    <span className="text-rose-400 font-semibold">${calculation.egressCost.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Managed Storage ({inputs.storageTb} TB SSD):</span>
                    <span>${calculation.storageCost.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">3x EKS Control Planes:</span>
                    <span>${calculation.controlPlaneFee}</span>
                  </li>
                </ul>
              </div>

              {/* KubeSailor Monthly Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/60 space-y-4 shadow-lg shadow-emerald-950/30">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white font-mono uppercase">KubeSailor Bare Metal</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${calculation.kubesailorMonthly.toLocaleString()} / mo
                  </span>
                </div>

                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex justify-between">
                    <span className="text-slate-400">Bare Metal ({inputs.nodesCount} Servers):</span>
                    <span>${(calculation.kubesailorMonthly - 150).toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Internet Egress ({inputs.egressTbMonth} TB):</span>
                    <span className="text-emerald-400 font-bold">$0 (Included)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Rook-Ceph NVMe Storage:</span>
                    <span className="text-emerald-400 font-bold">$0 (Hardware NVMe)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">Control Plane Fee:</span>
                    <span className="text-emerald-400 font-bold">$0 (Self-hosted)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                Want a custom TCO report with your specific hardware vendors & datacenters?
              </div>
              <button
                onClick={() =>
                  onOpenDemoModal(
                    'Custom TCO & Architecture Review',
                    `I ran the TCO calculator for ${inputs.nodesCount} nodes with ${inputs.storageTb}TB storage and ${inputs.egressTbMonth}TB egress. Let's discuss a custom bare-metal migration strategy.`
                  )
                }
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <span>Request Custom TCO Audit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
