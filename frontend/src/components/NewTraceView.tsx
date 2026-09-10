import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  X, 
  ChevronDown, 
  Network, 
  Gauge, 
  ShieldCheck, 
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PRESETS } from '../data/mockData';
import { SupportedChain, TracePreset, TraceResult, TraceHopNode } from '../types';
import { TraceGraphView } from './TraceGraphView';

interface NewTraceViewProps {
  onTraceComplete: (result: TraceResult) => void;
  activeTrace: TraceResult | null;
  onSelectNode: (node: TraceHopNode) => void;
  onResetTrace: () => void;
}

export const NewTraceView: React.FC<NewTraceViewProps> = ({
  onTraceComplete,
  activeTrace,
  onSelectNode,
  onResetTrace,
}) => {
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('Ethereum');
  const [chainMenuOpen, setChainMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Chains available for selector
  const chains: { name: SupportedChain; type: 'eth' | 'sol' | 'arb'; color: string }[] = [
    { name: 'Ethereum', type: 'eth', color: '#ffb693' },
    { name: 'Solana', type: 'sol', color: '#9ccaff' },
    { name: 'Arbitrum', type: 'arb', color: '#dee2f4' }
  ];

  const selectChain = (chain: SupportedChain) => {
    setSelectedChain(chain);
    setChainMenuOpen(false);
  };

  const applyPreset = (preset: TracePreset) => {
    setInputValue(preset.address);
    setSelectedChain(preset.chain);
    setValidationError(null);
  };

  const clearInput = () => {
    setInputValue('');
    setValidationError(null);
  };

  const handleStartTrace = (addressOverride?: string, chainOverride?: SupportedChain) => {
    const targetAddr = (addressOverride || inputValue).trim();
    if (!targetAddr) {
      setValidationError('Please enter a wallet address or transaction hash');
      return;
    }

    setValidationError(null);
    setIsScanning(true);
    setScanStep(1);

    // Sequence the heuristic scan steps
    const t1 = setTimeout(() => setScanStep(2), 500);
    const t2 = setTimeout(() => setScanStep(3), 1100);
    const t3 = setTimeout(() => {
      setScanStep(4);
      const targetChain = chainOverride || selectedChain;
      import('../data/mockData').then(({ buildDetailedTrace }) => {
        const result = buildDetailedTrace(targetAddr, targetChain);
        onTraceComplete(result);
        setIsScanning(false);
        setScanStep(0);
      });
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <div className="flex flex-col w-full items-center px-4 sm:px-6 py-12">
      {/* Interactive Ambient Glow Backdrop */}
      <div className="relative w-full max-w-[760px] flex flex-col items-center">
        {/* Top Radial Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#ff6b00]/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header / Mission Framing Section */}
        <div className="flex flex-col items-center text-center w-full z-10">
          {/* Tag / Pulse Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#1a1b21] border border-[#292a2f] rounded-full shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b00]"></span>
            </span>
            <span className="font-mono text-xs text-[#ffb693] tracking-widest uppercase font-medium">
              Deterministic Path Tracer
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#e3e1e9] tracking-tight max-w-[680px] leading-tight">
            Trace wallet transfers to receiving exchanges.
          </h1>

          {/* Secondary Subtitle */}
          <p className="mt-4 text-base text-[#c2c6d7] max-w-[560px] leading-relaxed">
            Real-time heuristic path traversal across automated liquidity pools, mixers, and multi-hop peel chains with algorithmic certainty.
          </p>
        </div>

        {/* Live Execution / Search Component */}
        <div className="w-full mt-8 z-20">
          <div className="w-full p-1 bg-[#1a1b21] border border-[#292a2f] rounded-xl shadow-xl transition-all duration-200 focus-within:border-[#ff6b00]/50 focus-within:shadow-[#ff6b00]/5">
            <form
              id="traceForm"
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full"
              onSubmit={e => {
                e.preventDefault();
                handleStartTrace();
              }}
            >
              {/* Chain Selector Dropdown */}
              <div className="relative">
                <button
                  id="chainDropdownBtn"
                  type="button"
                  onClick={() => setChainMenuOpen(!chainMenuOpen)}
                  className="h-12 sm:h-14 px-4 bg-[#1e1f25] hover:bg-[#292a2f] rounded-lg flex items-center justify-between gap-2.5 text-[#e3e1e9] transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {selectedChain === 'Ethereum' && (
                      <svg className="w-4 h-4 text-[#ffb693]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                      </svg>
                    )}
                    {selectedChain === 'Solana' && (
                      <svg className="w-4 h-4 text-[#9ccaff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.5 19.5h14.7l4.3-4.3H6.8L2.5 19.5zm4.3-15H21.5L17.2 8.8H2.5L6.8 4.5zm0 7.5H21.5L17.2 16.3H2.5l4.3-4.3z" />
                      </svg>
                    )}
                    {selectedChain === 'Arbitrum' && (
                      <svg className="w-4 h-4 text-[#dee2f4]" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    )}
                    <span className="text-xs font-semibold tracking-wide text-[#e3e1e9]">
                      {selectedChain}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#c2c6d7]" />
                </button>

                {/* Dropdown Menu */}
                {chainMenuOpen && (
                  <div 
                    id="chainMenu"
                    className="absolute top-full left-0 mt-1 w-44 p-1 bg-[#292a2f] border border-[#38393f] rounded-lg shadow-2xl z-50 animate-in fade-in duration-100"
                  >
                    {chains.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => selectChain(c.name)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors text-xs font-medium cursor-pointer ${
                          selectedChain === c.name 
                            ? 'bg-[#1e1f25] text-[#ff6b00]' 
                            : 'text-[#e3e1e9] hover:bg-[#1e1f25]'
                        }`}
                      >
                        {c.name === 'Ethereum' && (
                          <svg className="w-3.5 h-3.5 text-[#ffb693]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>
                        )}
                        {c.name === 'Solana' && (
                          <svg className="w-3.5 h-3.5 text-[#9ccaff]" fill="currentColor" viewBox="0 0 24 24"><path d="M2.5 19.5h14.7l4.3-4.3H6.8L2.5 19.5zm4.3-15H21.5L17.2 8.8H2.5L6.8 4.5zm0 7.5H21.5L17.2 16.3H2.5l4.3-4.3z" /></svg>
                        )}
                        {c.name === 'Arbitrum' && (
                          <svg className="w-3.5 h-3.5 text-[#dee2f4]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
                        )}
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Monospace Address Input Field */}
              <div className="relative flex-1">
                <input
                  id="traceInput"
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={inputValue}
                  onChange={e => {
                    setInputValue(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter wallet address or transaction hash (0x...)"
                  className="w-full h-12 sm:h-14 px-4 pr-10 bg-[#0d0e13] text-[#e3e1e9] font-mono text-xs sm:text-sm placeholder:text-[#c2c6d7]/50 rounded-lg focus:outline-none focus:bg-[#1e1f25] border border-transparent focus:border-[#292a2f] transition-all"
                />
                {inputValue && (
                  <button
                    id="clearBtn"
                    type="button"
                    onClick={clearInput}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c2c6d7] hover:text-[#e3e1e9] p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                id="submitBtn"
                type="submit"
                disabled={isScanning}
                className="h-12 sm:h-14 px-6 bg-[#ff6b00] hover:opacity-90 active:scale-98 text-[#121318] font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <span>{isScanning ? 'Scanning...' : 'Start Trace'}</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>
            </form>
          </div>

          {/* Validation message */}
          {validationError && (
            <div className="mt-2 text-xs font-mono text-[#ffb4ab] flex items-center gap-1.5 px-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Presets & Sample Shortcuts Section */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="font-mono text-[11px] text-[#c2c6d7] uppercase tracking-wider">
              FAST PRESETS:
            </span>

            {PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  applyPreset(preset);
                  handleStartTrace(preset.address, preset.chain);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#292a2f] rounded-lg transition-all text-[#e3e1e9] group cursor-pointer"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  preset.tagColor === 'primary' ? 'bg-[#ff6b00]' : preset.tagColor === 'tertiary' ? 'bg-[#9ccaff]' : 'bg-[#ffb4ab]'
                }`} />
                <span className="font-medium text-xs text-[#e3e1e9]">{preset.name}</span>
                <span className="font-mono text-[11px] text-[#c2c6d7] group-hover:text-[#ffb693] transition-colors">
                  {preset.shortAddress}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tracing Output Sandbox (Animated on Scan) */}
        {isScanning && (
          <div 
            id="traceStatusPanel"
            className="w-full mt-6 p-4 bg-[#1a1b21] border border-[#ff6b00]/40 rounded-xl shadow-2xl transition-all animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-ping" />
                <span className="font-semibold text-sm text-[#e3e1e9]">Forensic Engine Active</span>
              </div>
              <span className="font-mono text-xs text-[#ffb693] truncate max-w-[260px]">
                {inputValue}
              </span>
            </div>

            {/* Progress Sequence Visualizer */}
            <div className="mt-3 flex flex-col gap-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[#c2c6d7]">
                <span>Parsing genesis parameters & initial gas limits...</span>
                <span className={scanStep >= 2 ? 'text-[#ff6b00]' : 'text-[#c2c6d7]'}>
                  {scanStep >= 2 ? '[COMPLETE]' : '[PROCESSING]'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#c2c6d7]">
                <span>Ingesting node cluster traces & resolving sub-graphs...</span>
                <span className={scanStep >= 3 ? 'text-[#ff6b00]' : 'text-[#9ccaff] animate-pulse'}>
                  {scanStep >= 3 ? '[COMPLETE]' : scanStep === 2 ? '[PROCESSING]' : '[PENDING]'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#c2c6d7]">
                <span>Attributing destination exchange hot wallet via institutional registries...</span>
                <span className={scanStep >= 4 ? 'text-[#ff6b00]' : 'text-[#9ccaff] animate-pulse'}>
                  {scanStep >= 4 ? '[COMPLETE]' : scanStep === 3 ? '[PROCESSING]' : '[PENDING]'}
                </span>
              </div>

              <div className="w-full bg-[#0d0e13] h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-[#ff6b00] h-full transition-all duration-300"
                  style={{ width: `${(scanStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Graph View if trace is active */}
        {activeTrace && !isScanning && (
          <TraceGraphView
            trace={activeTrace}
            onSelectNode={onSelectNode}
            onResetTrace={onResetTrace}
          />
        )}

        {/* Telemetry & Forensic Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-12 z-10">
          {/* Metric 1: Depth */}
          <div className="flex flex-col p-5 bg-[#1e1f25] border border-[#292a2f] rounded-xl shadow-sm hover:bg-[#292a2f] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#c2c6d7] uppercase tracking-wider">
                Depth Boundary
              </span>
              <Network className="w-5 h-5 text-[#ffb693]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#e3e1e9]">4 Hops</span>
              <span className="font-mono text-xs text-[#ffb693]">PEEL-SCAN</span>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-1 w-full bg-[#121318] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#ff6b00] w-4/5"></div>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#c2c6d7] leading-relaxed">
              Resolves multi-layered forwardings across mixed sub-graphs.
            </p>
          </div>

          {/* Metric 2: Latency */}
          <div className="flex flex-col p-5 bg-[#1e1f25] border border-[#292a2f] rounded-xl shadow-sm hover:bg-[#292a2f] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#c2c6d7] uppercase tracking-wider">
                Traversal Rate
              </span>
              <Gauge className="w-5 h-5 text-[#9ccaff]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#e3e1e9]">1.8s</span>
              <span className="font-mono text-xs text-[#9ccaff]">AVG MEMPOOL</span>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-1 w-full bg-[#121318] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#059eff] w-full"></div>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#c2c6d7] leading-relaxed">
              Parallelized RPC polling against low-latency ingest clusters.
            </p>
          </div>

          {/* Metric 3: Confidence */}
          <div className="flex flex-col p-5 bg-[#1e1f25] border border-[#292a2f] rounded-xl shadow-sm hover:bg-[#292a2f] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#c2c6d7] uppercase tracking-wider">
                Attribution
              </span>
              <ShieldCheck className="w-5 h-5 text-[#c2c6d7]" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#e3e1e9]">99.4%</span>
              <span className="font-mono text-xs text-[#c2c6d7]">CLUSTER CONF</span>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-1 w-full bg-[#121318] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#ffb693] w-[99.4%]"></div>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#c2c6d7] leading-relaxed">
              Deterministic entity identification via institutional registries.
            </p>
          </div>
        </div>

        {/* Protocol Signature / Monospace Telemetry Strip */}
        <div className="mt-12 pt-4 flex flex-wrap items-center justify-between gap-4 w-full border-t border-[#1e1f25]/50">
          <div className="flex items-center gap-3 text-xs font-mono text-[#c2c6d7]">
            <span>INGEST ENGINE: READY</span>
            <span>·</span>
            <span>MEMPOOL RECEPTOR: SYNCED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb693]"></span>
            <span className="font-mono text-xs text-[#c2c6d7]">
              CRYPTOTRAIL 0xV4 SECURE PROTOCOL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
