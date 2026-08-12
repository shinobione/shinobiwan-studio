# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after PHASE UX final closeout, accepted Build 45/46 baselines, and the subsequent Track-To-Market V0.2 / Studio Build 47 product corrective.

Historical release detail remains in milestone docs and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant; not canonical write authority.
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
- Phase 6 — Lyrics / LRC ✅ REAL USER VALIDATED

## PHASE UX

Status: **COMPLETE — REAL USER VALIDATED**

Final closeout: `docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`.

Accepted milestones remain:

- C2.5-A → F ✅
- C3-A Deep Audio ✅ real-user pass
- C3-B Studio V2-E parity ✅ real-user pass
- C3-C LaunchPAD Build 102 ✅ real-user pass
- Track-To-Market Bridge V2 / Studio Build 45 ✅ real-user pass for transport/finality/no-write contract

Important distinction: the later V0.2 corrective does **not** revoke Build 45's validated bridge contract. It improves product behavior discovered after that pass.

## Track-To-Market — post-pass product corrective

### Accepted baseline — TTM v0.1.5 / Studio Build 45

Validated:

- canonical bootstrap;
- full context + canonical lyrics by allowlisted `postMessage`;
- exact matching `trackId`;
- FINAL-only return;
- DRAFT rejection;
- transient Studio review;
- no R2/Track Manager write.

See `docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`.

### Track-To-Market v0.2.0 — Release Orchestrator / Bridge V3

Status: **DEPLOYED — CORRECTIVE REAL-USER SMOKE PENDING**

A deeper product review after the accepted Build 45 flow identified:

1. uploaded SHINOBIWAN logo was not explicitly required as an external-provider reference asset;
2. premium imported artwork received an unwanted generic title overlay.

V0.2 corrective contract:

```text
Studio context
  → TTM provider handoff
  → premium provider + explicit logo reference
  → FINAL import preserved by default
  → optional branding / formats / teaser / release copy / ZIP
  → Bridge V3 preview + provenance
  → Studio staged review
```

Delivered:

- `Integrated` strategy default: premium provider composes exact title + supplied logo;
- explicit instruction to attach the uploaded logo file as a reference image in Flow / ChatGPT / Gemini;
- `Clean` artwork-only strategy optional;
- imported premium artwork defaults to `Original FINAL`, no automatic overlay;
- optional `Logo only` / `Editorial` treatments are explicit/reversible;
- safe-fit 1:1 / 9:16 adaptation;
- richer FINAL ZIP with provider handoff, logo reference, source/provenance;
- Bridge V3 protocol `0.2.0` returns actual selected FINAL artwork preview + strategy/branding provenance;
- Local AI / Cloudflare remain DRAFT-only;
- no canonical write authority added.

TTM rollback: `safety/pre-v0.2-release-orchestrator-20260812`.

## Phase 7 — End-to-end workflow

Status: **AUTHORIZED — 7-A COMPLETE / BUILD 47 CORRECTIVE ACTIVE / 7-B NEXT**

### Phase 7-A — Workflow Overview / production queue

Status: **COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Validated Build 46 behavior:

- canonical catalog read through the established service;
- per-stage `ready / attention / blocked` state;
- catalog Workflow KPIs/filters;
- exactly one prioritized Next Action per track;
- deep-links to existing guarded Track Workspace sections;
- no mutation API imports;
- no automatic publishing, Album reorder, SonicTrace save, Lyrics save or R2 write.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-A corrective — TTM V3 staged review

Status: **Studio v0.16.1 · Build 47 IMPLEMENTED CANDIDATE**

Build 47 consumes deployed TTM V0.2.0 and upgrades Release Pack review:

- sends Bridge protocol `0.2.0`;
- starts premium sessions with `artworkStrategy=integrated`;
- accepts compressed artwork preview only after expected-origin + exact-child-Window + matching-trackId + FINAL gates;
- validates `data:image/*` and caps preview at 2.5 MB;
- displays actual FINAL artwork beside provider/model/strategy/branding/release-copy provenance;
- stores returned data only in transient browser memory;
- imports no R2/Track Manager mutation path.

This slice is **Stage + review only** and does not begin the canonical receipt/write mechanics of 7-B.

Studio rollback: `safety/pre-build47-ttm-v3-preview-20260812`.

See:

- `docs/PHASE-7-A-TTM-V3-BUILD47.md`
- `CHANGELOG-PHASE7-BUILD47.md`

### Phase 7-B — Contextual continuation receipts

Status: **NEXT AFTER BUILD 47 CORRECTIVE SMOKE · FIRST AVAILABLE BUILD 48**

Required boundary:

- specialist surfaces may emit explicit completion/result receipts scoped by canonical `trackId` + source/operation;
- after any canonical specialist write, Studio re-reads canonical state before showing completion;
- optimistic child/local state is never authority;
- stale/mismatched receipts are ignored;
- TTM FINAL may surface as a review receipt but creates no persistence by itself;
- no generic write endpoint;
- existing operation owners remain unchanged.

### Phase 7-C — Guided end-to-end actions

Status: **PLANNED / NOT STARTED**

Only after 7-B validation:

- guided resumable New Track → media → metadata → lyrics → analysis → release readiness;
- explicit operation-specific confirmations;
- canonical reread after every write;
- no silent Album/order/publish mutation.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health
Global actionable catalog health built on the mature Phase 7 production-state model.

### Phase 9 — Security / reliability / PWA
Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX, PWA resilience.

### Phase 10 — Progressive extraction
Potential mature extraction of LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Current baseline

```text
Accepted:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          0.15.1 / Build 45     TTM Bridge V2 REAL USER PASS
Studio          0.16.0 / Build 46     Phase 7-A REAL USER PASS
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8

Corrective candidate:
Track-To-Market 0.2.0                 Release Orchestrator / Bridge V3 DEPLOYED
Studio          0.16.1 / Build 47     TTM V3 staged-preview smoke pending
```

Next planned candidate after corrective acceptance: **Phase 7-B / Build 48**.

## Verification policy

CI never upgrades real-user acceptance labels by itself. Accepted history remains accepted; each post-pass corrective receives its own CI/deployment/smoke gate.
