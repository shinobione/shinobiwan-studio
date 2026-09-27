# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-26 for **CPU corrective slice 4 / Build118 shared private browsing reads candidate**.

## GitHub reconciliation / corrective stop line

Verified `main`: `9306ab4b6dafcce87c1bc68411719d01102612c0` (PR #239, CPU slice 2). Exact candidate `a910b70856e344bc6c6896cc59a9f9107f9539a1` passed [validation 36258542918](https://github.com/shinobione/shinobiwan-studio/actions/runs/36258542918); merged Build118 / v0.19.40 passed [Pages 36258902897](https://github.com/shinobione/shinobiwan-studio/actions/runs/36258902897). The former slice-2 candidate checkpoint is superseded.

Build117 remains the latest merged standalone acceptance receipt. Build118 shell acceptance docs PR #237 is still open and **not incorporated here**. Later [owner evidence in #238](https://github.com/shinobione/shinobiwan-studio/issues/238#issuecomment-5849807422) records a bounded Albums/Tracks REAL USER PASS on deployed slice 2 plus LaunchPAD slice 3: 7 Albums, 4 Healthy / 3 Attention / 0 Unverified and two sampled loads with all captured GET invocations `Ok`. This is functional acceptance of that deployed corrective, not sustained CPU-budget proof. A2.2 remains on hold.

Active runtime corrective: share pending Album/Track browsing reads across Albums Health, Management and Tracks; reuse canonical Album data for artwork; remove Tracks import-time prefetch and settled cache. Raw mutation verification and full migration reads remain independent. Keep Build118 identity for this bounded incident corrective. Stop at Draft PR + exact-head CI; no merge or production deployment. See [slice 4 scope and validation](docs/CPU-SLICE4-SHARED-PRIVATE-READS.md). Slice 4 has no REAL USER PASS and does not establish per-invocation CPU compliance.

This is the short current checkpoint. Historical implementation detail remains in `changelogs/`, milestone docs and acceptance receipts.

## Accepted reliability baseline / latest merged standalone receipt

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

**Build117 is the accepted reliability baseline.** The currently deployed Build118 corrective has the bounded functional acceptance described above; slice 4 remains a candidate.

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
Build118                MERGED / PAGES DEPLOYED · CPU slice 2 functional PASS; slice 4 candidate
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

**Review CPU slice 4 Draft PR and exact-head CI on `fix/studio-shared-private-reads`; stop before merge/deploy.**

Base is the verified main above. Issue #238 records LaunchPAD #285/#286 deployed at `e1737f0e29d3411c30c34c134ab0d68650b0617a`, admin-only [run 36265326176](https://github.com/shinobione/LaunchPAD-APP/actions/runs/36265326176), Worker version `51c9d61e-2c69-4f4a-b106-3e4829bfb461`, followed by the bounded owner smoke. No related repository, Worker or R2 changes belong to slice 4. SonicTrace backend optimization and commercial import remain outside scope; #237 needs reconciliation before merge. Album asset digest proof remains backlog; Phase10 Slice2 remains unallocated.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.

## Current mission overlay — A2.2 candidate, 2026-09-27

This supersedes earlier candidate/hold wording above. Verified production main is `650c8a3cf9a69f95732905562535394fac94a12e` (Build118 / v0.19.40): #240 merged, exact-head CI 36272677513 and Pages 36272890963 SUCCESS. Owner reports bounded post-slice-4 recovery (7 Albums, 4/3/0, one HTTP 200 per core private endpoint). Sustained CPU compliance remains unmeasured; issues stay open. Independent docs Draft #241 reconciles the original A2.1 seven-check PASS and later CPU evidence, preserving #237 open and Build117 history.

Active candidate: Build119 / v0.19.41, `codex/catalogue-a2-2-local-private-import`, from that verified main. [Contract](docs/CATALOGUE-A2-2-CONTRACT.md) and [validation](docs/CATALOGUE-A2-2-VALIDATION.md). Local-private JSON selection, strict atomic dry-run, pending QA and unload only. The owner's mission authorizes development/push/Draft review, superseding the earlier development hold. No merge/deployment/R2/Worker permission. Next: review both independent Drafts and exact-head CI; owner browser acceptance after separately authorized deployment. A2.3 remains separate.
