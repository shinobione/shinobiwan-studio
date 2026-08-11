# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-11 after C3-B real-user acceptance and C3-C premium-feel implementation candidate.

This file is the concise current roadmap. Historical release details remain in milestone-specific documents and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — code authority.
- Canonical `trackId` is the R2 track slug everywhere.

## Completed product phases

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC integration ✅ REAL USER VALIDATED

Canonical Lyrics remains:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

## PHASE UX

PHASE UX is post-Phase-6 product quality work and is **not Phase 7**.

### C2.5-A → F
Status: **COMPLETE — REAL USER VALIDATED**

Delivered and preserved:

- LaunchPAD Album scalability / mobile / player hardening;
- canonical R2 Album read model;
- guarded Track Manager Album writes;
- Studio Album Management + New Track binding;
- controlled migration of the three legacy Albums;
- LaunchPAD canonical Album public cutover through Worker v2.7;
- virtual Singles semantics.

LaunchPAD Build 87 remains the sanctuarized touch/player behavior baseline inherited by later builds.

See `docs/PHASE-UX-C2-5-CLOSEOUT.md`.

### C3 — SonicTrace Deep Audio / V2-E parity / premium interaction quality
Status: **IN PROGRESS — FINAL SLICE ACTIVE**

#### C3-A — Deep Audio resilience + truthful profile semantics
Status: **COMPLETE — REAL USER PASS**

Validated line:

- SonicTrace `V2-E · BUILD 06` / Deep Audio `2.0.1-alpha`;
- Studio semantics introduced in `v0.13.0 · Build 38` and carried forward.

Delivered:

- robust FFmpeg loudnorm parsing;
- real EBU R128 fallback;
- mastering degradation does not abort Neural / embedding / structure;
- truthful `FULL / PARTIAL / UNAVAILABLE / OUTDATED` semantics;
- transport failures separated from coordinator processing failures;
- null mastering metrics remain missing instead of becoming numeric zero.

