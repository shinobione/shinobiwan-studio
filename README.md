# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current release / candidate line

```text
Studio          v0.16.1 · Build 47
Codename        phase7-a-ttm-v3-staged-preview
Status          PHASE 7-A CORRECTIVE CANDIDATE · REAL USER SMOKE PENDING

LaunchPAD       2026.08.12.102 · C3-C Visual Card candidate
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

Track-To-Market v0.2.0 · Release Orchestrator · Bridge V3
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

The user explicitly authorized Phase 7 on 2026-08-12. Build 46 introduced the first safe Phase 7 slice: a read-only production queue derived from existing canonical Track/Lyrics/SonicTrace/publishing state.

The subsequent real-user Track-To-Market smoke proved the Bridge path but exposed two product issues: the manually uploaded SHINOBIWAN logo was not explicitly carried into the premium provider handoff, and premium imports received an unwanted generic title overlay. Track-To-Market v0.2.0 fixes those issues and Build 47 upgrades Studio to stage the **actual selected FINAL artwork preview** with provenance.

Two subjective acceptance lines remain separately pending and are not rewritten by CI:

- LaunchPAD Build 102 Visual Card final smoke;
- Studio Build 47 Track-To-Market V3 corrective smoke.

## Phase 7-A — Workflow Overview

Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Route: `#/workflow`

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For every canonical Track, Studio derives:

- `ready`, `attention` or `blocked` per stage;
- one deterministic Next Action;
- a deep-link to the existing guarded Track Workspace section that owns that action.

Catalog Workflow provides total Tracks, Workflow Ready, Needs Attention, Blocked, SonicTrace Gap, search and focused filters.

### Phase 7-A safety boundary

The Workflow model/view remains read-only. It does **not**:

- call Track Manager mutation APIs;
- write R2;
- save SonicTrace;
- save Lyrics;
- publish/unpublish;
- move Album membership/order;
- persist Track-To-Market output;
- modify LaunchPAD or deploy a Worker.

Every Next Action opens an already-established specialist surface.

See:

- [`docs/PHASE-7-A-WORKFLOW-BUILD46.md`](docs/PHASE-7-A-WORKFLOW-BUILD46.md)
- [`CHANGELOG-PHASE7-BUILD46.md`](CHANGELOG-PHASE7-BUILD46.md)

## Phase 7-A corrective — Track-To-Market V3 / Build 47

Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Build 47 consumes Track-To-Market v0.2.0 / Bridge V3.

Flow:

```text
Canonical Track Workspace
  → Track-To-Market V0.2 Release Orchestrator
  → premium provider handoff
  → FINAL artwork import / release assets
  → Bridge V3 FINAL return
  → Studio staged artwork preview + provenance
```

Studio now receives and reviews:

- compressed preview of the actual selected FINAL cover;
- provider / source model;
- artwork strategy (`integrated` / `clean`);
- branding treatment (`preserve` / `logo-only` / `editorial`);
- mode / bridge version;
- SoundCloud copy / social caption.

The preview is validated as `data:image/*` and capped at 2.5 MB before rendering.

Frozen security gates remain:

- origin must be the expected SHINOBIWAN GitHub Pages origin;
- `event.source` must be the exact child Window opened by Studio;
- returned `trackId` must equal the current canonical track;
- only `releaseStatus === final` is accepted;
- DRAFT returns are rejected.

### Build 47 authority boundary

Build 47 is **Stage + review only**:

- no R2 write;
- no Track Manager mutation API import;
- no canonical cover replacement;
- no preview persistence;
- no automatic publishing.

See:

- [`docs/PHASE-7-A-TTM-V3-BUILD47.md`](docs/PHASE-7-A-TTM-V3-BUILD47.md)
- [`CHANGELOG-PHASE7-BUILD47.md`](CHANGELOG-PHASE7-BUILD47.md)

Rollback anchor:

`safety/pre-build47-ttm-v3-preview-20260812`

## Track-To-Market v0.2 product contract

The previous Build 45 / Bridge V2 smoke successfully proved the cross-window transport and FINAL-only return path, but the smoke was **not accepted as final product behavior** because it exposed the logo-handoff and generic-title-overlay issues.

Track-To-Market v0.2 now defines:

1. **PREMIUM FINAL** — ChatGPT Images / Google Flow / Gemini.
2. **LOCAL DRAFT** — ComfyUI + RTX, ideation only.
3. **CLOUD DRAFT** — Workers AI / FLUX, ideation only.

