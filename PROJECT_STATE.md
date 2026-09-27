# SHINOBIWAN STUDIO — Canonical Project State

## Current accepted production — 2026-09-27

Verified production `main`: `1add68bc6f9c476374eafaefd58f865263f6e9ad` after docs #247, [Pages 36335916511](https://github.com/shinobione/shinobiwan-studio/actions/runs/36335916511) SUCCESS. Runtime merge: `6fd52f9f21ceb54d2014eaa99efb77d5ec899937` after owner-authorized [PR #246](https://github.com/shinobione/shinobiwan-studio/pull/246). Exact final candidate `757a46d0d83804ae5cd2b7a7c03c483125c0c67e` passed [CI #36324001763](https://github.com/shinobione/shinobiwan-studio/actions/runs/36324001763); automatic [Pages #36325763251](https://github.com/shinobione/shinobiwan-studio/actions/runs/36325763251) build/upload/deploy SUCCESS on the merge SHA. **Current accepted runtime: Build121 / v0.19.43, Catalogue A2.3 Slice 2 — native session-only Releases gallery and transient detail.**

The owner's bounded [Build121 REAL USER PASS](docs/acceptance/BUILD121-REAL-USER-PASS.md) confirms all seven requested production browser checks: 84 distinct release cards without title/UPC merging and no external artwork fetch; working search/filter/sort/Grid/List; exact source metadata, appearance positions, linked Recording evidence and proofs in detail; visible unbound appearances with no fabricated Recording association and unknown current publication; keyboard open/Tab/Escape/Close with opener focus restored; preserved Catalogue session with correct Reset/refresh clearing; and DevTools no private upload, browser-storage persistence, source IDs in URL or third-party cover loading during the tested workflow. This is the owner's report, not an independent captured browser trace, general-source audit or complete mobile/accessibility/security certification.

Candidate [Build121 implementation handoff](docs/CATALOGUE-A2-3-SLICE2-VALIDATION.md) remains historical pre-merge evidence: full release/TypeScript/build, inherited Build118/119/120 and CPU gates, nine new independently synthetic real-Chromium scenarios and 133-file artifact/privacy scan PASS. The original Build120 parent-owned session, atomic parser validation and Worker generation fence remain. The separate typed `unboundAppearances` in-memory projection retains exact source release, position and evidence without automatic Recording binding. No new Worker/R2/backend/LaunchPAD/Blackhole deployment or commercial write/persistence.

Prior [Build120 A2.3 Slice 1 acceptance](docs/acceptance/BUILD120-REAL-USER-PASS.md), [Build119 A2.2 acceptance](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 A2.1 acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md), [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and [Build117 reliability receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) remain distinct. The earlier private snapshot's 355 review findings have not been resolved by gallery acceptance. Derived JSON does not retain the full ten-sheet workbook evidence; publication remains unknown. Studio CPU issue #238 / LaunchPAD issue #283 remain open without sustained CPU measurements. Superseded docs PR #237 remains open for separate housekeeping; #241 merged.

## Active candidate — Build122 / v0.19.44, A2.3 Slice 3

Delivery: [Draft PR #248](https://github.com/shinobione/shinobiwan-studio/pull/248). Final exact-head CI is required and recorded in the PR receipt; merge/Pages remain separately gated.

The [owner kickoff in #235](https://github.com/shinobione/shinobiwan-studio/issues/235#issuecomment-5858138120) authorizes a native session-only Recordings explorer and exact-evidence contextual QA. Branch `codex/catalogue-a23-slice3-build122-20260927` starts from verified main above. [Implementation, relationship rules and owner handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md). Production remains accepted Build121. **Candidate only: no merge, deployment or REAL USER PASS.**

Exact bound appearances may span multiple Releases; unbound lookalikes never acquire a Recording. Global QA retains every finding; unsupported note-only relationships remain global. One transient modal supports exact evidence navigation. Parser/Worker/session safeguards and commercial/creative authority stay unchanged. Final delivery requires Draft PR and final-head CI. Local full build PASS: inherited gates, eight Build122 Chromium scenarios, release/TypeScript and 137-file artifact/privacy scan. Artwork, persistence/sync and reviewed Track mapping remain separate decisions.

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
Build121                MERGED / PAGES DEPLOYED · A2.3 Slice 2 bounded REAL USER PASS
Build122                CANDIDATE · A2.3 Slice 3 Recordings / contextual QA · no REAL USER PASS
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

Review Build122 Draft and final-head CI, then follow the Slice 3 owner handoff only after separate merge/Pages authorization. Preserve incomplete workbook evidence, open CPU incidents and independent artwork/persistence/sync/Track-binding decisions.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
