# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build104 deployment candidate**. Build103 remains the latest accepted Studio runtime until Build104 real-user smoke passes.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.25
Studio build            Build103
Codename                studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth
Acceptance              REAL USER PASS
Runtime PR              #198
Exact tested head       9d89aa1051b67b828836a45b648b6f45b69dbe74
Final runtime CI        #543 · 31981673322 · SUCCESS
Runtime merge SHA       5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages           #209 · 31981768144 · SUCCESS build + deploy
Acceptance docs PR      #200
Acceptance docs CI      #545 · 31982315109 · SUCCESS
Acceptance docs merge   dc284afbb087ae98619534f565cf82d3263e97d0
Acceptance docs Pages   #211 · 31982359259 · SUCCESS build + deploy
Final receipts PR       #201
Final receipts CI       #546 · 31982465722 · SUCCESS
Final receipts merge    74afc0c052e80e7d8c2cd18df333d70ec363b614
Final receipts Pages    #212 · 31982501221 · SUCCESS build + deploy
Real-user smoke         BUILD103 SMOKED 💨
Safety post-acceptance  safety/post-build103-real-user-pass-20260817-0234
```

**Build103 is the current accepted Studio runtime.** Its canonical master-audio pre-compute GET may retry once for bounded transient failures; `POST /api/studio/analyze` remains one-shot with zero automatic retries.

Detailed receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md).

## Current deployed Studio candidate

```text
Studio version          v0.19.26
Studio build            Build104
Codename                studio-focus-slice4-phase9-deep-audio-response-loss-fence
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Base                    74afc0c052e80e7d8c2cd18df333d70ec363b614
Runtime PR              #202
Exact tested head       8060a81b7fdb6a608244c768a042e56e630451f0
Final runtime CI        #564 · 31983472391 · SUCCESS
Runtime merge SHA       a0a082376eedc6c5c90bad59bbc5e92bf72e6cdd
Runtime Pages           #213 · 31983514507 · SUCCESS build + deploy
Safety pre-build        safety/pre-build104-deep-audio-response-loss-fence-20260817
Safety green premerge   safety/post-build104-green-premerge-20260817-0258
Safety post-deploy      safety/post-build104-deployed-candidate-20260817-0301
Worker deploy           NONE
Track Manager change    NONE
SonicTrace backend      NONE
Public Worker change    NONE
R2 migration/schema     NONE
```

Build104 corrects a truth/duplicate-compute gap after Deep Audio response loss. Once `POST /api/studio/analyze` has begun, browser timeout/transport cannot prove whether compute ran or is still running. Build104 therefore reports **COMPUTE UNKNOWN**, fences the exact Track + canonical source revision in memory, refuses a second same-source Deep Audio POST in that page, and requires page reload before deliberate manual resubmit. It adds **no automatic Deep Audio retry**.

Detailed candidate audit: [`docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).

Build101 remains a rejected historical candidate: its Track-asset write committed, but quoted R2 `httpEtag` versus raw canonical `etag` caused a real-user false-negative verifier result. Build102 corrected only that representation comparison and remains accepted ancestry.

## Current ecosystem baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
TM admin Worker         53abb651-4f3c-46a7-a37a-055f35d340b9
TM deployment run       31919397012 · SUCCESS · admin only
Public Worker           v2.8 · REAL USER PASS
Public Worker source    LaunchPAD-APP PR #241 · merge b99ff00bb2483b46c7b1e02c874ebfc22892156d
Public Worker deploy    31974132377 · target public
Public Worker Version   49d87191-a13e-41a7-80c8-d1fd9362af77
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

No Build104 backend deployment occurred. Build104 deployment itself performs no R2 mutation.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1–19       COMPLETE · Build82→Build100 REAL USER PASS
Phase 9 Slice20         COMPLETE · Build102 REAL USER PASS
Phase 9 Slice21         COMPLETE · Build103 REAL USER PASS
Phase 9 Slice22         Build104 DEPLOYED CANDIDATE · SMOKE PENDING
Build101                REJECTED candidate · ETag representation false negative
Phase 10                FUTURE · progressive extraction
Official Phase 11       NONE
```

## Frozen authority and reliability rules

- GitHub = application-code authority; R2 = canonical catalog/media/data authority.
- Track Manager = protected Track/Album write authority; Studio = private orchestrator, never a generic R2 writer.
- Album `trackIds` remains the sole canonical Album-membership authority.
- public fallback is read-only and never verifies writes.
- private GET/transient retry is bounded and never authorizes write retry.
- accepted Phase9 writes use: `response unavailable → no blind retry → private canonical reread → committed / not committed / ambiguous / unverified` with operation-specific postconditions.
- Build103 retries only the pre-compute canonical-audio GET.
- Build104 never automatically retries Deep Audio compute; timeout/transport after submit is UNKNOWN, and the same Track/source is fenced in-page until reload.

## Immediate next action

**Build104 normal-path real-user smoke.** Use a known-good Track and ordinary SonicTrace / Deep Audio analysis. Do not manufacture timeout, disconnect the network, or force Access failure. Automated guards cover the response-loss fence; human smoke verifies the healthy analysis path has no regression or duplicate submit.

Build104 must not be accepted until that smoke passes.

## Backlog kept intact

- create/upload response-loss causality requiring backend operation identity or trustworthy digest evidence;
- future Deep Audio operation status/idempotency only if the coordinator gains a safe contract;
- degraded/offline workflow work when a bounded slice is proven;
- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
