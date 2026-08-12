# SHINOBIWAN STUDIO — STUDIO FOCUS / PRODUCTION-FIRST UX

Status: **ROADMAP APPROVED · PLANNED · NOT STARTED**

Approved by real-user review on 2026-08-12 after Studio v0.17.2 · Build 52.

This roadmap item does **not** replace any validated canonical authority or remove specialist capabilities. It changes the daily information architecture so Studio behaves like an artist production tool rather than exposing implementation detail by default.

## Product rule

> When everything works, the technical machinery disappears. When something fails, the technical detail remains available.

The validated Track Manager / R2 / SonicTrace / LRC Maker / receipt / private-reread architecture remains intact underneath the simplified experience.

## 1 — Home becomes the actionable continuation surface

Approved direction:

- reduce dashboard-style infrastructure/status information in the normal view;
- Home answers primarily `what needs finishing?` and `what is ready?`;
- expose `New Track` and `Continue last track` prominently;
- surface incomplete tracks with the actual missing production step;
- `Continue` opens the first useful next step instead of a generic overview;
- healthy service/version/canonical-read detail stays silent unless a problem requires attention;
- existing Phase 7-A workflow logic may be reused behind the simplified Home surface rather than remaining a permanent separate daily destination.

## 2 — Tracks becomes the main production library

Approved direction:

- `Tracks` is the daily language; the internal route may remain `catalog` unless a future migration has a concrete technical benefit;
- favor a visual track library with cover, title, release state and compact completion indicators;
- principal production indicators: Audio, Cover, Lyrics, Canvas/visuals, Release;
- simple useful filters such as `À finir`, `Prêts`, `Sortis`;
- one clear `Continue` action per track;
- do not require the user to interpret backend/canonical terminology in normal use.

Build 52 already completed the presentation-only navigation rename `Catalog` → `Tracks`; the broader Tracks simplification remains unimplemented.

## 3 — Track Workspace becomes an artist workshop

Approved target mental model:

```text
Track · Visuals · Lyrics · Release
```

### Track

Combine the normal production identity and audio tasks:

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

Keep the validated embedded LRC Maker / canonical `lyrics.txt` engine but simplify the normal feedback:

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

## 4 — SonicTrace becomes primarily an invisible assistant

Approved direction:

- do not remove SonicTrace or Catalog Intelligence;
- surface compact artist-facing conclusions on the track where useful (genre/style, mood, sonic traits, analysis readiness);
- move full diagnostic/intelligence depth behind `View full SonicTrace analysis` / Advanced;
- do not expose embedding vectors, engine internals, node detail or persistence mechanics during routine cover/lyrics/release work;
- keep full FULL/PARTIAL/UNAVAILABLE truthfulness and the existing R2 sidecar contract;
- catalog/project intelligence remains available for deliberate analysis but not as mandatory daily noise.

## 5 — Progressive disclosure becomes the global UX architecture

Approved three-layer model:

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

## Proposed daily navigation

Target direction, subject to implementation review:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow / diagnostics as needed
  Intelligence
  System
```

The exact grouping may evolve during implementation, but the product rule is frozen: **daily navigation represents artist tasks, not subsystem architecture**.

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

## Implementation sequencing

Before implementation, resolve current SonicTrace mastering/PARTIAL diagnostics so UX simplification does not hide a real engine fault.

Then implement Studio Focus in small reversible slices, keeping current validated contracts guarded by CI and checkpoints. Preferred order:

1. navigation / progressive-disclosure shell;
2. Home continuation simplification;
3. Tracks library simplification;
4. Track Workspace regrouping (`Track · Visuals · Lyrics · Release`);
5. SonicTrace compact summary + Advanced detail;
6. real-user smoke across existing Track, Lyrics, SonicTrace and Release workflows;
7. only after pass, decide whether the separate Workflow destination can be fully absorbed into Home.

No implementation is claimed by this document.
