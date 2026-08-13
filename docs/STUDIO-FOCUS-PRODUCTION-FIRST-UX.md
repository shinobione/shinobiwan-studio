# SHINOBIWAN STUDIO — STUDIO FOCUS / PRODUCTION-FIRST UX

Status: **ROADMAP APPROVED · IMPLEMENTATION IN PROGRESS · BUILD 58 SLICE 3 SMOKE CORRECTIVE CANDIDATE**

Approved by real-user review on 2026-08-12 after Studio v0.17.2 · Build 52. Implementation opened with Studio v0.17.3 · Build 53. Slice 2 closed with Build 56 REAL USER PASS. Slice 3 opened with Build 57 and continues with the Build 58 smoke corrective after deployed review.

This roadmap does **not** replace any validated canonical authority or remove specialist capabilities. It changes the daily information architecture so Studio behaves like an artist production tool rather than exposing implementation detail by default.

## Product rule

> When everything works, the technical machinery disappears. When something fails, the technical detail remains available.

The validated Track Manager / R2 / SonicTrace / LRC Maker / receipt / private-reread architecture remains intact underneath the simplified experience.

## Implementation status

| Slice | Scope | Status |
|---|---|---|
| Build 52 | visible `Catalog` → `Tracks` polish | **COMPLETE** |
| Build 53 / Slice 1 | production-first shell + actionable Home | **COMPLETE — REAL USER PASS** |
| Build 54 / Slice 2A | Tracks production-library simplification | **FUNCTIONAL BASE DEPLOYED** |
| Build 55 / Slice 2B | smaller covers + larger card copy | **SUPERSEDED AT SMOKE — status labels truncated** |
| Build 56 / Slice 2C | full readable Audio/Cover/Lyrics/Canvas/Release chips | **COMPLETE — REAL USER PASS** |
| Build 57 / Slice 3A | Track Workspace regrouping to `Track · Visuals · Lyrics · Release` | **DEPLOYED SMOKE EVIDENCE — NOT ACCEPTED** |
| Build 58 / Slice 3B | public-read truthfulness + 9:16 Canvas + specialist-lock clarity | **CANDIDATE — CI + deployed smoke required** |
| Slice 4 | compact SonicTrace artist summary + Advanced detail | **PLANNED / NOT STARTED** |
| Closeout | cross-flow real-user smoke + Workflow absorption decision | **PLANNED / NOT STARTED** |

Phase 7-C guided canonical actions remain **EXPLICITLY CLOSED / NOT STARTED**. Studio Focus is a presentation/information-architecture successor over the accepted Phase 7-A/7-B contracts.

## 1 — Home becomes the actionable continuation surface

Approved direction:

- reduce dashboard-style infrastructure/status information in the normal view;
- Home answers primarily `what needs finishing?` and `what is ready?`;
- expose `New Track` and `Continue last track` prominently;
- surface incomplete tracks with the actual missing production step;
- `Continue` opens the first useful next step instead of a generic overview;
- healthy service/version/canonical-read detail stays silent unless a problem requires attention;
- existing Phase 7-A workflow logic may be reused behind the simplified Home surface rather than remaining a permanent separate daily destination.

### Build 53 — accepted implementation

Build 53 implemented this direction without adding new write authority:

- `dashboard` stays as the internal route, but the visible destination is **Home**;
- Home reads the existing canonical catalog through `getCatalogTracks()`;
- next actions reuse the accepted `buildCatalogWorkflow()` Phase 7-A model;
- the last opened Track is remembered only in local browser storage as a continuation hint;
- Home presents a primary continuation card, compact `To finish / Ready / Released` summary and a short unfinished queue;
- artist-facing production states are `Track / Visuals / Lyrics / Sound / Release`;
- `+ New Track` reuses the existing guarded `TrackCreatePanel` and remains private-read gated;
- detailed Workflow remains available under Advanced during the transition.

Deployed browser review on 2026-08-13 accepted the shell and Home as the new Studio Focus baseline.

Acceptance checkpoint:

`safety/post-studio-focus-build53-real-user-pass-20260813-0032`

## 2 — Tracks becomes the main production library

Approved direction:

- `Tracks` is the daily language; the internal route remains `catalog`;
- favor a visual track library with cover, title, release state and compact completion indicators;
- principal production indicators: Audio, Cover, Lyrics, Canvas/visuals, Release;
- simple useful filters: `To finish`, `Ready`, `Released`, `All`;
- one clear continuation action per track;
- do not require the user to interpret backend/canonical terminology in normal use.

### Build 54 — production-library base

