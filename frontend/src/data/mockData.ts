import { TracePreset, TraceResult, HistoryItem, NodeClusterInfo } from '../types';

export const PRESETS: TracePreset[] = [
  {
    id: 'preset-1',
    name: 'Uniswap → Binance',
    label: 'Uniswap → Binance',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    chain: 'Ethereum',
    chainType: 'eth',
    shortAddress: '0x742d...f44e',
    targetExchange: 'Binance',
    tagColor: 'primary'
  },
  {
    id: 'preset-2',
    name: 'Hop Protocol → Kraken',
    label: 'Hop Protocol → Kraken',
    address: '0x388c818ca8b9251b393131c08a736a67ccb191b2',
    chain: 'Arbitrum',
    chainType: 'arb',
    shortAddress: '0x388c...91b2',
    targetExchange: 'Kraken',
    tagColor: 'tertiary'
  },
  {
    id: 'preset-3',
    name: 'Tornado Cash → OKX Hot Wallet',
    label: 'Tornado Cash → OKX',
    address: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
    chain: 'Ethereum',
    chainType: 'eth',
    shortAddress: '0x12d6...b8fc',
    targetExchange: 'OKX',
    tagColor: 'warning'
  },
  {
    id: 'preset-4',
    name: 'Curve Finance → Coinbase Prime',
    label: 'Curve → Coinbase',
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    chain: 'Ethereum',
    chainType: 'eth',
    shortAddress: '0xd533...cd52',
    targetExchange: 'Coinbase',
    tagColor: 'secondary'
  }
];

