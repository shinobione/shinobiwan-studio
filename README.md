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
Studio                v0.19.7 · Build85 · REAL USER PASS
Codename              studio-focus-slice4-phase9-album-metadata-response-loss-truth
Runtime merge         1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages         31863313848 · SUCCESS
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.7 · Build85 is the current accepted runtime.** Build85 extends Phase9 response-loss truth to canonical Album metadata save only. A lost metadata response is never blindly retried; Studio privately rereads the exact pre-write revision, requested metadata and stable non-metadata Album shape before classifying committed, not committed, ambiguous or unverified. The required normal-browser regression received explicit **`BUILD85 PASS`** on 2026-08-15.

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
Phase 9 Slice2      Build83 · REAL USER PASS
Phase 9 Slice3      Build84 · REAL USER PASS
Phase 9 Slice4      Build85 · REAL USER PASS
Build86             UNALLOCATED
Phase 10            FUTURE
```

The immediate next action is a **fresh bounded Phase9 reliability audit**, not another preselected runtime build. Remaining candidates include Album membership/move/upload/create response-loss truth, Access/CORS hardening, bounded read retries/timeouts, and degraded/offline/PWA resilience.

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

Build85 accepted failure contract for **metadata save only**:

```text
metadata save response lost
→ private canonical Album reread
   ├─ new revision + exact metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / retry may be safe
   ├─ revision changed but exact postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal metadata success also requires exact response revision + requested metadata + stable non-metadata shape. Build85 does **not** apply this contract to Album create, membership, move or upload.

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

`lyrics.txt` is the unique canonical source. Recognized timestamps define synchronization. `.lrc` is optional export/compatibility only.

Build83 accepted failure contract:

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

Build84 accepted failure contract:

```text
save response lost
→ private canonical reread of latest + history
   ├─ requested analysisId in both    → COMMITTED / VERIFIED
   ├─ requested analysisId in neither → NOT COMMITTED / retry may be safe
   ├─ requested analysisId in one     → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable              → UNVERIFIED / DO NOT RETRY
```

### Release Campaign

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

Release Campaign is provider-agnostic. Google Flow is a convenience shortcut. Campaign drafts remain browser-local and ZIP export remains review-only.

## Build85 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Validation              31863267911 · SUCCESS · first run
Runtime merge           1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages           31863313848 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #136
Candidate docs merge    40917edc6a341ca7d19907d8afe59123f44c8d03
Candidate docs Pages    31863566190 · SUCCESS
Safety post-deploy      safety/post-build85-deployed-candidate-20260815-0602
Safety post-acceptance  safety/post-build85-real-user-pass-20260815-0748
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD85 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

## Accepted predecessors

Build84 remains the accepted Phase9 Slice3 predecessor:

```text
Studio                  v0.19.6 · Build84 · REAL USER PASS
Runtime PR              #132
Validation              31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS
Real-user smoke         BUILD84 PASS · 2026-08-15
```

Build83 and Build82 remain accepted Phase9 predecessors. See `CHANGELOG.md` and detailed per-build records for historical receipts.

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
