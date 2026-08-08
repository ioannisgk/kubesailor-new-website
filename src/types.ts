export type ClusterType = 'admin' | 'workload' | 'storage';

export interface ClusterComponent {
  name: string;
  category: 'Infrastructure' | 'GitOps & CI/CD' | 'Security & Auth' | 'Storage & Backup' | 'Observability';
  description: string;
  iconName: string;
  tech: string;
  status: 'production-ready' | 'ha-configured';
  details: string[];
}

export interface ClusterInfo {
  id: ClusterType;
  title: string;
  role: string;
  recommendedNodes: string;
  minSpecs: string;
  accentColor: string;
  components: ClusterComponent[];
  summary: string;
  keyBenefits: string[];
}

export interface BuildStep {
  day: number;
  title: string;
  subtitle: string;
  estimatedHours: string;
  summary: string;
  tasks: string[];
  cliSnippet: string;
  outputPreview: string;
  verificationCheck: string;
}

export interface TechStackItem {
  name: string;
  category: string;
  role: string;
  logoText: string;
  icon: string;
  whyChosen: string;
}

export interface CostCalculatorInputs {
  nodesCount: number;
  cpuPerNode: number;
  ramGbPerNode: number;
  storageTb: number;
  egressTbMonth: number;
  cloudProvider: 'aws' | 'gcp' | 'azure';
  hardwarePurchaseType: 'buy' | 'rent'; // Bare metal rent (Hetzner/OVH/Latitude) vs Buy server hardware
}

export interface ComparisonFeature {
  category: string;
  feature: string;
  publicCloud: string | boolean;
  buildFromScratch: string | boolean;
  kubesailor: string | boolean;
  explanation: string;
}

export interface ReadinessQuizAnswers {
  serverLocation: string;
  serverCount: string;
  monthlyCloudBill: string;
  primaryMotivation: string;
  inHouseK8sExperience: string;
  complianceNeeds: string[];
}

export interface DemoModalState {
  isOpen: boolean;
  selectedPlan?: string;
  initialMessage?: string;
}
