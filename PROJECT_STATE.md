# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build106 REAL USER PASS**, acceptance closeout, and **Phase9 program closeout audit**.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.28
Studio build            Build106
Codename                studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth
Acceptance              REAL USER PASS
Audit base              7dfda47ed1186adf815bfd60a9c2affa5e1b255e
Runtime PR              #208
Exact tested head       61bca333a7f9898444c8d9e1610e3d6c6585664b
Final runtime CI        #611 · 32058498867 · SUCCESS
Runtime merge SHA       9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Runtime Pages           #219 · 32058828759 · SUCCESS build + deploy
Candidate docs PR       #209
Candidate docs CI       #612 · 32059364849 · SUCCESS
Candidate docs merge    24125d13962d8394ff0026ebbe38341607726054
Candidate docs Pages    #220 · 32059459541 · SUCCESS build + deploy
Acceptance docs PR      #210
Acceptance docs CI      #613 · 32062146377 · SUCCESS
Acceptance docs merge   a79b5c44d86b45361fe4d649114f7f8b5c29849c
Acceptance docs Pages   #221 · 32062257475 · SUCCESS build + deploy
Final receipts PR       #211
Final receipts CI       #614 · 32062830991 · SUCCESS
Final receipts merge    0b576d0fc521b579d3ae88b2878003591e253ed1
Final receipts Pages    #222 · 32062944646 · SUCCESS build + deploy
Real-user smoke         PASS · private/incognito · PUBLIC READ-ONLY FALLBACK · Ghost Signal detail opened
Safety pre-build        safety/pre-build106-public-catalog-fallback-retry-20260817
Safety green premerge   safety/post-build106-green-premerge-20260817-2112
Safety post-deploy      safety/post-build106-deployed-candidate-20260817-2115
Safety real-user pass   safety/post-build106-real-user-pass-20260817-2141
Safety post-acceptance  safety/post-build106-acceptance-closeout-20260817-2151
Phase9 closeout safety  safety/pre-phase9-program-closeout-20260817-2205
Worker deploy           NONE
Track Manager change    NONE
Public Worker change    NONE
SonicTrace backend      NONE
R2 migration/schema     NONE
```

**Build106 remains the current accepted Studio runtime.** The Phase9 closeout is docs/governance only and does not allocate or deploy a new runtime build.

Build106 hardens only the public LaunchPAD Track-catalog fallback used after the preferred private canonical Track Manager read has ultimately failed.

```text
private read succeeds
→ no second public GET

private read fails + first public read succeeds
→ use public fallback immediately

private read fails + first public read fails transiently
→ exactly one public GET retry
→ maximum 2 public attempts total

private read fails + deterministic public failure
→ no retry
```

The bounded public family is only `GET /health`, `GET /tracks`, and `GET /tracks/<trackId>`. Generic `src/services/http.ts` remains one-shot. No write semantics changed.

Detailed acceptance receipt: [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md).

Phase9 program closeout audit: [`docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md).

## Accepted predecessor / rejected historical candidates

Build105 remains accepted predecessor truth. It retains Build103's bounded pre-compute canonical-audio GET retry and the accepted Deep Audio pre-submit/post-upload response-loss boundary. `POST /api/studio/analyze` remains one-shot per explicit user action with zero automatic retries.

Build104 remains **REJECTED** historical evidence because it falsely classified pre-submit/node-offline Deep Audio transport as compute UNKNOWN. Build105 corrected that boundary.

Build101 remains **REJECTED** historical evidence because quoted R2 `httpEtag` versus raw canonical `etag` caused a Track-asset verification false negative. Build102 corrected only that representation comparison.

Successor acceptance and Phase9 closeout do not rewrite either verdict.

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

No Build106 backend deployment occurred. Its Studio deployment performs no R2 mutation.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 COMPLETE · program closeout on accepted Build106
Phase 9 Slice1–19       COMPLETE · Build82→Build100 REAL USER PASS
Phase 9 Slice20         COMPLETE · Build102 REAL USER PASS
Phase 9 Slice21         COMPLETE · Build103 REAL USER PASS
Build101                REJECTED candidate · ETag representation false negative
Build104                REJECTED candidate · false Deep Audio UNKNOWN classification
Phase 9 Slice22         COMPLETE · Build105 REAL USER PASS
Phase 9 Slice23         COMPLETE · Build106 REAL USER PASS
Build107                UNALLOCATED / UNUSED
Phase 10                NEXT · progressive extraction · SCOPE AUDIT REQUIRED
Official Phase 11       NONE
```

The fresh post-Build106 audit found no remaining bounded Studio-only reliability slice that can be implemented truthfully under current backend contracts.

Remaining causality questions require stronger backend evidence such as operation identity, digest, generation token, durable request status, or equivalent authoritative proof.

## Frozen authority and reliability rules

- GitHub = application-code authority; R2 = canonical catalog/media/data authority.
- Track Manager = protected Track/Album write authority; Studio = private orchestrator, never a generic R2 writer.
- Album `trackIds` remains the sole canonical Album-membership authority.
- public fallback is read-only and never verifies writes.
- private GET/transient retry is bounded and never authorizes write retry.
- accepted Phase9 writes use: `response unavailable → no blind retry → private canonical reread → committed / not committed / ambiguous / unverified` with operation-specific postconditions.
- Build103 retries only the pre-compute canonical-audio GET.
- Build105 never automatically retries Deep Audio compute; it fences only after browser-observed upload start.
- Build106 retries only a transient public GET fallback after final private-read failure; it never widens generic network helpers or write semantics.
- Phase9 closeout freezes these client-side reliability contracts.
- no Studio-only code may claim write causality that current backend evidence cannot prove.

## Human acceptance evidence

The Build106 normal-path smoke was executed in a browser private/incognito context without the private Cloudflare Access session.

Visible evidence showed:

```text
Studio footer           v0.19.28 · Build 106
Track                    Ghost Signal · PUBLISHED
Fallback banner          PUBLIC READ-ONLY FALLBACK
Fallback state           Private production tools are temporarily locked
Read source              LaunchPAD public catalog
Track detail             opened successfully
Lyrics canonical source  lyrics.txt PRESENT · READ ONLY
```

Result: **PASS**.

## Immediate next action

**Fresh read-only Phase10 scope audit.**

Phase10 remains **NEXT**, not ACTIVE. Build107 stays **UNALLOCATED / UNUSED** until the current repositories prove one smallest coherent progressive-extraction slice that:

- preserves Studio as orchestrator;
- preserves standalone LaunchPAD / Track Manager / SonicTrace / LRC Maker behavior;
- is independently reversible;
- does not create a second authority;
- does not bundle opportunistic refactors.

## Backlog kept intact

- Track create lost-response causality / operation identity;
- Album create lost-response causality / operation identity;
- exact-byte/digest proof for binary upload families;
- catalog rebuild operation identity/generation evidence;
- future Deep Audio operation status/idempotency only if the coordinator gains a safe contract;
- degraded/offline workflow work when a bounded slice is proven;
- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.