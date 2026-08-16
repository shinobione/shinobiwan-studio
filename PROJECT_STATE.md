# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build102 REAL USER PASS** and cross-stack reconciliation against current LaunchPAD / Worker GitHub truth.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.24
Studio build            Build102
Codename                studio-focus-slice4-phase9-track-asset-etag-representation-corrective
Acceptance              REAL USER PASS
Runtime PR              #193
Exact tested head       cfebb5cfe5b87627a29890a7477bd5628ef60759
Final runtime CI        #524 · 31979380563 · SUCCESS
Runtime merge SHA       64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages           #200 · 31979525479 · SUCCESS build + deploy
Candidate docs PR       #194
Candidate docs CI       #525 · 31979629544 · SUCCESS
Candidate docs merge    68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages    #201 · 31979667787 · SUCCESS
Acceptance docs PR      #195
Acceptance docs CI      #526 · 31980142885 · SUCCESS
Acceptance docs merge   ae297162fd6579eabe2d455d65f57b129dce58bc
Acceptance docs Pages   #206 · 31980208567 · SUCCESS build + deploy
Real-user smoke         ASSET SAVED · Canonical reread Verified · Catalog rebuilt Yes
Canonical revision      2026-08-16T23:42:38.231Z
Safety pre-build        safety/pre-build102-etag-normalization-corrective-20260817-0120
Safety green premerge   safety/post-build102-green-premerge-20260817-0134
Safety post-deploy      safety/post-build102-deployed-candidate-20260817-0136
Safety post-acceptance  safety/post-build102-real-user-pass-20260817-0142
```

**Build102 is the current accepted Studio runtime.** Build101 is a rejected historical candidate: its Track-asset write committed, but quoted R2 `httpEtag` versus raw canonical `etag` caused a real-user false-negative verifier result. Build102 changes only that representation comparison while preserving exact revision/filename/presence/fingerprint proof and zero automatic upload retry.

Detailed receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

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

Public Worker v2.8 closes the previously listed publication-projection gap outside the Studio runtime: a published Track is withheld from public list/detail/media while its canonical owner Album remains draft/archived; standalone published Singles and Tracks owned by published Albums remain public. Canonical ownership is derived from Album `trackIds`, and the real-user production smoke passed with `Pixels & Promises` hidden while `Anh Yêu Em` remained Draft.

No Build102 backend deployment occurred. The Build102 acceptance media mutation was one intentional cover upload only.

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
Build101                REJECTED candidate · ETag representation false negative
Build103                UNALLOCATED · fresh read-only audit required
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

## Immediate next action

**Fresh read-only post-Build102 Phase9 audit.** Do not allocate Build103 before the current implementation proves the smallest coherent next gap.

Remaining candidates to re-evaluate, without pre-selecting one:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can expose trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries;
- degraded/offline behavior that materially affects the private Studio workflow.

The publication-projection item is **closed cross-stack by Public Worker v2.8** and is no longer a Build103 candidate.

## Backlog kept intact

- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
