# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-26 after **Catalogue A2.1 / Build118 REAL USER PASS**.

This is the short current checkpoint. Historical implementation detail remains in `changelogs/`, milestone docs and acceptance receipts.

## Current accepted Studio runtime

```text
Studio version          v0.19.40
Studio build            Build118
Codename                studio-focus-build118-catalogue-a2-1-foundation
Acceptance              REAL USER PASS · native read-only Catalogue shell
Studio PR               #236
Candidate head          915eec0bfc16def09e8e4483a74aab7fe0e2fe23
Validation CI           36249713796 · SUCCESS
Studio merge/main       b035fb226e8c9a2654306076522faa4da97fb3ea
Studio Pages            36249977846 · build + deploy SUCCESS
Real-user smoke         PASS · owner reports all seven navigation/UX checks
Track Manager           v5.28 · unchanged
Studio bridge           v1.18 · unchanged
Worker / R2             no A2.1 mutation
```

**Build118 is accepted for A2.1 only.** [Build118 real-user receipt](docs/acceptance/BUILD118-REAL-USER-PASS.md). Build117 remains an accepted predecessor; its [receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) is unchanged.

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
Build118                COMPLETE · Catalogue A2.1 · REAL USER PASS
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

**Scope Catalogue A2.2 separately:** explicit private-local V5 import/dry-run, structural schema validation, source provenance, idempotent reconciliation and no private source rows in GitHub Pages. Build118 native shell is accepted; no A2.2 implementation or new build is allocated by this closeout.

Exact accepted production: main `b035fb226e8c9a2654306076522faa4da97fb3ea`, [Pages run 36249977846](https://github.com/shinobione/shinobiwan-studio/actions/runs/36249977846) both build/deploy SUCCESS, and owner's seven-check real-browser PASS. [Acceptance receipt](docs/acceptance/BUILD118-REAL-USER-PASS.md). The original [Build118 candidate record](docs/build118-catalogue-a2-1-candidate.md) remains historical, not current deployment truth.

Album asset exact-byte/digest proof remains a separate backlog hypothesis; Phase10 Slice2 remains unallocated.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
