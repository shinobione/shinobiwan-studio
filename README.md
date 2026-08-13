# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current accepted baseline

```text
Studio          v0.19.3 · Build 67    Foundation Regression Repair closeout · REAL USER PASS
LaunchPAD       2026.08.12.102        C3-C · REAL USER PASS
Track Manager   v5.21                 repair scope · REAL USER PASS
Studio bridge   v1.11
Public Worker   v2.7                  unchanged
SonicTrace      V2-E Build 08         REAL USER PASS
Deep Audio      2.0.3-alpha
LRC Maker       6.3.8
```

Build 67 is the accepted Studio runtime. It closes the Foundation Regression Repair discovered after the Phase 7-C contract was locked and before runtime Slice 1 started. The repair restored private Album artwork presentation, canonical Album membership discipline, stable missing-Lyrics handling, clearer asset identity and a permanent top-level `LYRICS TXT` source control.

Build 64 is preserved as **deployed candidate / FAILED REAL USER SMOKE** evidence. Builds 65 and 66 are corrective lineage superseded by Build 67.

Phase 7-C remains **STARTED at contract level**. The repair gate is cleared, but runtime Slice 1 has **not started yet**.

## Release terminology

`Studio v0.19.3 · Build 67` is the current accepted **project/runtime release identity**.

This repository currently publishes **no GitHub Release objects and no Git tags**. Formal GitHub Releases/tags would be a separate distribution/versioning decision.

Accepted Studio lineage:

```text
Phase 7-A                         Build 46   REAL USER PASS
Phase 7-B                         Build 51   REAL USER PASS
Studio Focus Slice 1              Build 53   REAL USER PASS
Studio Focus Slice 2              Build 56   REAL USER PASS
Studio Focus Slice 3              Build 58   REAL USER PASS
Studio Focus Slice 4              Build 61   REAL USER PASS
Studio Focus closeout             Build 62   REAL USER PASS
Foundation repair candidate       Build 64   FAILED REAL USER SMOKE
Foundation repair crash fix       Build 65   superseded by Build 67
Foundation repair UX continuity   Build 66   superseded by Build 67
Foundation repair closeout        Build 67   REAL USER PASS
```

Build 62 remains the accepted Studio Focus program closeout. Historical Build 63 remains superseded and is not reused.

**Phase 7-C is STARTED at contract level after explicit authorization; the Foundation Regression Repair gate is now CLEARED and runtime Slice 1 remains NOT YET STARTED.**

## Daily product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Final closeout decision: **Workflow remains under Advanced**. Home owns daily continuation, counters and the abbreviated attention queue; Workflow owns the full detailed searchable/filterable production queue.

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace artist summary.
- **Visuals** — Cover / Thumbnail / Canvas; Canvas preview is 9:16.
- **Lyrics** — canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor.
- **Release** — final checklist + browser-local Release Campaign.
- **Details / Advanced** — full metadata, SonicTrace diagnostics and technical depth when deliberately requested.

Production and publication remain separate overlapping axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Drafts
```

## Toolchain roles

- **GitHub** — application code.
- **Cloudflare R2** — canonical catalog/media/data.
- **Track Manager** — protected canonical track/album operations.
- **Studio** — private cockpit and orchestrator.
- **LaunchPAD** — public listener experience.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` is the same R2 track slug across the toolchain.

Public fallback remains read-only and never replaces private state.

## Canonical contracts — quick reference

Lyrics:

```text
tracks/<slug>/lyrics.txt
```

Recognized timestamps inside `lyrics.txt` define synchronization. `.lrc` is optional compatibility/export only.

Albums:

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` owns membership and artistic order. The Track-side Album field is a compatibility cache and must not be edited independently of guarded Album operations.

SonicTrace:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

## Native Release Campaign

```text
Canonical Track context
        ↓
MASTER FINAL 16:9
        ├── 1:1 derived independently from MASTER
        └── 9:16 derived independently from MASTER
```

9:16 is never derived from 1:1. Campaign drafts remain browser-local and ZIP export remains review-only.

Build 62 removed the misleading Premium provider selector because provider selection never changed MASTER or derivative prompt generation. Prompts remain provider-agnostic and Google Flow stays available as a direct convenience handoff.

## Final accepted repair evidence

```text
Studio tested PR head  6c1d801b14ae8daedfb246da539a42125f7c80d9
Studio validation run  31738652169    SUCCESS
Studio main            5f061a460f17e27b9c2f06fdcbdda2f34e07e240
Studio Pages run       31738982707    SUCCESS
Track Manager          v5.21
Studio bridge          v1.11
LaunchPAD main         813eb845b563b9a176c23f490d7fc044d4a0abc3
TM Worker run          31728992790    SUCCESS · admin only
TM Worker Version ID   0e1b9a3f-eabd-432e-8872-24ff0a9c085f
Public Worker          v2.7           unchanged
```

Final accepted Build 67 browser verdict: **REAL USER PASS**.

Rollback/checkpoint:

```text
safety/post-build67-lyrics-source-anchor-20260813-2205
```

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Foundation Regression Repair closeout REAL USER PASS](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- [Build 64 failed-smoke repair record](docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md)
- [Phase 7-C guided actions contract](docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [Studio Focus product/UX contract](docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [Studio Focus program closeout REAL USER PASS](docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)
- [Build 62 closeout corrective](docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Current concise changelog](CHANGELOG.md)
- [Detailed changelog archive](changelogs/README.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Runtime changes are accepted only after exact-head validation, exact deployment verification and real-user browser smoke. Historical candidates never receive retroactive acceptance.
