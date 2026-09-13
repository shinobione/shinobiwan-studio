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
Studio accepted        v0.19.31 · Build109 · REAL USER PASS
Runtime scope          explicit Track-create operation identity
Studio PR              #218
Studio candidate       5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI              #660 · 34762678307 · SUCCESS
Studio merge           4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages           #229 · 34762759192 · SUCCESS build + deploy
Backend PR             LaunchPAD-APP #276
Backend candidate      3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge          5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy           #44 · 34762956165 · SUCCESS · admin only
Real-user smoke        PASS · disposable Track · exact creationOperationId reread
Build108               ACCEPTED predecessor · catalog rebuild generation identity
Build107               ACCEPTED predecessor · Phase10 Slice1
Track Manager          v5.24 · protected canonical write authority
Studio bridge          v1.14
Public Worker          v2.8 · REAL USER PASS · unchanged
LaunchPAD public       2026.08.12.102 · REAL USER PASS
LRC Maker              6.3.8
```

**Studio v0.19.31 · Build109 is the current accepted Studio runtime identity.**

Build109 gives explicit Studio Track creation a durable private causal proof boundary. Each explicit create generates one browser UUID, Track Manager persists it privately as canonical `creationOperationId`, and Studio keeps the create POST one-shot. If the HTTP response is lost, Studio rereads the private canonical Track and recovers success only when the exact UUID is observed. Missing, mismatched, legacy or unreadable identity remains ambiguous/unverified and non-retryable.

Real-user acceptance on 2026-09-13 proved:

```text
Track                   build109-smoke-20260913
status                  draft
Album                   Singles
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
canonical reread        verified
cleanup                 disposable Track deleted
```

Latest acceptance receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

Detailed changelog: [`changelogs/CHANGELOG-BUILD109.md`](changelogs/CHANGELOG-BUILD109.md).

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
Phase 10 Slice2     UNALLOCATED
Phase 10            ACTIVE · progressive extraction by bounded audited slices
Build108            COMPLETE · catalog rebuild identity · REAL USER PASS
Build109            COMPLETE · Track-create identity · REAL USER PASS
Build110            UNALLOCATED
Official Phase 11   NONE
```

Build108 and Build109 are deliberately bounded reliability/backend-contract work outside Phase10 Slice2. No Build110 is allocated until a fresh audit proves a concrete scope.

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

Preserved backlog includes Album-create operation identity, exact-byte/digest proof for binary upload families, optional future Deep Audio operation identity/status, degraded/offline workflow work only when a bounded product slice is proven, premium interaction polish, and further Phase10 extraction only when singular authority and independent rollback remain explicit.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.

The repository still publishes no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
