# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current line

```text
Accepted product baselines:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          v0.16.0 · Build 46    Phase 7-A REAL USER PASS
Studio          v0.17.1 · Build 51    Phase 7-B REAL USER PASS
Studio          v0.17.3 · Build 53    Studio Focus Slice 1 · REAL USER PASS
Studio          v0.17.6 · Build 56    Studio Focus Slice 2 · REAL USER PASS
Studio          v0.18.1 · Build 58    Studio Focus Slice 3 · REAL USER PASS
SonicTrace      V2-E Build 08         FULL profile + R2 canonical reread · REAL USER PASS

Historical candidate:
Studio          v0.18.0 · Build 57    Track Workshop · deployed smoke evidence · NOT ACCEPTED

Protected stack:
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
Deep Audio      2.0.3-alpha
LRC Maker       6.3.8
```

**PHASE UX, Phase 7-A, Phase 7-B and Studio Focus Slices 1–3 are closed as REAL USER PASS. Studio Focus remains the active presentation/production-ergonomics program. Phase 7-C remains explicitly CLOSED / NOT STARTED.**

The accepted Slice 3 artist-facing Track Workspace model is:

```text
Track · Visuals · Lyrics · Release
```

Build 58 does not create a new canonical write authority. Track Manager/R2 ownership, Lyrics private reread receipts, SonicTrace persistence and native Release Campaign `canonicalWrite: false` remain unchanged.

See:

- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md`](docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [`CHANGELOG-STUDIO-FOCUS-BUILD56.md`](CHANGELOG-STUDIO-FOCUS-BUILD56.md)
- [`CHANGELOG-STUDIO-FOCUS-BUILD57.md`](CHANGELOG-STUDIO-FOCUS-BUILD57.md)
- [`CHANGELOG-STUDIO-FOCUS-BUILD58.md`](CHANGELOG-STUDIO-FOCUS-BUILD58.md)
- [`docs/STUDIO-FOCUS-BUILD58-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-BUILD58-REAL-USER-PASS.md)
- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md`](docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)

## Architecture roles — frozen

- **Studio** — private artist cockpit/orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener experience.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — rollback/reference implementation; no longer the intended primary release-campaign UX.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

**Orchestration does not mean centralization.** Studio may simplify or regroup presentation, but it must not silently become a second write owner.

## Studio Focus — production-first UX

The daily shell accepted in Build 53 is:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

### Slice 1 — Build 53 · REAL USER PASS

- artist-first shell;
- actionable Home;
- `Continue where you left off`;
- production queue based on the accepted Phase 7-A model;
- infrastructure detail hidden until needed.

### Slice 2 — Builds 54 → 56 · REAL USER PASS

Tracks became the main production library:

- `To finish / Ready / Released / All`;
- cover, title and release state;
- complete **Audio / Cover / Lyrics / Canvas / Release** chips;
- one continuation action per track;
- denser five-card desktop layout where space allows;
- full labels wrap rather than truncate;
- canonical readiness logic still comes from the existing Track/Workflow data model.

Accepted checkpoint:

```text
safety/post-studio-focus-build56-real-user-pass-20260813-0143
```

### Slice 3 — Build 57 → Build 58 · REAL USER PASS

Accepted Track Workspace mental model:

```text
Track · Visuals · Lyrics · Release
```

**Track**
- useful identity/release facts;
- canonical master audio playback;
- compact Audio / Visuals / Lyrics / Sound / Release state;
- protected audio replacement;
- full metadata and SonicTrace behind progressive detail.

**Visuals**
- canonical Cover + Thumbnail + Canvas controls;
- Cover and Canvas previews together;
- canonical Canvas preview is **9:16** in Build 58;
- campaign format work handed to Release.

**Lyrics**
- embedded LRC Maker remains primary;
- `lyrics.txt` remains the only canonical source;
- timestamps inside it remain synchronization authority;
- standalone LRC Maker remains fallback;
- save receipts still require Track Manager private canonical reread before VERIFIED.

**Release**
- compact Audio / Cover / Lyrics / Canvas / Metadata checklist;
- existing native Release Campaign immediately below;
- campaign export remains browser-local/review-only and `canonicalWrite: false`.

Historical Workspace route tokens remain valid for deep links/backward compatibility: `overview`, `metadata`, `assets`, `lyrics`, `intelligence`, `market`, `versions`, `publishing`.

#### Build 57 deployed smoke — NOT ACCEPTED

The first deployed Track Workshop smoke exposed three UX issues:

- Studio had fallen back to the LaunchPAD public catalog, so private production tracks were hidden while the UI misleadingly displayed public-only counts as if they represented the complete library;
- Visuals framed the canonical Canvas as 16:9 instead of the LaunchPAD 9:16 contract;
- `EmbeddedLyricsStudio` remained intact but public fallback silently showed raw lyrics text, making the engine look removed.

The SonicTrace `Private analysis is locked` page was correct for public fallback; the preceding full-analysis action was simply too optimistic in that state.

Build 57 therefore remains historical deployed candidate evidence and does **not** receive REAL USER PASS.

#### Build 58 smoke corrective — REAL USER PASS

Build 58 preserves the Track Workshop model and corrects only the smoke findings:

- public fallback states that Draft / To finish / Ready tracks are hidden, not deleted;
- unavailable private `To finish` / `Ready` counts render as `—`, never false zero;
- public fallback defaults to the Released projection instead of an empty To finish view;
- `Open Track Manager ↗` + `Retry private read` recovery actions are visible in Tracks and Track Workspace;
- when PRIVATE READ returns, Tracks returns to the production library;
- public Track Workspace shows a persistent `PUBLIC READ-ONLY FALLBACK` notice;
- public Track no longer promises full SonicTrace analysis while the private layer is locked;
- Lyrics public fallback explicitly shows `LYRICS STUDIO LOCKED` while keeping the validated embedded engine/private-read gate;
- public lyric text is only a secondary preview;
- Visuals Canvas is 9:16 with `object-fit: contain`, so the canonical video is not cropped.

Deployed real-user review on 2026-08-13 then proved the recovery loop rather than merely the degraded-state presentation:

- Cloudflare Access authentication returned an authenticated `/api/studio/health` bridge response (`Studio bridge 1.11`, `Track Manager 5.19`);
- Studio returned from the 31-track public projection to protected production state with `27 To finish / 6 Ready / 31 Released` visible on Home;
- `Magnetic Midnight!` Lyrics rendered the embedded LRC engine again with audio loaded and canonical authority `tracks/magnetic-midnight/lyrics.txt`;
- no Worker deploy, R2 mutation, Album mutation or catalog rebuild was needed to obtain the pass.

A fresh SonicTrace analysis/write was not performed merely to manufacture smoke evidence. Build 58 did not change SonicTrace persistence or sidecar authority; the existing accepted SonicTrace baseline and CI guards remain authoritative for that unchanged specialist path.

Accepted checkpoint:

```text
safety/post-studio-focus-build58-real-user-pass-20260813-0952
```

Full closeout: [`docs/STUDIO-FOCUS-BUILD58-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-BUILD58-REAL-USER-PASS.md).

Slice 4 — compact/invisible SonicTrace assistant — is now the next planned Studio Focus item, but remains **PLANNED / NOT STARTED** until fresh explicit authorization.

## Native Release Campaign

Studio owns the primary browser-local campaign workflow, while canonical media authority remains elsewhere.

Visual contract:

```text
Canonical track context
        ↓
Premium MASTER handoff
        ↓
MASTER 16:9 selected/imported
        ├── 1:1 generated from MASTER 16:9 reference
        └── 9:16 generated independently from the same MASTER 16:9 reference
```

The 1:1 and 9:16 are sibling derivatives. **9:16 is never derived from 1:1.**

