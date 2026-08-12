# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after PHASE UX final closeout and implementation of Studio Phase 7-B Build 47 candidate.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release-pack ideation/finalization assistant; not canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub `main`** — application-code authority.
- Canonical `trackId` is the R2 track slug everywhere.

## Completed phases

- Phase 0 — Architecture/data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC integration ✅ REAL USER PASS
- PHASE UX / C2.5 + C3 ✅ REAL USER PASS

Final PHASE UX closeout: `docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`.

Accepted LaunchPAD baseline: `2026.08.12.102`.

Accepted bounded Track-To-Market integration: Studio `v0.15.1 · Build 45`, Bridge V2 REAL USER PASS.

Canonical Lyrics remains:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

## Phase 7 — End-to-end workflow

Status: **AUTHORIZED — 7-A COMPLETE / 7-B CURRENT CANDIDATE**

### Phase 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Build 46 provides a truthful read-only production queue, readiness stages and one deterministic Next Action per Track, deep-linked to existing guarded Track Workspace sections.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-B — Contextual continuation receipts

**IMPLEMENTED CANDIDATE · Studio v0.17.0 · Build 47**

Codename: `phase7-b-contextual-receipts`.

Goal: after Studio sends the user into a specialist surface, make the return path explicit without turning child/local UI state into authority.

Build 47 contract:

```text
specialist completion
      ↓
typed receipt(trackId + source + operation + effect)
      ↓
canonical write? ── yes ──> Studio private reread ──> verified / error
      │
      no
      ↓
review-only receipt
```

Implemented receipt sources:

- **LRC Maker embedded** — `lyrics-saved` → canonical-write receipt;
- **LRC Maker standalone** — allowlisted `shinobiwan:lyrics-saved:v1` → canonical-write receipt;
- **SonicTrace** — `analysis-saved` → canonical-write receipt;
- **Track-To-Market** — matching FINAL → review-only receipt.

Hard rules:

- receipt `trackId` must match the current canonical Track;
- mismatched receipts are ignored;
- canonical-write receipts require `getCatalogTrack(trackId)` reread;
- verification requires Track Manager `readSource === private`;
- public fallback can never manufacture a green canonical-write verification;
- stale async verification cannot overwrite a newer receipt;
- Track-To-Market FINAL stays transient/review-only and creates no R2/Track Manager write;
- no generic write endpoint is added;
- existing specialist/write authorities stay unchanged.

Pre-Build-47 safety anchor:

` safety/pre-phase7-b-build47-20260812-0948 `

Implementation detail: `docs/PHASE-7-B-RECEIPTS-BUILD47.md`.

Real-user smoke: `docs/PHASE-7-B-SMOKE-CHECKLIST.md`.

Build 47 remains a candidate until user smoke passes.

### Phase 7-C — Guided end-to-end actions

**PLANNED / NOT STARTED**

Only after 7-B REAL USER PASS:

- guided New Track → media → metadata → lyrics → analysis → release readiness;
- resume/recovery after interrupted steps;
- operation-specific confirmation before protected writes;
- canonical reread after every write;
- no silent Album/order/publish mutation.

Phase 7 means orchestration, not centralization.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Actionable catalog health built on the accepted Phase 7 production-state model.

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss saves, degraded/offline behavior and PWA cache/update robustness.

### Phase 10 — Progressive extraction of shared engines

Only after behavior is mature:

- LRC Maker → `lrc-engine`;
- SonicTrace → `sonictrace-engine`;
- Track Manager → `catalog-api`;
- Studio remains orchestrator.

There is no official Phase 11.

## Current accepted baseline / candidate

```text
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          0.15.1 / Build 45     Track-To-Market Bridge V2 REAL USER PASS
Studio          0.16.0 / Build 46     Phase 7-A REAL USER PASS
Studio          0.17.0 / Build 47     Phase 7-B CANDIDATE
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
Track-To-Market 0.1.5
```

Automation/CI never upgrades a real-user acceptance label by itself.