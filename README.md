# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current line

```text
Accepted baselines:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          v0.15.1 · Build 45    TTM Bridge V2 REAL USER PASS
Studio          v0.16.0 · Build 46    Phase 7-A REAL USER PASS
Studio          v0.17.1 · Build 51    Phase 7-B REAL USER PASS

Current Phase 7 line:
Studio          v0.16.1 · Build 47    staged-preview corrective / historical proof
Studio          v0.16.2 · Build 48    native Release Campaign · partial real-user smoke
Studio          v0.16.3 · Build 49    MASTER concept reroll + direct Flow shortcut baseline
Studio          v0.17.0 · Build 50    Phase 7-B receipts · partial smoke (Lyrics parent receipt failed)
Studio          v0.17.1 · Build 51    accepted Phase 7-B corrective · REAL USER PASS
Track-To-Market v0.2.0               standalone rollback/reference during native migration

Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX remains COMPLETE — REAL USER VALIDATED. Phase 7-A Build 46 remains COMPLETE — REAL USER PASS. Phase 7-B Build 51 is COMPLETE — REAL USER PASS.**

Builds 48/49 moved the useful Track-To-Market release workflow directly into the Track Workspace and added non-destructive MASTER concept rerolls plus a direct Google Flow shortcut. Build 50 added typed contextual completion receipts and proved the review-only Release Campaign path, but its first browser smoke exposed a missing parent receipt after an otherwise successful embedded LRC Maker save/reread. Build 51 corrected only that delivery seam. The deployed browser now shows `LRC Maker / lyrics saved → Canonical reread verified` after Track Manager private reread, completing Phase 7-B.

See:

- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`CHANGELOG-PHASE7-BUILD49.md`](CHANGELOG-PHASE7-BUILD49.md)
- [`CHANGELOG-PHASE7-BUILD50.md`](CHANGELOG-PHASE7-BUILD50.md)
- [`CHANGELOG-PHASE7-BUILD51.md`](CHANGELOG-PHASE7-BUILD51.md)
- [`docs/PHASE-7-B-BUILD50-CONTEXTUAL-RECEIPTS.md`](docs/PHASE-7-B-BUILD50-CONTEXTUAL-RECEIPTS.md)
- [`docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md`](docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md)
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

## Native Release Campaign — Build 48 → Build 49, preserved in Builds 50/51

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

Build 49 adds:

- `New MASTER concept`;
- multiple deliberately distinct visual concept families;
- explicit creative reset that ignores the previous prompt/composition/scene/visual metaphor;
- persisted `masterConceptIndex` across refreshes;
- non-destructive rerolls: accepted MASTER/1:1/9:16 remain visible until the user explicitly replaces the MASTER;
- direct **`Open Google Flow ↗`** shortcut to `https://labs.google/fx/fr/tools/flow/`;
- Flow opens in a separate tab with `noopener noreferrer`, preserving the Studio draft and imported campaign state.

Only importing/replacing a new MASTER invalidates the existing derivative slots, because they would no longer belong to the selected source of truth.

### Build 50/51 Release Campaign boundary

Native Release Campaign still performs no canonical write. Its successful ZIP export emits only:

```text
release-campaign / campaign-exported / review-only
```

The export manifest retains `canonicalWrite: false`. A visual FINAL is never implicitly promoted to R2/Track Manager state.

The Build 50 browser smoke visibly confirmed `Review receipt received` with an explicit no-canonical-write message. Build 51 does not modify this path.

## Phase 7-B — Contextual continuation receipts

Build 50 established the typed allowlisted completion contract:

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

For canonical-write receipts:

1. receipt must match the exact canonical Track Workspace `trackId`;
2. mismatches are ignored;
3. Studio rereads the Track through the existing catalog read layer;
4. the reread must return the same trackId and `readSource === 'private'`;
5. operation-specific canonical evidence must exist;
6. only then may Studio display `Canonical reread verified` and adopt the reread Track state.

A public LaunchPAD fallback can never verify a canonical write. Slow/stale verification is protected by an async epoch so an older reread cannot overwrite a newer receipt/context.

