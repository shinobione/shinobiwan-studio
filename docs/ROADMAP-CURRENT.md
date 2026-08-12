# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-12 after PHASE UX closeout, accepted Build 45/46 baselines, the deployed Build 47 Track-To-Market V3 corrective, and implementation of Phase 7-B Build 48.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release orchestration/finalization assistant; not canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub `main`** — application-code authority.
- canonical `trackId` is the R2 track slug everywhere.

## Completed product / PHASE UX line

- Phase 0 — Architecture/data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC ✅ REAL USER PASS
- PHASE UX C2.5 + C3 ✅ REAL USER PASS
- Track-To-Market Bridge V2 / Studio Build 45 ✅ REAL USER PASS
- Phase 7-A Workflow / Studio Build 46 ✅ REAL USER PASS

Final PHASE UX closeout: `docs/PHASE-UX-FINAL-CLOSEOUT-20260812.md`.

Accepted LaunchPAD baseline: `2026.08.12.102`.

## Post-pass Track-To-Market corrective

### Studio Build 47 / TTM V0.2 Bridge V3

Status: **DEPLOYED CORRECTIVE — inherited by Build 48; combined real-user smoke pending**

Build 47 added:

- Track-To-Market Bridge `0.2.0`;
- premium `Integrated` artwork strategy;
- explicit uploaded-logo reference handoff;
- actual selected FINAL artwork preview returned to Studio;
- `data:image/*` validation + 2.5 MB cap;
- provider/model/artwork/branding provenance;
- exact origin + exact child Window + matching trackId + FINAL-only gates;
- transient staged review only;
- no R2 / Track Manager write.

Rollback: `safety/pre-build47-ttm-v3-preview-20260812`.

Build 48 is based directly on this deployed main line and preserves it.

## Phase 7 — End-to-end workflow

Status: **7-A COMPLETE / 7-B CURRENT CANDIDATE**

### Phase 7-A — Workflow Overview

**COMPLETE — REAL USER PASS · Studio v0.16.0 · Build 46**

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Build 46 provides a read-only canonical production queue, readiness stages, filters and one deterministic Next Action per Track.

Checkpoint: `safety/post-phase7-a-build46-real-user-pass-20260812-0923`.

### Phase 7-B — Contextual continuation receipts

**IMPLEMENTED CANDIDATE · Studio v0.17.0 · Build 48**

Codename: `phase7-b-contextual-receipts`.

Build 48 closes the specialist return loop:

```text
specialist completion
      ↓
typed receipt(trackId + source + operation + effect)
      ↓
canonical write? ── yes ──> private canonical reread ──> VERIFIED / ERROR
      │
      no
      ↓
REVIEW ONLY
```

Receipt sources:

- LRC Maker embedded — `lyrics-saved` / canonical-write;
- LRC Maker standalone — allowlisted `shinobiwan:lyrics-saved:v1` / canonical-write;
- SonicTrace — `analysis-saved` / canonical-write;
- Track-To-Market V3 matching FINAL — `final-pack-received` / review-only.

Hard rules:

- receipt `trackId` must match current Track;
- mismatched receipts are ignored;
- canonical-write receipts force `getCatalogTrack(trackId)` reread;
- verification requires private Track Manager read source;
- public fallback cannot manufacture a green verification;
- stale async verification cannot overwrite a newer receipt;
- TTM FINAL remains staged/transient and creates no canonical persistence;
- Build 47 preview/provenance behavior is preserved;
- no generic write endpoint or new R2 write path;
- existing operation owners remain unchanged.

Safety anchor:

` safety/pre-phase7-b-build48-20260812-1008 `

Docs:

- `docs/PHASE-7-B-RECEIPTS-BUILD48.md`
- `CHANGELOG-PHASE7-BUILD48.md`
- `docs/PHASE-7-B-SMOKE-CHECKLIST.md`

Build 48 remains a candidate until user smoke passes. The Build 48 smoke also covers the inherited Build 47 TTM V3 staged-preview corrective, so no fake intermediate PASS is required.

### Phase 7-C — Guided end-to-end actions

**PLANNED / NOT STARTED**

Only after Build 48 / 7-B REAL USER PASS:

- guided resumable New Track → media → metadata → lyrics → analysis → release readiness;
- explicit operation-specific confirmations;
- canonical reread after every write;
- resume/recovery after interruption;
- no silent Album/order/publish mutation.

Phase 7 means orchestration, not centralization.

## Later roadmap

- **Phase 8** — Dashboard Intelligence & Content Health.
- **Phase 9** — Security / reliability / PWA hardening.
- **Phase 10** — progressive extraction of mature shared engines.

There is no official Phase 11.

## Current baseline / candidate

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

Inherited corrective:
Track-To-Market 0.2.0                 Release Orchestrator / Bridge V3
Studio          0.16.1 / Build 47     staged FINAL preview

Current candidate:
Studio          0.17.0 / Build 48     Phase 7-B contextual receipts
```

Automation/CI never upgrades real-user acceptance labels by itself.