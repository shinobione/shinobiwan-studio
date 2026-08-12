# SHINOBIWAN Studio v0.17.4 · Build 54 — Studio Focus / Tracks Production Library

Date: 2026-08-13

Status: **CANDIDATE — CI + real-user smoke required**

## Goal

Turn `Tracks` from a catalog/debug-oriented surface into the main artist production library while preserving the accepted Build 53 shell and every canonical authority boundary.

## Runtime changes

- internal route remains `catalog`; visible product language remains **Tracks**;
- default view becomes **To finish** so unfinished production work appears first;
- simple production filters: **To finish / Ready / Released / All**;
- counts are derived from the accepted Phase 7-A workflow model rather than a second readiness implementation;
- legacy implementation-oriented content filters (`missing-video`, `timestamped`, `core-complete`, etc.) are removed from the daily surface;
- each card surfaces only five artist-facing states: **Audio / Cover / Lyrics / Canvas / Release**;
- Canvas remains informative/optional at this slice because the accepted Phase 7-A readiness contract does not make video mandatory for every release;
- one clear continuation action deep-links to the existing guarded Track Workspace section selected by `workflow.nextAction.section`;
- `+ New Track` continues to reuse the existing private-read-gated `TrackCreatePanel`;
- search, Album filter and sort remain available without backend/canonical jargon in normal healthy use;
- responsive behavior is preserved with one-column production cards on smaller screens.

## Safety boundaries

Build 54 does **not**:

- change Track Manager or R2 write authority;
- change canonical Track data or schema;
- change the Phase 7-A workflow algorithm;
- change private canonical reread verification;
- change Track Workspace internals yet;
- change Album behavior or membership;
- change SonicTrace analysis semantics;
- change LRC Maker integration;
- change Release Campaign authority or `canonicalWrite: false`;
- start Phase 7-C guided writes.

Pre-Slice acceptance checkpoint:

`safety/post-studio-focus-build53-real-user-pass-20260813-0032`

Next after Build 54 acceptance:

1. Track Workspace regrouping to `Track · Visuals · Lyrics · Release`;
2. compact SonicTrace artist summary + Advanced detail;
3. cross-flow real-user smoke;
4. only then decide whether the separate Workflow destination can be fully absorbed into Home.
