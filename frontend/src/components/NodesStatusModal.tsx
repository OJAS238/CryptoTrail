import React, { useState } from 'react';
import { X, Server, Activity, CheckCircle, RefreshCw, Radio, Zap } from 'lucide-react';
import { INITIAL_CLUSTERS } from '../data/mockData';
import { NodeClusterInfo } from '../types';

interface NodesStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NodesStatusModal: React.FC<NodesStatusModalProps> = ({ isOpen, onClose }) => {
  const [clusters, setClusters] = useState<NodeClusterInfo[]>(INITIAL_CLUSTERS);
  const [isPinging, setIsPinging] = useState(false);

  if (!isOpen) return null;

  const handlePingAll = () => {
    setIsPinging(true);
    setTimeout(() => {
      setClusters(prev =>
        prev.map(c => ({
          ...c,
          latencyMs: Math.max(10, Math.floor(c.latencyMs + (Math.random() * 8 - 4))),
          mempoolTps: Math.floor(c.mempoolTps + (Math.random() * 120 - 60))
        }))
      );
      setIsPinging(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-[#121318] border border-[#292a2f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1f25] bg-[#1a1b21]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#292a2f] text-[#ff6b00]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#e3e1e9] flex items-center gap-2">
                CryptoTrail Node Ingest Clusters
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                  HEALTHY 99.98%
                </span>
              </h2>
              <p className="text-xs text-[#c2c6d7]">
                Global low-latency mempool listeners & multi-hop graph resolution nodes
              </p>
            </div>
          </div>
          <button
            id="close-nodes-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#c2c6d7] hover:text-white hover:bg-[#292a2f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Telemetry summary */}
        <div className="grid grid-cols-3 gap-3 p-6 bg-[#0d0e13] border-b border-[#1e1f25]">
          <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
            <div className="text-[11px] font-mono uppercase text-[#c2c6d7] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ff6b00]" />
              Global Mempool TPS
            </div>
            <div className="text-xl font-bold font-mono text-[#ffb693] mt-1">
              12,400 <span className="text-xs font-normal text-[#c2c6d7]">tx/s</span>
            </div>
          </div>

          <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
            <div className="text-[11px] font-mono uppercase text-[#c2c6d7] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#9ccaff]" />
              Synced Block Height
            </div>
            <div className="text-xl font-bold font-mono text-[#9ccaff] mt-1">
              #19,482,103
            </div>
          </div>

          <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f]">
            <div className="text-[11px] font-mono uppercase text-[#c2c6d7] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#10b981]" />
              Connected Peers
            </div>
            <div className="text-xl font-bold font-mono text-[#10b981] mt-1">
              550 <span className="text-xs font-normal text-[#c2c6d7]">nodes</span>
            </div>
          </div>
        </div>

        {/* Cluster List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#c2c6d7] tracking-wider">
              Active Ingest Nodes ({clusters.length})
            </span>
            <button
              id="btn-ping-clusters"
              type="button"
              onClick={handlePingAll}
              disabled={isPinging}
              className="flex items-center gap-1.5 text-xs font-mono text-[#ffb693] hover:text-[#ff6b00] disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              Ping Cluster Latencies
            </button>
          </div>

          {clusters.map(cluster => (
            <div
              key={cluster.id}
              className="p-4 bg-[#1a1b21] hover:bg-[#1e1f25] border border-[#292a2f] rounded-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    cluster.status === 'OPTIMAL' ? 'bg-[#10b981] animate-pulse' : 'bg-[#ff6b00]'
                  }`} />
                  <div>
                    <div className="font-semibold text-sm text-[#e3e1e9] flex items-center gap-2">
                      {cluster.region}
                      <span className="text-xs font-normal text-[#c2c6d7] font-mono">
                        ({cluster.location})
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#c2c6d7]/80 truncate max-w-sm">
                      {cluster.endpoint}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[#c2c6d7] block text-[10px]">PING</span>
                    <span className={`font-semibold ${
                      cluster.latencyMs < 30 ? 'text-[#10b981]' : cluster.latencyMs < 60 ? 'text-[#ffb693]' : 'text-[#ff6b00]'
                    }`}>
                      {cluster.latencyMs}ms
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#c2c6d7] block text-[10px]">INGEST RATE</span>
                    <span className="text-[#9ccaff]">
                      {cluster.mempoolTps} tps
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#c2c6d7] block text-[10px]">STATUS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#292a2f] text-[#e3e1e9]">
                      {cluster.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#1a1b21] border-t border-[#1e1f25] flex justify-between items-center text-xs font-mono text-[#c2c6d7]">
          <span>CRYPTOTRAIL 0xV4 TELEMETRY PROXY</span>
          <button
            id="close-nodes-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9] rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
