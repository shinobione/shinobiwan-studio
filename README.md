# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, read in order:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify real GitHub state before mutation.

## Current accepted state

```text
Studio accepted        v0.19.28 · Build106 · REAL USER PASS
Accepted runtime PR    #208
Accepted tested head   61bca333a7f9898444c8d9e1610e3d6c6585664b
Accepted runtime CI    #611 · 32058498867 · SUCCESS
Accepted runtime merge 9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Accepted runtime Pages #219 · 32058828759 · SUCCESS build + deploy
Candidate docs PR      #209
Candidate docs CI      #612 · 32059364849 · SUCCESS
Candidate docs merge   24125d13962d8394ff0026ebbe38341607726054
Candidate docs Pages   #220 · 32059459541 · SUCCESS build + deploy
Real-user smoke        PRIVATE/INCOGNITO · PUBLIC READ-ONLY FALLBACK · Ghost Signal detail opened
Build105               ACCEPTED predecessor · Deep Audio pre-submit corrective
Build104               REJECTED candidate · false UNKNOWN classification
Build101               REJECTED candidate · ETag representation false negative
Track Manager          v5.24 · REAL USER VERIFIED
Studio bridge          v1.14
TM admin Worker        53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker          v2.8 · REAL USER PASS
LaunchPAD public       2026.08.12.102 · REAL USER PASS
SonicTrace             V2-E Build08 · REAL USER PASS
Deep Audio             2.0.3-alpha
LRC Maker              6.3.8
```

**Studio v0.19.28 · Build106 is the current accepted Studio runtime.** The real-user smoke used a private/incognito browser context without the private Cloudflare Access session. Studio visibly entered **PUBLIC READ-ONLY FALLBACK**, loaded the published Track workspace and opened **Ghost Signal** detail/lyrics while displaying the Build106 release identity.

Build106 hardens only the **public LaunchPAD Track-catalog fallback after the preferred private canonical read has actually failed**. The initial public read remains the existing one-shot parallel enrichment request. If private fails and that first public request also failed with timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`, Studio may repeat the public GET exactly once. Maximum public attempts: **2**.

Deterministic HTTP failures, invalid JSON and invalid semantic payloads do not retry. The generic HTTP helper stays one-shot. No write retry, Public Worker change, Track Manager change, SonicTrace backend change, Deep Audio change or R2 mutation was introduced.

Build105 remains accepted predecessor truth. Build104 remains rejected historical evidence for its false Deep Audio UNKNOWN classification, and Build101 remains rejected historical evidence for its ETag-representation false negative.

Public Worker **v2.8** remains accepted cross-stack truth. It withholds a published Track from public list/detail/media while its canonical parent Album remains Draft/archived, using Album `trackIds` as ownership authority.

Latest accepted Studio receipt: [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md).

The Studio repository still publishes **no formal GitHub Release objects and no Git tags**. Runtime release identity is carried by code, docs and Pages.

## Product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace summary.
- **Visuals** — cover, thumbnail and Canvas. Cover is required; Canvas is optional.
- **Lyrics** — canonical `lyrics.txt`, embedded LRC Maker and text editing.
- **Release** — final production check + browser-local Release Campaign.
- **Sonic / Details / Advanced** — full SonicTrace analysis and deliberately requested technical depth.

Production and publication remain separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Draft
```

Public visibility is additionally gated by canonical parent-Album publication in Public Worker v2.8.

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same workflow authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1–19   Build82→Build100 · REAL USER PASS
Phase 9 Slice20     Build102 · REAL USER PASS
Phase 9 Slice21     Build103 · REAL USER PASS
Build101            REJECTED candidate
Build104            REJECTED candidate · false UNKNOWN classification
Phase 9 Slice22     Build105 · REAL USER PASS
Phase 9 Slice23     Build106 · REAL USER PASS
Build107            UNALLOCATED · fresh read-only post-Build106 audit required
Phase 10            FUTURE · progressive extraction
Official Phase 11   NONE
```

The immediate next action is a **fresh read-only post-Build106 Phase9 audit**. Build107 must not be allocated until the real current implementation proves one smallest coherent next gap.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD / Public Worker** — public listener and public-read visibility layer.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- canonical Album membership/ownership = Album `trackIds`.
- public fallback remains read-only and never verifies canonical writes.

## Reliability rules

Private GET retry is bounded to accepted transient classes and at most one retry. It never authorizes write retry.

Build103 retries only the canonical-audio pre-compute GET. Build105 keeps Deep Audio POST at one attempt per explicit user action and distinguishes pre-submit unreachable from true response-loss ambiguity using browser-observed upload phase evidence.

Build106 adds one bounded retry only to the public read-only Track-catalog fallback **after final private-read failure**. It does not alter the generic HTTP helper and never authorizes write retry.

For accepted Phase9 writes:

```text
response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

Each write family keeps operation-specific postconditions.

## Roadmap continuity

Preserved backlog includes:

- Album/Track create and upload causality gaps that require stronger operation identity or digest evidence;
- stronger Deep Audio operation identity/status only if the coordinator gains a safe backend contract;
- degraded/offline workflow work only when a bounded product slice is proven;
- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions and reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC / SonicTrace / catalog engines while Studio remains orchestrator;
- no official Phase11.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.
