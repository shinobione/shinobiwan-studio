# SHINOBIWAN Studio — Changelog

This is the **current concise changelog**. Detailed per-build records live under `changelogs/` and accepted production receipts under `docs/acceptance/`.

## Current candidate

### v0.19.42 · Build120 — Catalogue A2.3 Slice 1 · 2026-09-27

One parent-owned private session across Catalogue routes; native snapshot-only Overview with dynamic counts, source date/private/temporary status and finding-code review groups opening filtered QA. A2.2 parser/provenance/cancellation retained. Responsive and keyboard refinements, development-only Chromium regression gate. Local full build/privacy and inherited tests PASS; no merge, deployment or REAL USER PASS. [Handoff](docs/CATALOGUE-A2-3-SLICE1-VALIDATION.md).

## Current accepted release

### v0.19.41 · Build119 — Catalogue A2.2 · 2026-09-27

Explicit local-private JSON selection, bundled-worker validation, provenance-preserving commercial normalization, atomic memory-only preview, pending QA/evidence and reset. [PR #242](https://github.com/shinobione/shinobiwan-studio/pull/242) merged at `20a0adf15271a0f9bff0cbd2a318c441685ec2bc`; exact-head [CI 36312536104](https://github.com/shinobione/shinobiwan-studio/actions/runs/36312536104) and [Pages 36316493317](https://github.com/shinobione/shinobiwan-studio/actions/runs/36316493317) SUCCESS. The owner reported bounded REAL USER PASS for source aggregates, QA, reset/unload, refresh-empty and no private upload or browser storage. [Receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md). No backend/persistence/publication actions; no A2.3 gallery. The derived source omits some original workbook evidence.

## Previous accepted release

### v0.19.40 · Build118 — 2026-09-27 reconciliation

Catalogue A2.1 native empty foundation passed the owner's original seven checks. Subsequent CPU corrections: backend lean Albums (#284), Studio consumer (#239), backend Tracks (#285), deployment workflow (#286), Studio shared reads (#240). All merged/deployed with bounded owner browser recovery. Sustained CPU compliance remains unmeasured and issues open. [Separate receipts](docs/acceptance/BUILD118-REAL-USER-PASS.md) · [CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md). Documentation closeout #241 merged at `8c6a67e`, Pages 36310871264 SUCCESS; it did not create a new runtime identity.

## Prior accepted reliability release

### v0.19.39 · Build117 — 2026-09-19

Codename: `studio-focus-build117-track-asset-sha256`  
Status: **REAL USER PASS — ACCEPTED**

Build117 adds exact-byte proof to Track asset uploads without widening write authority. Studio hashes the exact browser-selected file with SHA-256, Track Manager stores and rereads the digest as private R2 metadata, and Studio accepts normal success only when selected, response and private canonical digests match. Lost-response recovery requires a new canonical revision plus the same exact digest; unchanged revision is retry-safe not-committed, while changed state without exact proof is ambiguous and non-retryable.

A pre-merge production-use corrective also repaired a stale duration-evidence compatibility allowlist. Bounded inherited successors v5.26/v1.16, v5.27/v1.17 and v5.28/v1.18 are now explicitly authorized in both validation and resilient metadata save seams. No unbounded numeric successor gate was introduced.

```text
Backend PR               LaunchPAD-APP #282
Backend merge            4867a2fef673028b0474f949183944dd642af165
Track Manager            v5.28
Studio bridge            v1.18
Admin deploy             #49 · 35435618374 · SUCCESS · admin only
Studio PR                #234
Final candidate          b843acf030195b726725af2d0f7e148607b8b9bb
Studio CI                #737 · SUCCESS
Studio merge             a1f7641a3e2d39fe24ee6b6a51438fb8a1c88ae4
Studio Pages             #253 · SUCCESS build + deploy
Real-user smoke          SMOKED · production corrective path clean
Public Worker            unchanged
```

Real-user receipt: [`docs/acceptance/BUILD117-REAL-USER-PASS.md`](docs/acceptance/BUILD117-REAL-USER-PASS.md).

## Recent accepted predecessors

- **Build116 · v0.19.38** — Safe Track Delete; REAL USER PASS after contextual action corrective.
- **Build115 · v0.19.37** — Safe Album Delete; REAL USER PASS.
- **Build114 · v0.19.36** — Album-create operation identity; REAL USER PASS after null-year corrective.
- **Build113 · v0.19.35** — SoundCloud MUSIC Pack priority; REAL USER PASS.
- **Build112 · v0.19.34** — MUSIC Pack JSON V1 import foundation.
- **Build111 · v0.19.33** — Release → Flow handoff; REAL USER PASS.
- **Build110 · v0.19.32** — human-first / premium UX simplification.
- **Build109 · v0.19.31** — Track-create operation identity; REAL USER PASS.
- **Build108 · v0.19.30** — catalog rebuild generation identity; REAL USER PASS.
- **Build107 · v0.19.29** — Phase10 Slice1 shared catalog projection kernel; REAL USER PASS.

## Rejected historical candidates

- **Build101** — Track asset normal-success false negative caused by quoted/raw ETag representation mismatch; superseded by accepted Build102.
- **Build104** — falsely classified pre-submit/node-offline Deep Audio transport as compute UNKNOWN; superseded by accepted Build105.

All detailed historical records remain preserved under `changelogs/` and `docs/`.
