# SHINOBIWAN Studio v0.17.6 · Build 56 — Studio Focus / Tracks Status Labels

Date: 2026-08-13

Status: **COMPLETE — REAL USER PASS**

## Reason

Build 55 improved desktop density and general text size, but deployed real-user smoke showed that its five equal production-state columns were too narrow at five cards per row. The artist-facing states became truncated (`Au… / Co… / Lyr…`).

Build 56 fixed only this readability fault while preserving the denser card layout.

## Runtime change

- add `src/studio-focus-status-labels.css` after the Build 55 readability layer;
- convert the production-state strip from five fixed grid columns to wrapping auto-width chips;
- keep complete labels: **Audio / Cover / Lyrics / Canvas / Release**;
- explicitly disable ellipsis/hiding for these labels;
- allow the chips to form two rows naturally on narrower desktop cards;
- keep the five-card wide-desktop density introduced by Build 55;
- keep square canonical artwork untouched;
- preserve mobile readability with slightly larger status chips.

## Real-user acceptance

Deployed browser review on 2026-08-13 confirmed the intended Slice 2 balance on the normal desktop viewport:

- five-card wide-desktop density accepted;
- covers no longer dominate the library;
- Track title / album / next-action copy remains comfortably readable;
- **Audio / Cover / Lyrics / Canvas / Release** render in full, wrapping naturally to two rows instead of ellipsis;
- `To finish / Ready / Released / All` and continuation behavior remained correct.

Acceptance checkpoint:

`safety/post-studio-focus-build56-real-user-pass-20260813-0143`

## Explicitly unchanged

- `CatalogView.tsx` structure and behavior;
- production-state semantics/colors;
- `To finish / Ready / Released / All` logic;
- Phase 7-A workflow/readiness authority;
- continuation deep links;
- TrackCreatePanel/private-read gating;
- Track Manager / R2 authority;
- Track Workspace internals at Build 56;
- Albums;
- SonicTrace;
- LRC Maker;
- Release Campaign `canonicalWrite: false`;
- Phase 7-C remains closed.

## Safety

Pre-corrective checkpoint:

`safety/pre-build56-status-labels-20260813-0112`

Candidate checkpoint:

`safety/studio-focus-build56-candidate-20260813-0119`

Dedicated Build 56 guard proves:

- the status-label stylesheet loads after Build 54 + Build 55 layers;
- production states use wrapping flex chips;
- `overflow:hidden` / `text-overflow:ellipsis` are absent from the Build 56 status layer;
- all five full labels remain present in the Tracks component;
- the Build 55 card-density guard still runs as ancestry.

Build 56 is the accepted Studio Focus Slice 2 baseline. Slice 3 starts only from this accepted main/checkpoint.
