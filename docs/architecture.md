# Architecture

## Request flow

1. React sends an Ethereum address to the Express adapter endpoint.
2. The backend checks its trace cache, otherwise retrieves outgoing Ethereum transactions from Etherscan.
3. The tracer explores bounded paths and stops expanding matched VASP destinations.
4. Local labels identify VASP addresses. Heuristic scoring combines path length, estimated value share and match type.
5. Groq optionally turns the source, edges, intermediate nodes and candidates into a short explanation. Timeout/failure does not discard the trace.
6. The adapter returns a connected path for the UI; rawTrace retains the complete graph and candidates.

## API

- GET `/api/health`: backend liveness.
- POST `/api/cryptotrail/trace`: UI-compatible result. Body: address and chain `ethereum`, or demo `multihop`.
- POST `/api/trace-wallet` (alias `/api/trace`): raw trace result.
- POST `/api/demo/multihop`: illustrative two-hop fixture through the actual tracing algorithm.

## Storage and configuration

JSON VASP labels and trace cache are stored locally; cache expires after 15 minutes and invalidates on label changes. Run only one process per store. API credentials are read from the repository-root .env; they must remain server-side.

## Interpretation

Wallets are expanded once, so converging paths may be undercounted. Same-second transfers are excluded. Allocation estimates do not establish ownership of funds. The UI path is not the full graph; exported rawTrace includes all explored evidence. The tool does not currently provide mixer detection, USD pricing, authentication, or production-grade service hardening.
