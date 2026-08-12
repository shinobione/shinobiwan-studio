# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current release / accepted lineage

```text
Studio          v0.17.0 · Build 47
Codename        phase7-b-contextual-receipts
Status          PHASE 7-B IMPLEMENTED CANDIDATE · REAL USER SMOKE PENDING

Accepted parent Studio v0.16.0 · Build 46 · Phase 7-A REAL USER PASS
LaunchPAD       2026.08.12.102 · C3-C REAL USER PASS
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b
Track Manager   v5.19
Studio bridge   v1.11
Track-To-Market v0.1.5 · Bridge V2 · REAL USER PASS
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
LRC Maker       6.3.8
```

**PHASE UX is COMPLETE — REAL USER VALIDATED.** Phase 7-A is complete and accepted. Build 47 is the current Phase 7-B candidate.

Current docs:

- [`docs/PHASE-7-B-RECEIPTS-BUILD47.md`](docs/PHASE-7-B-RECEIPTS-BUILD47.md)
- [`docs/PHASE-7-B-SMOKE-CHECKLIST.md`](docs/PHASE-7-B-SMOKE-CHECKLIST.md)
- [`CHANGELOG-PHASE7-BUILD47.md`](CHANGELOG-PHASE7-BUILD47.md)
- [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md`](docs/PHASE-7-A-BUILD46-REAL-USER-PASS.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)

## Phase 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Build 46**

Studio exposes one canonical production route:

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

For each Track, the Workflow derives `ready / attention / blocked`, one deterministic Next Action and a deep-link to the existing guarded Track Workspace owner. The Workflow itself remains read-only.

Accepted checkpoint:

` safety/post-phase7-a-build46-real-user-pass-20260812-0923 `

## Phase 7-B — Contextual continuation receipts

**IMPLEMENTED CANDIDATE · Build 47**

Phase 7-B closes the return path after a specialist action.

The key rule is simple:

> A specialist may report completion, but Studio does not treat that receipt as canonical truth.

For canonical writes:

```text
specialist completion
        ↓
receipt(trackId + source + operation)
        ↓
Studio: VERIFYING
        ↓
getCatalogTrack(trackId)
        ↓
private Track Manager reread required
        ↓
VERIFIED or VERIFICATION ERROR
```

For review-only specialist results:

```text
Track-To-Market matching FINAL
        ↓
review-only receipt
        ↓
transient Studio review state
        ↓
NO R2 WRITE / NO TRACK MANAGER MUTATION
```

### Build 47 receipt sources

- **LRC Maker embedded** — `lyrics-saved` / canonical-write;
- **LRC Maker standalone** — allowlisted `shinobiwan:lyrics-saved:v1` / canonical-write;
- **SonicTrace** — `analysis-saved` / canonical-write;
- **Track-To-Market** — matching FINAL / review-only.

### Receipt states

- `verifying` — canonical reread in progress;
- `verified` — private Track Manager reread succeeded;
- `review-only` — result received, but no canonical write is expected or authorized;
- `verification-error` — Studio cannot prove the write through the private canonical read layer.

### Safety rules

- receipt `trackId` must match the current Track;
- mismatched receipts are ignored;
- stale async verification cannot overwrite a newer receipt;
- public LaunchPAD fallback is never enough to verify a canonical write;
- no generic write endpoint is added;
- no new R2 write route is added;
- Track-To-Market FINAL remains review-only;
- specialist/write authorities remain unchanged.

Pre-Build-47 rollback anchor:

` safety/pre-phase7-b-build47-20260812-0948 `

## PHASE UX — CLOSED

**COMPLETE — REAL USER VALIDATED**

Final accepted boundaries:

- C2.5-A → F — canonical Album model/write/migration/public cutover + Singles semantics;
- C3-A — Deep Audio resilience;
- C3-B — Catalog Intelligence / V2-E parity;
- C3-C — LaunchPAD Premium Feel accepted at Build 102;
- Track-To-Market Bridge V2 — Studio Build 45 REAL USER PASS.

Final closeout: [`docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`](docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md).

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release-pack ideation/finalization assistant, not canonical write authority.
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

Frozen rules:

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership/artistic order;
- track-manifest `album.id/title` is compatibility cache, not authority;
- `catalog/index.json` is a rebuildable projection;
- Singles is virtual and derived from Tracks not owned by a canonical Album.

Current canonical Albums:

- Neon Heartbreaks;
- Coal to Diamond;
- Love Letters from Saigon.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

`.lrc` never becomes a second source of truth.

## Track Manager / protected-write rules

Track Manager remains the only protected canonical Track write authority. Studio uses operation-specific capabilities only; missing capability blocks that operation. Whole-track delete remains unavailable in Studio.

Build 47 adds no mutation API or generic write proxy.

## SonicTrace persistence

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

SonicTrace audio bytes remain temporary. Structured analysis sidecars remain canonical only after the existing guarded save path succeeds.

## Phase 7 roadmap

### 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Build 46**

### 7-B — Contextual continuation receipts

**CURRENT CANDIDATE · Build 47**

### 7-C — Guided end-to-end actions

**PLANNED / NOT STARTED**

Only after 7-B REAL USER PASS: guarded resumable New Track → media → metadata → lyrics → analysis → release readiness, preserving operation-specific confirmations and canonical rereads.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

## Rollback anchors

```text
safety/post-phase-ux-final-closeout-20260812-0948
safety/pre-phase7-b-build47-20260812-0948
safety/post-phase7-a-build46-real-user-pass-20260812-0923
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/c3-a-real-user-pass-20260811-1900
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

CI/typecheck/build are necessary but not sufficient. Build 47 remains a candidate until real-user receipt smoke passes.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.