# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after **Build84 deployed candidate** publication. Real-user acceptance is still pending.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.5
Studio build            Build83
Codename                studio-focus-slice4-phase9-lyrics-save-response-loss-truth
Acceptance              REAL USER PASS
Runtime PR              #129
Exact tested head       beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Final runtime CI        31856653579 · SUCCESS
Runtime merge SHA       b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages           31856698097 · SUCCESS
Real-user smoke         BUILD83 PASS · 2026-08-15
```

Build83 remains the latest **accepted** runtime until Build84 receives explicit real-user browser acceptance.

## Current deployed candidate

```text
Studio version          v0.19.6
Studio build            Build84
Codename                studio-focus-slice4-phase9-sonictrace-save-response-loss-truth
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final runtime CI        31858911420 · SUCCESS
Runtime merge SHA       b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS · exact runtime merge SHA
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
```

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
Phase 9 Slice3          Build84 DEPLOYED CANDIDATE · smoke pending
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82 accepted behavior

Build82 hardens destructive Track and Album asset deletion ambiguity. Lost responses are never blindly retried; private canonical reread classifies committed / not committed / ambiguous / unverified and normal success also requires exact canonical verification.

## Build83 accepted behavior

Build83 hardens canonical `lyrics.txt` save response-loss truth with private canonical Lyrics + Track reread. A write is recovered only when the exact new revision, ETag and normalized requested text are proven.

## Build84 candidate behavior

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

Before save, Studio also rejects an already-canonical `analysisId` and stale source-audio evidence. Normal HTTP success now requires exact canonical latest + history verification before Studio calls the save verified.

## Current blockers

No code/CI/deployment blocker remains for Build84.

**Acceptance blocker:** real-user browser smoke is pending. Do not promote Build84 to REAL USER PASS before an explicit verdict.

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

Run the bounded **Build84 real-user SonicTrace regression smoke**:

1. hard refresh Studio and verify `v0.19.6 · Build84`;
2. open a private Track with canonical master audio;
3. open SonicTrace and confirm the existing latest/history state loads normally;
4. run a normal SonicTrace scan on a safe Track;
5. review the generated `analysisId`, then perform one intentional normal **Save analysis** if the new history entry is acceptable;
6. expect a normal verified receipt: **`Analysis saved and canonically verified in latest + history.`**;
7. confirm the latest Analysis ID/history updated and normal Track / Visuals / Lyrics / Albums navigation still works.

Do **not** deliberately cut network/Access during the save just to manufacture a timeout or partial write. The lost-response branches are protected by the Build84 guard, typed classification and canonical reread logic.

After explicit PASS: update canonical docs to REAL USER PASS and create the post-acceptance checkpoint. Only then run a fresh Phase9 audit before allocating any successor build; broader guarded Album-write truth, Access/CORS hardening and degraded/offline/PWA resilience remain candidates, not commitments.

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
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build83 is **REAL USER PASS**. Build84 is **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**.
