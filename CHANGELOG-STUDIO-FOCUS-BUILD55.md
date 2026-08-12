# SHINOBIWAN Studio v0.17.5 · Build 55 — Studio Focus / Tracks Readability Corrective

Date: 2026-08-13

Status: **CANDIDATE — CI + deployed real-user smoke required**

## Reason

Build 54's Tracks production-library logic passed the first deployed real-user review, but the desktop composition was visually unbalanced: square covers were too dominant while the useful card copy was too small for comfortable daily use.

Build 55 corrects only that presentation issue.

## Runtime changes

- keep canonical cover artwork square and uncropped;
- on wide desktop layouts, allow a denser library grid (`minmax(240px, 1fr)`) so the real smoke width can show five calmer cards instead of four oversized covers when space allows;
- use a slightly roomier laptop floor (`minmax(260px, 1fr)`);
- increase Track title, Album, date and published-status copy;
- increase Search / Album / Sort labels and field text;
- increase production-filter labels;
- increase Audio / Cover / Lyrics / Canvas / Release state labels;
- increase NEXT label, action title, detail and continuation button;
- preserve the Build 54 one-column mobile layout and raise mobile card text slightly as well.

The corrective is isolated in `src/studio-focus-readability.css`, loaded after `src/studio-focus.css`, so Build 54 structure remains untouched.

## Explicitly unchanged

- `CatalogView.tsx` behavior;
- `To finish / Ready / Released / All` logic;
- default `To finish` filter;
- Phase 7-A `buildCatalogWorkflow()` readiness authority;
- workflow-derived continuation deep links;
- internal `catalog` route;
- TrackCreatePanel/private-read gating;
- Track Manager / R2 authority;
- Track Workspace internals;
- Album behavior;
- SonicTrace semantics;
- LRC Maker integration;
- Release Campaign `canonicalWrite: false` boundary;
- Phase 7-C remains closed.

## Safety

Pre-corrective checkpoint:

`safety/pre-build55-tracks-readability-20260813-0047`

Build 55 adds a dedicated CI guard proving:

- the readability stylesheet is layered after Build 54;
- desktop density is increased without changing cover aspect/cropping;
- artist-facing font sizes are raised;
- no production information is hidden;
- Build 54 catalog behavior and Phase 7-A workflow authority remain intact.

Acceptance requires deployed browser review; CI alone does not grant REAL USER PASS.
