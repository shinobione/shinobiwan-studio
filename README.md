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
Studio accepted        v0.19.30 · Build108 · REAL USER PASS
Runtime scope          explicit catalog rebuild generation identity
Studio PR              #216
Studio head            b27a2891d2041d79aad4ab2910a150516af74ad4
Studio CI              #639 · 34752807960 · SUCCESS
Studio merge           e380a6ab098bddad8b744812515df36fe3ef5906
Studio Pages           #227 · 34753099885 · SUCCESS build + deploy
Backend PR             LaunchPAD-APP #275
Backend merge          31675ba4444282691c6e4d55d098f187ab3c4bad
Admin deploy           34753041082 · SUCCESS · admin only
Admin Worker           ff037b48-b717-49a4-82ad-395aa06b6f6f
Real-user smoke        PASS · 45 tracks · exact generation UUID · canonical reread verified
Build107               ACCEPTED predecessor · Phase10 Slice1
Track Manager          v5.24 · protected canonical write authority
Studio bridge          v1.14
Public Worker          v2.8 · REAL USER PASS · unchanged
LaunchPAD public       2026.08.12.102 · REAL USER PASS
LRC Maker              6.3.8
```

**Studio v0.19.30 · Build108 is the current accepted Studio runtime identity.**

Build108 gives the explicit Studio catalog rebuild a durable causal proof boundary. Each explicit rebuild creates one browser UUID, Track Manager persists it as the canonical catalog `generationId`, and Studio rereads the private canonical projection before declaring success. If the HTTP response is lost, Studio never retries the write automatically; it recovers success only when the exact UUID is observed in canonical state.

Real-user acceptance on 2026-09-13 proved:

```text
CATALOG REBUILT
45 tracks
generated               2026-09-13T10:57:36.269Z
generation              c4072021-707b-4d03-be8e-d21324a348b4
canonical reread        verified
```

Latest acceptance receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

Detailed changelog: [`changelogs/CHANGELOG-BUILD108.md`](changelogs/CHANGELOG-BUILD108.md).

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
Phase 9             COMPLETE · program closeout on accepted Build106
Phase 10 Slice1     Build107 · REAL USER PASS
Phase 10 Slice2     UNALLOCATED · fresh audit found no justified extraction
Phase 10            ACTIVE · progressive extraction by bounded audited slices
Build108            COMPLETE · reliability/backend-contract slice · REAL USER PASS
Official Phase 11   NONE
```

Build108 is deliberately not Phase10 Slice2. The next proposed work is a fresh bounded audit of **Track Create operation identity**; Build109 remains unallocated until that audit proves a safe contract.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD / Public Worker** — public listener and public-read visibility layer.
- **SonicTrace** — audio intelligence and canonical owner of the Build107 projection kernel.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- canonical Album membership/ownership = Album `trackIds`.
- public fallback remains read-only and never verifies canonical writes.

## Reliability rules

Private GET retry is bounded to accepted transient classes and at most one retry. It never authorizes write retry.

For accepted write-hardening slices:

```text
response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

Build108 adds stronger evidence only for explicit catalog rebuild: the exact browser operation UUID must match canonical `generationId`. This does not authorize generic operation IDs or retries for Track create, Album create, asset upload or Deep Audio.

## Roadmap continuity

Preserved backlog includes Track/Album create operation identity, exact-byte/digest proof for binary upload families, optional future Deep Audio operation identity/status, degraded/offline workflow work only when a bounded product slice is proven, premium interaction polish, and further Phase10 extraction only when singular authority and independent rollback remain explicit.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.

The repository still publishes no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