Standalone LRC Maker messages remain origin-filtered against the configured LRC Maker origin before conversion to the same typed receipt path.

### Build 50 real-user smoke result

The first deployed smoke produced a partial result:

- Release Campaign review-only receipt: **PASS**;
- complete native Release Campaign surface/export: **PASS**;
- Workflow 7-A read-only regression check: **PASS**;
- embedded LRC Maker protected save + its own canonical reread: **PASS** (`lyrics.txt synchronisé et relu.` visible);
- parent Phase 7-B Lyrics receipt banner: **FAIL** — no `Verifying canonical state…` / `Canonical reread verified` appeared.

Therefore Build 50 remains historical partial-smoke evidence and is not the accepted Phase 7-B release.

### Build 51 Lyrics receipt corrective — accepted

LRC Maker 6.3.8 already emits a composed, bubbling `lyrics-saved` CustomEvent from `<shinobiwan-lyrics-studio>` after its existing guarded save + reread.

Build 50 captured that event through a React `ref` bound to the custom-element host. The real browser smoke showed that this delivery seam was not reliable enough.

Build 51 removes the ref dependency and listens for the same bubbling/composed `lyrics-saved` event at `window` scope. It still requires:

- exact `detail.trackId === current trackId`;
- the same typed `lrc-maker / lyrics-saved / canonical-write` receipt;
- the same private canonical Track reread;
- canonical `lyrics.txt` evidence before VERIFIED;
- stale/mismatched receipt protection inherited from Build 50.

The deployed Build 51 browser retest showed `LRC MAKER / LYRICS SAVED` followed by **`Canonical reread verified`**, with explicit confirmation that Track Manager private reread succeeded and Studio is displaying canonical state rather than optimistic child state.

No LRC Maker code/version, Track Manager endpoint, Worker, R2 object or write authority changed in Build 51.

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

The Workflow remains read-only and deep-links to existing guarded specialist surfaces.

### Native Release Campaign priority slice

- Build 47 — historical staged-preview proof.
- Build 48 — native Release Campaign workspace; partial real-user smoke exposed missing concept reroll.
- Build 49 — concept-reroll + direct Flow shortcut baseline inherited by Builds 50/51.

### 7-B — Contextual continuation receipts
**COMPLETE — REAL USER PASS · Studio v0.17.1 · Build 51**

Contract:

- specialist receipts scoped by exact canonical `trackId` + allowlisted source/operation/effect;
- canonical reread after canonical writes;
- private reread required for `VERIFIED`;
- public fallback cannot verify writes;
- optimistic child/local state never authoritative;
- stale/mismatched receipts ignored;
- native Release Campaign remains review-only;
- no generic write endpoint;
- existing operation owners unchanged.

Accepted closeout: `docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md`.

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED / EXPLICITLY CLOSED**

Phase 7-B completion does not automatically authorize 7-C. Start only after a fresh explicit authorization.

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

Builds 50/51 do not add a generic canonical write endpoint or a second write owner. LRC Maker and SonicTrace continue to use their existing guarded write paths; Studio verifies completion by private canonical reread.

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
- canonical-write receipts require private canonical rereads;
- public fallback can never verify a write;
- no Worker deployment was required for Build 51;
- Phase 7-C is not started.

## Rollback anchors

```text
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/phase7-b-build51-candidate-20260812-2112
safety/pre-build51-lyrics-receipt-corrective-20260812-2102
safety/pre-phase7-b-build50-20260812-1826
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

CI is necessary but not sufficient.

Phase 7-B acceptance is now backed by deployed browser proof across Builds 50/51:

- Release Campaign export produces a **review-only** receipt and never canonical VERIFIED;
- Workflow 7-A remains operational/read-only;
- embedded LRC Maker performs its protected save and canonical reread;
- Build 51 parent receipt identifies `LRC Maker / lyrics saved`;
- `Canonical reread verified` appears only after the private Track Manager reread/evidence path succeeds;
- Studio explicitly displays canonical state rather than optimistic child state;
- no new canonical write authority appears.

Phase 7-B is therefore **COMPLETE — REAL USER PASS**. Do not start Phase 7-C without fresh explicit authorization.
