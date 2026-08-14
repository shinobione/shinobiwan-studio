# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current state

```text
Studio accepted    v0.19.3 · Build 74    Phase 8 Slice 1 · REAL USER PASS
LaunchPAD           2026.08.12.102        C3-C · REAL USER PASS
Track Manager       v5.22                 canonical duration evidence corrective · DEPLOYED
Studio bridge       v1.12
TM admin Worker     df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker       v2.7                  unchanged
SonicTrace          V2-E Build 08         REAL USER PASS
Deep Audio          2.0.3-alpha
LRC Maker           6.3.8
```

**Studio v0.19.3 · Build 74 is the current accepted runtime.** Phase 7-C remains program-complete on the accepted Build73 lineage, and Build74 is now the first accepted Phase8 runtime slice: **Content Health Truth**.

Phase 7-C runtime lineage:

```text
Build 69  guided Metadata / Identity Next Action flow · candidate
Build 70  readiness/publication + Album/New Track corrective · candidate
Build 71  canonical audio-duration evidence corrective · REAL USER PASS / Slice1 closeout
Build 72  guided Core Media routing / stage ownership · deployed candidate
Build 73  status-truth corrective · REAL USER PASS / Slice2 + Phase7-C program baseline
```

Phase 8 runtime lineage:

```text
Build 74  Content Health Truth · REAL USER PASS / Slice1 closeout
```

Historical candidates remain historical evidence; they are not retroactively relabeled as accepted.

## Release terminology

`Studio v0.19.3 · Build 74` is the current accepted **project/runtime release identity**.

This repository currently publishes **no GitHub Release objects and no Git tags**. Formal GitHub Releases/tags remain a separate distribution/versioning decision.

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

Workflow remains under Advanced. Home owns daily continuation, production/publication counters, the abbreviated attention queue and the Phase8 read-only Content Health surface; Workflow owns the full detailed searchable/filterable production queue.

Home lead rule:

```text
last opened track
  └─ unfinished? → use as lead
       otherwise ↓
first unfinished workflow item
  └─ none? → PRODUCTION QUEUE CLEAR
```

A production-complete track is never promoted as Home lead merely because it was visited most recently.

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace artist summary.
- **Visuals** — Cover / Thumbnail / Canvas; **Cover is the required production asset and Canvas is optional**.
- **Lyrics** — canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor. Lyrics are production-ready only when recognized timestamps exist.
- **Release** — final checklist + browser-local Release Campaign.
- **Details / Advanced** — full metadata, SonicTrace diagnostics and technical depth when deliberately requested.

Production and publication are separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Drafts
```

A Track can be published while still having production/catalog work to complete, and a Draft can be 100% production-ready. Publication is a separate guarded action, not part of readiness scoring.

## Phase 8 Slice 1 — Content Health Truth · accepted via Build74

Build74 repairs the remaining global-health mismatch left by the older Content Health model and exposes a compact read-only health layer on Home.

Accepted production-health score:

```text
Identity        20
Master audio    20
Cover           20
Lyrics TXT      10
Lyrics timing   10
SonicTrace      20
Canvas           0 · optional
```

Canvas no longer reduces readiness and creates no attention item.

Home preserves the accepted counters:

```text
NEEDS ATTENTION
PRODUCTION COMPLETE
PUBLISHED
DRAFTS
```

but production completion is now computed independently from the Release/publication stage. A production-ready Draft can therefore be both `PRODUCTION COMPLETE` and `DRAFT`, with `Publish track` as its next action.

The new read-only Content Health panel reports:

- missing master audio;
- missing required cover;
- missing canonical lyrics source;
- lyrics timing needed;
- SonicTrace missing/outdated;
- Release quality blockers;
- published Tracks with production gaps;
- production-ready Drafts.

Every actionable health signal reuses the affected Track's existing `workflow.nextAction`; Phase8 does **not** create a second priority model or a new write authority.

Exact Build74 acceptance evidence:

```text
Safety pre              safety/pre-phase8-content-health-build74-20260814-1810
Studio PR               #108
Exact tested head       da7b5498dd8e1f6120c346e07fe1b1e741d40104
Studio validation       31819203565 · SUCCESS
Studio runtime merge    c95e33bcb0c33b18fc8e6e9a35a05ec28ad142a9
Studio Pages run        31819333501 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build74-deployed-candidate-20260814-1827
Real-user smoke         BUILD74 PASS · 2026-08-14
Safety post-RUP         safety/post-build74-real-user-pass-20260814-1926
Track Manager           v5.22 · unchanged
Studio bridge           v1.12 · unchanged
Public Worker           v2.7 · unchanged
R2 migration            NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE8-BUILD74.md`](changelogs/CHANGELOG-PHASE8-BUILD74.md).

## Phase 7-C Runtime Slice 1 — accepted

```text
Home / Tracks / Workflow Next Action
→ guided Track Metadata / Identity context
→ edit
→ Validate metadata
→ review normalized proposal + exact quality blockers
→ explicit human confirmation
→ existing protected metadata save
→ backend verification + Studio private canonical reread
→ VERIFIED only on exact private reread
→ recompute Workflow / Next Action from reread state
```

Build71 acceptance evidence:

```text
Studio tested head      4298a07e13983786833240dd69a61a72dc09636e
Studio validation       31757665434 · SUCCESS
Studio PR               #101
Studio runtime merge    0b3c3d452076708c698de71d9c691b5e459f7c17
Studio Pages run        31789774785 · SUCCESS
Real-user smoke         BUILD71 PASS · 2026-08-14
Safety post-RUP         safety/post-build71-real-user-pass-20260814-1217
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

