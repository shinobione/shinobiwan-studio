# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after the real-user Track-To-Market Bridge smoke, Track-To-Market V0.2.0 corrective and Studio Build 47 implementation candidate.

This is the concise authoritative current roadmap. Historical detail remains in milestone docs/changelogs and Git history.

## Frozen architecture roles

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant; no canonical write authority.
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

Canonical Lyrics remains:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

## PHASE UX / C3 retained status

### C2.5-A → F
**COMPLETE — REAL USER VALIDATED**

Canonical Albums, migration/public cutover, guarded Track Manager Album writes and virtual Singles semantics remain frozen and protected.

### C3-A — Deep Audio resilience
**COMPLETE — REAL USER PASS**

SonicTrace Build 06 / Deep Audio 2.0.1-alpha produced a truthful FULL profile with mastering, Neural, finite 512D embedding, structure and semantic summary.

Checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.

### C3-B — Studio V2-E parity
**COMPLETE — REAL USER PASS**

Canonical read-only map/similarity/project intelligence validated, including explicit analyzed-vs-mappable truthfulness.

Checkpoint: `safety/post-c3-b-real-user-pass-20260811-1958`.

### C3-C — Premium interaction / LaunchPAD corrective line
**FINAL VISUAL CARD REAL-USER SMOKE PENDING**

LaunchPAD Build 102 remains the final current Visual Card candidate. Earlier interaction/player/mobile corrections remain preserved.

## Track-To-Market integration history

### Build 45 / TTM v0.1.5 — Bridge V2
**REAL-USER SMOKE EXECUTED — CORRECTIVES FOUND**

The smoke validated:

- standalone opening from canonical Track Workspace;
- ready/input Bridge handshake;
- canonical lyrics transfer by `postMessage`;
- matching `trackId` gate;
- FINAL-only return;
- transient Studio review state.

The same smoke exposed two product problems:

1. manually uploaded SHINOBIWAN logo was not explicitly required as a reference asset in the external premium-provider handoff;
2. imported premium artwork received an unwanted generic title overlay in TTM.

Therefore Build 45/TTM v0.1.5 is **not** labeled final real-user pass.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

### Track-To-Market v0.2.0 — Release Orchestrator / Bridge V3
**IMPLEMENTED + DEPLOYED — REAL-USER CORRECTIVE SMOKE PENDING**

New product contract:

```text
Studio context
  → TTM creative/provider handoff
  → premium provider + explicit logo reference
  → FINAL import preserved by default
  → optional branding / formats / teaser / release copy / ZIP
  → Bridge V3 actual cover preview + provenance
  → Studio staging/review
```

Key changes:

- `Integrated` premium artwork strategy is default;
- uploaded logo handoff explicitly requires attaching the exact logo file in Flow / ChatGPT / Gemini;
- `Clean` artwork strategy remains optional;
- premium import defaults to `Original FINAL` with no automatic overlay;
- optional `Logo only` / `Editorial` treatments are explicit and reversible;
- format adaptation uses safe-fit preservation;
- ZIP includes provider handoff, logo reference, original source when relevant and V0.2 provenance;
- Bridge V3 protocol `0.2.0` returns actual selected FINAL artwork preview + strategy/branding provenance;
- Local AI and Cloudflare remain DRAFT-only.

TTM rollback anchor:

`safety/pre-v0.2-release-orchestrator-20260812`

## Phase 7 — End-to-end workflow

Status: **AUTHORIZED — PHASE 7-A ACTIVE**

Authorization was explicitly given by the user on 2026-08-12.

Pre-Phase-7 safety anchor:

`safety/pre-phase7-authorized-post-build45-20260812-0232`

### Phase 7-A — Workflow Overview
**Studio v0.16.0 · Build 46 IMPLEMENTED CANDIDATE**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Build 46:

- reads the existing canonical catalog service;
- derives `ready / attention / blocked` per stage;
- exposes catalog workflow KPIs/filters;
- provides exactly one prioritized Next Action per track;
- deep-links into existing guarded Track Workspace sections;
- imports no mutation APIs;
- performs no automatic publishing, Album mutation, SonicTrace save, Lyrics save or R2 write.

Real-user behavior acceptance remains pending.

See `docs/PHASE-7-A-WORKFLOW-BUILD46.md` and `CHANGELOG-PHASE7-BUILD46.md`.

### Phase 7-A corrective — TTM V3 staged review
**Studio v0.16.1 · Build 47 IMPLEMENTED CANDIDATE**

Build 47 consumes Track-To-Market V0.2.0 and turns Release Pack into a meaningful staged-review surface:

- sends Bridge protocol `0.2.0`;
- defaults sessions to `artworkStrategy=integrated`;
- accepts a compressed FINAL cover preview only after origin / exact child Window / matching trackId / FINAL gates;
- validates preview type and caps size at 2.5 MB;
- displays actual cover + provider/model + artwork strategy + branding treatment + release copy;
- keeps all returned state transient in browser memory;
- imports no R2/Track Manager mutation path.

Rollback anchor:

`safety/pre-build47-ttm-v3-preview-20260812`

See `docs/PHASE-7-A-TTM-V3-BUILD47.md` and `CHANGELOG-PHASE7-BUILD47.md`.

### Phase 7-B — Contextual continuation receipts
**PLANNED AFTER 7-A SMOKE**

Planned boundary:

- specialist tools may return explicit completion/result receipts;
- Studio must re-read canonical state after specialist actions;
- optimistic local state never becomes authority;
- no generic write endpoint.

A Track-To-Market canonical persistence/apply action is **not** authorized by Build 47. If added later, it must be an explicit guarded Studio → Track Manager operation followed by canonical reread.

### Phase 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Only after 7-A/7-B validation:

- resumable New Track → media → metadata → lyrics → analysis → release readiness;
- operation-specific confirmations before protected writes;
- canonical reread after each write;
- no silent Album/order/publish mutation.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health
Global actionable catalog health using the mature Phase 7 production-state model.

### Phase 9 — Security / reliability / PWA
Access/CORS hardening, timeouts/retries, anti-loss behavior, degraded/offline UX and PWA resilience.

### Phase 10 — Progressive extraction
Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is no official Phase 11.

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

Current candidates / pending acceptance:
LaunchPAD       2026.08.12.102        Visual Card smoke pending
Studio          0.16.0 / Build 46     Phase 7-A Workflow behavior pending
Studio          0.16.1 / Build 47     TTM V3 corrective staging smoke pending
Track-To-Market 0.2.0                 Release Orchestrator / Bridge V3 deployed
```

## Verification policy

CI is necessary but never upgrades subjective user acceptance by itself. Production data must not be mutated merely to manufacture a frontend smoke test.
