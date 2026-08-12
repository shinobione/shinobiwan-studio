# SHINOBIWAN Studio v0.17.6 · Build 56 — Studio Focus / Tracks Status Labels

Date: 2026-08-13

Status: **CANDIDATE — CI + deployed real-user smoke required**

## Reason

Build 55 improved desktop density and general text size, but deployed real-user smoke showed that its five equal production-state columns were too narrow at five cards per row. The artist-facing states became truncated (`Au… / Co… / Lyr…`).

Build 56 fixes only this readability fault while preserving the denser card layout.

## Runtime change

- add `src/studio-focus-status-labels.css` after the Build 55 readability layer;
- convert the production-state strip from five fixed grid columns to wrapping auto-width chips;
- keep complete labels: **Audio / Cover / Lyrics / Canvas / Release**;
- explicitly disable ellipsis/hiding for these labels;
- allow the chips to form two rows naturally on narrower desktop cards;
- keep the five-card wide-desktop density introduced by Build 55;
- keep square canonical artwork untouched;
- preserve mobile readability with slightly larger status chips.

## Explicitly unchanged

- `CatalogView.tsx` structure and behavior;
- production-state semantics/colors;
- `To finish / Ready / Released / All` logic;
- Phase 7-A workflow/readiness authority;
- continuation deep links;
- TrackCreatePanel/private-read gating;
- Track Manager / R2 authority;
- Track Workspace internals;
- Albums;
- SonicTrace;
- LRC Maker;
- Release Campaign `canonicalWrite: false`;
- Phase 7-C remains closed.

## Safety

Pre-corrective checkpoint:

`safety/pre-build56-status-labels-20260813-0112`

Dedicated Build 56 guard proves:

- the status-label stylesheet loads after Build 54 + Build 55 layers;
- production states use wrapping flex chips;
- `overflow:hidden` / `text-overflow:ellipsis` are absent from the Build 56 status layer;
- all five full labels remain present in the Tracks component;
- the Build 55 card-density guard still runs as ancestry.

Acceptance requires deployed browser review. CI alone does not grant REAL USER PASS or close Studio Focus Slice 2.
