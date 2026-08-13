# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current accepted baseline

```text
Studio          v0.19.2 · Build 62    Studio Focus program closeout · REAL USER PASS
LaunchPAD       2026.08.12.102        C3-C · REAL USER PASS
Track Manager   v5.20
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 08         REAL USER PASS
Deep Audio      2.0.3-alpha
LRC Maker       6.3.8
```

Build 62 remains the accepted Studio runtime until the current corrective receives a new real-user browser pass. Final Build 62 smoke validated palette extraction/save on `Magnetic Midnight`, stable palette layout, `Sonic` wording and artist-facing `Album track` presentation. The paired Track Manager v5.20 correction removed the false legacy `STALE_MANIFEST` condition while keeping revision protection intact.

### Current candidate

```text
Studio          v0.19.3 · Build 64    Foundation Regression Repair · REAL USER PASS PENDING
Track Manager   v5.21                 candidate · admin Worker only
Studio bridge   v1.11                 unchanged
Public Worker   v2.7                  unchanged
Phase 7-C       contract locked       runtime Slice 1 PAUSED during repair validation
```

Build 64 was triggered by a real Studio smoke that exposed three foundation regressions: private/draft Album artwork could write successfully but remain invisible in Studio; track-side Album cache could diverge from authoritative `album.trackIds`; and a missing `lyrics.txt` had no visible upload path in the focused Lyrics UX. See [Build 64 Foundation Regression Repair](docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md).

## Release terminology

`Studio v0.19.2 · Build 62` is the current accepted **project/runtime release identity**. `v0.19.3 · Build 64` is a candidate only until exact deployment + real-user smoke.

This repository currently publishes **no GitHub Release objects and no Git tags**. Formal GitHub Releases/tags would be a separate distribution/versioning decision.

Accepted Studio lineage:

```text
Phase 7-A             Build 46   REAL USER PASS
Phase 7-B             Build 51   REAL USER PASS
Studio Focus Slice 1  Build 53   REAL USER PASS
Studio Focus Slice 2  Build 56   REAL USER PASS
Studio Focus Slice 3  Build 58   REAL USER PASS
Studio Focus Slice 4  Build 61   REAL USER PASS
Studio Focus closeout Build 62   REAL USER PASS
```

Build 62 is a closeout corrective, not a fifth Studio Focus slice. Historical Build 63 remains superseded and is not reused.

**Phase 7-C is STARTED at contract level after explicit authorization; runtime Slice 1 is PAUSED until Build 64 / Track Manager v5.21 foundation repair is real-user validated.**

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
- **Lyrics** — embedded LRC Maker; `lyrics.txt` is the canonical lyrics source.
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

Build 62 removes the misleading Premium provider selector because provider selection never changed MASTER or derivative prompt generation. Prompts remain provider-agnostic and Google Flow stays available as a direct convenience handoff.

## Final accepted closeout evidence

```text
Studio tested runtime b464c0930a5659b208b3a059d443f708b8e55dba
Studio Pages run      31713370595    SUCCESS
Track Manager         v5.20
Studio bridge         v1.11
TM Worker run         31714222431    SUCCESS · admin only
TM Worker Version ID  78609aff-1f4a-4a21-b618-cb97add0c416
Public Worker         v2.7            unchanged
```

Final accepted Build 62 browser verdict: **SMOKE2 PASSED**.

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Build 64 Foundation Regression Repair candidate](docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md)
- [Studio Focus product/UX contract](docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [Studio Focus program closeout REAL USER PASS](docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)
- [Build 62 closeout corrective](docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Current concise changelog](CHANGELOG.md)
- [Detailed changelog archive](changelogs/README.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Runtime changes are accepted only after exact-head validation, exact deployment verification and real-user browser smoke. Historical candidates never receive retroactive acceptance.
