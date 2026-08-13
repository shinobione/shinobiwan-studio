# SHINOBIWAN Studio v0.17.3 · Build 53 — Studio Focus / Shell + Home

Date: 2026-08-12

Status: **COMPLETE — REAL USER PASS**

## Goal

Start the user-approved **Studio Focus — Production-First UX** without weakening any validated specialist or canonical contract.

## Runtime changes

- daily sidebar reduced to **Home / Tracks / Albums**;
- **Workflow / Intelligence / System** preserved under a collapsed **Advanced** group;
- `Dashboard` becomes artist-facing **Home** while the internal `dashboard` route stays stable;
- Home reads the existing canonical catalog and Phase 7-A workflow model;
- Home surfaces a single continuation card, a compact production queue and artist-facing Track / Visuals / Lyrics / Sound / Release states;
- last opened Track is remembered locally only as a continuation hint;
- `+ New Track` reuses the existing guarded `TrackCreatePanel` and remains private-read gated;
- healthy Track Manager/SonicTrace internals stay behind the existing compact System status control.

## Real-user acceptance

Deployed browser review on 2026-08-13 accepted the Slice 1 experience as working cleanly and matching the intended production-first direction. The user explicitly validated the simplified shell and Home before authorizing Slice 2.

Accepted behaviors:

- daily navigation is **Home / Tracks / Albums**;
- specialist surfaces remain available under **Advanced**;
- Home is immediately actionable rather than infrastructure-heavy;
- continuation / next-action presentation is coherent enough to become the baseline for the next Studio Focus slice.

Acceptance checkpoint:

`safety/post-studio-focus-build53-real-user-pass-20260813-0032`

## Safety boundaries

Build 53 did **not**:

- change Track Manager or R2 write authority;
- change any operation-specific write API;
- change private canonical reread verification;
- remove Workflow, Catalog Intelligence or System routes;
- change Track Workspace internals;
- change Album behavior;
- change SonicTrace analysis semantics;
- change Release Campaign authority;
- start Phase 7-C guided writes.

Rollback checkpoint:

`safety/pre-studio-focus-build53-20260812`

Next Studio Focus slices:

1. **Build 54 — Tracks production-library simplification**;
2. Track Workspace regrouping to `Track · Visuals · Lyrics · Release`;
3. compact SonicTrace artist summary + Advanced detail;
4. cross-flow real-user smoke and only then a decision on fully absorbing the separate Workflow destination.
