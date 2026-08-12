# SHINOBIWAN STUDIO — STUDIO FOCUS / PRODUCTION-FIRST UX

Status: **ROADMAP APPROVED · IMPLEMENTATION IN PROGRESS · BUILD 54 SLICE 2 CANDIDATE**

Approved by real-user review on 2026-08-12 after Studio v0.17.2 · Build 52.
Implementation opened with Studio v0.17.3 · Build 53 and continues with v0.17.4 · Build 54.

This roadmap item does **not** replace any validated canonical authority or remove specialist capabilities. It changes the daily information architecture so Studio behaves like an artist production tool rather than exposing implementation detail by default.

## Product rule

> When everything works, the technical machinery disappears. When something fails, the technical detail remains available.

The validated Track Manager / R2 / SonicTrace / LRC Maker / receipt / private-reread architecture remains intact underneath the simplified experience.

## Implementation status

| Slice | Scope | Status |
|---|---|---|
| Build 52 | visible `Catalog` → `Tracks` polish | **COMPLETE** |
| Build 53 / Slice 1 | production-first shell + actionable Home | **COMPLETE — REAL USER PASS** |
| Build 54 / Slice 2 | Tracks production-library simplification | **CANDIDATE — CI + real-user smoke required** |
| Slice 3 | Track Workspace regrouping to `Track · Visuals · Lyrics · Release` | **PLANNED / NOT STARTED** |
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

- `Tracks` is the daily language; the internal route remains `catalog` unless a future migration has a concrete technical benefit;
- favor a visual track library with cover, title, release state and compact completion indicators;
- principal production indicators: Audio, Cover, Lyrics, Canvas/visuals, Release;
- simple useful filters such as `To finish`, `Ready`, `Released`;
- one clear continuation action per track;
- do not require the user to interpret backend/canonical terminology in normal use.

### Build 54 — candidate implementation

Build 54 implements Slice 2 while reusing the accepted Phase 7-A readiness model:

- default filter is **To finish**;
- production filters are **To finish / Ready / Released / All**;
- the old implementation-oriented `missing-video / timestamped / core-complete` filter language leaves the daily surface;
- each track card shows only **Audio / Cover / Lyrics / Canvas / Release**;
- Audio/Cover/Lyrics/Release state comes from canonical Track data and the inherited Workflow model;
- Canvas is shown as ready when canonical video exists and as neutral/optional when absent because the accepted Phase 7-A contract does not require Canvas for every release;
- the card's only primary action deep-links to `workflow.nextAction.section` in the already guarded Track Workspace;
- search, Album filter and sorting stay available;
- healthy result copy no longer says `private canonical` / `public fallback`; read-only mode is surfaced only when relevant;
- `+ New Track` still uses `TrackCreatePanel` and Track Manager remains the write owner.

Build 54 changes presentation and continuation only. It does **not** change the Workflow algorithm or define a second readiness authority.

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
- secondary or obscure metadata under progressive disclosure (`More details`).

Do not force a normal user to reason about separate `Overview`, `Metadata` and `Assets` concepts when those surfaces describe one track.

### Visuals

Unify the visual identity workflow:

- canonical cover preview / replace;
- Canvas / video preview, missing state, import/create path;
- Release Campaign visual formats when relevant: MASTER 16:9, anchored 1:1 and anchored 9:16;
- preserve the validated MASTER + independently anchored derivative contract;
- avoid scattering Cover, Canvas and campaign visual state across unrelated daily sections.

### Lyrics

Keep the validated embedded LRC Maker / canonical `lyrics.txt` engine but simplify normal feedback:

- direct lyrics editor/synchronizer surface;
- compact status such as `Lyrics synchronized`;
- successful save/receipt can collapse to a short `Lyrics saved & verified` acknowledgement;
- full Track Manager private-reread / receipt diagnostic wording remains accessible under Details/Advanced for debugging;
- no weakening of the private canonical reread authority.

### Release

Unify the final production checklist and campaign output:

- Audio readiness;
- Cover readiness;
- Lyrics readiness;
- Canvas readiness where required by the chosen release workflow;
- metadata readiness;
- native Release Campaign visual review/export;
- release copy / tags / provenance where useful;
- retain `canonicalWrite: false` and existing review-only authority for campaign export until a separately authorized guarded persistence phase exists.

Build 54 deliberately leaves the current Track Workspace internals untouched. This regrouping remains reserved for **Slice 3** after Build 54 acceptance.

## 4 — SonicTrace becomes primarily an invisible assistant

Approved direction:

- do not remove SonicTrace or Catalog Intelligence;
- surface compact artist-facing conclusions on the track where useful (genre/style, mood, sonic traits, analysis readiness);
- move full diagnostic/intelligence depth behind `View full SonicTrace analysis` / Advanced;
- do not expose embedding vectors, engine internals, node detail or persistence mechanics during routine cover/lyrics/release work;
- keep full FULL/PARTIAL/UNAVAILABLE truthfulness and the existing R2 sidecar contract;
- catalog/project intelligence remains available for deliberate analysis but not as mandatory daily noise.

SonicTrace Build 08 is REAL USER PASS with a durable FULL R2 profile after canonical reread. Studio Focus does not alter those analysis semantics. Compact presentation remains reserved for **Slice 4**.

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

### Build 53 shell baseline

The accepted daily navigation is:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

The internal routes remain preserved for deep-link/backward compatibility. Advanced hides subsystem architecture from normal use; it does not delete any specialist surface.

## Non-goals / safety boundaries

Studio Focus must not:

- replace Track Manager as canonical write authority;
- invent a new generic write API;
- weaken private canonical rereads;
- make public fallback authoritative;
- silently mutate Album membership/order from Intelligence;
- store source audio in SonicTrace analysis sidecars;
- make Release Campaign browser-local drafts look canonical;
- delete specialist tools merely because their normal UI becomes hidden;
- change LaunchPAD public behavior as a side effect;
- start Phase 7-C automatically.

These boundaries remain active in CI through inherited Phase 5/6, C2.5, C3, Phase 7-A, Release Campaign, Phase 7-B receipt and Studio Focus guards.

## Implementation sequencing

The prerequisite SonicTrace mastering/PARTIAL fault was resolved before Studio Focus: SonicTrace V2-E Build 08 reached FULL in real use, was saved, and was canonically reread from R2.

Studio Focus proceeds in small reversible slices:

1. **Build 53 — shell + Home — COMPLETE · REAL USER PASS**;
2. **Build 54 — Tracks production library — CANDIDATE · CI + real-user smoke required**;
3. Track Workspace regrouping (`Track · Visuals · Lyrics · Release`);
4. SonicTrace compact summary + Advanced detail;
5. real-user smoke across existing Track, Lyrics, SonicTrace and Release workflows;
6. only after pass, decide whether the separate Workflow destination can be fully absorbed into Home.

Rollback / acceptance anchors:

```text
safety/pre-studio-focus-build53-20260812
safety/post-studio-focus-build53-real-user-pass-20260813-0032
```

No later slice is considered started merely because it is listed here.
