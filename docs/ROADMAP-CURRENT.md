# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-13 for **Studio v0.18.1 · Build 58 — Studio Focus Slice 3 smoke corrective CANDIDATE**.

Build 56 remains the accepted Studio Focus Slice 2 baseline. Build 57 introduced the `Track · Visuals · Lyrics · Release` Track Workshop regrouping but did **not** receive REAL USER PASS after deployed smoke exposed public-fallback ambiguity, a wrong 16:9 Canvas preview, and unclear Lyrics Studio availability. Build 58 corrects those points without changing canonical ownership.

Historical release detail remains in milestone docs and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — frozen rollback/reference implementation; no longer the intended primary Release Campaign UX.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.
- Canonical `trackId` is the R2 track slug everywhere.

**Phase 7 means orchestration, not centralization. Public fallback is never a second source of truth.**

## Accepted product phases

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC ✅ REAL USER VALIDATED
- Phase 7-A — Workflow Overview ✅ REAL USER PASS · Build 46
- Phase 7-B — Contextual continuation receipts ✅ REAL USER PASS · Build 51

## PHASE UX

Status: **COMPLETE — REAL USER VALIDATED**

Accepted milestones remain:

- C2.5-A → F ✅
- C3-A Deep Audio ✅ real-user pass
- C3-B Studio V2-E parity ✅ real-user pass
- C3-C LaunchPAD Build 102 ✅ real-user pass
- Track-To-Market Bridge V2 / Studio Build 45 ✅ real-user pass for transport/finality/no-write contract

Final closeout: `docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`.

## Native Release Campaign — accepted architecture

Core campaign contract:

```text
Canonical Track context
        ↓
Premium MASTER handoff
        ↓
MASTER FINAL 16:9 selected/imported
        ├── 1:1 generated independently from MASTER 16:9
        └── 9:16 generated independently from MASTER 16:9
```

**9:16 is never derived from 1:1.** Both derivatives are siblings anchored to the accepted MASTER to avoid cumulative drift.

### Build 47

Historical TTM V3 staged-preview proof. Valuable for FINAL/provenance transport and safety gates, but standalone orchestration is not the primary product boundary.

### Build 48

Native Release Campaign workspace:

- canonical Track context;
- premium MASTER 16:9 provider handoff/import;
- optional SHINOBIWAN logo reference;
- anchored 1:1 + 9:16 handoffs;
- independent import/replace;
- three-format review;
- browser-local IndexedDB persistence;
- release copy/tags/provenance;
- non-canonical ZIP export;
- no external TTM popup in the primary path;
- no R2/Track Manager write.

### Build 49

MASTER concept reroll corrective:

- `New MASTER concept`;
- deliberately distinct concept families;
- canonical Track context retained;
- accepted MASTER/1:1/9:16 preserved during exploration;
- only a new MASTER import invalidates derivative slots;
- persisted `masterConceptIndex`;
- direct `Open Google Flow ↗` shortcut;
- no canonical write path.

### Release Campaign authority

Successful export remains:

```text
release-campaign / campaign-exported / review-only
```

Manifest remains `canonicalWrite: false`. A visual FINAL is never silently promoted into R2/Track Manager state.

## Phase 7-B — contextual continuation receipts

Accepted Build 50/51 contract:

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Rules:

- exact canonical `trackId` required;
- allowlisted source/operation/effect required;
- canonical writes enter verification instead of optimistic success;
- Studio rereads through the existing Track catalog read layer;
- returned `trackId` must match;
- reread must be PRIVATE for VERIFIED;
- public fallback can never verify a write;
- Lyrics requires canonical `lyrics.txt` evidence;
- SonicTrace requires persisted Audio Intelligence evidence;
- stale async rereads cannot overwrite newer context;
- Release Campaign remains review-only;
- no generic write endpoint or second R2 owner.

Build 51 fixed the embedded LRC Maker receipt delivery seam by listening for the bubbling/composed `lyrics-saved` event at `window` scope while keeping exact-track filtering and private reread verification.

