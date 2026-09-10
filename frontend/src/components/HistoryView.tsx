import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Building, 
  ShieldAlert, 
  ArrowRight,
  RefreshCw,
  FileText,
  Layers,
  ArrowLeftRight,
  Clock,
  Route,
  ChevronRight
} from 'lucide-react';
import { HistoryItem, SupportedChain, MiniFlowStep } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onNewTraceClick: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onNewTraceClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyAddress = (addr: string, id: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTraceSummary = (item: HistoryItem): string => {
    if (item.summaryText) return item.summaryText;
    const shortAddr = item.queryAddress.length > 14 
      ? `${item.queryAddress.substring(0, 6)}...${item.queryAddress.substring(item.queryAddress.length - 4)}` 
      : item.queryAddress;
    if (item.hasMixer) {
      return `CRITICAL ALERT: Heuristic engine identified high-value anonymization cycle interacting with privacy mixer contract along the traversal originating from ${shortAddr} on ${item.chain}. Capital was unwound across ${item.hopsCount} hops before attributing terminal sweep to ${item.targetExchange} with ${item.confidence}% certainty.`;
    }
    return `Deterministic heuristic traversal originating from ${shortAddr} resolved across ${item.hopsCount} transactional hops on ${item.chain}. Capital routed through verified liquidity pools and intermediary peel nodes before terminal attribution into ${item.targetExchange} with ${item.confidence}% certainty.`;
  };

  const getDexSwapsCount = (item: HistoryItem): number => {
    if (typeof item.dexSwapsCount === 'number') return item.dexSwapsCount;
    return item.hopsCount > 2 ? 1 : 0;
  };

  const getExecutionTime = (item: HistoryItem): string => {
    if (item.executionDuration) return item.executionDuration;
    return `${(1.2 + (item.hopsCount * 0.22)).toFixed(2)}s`;
  };

  const getMiniFlow = (item: HistoryItem): MiniFlowStep[] => {
    if (item.miniFlow && item.miniFlow.length > 0) return item.miniFlow;
    
    const shortAddr = item.queryAddress.length > 14 
      ? `${item.queryAddress.substring(0, 6)}...${item.queryAddress.substring(item.queryAddress.length - 4)}` 
      : item.queryAddress;

    if (item.hasMixer) {
      return [
        { label: 'Genesis Depositor', type: 'genesis', subLabel: shortAddr },
        { label: 'Mixer Pool', type: 'mixer', subLabel: 'Zero-Knowledge Vault' },
        { label: 'Relayer Conduit', type: 'peel_wallet', subLabel: 'Dispersal Relay' },
        { label: item.targetExchange, type: 'exchange_hot_wallet', subLabel: 'Attributed CEX', isTerminal: true }
      ];
    }

    if (item.hopsCount === 2) {
      return [
        { label: 'Origin EOA', type: 'genesis', subLabel: shortAddr },
        { label: 'Mempool Conduit', type: 'peel_wallet', subLabel: 'Direct Forward' },
        { label: item.targetExchange, type: 'exchange_hot_wallet', subLabel: 'Attributed CEX', isTerminal: true }
      ];
    }

    if (item.hopsCount === 3) {
      return [
        { label: 'Origin Wallet', type: 'genesis', subLabel: shortAddr },
        { label: item.chain === 'Arbitrum' ? 'Hop Bridge AMM' : 'Curve DEX Pool', type: item.chain === 'Arbitrum' ? 'bridge' : 'dex_pool', subLabel: 'Liquidity Router' },
        { label: item.targetExchange, type: 'exchange_hot_wallet', subLabel: 'Attributed CEX', isTerminal: true }
      ];
    }

    return [
      { label: 'Genesis Origin', type: 'genesis', subLabel: shortAddr },
      { label: 'Uniswap V3 Pool', type: 'dex_pool', subLabel: 'Swap Router' },
      { label: 'Peel Relay Node', type: 'peel_wallet', subLabel: 'UTXO Peel Split' },
      { label: item.targetExchange, type: 'exchange_hot_wallet', subLabel: 'Terminal Ingest', isTerminal: true }
    ];
  };

  const getNodeTypeStyle = (type: string, isTerminal?: boolean) => {
    if (isTerminal || type === 'exchange_hot_wallet' || type === 'exchange_deposit' || type === 'exchange') {
      return {
        badge: 'bg-[#ff6b00]/10 border-[#ff6b00]/40 text-[#ffb693]',
        dot: 'bg-[#ff6b00]'
      };
    }
    switch (type) {
      case 'genesis':
        return {
          badge: 'bg-[#1e1f25] border-[#292a2f] text-[#e3e1e9]',
          dot: 'bg-[#c2c6d7]'
        };
      case 'dex_pool':
      case 'dex':
        return {
          badge: 'bg-[#0284c7]/10 border-[#0284c7]/40 text-[#38bdf8]',
          dot: 'bg-[#38bdf8]'
        };
      case 'mixer':
        return {
          badge: 'bg-[#93000a]/20 border-[#ffb4ab]/40 text-[#ffb4ab]',
          dot: 'bg-[#ef4444]'
        };
      case 'bridge':
        return {
          badge: 'bg-[#a855f7]/10 border-[#a855f7]/40 text-[#c084fc]',
          dot: 'bg-[#c084fc]'
        };
      case 'peel_wallet':
      case 'peel':
      default:
        return {
          badge: 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#fbbf24]',
          dot: 'bg-[#f59e0b]'
        };
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.queryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetExchange.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChain = selectedChain === 'All' || item.chain === selectedChain;
    const matchesRisk = 
      selectedRisk === 'All' ||
      (selectedRisk === 'mixer' && item.hasMixer) ||
      (selectedRisk === 'clean' && !item.hasMixer);

    return matchesSearch && matchesChain && matchesRisk;
  });

  const exportCsv = () => {
    const headers = "ID,Address,Chain,DestinationExchange,Hops,Confidence,AmountETH,AmountUSD,Risk,Timestamp\n";
    const rows = history.map(h => 
      `"${h.id}","${h.queryAddress}","${h.chain}","${h.targetExchange}",${h.hopsCount},${h.confidence}%,${h.amountEth},${h.amountUsd},"${h.riskLevel}","${h.timestamp}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cryptotrail-history-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e1f25]">
        <div>
          <h1 className="text-2xl font-bold text-[#e3e1e9] flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#ff6b00]" />
            Forensic Audit Ledger
          </h1>
          <p className="text-xs text-[#c2c6d7] mt-1">
            Historical heuristic path traces, institutional exchange attributions, and peel logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-history-csv"
            type="button"
            onClick={exportCsv}
            disabled={history.length === 0}
            className="px-3 py-1.5 bg-[#1a1b21] hover:bg-[#292a2f] border border-[#292a2f] disabled:opacity-40 text-xs font-mono text-[#c2c6d7] hover:text-[#e3e1e9] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-clear-history"
            type="button"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="px-3 py-1.5 bg-[#1a1b21] hover:bg-[#93000a]/20 border border-[#292a2f] hover:border-[#ffb4ab]/30 disabled:opacity-40 text-xs font-mono text-[#c2c6d7] hover:text-[#ffb4ab] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#c2c6d7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-history-search"
            type="text"
            placeholder="Filter by wallet address, exchange, or hash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[#1a1b21] text-xs font-mono text-[#e3e1e9] placeholder:text-[#c2c6d7]/60 rounded-xl border border-[#292a2f] focus:outline-none focus:border-[#ff6b00] transition-colors"
          />
        </div>

        {/* Chain Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            id="select-history-chain"
            value={selectedChain}
            onChange={e => setSelectedChain(e.target.value)}
            className="h-11 px-3 bg-[#1a1b21] border border-[#292a2f] text-xs font-mono text-[#e3e1e9] rounded-xl focus:outline-none focus:border-[#ff6b00] cursor-pointer"
          >
            <option value="All">All Chains</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="Polygon">Polygon</option>
            <option value="Solana">Solana</option>
          </select>

          {/* Risk Selector */}
          <select
            id="select-history-risk"
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="h-11 px-3 bg-[#1a1b21] border border-[#292a2f] text-xs font-mono text-[#e3e1e9] rounded-xl focus:outline-none focus:border-[#ff6b00] cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="mixer">Mixer Detected Only</option>
            <option value="clean">Clean / Low Risk</option>
          </select>
        </div>
      </div>

      {/* History Items Feed */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center bg-[#1a1b21] rounded-2xl border border-[#292a2f] space-y-3">
          <History className="w-10 h-10 text-[#c2c6d7]/40 mx-auto" />
          <div className="text-sm font-semibold text-[#e3e1e9]">No forensic traces found</div>
          <p className="text-xs text-[#c2c6d7] max-w-sm mx-auto">
            {searchQuery ? "No audit records match your search criteria." : "Start a new trace to begin building your forensic ledger."}
          </p>
          <button
            id="btn-start-trace-empty"
            type="button"
            onClick={onNewTraceClick}
            className="mt-3 px-4 py-2 bg-[#ff6b00] text-[#121318] font-semibold text-xs rounded-lg transition-all hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start New Trace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              id={`history-card-${item.id}`}
              className="p-4 sm:p-5 bg-[#1a1b21] hover:bg-[#1c1d23] border border-[#292a2f] hover:border-[#a98a7d]/40 rounded-xl transition-all space-y-3.5"
            >
              {/* Top Row: Address, Chain, Attribution & View Graph Action */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left Column: Address, Chain & Time */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#292a2f] text-[#ffb693]">
                      {item.chain}
                    </span>
                    <span className="font-mono text-xs text-[#c2c6d7]">
                      {item.timestamp}
                    </span>
                    {item.hasMixer && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30 flex items-center gap-1">
                        <ShieldAlert className="w-2.5 h-2.5" /> MIXER DETECTED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#e3e1e9] font-medium break-all">
                      {item.queryAddress}
                    </span>
                    <button
                      id={`btn-copy-address-${item.id}`}
                      type="button"
                      onClick={() => copyAddress(item.queryAddress, item.id)}
                      className="text-[#c2c6d7] hover:text-[#ff6b00] p-1 transition-colors cursor-pointer shrink-0"
                      title="Copy Address"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Right Column: Destination Attribution, Volume & Action */}
                <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end">
                  {/* Attribution */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#121318] border border-[#292a2f] text-[#ff6b00] shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#e3e1e9]">
                        {item.targetExchange}
                      </div>
                      <div className="text-[11px] font-mono text-[#c2c6d7] flex items-center gap-1.5">
                        <span className="text-[#10b981] font-semibold">{item.confidence}% certainty</span>
                        <span>•</span>
                        <span className="text-[#ffb693] font-semibold">{item.amountEth.toFixed(1)} ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* View Graph Action Button */}
                  <button
                    id={`btn-view-graph-${item.id}`}
                    type="button"
                    onClick={() => onSelectHistoryItem(item)}
                    className="px-3.5 py-2 bg-[#292a2f] hover:bg-[#ff6b00] text-[#e3e1e9] hover:text-[#121318] font-mono text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                  >
                    <span>View Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inset 'Trace Summary' Box */}
              <div 
                id={`history-trace-summary-${item.id}`}
                className="bg-[#121318] border border-[#24252b] rounded-lg p-3.5 sm:p-4 space-y-3"
              >
                {/* Inset Header: Title & Metric Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#1e1f25]">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#ff6b00]/15 text-[#ff6b00] shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[#e3e1e9] uppercase">
                      Trace Summary
                    </span>
                    <span className="text-[10px] font-mono text-[#c2c6d7]/60 hidden sm:inline">
                      • Heuristic Path Breakdown
                    </span>
                  </div>

                  {/* Metric Badges: Hops, DEX Swaps, Time */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Hops Badge */}
                    <div 
                      title="Total Transaction Graph Hops Traversed"
                      className="px-2.5 py-1 bg-[#1a1b21] border border-[#292a2f] rounded-md text-xs font-mono text-[#e3e1e9] flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#ffb693]" />
                      <span className="text-[#c2c6d7] text-[10px] uppercase font-semibold">Hops:</span>
                      <span className="font-bold text-[#ffb693]">{item.hopsCount}</span>
                    </div>

                    {/* DEX Swaps Badge */}
                    <div 
                      title="Automated Market Maker & Bridge Swaps"
                      className="px-2.5 py-1 bg-[#1a1b21] border border-[#292a2f] rounded-md text-xs font-mono text-[#e3e1e9] flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span className="text-[#c2c6d7] text-[10px] uppercase font-semibold">DEX Swaps:</span>
                      <span className="font-bold text-[#38bdf8]">{getDexSwapsCount(item)}</span>
                    </div>

                    {/* Time Badge */}
                    <div 
                      title="RPC Triangulation & Execution Latency"
                      className="px-2.5 py-1 bg-[#1a1b21] border border-[#292a2f] rounded-md text-xs font-mono text-[#e3e1e9] flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#c2c6d7] text-[10px] uppercase font-semibold">Time:</span>
                      <span className="font-bold text-[#10b981]">{getExecutionTime(item)}</span>
                    </div>
                  </div>
                </div>

                {/* Text paragraph summary of the trace */}
                <p className="text-xs text-[#c2c6d7] leading-relaxed font-sans font-normal">
                  {getTraceSummary(item)}
                </p>

                {/* Mini Flow Path */}
                <div className="pt-2.5 border-t border-[#1e1f25] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#c2c6d7]/70">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                      <Route className="w-3 h-3 text-[#ff6b00]" />
                      Mini Flow Path
                    </span>
                    <span className="text-[9px] text-[#c2c6d7]/50 hidden sm:inline">
                      Sequential Routing Sequence
                    </span>
                  </div>

                  {/* Flow steps horizontal sequence */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-[#292a2f] scrollbar-track-transparent">
                    {getMiniFlow(item).map((step, sIdx, allSteps) => {
                      const style = getNodeTypeStyle(step.type, step.isTerminal);
                      const isLast = sIdx === allSteps.length - 1;

                      return (
                        <React.Fragment key={`${item.id}-flow-${sIdx}`}>
                          <div className={`px-2.5 py-1.5 rounded-md border text-xs font-mono shrink-0 transition-colors ${style.badge} flex items-center gap-2`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <div className="flex flex-col">
                              <span className="font-semibold text-[11px] leading-tight whitespace-nowrap">{step.label}</span>
                              {step.subLabel && (
                                <span className="text-[9px] opacity-75 font-normal leading-tight whitespace-nowrap font-mono">{step.subLabel}</span>
                              )}
                            </div>
                          </div>

                          {!isLast && (
                            <ChevronRight className="w-3.5 h-3.5 text-[#c2c6d7]/40 shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
