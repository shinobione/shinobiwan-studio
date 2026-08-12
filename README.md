# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current release / candidate line

```text
Studio          v0.16.0 · Build 46
Codename        phase7-a-workflow-overview
Status          PHASE 7-A IMPLEMENTED CANDIDATE · REAL USER SMOKE PENDING

LaunchPAD       2026.08.12.102 · C3-C Visual Card candidate
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

Track-To-Market v0.1.5 · Bridge V2
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

The user explicitly authorized beginning Phase 7 on 2026-08-12. Build 46 is the first safe Phase 7 slice: one read-only production queue derived from the existing canonical Track/Lyrics/SonicTrace/publishing state. It orchestrates **where to continue** without becoming a second write authority.

Two earlier subjective acceptance gates remain separately pending and are not rewritten by Phase 7 authorization:

- LaunchPAD Build 102 Visual Card final smoke;
- Studio Build 45 Track-To-Market Bridge V2 smoke.

## Phase 7-A — Workflow Overview

Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

New Studio route:

`#/workflow`

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For every canonical Track, Studio derives:

- `ready`, `attention` or `blocked` for each stage;
- one deterministic Next Action;
- a deep-link to the existing guarded Track Workspace section that owns that action.

Catalog-level Workflow shows:

- total Tracks;
- Workflow Ready;
- Needs Attention;
- Blocked;
- SonicTrace Gap;
- search;
- Needs Attention / Blocked / Draft / Ready / All filters.

### Phase 7-A safety boundary

Build 46 is deliberately read-only. It does **not**:

- call Track Manager mutation APIs;
- write R2;
- save SonicTrace;
- save Lyrics;
- publish/unpublish;
- move Album membership/order;
- persist Track-To-Market output;
- modify LaunchPAD or deploy a Worker.

Every Next Action simply opens the already-validated specialist surface in Track Workspace.

Rollback anchor after Build 45 and before Phase 7:

` safety/pre-phase7-authorized-post-build45-20260812-0232 `

See:

