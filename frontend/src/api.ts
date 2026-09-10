export interface BackendTrace {
  sourceAddress: string;
  nodes: { id: string; address: string; kind: string; label: string; depth: number }[];
  edges: { id: string; source: string; target: string; hash: string; valueWei: string }[];
  candidates: { name: string; address: string; confidence: number; label: string; valueShare: number; valueWei: string; hops: number; matchType: string; scoreBreakdown: { hopScore: number; valueScore: number; matchScore: number } }[];
  explanation: string;
  summary?: { text: string; source: 'ai' | 'template'; reason?: string };
  cached: boolean;
  demo?: boolean;
  hiddenTransactions: number;
}
export async function requestTrace(address: string, demo = false): Promise<BackendTrace> {
  const response = await fetch(demo ? '/api/demo/multihop' : '/api/trace-wallet', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }), signal: AbortSignal.timeout(180000)
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('Backend unavailable. Start the backend on port 3001 and try again.'); }
  if (!response.ok) throw new Error(data.error || 'Trace failed. Please try again.');
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges) || !Array.isArray(data.candidates)) throw new Error('The backend returned an invalid trace.');
  return data;
}

// ---------------------------------------------------------------------------
// CryptoTrail adapter endpoint — returns data already shaped for this
// frontend's TraceResult type (see backend README, "Restored CryptoTrail
// frontend adapter" section). Use this instead of requestTrace() when
// feeding NewTraceView / TraceGraphView / NodeDossierModal.
//
// NOTE: Several fields on the returned nodes (amountUsd, gasUsedGwei,
// blockNumber, riskLevel, etc.) may come back as null, since the real
// backend does not compute forensic/risk data the original mock did.
// Any component reading those fields must null-check before formatting
// (see TraceGraphView.tsx / NodeDossierModal.tsx for the null-safe
// helpers added alongside this).
// ---------------------------------------------------------------------------
export async function requestCryptoTrailTrace(
  address: string,
  chain: string = 'Ethereum',
  demo = false
): Promise<any> {
  const body = demo ? { demo: 'multihop', chain } : { address, chain };

  const response = await fetch('http://localhost:3001/api/cryptotrail/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180000),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Backend unavailable. Start the backend on port 3001 and try again.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Trace failed. Please try again.');
  }

  return data;
}