Preserved behavior:

- optional authoritative SHINOBIWAN logo reference;
- non-destructive `New MASTER concept` rerolls;
- direct `Open Google Flow ↗` handoff;
- faithful MASTER import;
- independently anchored 1:1 and 9:16 imports;
- browser-local IndexedDB draft persistence;
- release copy/tags/provenance;
- non-canonical ZIP export;
- no Track Manager/R2 write from visual FINAL selection.

Successful campaign export emits only:

```text
release-campaign / campaign-exported / review-only
```

The manifest retains `canonicalWrite: false`.

## Phase 7-B — contextual continuation receipts

Accepted typed contract:

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Canonical-write verification rules:

1. receipt must match the exact current canonical `trackId`;
2. source / operation / effect combination must be allowlisted;
3. mismatches are ignored;
4. Studio rereads through the existing Track read layer;
5. reread must return the same `trackId`;
6. reread must be **private**;
7. operation-specific canonical evidence must exist;
8. only then may Studio display `Canonical reread verified`;
9. stale async verification cannot overwrite a newer receipt/context.

Public LaunchPAD fallback can never verify a write.

Build 51 real-user smoke proved the embedded Lyrics parent receipt path:

```text
LRC MAKER / LYRICS SAVED
Canonical reread verified
```

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership/artistic order;
- track `album.id/title` is compatibility cache, not authority;
- `catalog/index.json` is a rebuildable projection;
- Singles is a virtual collection.

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

SonicTrace V2-E Build 08 reached a durable **FULL** profile in deployed real use, including FFmpeg mastering measurements, was saved, then was canonically reread from R2. Studio Focus does not alter FULL/PARTIAL/UNAVAILABLE/OUTDATED semantics or sidecar authority.

## Protected-write rules

Track Manager remains the protected canonical write authority. Studio uses operation-specific capabilities. Missing capability blocks that operation. Whole-track delete remains unavailable in Studio.

Studio Focus may change **which controls are shown together**, but not where those mutations go.

Build 57/58 scope the existing AssetsManager presentation:

- Track → Audio;
- Visuals → Cover / Thumbnail / Video-Canvas.

Both continue to call the same guarded Track Manager asset APIs.

## Safety

- Cloudflare Access remains mandatory for private protected-write bridges;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- no generic arbitrary cross-origin Track write route;
- Release Campaign browser-local state never masquerades as canonical R2 state;
- external provider links are navigation only, not API/key integrations;
- canonical-write receipts require private canonical rereads;
- public fallback can never verify a write;
- public fallback never reconstructs or invents hidden private tracks;
- no Album membership/order mutation from Catalog Intelligence;
- no Worker deployment is implied by Studio Focus;
- **Phase 7-C remains CLOSED / NOT STARTED.**

## Rollback / acceptance anchors

```text
safety/post-studio-focus-build58-real-user-pass-20260813-0952
safety/pre-build58-slice3-smoke-corrective-20260813-0226
safety/studio-focus-build57-candidate-20260813
safety/pre-build57-track-workshop-20260813-0143
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/pre-phase7-b-build50-20260812-1826
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

## Verification policy

**CI green is necessary but never sufficient for REAL USER PASS.**

For a new Studio Focus slice:

1. exact feature head must pass the complete historical + current validation chain;
2. `main` must be rechecked for collisions before merge;
3. only the tested head may be merged;
4. Pages must deploy the exact merge SHA successfully;
5. deployed browser behavior must then be reviewed by the real user;
6. only observed behaviors are promoted to REAL USER PASS and checkpointed.

Build 58 met that policy: its deployed smoke first exposed truthful public fallback/locked private tooling, then real Cloudflare Access recovery returned the protected production state and embedded Lyrics engine. The pass records only what was actually observed; it does not claim a fresh SonicTrace write that was not performed.

Do not mutate production media merely to manufacture a smoke. Do not start Slice 4 or Phase 7-C without fresh explicit authorization.
