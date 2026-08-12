# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after Studio Build 48 native Release Campaign merge/deployment; real-user smoke remains pending.

Historical release detail remains in milestone docs and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — frozen reference/rollback implementation during native migration; no longer the intended primary UX after Build 48 validation.
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

Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

Release: **Studio v0.16.2 · Build 48**.

Build 48 absorbs the useful TTM path directly into the existing `Release Pack` Track Workspace section:

1. read canonical track context already available in Studio;
2. prepare/edit the premium MASTER 16:9 provider handoff;
3. accept an optional SHINOBIWAN logo reference image;
4. import/select the premium 16:9 MASTER without altering it;
5. generate explicit anchored handoffs for 1:1 and 9:16 using the MASTER as the required reference image;
6. import and visually validate both returned derivatives;
7. show a single campaign review surface containing 16:9 / 1:1 / 9:16;
8. keep release copy / tags / provenance with the visual set;
9. export a self-contained release campaign pack;
10. remain non-canonical and browser-local until a later guarded persistence action is explicitly designed and authorized.

### Build 48 UX principles

- no external TTM popup in the primary path;
- no bridge required for normal Release Campaign work;
- imported premium art is always preserved by default;
- no generic title/logo overlay added automatically;
- provider handoffs explicitly tell the user which image(s) to attach as references;
- variant buttons stay disabled until a valid 16:9 MASTER exists;
- dimension/aspect checks are visible and truthful;
- browser-local draft persistence may be used but must never masquerade as canonical R2 state;
- current canonical cover remains untouched.

### Provider strategy

Premium FINAL quality remains external-provider-first for now:

1. Google Flow / Gemini / ChatGPT Images — FINAL quality handoff;
2. local ComfyUI / SD3.5 — DRAFT exploration only unless quality materially improves;
3. Cloudflare FLUX — DRAFT/fallback only.

The purpose of Studio is orchestration and campaign coherence, not pretending the weaker providers are release-ready.

### Standalone TTM deprecation gate

TTM standalone may be marked deprecated only after a real-user smoke proves all of:

- MASTER prompt/handoff usable directly from Studio;
- logo reference workflow works;
- 16:9 MASTER import is faithful;
- anchored 1:1 generation/import works;
- anchored 9:16 generation/import works;
- campaign review clearly shows all three coherent assets;
- export works;
- no canonical writes/regressions occur.

Until then, TTM remains available as rollback/reference.

## Phase 7 — End-to-end workflow

Status: **7-A COMPLETE / BUILD 48 NATIVE RELEASE CAMPAIGN DEPLOYED CANDIDATE / 7-B DEFERRED ONE SLOT**

### Phase 7-A — Workflow Overview / production queue

Status: **COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Validated behavior remains read-only and unchanged.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-A corrective — TTM V3 staged review

Status: **Studio v0.16.1 · Build 47 IMPLEMENTED / PRODUCT LESSON ABSORBED INTO BUILD 48**

Build 47 remains valuable as proof of FINAL preview/provenance transport and safety gates, but its standalone UX is superseded by the native integration decision.

Rollback: `safety/pre-build47-ttm-v3-preview-20260812`.

### Phase 7-B — Contextual continuation receipts

Status: **AUTHORIZED / DEFERRED TO FIRST AVAILABLE BUILD AFTER NATIVE RELEASE CAMPAIGN SMOKE**

Previously expected as Build 48; the explicit 2026-08-12 product pivot reserves Build 48 for native Release Campaign integration. Phase 7-B therefore moves to **Build 49 or later** without losing its contract:

- specialist receipts scoped by canonical `trackId` + source/operation;
- canonical reread after canonical writes;
- optimistic child/local state never authoritative;
- stale/mismatched receipts ignored;
- no generic write endpoint;
- existing operation owners unchanged.

### Phase 7-C — Guided end-to-end actions

Status: **PLANNED / NOT STARTED**

Only after 7-B validation.

## Release Campaign follow-ups after Build 48

These are intentionally recorded now so they are not lost:

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
Studio          0.16.2 / Build 48     DEPLOYED CANDIDATE · real-user smoke pending
```

Rollback anchor for Build 48:

`safety/pre-build48-native-release-campaign-20260812-1707`

## Verification policy

CI never upgrades real-user acceptance labels by itself. Native Release Campaign only becomes accepted after real-user proof of the complete MASTER → anchored 1:1 + anchored 9:16 → review/export path.
