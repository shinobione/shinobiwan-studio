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

## Current state

```text
Accepted Studio        v0.19.4 · Build82 · REAL USER PASS
Deployed candidate     v0.19.5 · Build83 · smoke pending
Build83 codename       studio-focus-slice4-phase9-lyrics-save-response-loss-truth
Build83 merge          b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Build83 Pages          31856698097 · SUCCESS
Track Manager          v5.23 · DEPLOYED
Studio bridge          v1.13
TM admin Worker        439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker          v2.7 · unchanged
LaunchPAD public       2026.08.12.102 · REAL USER PASS
SonicTrace             V2-E Build08 · REAL USER PASS
Deep Audio             2.0.3-alpha
LRC Maker              6.3.8
```

**Build82 remains the current accepted runtime. Build83 is deployed but not yet accepted.** Build83 extends Phase9 reliability to canonical Lyrics save response-loss truth: a lost response is never blindly retried, and private canonical reread classifies the write as committed, not committed, ambiguous or unverified.

The repository currently publishes **no formal GitHub Release objects and no Git tags**. Runtime release identity is carried by code, docs and Pages.

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
Phase 9 Slice2      Build83 · DEPLOYED CANDIDATE · smoke pending
Phase 10            FUTURE
```

The immediate next action is **Build83 real-user browser smoke**, not another runtime build. After explicit PASS, run a fresh Phase9 audit before allocating any successor.

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

Build83 adds this bounded failure contract:

```text
save response lost
→ private canonical reread
   ├─ exact new revision + ETag + requested text → COMMITTED / VERIFIED
   ├─ unchanged revision + ETag                  → NOT COMMITTED / retry may be safe
   ├─ changed but exact postcondition unproven   → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                         → UNVERIFIED / DO NOT RETRY
```

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

## Build83 candidate receipts

```text
Runtime PR              #129
Exact tested head       beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Validation              31856653579 · SUCCESS
Runtime merge           b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages           31856698097 · SUCCESS
Real-user smoke         PENDING
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
```

Detailed record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

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