- default filter: **To finish**;
- production filters: **To finish / Ready / Released / All**;
- old implementation-oriented filter language removed from daily use;
- each card shows **Audio / Cover / Lyrics / Canvas / Release**;
- readiness remains sourced from canonical Track data + inherited Workflow model;
- continuation deep-links to existing guarded Track Workspace sections;
- search, Album filter and sorting remain;
- Track Manager remains write owner.

### Build 55 — density/readability corrective

Build 55 corrected oversized covers and small copy with a denser five-card desktop layout, but deployed smoke exposed truncated production-state labels. It did **not** receive REAL USER PASS.

### Build 56 — accepted full production-state labels

Build 56 preserved Build 55 density and changed only the production-state chips:

- wrapping auto-width chips;
- full **Audio / Cover / Lyrics / Canvas / Release** labels mandatory;
- no ellipsis/hidden overflow;
- no workflow/route/authority change.

Deployed review accepted the result. Slice 2 is **COMPLETE — REAL USER PASS**.

Acceptance checkpoint:

`safety/post-studio-focus-build56-real-user-pass-20260813-0143`

## 3 — Track Workspace becomes an artist workshop

Approved target mental model:

```text
Track · Visuals · Lyrics · Release
```

### Track

Combine normal production identity and audio tasks:

- canonical audio / MASTER presence and replacement;
- title;
- Album / Single association;
- release date / release state;
- useful genres and artist-facing metadata;
- secondary metadata under progressive disclosure (`More track details`);
- full metadata editor and SonicTrace remain reachable as deeper routes.

### Visuals

Unify visual identity workflow:

- canonical cover preview / replace;
- canonical Canvas / video preview and import controls;
- LaunchPAD Canvas preview contract = **9:16**;
- Release Campaign visual formats remain MASTER 16:9 + independently anchored 1:1 + 9:16;
- Cover/Canvas state should not be scattered across unrelated daily sections.

### Lyrics

Keep the validated embedded LRC Maker / canonical `lyrics.txt` engine:

- direct synchronizer surface when PRIVATE READ is available;
- compact status such as `Lyrics synchronized`;
- full receipt/private-reread diagnostics remain available when needed;
- public fallback may preview public lyric text but must never masquerade as the canonical editing engine;
- no weakening of private canonical reread authority.

### Release

Unify final production checklist + campaign output:

- Audio readiness;
- Cover readiness;
- Lyrics readiness;
- Canvas readiness where relevant;
- metadata readiness;
- native Release Campaign review/export;
- release copy / tags / provenance where useful;
- keep `canonicalWrite: false` until separately authorized guarded persistence exists.

### Build 57 — initial Track Workshop implementation

Build 57 introduced:

- visible tabs **Track / Visuals / Lyrics / Release**;
- old `overview`, `metadata`, `assets`, `intelligence`, `market`, `versions`, `publishing` route tokens preserved;
- Track: identity/release facts, canonical audio playback, five-state summary, audio-only asset management;
- Visuals: Cover/Thumbnail/Video-Canvas management + previews;
- Lyrics: embedded LRC Maker/canonical `lyrics.txt` path retained;
- Release: compact checklist above native Release Campaign;
- SonicTrace hidden from the daily tab row but still available through Track detail;
- `AssetsManager` gained task-scoped visibility only; all mutations kept the same guarded Track Manager APIs.

#### Build 57 deployed smoke result

The browser smoke proved the regrouping direction but found three corrective faults:

1. Studio had fallen back to `LaunchPAD public catalog`, so the two private `To finish` tracks were absent. The UI still displayed `0 To finish / 31 Released / 31 All`, creating the false impression that drafts had disappeared or been reclassified.
2. Visuals explicitly rendered canonical Canvas in a **16:9** frame instead of the LaunchPAD **9:16** Canvas contract.
3. `EmbeddedLyricsStudio` was still present and correctly gated by PRIVATE READ + canonical assets, but public fallback silently substituted raw public lyrics text, making the engine appear removed.

The observed SonicTrace `Private analysis is locked` page was correct for public fallback; the problem was the preceding Track action looking like a guaranteed full private analysis.

Build 57 is therefore **NOT A REAL USER PASS**.

Candidate checkpoint:

`safety/studio-focus-build57-candidate-20260813`

### Build 58 — Slice 3 smoke corrective

Build 58 preserves the Build 57 Track Workshop architecture and corrects only the smoke findings:

