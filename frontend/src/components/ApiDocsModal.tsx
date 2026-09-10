import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, ShieldAlert } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'node'>('curl');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlExample = `curl -X POST "https://api.cryptotrail.io/v2/trace/deterministic" \\
  -H "Authorization: Bearer ct_live_institutional_9482103" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "chain": "ethereum",
    "max_depth_hops": 4,
    "peel_threshold": 0.05,
    "resolve_exchange_tags": true
  }'`;

  const pythonExample = `import requests

client = requests.post(
    "https://api.cryptotrail.io/v2/trace/deterministic",
    headers={"Authorization": "Bearer ct_live_institutional_9482103"},
    json={
        "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "chain": "ethereum",
        "max_depth_hops": 4,
        "resolve_exchange_tags": True
    }
)

trace_data = client.json()
print("Attributed CEX:", trace_data["attribution"]["exchange"])
print("Confidence Score:", trace_data["attribution"]["confidence"])`;

  const nodeExample = `import { CryptoTrailClient } from '@cryptotrail/sdk';

const tracer = new CryptoTrailClient({
  apiKey: process.env.CRYPTOTRAIL_API_KEY,
  chain: 'ethereum'
});

const result = await tracer.traceWallet({
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  depthBoundary: 4,
  detectMixers: true
});

console.log('Attributed Destination:', result.receivingExchange);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-[#121318] border border-[#292a2f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1f25] bg-[#1a1b21]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff6b00]/20 text-[#ff6b00]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#e3e1e9] flex items-center gap-2">
                CryptoTrail Forensic API
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#292a2f] text-[#ffb693]">
                  v2.4.0 REST & WEBSOCKET
                </span>
              </h2>
              <p className="text-xs text-[#c2c6d7]">
                Deterministic multi-hop peel chain traversal & exchange attribution endpoints
              </p>
            </div>
          </div>
          <button
            id="close-api-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#c2c6d7] hover:text-white hover:bg-[#292a2f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoints overview */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-[#c2c6d7] tracking-wider">
              Core Endpoints
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#ff6b00]/20 text-[#ffb693] border border-[#ff6b00]/30">
                    POST
                  </span>
                  <span className="font-mono text-xs text-[#e3e1e9]">
                    /v2/trace/deterministic
                  </span>
                </div>
                <span className="text-xs text-[#c2c6d7]">Initiate real-time peel scan traversal</span>
              </div>

              <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#9ccaff]/20 text-[#9ccaff] border border-[#9ccaff]/30">
                    GET
                  </span>
                  <span className="font-mono text-xs text-[#e3e1e9]">
                    /v2/exchange/attributions/{'{cluster_id}'}
                  </span>
                </div>
                <span className="text-xs text-[#c2c6d7]">Query institutional hot wallet cluster registry</span>
              </div>

              <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#292a2f] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                    WSS
                  </span>
                  <span className="font-mono text-xs text-[#e3e1e9]">
                    wss://stream.cryptotrail.io/v2/mempool/hops
                  </span>
                </div>
                <span className="text-xs text-[#c2c6d7]">Stream zero-latency mempool peel splits</span>
              </div>
            </div>
          </div>

          {/* Code Snippet Tabs */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1 p-1 bg-[#1a1b21] rounded-lg border border-[#292a2f]">
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    activeTab === 'curl' ? 'bg-[#ff6b00] text-[#121318] font-bold' : 'text-[#c2c6d7] hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveTab('python')}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    activeTab === 'python' ? 'bg-[#ff6b00] text-[#121318] font-bold' : 'text-[#c2c6d7] hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveTab('node')}
                  className={`px-3 py-1 text-xs font-mono rounded ${
                    activeTab === 'node' ? 'bg-[#ff6b00] text-[#121318] font-bold' : 'text-[#c2c6d7] hover:text-white'
                  }`}
                >
                  TypeScript
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const code = activeTab === 'curl' ? curlExample : activeTab === 'python' ? pythonExample : nodeExample;
                  copyToClipboard(code, 'snippet');
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-[#ffb693] hover:text-[#ff6b00] cursor-pointer"
              >
                {copiedKey === 'snippet' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'snippet' ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#0d0e13] border border-[#292a2f] rounded-xl font-mono text-xs text-[#e3e1e9] overflow-x-auto leading-relaxed">
              <pre>
                {activeTab === 'curl' && curlExample}
                {activeTab === 'python' && pythonExample}
                {activeTab === 'node' && nodeExample}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#1a1b21] border-t border-[#1e1f25] flex justify-between items-center text-xs font-mono text-[#c2c6d7]">
          <span>AUTHENTICATION: INST-BEARER-TOKENS</span>
          <button
            id="close-api-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9] rounded-lg transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