export const INITIAL_CLUSTERS: NodeClusterInfo[] = [
  {
    id: 'us-east-rpc-01',
    region: 'US-East',
    location: 'N. Virginia (AWS us-east-1)',
    endpoint: 'wss://eth-mainnet.cryptotrail.internal/feed-01',
    status: 'OPTIMAL',
    latencyMs: 14,
    blocksProcessed: '19,482,103',
    mempoolTps: 3410,
    peers: 148
  },
  {
    id: 'eu-central-mempool-02',
    region: 'EU-Central',
    location: 'Frankfurt (Equinix FR2)',
    endpoint: 'wss://eu-mempool.cryptotrail.internal/trace-02',
    status: 'OPTIMAL',
    latencyMs: 19,
    blocksProcessed: '19,482,103',
    mempoolTps: 4120,
    peers: 182
  },
  {
    id: 'ap-east-ingest-03',
    region: 'AP-East',
    location: 'Tokyo (NTT Communications)',
    endpoint: 'wss://ap-cluster.cryptotrail.internal/feed-03',
    status: 'OPTIMAL',
    latencyMs: 38,
    blocksProcessed: '19,482,102',
    mempoolTps: 2890,
    peers: 124
  },
  {
    id: 'sa-east-node-04',
    region: 'SA-East',
    location: 'São Paulo (Ascenty SP4)',
    endpoint: 'wss://sa-node.cryptotrail.internal/trace-04',
    status: 'SYNCING',
    latencyMs: 64,
    blocksProcessed: '19,482,098',
    mempoolTps: 1980,
    peers: 96
  }
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-001',
    queryAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    chain: 'Ethereum',
    timestamp: '2026-09-10 06:42:18 UTC',
    targetExchange: 'Binance Hot Wallet 14',
    hopsCount: 4,
    confidence: 99.4,
    amountEth: 45.8,
    amountUsd: 162400,
    riskLevel: 'low',
    hasMixer: false,
    peelScanMode: 'PEEL-SCAN 4H',
    summaryText: 'Deterministic heuristic traversal originating from 0x742d...f44e resolved across 4 transactional hops on Ethereum Mainnet. Capital routed through Uniswap V3 ETH/USDC swap router before splitting through an intermediary peel relayer (92% forward flow) and sweeping into Binance Hot Wallet 14 with 99.4% attribution certainty.',
    dexSwapsCount: 1,
    executionDuration: '1.82s',
    miniFlow: [
      { label: 'Genesis Origin', type: 'genesis', subLabel: '0x742d...f44e' },
      { label: 'Uniswap V3', type: 'dex_pool', subLabel: 'Swap Router 2' },
      { label: 'Peel Relay', type: 'peel_wallet', subLabel: '92% Forwarded' },
      { label: 'Binance Hot Wallet', type: 'exchange_hot_wallet', subLabel: 'Terminal Sweep', isTerminal: true }
    ]
  },
  {
    id: 'hist-002',
    queryAddress: '0x388c818ca8b9251b393131c08a736a67ccb191b2',
    chain: 'Arbitrum',
    timestamp: '2026-09-10 05:18:41 UTC',
    targetExchange: 'Kraken Ingest Hot Wallet',
    hopsCount: 3,
    confidence: 99.1,
    amountEth: 33.4,
    amountUsd: 118500,
    riskLevel: 'medium',
    hasMixer: false,
    peelScanMode: 'DIRECT L2 ROLLUP',
    summaryText: 'L2 state trie inspection traced Arbitrum Nitro origin address through Hop Protocol cross-chain AMM bridge router. Canonical settlement was swept into Kraken Ingest Hot Wallet with valid deposit sub-tag 0x9948c2 and zero mixer taint detected.',
    dexSwapsCount: 1,
    executionDuration: '1.42s',
    miniFlow: [
      { label: 'Arbitrum Origin', type: 'genesis', subLabel: '0x388c...91b2' },
      { label: 'Hop Bridge AMM', type: 'bridge', subLabel: 'L2 Rollup Router' },
      { label: 'Kraken Hot Wallet', type: 'exchange_hot_wallet', subLabel: 'Sub-Tag Ingest', isTerminal: true }
    ]
  },
  {
    id: 'hist-003',
    queryAddress: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
    chain: 'Ethereum',
    timestamp: '2026-09-09 23:54:12 UTC',
    targetExchange: 'OKX Deposit Terminal',
    hopsCount: 4,
    confidence: 98.7,
    amountEth: 100.0,
    amountUsd: 354800,
    riskLevel: 'critical',
    hasMixer: true,
    peelScanMode: 'MIXER UNWIND 4H',
    summaryText: 'CRITICAL ALERT: Heuristic engine identified high-value anonymization cycle interacting directly with Tornado.Cash 100 ETH ZK vault contract. Temporal gas analysis unwound the relayer dispersal split (99.4% volume retention) concluding in an attributed sweep into OKX Deposit Terminal.',
    dexSwapsCount: 0,
    executionDuration: '1.94s',
    miniFlow: [
      { label: 'Genesis Depositor', type: 'genesis', subLabel: '0x12d6...b8fc' },
      { label: 'Tornado 100 ETH', type: 'mixer', subLabel: 'OFAC ZK Pool' },
      { label: 'Relayer Dispersal', type: 'peel_wallet', subLabel: 'Peel Split 0.6%' },
      { label: 'OKX Terminal', type: 'exchange_hot_wallet', subLabel: 'KYC Sweeper', isTerminal: true }
    ]
  },
  {
    id: 'hist-004',
    queryAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    chain: 'Ethereum',
    timestamp: '2026-09-09 18:22:04 UTC',
    targetExchange: 'Coinbase Prime Vault 4',
    hopsCount: 3,
    confidence: 99.8,
    amountEth: 285.5,
    amountUsd: 1012900,
    riskLevel: 'low',
    hasMixer: false,
    peelScanMode: 'INSTITUTIONAL SWEEP',
    summaryText: 'Institutional liquidity displacement of 285.5 ETH executed via Curve 3pool automated market maker. Funds were subsequently transferred into a regulated prime brokerage multi-sig cluster and attributed to Coinbase Prime Vault 4.',
    dexSwapsCount: 1,
    executionDuration: '1.65s',
    miniFlow: [
      { label: 'Curve Treasury', type: 'genesis', subLabel: '0xd533...cd52' },
      { label: 'Curve 3pool DEX', type: 'dex_pool', subLabel: 'AMM Vyper' },
      { label: 'Coinbase Prime', type: 'exchange_hot_wallet', subLabel: 'Institutional Sweep', isTerminal: true }
    ]
  },
  {
    id: 'hist-005',
    queryAddress: '0x881d40237659c251811cec9c364ef91dc08d300c',
    chain: 'Polygon',
    timestamp: '2026-09-09 12:10:55 UTC',
    targetExchange: 'Bybit Ingest Cluster',
    hopsCount: 2,
    confidence: 99.6,
    amountEth: 14.2,
    amountUsd: 50380,
    riskLevel: 'low',
    hasMixer: false,
    peelScanMode: 'FAST MEMPOOL HOP',
    summaryText: 'Fast mempool heuristic confirmed 2-hop direct transfer on Polygon PoS. The address transferred 14.2 ETH equivalent through an unverified intermediary conduit into Bybit Ingest Cluster with 99.6% deterministic confidence.',
    dexSwapsCount: 0,
    executionDuration: '0.89s',
    miniFlow: [
      { label: 'Polygon Origin', type: 'genesis', subLabel: '0x881d...300c' },
      { label: 'Fast Peel Conduit', type: 'peel_wallet', subLabel: 'Mempool Hop' },
      { label: 'Bybit Ingest', type: 'exchange_hot_wallet', subLabel: 'Cluster Sweep', isTerminal: true }
    ]
  }
];

