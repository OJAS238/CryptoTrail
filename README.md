# CryptoTrail — Merge Conflictors

## 1. Project Information

- **PS ID:** SIH26182 (numeric ID: 26182)
- **PS Title:** Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs
- **Project:** CryptoTrail
- **Team:** Merge Conflictors
- **Category:** Software
- **Theme:** Blockchain & Cybersecurity

## 2. Problem Statement

Investigators may encounter cryptocurrency wallets whose associated exchange or virtual asset service provider is unknown. Following transfers manually across intermediary wallets is time-consuming. A tool is needed to identify possible paths to known VASP addresses and present the supporting evidence clearly.

## 3. Proposed Solution

CryptoTrail traces outgoing Ethereum transfers, compares destination addresses with a local VASP-label dataset, and ranks candidate matches using path length, estimated value share and match type. An optional Groq explanation translates the trace into a short plain-English summary. Results are investigative leads, not proof of wallet ownership or wrongdoing.

## 4. Key Features

- Bounded tracing through up to four transfer hops.
- Exact address matching against an imported VASP-label dataset.
- Transparent heuristic confidence scoring.
- Fund-flow visualization, node details and JSON export.
- Optional AI-generated explanation, with a rule-based fallback.
- Illustrative two-hop demo for reproducible demonstration without Etherscan.

## 5. Technology Stack

React, TypeScript, Vite and Tailwind CSS frontend; Node.js, Express and TypeScript backend; Etherscan transaction API; local JSON storage; Groq Chat Completions API; Vitest tests. Dependencies are defined in package.json and package-lock.json, not Python requirements.txt.

## 6. Architecture

See [architecture and limitations](docs/architecture.md).

Browser → frontend → Express API → Etherscan + local VASP labels → tracing/scoring → optional Groq explanation → result.

## 7. Repository Structure

- `frontend/`: application interface and frontend dependencies.
- `backend/src/`: actual backend source and tests (not a nested Git pointer).
- `docs/`: architecture and technical notes.
- `assets/screenshots/`: project screenshot guidance and available evidence.
- `submission/`: presentation and demo-video links.
- `SUBMISSION_GUIDE.md`: submission checklist.

The NSUT template permits normal project source folders, so frontend/backend paths are retained rather than moved into a redundant src folder.

## 8. Final Presentation

[Merge Conflictors — Final Presentation](https://docs.google.com/presentation/d/1mHTnKbTJIUkAMRgJX3NKEwvXhhsfTBJ4/edit)

See [presentation details](submission/PRESENTATION.md). Public viewer access must be checked before submission.

## 9. Demo Video

[Watch the CryptoTrail demonstration](https://www.loom.com/share/262337fe147441acaa05fb56bdc554fd)

See [demo details](submission/DEMO.md).

## 10. Screenshots

See [screenshot index](assets/screenshots/README.md). Add current screenshots of the home page, multi-hop result and AI summary before the final submission.

## 11. Installation

Install Node.js 22 or later and npm. From the repository root:

```sh
npm install
```

Copy `.env.example` to `.env`. Set `ETHERSCAN_API_KEY` for live tracing. Set `GROQ_API_KEY` for AI summaries; the default model is `openai/gpt-oss-20b`. Never commit `.env` or share your keys.

Import your curated Ethereum account labels for live VASP matching:

```sh
npm run import-dataset -- /path/to/accounts.json
```

A VASP dataset is not bundled. The two-hop illustrative demo is independent of the imported dataset.

## 12. Run and Test

Backend terminal, from the repository root:

```sh
npm run dev -w backend
```

Frontend terminal, from the repository root:

```sh
npm run dev -w frontend
```

Open the frontend URL printed by Vite (normally port 3000). Backend health: http://localhost:3001/api/health. Keep both terminals running.

```sh
npm test
npm run build
```

To prepare the direct demo cache, run `npm run seed-demo`; those cache entries expire after 15 minutes. Live requests require working external API access. AI failures preserve trace results and use an honestly labelled fallback.

## 13. Team Members and Roles

### Ojas — Backend architecture and integration lead

- Overall backend architecture and integration.
- API endpoint design: `/api/cryptotrail/trace`, `/api/trace-wallet`, `/api/demo/multihop`.
- Frontend/backend adapter and null-safety fixes.
- Final demo coordination and live presentation.

### Ashutosh — Blockchain API and dataset integration

- Etherscan transaction fetching.
- VASP dataset (`eth-labels`) matching logic.
- Backend testing with real wallet addresses.

### Shivansh — Tracing, scoring and AI

- Multi-hop path-finding algorithm.
- Confidence-scoring logic.
- Groq AI/LLM explanation layer.

### Piyush — Frontend and visual design

- React/TypeScript UI components.
- Layout, styling and graph visualization.

### Ishika — Frontend testing and demo flow

- UI components and frontend testing.
- Multi-hop demo flow and interface refinement.

### Ritesh — Presentation and submission

- PPT and pitch deck creation.
- SIH portal submission and documentation.
- Demo script and presentation support.

## 14. Future Scope

Support additional chains and token transfers, improve transaction-order-aware tracing and converging-path handling, expand verified VASP labels, and add robust deployment authentication and rate limits.

## Limitations

Ethereum only; four-hop depth limit with wallet/time budgets. Partial results are labelled. Confidence scores are heuristics, not probabilities. The illustrative demo is not verified on-chain activity. USD values, mixer-risk assessment and some transaction metadata are unavailable. Exchange ownership requires independent verification.

Submission structure adapted from [NSUT-SIH-DEMO](https://github.com/NSUT-SIH-26/NSUT-SIH-DEMO). The template's software license has not been applied to this project's code automatically.

## Current uploaded frontend integration status
The frontend currently in the submitted GitHub repository still calls buildDetailedTrace() from mockData.ts. The connected frontend tested locally is in a different folder and has not been substituted in this documentation update. Replace or merge that data-loading integration before claiming the GitHub checkout runs the live backend from its UI. The documented backend endpoints are available independently.

