# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after C3-B real-user acceptance, C3-C premium-feel candidate and bounded Track-To-Market Bridge V2 candidate.

This file is the concise current roadmap. Historical release details remain in milestone-specific documents and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release-pack ideation/finalization assistant; not a canonical write authority.
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

PHASE UX is post-Phase-6 product quality/integration work and is **not Phase 7**.

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
Status: **IN PROGRESS — C3-C SMOKE + BOUNDED BRIDGE CANDIDATE**

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

The final real-user smoke passed with four finite 512D map points from five analyzed tracks, truthfully identifying `SINGULARITY :: OBLITERANT` as missing a usable embedding.

Post-pass checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

See `docs/PHASE-UX-C3-B-V2E-PARITY.md` and `CHANGELOG-C3-BUILD42.md`.

#### C3-C — Premium interaction polish / motion feel
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Cross-app candidate line:

- Studio `v0.15.0 · Build 44`;
- LaunchPAD `2026.08.11.91`.

Studio candidate adds shared motion/easing tokens, tactile press/release response, restrained CTA glow/lift, coherent nav/tab/selection transitions, local form-control focus lighting, safe map interaction response, touch-hover containment and explicit `prefers-reduced-motion` support.

Frozen C3-C rules:

- no fake progress;
- no infinite attention animation;
- no transition delay that postpones a real action;
- no canonical data changes merely for polish;
- no Worker/R2/Track Manager/SonicTrace/player-semantics changes.

See `docs/PHASE-UX-C3-C-PREMIUM-FEEL.md` and `CHANGELOG-C3-BUILD44.md`.

#### C3 bounded integration — Track-To-Market Bridge V2
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Studio `v0.15.1 · Build 45` adds a `Release Pack` Track Workspace section while preserving the Phase 7 STOP.

Delivered candidate behavior:

- opens Track-To-Market v0.1.5 standalone from a canonical track;
- short URL bootstrap contains only trackId/title/genres;
- full canonical lyrics + richer track context travel by allowlisted `postMessage` after the ready handshake;
- Track-To-Market FINAL return must match the current canonical trackId;
- non-FINAL/DRAFT returns are rejected;
- accepted FINAL pack is stored only in transient Studio component state;
- no R2 write or Track Manager mutation API is imported by the panel.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

See `docs/TRACK-TO-MARKET-BUILD45.md` and `CHANGELOG-C3-BUILD45.md`.

### Pending PHASE UX acceptance

1. C3-C premium-interaction real-user smoke remains pending;
2. Build 45 Track-To-Market Bridge V2 real-user smoke remains pending;
3. final PHASE UX cross-app smoke;
4. documentation reconciliation;
5. final PHASE UX safety checkpoint;
6. explicit user decision on whether to authorize Phase 7.

## Phase 7 — End-to-end workflow
Status: **LOCKED / NOT AUTHORIZED**

Do not implement, scaffold, branch, merge or deploy Phase 7 without explicit user authorization after PHASE UX closeout.

Build 45 is explicitly scoped as a PHASE UX C3 bounded bridge/review integration and does not create the Phase 7 end-to-end write workflow.

## Later original roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Goal: Studio opens directly onto actionable catalog health.

Planned themes include global catalog summary, Needs Attention, incomplete tracks, stale SonicTrace, missing cover/lyrics/Canvas, drafts/unpublished, recent activity, GPU/Worker/R2/catalog status and global search.

### Phase 9 — Security / reliability / PWA

Planned themes include Access/CORS hardening, timeouts/retries, anti-loss saves, degraded/offline behavior, PWA cache/update robustness and graceful local/Worker outages.

### Phase 10 — Progressive extraction of shared engines

Potential mature extractions only after behavior is stable:

- LRC Maker → reusable `lrc-engine`;
- SonicTrace → `sonictrace-engine`;
- Track Manager → `catalog-api`;
- Studio remains orchestrator.

There is currently **no official Phase 11**.

## Current runtime / candidate baseline

```text
Real-user validated functional line before current candidates:
Studio          0.14.1 / Build 43
LaunchPAD       2026.08.11.90
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8

Current PHASE UX candidates:
Studio          0.15.1 / Build 45   C3-C inherited + TTME bridge candidate
LaunchPAD       2026.08.11.91      C3-C candidate
Track-To-Market 0.1.5              Bridge V2 / FINAL gate
Track Manager   v5.19               unchanged
Studio bridge   v1.11               unchanged
Public Worker   v2.7                unchanged
SonicTrace      V2-E Build 06       unchanged
Deep Audio      2.0.1-alpha         unchanged
LRC Maker       6.3.8                unchanged
```

C3-A, C3-B, focused Album UX/palette and Build 41 New Track compatibility are real-user validated. C3-C and the bounded Track-To-Market Bridge V2 are implementation candidates pending real-user smoke. Phase 7 remains locked.
