# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build105 REAL USER PASS**.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.27
Studio build            Build105
Codename                studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective
Acceptance              REAL USER PASS
Runtime PR              #204
Exact tested head       efa188b8d7181a4aa03bdea4bf2da40534203e9e
Final runtime CI        #585 · 32002434543 · SUCCESS
Runtime merge SHA       f3a295d5e7bdbd0cfa05cc6d44901fab62e42c5b
Runtime Pages           #215 · 32002484381 · SUCCESS build + deploy
Candidate docs PR       #205
Candidate docs CI       #586 · 32002709875 · SUCCESS
Candidate docs merge    6de3709d4e89a2806cbf0cf9b598d71d49b1742f
Candidate docs Pages    #216 · 32002755699 · SUCCESS build + deploy
Real-user smoke         BUILD105 SMOKED 💨 · FULL profile ready · Deep Audio analysis complete
Safety pre-build        safety/pre-build105-deep-audio-presubmit-corrective-20260817
Safety green premerge   safety/post-build105-green-premerge-20260817-0838
Safety post-deploy      safety/post-build105-deployed-candidate-20260817-0839
Safety post-acceptance  safety/post-build105-real-user-pass-20260817-0854
Acceptance closeout     docs/build105-acceptance-closeout-20260817
Worker deploy           NONE
Track Manager change    NONE
SonicTrace backend      NONE
Public Worker change    NONE
R2 migration/schema     NONE
```

**Build105 is the current accepted Studio runtime.** It retains Build103's bounded pre-compute canonical-audio GET retry and narrows the Deep Audio response-loss fence to cases where the browser has observed upload start.

```text
transport/timeout before upload start
→ PRE-SUBMIT UNREACHABLE
→ no duplicate-compute fence
→ zero automatic retry
→ explicit manual re-scan allowed after coordinator recovery

transport/timeout after upload start
→ COMPUTE UNKNOWN
→ exact Track/source fenced in-page
→ zero automatic retry
→ reload required before deliberate resubmit
```

Synchronous `xhr.send()` failure is pre-submit and unfenced. `POST /api/studio/analyze` remains one-shot per explicit user action.

Detailed receipt: [`docs/acceptance/BUILD105-REAL-USER-PASS.md`](docs/acceptance/BUILD105-REAL-USER-PASS.md).

## Rejected historical candidates

### Build104

```text
Studio version          v0.19.26
Studio build            Build104
Codename                studio-focus-slice4-phase9-deep-audio-response-loss-fence
Verdict                 REAL USER SMOKE FAILED · FALSE UNKNOWN CLASSIFICATION
Runtime PR              #202
Exact tested head       8060a81b7fdb6a608244c768a042e56e630451f0
Final runtime CI        #564 · 31983472391 · SUCCESS
Runtime merge SHA       a0a082376eedc6c5c90bad59bbc5e92bf72e6cdd
Runtime Pages           #213 · 31983514507 · SUCCESS build + deploy
Candidate docs PR       #203
Candidate docs merge    aa448498549964fe44bd14a1c1767c400ddb8e2d
Candidate docs Pages    #214 · 31983689742 · SUCCESS build + deploy
```

Build104 correctly established the desired fence for true Deep Audio response loss, but armed it for every XHR transport failure. The human normal-path smoke exposed that node-offline / blocked / pre-submit transport could be misclassified as compute-UNKNOWN before browser-observed upload start. Build104 remains rejected and is superseded by accepted Build105.

### Build101

Build101 remains rejected historical evidence: its Track-asset write committed, but quoted R2 `httpEtag` versus raw canonical `etag` caused a real-user false-negative verifier result. Build102 corrected only that representation comparison and remains accepted ancestry.

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

No Build104 or Build105 backend deployment occurred. Their Studio deployments perform no R2 mutation.

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
Build104                REJECTED candidate · false Deep Audio UNKNOWN classification
Phase 9 Slice22         COMPLETE · Build105 REAL USER PASS
Build106                UNALLOCATED
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
- Build105 never automatically retries Deep Audio compute; it fences only after browser-observed upload start.
- rejected Build101 and Build104 evidence stays rejected; successor acceptance does not rewrite history.

## Human acceptance evidence

The normal-path Build105 smoke used **Ghost Signal** with a healthy local SonicTrace coordinator and visibly reached:

```text
FULL profile ready
Audio match: Current
History: 1 scan
Deep Audio analysis complete
Browser RMS: -14.7 dBFS
LUFS: -12.5 LUFS
True Peak: -0.3 dBTP
Sections: 9
```

The review surface exposed DSP, MASTERING, NEURAL, EMBEDDING, STRUCTURE and SEMANTIC SUMMARY layers, with no `DEEP AUDIO STATE UNKNOWN` and no `RELOAD BEFORE RESUBMIT`.

## Immediate next action

**Fresh read-only post-Build105 Phase9 audit.** Build106 stays **UNALLOCATED** until the current repository and runtime state prove one smallest coherent next gap.

Do not manufacture timeout, disconnect the network, stop the coordinator, or force Access failure as production QA. Automated guards own those classification boundaries.

## Backlog kept intact

- create/upload response-loss causality requiring backend operation identity or trustworthy digest evidence;
- future Deep Audio operation status/idempotency only if the coordinator gains a safe contract;
- degraded/offline workflow work when a bounded slice is proven;
- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