- [`docs/PHASE-7-A-WORKFLOW-BUILD46.md`](docs/PHASE-7-A-WORKFLOW-BUILD46.md)
- [`CHANGELOG-PHASE7-BUILD46.md`](CHANGELOG-PHASE7-BUILD46.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## PHASE UX status inherited by Phase 7

### C2.5-A → F
**COMPLETE — REAL USER VALIDATED**

Canonical Album read/write/migration/public cutover and virtual Singles semantics are complete. LaunchPAD Build 87 remains the historical sanctuarized touch/player baseline inherited by later builds.

### C3-A — Deep Audio resilience
**COMPLETE — REAL USER PASS**

SonicTrace Build 06 + Studio produced a truthful FULL unsaved profile for **Stick to You**, including mastering, Neural, finite 512D embedding, structure and semantic summary.

Checkpoint:

` safety/c3-a-real-user-pass-20260811-1900 `

### C3-B — Studio V2-E parity
**COMPLETE — REAL USER PASS**

Builds 42–43 provide canonical read-only Catalog Intelligence:

- deterministic finite-512D projection;
- acoustic zones separate from Neural sonic families;
- nearest-neighbor similarity;
- redundant pairs / outliers / cross-zone bridges;
- canonical Album/Project intelligence;
- read-only advisory sequence;
- explicit analyzed-vs-mappable truthfulness.

Final smoke mapped four finite embeddings from five analyzed tracks and correctly identified `SINGULARITY :: OBLITERANT` as missing a usable 512D embedding.

Checkpoint:

` safety/post-c3-b-real-user-pass-20260811-1958 `

### C3-C — Premium Feel / LaunchPAD corrective line
**FINAL VISUAL CARD REAL-USER SMOKE PENDING**

Studio Build 44 established the premium interaction language. LaunchPAD then went through real-user corrective Builds 91–102 rather than silently accepting the first implementation.

Key accepted/corrected points:

- click glow tuned and accepted;
- route transitions simplified into a smooth stable settle;
- Lyrics auto-scroll fixed and accepted in Build 96;
- mobile Home/Albums/Lyrics picker cleaned up;
- mobile boot/menu responsiveness hardened;
- player loading state made stall-aware;
- mobile menu ownership race removed;
- pinch zoom locked for application behavior;
- unintended rectangular player chrome removed, including sidebar Previous/Next (Build 101 explicitly accepted).

LaunchPAD Build 102 is the final current C3-C candidate. It pre-encodes Visual Card PNG data and gives deterministic `Shared ✓`, `Downloaded ✓` and `Copied ✓` feedback. Its automated gates and deployment are green; user confirmation is still pending.

LaunchPAD rollback anchors:

```text
safety/pre-build102-visual-card-feedback-20260812-0220
safety/pre-phase7-authorized-20260812-0230
```

## Track-To-Market Bridge V2 — Build 45 inheritance

Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Studio v0.15.1 Build 45 added `Release Pack` inside Track Workspace:

```text
Studio canonical track
  -> open Track-To-Market v0.1.5
  -> URL bootstrap: trackId / title / genres
  -> Bridge V2 ready handshake
  -> canonical lyrics + richer context by allowlisted postMessage
  -> DRAFT exploration / FINAL creation
  -> matching FINAL-only return
  -> transient Studio review state
```

Frozen Build 45 rules:

- explicit Track-To-Market origin;
- returned `trackId` must match current Track;
- only `releaseStatus === final` accepted;
- DRAFT returns rejected;
- no R2 write;
- no Track Manager mutation;
- returned FINAL remains transient React state.

Rollback anchor:

` safety/pre-track-to-market-build45-20260812 `

Build 46 inherits this integration unchanged.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release-pack ideation/finalization assistant, not canonical write authority.
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

Current canonical Albums:

- Neon Heartbreaks;
- Coal to Diamond;
- Love Letters from Saigon.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

A missing `.lrc` does not mean lyrics are unsynchronized. `.lrc` never becomes a second source of truth.

## Track Manager / protected-write rules

Track Manager remains the only protected canonical write authority. Studio uses operation-specific capabilities such as:

- `track-create`;
- `assets`;
- `catalog-rebuild`;
- guarded Album capabilities.

Additional advertised capabilities are additive; missing capability for the requested operation still blocks that operation.

Whole-track delete remains unavailable in Studio.

Phase 7-A imports none of these mutation APIs.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A preserves schema v1 and resilient Deep Audio semantics. C3-B reads the same canonical sidecars and treats only finite 512D embeddings as map/similarity eligible.

Phase 7-A consumes only the existing summary state (`available`, `outdated`, `latestAnalysisId`) exposed by the established catalog read service.

## Phase 7 roadmap

### 7-A — Workflow Overview
**CURRENT CANDIDATE — Build 46**

Read-only canonical production queue and deep-linked Next Actions.

### 7-B — Contextual continuation receipts
**PLANNED AFTER 7-A REAL-USER PASS**

Specialist tools may report completion; Studio must re-read canonical state afterward rather than trust optimistic local copies.

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Guarded resumable New Track → media → metadata → lyrics → analysis → release-readiness flow, using existing operation owners and explicit confirmations.

No generic all-powerful write route is planned.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

See [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md) for current detail.

## Security / safety

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin Track write route;
- Track-To-Market uses explicit origin + FINAL/trackId gates;
- Phase 7-A is a read-only derived view.

## Rollback anchors

```text
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/post-build41-real-user-pass-20260811-1833
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI is necessary but not sufficient. Real-user smoke remains authoritative for user-facing milestone acceptance.

Current pending user checks are deliberately explicit:

1. LaunchPAD Build 102 Visual Card;
2. Studio Build 45 Track-To-Market Bridge V2;
3. Studio Build 46 Phase 7-A Workflow.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.