export function buildDetailedTrace(address: string, chain: string): TraceResult {
  const isTornado = address.toLowerCase().includes('12d6') || address.toLowerCase().includes('mixer');
  const isHop = address.toLowerCase().includes('388c') || chain === 'Arbitrum';
  const isCurve = address.toLowerCase().includes('d533');

  if (isTornado) {
    return {
      id: `trace-${Date.now()}`,
      queryAddress: address,
      chain: 'Ethereum',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      totalHops: 4,
      avgLatencyMs: 1940,
      confidenceScore: 98.7,
      attributionExchange: 'OKX Deposit Terminal',
      depositMemo: 'MEMO: 89401295',
      receivingHotWallet: '0x6cC5F688a30d379E122c9748Bb679E2401a725Ca',
      flaggedMixers: true,
      volumeTracedEth: 100.0,
      volumeTracedUsd: 354800,
      nodes: [
        {
          id: 'node-0',
          hopIndex: 0,
          entityName: 'Genesis Depositor EOA',
          entityType: 'genesis',
          address: address,
          label: 'Genesis Origin',
          txHash: '0xaa419f821bc39841da9283719283e10984928192840192840192840192840192',
          timestamp: '14 min ago',
          amountEth: 100.0,
          amountUsd: 354800,
          gasUsedGwei: 24.5,
          riskLevel: 'critical',
          riskFactors: ['Tornado.Cash Interactor', 'Direct Smart Contract Call', 'High Value Anonymization'],
          blockNumber: 19482088,
          details: {
            contractVerified: false,
            clusterTags: ['TORNADO_SENDER', 'WHALE_ALERT'],
            heuristicMethod: 'Direct Call Signature Matching',
            flowPct: 100.0
          }
        },
        {
          id: 'node-1',
          hopIndex: 1,
          entityName: 'Tornado.Cash: 100 ETH Vault',
          entityType: 'mixer',
          address: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
          label: 'Mixer Pool (Anonymity Set)',
          txHash: '0xbb82910398402938402948204928402948204928402948204928402948204928',
          timestamp: '11 min ago',
          amountEth: 100.0,
          amountUsd: 354800,
          gasUsedGwei: 310.2,
          riskLevel: 'critical',
          riskFactors: ['OFAC Sanctioned Entity', 'Zero-Knowledge Cryptographic Pool', 'Break of Traceability Claim'],
          blockNumber: 19482092,
          details: {
            contractVerified: true,
            clusterTags: ['OFAC_SANCTIONED', 'ZK_POOL', 'ANONYMITY_SET_64'],
            heuristicMethod: 'Deposit-Withdrawal Timing & Gas Signature Cluster',
            flowPct: 100.0
          }
        },
        {
          id: 'node-2',
          hopIndex: 2,
          entityName: 'Relayer Dispersal Node #3',
          entityType: 'peel_wallet',
          address: '0x5e33a92841029482049284029482049284029482',
          label: 'Peel Aggregation Node',
          txHash: '0xcc19283019284019284019284019284019284019284019284019284019284019',
          timestamp: '7 min ago',
          amountEth: 99.4,
          amountUsd: 352670,
          gasUsedGwei: 48.1,
          riskLevel: 'high',
          riskFactors: ['Fast Peel Chain', 'Sub-graph Relayer Fee Payout', 'Obfuscation Route'],
          blockNumber: 19482097,
          details: {
            contractVerified: false,
            clusterTags: ['RELAYER_DISPERSAL', 'PEEL_SPLIT_0.6%'],
            heuristicMethod: 'Temporal Proximity & UTXO Peeling Heuristic',
            flowPct: 99.4
          }
        },
        {
          id: 'node-3',
          hopIndex: 3,
          entityName: 'OKX Institutional Ingest',
          entityType: 'exchange_hot_wallet',
          address: '0x6cC5F688a30d379E122c9748Bb679E2401a725Ca',
          label: 'OKX Deposit Terminal',
          txHash: '0xdd49102948204928402948204928402948204928402948204928402948204928',
          timestamp: '2 min ago',
          amountEth: 99.4,
          amountUsd: 352670,
          gasUsedGwei: 21.3,
          riskLevel: 'high',
          riskFactors: ['Attributed CEX Ingest', 'OFAC Tainted Funds Inbound', 'Compliance Alert Triggered'],
          blockNumber: 19482101,
          details: {
            contractVerified: true,
            clusterTags: ['OKX_OFFICIAL_INGEST', 'KYC_MAPPED_ACCOUNT'],
            heuristicMethod: 'Deterministic Deposit Memo Tagging & Sweep Tree',
            flowPct: 99.4,
            destinationMemo: 'MEMO: 89401295'
          }
        }
      ],
      logs: [
        { time: '00:00.12', message: 'Genesis input address resolved on Ethereum Mainnet (Block #19482088)', status: 'DONE' },
        { time: '00:00.48', message: 'Heuristic engine triggered: OFAC tagged contract detected at Hop 1', status: 'FLAG' },
        { time: '00:01.02', message: 'Unwinding zero-knowledge withdrawal cluster matching 100 ETH denominations', status: 'DONE' },
        { time: '00:01.44', message: 'Correlating gas price distribution and relay timing across mempool blocks', status: 'DONE' },
        { time: '00:01.88', message: 'Attributed terminal sweep into OKX Deposit Terminal (Confidence: 98.7%)', status: 'DONE' }
      ]
    };
  }

  if (isHop) {
    return {
      id: `trace-${Date.now()}`,
      queryAddress: address,
      chain: 'Arbitrum',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      totalHops: 3,
      avgLatencyMs: 1420,
      confidenceScore: 99.1,
      attributionExchange: 'Kraken Ingest Hot Wallet',
      depositMemo: 'KRAKEN-SUB: 0x9948c2',
      receivingHotWallet: '0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2',
      flaggedMixers: false,
      volumeTracedEth: 33.4,
      volumeTracedUsd: 118500,
      nodes: [
        {
          id: 'node-0',
          hopIndex: 0,
          entityName: 'Arbitrum Origin EOA',
          entityType: 'genesis',
          address: address,
          label: 'Arbitrum Wallet',
          txHash: '0x1849102948201948201948201948201948201948201948201948201948201948',
          timestamp: '22 min ago',
          amountEth: 33.4,
          amountUsd: 118500,
          gasUsedGwei: 0.1,
          riskLevel: 'low',
          riskFactors: ['Arbitrum Nitro L2 Rollup'],
          blockNumber: 172910244,
          details: {
            contractVerified: false,
            clusterTags: ['ARBITRUM_EOA', 'DEFI_USER'],
            heuristicMethod: 'L2 State Trie Lookup',
            flowPct: 100.0
          }
        },
        {
          id: 'node-1',
          hopIndex: 1,
          entityName: 'Hop Protocol: L2 AMM Bridge',
          entityType: 'bridge',
          address: '0xb8901acB9E5e08821381e33108571E524b074F88',
          label: 'Hop Bridge AMM',
          txHash: '0x2948102948201948201948201948201948201948201948201948201948201948',
          timestamp: '16 min ago',
          amountEth: 33.38,
          amountUsd: 118420,
          gasUsedGwei: 0.25,
          riskLevel: 'low',
          riskFactors: ['Cross-Chain Liquidity Router'],
          blockNumber: 172910298,
          details: {
            contractVerified: true,
            clusterTags: ['HOP_EXCHANGE', 'AMM_ROUTER'],
            heuristicMethod: 'Cross-chain event emit verification',
            flowPct: 99.9
          }
        },
        {
          id: 'node-2',
          hopIndex: 2,
          entityName: 'Kraken Clustered Hot Wallet',
          entityType: 'exchange_hot_wallet',
          address: '0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2',
          label: 'Kraken Hot Wallet',
          txHash: '0x3948102948201948201948201948201948201948201948201948201948201948',
          timestamp: '4 min ago',
          amountEth: 33.38,
          amountUsd: 118420,
          gasUsedGwei: 18.2,
          riskLevel: 'low',
          riskFactors: ['Direct Exchange Deposit Address'],
          blockNumber: 19482100,
          details: {
            contractVerified: true,
            clusterTags: ['KRAKEN_CUSTODY_12', 'INSTITUTIONAL_HOT_WALLET'],
            heuristicMethod: 'Multi-Sig Registry & Sweeper Pattern Detection',
            flowPct: 99.9,
            destinationMemo: 'KRAKEN-SUB: 0x9948c2'
          }
        }
      ],
      logs: [
        { time: '00:00.08', message: 'Querying Arbitrum Nitro RPC cluster node (Block #172910244)', status: 'DONE' },
        { time: '00:00.35', message: 'Decoding Hop Protocol cross-chain bridge transfer parameters', status: 'DONE' },
        { time: '00:00.82', message: 'Tracking L1 canonical settlement relayer address 0x19a2...9d11', status: 'DONE' },
        { time: '00:01.35', message: 'Resolved destination: Kraken Ingest Hot Wallet (Confidence: 99.1%)', status: 'DONE' }
      ]
    };
  }

  if (isCurve) {
    return {
      id: `trace-${Date.now()}`,
      queryAddress: address,
      chain: 'Ethereum',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      totalHops: 3,
      avgLatencyMs: 1650,
      confidenceScore: 99.8,
      attributionExchange: 'Coinbase Prime Vault 4',
      depositMemo: 'COINBASE-PRIME: CRV-INST-499',
      receivingHotWallet: '0x503828976D22510aad0201ac7EC88293211A23Da',
      flaggedMixers: false,
      volumeTracedEth: 285.5,
      volumeTracedUsd: 1012900,
      nodes: [
        {
          id: 'node-0',
          hopIndex: 0,
          entityName: 'Curve Treasury Pool Origin',
          entityType: 'genesis',
          address: address,
          label: 'Curve Liquidity Vault',
          txHash: '0x5829102948201948201948201948201948201948201948201948201948201948',
          timestamp: '45 min ago',
          amountEth: 285.5,
          amountUsd: 1012900,
          gasUsedGwei: 28.4,
          riskLevel: 'low',
          riskFactors: ['Whale Liquidity Allocation'],
          blockNumber: 19482040,
          details: {
            contractVerified: true,
            clusterTags: ['CURVE_TREASURY', 'WHALE_INSTITUTION'],
            heuristicMethod: 'Contract bytecode signature',
            flowPct: 100.0
          }
        },
        {
          id: 'node-1',
          hopIndex: 1,
          entityName: 'Curve.fi: 3pool Stableswap',
          entityType: 'dex_pool',
          address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
          label: 'Curve 3pool DEX',
          txHash: '0x6829102948201948201948201948201948201948201948201948201948201948',
          timestamp: '32 min ago',
          amountEth: 285.45,
          amountUsd: 1012720,
          gasUsedGwei: 84.1,
          riskLevel: 'low',
          riskFactors: ['High Volume Automated Market Maker'],
          blockNumber: 19482055,
          details: {
            contractVerified: true,
            clusterTags: ['CURVE_DEX', 'AMM_SWAP'],
            heuristicMethod: 'Vyper Swap Contract Heuristic',
            flowPct: 99.98
          }
        },
        {
          id: 'node-2',
          hopIndex: 2,
          entityName: 'Coinbase Prime Vault 4',
          entityType: 'exchange_hot_wallet',
          address: '0x503828976D22510aad0201ac7EC88293211A23Da',
          label: 'Coinbase Prime Hot Wallet',
          txHash: '0x7829102948201948201948201948201948201948201948201948201948201948',
          timestamp: '12 min ago',
          amountEth: 285.45,
          amountUsd: 1012720,
          gasUsedGwei: 22.0,
          riskLevel: 'low',
          riskFactors: ['Institutional Custody Vault'],
          blockNumber: 19482079,
          details: {
            contractVerified: true,
            clusterTags: ['COINBASE_PRIME', 'REGULATED_INSTITUTION'],
            heuristicMethod: 'Prime Brokerage Multi-Sig Sweeper Clustering',
            flowPct: 99.98,
            destinationMemo: 'COINBASE-PRIME: CRV-INST-499'
          }
        }
      ],
      logs: [
        { time: '00:00.11', message: 'Origin vault recognized as verified Curve Governance / Liquidity pool', status: 'DONE' },
        { time: '00:00.54', message: 'Tracking 285.5 ETH liquidity routed through Curve 3pool', status: 'DONE' },
        { time: '00:01.12', message: 'Analyzing institutional multi-sig custody transfer graph', status: 'DONE' },
        { time: '00:01.65', message: 'Attributed to Coinbase Prime Vault 4 (Confidence: 99.8%)', status: 'DONE' }
      ]
    };
  }

  // Default: Uniswap -> Binance 4 Hops (Standard Preset)
  return {
    id: `trace-${Date.now()}`,
    queryAddress: address,
    chain: (chain as any) || 'Ethereum',
    status: 'completed',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    totalHops: 4,
    avgLatencyMs: 1820,
    confidenceScore: 99.4,
    attributionExchange: 'Binance Hot Wallet 14',
    depositMemo: 'BNB-DEPOSIT: 10492810',
    receivingHotWallet: '0x28C6c06298d514Db089934071355E5743bf21d60',
    flaggedMixers: false,
    volumeTracedEth: 45.80,
    volumeTracedUsd: 162400,
    nodes: [
      {
        id: 'node-0',
        hopIndex: 0,
        entityName: 'Genesis Origin Wallet',
        entityType: 'genesis',
        address: address,
        label: 'Origin EOA',
        txHash: '0x17b38c2918239019283019284019284019284019284019284019284019284019',
        timestamp: '38 min ago',
        amountEth: 45.80,
        amountUsd: 162400,
        gasUsedGwei: 21.4,
        riskLevel: 'low',
        riskFactors: ['Direct EOA Transfer'],
        blockNumber: 19482062,
        details: {
          contractVerified: false,
          clusterTags: ['ORIGIN_GENESIS', 'ACTIVE_TRADER'],
          heuristicMethod: 'Genesis Hash Resolution',
          flowPct: 100.0
        }
      },
      {
        id: 'node-1',
        hopIndex: 1,
        entityName: 'Uniswap V3: Swap Router 2',
        entityType: 'dex_pool',
        address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        label: 'Uniswap V3 Pool',
        txHash: '0x82f9102948201948201948201948201948201948201948201948201948201948',
        timestamp: '28 min ago',
        amountEth: 45.74,
        amountUsd: 162210,
        gasUsedGwei: 142.8,
        riskLevel: 'low',
        riskFactors: ['DEX Liquidity Swap'],
        blockNumber: 19482075,
        details: {
          contractVerified: true,
          clusterTags: ['UNISWAP_V3', 'DEX_ROUTER', 'ETH_USDC_POOL'],
          heuristicMethod: 'Event Transfer Log Decoding (SwapEvent)',
          flowPct: 99.87
        }
      },
      {
        id: 'node-2',
        hopIndex: 2,
        entityName: 'Peel Intermediary Relay',
        entityType: 'peel_wallet',
        address: '0x918f4201948201948201948201948201948221c9',
        label: 'Intermediate Peel Node',
        txHash: '0x93a4102948201948201948201948201948201948201948201948201948201948',
        timestamp: '14 min ago',
        amountEth: 42.10,
        amountUsd: 149300,
        gasUsedGwei: 32.1,
        riskLevel: 'medium',
        riskFactors: ['Peel Forwarding (92% forwarded, 8% retained)'],
        blockNumber: 19482089,
        details: {
          contractVerified: false,
          clusterTags: ['PEEL_FORWARDER', 'SPLIT_OUTPUT'],
          heuristicMethod: 'Peel Chain Branch Traversal (Co-spending analysis)',
          flowPct: 92.04
        }
      },
      {
        id: 'node-3',
        hopIndex: 3,
        entityName: 'Binance Hot Wallet #14',
        entityType: 'exchange_hot_wallet',
        address: '0x28C6c06298d514Db089934071355E5743bf21d60',
        label: 'Binance Receiving Hot Wallet',
        txHash: '0xb7c8102948201948201948201948201948201948201948201948201948201948',
        timestamp: '3 min ago',
        amountEth: 42.10,
        amountUsd: 149300,
        gasUsedGwei: 21.0,
        riskLevel: 'low',
        riskFactors: ['Attributed Exchange Cluster'],
        blockNumber: 19482103,
        details: {
          contractVerified: true,
          clusterTags: ['BINANCE_HOT_WALLET', 'EXCHANGE_DEPOSIT_CLUSTER', 'VERIFIED_KYC'],
          heuristicMethod: 'Deterministic Deposit Memo Tagging & Sweep Tree',
          flowPct: 92.04,
          destinationMemo: 'BNB-DEPOSIT: 10492810'
        }
      }
    ],
    logs: [
      { time: '00:00.10', message: 'Parsing genesis parameters for 0x742d...f44e on Ethereum Mainnet', status: 'DONE' },
      { time: '00:00.42', message: 'Ingesting node cluster traces... Hop 1 resolved as Uniswap V3 Router', status: 'DONE' },
      { time: '00:00.95', message: 'Peel-scan active: identified 92% forward transfer into intermediary relayer', status: 'DONE' },
      { time: '00:01.48', message: 'Correlating sweeping tx batch with known Binance institutional registries', status: 'DONE' },
      { time: '00:01.82', message: 'Terminal reached: Binance Hot Wallet 14 (Attribution Confidence: 99.4%)', status: 'DONE' }
    ]
  };
}
