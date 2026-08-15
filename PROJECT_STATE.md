# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after explicit **`BUILD84 PASS`** real-user browser acceptance.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.6
Studio build            Build84
Codename                studio-focus-slice4-phase9-sonictrace-save-response-loss-truth
Acceptance              REAL USER PASS
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final runtime CI        31858911420 · SUCCESS
Runtime merge SHA       b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #133
Candidate docs merge    ea93441094173b3c05a1e08b22f7c53ef87f3783
Candidate docs Pages    31859213261 · SUCCESS
Real-user smoke         BUILD84 PASS · 2026-08-15
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
```

Build84 is now the latest **accepted** Studio runtime.

## Current ecosystem baseline

```text
Track Manager           v5.23 · DEPLOYED
Studio bridge           v1.13
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker           v2.7 · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build84 changes only Studio client-side SonicTrace **save verification / response-loss classification**. It does **not** change SonicTrace Deep Audio computation, Track Manager, the Studio bridge, any Worker, R2 schema/data, LaunchPAD or LRC Maker.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 9 Slice2          COMPLETE · Build83 REAL USER PASS
Phase 9 Slice3          COMPLETE · Build84 REAL USER PASS
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82 accepted behavior

Build82 hardens destructive Track and Album asset deletion ambiguity. Lost responses are never blindly retried; private canonical reread classifies committed / not committed / ambiguous / unverified and normal success also requires exact canonical verification.

## Build83 accepted behavior

Build83 hardens canonical `lyrics.txt` save response-loss truth with private canonical Lyrics + Track reread. A write is recovered only when the exact new revision, ETag and normalized requested text are proven.

## Build84 accepted behavior

Build84 hardens the canonical SonicTrace **analysis save** response-loss path. The post-Build83 audit proved this was the smallest remaining coherent write-truth gap because one requested `analysisId` has deterministic canonical presence across two sidecars already owned by Track Manager:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

The deployed Track Manager already writes history, then latest, rereads both, and attempts rollback on verification failure. Build84 changes no backend behavior.

```text
SonicTrace save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of latest + history
   ├─ requested analysisId present in BOTH
   │    → COMMITTED / VERIFIED
   ├─ requested analysisId absent from BOTH
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ requested analysisId present in only one
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Before save, Studio also rejects an already-canonical `analysisId` and stale source-audio evidence. Normal HTTP success requires exact canonical latest + history verification before Studio calls the save verified.

The bounded normal-browser smoke confirmed the deployed Build84 path loads SonicTrace latest/history normally, performs a normal scan/save with canonical verification, updates the analysis state, and preserves surrounding Studio navigation.

## Current blockers

**No active blocker after `BUILD84 PASS`.**

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

**Do not allocate Build85 yet.**

Run a fresh, read-only Phase9 reliability audit and select the smallest coherent next reliability slice only after proving the gap and confirming existing recovery logic does not already cover it.

Remaining audit candidates include:

1. broader guarded Album write response-loss truth;
2. Access/CORS hardening;
3. bounded read retries/timeouts;
4. degraded/offline UX and PWA resilience.

No candidate above is an automatic commitment or pre-allocated build.

## Frozen stop lines

- GitHub = code authority.
- R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private orchestrator, never a generic R2 writer.
- Public fallback = read-only and never canonical-write verification.
- No blind retry after ambiguous writes.
- No destructive production smoke merely to prove a guard.
- `lyrics.txt` remains the unique canonical lyrics source.
- `album.trackIds` remains the sole Album membership/artistic-order authority.

## Relevant safety references

```text
safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
safety/post-build82-deployed-candidate-20260815-0248
safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
safety/post-build83-real-user-pass-20260815-0406
safety/post-build83-rup-docs-closeout-20260815-0412
safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
safety/post-build84-deployed-candidate-20260815-0425
safety/post-build84-candidate-docs-closeout-20260815-0429
safety/post-build84-real-user-pass-20260815-0435
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build84 is **REAL USER PASS**. Build85 is **UNALLOCATED**.