Final closeout: `docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md`.

## Studio Focus — production-first UX

Status: **IMPLEMENTATION IN PROGRESS**

Goal: normal Studio use should expose artist tasks first while validated technical machinery remains available under Details/Advanced.

### Slice 1 — shell + Home

**Build 53 — COMPLETE · REAL USER PASS**

- Home / Tracks / Albums daily navigation;
- Workflow / Intelligence / System under Advanced;
- actionable continuation and unfinished queue;
- existing Phase 7-A workflow model remains the readiness source;
- no authority change.

Acceptance checkpoint:

`safety/post-studio-focus-build53-real-user-pass-20260813-0032`

### Slice 2 — Tracks production library

#### Build 54

Functional base: `To finish / Ready / Released / All`, visual cards, continuation from existing workflow model.

#### Build 55

Desktop density/readability corrective. Superseded at smoke because fixed production-state columns truncated labels.

#### Build 56

**COMPLETE · REAL USER PASS**

- denser five-card desktop library;
- readable artist-facing copy;
- full wrapping `Audio / Cover / Lyrics / Canvas / Release` chips;
- no workflow/route/authority change.

Acceptance checkpoint:

`safety/post-studio-focus-build56-real-user-pass-20260813-0143`

### Slice 3 — Track Workshop

Target mental model:

```text
Track · Visuals · Lyrics · Release
```

#### Build 57 — deployed smoke evidence, NOT accepted

Build 57 introduced:

- **Track** — identity, release facts, canonical audio, production summary, audio-only asset management, progressive metadata/SonicTrace details;
- **Visuals** — canonical Cover / Thumbnail / Canvas management + previews;
- **Lyrics** — existing embedded LRC Maker / canonical `lyrics.txt` workflow;
- **Release** — final Audio / Cover / Lyrics / Canvas / Metadata checklist + existing native Release Campaign;
- old route tokens preserved for deep links;
- `AssetsManager` task-scoped presentation only; same Track Manager mutation APIs.

Deployed real-user smoke found:

1. Studio was in `LaunchPAD public catalog` fallback; the two private `To finish` tracks were hidden, but the UI misleadingly showed `0 To finish / 31 Released / 31 All`, creating the appearance of data loss;
2. canonical Canvas preview was explicitly 16:9 instead of LaunchPAD-compatible 9:16;
3. `EmbeddedLyricsStudio` remained intact but was correctly gated by PRIVATE READ; public fallback silently substituted raw text, making the engine appear removed;
4. SonicTrace correctly returned `Private analysis is locked` in public fallback, but the preceding Track action looked like a guaranteed full-analysis path.

Build 57 therefore remains historical deployed candidate evidence and does **not** receive REAL USER PASS.

Candidate checkpoint:

`safety/studio-focus-build57-candidate-20260813`

#### Build 58 — Slice 3 smoke corrective

Release: **Studio v0.18.1 · Build 58**

Status: **CANDIDATE — first full CI GREEN; final exact-head CI + Pages + deployed smoke required**

Correctives:

- public fallback explicitly states that private Draft / To finish / Ready tracks are **hidden, not deleted**;
- private-only `To finish` / `Ready` counts show `—` instead of false zero;
- fallback automatically presents the public Released projection rather than an empty To finish view;
- `Open Track Manager ↗` + `Retry private read` recovery actions added;
- when PRIVATE READ returns, Tracks returns to the `To finish` filter;
- Track Workspace exposes a persistent `PUBLIC READ-ONLY FALLBACK` notice;
- public Track action no longer promises full SonicTrace while private analysis is locked;
- Lyrics public fallback explicitly displays `LYRICS STUDIO LOCKED` while preserving the embedded engine/private-read gate;
- public lyrics text becomes secondary preview only;
- canonical Canvas preview corrected to **9:16**, `object-fit: contain`, no crop;
- Release Campaign MASTER 16:9 / 1:1 / 9:16 pack contract is unchanged.

Pre-corrective checkpoint:

