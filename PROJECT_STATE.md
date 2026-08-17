# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build103 REAL USER PASS** and acceptance closeout.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.25
Studio build            Build103
Codename                studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth
Acceptance              REAL USER PASS
Runtime PR              #198
Base                    1b9934288043b85bbed537b0e8cf1ddc4f786184
Exact tested head       9d89aa1051b67b828836a45b648b6f45b69dbe74
Final runtime CI        #543 · 31981673322 · SUCCESS
Runtime merge SHA       5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages           #209 · 31981768144 · SUCCESS build + deploy
Candidate docs PR       #199
Candidate docs merge    c98bfbba7c48d2cbf96b7b4760204b6d0523c228
Candidate docs Pages    #210 · 31981993765 · SUCCESS build + deploy
Acceptance docs PR      #200
Acceptance docs CI      #545 · 31982315109 · SUCCESS
Acceptance docs merge   dc284afbb087ae98619534f565cf82d3263e97d0
Acceptance docs Pages   #211 · 31982359259 · SUCCESS build + deploy
Real-user smoke         BUILD103 SMOKED 💨
Safety pre-build        safety/pre-build103-canonical-audio-download-retry-20260817
Safety green premerge   safety/post-build103-green-premerge-20260817-0217
Safety post-deploy      safety/post-build103-deployed-candidate-20260817-0223
Safety post-acceptance  safety/post-build103-real-user-pass-20260817-0234
Worker deploy           NONE
Track Manager change    NONE
Public Worker change    NONE
R2 migration/schema     NONE
```

**Build103 is the current accepted Studio runtime.** It gives only the non-mutating canonical master-audio GET before SonicTrace / Deep Audio compute one bounded retry for timeout, browser transport interruption, or explicit transient HTTP `408/425/429/500/502/503/504`. The expensive `POST /api/studio/analyze` remains one-shot with zero automatic retries. Access failures, deterministic ordinary HTTP failures, and empty/invalid successful responses do not retry.

Detailed receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md).

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

Public Worker v2.8 closes the previously listed publication-projection gap outside the Studio runtime: a published Track is withheld from public list/detail/media while its canonical owner Album remains draft/archived; standalone published Singles and Tracks owned by published Albums remain public. Canonical ownership is derived from Album `trackIds`.

No Build103 backend deployment occurred. Build103 deployment itself performs no R2 mutation.

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
Build101                REJECTED candidate · ETag representation false negative
Build104                UNALLOCATED · fresh read-only audit required
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
- Track asset normal success requires exact revision, manifest filename, private presence and server fingerprint fields when supplied; ETag normalization removes only one symmetric outer HTTP quote pair before exact comparison.
- Build103 retries only the pre-compute canonical-audio GET. It must never become an automatic retry of Deep Audio compute or any canonical write.

## Immediate next action

**Fresh read-only post-Build103 Phase9 audit.** Do not allocate Build104 before the current implementation proves the smallest coherent next gap.

Remaining candidates to re-evaluate, without pre-selecting one:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can expose trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries beyond the safe pre-compute GET;
- degraded/offline behavior that materially affects the private Studio workflow.

## Backlog kept intact

- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
