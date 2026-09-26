# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-26 for **CPU corrective slice 2 / Build118 lean Album consumer candidate**.

## GitHub reconciliation / corrective stop line

Verified `main`: `b035fb226e8c9a2654306076522faa4da97fb3ea` (PR #236). Build118 / v0.19.40 Catalogue A2.1 is merged and Pages run [36249977846](https://github.com/shinobione/shinobiwan-studio/actions/runs/36249977846) completed build + deploy successfully. The earlier candidate-only checkpoint below is superseded for merge/deployment status.

Build117 remains the latest merged acceptance receipt. The limited Build118 seven-check shell REAL USER PASS is reported in the separate, still-open docs PR #237; that branch is **not incorporated here**. Issue #238 records intermittent private Album/Track reads and does not establish a Catalogue regression. A2.2 remains on hold.

Active runtime corrective: ordinary Album collection reads opt into the deployed lean canonical backend; migration retains the full endpoint. Keep the existing Build118 identity for this bounded corrective. Stop at Draft PR + exact-head CI, with no merge, Pages/Worker deployment or live R2 access. See [scope, compatibility and acceptance checklist](docs/CPU-SLICE2-LEAN-ALBUM-CONSUMER.md). This candidate has no REAL USER PASS and does not resolve the overall CPU incident.

This is the short current checkpoint. Historical implementation detail remains in `changelogs/`, milestone docs and acceptance receipts.

## Current accepted Studio runtime

```text
Studio version          v0.19.39
Studio build            Build117
Codename                studio-focus-build117-track-asset-sha256
Acceptance              REAL USER PASS
Studio PR               #234
Final validation CI     #737 · SUCCESS
Studio merge            a1f7641a3e2d39fe24ee6b6a51438fb8a1c88ae4
Studio Pages            #253 · SUCCESS
Track Manager           v5.28
Studio bridge           v1.18
Backend PR              LaunchPAD #282
Backend merge           4867a2fef673028b0474f949183944dd642af165
Admin Worker deploy     #49 · 35435618374 · SUCCESS
Public Worker           unchanged / intentionally skipped
Real-user smoke         PASS · production metadata validation after corrective
```

**Build117 is the current accepted runtime identity.**

Latest receipt:

- [`docs/acceptance/BUILD117-REAL-USER-PASS.md`](docs/acceptance/BUILD117-REAL-USER-PASS.md)

## Accepted progression since Build114

### Build114 — Album-create operation identity

Accepted / REAL USER PASS after the `year:null → 0` corrective.

- one browser UUID per explicit Album create;
- immutable private `creationOperationId`;
- lost response resolved by exact private canonical identity;
- zero blind second create POST;
- blank Album year remains canonical `null`.

### Build115 — Safe Album Delete

Accepted / REAL USER PASS.

- exact canonical Album ID confirmation;
- expected revision required;
- Track Manager-only destructive authority;
- guarded Album removal with backup / rollback and canonical absence verification;
- affected Tracks return to Singles / unassigned compatibility semantics;
- zero blind destructive retry.

### Build116 — Safe Track Delete

Accepted / REAL USER PASS after contextual-UX corrective.

- exact canonical Track ID confirmation;
- hard block while canonical `album.trackIds` owns the Track;
- no implicit Album membership mutation;
- protected Track-scoped backup / delete / rollback / catalog rebuild;
- canonical absence proof and zero blind destructive retry;
- contextual `Delete Track…` action available from the current Track workspace.

### Build117 — exact-byte Track asset SHA-256 proof

Accepted / REAL USER PASS after a bounded pre-merge compatibility corrective.

- Studio hashes the exact browser-selected Track asset before upload;
- digest travels inside existing `asset-upload-v1`;
- Track Manager stores SHA-256 as private R2 custom metadata and verifies it on reread;
- normal success requires selected digest == response digest == private canonical digest;
- lost-response recovery requires a new revision plus the exact selected digest;
- same revision = NOT COMMITTED / explicit retry safe;
- changed state with missing/different digest = AMBIGUOUS / DO NOT RETRY;
- zero blind upload retries;
- public projection remains independent of private digest evidence.

During final production preparation, real Studio use exposed a stale duration-evidence bridge allowlist. Build117 corrected both validation and resilient save seams to explicitly include bounded inherited successors v5.26/v1.16, v5.27/v1.17 and v5.28/v1.18 while still rejecting an unbounded numeric version gate.

## Current ecosystem baseline

```text
Track Manager           v5.28 · protected canonical Track/Album write authority
Studio bridge           v1.18
Public Worker           v2.8 · unchanged by Builds115–117
LaunchPAD public        existing canonical public projection
SonicTrace              V2-E Build08
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE
Phase 8                 COMPLETE · Build81 closeout
Phase 9                 COMPLETE · accepted through Build106
Phase 10 Slice1         COMPLETE · Build107 REAL USER PASS
Phase 10 Slice2         UNALLOCATED
Build108                COMPLETE · catalog rebuild identity
Build109                COMPLETE · Track create operation identity
Build110                COMPLETE · human-first / premium UX cleanup
Build111                COMPLETE · Release → Flow handoff · REAL USER PASS
Build112                COMPLETE · MUSIC Pack V1 import foundation
Build113                COMPLETE · SoundCloud Pack priority · REAL USER PASS
Build114                COMPLETE · Album create operation identity · REAL USER PASS
Build115                COMPLETE · Safe Album Delete · REAL USER PASS
Build116                COMPLETE · Safe Track Delete · REAL USER PASS
Build117                COMPLETE · exact-byte Track asset SHA-256 proof · REAL USER PASS
Build118                MERGED / PAGES DEPLOYED · A2.1; CPU slice 2 candidate active
Official Phase 11       NONE
```

Build108/109/114–117 are bounded reliability/lifecycle work outside Phase10 Slice2. Build110–113 are human-facing/product workflow improvements outside Phase10 Slice2.

## Frozen authority / reliability rules

- GitHub = application-code authority; R2 = canonical catalog/media/data authority.
- Track Manager remains the protected Track/Album write authority.
- Album `trackIds` remains canonical Album-membership authority.
- no generic blind write retry.
- public fallback remains read-only and never verifies writes.
- operation identity remains operation-specific proof, not generic idempotency infrastructure.
- no Studio-only code may claim write causality the backend cannot prove.
- imported MUSIC Pack data is non-canonical and cannot silently mutate Track identity or canonical media.
- exact-byte Track asset evidence is private canonical proof; it does not widen public projection authority.
- Build101 and Build104 remain rejected historical candidates.

## Operational guardrails — mandatory

1. **Quota first.** Do not burn high-value agent quota on mechanical GitHub work.
2. **GitHub/local preflight first.** Before local work verify remote, fetch, branch, HEAD, ahead/behind, working tree and exact diff.
3. **Diff first, model second.** Establish the real changed-file set before stronger-model analysis.
4. **No EOL/format explosions.** Unexpected mass modifications are suspicious until proven semantic.
5. **CI failures by family.** Read full logs and patch the complete stale-assumption family before a new CI cycle.
6. **Build identity at implementation start.** Version/build/guard are allocated together.
7. **CI is not deployment.** Production deployment is separate evidence.
8. **Closeout stays short.** Bounded diff → CI green → merge → required deploy → real-user smoke → docs/current state.
9. **Assistant orchestrates.** Codex/Astra are bounded execution tools, not default project managers.

## Immediate next action

**Review the CPU slice 2 Draft PR and exact-head CI on `fix/build118-lean-album-consumer`; stop before merge/deploy.**

Base is the verified clean main above. Backend dependency LaunchPAD PR #284 is merged at `4dd420bd612555cdb972897b080549aacf408fa6`; the mission supplies its deployed Worker version and authenticated browser smoke in the [corrective receipt](docs/CPU-SLICE2-LEAN-ALBUM-CONSUMER.md). Frontend deduplication, Track/SonicTrace services and commercial import are outside this slice. Album asset digest proof remains backlog; Phase10 Slice2 remains unallocated.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
