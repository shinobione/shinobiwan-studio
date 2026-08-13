# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current state

```text
Studio accepted   v0.19.3 · Build 68    Home lead priority fix · REAL USER PASS
Studio candidate  v0.20.0 · Build 69    Phase 7-C Slice 1 guided metadata · PR #99 · CI REQUIRED
LaunchPAD          2026.08.12.102        C3-C · REAL USER PASS
Track Manager      v5.21                 repair scope · REAL USER PASS
Studio bridge      v1.11
Public Worker      v2.7                  unchanged
SonicTrace         V2-E Build 08         REAL USER PASS
Deep Audio         2.0.3-alpha
LRC Maker          6.3.8
```

Build 68 remains the **current accepted Studio baseline** until Build 69 completes exact-head CI, exact deployment and real-user browser smoke.

Build 69 is the authorized **Phase 7-C Runtime Slice 1 implementation candidate**. It guides Identity/Metadata Next Actions into the existing protected metadata validate/save flow, rejects public fallback as post-save verification, and recomputes the workflow from reread canonical Track state. The implementation audit found no need for a new Worker route or Track Manager bump.

Build 67 remains the accepted Foundation Regression Repair closeout underneath Build 68. Build 64 is preserved as **deployed candidate / FAILED REAL USER SMOKE** evidence; Builds 65 and 66 are corrective lineage superseded by Build 67.

## Release terminology

`Studio v0.19.3 · Build 68` is the current accepted **project/runtime release identity**.

`Studio v0.20.0 · Build 69` is an **implementation candidate**, not yet a deployed or accepted release.

This repository currently publishes **no GitHub Release objects and no Git tags**. Formal GitHub Releases/tags would be a separate distribution/versioning decision.

Accepted/candidate Studio lineage:

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
Home lead priority corrective     Build 68   REAL USER PASS
Phase 7-C Runtime Slice 1         Build 69   IMPLEMENTATION CANDIDATE · PR #99
```

Build 62 remains the accepted Studio Focus program closeout. Historical Build 63 remains superseded and is not reused.

**Phase 7-C Runtime Slice 1 is now implemented as a candidate on PR #99; Build 68 remains accepted until the full Build 69 acceptance chain completes.**

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

Workflow remains under Advanced. Home owns daily continuation, counters and the abbreviated attention queue; Workflow owns the full detailed searchable/filterable production queue.

Home lead rule after Build 68:

```text
last opened track
  └─ unfinished? → use as lead
       otherwise ↓
first unfinished workflow item
  └─ none? → PRODUCTION QUEUE CLEAR
```

A production-complete track must not be promoted as the Home lead only because it was visited most recently.

Build 69 preserves that rule and makes an Identity/Metadata Next Action land directly in the guided Metadata context rather than collapsing it back to Track overview.

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

## Phase 7-C Runtime Slice 1 — candidate

```text
Home / Tracks / Workflow Next Action
→ guided Track Metadata / Identity context
→ edit
→ Validate metadata
→ review normalized proposal
→ explicit human confirmation
→ existing protected metadata-save-v1
→ backend verification + Studio private canonical reread
→ VERIFIED only on exact private reread
→ recompute Workflow / Next Action from reread state
```

The existing Track Manager v5.21 / bridge v1.11 metadata capability is sufficient. Build 69 adds **no generic Studio/R2 writer, no new Worker route, no auto-save, no auto-publish and no Album mutation**. Public fallback stays read-only and cannot verify a write.

Candidate evidence:

```text
Accepted baseline      v0.19.3 · Build 68 · REAL USER PASS
Safety checkpoint      safety/pre-phase7c-slice1-build69-20260814-0013
Feature branch         agent/phase7c-runtime-slice1
PR                     #99 · DRAFT
Initial CI             31749799202 · FAILED historical successor whitelist
Final exact-head CI    REQUIRED before merge
Runtime merge          PENDING
Pages deployment       PENDING
Real-user smoke        PENDING
```

Detailed candidate record: [`changelogs/CHANGELOG-PHASE7-C-BUILD69.md`](changelogs/CHANGELOG-PHASE7-C-BUILD69.md).

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

## Accepted Foundation Repair evidence

```text
Studio tested PR head  6c1d801b14ae8daedfb246da539a42125f7c80d9
Studio validation run  31738652169    SUCCESS
Studio accepted main   5f061a460f17e27b9c2f06fdcbdda2f34e07e240
Studio Pages run       31738982707    SUCCESS
Track Manager          v5.21
Studio bridge          v1.11
LaunchPAD code main    813eb845b563b9a176c23f490d7fc044d4a0abc3
TM Worker run          31728992790    SUCCESS · admin only
TM Worker Version ID   0e1b9a3f-eabd-432e-8872-24ff0a9c085f
Public Worker          v2.7           unchanged
```

Final accepted Build 67 browser verdict: **REAL USER PASS**.

Accepted repair rollback/checkpoint:

```text
safety/post-build67-lyrics-source-anchor-20260813-2205
```

## Build 68 accepted evidence

```text
Feature branch        agent/build68-home-lead-priority
Safety before change  safety/pre-build68-home-lead-priority-20260813-2228
Tested PR head        cf5131f489d72ca5fae72544dacd9eaecc78077f
Validation run        31741483430 · SUCCESS
PR                    #96 · merged
Runtime merge         5c0428e500b4e6d5c9d1069bb440eac78b79955e
Pages deploy run      31743413418 · SUCCESS
Real-user smoke       PASS · 2026-08-14
Post-pass checkpoint  safety/post-build68-home-real-user-pass-20260814-0005
```

Build 68 changes Studio presentation/orchestration only. It does not add a Worker route, mutate R2, change Track Manager authority or redeploy the public Worker.

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Next-session handoff](docs/NEXT-SESSION-HANDOFF.md)
- [Phase 7-C Build 69 candidate](changelogs/CHANGELOG-PHASE7-C-BUILD69.md)
- [Build 68 Home lead REAL USER PASS record](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md)
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
