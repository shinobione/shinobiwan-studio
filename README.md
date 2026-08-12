# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current accepted / corrective line

```text
Accepted baseline:
Studio          v0.16.0 · Build 46 · PHASE 7-A REAL USER PASS
LaunchPAD       2026.08.12.102 · C3-C REAL USER PASS
Track-To-Market v0.1.5 · Bridge V2 transport/finality REAL USER PASS

Current corrective candidate:
Studio          v0.16.1 · Build 47
Codename        phase7-a-ttm-v3-staged-preview
Track-To-Market v0.2.0 · Release Orchestrator · Bridge V3 · DEPLOYED

Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX remains COMPLETE — REAL USER VALIDATED. Phase 7-A Build 46 remains COMPLETE — REAL USER PASS.**

After that accepted closeout, a deeper Track-To-Market product review exposed two UX/product limitations that did not invalidate the already-proven Bridge V2 transport/finality contract:

1. the manually uploaded SHINOBIWAN logo was not explicitly carried into the external premium-provider handoff as a reference file;
2. premium imported covers received an unwanted generic title overlay in Track-To-Market.

Track-To-Market v0.2.0 fixes those product issues. Studio Build 47 is the bounded consumer corrective: it stages the **actual selected FINAL artwork preview + provenance** while keeping every canonical write authority frozen.

See:

- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-TTM-V3-BUILD47.md`](docs/PHASE-7-A-TTM-V3-BUILD47.md)
- [`CHANGELOG-PHASE7-BUILD47.md`](CHANGELOG-PHASE7-BUILD47.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## Phase 7-A — Workflow Overview

Status: **COMPLETE — REAL USER PASS · Build 46**

Studio route: `#/workflow`

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For every canonical Track, Studio derives `ready`, `attention` or `blocked`, one deterministic Next Action and a deep-link to the established guarded Track Workspace surface.

Build 46 remains deliberately read-only. It does not call Track Manager mutation APIs, write R2, save SonicTrace/Lyrics, publish, mutate Album order/membership, persist Track-To-Market output or modify LaunchPAD.

Rollback anchors:

```text
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

## Phase 7-A post-pass corrective — Track-To-Market V3 / Build 47

Status: **IMPLEMENTED CANDIDATE — REAL USER CORRECTIVE SMOKE PENDING**

This is intentionally **not** Phase 7-B. It upgrades the accepted Build 45/46 integration surface before continuation receipts begin.

Flow:

```text
Canonical Track Workspace
  → Track-To-Market V0.2 Release Orchestrator
  → premium provider handoff + explicit logo reference
  → FINAL import preserved by default
  → optional release assets / ZIP
  → Bridge V3 FINAL artwork preview + provenance
  → Studio staged review
```

### What Studio receives

- compressed preview of the actual selected FINAL artwork;
- provider / source model;
- artwork strategy (`integrated` / `clean`);
- branding treatment (`preserve` / `logo-only` / `editorial`);
- mode / bridge version;
- SoundCloud copy and social caption.

Preview is accepted only as `data:image/*` and capped at 2.5 MB.

### Frozen Bridge gates

- expected GitHub Pages origin only;
- exact child Window opened by Studio;
- matching canonical `trackId`;
- `releaseStatus === final` only;
- DRAFT returns rejected.

### Build 47 authority boundary

**Stage + review only:**

- no R2 write;
- no Track Manager mutation API import;
- no canonical cover replacement;
- no preview persistence;
- no automatic publishing.

Rollback anchor:

`safety/pre-build47-ttm-v3-preview-20260812`

## Track-To-Market v0.2 — Release Orchestrator

The accepted V0.1.5 Bridge V2 remains the proof of Studio ↔ TTM context/FINAL transport. V0.2 evolves the **product workflow** around that proven bridge.

Quality hierarchy:

1. **PREMIUM FINAL** — ChatGPT Images / Google Flow / Gemini.
2. **LOCAL DRAFT** — ComfyUI + RTX, ideation only.
3. **CLOUD DRAFT** — Workers AI / FLUX, ideation only.

V0.2 changes:

- default premium strategy is `Integrated`: provider composes the exact title and supplied logo as part of the artwork;
- when a real logo is uploaded, TTM explicitly instructs the provider to **attach that exact logo file as a reference image**;
- `Clean` artwork-only strategy remains optional;
- premium imports enter as `Original FINAL` with **no automatic overlay**;
- optional `Logo only` / `Editorial` treatments are explicit and reversible;
- 1:1 / 9:16 adaptation uses safe-fit preservation rather than silent rebranding/cropping;
- FINAL ZIP includes provider handoff, logo reference, original source when relevant, release texts/assets and V0.2 provenance;
- Bridge V3 returns the staged FINAL preview/provenance to Studio.

Track-To-Market still has **no canonical write authority**.

TTM rollback anchor:

`safety/pre-v0.2-release-orchestrator-20260812`

## PHASE UX — FINAL STATUS

**COMPLETE — REAL USER VALIDATED**

### C2.5-A → F
Canonical Album read/write/migration/public cutover and virtual Singles semantics are complete and real-user validated.

### C3-A — Deep Audio resilience
**COMPLETE — REAL USER PASS**

SonicTrace Build 06 + Studio produced a truthful FULL profile for **Stick to You**, including mastering, Neural, finite 512D embedding, structure and semantic summary.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.

### C3-B — Studio V2-E parity
**COMPLETE — REAL USER PASS**

Builds 42–43 provide canonical read-only Catalog Intelligence with finite-512D projection, acoustic zones, Neural families, nearest-neighbor similarity, redundant/outlier/bridge insights, Album/Project intelligence and explicit analyzed-vs-mappable truthfulness.

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium Feel / LaunchPAD corrective line
**COMPLETE — REAL USER PASS**

LaunchPAD Builds 91–102 were iterated against real-user feedback. Accepted baseline: `2026.08.12.102`.

Checkpoint: `safety/post-c3-c-build102-real-user-pass-20260812-0923`.

### Track-To-Market Bridge V2 — Build 45
**COMPLETE — REAL USER PASS (transport/finality contract)**

Real-user validation confirmed Studio → TTM → FINAL → Studio context/lyrics transfer, matching `trackId`, FINAL-only acceptance and absence of R2/Track Manager writes.

Build 47 does not revoke that pass; it improves the later-observed premium artwork workflow and review quality.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant, not canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

**Phase 7 means orchestration, not centralization.**

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership/artistic order;
- track `album.id/title` is compatibility cache, not authority;
- `catalog/index.json` is rebuildable projection;
- Singles is a virtual collection.

Current canonical Albums: Neon Heartbreaks, Coal to Diamond, Love Letters from Saigon.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

`.lrc` never becomes a second source of truth.

## Track Manager / protected-write rules

Track Manager remains the protected canonical write authority. Studio uses operation-specific capabilities such as `track-create`, `assets`, `catalog-rebuild` and guarded Album capabilities. Missing capability blocks that operation. Whole-track delete remains unavailable in Studio.

Build 47 imports none of these mutation APIs.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A/C3-B contracts remain unchanged.

## Phase 7 roadmap

### 7-A — Workflow Overview
**COMPLETE — REAL USER PASS · Build 46**

### 7-A corrective — TTM V3 staged review
**CURRENT CANDIDATE · Build 47**

Correct the premium TTM workflow/review layer without introducing a new authority.

### 7-B — Contextual continuation receipts
**NEXT AFTER BUILD 47 CORRECTIVE SMOKE · FIRST AVAILABLE BUILD 48**

Specialist tools may report completion/result receipts. Studio must re-read canonical state after canonical writes instead of trusting optimistic child/local copies. No generic write endpoint is introduced.

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Guarded resumable New Track → media → metadata → lyrics → analysis → release-readiness flow using existing operation owners and explicit confirmations.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

## Security / safety

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- no generic arbitrary cross-origin Track write route;
- TTM requires origin + exact-child + FINAL + trackId gates;
- staged artwork preview is transient browser memory only;
- future 7-B receipts must trigger canonical rereads rather than create alternate authority.

## Rollback anchors

```text
safety/pre-build47-ttm-v3-preview-20260812
safety/pre-v0.2-release-orchestrator-20260812   # Track-To-Market repo
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/post-phase7-a-build46-real-user-pass-20260812-0923
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/post-build41-real-user-pass-20260811-1833
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI is necessary but not sufficient. Accepted Build 102/45/46 history remains accepted. **Build 47 / TTM V0.2 is a new post-pass corrective candidate and requires its own real-user smoke.**

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.
