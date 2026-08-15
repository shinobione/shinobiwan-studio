# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, do **not** reconstruct state from old chat transcripts or the full historical docs tree.

Read:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify the real GitHub state before mutation.

## Current accepted state

```text
Studio                v0.19.4 · Build82 · REAL USER PASS
Codename              studio-focus-slice4-phase9-destructive-write-ambiguity-guard
Runtime merge         7a0d52fcc0bf862478c459f0648afc1c6690b34f
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.4 · Build82 is the current accepted runtime.** Build82 opens Phase9 with bounded destructive-write ambiguity handling for Track and Album asset deletion. Lost responses are never blindly retried; private canonical reread classifies the outcome and normal success also requires canonical postcondition verification.

The repository currently publishes **no formal GitHub Release objects and no Git tags**. The runtime release identity is carried by code, docs and Pages.

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

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same `workflow.nextAction` authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1      Build82 · REAL USER PASS
Build83             UNUSED
Phase 10            FUTURE
```

The next action is **not** a preselected Build83. Run a fresh bounded Phase9 reliability audit first. Current candidates are canonical Lyrics save response-loss truth, SonicTrace analysis save response-loss truth and broader guarded Album-write ambiguity.

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

Ordered `album.trackIds` is the sole membership/artistic-order authority. Track-side Album metadata is compatibility/cache data only.

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

`lyrics.txt` is the unique canonical source. Recognized timestamps define synchronization. `.lrc` is optional export/compatibility only.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio, never a free-form metadata field.

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

Release Campaign is provider-agnostic. Google Flow is a convenience shortcut. Campaign drafts remain browser-local and ZIP export remains review-only.

## Build82 acceptance

```text
Runtime PR              #126
Exact tested head       07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Validation              31854468795 · SUCCESS
Runtime merge           7a0d52fcc0bf862478c459f0648afc1c6690b34f
Runtime Pages           31854528438 · SUCCESS
Candidate docs PR       #127
Candidate docs merge    077ef8bb19920c439971325604a2d30e015e41c1
Real-user smoke         BUILD82 PASS · 2026-08-15
Worker deploy           NONE
R2 migration/write      NONE
```

Detailed record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

## Documentation

### Canonical current truth

- [Agent startup contract](AGENTS.md)
- [Project state](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Decisions](DECISIONS.md)
- [QA / acceptance](QA.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Concise changelog](CHANGELOG.md)

### Historical evidence

- [Documentation map](docs/README.md)
- [Detailed changelog archive](changelogs/README.md)

Old `docs/ROADMAP-CURRENT.md` and `docs/NEXT-SESSION-HANDOFF.md` paths are retained as compatibility pointers only.

## Acceptance policy

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

A runtime is accepted only after exact-head CI, exact merge-SHA deployment and explicit real-user validation where required. Merge, Pages deployment, Worker deployment and R2 mutation remain separate states.