## Phase 7-C Runtime Slice 2 — accepted via Build73

Slice 2 makes **Core Media** the truthful executable stage after Identity while preserving the existing Track Manager asset authority.

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Guided Core Media:

```text
master audio missing
→ Fix Core media
→ Track / overview
→ Master audio uploader
→ protected asset-upload-v1
→ canonical reread
→ workflow recompute

master audio ready + cover missing
→ Continue Core media
→ Visuals / assets
→ Cover uploader
→ protected asset-upload-v1
→ canonical reread
→ workflow recompute

Audio + Cover ready
→ workflow advances to Lyrics
```

Build73 closed the real-user-smoke presentation mismatch found on Zero-SUM:

```text
Visuals ready = canonical cover present
Canvas        = optional
Lyrics ready  = canonical lyrics.txt + recognized timestamps
TXT only      = attention / Timing needed
```

Home, Track Workspace, Tracks and Workflow use the same production truth and the same Phase 7 Next Action authority.

Exact Slice 2 acceptance evidence:

```text
Build72 PR              #103
Build72 tested head     b79ce03a98fad46e6bf4c488e456af07bba951be
Build72 CI              31792368962 · SUCCESS
Build72 runtime merge   dceee27dd8f8cdc96f8f88f10c5588e283e56699
Build72 Pages           31792436456 · SUCCESS

Build73 PR              #105
Build73 tested head     b6dc39e7555aa040740de5efa54bd75b1e78101a
Build73 CI              31795481278 · SUCCESS
Build73 runtime merge   4684291f64d12bd514f103ba1c5050d05d0143ac
Build73 Pages           31795547072 · SUCCESS · exact merge SHA
Safety pre              safety/pre-build73-status-truth-corrective-20260814-1312
Safety post-deploy      safety/post-build73-deployed-candidate-20260814-1318
Safety post-RUP         safety/post-build73-real-user-pass-20260814-1715
Real-user smoke         BUILD73 PASS · 2026-08-14

Track Manager           v5.22 · unchanged
Studio bridge           v1.12 · unchanged
TM Worker Version ID    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker           v2.7 · unchanged
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](changelogs/CHANGELOG-PHASE7-C-BUILD73.md).

## Phase 7-C program closeout — audited complete

After Build73 REAL USER PASS, the remaining workflow stages were reread against real GitHub code before allocating Build74.

The audit found no legitimate runtime Slice3 gap:

- **Lyrics** already follows Next Action → protected LRC Maker context → validate with manifest revision + lyrics ETag → explicit protected save → LRC Maker canonical reread → `lyrics-saved` receipt → Studio private Track reread → workflow recompute.
- **Intelligence** already follows Next Action → canonical sourceVersion → temporary analysis → REVIEW / NOT SAVED → explicit save → Track Manager `STALE_AUDIO` guard → verified latest/history sidecars → `analysis-saved` receipt → Studio private Track reread → workflow recompute.
- **Release** already uses the guarded Slice1 metadata/publication flow; Release Campaign remains deliberately browser-local and review-only.

Therefore Phase 7-C is **PROGRAM COMPLETE on Build73**. Build74 subsequently opened Phase8 and is now accepted without changing those Phase7 contracts.

Detailed evidence: [`docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md).

## Toolchain roles

- **GitHub** — application code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical track/album write authority.
- **Studio** — private cockpit and orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener experience.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` is the same R2 track slug across the toolchain.

Public fallback remains read-only and never replaces private state or verifies writes.

## Canonical contracts — quick reference

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

Recognized timestamps inside `lyrics.txt` define synchronization. `.lrc` is optional compatibility/export only.

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` owns membership and artistic order. Track-side Album data remains compatibility cache only.

### Audio duration

```text
manifest.duration = derived canonical fact from the current master audio
```

Duration is not free-form metadata. TM v5.22 may persist bounded browser-measured evidence only through guarded operations when canonical audio exists.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in sidecars.

## Native Release Campaign

```text
Canonical Track context
        ↓
MASTER FINAL 16:9
        ├── 1:1 derived independently from MASTER
        └── 9:16 derived independently from MASTER
```

9:16 is never derived from 1:1. Campaign drafts remain browser-local and ZIP export remains review-only.

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Next-session handoff](docs/NEXT-SESSION-HANDOFF.md)
- [Build 74 REAL USER PASS](changelogs/CHANGELOG-PHASE8-BUILD74.md)
- [Phase 8 scope audit](docs/PHASE-8-SCOPE-AUDIT.md)
- [Phase 7-C program closeout audit](docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md)
- [Build 73 REAL USER PASS](changelogs/CHANGELOG-PHASE7-C-BUILD73.md)
- [Build 71 REAL USER PASS](changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- [Phase 7-C guided actions contract](docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Current concise changelog](CHANGELOG.md)
- [Detailed changelog archive](changelogs/README.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Build74 completed the full acceptance chain and is the current accepted Studio runtime. Phase8 Slice1 is closed. Any next runtime work must begin from this accepted baseline with a fresh bounded scope, safety checkpoint, exact-head CI, exact deployment verification and a new real-user smoke gate.