`safety/pre-build58-slice3-smoke-corrective-20260813-0226`

PR: `#77`.

Dedicated changelog: `CHANGELOG-STUDIO-FOCUS-BUILD58.md`.

### Slice 4 — compact SonicTrace artist summary

Status: **PLANNED / NOT STARTED**

Direction:

- compact artist-facing conclusions on Track;
- full diagnostic/intelligence depth behind Details/Advanced;
- preserve FULL/PARTIAL/UNAVAILABLE truthfulness and R2 sidecar contract;
- no embedding vectors/engine internals in routine workflow.

Do not start until Slice 3 receives real-user acceptance.

## Phase 7-C — Guided end-to-end actions

Status: **PLANNED / NOT STARTED / EXPLICITLY CLOSED**

Studio Focus does not authorize Phase 7-C. Start only after fresh explicit authorization.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

- Album ID = immutable storage identity;
- ordered `album.trackIds` = authoritative membership/artistic order;
- track `album.id/title` = compatibility cache;
- `catalog/index.json` = rebuildable projection;
- Singles = virtual collection.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

`.lrc` never becomes a second source of truth.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in analysis sidecars.

## Track Manager / protected-write rules

- Track Manager remains protected canonical write authority;
- Studio uses operation-specific capabilities;
- missing capability blocks that operation;
- whole-track delete remains unavailable in Studio;
- public fallback never becomes write authority;
- canonical completion receipts require PRIVATE reread verification.

## Release Campaign follow-ups

Still recorded for later:

- optional motion variant: provider handoff for ~8s loop anchored to selected MASTER; fixed title/logo and clean loop seam;
- provider provenance: record selected provider/model rather than guessing from import;
- independent variant replacement;
- campaign completeness: 16:9 + 1:1 + 9:16 required, motion optional unless later required;
- future guarded persistence only through existing Track Manager operation-specific authority + canonical reread;
- local AI lab remains experimentation, not forced premium path.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Global actionable catalog health built on mature production-state models.

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX, PWA resilience.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Current baseline

```text
Accepted:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          0.15.1 / Build 45     TTM Bridge V2 REAL USER PASS
Studio          0.16.0 / Build 46     Phase 7-A REAL USER PASS
Studio          0.17.1 / Build 51     Phase 7-B REAL USER PASS
Studio          0.17.6 / Build 56     Studio Focus Slice 2 REAL USER PASS

Current candidate:
Studio          0.18.1 / Build 58     Studio Focus Slice 3 smoke corrective

Infrastructure:
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 08 accepted FULL profile lineage
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8

Historical Studio Focus:
Studio          0.18.0 / Build 57     Track Workshop deployed smoke evidence · NOT ACCEPTED
```

## Rollback / acceptance anchors

```text
safety/pre-build58-slice3-smoke-corrective-20260813-0226
safety/studio-focus-build57-candidate-20260813
safety/pre-build57-track-workshop-20260813-0143
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/studio-focus-build56-candidate-20260813-0119
safety/pre-build56-status-labels-20260813-0112
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/pre-phase7-b-build50-20260812-1826
safety/pre-build49-master-concept-reroll-20260812
safety/pre-build48-native-release-campaign-20260812-1707
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

## Verification policy

CI is necessary but never sufficient for real-user acceptance.

For Build 58 / Slice 3, deployed smoke must prove:

1. public fallback makes hidden private tracks obvious and never presents their unavailable counts as zero;
2. restoring Track Manager PRIVATE READ + retry returns the private production library without reconstructing/faking data;
3. canonical Canvas preview is 9:16;
4. public Lyrics state clearly says the engine is locked, not removed;
5. PRIVATE READ restores the embedded LRC Maker engine;
6. SonicTrace public/private access wording is truthful;
7. Track / Visuals / Lyrics / Release regrouping remains usable;
8. no canonical authority or receipt regression appears.

Do not mutate production media/Albums merely to manufacture a smoke. Do not start Slice 4 or Phase 7-C before explicit acceptance/authorization.