Real-user acceptance used **Stick to You** and returned an unsaved FULL profile with mastering, Neural, finite 512D embedding, structure and semantic summary ready.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900` on Studio and SonicTrace.

See `docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md`.

#### C3-UX corrective — Focused Albums + palette
Status: **COMPLETE — REAL USER PASS**

Studio Builds 39–40 + LaunchPAD Build 90 delivered:

- cover-first Album library;
- one selected Album at a time;
- `Overview / Tracklist / Assets` workspace;
- migration archive moved to System;
- Primary / Secondary color controls backed by canonical `accent` / `accent2`;
- LaunchPAD Album-detail theming from canonical palette metadata.

No Worker/R2/Album-authority/player semantics changed.

#### C3 operational hotfix — New Track additive capability compatibility
Status: **COMPLETE — REAL USER PASS**

Studio Build 41 accepts additive Track Manager manage-capabilities while preserving operation-specific requirements (`track-create`, `assets`, `catalog-rebuild`). Real-user retry passed with **Stick to You**.

Checkpoint: `safety/post-build41-real-user-pass-20260811-1833`.

#### C3-B — Studio V2-E parity
Status: **COMPLETE — REAL USER PASS**

Base implementation: Studio `v0.14.0 · Build 42`.
Real-user clarity corrective: Studio `v0.14.1 · Build 43`.

Delivered:

- deterministic 2D projection from canonical finite 512D CLAP embeddings;
- acoustic K-means zones;
- separate Neural genre-derived sonic families;
- explicit semantics: **position = embedding proximity, color = family, zone = neighborhood**;
- nearest-neighbor similarity;
- redundant/very-close pairs;
- catalog outliers;
- cross-zone bridges;
- canonical Album/Project embedding coverage, coherence, outliers and bridge candidate;
- read-only advisory continuity sequence preserving original canonical position provenance;
- no automatic Album order/membership mutation;
- no standalone SonicTrace IndexedDB authority.

### C3-B real-user finding / Build 43

The first smoke showed a truthful data state that was not explicit enough in UX:

```text
ANALYZED      5
512D READY    4
MAP POINTS    4
```

Build 43 added the truthful eligibility layer:

- `HIDDEN FROM MAP` KPI;
- `mapped · hidden` count;
- explicit unmapped-track list;
- `512D ready` / `512D missing` badges;
- explicit missing-embedding Closest Sound state;
- map-ready filter.

Final real-user smoke passed with:

```text
ANALYZED          5
512D READY        4
HIDDEN FROM MAP   1
ACOUSTIC ZONES    2
SONIC FAMILIES    2
NEEDS UPDATE      0
```

`SINGULARITY :: OBLITERANT` was correctly identified as the unmappable analysis. The four eligible tracks mapped and produced working nearest-neighbor results. Album/project surfaces degraded honestly to 0% coverage where no valid embeddings existed.

Post-pass checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

See `docs/PHASE-UX-C3-B-V2E-PARITY.md` and `CHANGELOG-C3-BUILD42.md`.

#### C3-C — Premium interaction polish / motion feel
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Cross-app candidate line:

- Studio `v0.15.0 · Build 44`;
- LaunchPAD `2026.08.11.91`.

Studio candidate adds:

- shared motion/easing tokens;
- tactile press/release response;
- restrained CTA glow/lift;
- coherent nav/tab/selection transitions;
- local form-control focus lighting;
- subtle depth on already-interactive cards/rows;
- safe map-point interaction response;
- short non-looping feedback/view cues;
- touch-hover containment;
- explicit `prefers-reduced-motion` support.

LaunchPAD companion Build 91 applies the same philosophy to:

- hero/primary/secondary actions;
- nav/chips;
- player controls;
- editable controls;
- interactive cards/rows;
- view transitions;
- PWA-cached premium interaction stylesheet.

Frozen C3-C rules:

- no fake progress;
- no infinite attention animation;
- no transition delay that postpones a real action;
- no canonical data changes merely for polish;
- no Worker/R2/Track Manager/SonicTrace/player-semantics changes.

See `docs/PHASE-UX-C3-C-PREMIUM-FEEL.md` and `CHANGELOG-C3-BUILD44.md`.

### After C3-C real-user pass

1. final PHASE UX cross-app real-user smoke;
2. documentation reconciliation;
3. final PHASE UX safety checkpoint;
4. explicit user decision on whether to authorize Phase 7.

## Phase 7 — End-to-end workflow
Status: **LOCKED / NOT AUTHORIZED**

Do not implement, scaffold, branch, merge or deploy Phase 7 without explicit user authorization after PHASE UX closeout.

## Later original roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Goal: Studio opens directly onto actionable catalog health.

Planned themes:

- global catalog summary;
- Needs Attention;
- incomplete tracks;
- stale SonicTrace;
- missing cover/lyrics/Canvas;
- drafts/unpublished;
- recent activity;
- GPU/Worker/R2/catalog status;
- global search.

### Phase 9 — Security / reliability / PWA

Planned themes:

- Cloudflare Access/CORS hardening;
- no secrets in Pages;
- timeouts/retries;
- anti-loss saves;
- clear errors;
- degraded/offline behavior;
- PWA cache/update robustness;
- Android/Chrome resilience;
- graceful SonicTrace/Worker outages.

### Phase 10 — Progressive extraction of shared engines

Potential mature extractions only after behavior is stable:

- LRC Maker → reusable `lrc-engine`;
- SonicTrace → `sonictrace-engine`;
- Track Manager → `catalog-api`;
- Studio remains orchestrator.

There is currently **no official Phase 11**.

## Current runtime / candidate baseline

```text
Real-user validated functional line before C3-C smoke:
Studio          0.14.1 / Build 43
LaunchPAD       2026.08.11.90
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8

C3-C interaction candidates:
Studio          0.15.0 / Build 44
LaunchPAD       2026.08.11.91
Track Manager   v5.19           unchanged
Studio bridge   v1.11           unchanged
Public Worker   v2.7            unchanged
SonicTrace      V2-E Build 06   unchanged
Deep Audio      2.0.1-alpha     unchanged
LRC Maker       6.3.8           unchanged
```

C3-A, C3-B, focused Album UX/palette and Build 41 New Track compatibility are real-user validated. C3-C is now the only active PHASE UX implementation slice before final cross-app closeout. Phase 7 remains locked.
