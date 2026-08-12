# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after PHASE UX final real-user closeout, Track-To-Market Build 45 PASS and Studio Phase 7-A Build 46 PASS.

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

Status: **COMPLETE — REAL USER VALIDATED**

Final closeout: `docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`.

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

### C3-A — Deep Audio resilience
Status: **COMPLETE — REAL USER PASS**

SonicTrace `V2-E · BUILD 06` / Deep Audio `2.0.1-alpha` + Studio semantics are validated. A real canonical **Stick to You** scan returned a truthful FULL profile with mastering, Neural, finite 512D embedding, structure and semantic summary.

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

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium interaction / LaunchPAD corrective line
Status: **COMPLETE — REAL USER PASS**

LaunchPAD Builds 91–102 were corrected against real-user feedback. Accepted baseline: `2026.08.12.102`.

Validated final line includes:

- visible restrained glow;
- smooth stable route transitions;
- Lyrics auto-scroll/layout;
- mobile Home/Albums/Lyrics cleanup;
- mobile responsiveness/menu ownership hardening;
- stall-aware player state;
- locked application pinch zoom;
- clean bottom/sidebar player chrome;
- deterministic Visual Card Share/Download/Copy feedback and behavior.

Checkpoint: `safety/post-c3-c-build102-real-user-pass-20260812-0923`.

### C3 bounded integration — Track-To-Market Bridge V2
Status: **COMPLETE — REAL USER PASS**

Studio `v0.15.1 · Build 45` Release Pack is validated end to end:

- canonical bootstrap to Track-To-Market v0.1.5;
- richer context and canonical lyrics via allowlisted `postMessage` after Bridge V2 ready;
- returned `trackId` must match current track;
- only `releaseStatus === final` is accepted;
- DRAFT returns remain rejected;
- returned FINAL pack remains transient review state;
- no R2 write / Track Manager mutation.

See `docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

## Phase 7 — End-to-end workflow
Status: **AUTHORIZED — 7-A COMPLETE / 7-B NEXT**

Authorization: explicit user instruction on 2026-08-12 to begin Phase 7 with README/.MD/rollback documentation and preservation of product authorities.

### Phase 7-A — Workflow Overview / production queue
Status: **COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Build 46:

- reads existing canonical `StudioTrack` state through the established catalog service;
- derives per-stage `ready / attention / blocked` state;
- exposes catalog KPIs and filtered Needs Attention / Blocked / Draft / Ready queues;
- gives exactly one prioritized Next Action per track;
- every Next Action deep-links to the existing guarded Track Workspace section;
- no mutation API is imported by the Phase 7 view/model;
- no automatic publishing, Album reorder, SonicTrace save, Lyrics save or R2 write;
- public fallback remains read-only and visibly labeled;
- Track-To-Market Build 45 is inherited unchanged.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-B — Contextual continuation receipts
Status: **NEXT / AUTHORIZED FOR IMPLEMENTATION**

Required boundary:

- specialist surfaces can emit explicit completion/result receipts for the current Track;
- receipts are scoped by canonical `trackId` and known source/operation;
- after a canonical specialist write, Studio re-reads canonical state before showing completion;
- Studio does not trust optimistic child/local state as authority;
- mismatched/stale receipts are ignored;
- Track-To-Market FINAL can surface as a review-only receipt but still creates no canonical persistence;
- no new generic write endpoint;
- no new R2 write path;
- existing operation-specific owners remain unchanged.

Expected first Build: **Build 47** after a new pre-7-B safety branch.

### Phase 7-C — Guided end-to-end actions
Status: **PLANNED / NOT STARTED**

Only after 7-B validation:

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

## Current accepted baseline

```text
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          0.15.1 / Build 45     Track-To-Market Bridge V2 REAL USER PASS
Studio          0.16.0 / Build 46     Phase 7-A REAL USER PASS
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
Track-To-Market 0.1.5
```

Next candidate line: **Studio Phase 7-B / Build 47**.

Automation/CI never upgrades a real-user acceptance label by itself.