# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after explicit **`BUILD82 PASS`** real-user browser acceptance.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.4
Studio build            Build82
Codename                studio-focus-slice4-phase9-destructive-write-ambiguity-guard
Acceptance              REAL USER PASS
Production branch       main
Runtime PR              #126
Exact tested head       07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Final runtime CI        31854468795 · SUCCESS
Runtime merge SHA       7a0d52fcc0bf862478c459f0648afc1c6690b34f
Runtime Pages           31854528438 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #127
Candidate docs CI       31854668980 · SUCCESS
Candidate docs merge    077ef8bb19920c439971325604a2d30e015e41c1
Candidate docs Pages    31854709308 · SUCCESS
Real-user smoke         BUILD82 PASS · 2026-08-15
```

The current repository `main` may advance through docs-only closeouts after the runtime merge. **Production runtime SHA remains `7a0d52fc...` until a later runtime build is actually merged and deployed.**

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

Build82 did **not** deploy a Worker, change Track Manager, migrate R2 or change the public Worker.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82 accepted behavior

Build82 hardens only destructive asset deletion ambiguity for:

- Track asset delete;
- Album asset delete.

Contract:

```text
write response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread
   ├─ new revision + asset absent   → COMMITTED / VERIFIED
   ├─ same revision + asset present → NOT COMMITTED / explicit retry may be safe
   ├─ changed but causality unclear → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable            → UNVERIFIED / DO NOT RETRY
```

Normal success also requires exact canonical post-write revision plus asset absence.

## Current blockers

**No active blocker after `BUILD82 PASS`.**

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue is already fixed since Build62 and remains covered by its regression guard. Do not recreate that fix.

## Exact next action

**Do not pre-allocate Build83.**

Run a fresh, read-only Phase9 reliability audit and select the smallest coherent next lost-response / degraded-state slice.

Current candidates already identified by Build82 audit:

1. canonical Lyrics save response-loss truth;
2. SonicTrace analysis save response-loss truth;
3. broader guarded Album write families;
4. later Phase9 themes: Access/CORS hardening, degraded/offline UX and PWA resilience.

The audit must prove the next gap before any new runtime branch/build is opened.

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
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build82 is now **REAL USER PASS**. Build83 remains **UNUSED**.
