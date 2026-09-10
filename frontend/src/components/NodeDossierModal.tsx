import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldAlert, ShieldCheck, AlertTriangle, Cpu, Tag, Layers, ArrowRight } from 'lucide-react';
import { TraceHopNode } from '../types';

interface NodeDossierModalProps {
  node: TraceHopNode | null;
  onClose: () => void;
}

export const NodeDossierModal: React.FC<NodeDossierModalProps> = ({ node, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!node) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-[#93000a]/20 border-[#ffb4ab]/30 text-[#ffb4ab]',
          icon: <ShieldAlert className="w-4 h-4 text-[#ffb4ab]" />,
          label: 'CRITICAL RISK: OFAC / MIXER'
        };
      case 'high':
        return {
          bg: 'bg-[#ff6b00]/20 border-[#ff6b00]/30 text-[#ffb693]',
          icon: <AlertTriangle className="w-4 h-4 text-[#ffb693]" />,
          label: 'HIGH RISK: OBFUSCATED PEEL'
        };
      case 'medium':
        return {
          bg: 'bg-[#059eff]/20 border-[#9ccaff]/30 text-[#9ccaff]',
          icon: <AlertTriangle className="w-4 h-4 text-[#9ccaff]" />,
          label: 'MODERATE: MULTI-HOP RELAY'
        };
      default:
        return {
          bg: 'bg-[#10b981]/20 border-[#10b981]/30 text-[#10b981]',
          icon: <ShieldCheck className="w-4 h-4 text-[#10b981]" />,
          label: 'VERIFIED ENTITY'
        };
    }
  };

  const riskBadge = getRiskBadge(node.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-[#121318] border border-[#292a2f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1f25] bg-[#1a1b21]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#ff6b00] text-[#121318] flex items-center justify-center font-mono font-bold text-xs">
              H{node.hopIndex}
            </span>
            <div>
              <h2 className="font-semibold text-base text-[#e3e1e9] flex items-center gap-2">
                {node.entityName}
              </h2>
              <span className="font-mono text-xs text-[#c2c6d7] uppercase tracking-wider">
                {node.label}
              </span>
            </div>
          </div>
          <button
            id="close-node-dossier"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#c2c6d7] hover:text-white hover:bg-[#292a2f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Risk Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${riskBadge.bg}`}>
            <div className="flex items-center gap-2.5 font-mono text-xs font-semibold">
              {riskBadge.icon}
              <span>{riskBadge.label}</span>
            </div>
            <span className="font-mono text-[11px]">
              CONFIDENCE 99.4%
            </span>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
              <span className="text-[10px] font-mono uppercase text-[#c2c6d7] block">Traced Volume</span>
              <span className="font-mono font-bold text-sm text-[#ffb693] block mt-0.5">
                {node.amountEth.toFixed(2)} ETH
              </span>
              <span className="text-[10px] font-mono text-[#c2c6d7]">
                ≈ ${(node.amountUsd).toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
              <span className="text-[10px] font-mono uppercase text-[#c2c6d7] block">Block Height</span>
              <span className="font-mono font-bold text-sm text-[#9ccaff] block mt-0.5">
                #{node.blockNumber}
              </span>
              <span className="text-[10px] font-mono text-[#c2c6d7]">
                {node.timestamp}
              </span>
            </div>

            <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
              <span className="text-[10px] font-mono uppercase text-[#c2c6d7] block">Gas Consumed</span>
              <span className="font-mono font-bold text-sm text-[#e3e1e9] block mt-0.5">
                {node.gasUsedGwei} Gwei
              </span>
              <span className="text-[10px] font-mono text-[#10b981]">
                Optimal Execution
              </span>
            </div>

            <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
              <span className="text-[10px] font-mono uppercase text-[#c2c6d7] block">Flow Forwarded</span>
              <span className="font-mono font-bold text-sm text-[#ff6b00] block mt-0.5">
                {node.details.flowPct.toFixed(1)}%
              </span>
              <span className="text-[10px] font-mono text-[#c2c6d7]">
                Peel Retained {(100 - node.details.flowPct).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Cryptographic Identifiers */}
          <div className="space-y-3">
            <div className="p-3 bg-[#0d0e13] rounded-xl border border-[#292a2f] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[#c2c6d7] uppercase">Address Identifier</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(node.address, 'addr')}
                  className="flex items-center gap-1 font-mono text-[#ffb693] hover:text-[#ff6b00] text-[11px]"
                >
                  {copiedKey === 'addr' ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'addr' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-xs text-[#e3e1e9] break-all select-all bg-[#121318] p-2 rounded border border-[#1e1f25]">
                {node.address}
              </div>
            </div>

            <div className="p-3 bg-[#0d0e13] rounded-xl border border-[#292a2f] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[#c2c6d7] uppercase">Attributed Transaction Hash</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(node.txHash, 'tx')}
                  className="flex items-center gap-1 font-mono text-[#ffb693] hover:text-[#ff6b00] text-[11px]"
                >
                  {copiedKey === 'tx' ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'tx' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-xs text-[#e3e1e9] break-all select-all bg-[#121318] p-2 rounded border border-[#1e1f25]">
                {node.txHash}
              </div>
            </div>
          </div>

          {/* Heuristic Details */}
          <div className="p-4 bg-[#1a1b21] rounded-xl border border-[#292a2f] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#ffb693] uppercase font-bold">
              <Cpu className="w-4 h-4" />
              Algorithmic Heuristic Resolution
            </div>
            <p className="text-xs text-[#c2c6d7] leading-relaxed">
              {node.details.heuristicMethod}
            </p>

            {node.details.destinationMemo && (
              <div className="p-2.5 bg-[#121318] rounded border border-[#ff6b00]/30 flex items-center justify-between text-xs font-mono">
                <span className="text-[#c2c6d7]">Exchange Deposit Tag / Memo:</span>
                <span className="text-[#ff6b00] font-bold">{node.details.destinationMemo}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {node.details.clusterTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#292a2f] text-[#c2c6d7] border border-[#38393f]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Risk Factors List */}
          {node.riskFactors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#c2c6d7] block">
                Forensic Risk Assessment Flags
              </span>
              <div className="space-y-1">
                {node.riskFactors.map((factor, i) => (
                  <div 
                    key={i} 
                    className="p-2 bg-[#1a1b21] rounded-lg border border-[#292a2f] flex items-center gap-2 text-xs text-[#e3e1e9]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#1a1b21] border-t border-[#1e1f25] flex justify-between items-center">
          <a
            href={`https://etherscan.io/address/${node.address}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[#9ccaff] hover:text-[#ffb693] transition-colors"
          >
            <span>View on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            id="btn-close-dossier"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9] text-xs font-semibold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
