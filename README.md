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
Build104               REJECTED · false UNKNOWN classification in real-user smoke
Latest candidate       v0.19.27 · Build105 · REAL USER SMOKE PENDING
Candidate runtime PR   #204
Candidate tested head  efa188b8d7181a4aa03bdea4bf2da40534203e9e
Candidate validation   #585 · 32002434543 · SUCCESS
Candidate merge        f3a295d5e7bdbd0cfa05cc6d44901fab62e42c5b
Candidate Pages        #215 · 32002484381 · SUCCESS build + deploy
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

**Studio v0.19.25 · Build103 remains the current accepted Studio runtime.** Its non-mutating canonical master-audio GET before SonicTrace / Deep Audio compute may retry once for bounded transient failures; `POST /api/studio/analyze` remains strictly one-shot with **zero automatic retries**.

**Build104 is rejected historical evidence.** Its duplicate-compute fence correctly treated true post-submit response loss as compute-UNKNOWN, but it armed that fence for every XHR transport failure, including failures where the browser had not observed upload start. The normal-path real-user smoke therefore produced a false `DEEP AUDIO STATE UNKNOWN` / `RELOAD BEFORE RESUBMIT` state.

**Studio v0.19.27 · Build105 is the deployed corrective candidate.** It separates pre-submit coordinator transport failure from response loss after browser-observed upload start:

```text
transport / timeout before upload start
→ PRE-SUBMIT UNREACHABLE
→ no duplicate-compute fence
→ zero automatic retry
→ explicit manual re-scan allowed after coordinator recovery

transport / timeout after upload start
→ COMPUTE UNKNOWN
→ exact Track/source fenced in-page
→ zero automatic retry
→ reload required before deliberate resubmit
```

Public Worker **v2.8** remains accepted cross-stack truth. It withholds a published Track from public list/detail/media while its canonical parent Album remains Draft/archived, using Album `trackIds` as ownership authority.

Latest accepted Studio receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md). Current candidate detail: [`changelogs/CHANGELOG-BUILD105.md`](changelogs/CHANGELOG-BUILD105.md).

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
Phase 9 Slice22     Build105 · DEPLOYED CORRECTIVE CANDIDATE · SMOKE PENDING
Phase 10            FUTURE · progressive extraction
Official Phase 11   NONE
```

The immediate next action is the **normal-path Build105 real-user smoke with the local SonicTrace coordinator healthy**. Do not manufacture timeout/network loss to test the fence in production; automated guards already cover pre-submit versus post-upload response-loss behavior.

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
