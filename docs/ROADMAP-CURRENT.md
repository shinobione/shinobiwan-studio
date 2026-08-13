# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-13 for **Studio v0.18.0 · Build 57 — Studio Focus Slice 3 / Track Workshop CANDIDATE**.

Build 56 / Slice 2 is now **COMPLETE — REAL USER PASS** after deployed browser review accepted the five-card Tracks library, larger copy and full wrapping `Audio / Cover / Lyrics / Canvas / Release` labels.

Build 57 opens the next validated Studio Focus step: regroup the Track Workspace around the artist mental model **`Track · Visuals · Lyrics · Release`** while preserving all existing canonical authorities and deep-link compatibility.

Historical release detail remains in milestone docs, changelogs and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator and native Release Campaign workspace.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected canonical write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market standalone** — rollback/reference implementation; no longer the intended primary release-campaign UX.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — code authority.
- Canonical `trackId` is the R2 track slug everywhere.

No Studio Focus slice may create a second source of truth, a generic write route or a second R2 owner.

## Closed / accepted foundations

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC ✅ REAL USER VALIDATED
- PHASE UX ✅ REAL USER VALIDATED
- Phase 7-A — Workflow Overview ✅ REAL USER PASS · Build 46
- Phase 7-B — Contextual continuation receipts ✅ REAL USER PASS · Build 51
- SonicTrace V2-E Build 08 ✅ durable FULL profile + canonical R2 reread REAL USER PASS

## Studio Focus — active roadmap

Product rule:

> When everything works, the technical machinery disappears. When something fails, the technical detail remains available.

### Slice 1 — shell + Home

Status: **COMPLETE — REAL USER PASS · Build 53**

Accepted daily navigation:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Accepted behavior:

- Home answers what to continue / what needs finishing;
- `Continue where you left off` uses local browser state only as a navigation hint;
- next actions reuse the accepted Phase 7-A workflow/readiness model;
- `+ New Track` stays private-read gated and Track Manager-owned;
- healthy infrastructure detail is hidden from daily use.

Acceptance checkpoint:

`safety/post-studio-focus-build53-real-user-pass-20260813-0032`

### Slice 2 — Tracks production library

Status: **COMPLETE — REAL USER PASS · Build 56**

History:

- Build 54 established the production library and `To finish / Ready / Released / All` filters;
- Build 55 reduced oversized cover dominance and increased text size, but its first deployed smoke exposed truncated state labels;
- Build 56 preserved the denser five-card layout and converted production states to full wrapping chips.

Accepted deployed result:

- calmer cover size / higher track density;
- readable title / album / next action copy;
- full **Audio / Cover / Lyrics / Canvas / Release** labels;
- chips wrap naturally instead of ellipsis;
- one clear continuation action per track;
- existing Phase 7-A readiness logic remains the source of continuation truth.

Acceptance checkpoint:

`safety/post-studio-focus-build56-real-user-pass-20260813-0143`

### Slice 3 — Track Workshop

Status: **BUILD 57 CANDIDATE — FULL CI REQUIRED, THEN DEPLOYED REAL-USER SMOKE**

Release candidate:

```text
Studio v0.18.0 · Build 57
codename: studio-focus-track-workshop
```

Artist-facing Track navigation becomes:

```text
Track · Visuals · Lyrics · Release
```

#### Track

- useful identity / Album / release facts;
- canonical master audio playback;
- compact Audio / Visuals / Lyrics / Sound / Release state;
- protected canonical Audio management only;
- secondary BPM/key/duration/language/source detail under `More track details`;
- full protected Metadata editor reachable as Track detail;
- full SonicTrace reachable through `View full SonicTrace analysis` rather than a permanent daily tab.

#### Visuals

- canonical Cover preview;
- Canvas/video preview;
- protected Cover / Thumbnail / Video-Canvas controls only;
- Audio no longer repeated here;
- lyrics no longer repeated here;
- final campaign-format work continues under Release.

#### Lyrics

- embedded LRC Maker remains primary;
- `tracks/<slug>/lyrics.txt` remains the single canonical source;
- recognized timestamps inside it remain synchronization authority;
- `.lrc` remains optional compatibility/export only;
- standalone LRC Maker remains fallback;
- canonical-write receipt still requires exact `trackId` + Track Manager private reread before VERIFIED.

#### Release

- compact Audio / Cover / Lyrics / Canvas / Metadata readiness checklist;
- Canvas remains optional when no accepted release rule makes it globally mandatory;
- existing native Release Campaign stays immediately below;
- MASTER 16:9 + independently MASTER-anchored 1:1 and 9:16 contract unchanged;
- browser-local campaign drafts remain non-canonical;
- export retains `canonicalWrite: false`.

