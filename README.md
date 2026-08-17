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
Studio                v0.19.25 · Build103 · REAL USER PASS
Codename              studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth
Runtime PR            #198
Exact tested head     9d89aa1051b67b828836a45b648b6f45b69dbe74
Validation            #543 · 31981673322 · SUCCESS
Runtime merge         5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages         #209 · 31981768144 · SUCCESS
Candidate docs PR     #199
Candidate docs merge  c98bfbba7c48d2cbf96b7b4760204b6d0523c228
Candidate docs Pages  #210 · 31981993765 · SUCCESS
Real-user smoke       BUILD103 SMOKED 💨
Build101              REJECTED candidate · ETag representation false negative
Track Manager         v5.24 · REAL USER VERIFIED
Studio bridge         v1.14
TM admin Worker       53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker         v2.8 · REAL USER PASS
Public Worker deploy  31974132377 · public only
Public Worker version 49d87191-a13e-41a7-80c8-d1fd9362af77
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.25 · Build103 is the current accepted Studio runtime.** Build103 hardens only the non-mutating canonical master-audio GET performed before SonicTrace / Deep Audio compute. That GET may retry once for bounded transient failures; the expensive `POST /api/studio/analyze` remains strictly one-shot with **zero automatic retries**.

Public Worker **v2.8** remains accepted cross-stack truth. It withholds a published Track from public list/detail/media while its canonical parent Album remains Draft/archived, using Album `trackIds` as ownership authority.

Detailed latest Studio receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md).

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
Build104            UNALLOCATED · fresh read-only post-Build103 audit required
Phase 10            FUTURE · progressive extraction
Official Phase 11   NONE
```

The immediate next action is a **fresh read-only post-Build103 Phase9 audit**. Build104 must not be allocated until the current implementation proves one smallest coherent next gap.

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

Build103 extends that bounded philosophy to the canonical-audio pre-compute GET only. It does not authorize automatic Deep Audio POST retry.

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
- Deep Audio duplicate-compute boundaries beyond the safe pre-compute GET;
- degraded/offline workflow work only when a bounded product slice is proven;
- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions and reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC / SonicTrace / catalog engines while Studio remains orchestrator;
- no official Phase11.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.
