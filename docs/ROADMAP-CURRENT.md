# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 for **Studio v0.17.0 · Build 50 — Phase 7-B contextual continuation receipts candidate**. Build 50 is implemented and must remain labeled **REAL USER SMOKE PENDING** until browser validation.

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

Real-user review established the deeper conclusion that the useful orchestration belongs naturally inside Track Workspace rather than in another permanent standalone handoff layer.

Therefore:

- do not delete TTM standalone yet;
- keep it as rollback/reference during native validation;
- stop expanding it as the primary path;
- keep the useful release-campaign behavior native to Studio.

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

Build 48 established:

1. canonical Track context inside Release Pack;
2. editable premium MASTER 16:9 provider handoff;
3. SHINOBIWAN logo reference workflow;
4. faithful 16:9 MASTER import;
5. explicit anchored handoffs for 1:1 and 9:16 using the MASTER as required reference image;
6. independent derivative import/replace;
7. three-format campaign review;
8. browser-local IndexedDB persistence;
9. release copy / tags / provenance;
10. non-canonical ZIP export.

Its real-user smoke exposed the missing first-class ability to abandon the current creative idea and generate a genuinely different MASTER concept from scratch while preserving accepted visual outputs.

### Build 49 — MASTER concept reroll corrective

Release: **Studio v0.16.3 · Build 49**.

Build 49 is the native Release Campaign baseline inherited by Build 50. It adds:

- first-class `New MASTER concept` action;
- canonical Track context + current provider/logo state retained during reroll;
- explicit reset of the previous MASTER prompt/composition/scene/visual metaphor;
- deliberately distinct concept families;
- exact title/branding requirements preserved;
- currently imported MASTER/1:1/9:16 preserved during exploration;
- only an explicit new MASTER import invalidates derivative slots;
- persisted browser-local `masterConceptIndex`;
- direct `Open Google Flow ↗` shortcut;
- Flow opens in a separate safe tab without losing Studio draft/imported campaign state;
- no R2/Track Manager write path.

Rollback anchor:

`safety/pre-build49-master-concept-reroll-20260812`

### Native Release Campaign UX principles

- no external TTM popup in the primary path;
- no bridge required for normal Release Campaign work;
- imported premium art is preserved by default;
- no automatic generic title/logo overlay;
- provider handoffs explicitly identify required reference images;
- direct provider shortcuts do not mutate Studio state;
- variant actions remain locked until a valid 16:9 MASTER exists;
- aspect/dimension checks remain truthful;
- browser-local drafts never masquerade as canonical R2 state;
- canonical cover remains untouched;
- prompt exploration remains non-destructive until explicit MASTER replacement.

### Provider strategy

Premium FINAL quality remains external-provider-first:

1. Google Flow / Gemini / ChatGPT Images — FINAL-quality handoff;
2. local ComfyUI / SD3.5 — DRAFT exploration unless quality materially improves;
3. Cloudflare FLUX — DRAFT/fallback.

Studio orchestrates campaign context/coherence; it does not pretend weaker generators are release-ready.

### Standalone TTM deprecation gate

TTM standalone may be marked deprecated only after real-user proof of the full native path, including:

- MASTER prompt/handoff;
- non-destructive from-scratch concept reroll;
- direct Flow shortcut without draft loss;
- logo reference;
- faithful 16:9 MASTER import;
- anchored 1:1 generation/import;
- anchored 9:16 generation/import;
- coherent three-format review;
- export;
- no canonical writes/regressions.

Until then, TTM remains rollback/reference.

## Phase 7 — End-to-end workflow

Status: **7-A COMPLETE / NATIVE RELEASE CAMPAIGN INHERITED / 7-B BUILD 50 CANDIDATE / 7-C CLOSED**

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

Status: **IMPLEMENTED IN Studio v0.17.0 · Build 50 / CI CANDIDATE — REAL USER SMOKE REQUIRED**

Build 50 contract:

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Rules:

- receipt must match the exact canonical Track Workspace `trackId`;
- source/operation/effect combination must be allowlisted;
- mismatched receipts are ignored;
- canonical-write receipts enter verification instead of optimistic success;
- Studio rereads through the existing Track catalog read layer;
- returned trackId must match;
- reread must be private; public fallback can never verify a canonical write;
- Lyrics verification requires canonical `lyrics.txt` evidence;
- SonicTrace verification requires persisted Audio Intelligence evidence;
- only after private evidence may Studio display `Canonical reread verified`;
- stale async rereads cannot overwrite newer receipts/Track contexts;
- Release Campaign remains review-only and keeps `canonicalWrite: false`;
- no generic write endpoint;
- no new R2 authority;
- existing operation owners remain unchanged;
- Workflow 7-A and Builds 48/49 native Release Campaign are preserved.

Build 50 pre-change checkpoint:

`safety/pre-phase7-b-build50-20260812-1826`

Detailed contract:

`docs/PHASE-7-B-BUILD50-CONTEXTUAL-RECEIPTS.md`

Changelog:

`CHANGELOG-PHASE7-BUILD50.md`

Acceptance boundary:

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

The candidate becomes REAL USER PASS only after the user confirms the browser receipt flow on the deployed build.

### Phase 7-C — Guided end-to-end actions

Status: **PLANNED / NOT STARTED / EXPLICITLY CLOSED**

Only after Phase 7-B real-user validation and an explicit new authorization.

## Release Campaign follow-ups after Build 49

These remain recorded:

- **Motion variant:** optional provider handoff for an 8s loop anchored to selected MASTER artwork; fixed title/logo and clean loop seam required.
- **Provider provenance:** record the user-selected provider/model rather than guessing from import.
- **Variant replacement:** each format can be replaced independently without invalidating MASTER.
- **Campaign completeness:** 16:9 + 1:1 + 9:16 required for a complete visual campaign; motion optional unless later marked required.
- **Future guarded persistence:** only Studio → existing Track Manager operation-specific authority may eventually persist accepted campaign assets; Studio must reread canonical state afterward.
- **Local AI lab:** experimentation only; no pressure to make it the premium path.

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

Current Phase 7 line:
Track-To-Market 0.2.0                 standalone reference/rollback
Studio          0.16.1 / Build 47     staged-preview historical proof
Studio          0.16.2 / Build 48     native Release Campaign · partial smoke pass
Studio          0.16.3 / Build 49     native campaign reroll + Flow baseline
Studio          0.17.0 / Build 50     contextual receipts candidate · smoke pending
```

Rollback anchors:

```text
safety/pre-phase7-b-build50-20260812-1826
safety/pre-build49-master-concept-reroll-20260812
safety/pre-build48-native-release-campaign-20260812-1707
```

## Verification policy

CI never upgrades real-user acceptance labels by itself.

Build 50 must first pass exact-head CI and normal Pages publication. Then user smoke must prove:

1. Release Campaign export returns a **review-only** receipt and never canonical VERIFIED;
2. an existing protected Lyrics or SonicTrace write returns a canonical-write receipt;
3. Studio shows verifying while performing the private canonical reread;
4. `Canonical reread verified` appears only after the reread/evidence succeeds;
5. receipt remains scoped to the correct canonical trackId;
6. Workflow 7-A and the native Release Campaign remain operational;
7. no new canonical write authority appears.

Do not mutate production media/Albums merely to manufacture a smoke. Do not start Phase 7-C before explicit post-7-B authorization.
