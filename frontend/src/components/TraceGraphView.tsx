import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Info,
  Maximize2,
  Building,
  Shuffle,
  CircleDot,
  Repeat
} from 'lucide-react';
import { TraceResult, TraceHopNode } from '../types';

interface TraceGraphViewProps {
  trace: TraceResult;
  onSelectNode: (node: TraceHopNode) => void;
  onResetTrace: () => void;
}

export const TraceGraphView: React.FC<TraceGraphViewProps> = ({
  trace,
  onSelectNode,
  onResetTrace,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const copySummary = () => {
    const summary = `CryptoTrail Forensic Report
Target: ${trace.queryAddress}
Chain: ${trace.chain}
Destination Attributed: ${trace.attributionExchange}
Attribution Confidence: ${trace.confidenceScore}%
Total Hops: ${trace.totalHops}
Mixer Flagged: ${trace.flaggedMixers ? 'YES (High Risk)' : 'NO'}
Volume: ${trace.volumeTracedEth} ETH ($${trace.volumeTracedUsd.toLocaleString()})
Timestamp: ${trace.timestamp}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportJsonReport = () => {
    setIsExporting(true);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trace, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cryptotrail-trace-${trace.queryAddress.substring(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => setIsExporting(false), 1000);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'exchange_hot_wallet':
      case 'exchange_deposit':
        return <Building className="w-4 h-4 text-[#ff6b00]" />;
      case 'mixer':
        return <Shuffle className="w-4 h-4 text-[#ffb4ab]" />;
      case 'dex_pool':
      case 'bridge':
        return <Repeat className="w-4 h-4 text-[#9ccaff]" />;
      default:
        return <CircleDot className="w-4 h-4 text-[#c2c6d7]" />;
    }
  };

  return (
    <div className="w-full mt-6 space-y-6 animate-in fade-in duration-200">
      {/* Attribution Result Banner */}
      <div className="w-full p-5 bg-[#1a1b21] border border-[#292a2f] rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a98a7d]">
                Destination Attributed
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff6b00]/20 text-[#ffb693] border border-[#ff6b00]/30">
                {trace.confidenceScore}% CERTAINTY
              </span>
              {trace.flaggedMixers && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> MIXER DETECTED
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#e3e1e9] mt-0.5 flex items-center gap-2">
              {trace.attributionExchange}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono text-[#c2c6d7]">
              <span>Receiving Hot Wallet: <span className="text-[#e3e1e9]">{trace.receivingHotWallet.substring(0, 6)}...{trace.receivingHotWallet.substring(trace.receivingHotWallet.length - 4)}</span></span>
              {trace.depositMemo && (
                <span className="text-[#ffb693] font-medium bg-[#121318] px-2 py-0.5 rounded border border-[#292a2f]">
                  {trace.depositMemo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          <button
            id="btn-copy-dossier"
            type="button"
            onClick={copySummary}
            className="px-3 py-2 bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            id="btn-export-json"
            type="button"
            onClick={exportJsonReport}
            className="px-3 py-2 bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
          </button>

          <button
            id="btn-new-trace-reset"
            type="button"
            onClick={onResetTrace}
            className="px-3.5 py-2 bg-[#ff6b00] hover:opacity-90 text-[#121318] font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Search</span>
          </button>
        </div>
      </div>

      {/* Multi-Hop Flowchart Visualizer */}
      <div className="w-full p-6 bg-[#0d0e13] border border-[#1e1f25] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#c2c6d7]">
              Deterministic Traversal Flowchart ({trace.nodes.length} Hops Identified)
            </h3>
          </div>
          <span className="text-xs text-[#c2c6d7] font-mono hidden sm:inline">
            Click any node to inspect deep forensic dossier
          </span>
        </div>

        {/* Nodes Flow Grid / Pipeline */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 relative">
          {trace.nodes.map((node, index) => {
            const isLast = index === trace.nodes.length - 1;
            const isGenesis = index === 0;

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onClick={() => onSelectNode(node)}
                  className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer group text-left relative ${
                    isLast
                      ? 'bg-[#1e1f25] border-[#ff6b00]/60 hover:border-[#ff6b00] shadow-lg shadow-[#ff6b00]/5'
                      : node.riskLevel === 'critical'
                      ? 'bg-[#1a1b21] border-[#ffb4ab]/40 hover:border-[#ffb4ab]'
                      : 'bg-[#1a1b21] border-[#292a2f] hover:border-[#9ccaff]/50'
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isGenesis 
                          ? 'bg-[#292a2f] text-[#c2c6d7]' 
                          : isLast 
                          ? 'bg-[#ff6b00] text-[#121318]' 
                          : 'bg-[#292a2f] text-[#ffb693]'
                      }`}>
                        Hop {node.hopIndex}
                      </span>
                      <span className="p-1 rounded bg-[#121318]">
                        {getNodeIcon(node.entityType)}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      node.riskLevel === 'critical'
                        ? 'bg-[#93000a]/20 text-[#ffb4ab]'
                        : node.riskLevel === 'high'
                        ? 'bg-[#ff6b00]/20 text-[#ffb693]'
                        : 'bg-[#10b981]/20 text-[#10b981]'
                    }`}>
                      {node.riskLevel}
                    </span>
                  </div>

                  {/* Title & Entity */}
                  <div className="font-semibold text-xs sm:text-sm text-[#e3e1e9] group-hover:text-white truncate">
                    {node.entityName}
                  </div>
                  <div className="text-[11px] font-mono text-[#c2c6d7] truncate mt-0.5">
                    {node.label}
                  </div>

                  {/* Address */}
                  <div className="mt-3 py-1.5 px-2 bg-[#121318] rounded border border-[#1e1f25] font-mono text-[11px] text-[#9ccaff] group-hover:text-[#ffb693] flex items-center justify-between">
                    <span className="truncate">
                      {node.address.substring(0, 6)}...{node.address.substring(node.address.length - 4)}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                  </div>

                  {/* Metrics */}
                  <div className="mt-3 pt-2 border-t border-[#292a2f]/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#c2c6d7]">Volume</span>
                    <span className="text-[#ffb693] font-bold">{node.amountEth.toFixed(1)} ETH</span>
                  </div>

                  {/* Hover hint */}
                  <div className="mt-2 text-[10px] font-mono text-[#c2c6d7] text-right flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 text-[#ff6b00]" />
                  </div>
                </div>

                {/* Connector Arrow (if not last) */}
                {!isLast && (
                  <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 px-2 text-[#c2c6d7]">
                    <div className="hidden lg:block w-4 h-[2px] bg-[#ff6b00]/40 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-[#ff6b00] rotate-45" />
                    </div>
                    <div className="block lg:hidden h-4 w-[2px] bg-[#ff6b00]/40 relative my-1">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-b-2 border-r-2 border-[#ff6b00] rotate-45" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Forensic Log Terminal */}
      <div className="p-4 bg-[#0d0e13] rounded-2xl border border-[#1e1f25]">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#c2c6d7]">
          <span className="uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Heuristic Execution Logs
          </span>
          <span>RPC RESPONSE LATENCY: {trace.avgLatencyMs}ms</span>
        </div>
        <div className="space-y-1.5 font-mono text-xs">
          {trace.logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 py-0.5">
              <span className="text-[#c2c6d7] text-[11px] shrink-0">[{log.time}]</span>
              <span className={`text-[11px] font-bold px-1.5 rounded ${
                log.status === 'FLAG'
                  ? 'bg-[#93000a]/20 text-[#ffb4ab]'
                  : 'bg-[#10b981]/20 text-[#10b981]'
              }`}>
                {log.status}
              </span>
              <span className="text-[#e3e1e9] text-xs leading-relaxed">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
