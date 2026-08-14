# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current state

```text
Studio accepted    v0.19.3 · Build 71    Phase 7-C Slice 1 corrective chain · REAL USER PASS
LaunchPAD           2026.08.12.102        C3-C · REAL USER PASS
Track Manager       v5.22                 canonical duration evidence corrective · DEPLOYED
Studio bridge       v1.12
TM admin Worker     df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker       v2.7                  unchanged
SonicTrace          V2-E Build 08         REAL USER PASS
Deep Audio          2.0.3-alpha
LRC Maker           6.3.8
```

**Studio v0.19.3 · Build 71 is the current accepted runtime.** The real-user acceptance chain is complete.

Build71 contains the cumulative Phase 7-C Runtime Slice 1 behavior introduced through Builds 69→71:

```text
Build 69  guided Metadata / Identity Next Action flow
Build 70  readiness/publication separation + Album semantics + New Track corrective
Build 71  canonical audio-duration evidence corrective · REAL USER PASS
```

Historical candidates remain historical evidence; they are not retroactively relabeled as accepted.

## Release terminology

`Studio v0.19.3 · Build 71` is the current accepted **project/runtime release identity**.

This repository currently publishes **no GitHub Release objects and no Git tags**. Formal GitHub Releases/tags remain a separate distribution/versioning decision.

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
Phase 7-C Runtime Slice 1         Build 69   merged/deployed candidate · superseded by Build70/71
Phase 7-C pre-smoke corrective    Build 70   merged/deployed candidate · superseded by Build71
Phase 7-C duration corrective     Build 71   REAL USER PASS
```

Build 63 remains historical/superseded and must not be reused.

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
- **Visuals** — Cover / Thumbnail / Canvas; Canvas preview is 9:16.
- **Lyrics** — canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor.
- **Release** — final checklist + browser-local Release Campaign.
- **Details / Advanced** — full metadata, SonicTrace diagnostics and technical depth when deliberately requested.

Production and publication are separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Drafts
```

A Track can be **100% production ready while still Draft**. Publication is a separate guarded action, not part of the readiness score.

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

Build70/71 corrective semantics:

- canonical Album membership (`album.trackIds`) drives Album-track presentation;
- generic metadata does not independently mutate Album membership;
- exact quality errors/warnings are surfaced to the user;
- New Track no longer sends Track-side Album cache through generic create metadata;
- `Create draft` and guarded `Create & Publish` are supported;
- audio duration is a **derived canonical fact**, never a manual editable field;
- Studio can measure protected canonical audio duration in-browser and submit it as bounded evidence to TM v5.22;
- future audio uploads carry the same duration evidence through the existing guarded multipart upload path;
- public fallback remains read-only and cannot verify writes.

## Build 71 acceptance evidence

```text
Studio tested head      4298a07e13983786833240dd69a61a72dc09636e
Studio validation       31757665434 · SUCCESS
Studio PR               #101 · merged exact tested head
Studio runtime merge    0b3c3d452076708c698de71d9c691b5e459f7c17
Studio Pages run        31789774785 · SUCCESS · exact merge SHA
Safety before change    safety/pre-build71-duration-evidence-fix-20260814-0216
Post-deploy checkpoint  safety/post-build71-deployed-candidate-20260814-1152
Real-user smoke         BUILD71 PASS · 2026-08-14

Track Manager           v5.22
Studio bridge           v1.12
Backend tested head     888d29e9b7064346311ed3c959669a327505204d
Backend merge           be7d970f6577e0e54eade04a5ef764a733baed42
Backend Cloudflare CI   31757006174 · SUCCESS
Backend LaunchPAD CI    31757006198 · SUCCESS
Backend Overflow CI     31757006309 · SUCCESS
Admin deploy run        31789368122 · SUCCESS · target=admin
TM Worker Version ID    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker           v2.7 · deployment steps skipped
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

## Toolchain roles

- **GitHub** — application code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical track/album write authority.
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

Ordered `album.trackIds` owns membership and artistic order. The Track-side Album field is compatibility cache only and must not be edited independently of guarded Album operations.

Audio duration:

```text
manifest.duration = derived canonical fact from the current master audio
```

Duration is not a free-form user metadata field. TM v5.22 may persist bounded browser-measured evidence only when a canonical audio asset exists and the guarded revision contract is satisfied.

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

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Next-session handoff](docs/NEXT-SESSION-HANDOFF.md)
- [Build 71 REAL USER PASS](changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- [Phase 7-C guided actions contract](docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [Build 68 Home lead record](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md)
- [Foundation Regression Repair closeout](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- [Studio Focus product/UX contract](docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Current concise changelog](CHANGELOG.md)
- [Detailed changelog archive](changelogs/README.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Runtime changes are accepted only after exact-head validation, exact deployment verification and real-user browser smoke. Build71 has completed that full chain.
