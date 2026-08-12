# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after explicit Phase 7 authorization, LaunchPAD Build 102 Visual Card candidate and Studio Phase 7-A Build 46 implementation candidate.

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

PHASE UX is post-Phase-6 product quality/integration work. The user explicitly authorized Phase 7 to begin on 2026-08-12 before the final subjective C3-C/Build 102 smoke, so the two acceptance lines are tracked separately instead of fabricating a retroactive PHASE UX pass.

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

See `docs/PHASE-UX-C2-5-CLOSEOUT.md`.

### C3-A — Deep Audio resilience
Status: **COMPLETE — REAL USER PASS**

SonicTrace `V2-E · BUILD 06` / Deep Audio `2.0.1-alpha` + Studio semantics are validated. A real canonical **Stick to You** scan returned a truthful FULL unsaved profile with mastering, Neural, finite 512D embedding, structure and semantic summary ready.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.

### C3-UX — Focused Albums + palette
Status: **COMPLETE — REAL USER PASS**

Studio Builds 39–40 + LaunchPAD Build 90 delivered the cover-first Album workspace, `Overview / Tracklist / Assets`, migration archive isolation, canonical Primary/Secondary palette controls and public Album palette consumption.

### C3 operational hotfix — New Track capability compatibility
Status: **COMPLETE — REAL USER PASS**

Build 41 preserved operation-specific capabilities while accepting additive Track Manager capabilities. Real-user retry passed with **Stick to You**.

Checkpoint: `safety/post-build41-real-user-pass-20260811-1833`.

### C3-B — Studio V2-E parity
Status: **COMPLETE — REAL USER PASS**

Studio Builds 42–43 delivered canonical read-only Catalog Intelligence:

- deterministic 2D projection from finite 512D CLAP embeddings;
- acoustic zones separate from Neural genre-derived families;
- nearest-neighbor similarity;
- redundant pairs, outliers and cross-zone bridges;
- canonical Album/Project embedding coverage/coherence;
- read-only advisory sequence;
- explicit unmapped-track truthfulness.

Final smoke mapped four finite embeddings from five analyzed tracks and correctly identified `SINGULARITY :: OBLITERANT` as missing a usable 512D embedding.

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium interaction / LaunchPAD corrective line
Status: **FINAL REAL-USER VISUAL CARD SMOKE PENDING**

Studio Build 44 established the premium interaction tokens. LaunchPAD then went through a real-user corrective line from Build 91 through Build 102 rather than accepting the first implementation by CI alone.

Validated/observed milestones include:

- glow tuning accepted after Builds 92–93;
- route transition/layout corrective through Build 95;
- Lyrics auto-scroll accepted in Build 96;
- mobile Albums/Home/Lyrics picker cleanup through Build 97;
- responsiveness/player state fixes through Builds 98–99;
- stable single-owner mobile menu, locked pinch zoom and clean player chrome through Builds 100–101;
- Build 101 sidebar player chrome explicitly accepted by the user;
- LaunchPAD Build 102 adds deterministic Visual Card Share/Download/Copy feedback.

Build 102 automated gates and Pages deployment are green. **Pending user check:** native Share/fallback, exactly one PNG download and visible Copy acknowledgement.

LaunchPAD rollback anchors:

```text
safety/pre-build102-visual-card-feedback-20260812-0220
safety/pre-phase7-authorized-20260812-0230
```

### C3 bounded integration — Track-To-Market Bridge V2
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Studio `v0.15.1 · Build 45` adds `Release Pack` to Track Workspace:

- short canonical bootstrap to Track-To-Market v0.1.5;
- richer context and canonical lyrics via allowlisted `postMessage` after Bridge V2 ready;
- returned `trackId` must match current track;
- only `releaseStatus === final` is accepted;
- returned FINAL pack remains transient review state;
- no R2 write / Track Manager mutation.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

### PHASE UX acceptance still to reconcile

When the user returns:

