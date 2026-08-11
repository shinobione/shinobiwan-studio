# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-11 after PHASE UX C2.5 real-user closeout.

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
Status: **NEXT — NOT STARTED**

Scope to address carefully:

- robust FFmpeg `loudnorm` measurement handling;
- accurate distinction between backend offline vs mastering/deep-analysis failure;
- full Studio ↔ SonicTrace V2-E parity;
- preserve Browser DSP fallback while avoiding misleading FULL/PARTIAL semantics;
- preserve GPU cluster behavior and existing Catalog Intelligence persistence;
- evaluate Album/Project intelligence only where it respects canonical Album authority;
- no R2/schema churn unless explicitly required and reviewed.

After C3:

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

## Current runtime baseline

```text
Studio          0.12.2 / Build 37
LaunchPAD       2026.08.11.89
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 05
LRC Maker       6.3.8
```

Documentation-only closeouts do not bump runtime versions.