When a real SHINOBIWAN logo is uploaded, TTM explicitly instructs the premium provider to **attach that exact file as a reference image**. Integrated artwork is the default, so title and logo can belong to the provider composition itself.

Imported premium artwork is now non-destructive by default (`Original FINAL`). Optional `Logo only` / `Editorial` treatments are explicit rather than automatic.

TTM still has no canonical write authority.

## PHASE UX status inherited by Phase 7

### C2.5-A → F
**COMPLETE — REAL USER VALIDATED**

Canonical Album read/write/migration/public cutover and virtual Singles semantics are complete. LaunchPAD Build 87 remains the historical sanctuarized touch/player baseline inherited by later builds.

### C3-A — Deep Audio resilience
**COMPLETE — REAL USER PASS**

SonicTrace Build 06 + Studio produced a truthful FULL unsaved profile for **Stick to You**, including mastering, Neural, finite 512D embedding, structure and semantic summary.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.

### C3-B — Studio V2-E parity
**COMPLETE — REAL USER PASS**

Builds 42–43 provide canonical read-only Catalog Intelligence: deterministic finite-512D projection, acoustic zones distinct from Neural families, nearest-neighbor similarity, redundant pairs/outliers/bridges, Album/Project intelligence and explicit analyzed-vs-mappable truthfulness.

Final smoke mapped four finite embeddings from five analyzed tracks and correctly identified `SINGULARITY :: OBLITERANT` as missing a usable 512D embedding.

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium Feel / LaunchPAD corrective line
**FINAL VISUAL CARD REAL-USER SMOKE PENDING**

Studio Build 44 established the premium interaction language. LaunchPAD then progressed through corrective Builds 91–102 rather than silently accepting the first candidate.

Accepted/corrected history includes glow tuning, stable route transitions, Lyrics auto-scroll, mobile Home/Albums/Lyrics cleanup, boot/menu responsiveness, stall-aware player state, single-owner mobile menu, locked pinch zoom and clean player chrome. Build 102 is the current Visual Card candidate with deterministic Share/Download/Copy feedback.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant; never canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

**Phase 7 means orchestration, not centralization.** Studio must not become another catalog, analysis engine, Lyrics authority or generic backend write proxy.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

Frozen rules:

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership/artistic order;
- track-manifest `album.id/title` is compatibility cache, not authority;
- `catalog/index.json` is a rebuildable projection;
- Singles is a virtual collection derived from Tracks not owned by a canonical Album.

Current canonical Albums: Neon Heartbreaks, Coal to Diamond, Love Letters from Saigon.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

A missing `.lrc` does not mean lyrics are unsynchronized. `.lrc` never becomes a second source of truth.

## Track Manager / protected-write rules

Track Manager remains the protected canonical write authority. Studio uses operation-specific capabilities such as `track-create`, `assets`, `catalog-rebuild` and guarded Album capabilities. Missing capability for the requested operation blocks that operation. Whole-track delete remains unavailable in Studio.

Phase 7-A Workflow and Build 47 TTM staging import no mutation APIs.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A preserves schema v1/resilient Deep Audio semantics. C3-B reads the same canonical sidecars and treats only finite 512D embeddings as map/similarity eligible. Phase 7-A consumes only existing read summaries.

## Phase 7 roadmap

### 7-A — Workflow Overview + TTM staged review
**CURRENT CANDIDATE — Build 47**

Read-only canonical production queue, deep-linked Next Actions and transient FINAL Track-To-Market staging.

### 7-B — Contextual continuation receipts
**PLANNED AFTER 7-A REAL-USER PASS**

Specialist tools may report completion; Studio must re-read canonical state afterward instead of trusting optimistic local copies.

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Guarded resumable New Track → media → metadata → lyrics → analysis → release-readiness flow using existing operation owners and explicit confirmations.

No generic all-powerful write route is planned.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

See [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md).

## Security / safety

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin Track write route;
- TTM uses explicit origin + exact-child + FINAL + trackId gates;
- Build 47 preview is transient only.

## Rollback anchors

```text
safety/pre-build47-ttm-v3-preview-20260812
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/post-build41-real-user-pass-20260811-1833
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI is necessary but not sufficient. Real-user smoke remains authoritative for user-facing milestone acceptance.

Current pending user checks:

1. LaunchPAD Build 102 Visual Card;
2. Studio Build 47 + Track-To-Market V0.2 premium handoff / non-destructive FINAL / staged preview;
3. Studio Phase 7-A Workflow behavior.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.
