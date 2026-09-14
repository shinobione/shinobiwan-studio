# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-14 after **Build116 REAL USER PASS**.

This is the short current checkpoint. Historical implementation detail remains in `changelogs/`, milestone docs and acceptance receipts.

## Current accepted Studio runtime

```text
Studio version          v0.19.38
Studio build            Build116
Codename                studio-focus-build116-safe-track-delete
Acceptance              REAL USER PASS
Studio PR               #230 + corrective #231
Validation CI           #726 · SUCCESS; corrective #727 · SUCCESS
Studio merge            71dfa6cf34e8115c043daaad3ec6a5e54fd1d1fe
Corrective merge        aa3e3acfa5d9f1cfffe7b41a6c95d3d1fca28234
Studio Pages            #251 · SUCCESS
Track Manager           v5.27
Studio bridge           v1.17
Backend PR              LaunchPAD #281
Backend merge           2d43bbcb11359b4e89e3766d59a99a1d658de490
Admin Worker deploy     #48 · 34874308855 · SUCCESS
Public Worker           unchanged / intentionally skipped
Real-user smoke         PASS · deleted disposable Track `smoke-test`
```

**Build116 is the current accepted runtime identity.**

Detailed receipts:

- [`docs/acceptance/BUILD115-REAL-USER-PASS.md`](docs/acceptance/BUILD115-REAL-USER-PASS.md)
- [`docs/acceptance/BUILD116-REAL-USER-PASS.md`](docs/acceptance/BUILD116-REAL-USER-PASS.md)

## Accepted progression since Build114

### Build115 — Safe Album Delete

Accepted / REAL USER PASS.

- exact canonical Album ID confirmation;
- expected revision required;
- Track Manager-only R2 delete authority;
- Album manifest + Album assets removed through guarded backend operation;
- affected Tracks return to Singles / unassigned compatibility semantics;
- catalog rebuilt and canonical Album absence verified;
- timeout / transport loss resolved by canonical reread with zero blind destructive retries.

Backend: Track Manager v5.26 / bridge v1.16 · LaunchPAD PR #280 · merge `d365152258373d8c7f3de0f9ef2b861600fe5f6f` · admin deploy #47 SUCCESS.

### Build116 — Safe Track Delete

Accepted / REAL USER PASS after a bounded UX corrective.

- exact canonical Track ID + second destructive confirmation;
- expected revision required;
- hard block while canonical `album.trackIds` owns the Track;
- no implicit Album membership mutation;
- protected Track-scoped backup / delete / rollback / catalog rebuild;
- private canonical absence proof required;
- timeout / transport loss resolved by canonical reread with zero blind destructive retries;
- contextual `Delete Track…` action added to the current Track workspace after the first smoke exposed poor discoverability.

## Current ecosystem baseline

```text
Track Manager           v5.27 · protected canonical Track/Album write authority
Studio bridge           v1.17
Public Worker           v2.8 · unchanged by Builds115–116
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
Build117                ALLOCATED · exact-byte SHA-256 proof for Track asset uploads
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

**Build117 is allocated** via issue #232 for exact-byte SHA-256 proof on **Track asset uploads only**.

Fresh audit established the current gap:

```text
selected browser File
→ upload
→ backend R2 write
→ server response/reread verifies revision + filename + size + content type + ETag
→ lost-response recovery currently relies on size/content type + changed server fingerprint
```

That is good server-object evidence but not exact proof that the canonical bytes equal the user's selected bytes.

Build117 contract:

```text
browser SHA-256(selected File)
→ send digest inside existing asset-upload-v1 multipart request
→ Track Manager validates and stores digest in private R2 custom metadata
→ backend reread verifies the stored digest
→ private Studio reread exposes digest
→ success / lost-response recovery requires exact selected digest match
→ missing/different digest on changed state = AMBIGUOUS / DO NOT RETRY
```

Album asset digest proof is deliberately deferred to a separate fresh-audit slice.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. Runtime truth is carried by code, docs and deployed Pages; no formal GitHub Release/tag is required.