1. Build 102 Visual Card real-user smoke;
2. Build 45 Track-To-Market Bridge V2 real-user smoke;
3. cross-app sanity pass only if either smoke exposes a regression;
4. mark C3-C/TTME acceptance truthfully in README/docs;
5. create a final PHASE UX historical checkpoint without changing the already-authorized Phase 7 boundary.

## Phase 7 — End-to-end workflow
Status: **AUTHORIZED — PHASE 7-A IMPLEMENTED CANDIDATE**

Authorization: explicit user instruction on 2026-08-12 to begin Phase 7 while they were away, with full README/.MD/rollback documentation.

Pre-Phase-7 safety anchor after Build 45:

` safety/pre-phase7-authorized-post-build45-20260812-0232 `

### Phase 7-A — Workflow Overview / production queue
Status: **Studio v0.16.0 · Build 46 IMPLEMENTED CANDIDATE**

Goal: expose one truthful end-to-end production queue without creating a second data authority.

Pipeline presented by Studio:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Build 46 rules:

- reads existing canonical `StudioTrack` state through the established catalog service;
- derives per-stage `ready / attention / blocked` state;
- exposes catalog KPIs and filtered Needs Attention / Blocked / Draft / Ready queues;
- gives exactly one prioritized Next Action per track;
- every Next Action deep-links to the existing guarded Track Workspace section;
- no mutation API is imported by the Phase 7 view/model;
- no automatic publishing, Album reorder, SonicTrace save, Lyrics save or R2 write;
- public fallback remains read-only and visibly labeled;
- Track-To-Market Build 45 is inherited untouched.

Real-user acceptance still required after deployment.

See `docs/PHASE-7-A-WORKFLOW-BUILD46.md` and `CHANGELOG-PHASE7-BUILD46.md`.

### Phase 7-B — Contextual continuation receipts
Status: **PLANNED AFTER 7-A SMOKE**

Planned boundary:

- specialist tools may return explicit completion/result receipts to Studio;
- Studio re-reads canonical state after a specialist action instead of trusting a local optimistic copy;
- Track-To-Market FINAL remains review-only until a separately authorized canonical persistence contract exists;
- no new generic write endpoint.

### Phase 7-C — Guided end-to-end actions
Status: **PLANNED / NOT STARTED**

Only after 7-A/7-B validation:

- guided New Track → media → metadata → lyrics → analysis → release readiness flow;
- resume/recovery after interrupted steps;
- operation-specific confirmation before protected writes;
- canonical reread after every write;
- no silent Album/order/publish mutation.

The Phase 7 goal is orchestration, not centralization: Studio coordinates existing authorities instead of replacing them.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Goal: Studio opens directly onto actionable catalog health. Phase 7-A intentionally builds the reusable production-state model that Phase 8 can later summarize, but it does not pre-implement Phase 8 activity/history/status features.

### Phase 9 — Security / reliability / PWA

Planned themes: Access/CORS hardening, timeouts/retries, anti-loss saves, degraded/offline behavior, PWA cache/update robustness and graceful local/Worker outages.

### Phase 10 — Progressive extraction of shared engines

Potential mature extractions only after behavior is stable:

- LRC Maker → reusable `lrc-engine`;
- SonicTrace → `sonictrace-engine`;
- Track Manager → `catalog-api`;
- Studio remains orchestrator.

There is currently **no official Phase 11**.

## Current runtime / candidate baseline

```text
Validated functional core:
Studio          0.14.1 / Build 43     C3-B real-user pass
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8

Current candidates:
LaunchPAD       2026.08.12.102        C3-C Visual Card final smoke pending
Studio          0.15.1 / Build 45     Track-To-Market bridge smoke pending
Studio          0.16.0 / Build 46     Phase 7-A workflow candidate
Track-To-Market 0.1.5                 Bridge V2 / FINAL gate
```

Automation/CI never upgrades a real-user acceptance label by itself.