import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NewTraceView } from './components/NewTraceView';
import { HistoryView } from './components/HistoryView';
import { NodesStatusModal } from './components/NodesStatusModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { NodeDossierModal } from './components/NodeDossierModal';
import { INITIAL_HISTORY, buildDetailedTrace } from './data/mockData';
import { TraceResult, TraceHopNode, HistoryItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'new-trace' | 'history'>('new-trace');
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [activeTrace, setActiveTrace] = useState<TraceResult | null>(null);
  const [selectedNode, setSelectedNode] = useState<TraceHopNode | null>(null);
  const [isNodesModalOpen, setIsNodesModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Handle trace completed by NewTraceView
  const handleTraceComplete = (result: TraceResult) => {
    setActiveTrace(result);

    const dexSwapsCount = result.nodes.filter(n => n.entityType === 'dex_pool' || n.entityType === 'bridge').length;
    const executionDuration = `${(result.avgLatencyMs / 1000).toFixed(2)}s`;
    const shortAddr = result.queryAddress.length > 14 
      ? `${result.queryAddress.substring(0, 6)}...${result.queryAddress.substring(result.queryAddress.length - 4)}` 
      : result.queryAddress;
    
    const summaryText = result.flaggedMixers
      ? `CRITICAL ALERT: Forensic heuristic engine detected high-risk mixing operations along the path originating from ${shortAddr} on ${result.chain}. Capital moved through privacy obfuscation pools before resolving terminal deposit attribution to ${result.attributionExchange} with ${result.confidenceScore}% certainty.`
      : `Deterministic heuristic traversal originating from ${shortAddr} on ${result.chain} completed across ${result.totalHops} transactional hops (${executionDuration}). Identified flow of ${result.volumeTracedEth.toFixed(1)} ETH ($${result.volumeTracedUsd.toLocaleString()}) routing directly to ${result.attributionExchange} with ${result.confidenceScore}% certainty.`;

    const miniFlow = result.nodes.map((node, idx) => ({
      label: node.label || node.entityName,
      type: node.entityType,
      subLabel: node.entityName,
      isTerminal: idx === result.nodes.length - 1
    }));

    // Check if item exists in history, otherwise prepend
    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      queryAddress: result.queryAddress,
      chain: result.chain,
      timestamp: result.timestamp,
      targetExchange: result.attributionExchange,
      hopsCount: result.totalHops,
      confidence: result.confidenceScore,
      amountEth: result.volumeTracedEth,
      amountUsd: result.volumeTracedUsd,
      riskLevel: result.flaggedMixers ? 'critical' : 'low',
      hasMixer: result.flaggedMixers,
      peelScanMode: `${result.totalHops} Hops Traversal`,
      summaryText,
      dexSwapsCount,
      executionDuration,
      miniFlow
    };

    setHistory(prev => [newHistoryItem, ...prev.filter(h => h.queryAddress.toLowerCase() !== result.queryAddress.toLowerCase())]);
  };

  // Handle user clicking "View Graph" on a past history item
  const handleSelectHistoryItem = (item: HistoryItem) => {
    const trace = buildDetailedTrace(item.queryAddress, item.chain);
    setActiveTrace(trace);
    setCurrentTab('new-trace');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleResetTrace = () => {
    setActiveTrace(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121318] text-[#e3e1e9] flex flex-col font-sans selection:bg-[#ff6b00]/30 selection:text-[#ffb693]">
      {/* Persistent Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        historyCount={history.length}
        onOpenNodesModal={() => setIsNodesModalOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'new-trace' && (
          <NewTraceView
            onTraceComplete={handleTraceComplete}
            activeTrace={activeTrace}
            onSelectNode={node => setSelectedNode(node)}
            onResetTrace={handleResetTrace}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onNewTraceClick={() => {
              setCurrentTab('new-trace');
              setActiveTrace(null);
            }}
          />
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenNodesModal={() => setIsNodesModalOpen(true)}
      />

      {/* Node Dossier Deep Inspection Modal */}
      <NodeDossierModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* Node Ingest Clusters & Telemetry Modal */}
      <NodesStatusModal
        isOpen={isNodesModalOpen}
        onClose={() => setIsNodesModalOpen(false)}
      />

      {/* REST & WebSocket API Documentation Modal */}
      <ApiDocsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
}
