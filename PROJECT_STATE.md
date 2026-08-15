# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after **Build83 deployed candidate** publication. Real-user acceptance is still pending.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.4
Studio build            Build82
Codename                studio-focus-slice4-phase9-destructive-write-ambiguity-guard
Acceptance              REAL USER PASS
Runtime PR              #126
Runtime merge SHA       7a0d52fcc0bf862478c459f0648afc1c6690b34f
Runtime Pages           31854528438 · SUCCESS
Real-user smoke         BUILD82 PASS · 2026-08-15
```

Build82 remains the latest **accepted** runtime until Build83 receives explicit real-user browser acceptance.

## Current deployed candidate

```text
Studio version          v0.19.5
Studio build            Build83
Codename                studio-focus-slice4-phase9-lyrics-save-response-loss-truth
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #129
Exact tested head       beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Final runtime CI        31856653579 · SUCCESS
Runtime merge SHA       b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages           31856698097 · SUCCESS · exact runtime merge SHA
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

Build83 changes only Studio client behavior. It does **not** deploy a Worker, change Track Manager, migrate R2, change LaunchPAD, change SonicTrace or change LRC Maker.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 9 Slice2          Build83 DEPLOYED CANDIDATE · smoke pending
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82 accepted behavior

Build82 hardens destructive Track and Album asset deletion ambiguity. Lost responses are never blindly retried; private canonical reread classifies committed / not committed / ambiguous / unverified and normal success also requires exact canonical verification.

## Build83 candidate behavior

Build83 hardens only the native canonical `lyrics.txt` save response-loss path.

```text
Lyrics save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of lyrics + Track manifest
   ├─ new revision + new ETag + exact requested normalized text
   │    → COMMITTED / VERIFIED
   ├─ same revision + same ETag
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ canonical state changed but requested postcondition is not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal Lyrics save success still requires exact canonical revision + ETag + normalized text verification.

## Current blockers

No code/CI/deployment blocker remains for Build83.

**Acceptance blocker:** real-user browser smoke is still pending. Do not promote Build83 to REAL USER PASS before that explicit verdict.

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

Run the bounded **Build83 real-user Lyrics regression smoke**:

1. hard refresh Studio and verify `v0.19.5 · Build83`;
2. open a private Track with canonical `lyrics.txt`;
3. confirm Lyrics loads and canonical revision/ETag are visible;
4. validate a harmless local edit;
5. either cancel before save or perform one intentional normal save on a safe Track, then verify canonical reread success;
6. verify Track navigation / Visuals / Albums remain normal.

Do **not** deliberately sabotage a production write merely to force a timeout/lost-response branch. The ambiguous branches are covered by the Phase9 guards and canonical recovery logic.

After explicit PASS: update canonical docs to REAL USER PASS and create the post-acceptance checkpoint. Only then select the next Phase9 slice by fresh audit; SonicTrace analysis save response-loss truth is the next leading candidate, not an automatic commitment.

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
safety/post-build83-deployed-candidate
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build82 is **REAL USER PASS**. Build83 is **DEPLOYED CANDIDATE · smoke pending**.
