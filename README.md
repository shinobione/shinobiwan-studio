# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current accepted / candidate line

```text
Accepted baseline:
Studio          v0.16.0 · Build 46 · PHASE 7-A REAL USER PASS
LaunchPAD       2026.08.12.102 · C3-C REAL USER PASS
Track-To-Market v0.1.5 · Bridge V2 transport/finality REAL USER PASS

Inherited corrective:
Studio          v0.16.1 · Build 47 · TTM V3 staged FINAL preview
Track-To-Market v0.2.0 · Release Orchestrator · Bridge V3

Current candidate:
Studio          v0.17.0 · Build 48
Codename        phase7-b-contextual-receipts
Status          PHASE 7-B IMPLEMENTED CANDIDATE · REAL USER SMOKE PENDING

Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX is COMPLETE — REAL USER VALIDATED. Phase 7-A Build 46 is COMPLETE — REAL USER PASS.**

Build 48 is based directly on the deployed Build 47 current-main line and preserves the Track-To-Market V3 staged FINAL preview/provenance corrective while adding contextual continuation receipts.

See:

- [`docs/PHASE-7-B-RECEIPTS-BUILD48.md`](docs/PHASE-7-B-RECEIPTS-BUILD48.md)
- [`docs/PHASE-7-B-SMOKE-CHECKLIST.md`](docs/PHASE-7-B-SMOKE-CHECKLIST.md)
- [`CHANGELOG-PHASE7-BUILD48.md`](CHANGELOG-PHASE7-BUILD48.md)
- [`docs/PHASE-7-A-TTM-V3-BUILD47.md`](docs/PHASE-7-A-TTM-V3-BUILD47.md)
- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## Phase 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Build 46**

Studio route: `#/workflow`

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For every canonical Track, Studio derives readiness, one deterministic Next Action and a deep-link to the existing guarded specialist surface. The Workflow itself is read-only.

Accepted checkpoint:

` safety/post-phase7-a-build46-real-user-pass-20260812-0923 `

## Build 47 — Track-To-Market V3 staged FINAL preview

**DEPLOYED CORRECTIVE — inherited by Build 48**

Build 47 consumes Track-To-Market V0.2 / Bridge V3 and stages the actual selected FINAL artwork + provenance in Studio.

Preserved gates:

- Bridge `0.2.0`;
- `Integrated` premium artwork strategy;
- actual FINAL preview returned to Studio;
- preview restricted to `data:image/*` and capped at 2.5 MB;
- provider/model/artwork/branding provenance;
- expected origin + exact child Window + matching canonical `trackId`;
- FINAL only / DRAFT rejected;
- transient staged review only;
- no R2 write;
- no Track Manager mutation;
- no canonical cover replacement.

Rollback: `safety/pre-build47-ttm-v3-preview-20260812`.

Its user-facing corrective behavior is included in the combined Build 48 smoke rather than being silently marked accepted.

## Phase 7-B — Contextual continuation receipts

**IMPLEMENTED CANDIDATE · Studio v0.17.0 · Build 48**

Phase 7-B closes the return path after a specialist action.

A receipt is **not** a new source of truth.

### Canonical writes

```text
specialist reports completion
        ↓
typed receipt(trackId + source + operation)
        ↓
VERIFYING
        ↓
getCatalogTrack(trackId)
        ↓
private Track Manager reread required
        ↓
VERIFIED or VERIFICATION ERROR
```

### Review-only results

```text
Track-To-Market matching FINAL
        ↓
review-only receipt
        ↓
transient staged preview/review
        ↓
NO R2 WRITE / NO TRACK MANAGER MUTATION
```

### Build 48 receipt sources

- **LRC Maker embedded** — `lyrics-saved` / canonical-write;
- **LRC Maker standalone** — allowlisted `shinobiwan:lyrics-saved:v1` / canonical-write;
- **SonicTrace** — `analysis-saved` / canonical-write;
- **Track-To-Market V3** — matching FINAL / review-only.

### Receipt states

- `verifying` — canonical reread in progress;
- `verified` — private Track Manager reread succeeded;
- `review-only` — result received, no canonical write expected/authorized;
- `verification-error` — Studio cannot prove the write through the private canonical read layer.

### Safety rules

- receipt `trackId` must match current Track;
- mismatched receipts are ignored;
- stale async verification cannot overwrite a newer receipt;
- public LaunchPAD fallback cannot verify a canonical write;
- Build 47 TTM V3 preview validation/finality gates remain intact;
- no generic write endpoint or new R2 path;
- existing write/specialist authorities remain unchanged.

Rollback anchor:

` safety/pre-phase7-b-build48-20260812-1008 `

## PHASE UX — FINAL STATUS

**COMPLETE — REAL USER VALIDATED**

- C2.5-A → F — canonical Album model/write/migration/public cutover + virtual Singles;
- C3-A — Deep Audio resilience;
- C3-B — Catalog Intelligence / V2-E parity;
- C3-C — LaunchPAD Build 102 Premium Feel;
- Track-To-Market Bridge V2 — Studio Build 45 accepted transport/finality/no-write contract.

Final closeout: [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md).

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant, not canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub `main`** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

**Phase 7 means orchestration, not centralization.**

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

Ordered `album.trackIds` remains authoritative membership/order. `catalog/index.json` remains rebuildable projection. Singles remains virtual.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

`.lrc` never becomes a second source of truth.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Structured sidecars remain canonical only through the established guarded SonicTrace save path.

## Phase 7 roadmap

### 7-A — Workflow Overview
**COMPLETE — REAL USER PASS · Build 46**

### Build 47 — TTM V3 staged review corrective
**DEPLOYED / inherited by current candidate**

### 7-B — Contextual continuation receipts
**CURRENT CANDIDATE · Build 48**

### 7-C — Guided end-to-end actions
**PLANNED / NOT STARTED**

Only after 7-B REAL USER PASS: guarded resumable New Track → media → metadata → lyrics → analysis → release readiness with operation-specific confirmations and canonical rereads.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

## Rollback anchors

```text
safety/pre-phase7-b-build48-20260812-1008
safety/pre-build47-ttm-v3-preview-20260812
safety/post-phase7-a-build46-real-user-pass-20260812-0923
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI/typecheck/build are necessary but not sufficient. Build 48 remains a candidate until real-user smoke passes. The Build 48 smoke deliberately covers inherited Build 47 TTM V3 staged review plus the new receipt behavior.

Do not mutate production media/catalog objects merely to manufacture a frontend smoke test.