- public Tracks fallback states that private Draft / To finish / Ready tracks are **hidden, not deleted**;
- unavailable private `To finish` / `Ready` counts display `—` rather than false zero;
- public fallback defaults to the Released projection instead of an empty `To finish` view;
- `Open Track Manager ↗` + `Retry private read` recovery actions are available;
- when PRIVATE READ returns, Tracks returns to `To finish`;
- Track Workspace gets a persistent `PUBLIC READ-ONLY FALLBACK` notice;
- public Track no longer promises full SonicTrace analysis while the private layer is locked;
- public Lyrics state shows `LYRICS STUDIO LOCKED` and explains how to restore the engine;
- embedded LRC Maker private-read gate and Phase 7-B receipt/private-reread behavior remain unchanged;
- public lyric text is secondary preview only;
- canonical Canvas preview corrected to **9:16** with `object-fit: contain` to avoid cropping;
- native Release Campaign MASTER 16:9 / 1:1 / 9:16 format pack remains unchanged.

Pre-Build58 checkpoint:

`safety/pre-build58-slice3-smoke-corrective-20260813-0226`

Build 58 remains a **CANDIDATE** until exact-head CI, Pages and deployed browser smoke pass. Slice 4 remains NOT STARTED.

## 4 — SonicTrace becomes primarily an invisible assistant

Approved direction:

- do not remove SonicTrace or Catalog Intelligence;
- surface compact artist-facing conclusions on Track where useful (genre/style, mood, sonic traits, analysis readiness);
- move full diagnostic/intelligence depth behind `View full SonicTrace analysis` / Advanced;
- do not expose embedding vectors, engine internals, node detail or persistence mechanics during routine cover/lyrics/release work;
- keep FULL/PARTIAL/UNAVAILABLE truthfulness and the existing R2 sidecar contract;
- catalog/project intelligence remains available for deliberate analysis but not mandatory daily noise.

SonicTrace Build 08 is REAL USER PASS with a durable FULL R2 profile after canonical reread. Studio Focus does not alter those analysis semantics. Compact artist conclusions remain reserved for **Slice 4**.

## 5 — Progressive disclosure is the global UX architecture

### Level 1 — Artist

Default daily experience:

- what needs doing;
- track files and identity;
- visuals;
- lyrics;
- release readiness;
- direct continuation actions.

### Level 2 — Details

On-demand production detail:

- full metadata;
- provenance;
- detailed SonicTrace conclusions;
- validation states;
- source/history information useful for informed editing.

### Level 3 — Advanced / System

Technical/admin/debug surfaces:

- Track Manager fallback;
- standalone SonicTrace fallback;
- standalone LRC Maker fallback;
- R2/canonical diagnostics as exposed by existing guarded APIs;
- migration archive;
- catalog rebuild;
- receipt detail;
- private/public read-source diagnostics;
- versions / service health / operational maintenance.

Normal operation should not require Level 3 visibility.

### Accepted shell baseline

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Internal routes remain preserved for deep-link/backward compatibility. Advanced hides subsystem architecture from normal use; it does not delete specialist surfaces.

## Non-goals / safety boundaries

Studio Focus must not:

- replace Track Manager as canonical write authority;
- invent a generic write API;
- weaken private canonical rereads;
- make public fallback authoritative;
- invent/reconstruct private tracks from public data;
- silently mutate Album membership/order from Intelligence;
- store source audio in SonicTrace analysis sidecars;
- make Release Campaign browser-local drafts look canonical;
- delete specialist tools merely because their normal UI becomes hidden;
- change LaunchPAD public behavior as a side effect;
- start Phase 7-C automatically.

These boundaries remain active in CI through inherited Phase 5/6, C2.5, C3, Phase 7-A, Release Campaign, Phase 7-B receipt and Studio Focus guards.

## Implementation sequencing

Studio Focus proceeds in small reversible slices:

1. **Build 53 — shell + Home — COMPLETE · REAL USER PASS**;
2. **Build 54 — Tracks production-library base — deployed**;
3. **Build 55 — desktop density/readability — superseded at smoke**;
4. **Build 56 — full readable production-state chips — COMPLETE · REAL USER PASS**;
5. **Build 57 — Track / Visuals / Lyrics / Release workshop — deployed smoke evidence · NOT ACCEPTED**;
6. **Build 58 — Slice 3 smoke corrective — CANDIDATE**;
7. SonicTrace compact summary + Advanced detail;
8. real-user smoke across existing Track, Lyrics, SonicTrace and Release workflows;
9. only after pass, decide whether the separate Workflow destination can be fully absorbed into Home.

Rollback / acceptance anchors:

```text
safety/pre-studio-focus-build53-20260812
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/pre-build55-tracks-readability-20260813-0047
safety/studio-focus-build55-candidate-20260813-0054
safety/pre-build56-status-labels-20260813-0112
safety/studio-focus-build56-candidate-20260813-0119
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/pre-build57-track-workshop-20260813-0143
safety/studio-focus-build57-candidate-20260813
safety/pre-build58-slice3-smoke-corrective-20260813-0226
```

No later slice is considered started merely because it is listed here.
