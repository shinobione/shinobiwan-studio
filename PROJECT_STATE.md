# SHINOBIWAN STUDIO — Canonical Project State

## Current accepted production — 2026-09-27

GitHub-verified main `72151c00c5a89cae2bf5e73a6fb98f9ba9c5d90a` after docs-only #245, [Pages 36322272124](https://github.com/shinobione/shinobiwan-studio/actions/runs/36322272124) SUCCESS. Accepted runtime merge `09681904e69b9f2c3ab7bf0d41de1cf1a7dd5d11` (owner-authorized [PR #244](https://github.com/shinobione/shinobiwan-studio/pull/244)); exact candidate head `de1000940c32efcc8024c4fd61f240cfa7f93860` passed [CI #36318925988](https://github.com/shinobione/shinobiwan-studio/actions/runs/36318925988); [Pages #36320947983](https://github.com/shinobione/shinobiwan-studio/actions/runs/36320947983) build and deploy SUCCESS on the exact merge SHA. **Current accepted runtime: Build120 / v0.19.42, Catalogue A2.3 Slice 1 — parent-owned local-private session and native Overview.**

The owner's bounded [Build120 REAL USER PASS](docs/acceptance/BUILD120-REAL-USER-PASS.md) confirms all five production browser checks: selected private snapshot Overview metrics (168 Recordings / 84 commercial Releases / 109 appearances / 120 known and 48 missing ISRC / 355 pending findings); navigation among Overview, Releases, Recordings and QA and back without re-import; two finding groups opening filtered QA then Show all; Reset/unload and refresh clear state; DevTools showed no private-source upload/storage or source IDs in URL during the tested workflow. It is an explicit owner report, not an independently captured network trace or full accessibility/security/mobile audit. No finding is marked resolved.

Pre-merge [Build120 validation](docs/CATALOGUE-A2-3-SLICE1-VALIDATION.md): full build/release/TypeScript, inherited Build118/119/CPU gates, 12 synthetic real-Chromium scenarios and 130-file artifact/privacy scan PASS. The Build119 parser and Worker generation fence remain unchanged. No new Worker/LaunchPAD deployment, R2/catalog mutation or commercial persistence.

The independent [Build119 A2.2 receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md) documents the original import (444 rows, zero rejected), QA and local-private lifetime. The [Build118 A2.1 original acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md), [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and [Build117 reliability receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) remain separate. Derived JSON does not retain every ten-sheet workbook proof. Current external channel availability remains unknown and the 355 cases remain pending. Studio CPU issue #238 and LaunchPAD issue #283 remain open without sustained CPU-duration measurements; superseded PR #237 remains open for separate housekeeping, with #241 merged.

## Active candidate — Build121 / A2.3 Slice 2

Build121 / v0.19.43 implements the [issue #235](https://github.com/shinobione/shinobiwan-studio/issues/235) owner kickoff: session-only native Releases gallery and transient Release detail. Dedicated branch `codex/catalogue-a23-slice2-build121-20260927` starts from verified `72151c00c5a89cae2bf5e73a6fb98f9ba9c5d90a`; existing branches/worktrees preserved. Local full build, inherited Build118/119/120/CPU, nine new Chromium scenarios, TypeScript and 133-file artifact/privacy scan PASS. [Implementation and owner handoff](docs/CATALOGUE-A2-3-SLICE2-VALIDATION.md).

Delivery: [Draft PR #246](https://github.com/shinobione/shinobiwan-studio/pull/246). Implementation head `2d0eacdf78d21c82353aa6fb557a73723e0c9b45` passed [CI 36323849563](https://github.com/shinobione/shinobiwan-studio/actions/runs/36323849563); final documentation-head CI remains the PR delivery gate. **Not merged, not deployed, no REAL USER PASS.** Production remains accepted Build120. Typed unbound source appearances now retain their exact release/position/evidence without inventing a Recording. Search/filter/sort and modal state remain local to the selected snapshot. No new dependency, persistence, Cloudflare Worker/backend, R2, LaunchPAD or Blackhole change; no private V5 read/upload/commit.

Recording explorer/contextual QA, reviewed artwork, commercial persistence and synchronization remain separate future scope under the [blueprint](docs/CATALOGUE-A2-3-BLUEPRINT.md).

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
Build120                MERGED / PAGES DEPLOYED · A2.3 Slice 1 bounded REAL USER PASS
Build121                CANDIDATE · A2.3 Slice 2 Releases gallery/detail · no REAL USER PASS
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

Review the Build121 Draft diff and exact-head CI. Stop before merge/Pages deployment; owner source/keyboard/mobile/privacy acceptance follows only after separate authorization. Retain workbook evidence gaps, CPU issues and separate gates for Recording explorer, commercial persistence/sync, Album asset digest proof and Phase10 Slice2.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
