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

**Studio v0.19.40 / Build118 — REAL USER PASS for Catalogue A2.1 native read-only foundation.** Source [PR #236](https://github.com/shinobione/shinobiwan-studio/pull/236), exact merge `b035fb226e8c9a2654306076522faa4da97fb3ea`, [Pages run 36249977846](https://github.com/shinobione/shinobiwan-studio/actions/runs/36249977846) build + deploy SUCCESS and owner-reported seven-check browser PASS. [Build118 receipt](docs/acceptance/BUILD118-REAL-USER-PASS.md). Track Manager v5.28 / bridge v1.18 unchanged.

A2.1 adds Catalogue after Albums, with Overview/Releases/Recordings/QA and honest empty states. Import, populated discography and persistence are **not** included; A2.2 is the next separate scope. [PROJECT_STATE.md](PROJECT_STATE.md) has the latest canonical checkpoint.

## Product model

```text
Home
Tracks
Albums
Catalogue (commercial, read-only foundation)

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
Phase 10 Slice2     UNALLOCATED
Phase 10            ACTIVE · progressive extraction by bounded audited slices
Build108            COMPLETE · catalog rebuild identity · REAL USER PASS
Build109            COMPLETE · Track-create identity · REAL USER PASS
Build110–117        COMPLETE · see canonical checkpoint and acceptance receipts
Build118            COMPLETE · Catalogue A2.1 · REAL USER PASS
Official Phase 11   NONE
```

Build118 is accepted bounded Catalogue product work outside Phase10 Slice2. A2.2 local-private import remains separately scoped and unallocated.

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

Build108 adds stronger evidence only for explicit catalog rebuild through canonical `generationId`.
Build109 adds stronger evidence only for explicit Track create through private immutable `creationOperationId`.
Neither authorizes generic operation IDs or retries for unrelated write families.

## Release identity rule

`src/release.ts` and `package.json` carry canonical Studio runtime identity. The build runs `check:release`, which rejects stale build/version metadata relative to the latest `check:buildNNN` gate and keeps the visible sidebar phase/version/build/summary tied to `studioRelease` instead of hard-coded historical copy.

## Roadmap continuity

Preserved backlog includes Album asset exact-byte/digest proof, optional future Deep Audio operation identity/status, degraded/offline workflow work only when a bounded product slice is proven, premium interaction polish, and further Phase10 extraction only when singular authority and independent rollback remain explicit.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.

The repository still publishes no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
