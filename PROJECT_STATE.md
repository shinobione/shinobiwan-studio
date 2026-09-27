# SHINOBIWAN STUDIO — Canonical Project State

## Current accepted production — 2026-09-27

GitHub-verified `main`: `cba3fb35fec57edd307500f1a76474e48089efa4` after docs-only PR #243; [Pages 36317610337](https://github.com/shinobione/shinobiwan-studio/actions/runs/36317610337) SUCCESS on that SHA. The accepted runtime merged at `20a0adf15271a0f9bff0cbd2a318c441685ec2bc` in owner-authorized [PR #242](https://github.com/shinobione/shinobiwan-studio/pull/242), exact tested candidate `e2b4adc70da6952713c3e74f1987e92bd40e0348`. [CI #36312536104](https://github.com/shinobione/shinobiwan-studio/actions/runs/36312536104) SUCCESS on that candidate; automatic [Pages #36316493317](https://github.com/shinobione/shinobiwan-studio/actions/runs/36316493317) build/deploy SUCCESS on the merge SHA. **Current runtime: Build119 / v0.19.41, Catalogue A2.2 local-private dry-run.**

The owner's bounded [Build119 REAL USER PASS](docs/acceptance/BUILD119-REAL-USER-PASS.md) confirms the explicit local JSON import summary: 444 rows, 168 recordings, 84 source releases, 109 appearances, 120 known / 48 missing ISRC, zero rejects and 355 pending findings. Shino also confirmed QA, Reset/unload, empty state after refresh and DevTools showing no private-source upload or browser-storage persistence. This is reported owner browser evidence, not an independent network capture or a complete security/mobile/accessibility audit. All findings remain pending. Source workbook evidence coverage is incomplete and clearly disclosed; no commercial records are embedded in GitHub Pages.

The original [Build118 A2.1 seven-check acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md), later [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md), and [Build117 reliability receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) remain separate historical evidence. CPU issue STUDIO #238 and LaunchPAD #283 stay open: no measured sustained Workers Free CPU compliance or permanent 503-free guarantee. Documentation #241 merged at `8c6a67eb9a1476fa864d136174199402a12498a8`; superseded PR #237 is still open for separate housekeeping.

LaunchPAD #284/#285/#286 and admin-only [Worker deployment 36265326176](https://github.com/shinobione/LaunchPAD-APP/actions/runs/36265326176) at `e1737f0e29d3411c30c34c134ab0d68650b0617a` / version `51c9d61e-2c69-4f4a-b106-3e4829bfb461` predate Build119. Build119 did not deploy another Worker or mutate R2.

## Active candidate — Build120 / A2.3 Slice 1

Build120 / v0.19.42 implements the owner-authorized [issue #235](https://github.com/shinobione/shinobiwan-studio/issues/235) Slice 1: one parent-owned private Catalogue session and a source-derived native Overview. Branch: `codex/catalogue-a23-slice1-build120-20260927`, based on verified `cba3fb35fec57edd307500f1a76474e48089efa4`. Existing A2.2 and CPU branches/worktrees are preserved.

Local full build, release/TypeScript, inherited Build118/119/CPU tests, 12 real Chromium scenarios and the 130-file runtime artifact/privacy scan PASS. [Implementation and acceptance handoff](docs/CATALOGUE-A2-3-SLICE1-VALIDATION.md). Delivery gate: Draft PR and exact-head CI; **not merged, not deployed, no REAL USER PASS**. Production remains accepted Build119. No private V5 dataset was read, uploaded or added during this slice.

Releases/Recording detail views and persistence remain future scope in the [blueprint](docs/CATALOGUE-A2-3-BLUEPRINT.md). No Worker/R2, LaunchPAD or Blackhole change.

## Prior accepted reliability baseline — Build117

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

**Build117 is the prior accepted reliability baseline.** Build118 has the separately bounded A2.1 and post-slice-4 acceptance above.

Prior reliability receipt:

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
Build118                MERGED / PAGES DEPLOYED · A2.1 PASS; slice 4 bounded functional PASS
Build119                MERGED / PAGES DEPLOYED · A2.2 bounded REAL USER PASS
Build120                CANDIDATE · A2.3 Slice 1 session + Overview · no REAL USER PASS
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

Review the Build120 Draft diff and exact-head CI, then obtain separate authorization for merge/Pages deployment and owner acceptance using the Slice 1 handoff. Stop before merge/deployment. Retain CPU incidents and workbook coverage limits. Release gallery, Recording details, persistence/sync, Album asset digest proof and Phase10 Slice2 remain separate.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