#### Compatibility / authority

Legacy route tokens remain valid:

```text
overview
metadata
assets
lyrics
intelligence
market
versions
publishing
```

`AssetsManager` now supports task-scoped visibility only:

```text
Track   → Audio
Visuals → Cover / Thumbnail / Video-Canvas
```

Upload/delete/palette writes still use the same existing Track Manager guarded APIs.

Pre-Build57 checkpoint:

`safety/pre-build57-track-workshop-20260813-0143`

Build 57 must not be labeled REAL USER PASS until deployed browser smoke confirms the regrouping.

### Slice 4 — SonicTrace compact / invisible assistant

Status: **PLANNED / NOT STARTED**

Target:

- keep SonicTrace and Catalog Intelligence intact;
- show only useful artist-facing conclusions by default;
- keep FULL/PARTIAL/UNAVAILABLE/OUTDATED truthfulness;
- move engine/provenance/embedding/diagnostic depth behind deliberate detail views;
- no persistence or authority change.

Do not start until Slice 3 is accepted.

### Studio Focus closeout

Status: **PLANNED / NOT STARTED**

After Slice 4:

1. cross-flow deployed smoke across Track / Visuals / Lyrics / SonicTrace / Release;
2. confirm all protected write receipts/private rereads;
3. mobile/responsive review;
4. decide whether the separate detailed Workflow destination can be fully absorbed into Home;
5. create final Studio Focus acceptance checkpoint/docs.

## Native Release Campaign — preserved contract

```text
Canonical Track context
        ↓
Premium handoff / provider generation
        ↓
MASTER FINAL 16:9 selected
        ├── 1:1 generated from MASTER 16:9 as reference
        └── 9:16 generated from MASTER 16:9 as reference
```

1:1 and 9:16 are sibling derivatives. **9:16 is never derived from 1:1.**

Preserved capabilities:

- non-destructive `New MASTER concept`;
- direct Google Flow shortcut;
- logo reference;
- faithful MASTER import;
- anchored derivative prompts/imports;
- three-format review;
- browser-local IndexedDB persistence;
- ZIP export;
- no canonical write.

Release Campaign completion receipt remains:

```text
release-campaign + campaign-exported → review-only
```

A visual FINAL never silently becomes canonical Cover/R2 state.

## Phase 7-B receipt authority — preserved

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

For canonical-write receipts:

- exact current `trackId` required;
- source/operation/effect allowlist required;
- mismatches ignored;
- private Track reread required;
- returned ID must still match;
- operation-specific canonical evidence required;
- public fallback can never verify a write;
- stale async rereads cannot overwrite newer receipt/context;
- only private verified reread may display `Canonical reread verified`.

## Phase 7-C — guided canonical actions

Status: **PLANNED / NOT STARTED / EXPLICITLY CLOSED**

Studio Focus does not authorize Phase 7-C by implication. Start only after fresh explicit authorization.

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Global actionable catalog health built on the mature production-state model.

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX and PWA resilience.

### Phase 10 — Progressive extraction

Potential mature extraction of LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Current baseline

```text
Accepted:
LaunchPAD       2026.08.12.102        C3-C REAL USER PASS
Studio          0.16.0 / Build 46     Phase 7-A REAL USER PASS
Studio          0.17.1 / Build 51     Phase 7-B REAL USER PASS
Studio          0.17.3 / Build 53     Studio Focus Slice 1 REAL USER PASS
Studio          0.17.6 / Build 56     Studio Focus Slice 2 REAL USER PASS
SonicTrace      V2-E Build 08         REAL USER PASS
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
Deep Audio      2.0.3-alpha
LRC Maker       6.3.8

Candidate:
Studio          0.18.0 / Build 57     Studio Focus Slice 3 Track Workshop
```

## Rollback / acceptance anchors

```text
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/pre-build57-track-workshop-20260813-0143
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

## Verification policy

CI never upgrades a candidate to REAL USER PASS by itself.

For Build 57 specifically:

1. exact feature head must pass all inherited guards plus Build 57 guard;
2. TypeScript and production Vite build must pass;
3. `main` must remain unchanged from the accepted Build 56 base before merge;
4. only the exact tested head may be merged;
5. GitHub Pages must successfully deploy the exact merge SHA;
6. deployed browser smoke must confirm Track / Visuals / Lyrics / Release behavior;
7. only observed behavior may then be documented as REAL USER PASS.

Do not mutate production media merely to manufacture a smoke. Do not start Slice 4 or Phase 7-C before their explicit gates are satisfied.
