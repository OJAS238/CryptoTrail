export type SupportedChain = 'Ethereum' | 'Solana' | 'Arbitrum' | 'Bitcoin' | 'Polygon' | 'Base';

export interface TracePreset {
  id: string;
  name: string;
  label: string;
  address: string;
  chain: SupportedChain;
  chainType: 'eth' | 'sol' | 'arb' | 'btc' | 'poly' | 'base';
  shortAddress: string;
  targetExchange: string;
  tagColor: 'primary' | 'tertiary' | 'secondary' | 'warning';
}

export type EntityType = 
  | 'genesis' 
  | 'dex_pool' 
  | 'mixer' 
  | 'bridge' 
  | 'peel_wallet' 
  | 'exchange_deposit' 
  | 'exchange_hot_wallet'
  | 'eoa';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TraceHopNode {
  id: string;
  hopIndex: number;
  entityName: string;
  entityType: EntityType;
  address: string;
  label: string;
  txHash: string;
  timestamp: string;
  amountEth: number;
  amountUsd: number;
  gasUsedGwei: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  blockNumber: number;
  details: {
    contractVerified: boolean;
    clusterTags: string[];
    heuristicMethod: string;
    flowPct: number;
    destinationMemo?: string;
  };
}

export interface TraceResult {
  id: string;
  queryAddress: string;
  chain: SupportedChain;
  status: 'analyzing' | 'completed' | 'failed';
  timestamp: string;
  totalHops: number;
  avgLatencyMs: number;
  confidenceScore: number;
  attributionExchange: string;
  depositMemo?: string;
  receivingHotWallet: string;
  flaggedMixers: boolean;
  volumeTracedEth: number;
  volumeTracedUsd: number;
  nodes: TraceHopNode[];
  logs: { time: string; message: string; status: 'DONE' | 'PROCESSING' | 'FLAG' }[];
}

export interface MiniFlowStep {
  label: string;
  type: EntityType | 'dex' | 'mixer' | 'peel' | 'exchange' | 'bridge' | 'genesis';
  subLabel?: string;
  isTerminal?: boolean;
}

export interface HistoryItem {
  id: string;
  queryAddress: string;
  chain: SupportedChain;
  timestamp: string;
  targetExchange: string;
  hopsCount: number;
  confidence: number;
  amountEth: number;
  amountUsd: number;
  riskLevel: RiskLevel;
  hasMixer: boolean;
  peelScanMode: string;
  summaryText?: string;
  dexSwapsCount?: number;
  executionDuration?: string;
  miniFlow?: MiniFlowStep[];
}

export interface NodeClusterInfo {
  id: string;
  region: string;
  location: string;
  endpoint: string;
  status: 'ONLINE' | 'OPTIMAL' | 'SYNCING';
  latencyMs: number;
  blocksProcessed: string;
  mempoolTps: number;
  peers: number;
}
