# SHINOBIWAN STUDIO — Canonical Project State

## Current accepted production — 2026-09-27

GitHub-verified pre-closeout `main`: `58f976218600757632efd58e36b2c74a8a47fcef`, after owner-authorized [PR #248](https://github.com/shinobione/shinobiwan-studio/pull/248). Exact final candidate `881845487d3119f45814a0ade2e8b7ef7487c352` passed [CI #36338838575](https://github.com/shinobione/shinobiwan-studio/actions/runs/36338838575); automatic [Pages #36339663943](https://github.com/shinobione/shinobiwan-studio/actions/runs/36339663943) build/upload/deploy SUCCESS on the merge SHA. **Current accepted runtime: Build122 / v0.19.44, Catalogue A2.3 Slice 3 — session-only Recordings explorer and contextual QA.**

The owner's bounded [Build122 REAL USER PASS](docs/acceptance/BUILD122-REAL-USER-PASS.md) confirms all eight requested live-browser checks: source-derived Recording/ISRC/appearance/finding counts, factual search/filters/sorting with distinct identities, exact bound multi-Release positions/evidence and unbound exclusion, transient Recording/Release/appearance/Back navigation, contextual/global QA and full pagination, keyboard/focus/mobile/desktop checks, session/reset/source replacement/refresh lifecycle, and observed DevTools no private upload/persistence/URL IDs/external artwork fetch. This is the owner's report, not an independently captured private browser trace, general-source certification, formal accessibility/security audit or sustained CPU proof.

Separate candidate [Build122 implementation handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md) remains the historical pre-merge record: full release/TypeScript/build and inherited Build118–121/CPU gates, eight fictional-source real Chromium scenarios, 137-file source/build/artifact privacy scan. Exact evidence membership is read-only: Recording context = own evidence plus explicitly bound appearance rows; Release context = own evidence plus bound/unbound appearance rows; Appearance context = its own row; source-note-only findings remain in the complete global QA. Release detail inherited broader linked-Recording findings are distinct from narrow Release contextual QA. No automatic identity merge, reviewed creative Track binding, publication inference, QA resolution or commercial write is introduced.

Prior [Build121 A2.3 Slice 2 acceptance](docs/acceptance/BUILD121-REAL-USER-PASS.md), [Build120 A2.3 Slice 1 acceptance](docs/acceptance/BUILD120-REAL-USER-PASS.md), [Build119 A2.2 acceptance](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 original A2.1 acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md), [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and [Build117 reliability](docs/acceptance/BUILD117-REAL-USER-PASS.md) remain distinct. Derived JSON omits evidence from the private ten-sheet workbook; the earlier source-specific 355 findings stay pending, and current external channel publication remains unknown. Studio CPU #238 / LaunchPAD #283 remain open without sustained Workers Free CPU measurements. Superseded docs PR #237 is separate housekeeping, with #241 merged.

## Next decision gate — living commercial Catalogue architecture (planning only)

The [A2.3 blueprint](docs/CATALOGUE-A2-3-BLUEPRINT.md) has three separately accepted read-only session slices: Overview, Releases and Recordings/contextual QA. A truly living commercial registry, possible richer private exporter, reviewed artwork, per-channel event ledger, exact Recording ↔ creative Track bindings and STUDIO ↔ LaunchPAD synchronization each need an independently scoped source-of-truth, identity/evidence, confidentiality, write-authority, conflict and rollback decision. **No Build123, implementation PR, new storage or bidirectional sync is allocated or authorized by this docs closeout.** Do not merge/deploy it without separate owner approval.

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
Build122                MERGED / PAGES DEPLOYED · A2.3 Slice 3 bounded REAL USER PASS
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

Review the docs-only Build122 acceptance closeout; next brainstorm and explicitly scope the living Catalogue architecture (private source coverage, commercial source-of-truth, reviewed IDs/artwork, channel evidence, storage and STUDIO ↔ LaunchPAD authority) before any new runtime build. Preserve unresolved QA, CPU #238 / LaunchPAD #283, and independent Album digest and Phase10 gates. No merge/Pages for this closeout without separate owner approval.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
