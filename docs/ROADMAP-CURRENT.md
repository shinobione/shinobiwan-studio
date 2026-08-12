# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after Build 48 real-user smoke exposed the missing from-scratch MASTER concept reroll; Build 49 corrective is now the active candidate.

Historical release detail remains in milestone docs and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — frozen reference/rollback implementation during native migration; no longer the intended primary UX after native Studio validation.
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

## Track-To-Market history and migration decision

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

### TTM v0.2.0 / Studio Build 47 — useful corrective, insufficient product boundary

The V0.2 corrective solved two real issues:

- uploaded SHINOBIWAN logo became an explicit provider reference asset;
- imported FINAL artwork stopped receiving an unwanted generic title overlay.

Build 47 also proved that Studio can receive the actual selected FINAL artwork and provenance safely.

Real-user review then established a deeper conclusion:

> the standalone tool still behaves mostly as a prompt handoff + import + ZIP intermediary, while the useful orchestration belongs naturally inside the Track Workspace.

Therefore the product direction changes:

- **do not delete TTM standalone yet**;
- keep it as a rollback/reference implementation until native Studio validation;
- stop expanding standalone UX as the primary path;
- absorb the useful release-campaign behavior into Studio.

## Native Release Campaign — user-authorized priority pivot

### Core visual contract

The visual campaign is a **MASTER + anchored derivatives** system.

```text
Canonical Track context
        ↓
Premium handoff / provider generation
        ↓
MASTER FINAL 16:9 selected
        ├── 1:1 generated from MASTER 16:9 as reference
        └── 9:16 generated from MASTER 16:9 as reference
```

**Important:** 9:16 is not derived from 1:1. Both derivatives are independently anchored to the validated 16:9 MASTER to avoid cumulative visual drift.

This mirrors the proven manual Flow workflow:

- take the accepted 16:9;
- attach it as the image reference;
- prompt `coherent 1:1 version`;
- repeat from the same 16:9 MASTER for `coherent 9:16 version`.

### Build 48 — Native Release Campaign workspace

Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PARTIAL PASS / CORRECTIVE FOUND**

Release: **Studio v0.16.2 · Build 48**.

Build 48 successfully proved the native Studio path for:

1. canonical track context inside Release Pack;
2. editable premium MASTER 16:9 provider handoff;
3. SHINOBIWAN logo reference workflow;
4. faithful 16:9 MASTER import;
5. explicit anchored handoffs for 1:1 and 9:16 using the MASTER as required reference image;
6. independent derivative import/replace;
7. three-format campaign review;
8. browser-local IndexedDB persistence;
9. release copy / tags / provenance;
10. non-canonical ZIP export.

Real-user smoke then exposed one missing exploration control: once a MASTER prompt exists, editing it is possible, but there is no explicit way to **throw away the current creative idea and generate a genuinely different MASTER concept from scratch** while preserving accepted artwork until the user chooses to replace it.

### Build 49 — MASTER concept reroll corrective

Status: **ACTIVE CANDIDATE — REAL USER SMOKE REQUIRED**

Release target: **Studio v0.16.3 · Build 49**.

Build 49 adds a first-class `New MASTER concept` action with the following contract:

- starts from canonical track context, current provider and current logo state;
- explicitly ignores the previous MASTER prompt/composition/scene/visual metaphor;
- rotates across deliberately distinct concept families rather than merely rewording the same brief;
- keeps exact title/branding requirements;
- preserves the currently imported MASTER, 1:1 and 9:16 while the new idea is explored;
- only replacing/importing a new MASTER invalidates derivative outputs, as before;
- persists the concept index in the browser-local draft so refresh does not silently revert the exploration state;
- remains non-canonical: no R2/Track Manager write path is added.

Rollback anchor:

`safety/pre-build49-master-concept-reroll-20260812`

### Native Release Campaign UX principles

- no external TTM popup in the primary path;
- no bridge required for normal Release Campaign work;
- imported premium art is always preserved by default;
- no generic title/logo overlay added automatically;
- provider handoffs explicitly tell the user which image(s) to attach as references;
- variant buttons stay disabled until a valid 16:9 MASTER exists;
- dimension/aspect checks are visible and truthful;
- browser-local draft persistence may be used but must never masquerade as canonical R2 state;
- current canonical cover remains untouched;
- prompt exploration must be non-destructive until the user explicitly imports/replaces a MASTER.

