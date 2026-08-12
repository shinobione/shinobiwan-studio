# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current line

```text
Accepted baselines:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          v0.15.1 · Build 45    TTM Bridge V2 REAL USER PASS
Studio          v0.16.0 · Build 46    Phase 7-A REAL USER PASS

Current native Release Campaign line:
Studio          v0.16.1 · Build 47    staged-preview corrective / historical proof
Studio          v0.16.2 · Build 48    native Release Campaign · partial real-user smoke
Studio          v0.16.3 · Build 49    MASTER concept reroll + direct Flow shortcut candidate
Track-To-Market v0.2.0               standalone rollback/reference during migration

Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX remains COMPLETE — REAL USER VALIDATED. Phase 7-A Build 46 remains COMPLETE — REAL USER PASS.**

Build 48 moved the useful Track-To-Market release workflow directly into the Track Workspace. Build 49 is a bounded real-user corrective discovered during that native smoke: Studio can now request a genuinely new MASTER concept from scratch without destroying accepted visuals, and can open Google Flow directly from the MASTER handoff row.

See:

- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`CHANGELOG-PHASE7-BUILD49.md`](CHANGELOG-PHASE7-BUILD49.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — rollback/reference during native migration; no longer the intended primary release-campaign UX.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

**Phase 7 means orchestration, not centralization.**

## Native Release Campaign — Build 48 → Build 49

Studio route: Track Workspace → `Release Pack`.

Visual contract:

```text
Canonical track context
        ↓
Premium MASTER handoff
        ↓
MASTER 16:9 selected/imported
        ├── 1:1 generated from MASTER 16:9 reference
        └── 9:16 generated independently from the same MASTER 16:9 reference
```

The 1:1 and 9:16 are sibling derivatives. **9:16 is never derived from 1:1.** This mirrors the proven manual Google Flow workflow and avoids cumulative visual drift.

### Build 48 established

- native provider handoff inside Studio;
- optional authoritative SHINOBIWAN logo reference;
- faithful premium 16:9 MASTER import;
- anchored 1:1 and 9:16 handoffs;
- actual aspect/dimension validation;
- three-format campaign review;
- browser-local IndexedDB draft persistence;
- SoundCloud/social/tags;
- non-canonical ZIP export;
- no external TTM popup in the primary path;
- no R2 or Track Manager write.

### Build 49 corrective

Real-user smoke showed that an editable MASTER prompt was not enough: creative exploration needs an explicit **from-scratch concept reroll**.

Build 49 adds:

- `New MASTER concept`;
- multiple deliberately distinct visual concept families;
- explicit creative reset that ignores the previous prompt/composition/scene/visual metaphor;
- persisted `masterConceptIndex` across refreshes;
- non-destructive rerolls: accepted MASTER/1:1/9:16 remain visible until the user explicitly replaces the MASTER;
- direct **`Open Google Flow ↗`** shortcut to `https://labs.google/fx/fr/tools/flow/`;
- Flow opens in a separate tab with `noopener noreferrer`, preserving the Studio draft and imported campaign state.

Only importing/replacing a new MASTER invalidates the existing derivative slots, because they would no longer belong to the selected source of truth.

## Premium provider strategy

1. **Google Flow / Gemini / ChatGPT Images** — FINAL-quality external-provider handoff.
2. **Local ComfyUI / SD3.5** — DRAFT exploration only unless quality materially improves.
3. **Cloudflare FLUX** — DRAFT/fallback only.

Studio orchestrates campaign context/coherence; it does not pretend a weaker generator is release-ready.

## Phase 7 roadmap

### 7-A — Workflow Overview
**COMPLETE — REAL USER PASS · Build 46**

Pipeline:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

### Native Release Campaign priority slice

- Build 47 — historical staged-preview proof.
- Build 48 — native Release Campaign candidate; partial real-user smoke passed and exposed missing concept reroll.
- Build 49 — concept-reroll + direct Flow shortcut corrective; **real-user smoke required**.

### 7-B — Contextual continuation receipts
**AUTHORIZED / DEFERRED TO BUILD 50+ UNTIL NATIVE RELEASE CAMPAIGN ACCEPTANCE**

Contract remains:

- specialist receipts scoped by canonical `trackId` + source/operation;
- canonical reread after canonical writes;
- optimistic child/local state never authoritative;
- stale/mismatched receipts ignored;
- no generic write endpoint;
- existing operation owners unchanged.

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Only after 7-B validation.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership/artistic order;
- track `album.id/title` is compatibility cache, not authority;
- `catalog/index.json` is rebuildable projection;
- Singles is a virtual collection.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

`.lrc` never becomes a second source of truth.

## Track Manager / protected-write rules

Track Manager remains the protected canonical write authority. Studio uses operation-specific capabilities. Missing capability blocks that operation. Whole-track delete remains unavailable in Studio.

The native Release Campaign in Builds 48/49 imports **none** of these mutation APIs and performs no canonical write.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A/C3-B contracts remain unchanged.

## Safety

- Cloudflare Access remains mandatory for private protected-write bridges;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- no generic arbitrary cross-origin Track write route;
- Release Campaign browser-local state never masquerades as canonical R2 state;
- external provider links are navigation only, not API/key integrations;
- future Phase 7-B receipts must trigger canonical rereads rather than create alternate authority.

## Rollback anchors

```text
safety/pre-build49-master-concept-reroll-20260812
safety/pre-build48-native-release-campaign-20260812-1707
safety/pre-build47-ttm-v3-preview-20260812
safety/pre-v0.2-release-orchestrator-20260812   # Track-To-Market repo
safety/pre-phase7-authorized-post-build45-20260812-0232
safety/post-phase7-a-build46-real-user-pass-20260812-0923
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
```

## Verification policy

CI is necessary but not sufficient. Accepted Build 102/45/46 history remains accepted. Build 49 is a native Release Campaign corrective candidate and requires real-user proof of:

- from-scratch MASTER concept reroll;
- accepted visuals preserved during exploration;
- direct Google Flow shortcut without Studio draft loss;
- logo reference handoff;
- faithful 16:9 MASTER import;
- coherent anchored 1:1 + 9:16;
- three-format review;
- export;
- no canonical writes/regressions.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.
