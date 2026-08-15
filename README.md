# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current accepted state

```text
Studio                v0.19.3 · Build81 · REAL USER PASS
Codename              studio-focus-slice4-phase8-semantic-truth-cleanup
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.3 · Build81 is the current accepted runtime.** Build81 closes the Phase8 semantic-truth cleanup: SonicTrace is labelled `Sonic` in the Track production flow, and Release Campaign no longer exposes a fake mutable provider selector when prompts are provider-agnostic.

This repository currently publishes **no formal GitHub Release objects and no Git tags**. `v0.19.3 · Build81` is the project/runtime release identity carried by code, docs and Pages.

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

A production-ready Track may remain Draft. A Published Track may still expose production-health gaps. Publication is a guarded decision, not readiness scoring.

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and Phase8 health surfaces reuse the same `workflow.nextAction` authority. Studio does not introduce a second queue, priority engine or generic writer.

## Phase 8 accepted lineage

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health Drill-down                            REAL USER PASS
Build76  Album Health truth                           candidate
Build77  Album Health visual polish                   candidate
Build78  humanized Track-side Album mismatch UX      candidate
Build79  Album publication truth                      candidate
Build80  cumulative Album Health/publication fix     REAL USER PASS
Build81  semantic truth cleanup                       REAL USER PASS
```

Historical candidates remain historical evidence and are not retroactively relabelled RUP.

### Build81 accepted behavior

- Track production stage says **`Sonic`**, not `Sound`.
- Full SonicTrace view says **`TRACK / SONIC`**.
- Release Campaign is visibly **`PROVIDER-AGNOSTIC`**.
- Google Flow remains a convenience shortcut only.
- MASTER / 1:1 / 9:16 / motion prompts remain provider-agnostic.
- old browser-local Release Campaign drafts still restore prompts/assets/copy.
- campaign export remains review-only with `canonicalWrite: false`.
- no Track Manager, Worker or R2 mutation was required for Build81.

Exact Build81 acceptance record: [`changelogs/CHANGELOG-PHASE8-BUILD81.md`](changelogs/CHANGELOG-PHASE8-BUILD81.md).

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener UX.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- public fallback is read-only and never verifies canonical writes.

## Canonical contracts

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is the sole membership/artistic-order authority. Track-side Album metadata is compatibility cache only.

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

`lyrics.txt` is the unique canonical source. Recognized timestamps define synchronization. `.lrc` is optional export/compatibility only.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio, never a free-form metadata field. Duration evidence is accepted only through explicitly compatible guarded Track Manager bridge pairs.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in analysis sidecars.

### Release Campaign

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

9:16 is never derived from 1:1. Campaign drafts remain browser-local and ZIP export remains review-only.

## What comes next

The remaining focused product backlog starts with a **fresh reproduction/audit of the asset-selection error previously observed on `Magnetic Midnight`**. Do not assume its cause or fix before reproduction.

Premium interaction polish remains a rolling backlog: tactile press/release feedback, restrained glow/focus, coherent hover/active states and smooth reduced-motion-safe transitions.

Later roadmap:

- **Phase 9 — Security / reliability / PWA**: Access/CORS hardening, retries/timeouts, ambiguous-write handling, degraded/offline UX, PWA resilience.
- **Phase 10 — Progressive extraction**: potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.
- there is currently **no official Phase 11**.

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Next-session handoff](docs/NEXT-SESSION-HANDOFF.md)
- [Build81 REAL USER PASS](changelogs/CHANGELOG-PHASE8-BUILD81.md)
- [Current concise changelog](CHANGELOG.md)
- [Documentation map](docs/README.md)
- [Detailed changelog archive](changelogs/README.md)
- [Phase 7-C guided actions contract](docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)

## Acceptance policy

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

A runtime is accepted only after exact-head CI, anti-drift verification, exact merge-SHA Pages deployment and explicit real-user browser validation.