### Provider strategy

Premium FINAL quality remains external-provider-first for now:

1. Google Flow / Gemini / ChatGPT Images — FINAL quality handoff;
2. local ComfyUI / SD3.5 — DRAFT exploration only unless quality materially improves;
3. Cloudflare FLUX — DRAFT/fallback only.

The purpose of Studio is orchestration and campaign coherence, not pretending the weaker providers are release-ready.

### Standalone TTM deprecation gate

TTM standalone may be marked deprecated only after a real-user smoke proves all of:

- MASTER prompt/handoff usable directly from Studio;
- **from-scratch MASTER concept reroll works and is non-destructive**;
- logo reference workflow works;
- 16:9 MASTER import is faithful;
- anchored 1:1 generation/import works;
- anchored 9:16 generation/import works;
- campaign review clearly shows all three coherent assets;
- export works;
- no canonical writes/regressions occur.

Until then, TTM remains available as rollback/reference.

## Phase 7 — End-to-end workflow

Status: **7-A COMPLETE / BUILD 49 RELEASE CAMPAIGN CORRECTIVE ACTIVE / 7-B DEFERRED TO BUILD 50+**

### Phase 7-A — Workflow Overview / production queue

Status: **COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Validated behavior remains read-only and unchanged.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-A corrective — TTM V3 staged review

Status: **Studio v0.16.1 · Build 47 IMPLEMENTED / PRODUCT LESSON ABSORBED INTO NATIVE RELEASE CAMPAIGN**

Build 47 remains valuable as proof of FINAL preview/provenance transport and safety gates, but its standalone UX is superseded by the native integration decision.

Rollback: `safety/pre-build47-ttm-v3-preview-20260812`.

### Phase 7-B — Contextual continuation receipts

Status: **AUTHORIZED / DEFERRED UNTIL NATIVE RELEASE CAMPAIGN REAL-USER ACCEPTANCE**

Build 48 was reserved for native Release Campaign integration; Build 49 is now reserved for the concept-reroll corrective found during its smoke. Phase 7-B therefore moves to **Build 50 or later** without losing its contract:

- specialist receipts scoped by canonical `trackId` + source/operation;
- canonical reread after canonical writes;
- optimistic child/local state never authoritative;
- stale/mismatched receipts ignored;
- no generic write endpoint;
- existing operation owners unchanged.

### Phase 7-C — Guided end-to-end actions

Status: **PLANNED / NOT STARTED**

Only after 7-B validation.

## Release Campaign follow-ups after Build 49

These remain recorded so they are not lost:

- **Motion variant:** optional provider handoff for an 8s loop anchored to the selected MASTER artwork; title/logo stability and loop seam are explicit requirements.
- **Provider provenance:** record user-selected provider/model instead of guessing from import.
- **Variant replacement:** each format can be replaced independently without invalidating the MASTER.
- **Campaign completeness:** 16:9 is required; 1:1 and 9:16 are required for a complete visual campaign; motion is optional unless the release workflow later marks it required.
- **Future guarded persistence:** only Studio → existing Track Manager operation-specific authority may eventually persist accepted campaign assets; Studio must reread canonical state afterward.
- **Local AI lab:** retained only as experimentation; no pressure to make it the premium path.

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

Current corrective / migration line:
Track-To-Market 0.2.0                 standalone reference/rollback during migration
Studio          0.16.1 / Build 47     staged-preview corrective
Studio          0.16.2 / Build 48     native Release Campaign · partial smoke pass
Studio          0.16.3 / Build 49     MASTER concept reroll candidate
```

Rollback anchors:

```text
safety/pre-build49-master-concept-reroll-20260812
safety/pre-build48-native-release-campaign-20260812-1707
```

## Verification policy

CI never upgrades real-user acceptance labels by itself. Native Release Campaign only becomes accepted after real-user proof of the complete MASTER exploration → selected 16:9 → anchored 1:1 + anchored 9:16 → review/export path, including non-destructive from-scratch MASTER concept rerolls.
