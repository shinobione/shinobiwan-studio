# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current accepted line

```text
Studio          v0.16.0 · Build 46
Codename        phase7-a-workflow-overview
Status          PHASE 7-A COMPLETE · REAL USER PASS

LaunchPAD       2026.08.12.102 · C3-C REAL USER PASS
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

Track-To-Market v0.1.5 · Bridge V2 · REAL USER PASS
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX is COMPLETE — REAL USER VALIDATED.** Phase 7-A is also complete and accepted. The next Studio roadmap slice is **Phase 7-B — Contextual continuation receipts**.

See:

- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## Phase 7-A — Workflow Overview

Status: **COMPLETE — REAL USER PASS**

Studio route:

`#/workflow`

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For every canonical Track, Studio derives:

- `ready`, `attention` or `blocked` for each stage;
- one deterministic Next Action;
- a deep-link to the existing guarded Track Workspace section that owns that action.

Catalog-level Workflow exposes:

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

Rollback anchors:

```text
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

## PHASE UX — FINAL STATUS

**COMPLETE — REAL USER VALIDATED**

### C2.5-A → F

Canonical Album read/write/migration/public cutover and virtual Singles semantics are complete and real-user validated.

Historical closeout: `docs/PHASE-UX-C2-5-CLOSEOUT.md`.

### C3-A — Deep Audio resilience

**COMPLETE — REAL USER PASS**

SonicTrace Build 06 + Studio produced a truthful FULL profile for **Stick to You**, including mastering, Neural, finite 512D embedding, structure and semantic summary.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.

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

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium Feel / LaunchPAD corrective line

**COMPLETE — REAL USER PASS**

LaunchPAD Builds 91–102 were iterated against real-user feedback rather than CI-only acceptance. The accepted baseline is LaunchPAD `2026.08.12.102`.

Final accepted points include smooth route motion, Lyrics auto-scroll/layout, mobile Albums/Home/Lyrics cleanup, responsive stable menu ownership, stall-aware player state, locked application pinch zoom, clean player chrome and deterministic Visual Card Share / Download / Copy behavior.

LaunchPAD checkpoints:

```text
safety/pre-build102-visual-card-feedback-20260812-0220
safety/post-c3-c-build102-real-user-pass-20260812-0923
```

### Track-To-Market Bridge V2 — Build 45

**COMPLETE — REAL USER PASS**

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

Real-user validation confirmed the complete Studio → Track-To-Market → FINAL → Studio path, including correct context/lyrics transfer, matching `trackId`, FINAL-only acceptance and absence of R2/Track Manager writes.

Frozen rules remain:

- explicit Track-To-Market origin;
- returned `trackId` must match current Track;
- only `releaseStatus === final` is accepted;
- DRAFT returns rejected;
- no R2 write;
- no Track Manager mutation;
- returned FINAL remains transient React state.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

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

Phase 7-A imports none of these mutation APIs. Phase 7-B must preserve the same authority boundary.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A preserves schema v1 and resilient Deep Audio semantics. C3-B reads the same canonical sidecars and treats only finite 512D embeddings as map/similarity eligible.

## Phase 7 roadmap

### 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Build 46**

Read-only canonical production queue and deep-linked Next Actions.

### 7-B — Contextual continuation receipts

**NEXT / AUTHORIZED ROADMAP SLICE**

Specialist tools may report completion/result receipts. Studio must re-read canonical state after canonical writes instead of trusting optimistic local copies. Track-To-Market FINAL remains review-only. No generic write endpoint is introduced.

### 7-C — Guided end-to-end actions

**PLANNED / NOT STARTED**

Guarded resumable New Track → media → metadata → lyrics → analysis → release-readiness flow, using existing operation owners and explicit confirmations.

No generic all-powerful write route is planned.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

## Security / safety

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin Track write route;
- Track-To-Market uses explicit origin + FINAL/trackId gates;
- Phase 7-A is read-only;
- Phase 7-B receipts must trigger canonical rereads rather than create alternate state authority.

## Rollback anchors

```text
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/post-phase7-a-build46-real-user-pass-20260812-0923
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/post-build41-real-user-pass-20260811-1833
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI is necessary but not sufficient. Real-user smoke remains authoritative for user-facing milestone acceptance.

At this closeout boundary there are **no pending PHASE UX acceptance checks**. Phase 7-B becomes the next candidate line and will require its own CI, deployment and real-user smoke.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.