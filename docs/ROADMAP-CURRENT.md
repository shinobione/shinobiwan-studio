# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-11 after C2.5 closeout and C3-A implementation start.

This file is the concise current roadmap. Historical release details remain in the milestone-specific documents and Git history.

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

### Phase 0 — Architecture freeze / data contracts
Status: **COMPLETE**

### Phase 1 — Studio shell
Status: **COMPLETE**

### Phase 2 — Unified catalog read
Status: **COMPLETE**

### Phase 3 — Track Workspace
Status: **COMPLETE**

### Phase 4 — Track Manager integration
Status: **COMPLETE**

### Phase 5 — SonicTrace / Catalog Intelligence
Status: **COMPLETE**

Canonical analysis persistence, 512D embeddings, history/freshness, review-before-save and Catalog Intelligence are operational.

### Phase 6 — Lyrics / LRC integration
Status: **COMPLETE — REAL USER VALIDATED**

Canonical contract remains:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

## PHASE UX

PHASE UX is a post-Phase-6 product-quality project and is **not Phase 7**.

### C2.5-A — Albums scalability + frontend/mobile/player polish
Status: **COMPLETE — REAL USER PASS**

LaunchPAD Build 87 remains the sanctuarized touch/player baseline inherited by later builds.

### C2.5-B — Canonical Album read model
Status: **COMPLETE**

Canonical R2 Album schema and projection contract established.

### C2.5-C — Guarded canonical Album writes
Status: **COMPLETE**

Protected Track Manager Album create/edit/membership/order/assets with stale guards and rollback.

### C2.5-D — Studio Album Management + New Track binding
Status: **COMPLETE — REAL USER VALIDATED**

Unknown requested Albums block Review; canonical draft creation is explicit; Singles is safe fallback.

### C2.5-E — Controlled legacy Album migration
Status: **COMPLETE**

Three legacy Albums migrated to canonical R2; Singles transitioned to virtual collection semantics.

### C2.5-F — LaunchPAD canonical Album cutover
Status: **COMPLETE — REAL USER PASS DESKTOP + MOBILE**

LaunchPAD Build 89 + public Worker v2.7 consume canonical R2 Albums. Public authority currently exposes three canonical Albums and virtual Singles.

See `docs/PHASE-UX-C2-5-CLOSEOUT.md`.

### C3 — SonicTrace Deep Audio / V2-E parity
Status: **IN PROGRESS**

#### C3-A — Deep Audio resilience + truthful profile semantics
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Candidate releases:

- SonicTrace `V2-E · BUILD 06` / Deep Audio `2.0.1-alpha`;
- Studio `v0.13.0 · Build 38`.

Scope:

- robust FFmpeg `loudnorm` measurement parsing;
- real FFmpeg EBU R128 fallback;
- unavailable mastering measurements become warnings instead of aborting Neural / embedding / structure;
- accurate `FULL / PARTIAL / UNAVAILABLE / OUTDATED` profile semantics;
- distinguish coordinator transport/offline failures from coordinator processing failures;
- null mastering values render as missing, never as numeric zero;
- schema v1, Track Manager persistence and R2 paths unchanged.

Acceptance requires a real canonical Studio scan after the local SonicTrace coordinator is updated/restarted. Prefer a track that previously triggered the loudnorm measurement-block failure.

#### C3-B — Studio V2-E parity
Status: **NOT STARTED**

Planned read-only intelligence parity after C3-A smoke:

- deterministic 2D projection from canonical persisted 512D embeddings;
- acoustic zones separate from sonic/style families;
- redundant pairs, outliers and bridges;
- canonical Album/Project intelligence using Album `trackIds` + canonical SonicTrace sidecars;
- advisory coherence / bridge / proposed sequence only; never silently rewrite artistic Album order;
- standalone SonicTrace IndexedDB remains local standalone memory, not Studio/R2 authority.

After C3-B:

- final PHASE UX cross-app real-user smoke;
- documentation reconciliation;
- final PHASE UX safety checkpoint;
- explicit user decision on whether to authorize Phase 7.

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
Last real-user baseline:
Studio          0.12.2 / Build 37
LaunchPAD       2026.08.11.89
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 05
LRC Maker       6.3.8

C3-A candidate:
Studio          0.13.0 / Build 38
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
```

C3-A is not accepted until real-user local-GPU validation passes. Documentation-only closeouts do not fabricate runtime versions.
