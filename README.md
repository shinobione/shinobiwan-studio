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
Studio accepted        v0.19.25 · Build103 · REAL USER PASS
Accepted runtime PR    #198
Accepted runtime CI    #543 · 31981673322 · SUCCESS
Accepted runtime merge 5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Accepted runtime Pages #209 · 31981768144 · SUCCESS
Latest candidate       v0.19.26 · Build104 · REAL USER SMOKE PENDING
Candidate runtime PR   #202
Candidate tested head  8060a81b7fdb6a608244c768a042e56e630451f0
Candidate validation   #564 · 31983472391 · SUCCESS
Candidate merge        a0a082376eedc6c5c90bad59bbc5e92bf72e6cdd
Candidate Pages        #213 · 31983514507 · SUCCESS
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

**Studio v0.19.25 · Build103 remains the current accepted Studio runtime.** Build103 hardens only the non-mutating canonical master-audio GET performed before SonicTrace / Deep Audio compute. That GET may retry once for bounded transient failures; the expensive `POST /api/studio/analyze` remains strictly one-shot with **zero automatic retries**.

**Studio v0.19.26 · Build104 is deployed as a candidate awaiting real-user smoke.** The fresh audit proved that timeout/transport after a Deep Audio POST submit cannot safely be treated as “not started” or retry-safe. Build104 therefore fences that exact Track + canonical source revision in the current page, reports **COMPUTE UNKNOWN**, refuses a second Deep Audio POST for the fenced source, and requires an explicit page reload before a deliberate manual resubmit. It does not add any automatic compute retry.

Public Worker **v2.8** remains accepted cross-stack truth. It withholds a published Track from public list/detail/media while its canonical parent Album remains Draft/archived, using Album `trackIds` as ownership authority.

Latest accepted Studio receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md). Build104 candidate detail: [`docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).

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
Phase 9 Slice22     Build104 · DEPLOYED CANDIDATE · SMOKE PENDING
Build101            REJECTED candidate
Phase 10            FUTURE · progressive extraction
Official Phase 11   NONE
```

The immediate next action is the **normal-path Build104 real-user smoke**. Do not manufacture timeout/network loss to test the fence in production; automated guards already cover that failure path.

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

Build103 extends that bounded philosophy to the canonical-audio pre-compute GET only. Build104 does **not** retry Deep Audio compute: timeout/transport after submit becomes UNKNOWN and blocks a second same-source POST until page reload.

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
