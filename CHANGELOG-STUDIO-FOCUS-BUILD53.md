# SHINOBIWAN Studio v0.17.3 · Build 53 — Studio Focus / Shell + Home

Date: 2026-08-12

Status: **CANDIDATE — CI + real-user smoke required**

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

## Safety boundaries

Build 53 does **not**:

- change Track Manager or R2 write authority;
- change any operation-specific write API;
- change private canonical reread verification;
- remove Workflow, Catalog Intelligence or System routes;
- change Track Workspace internals yet;
- change Album behavior;
- change SonicTrace analysis semantics;
- change Release Campaign authority;
- start Phase 7-C guided writes.

Rollback checkpoint:

`safety/pre-studio-focus-build53-20260812`

Next planned Studio Focus slices after acceptance:

1. Tracks production-library simplification;
2. Track Workspace regrouping to `Track · Visuals · Lyrics · Release`;
3. compact SonicTrace artist summary + Advanced detail;
4. real-user smoke and only then a decision on fully absorbing the separate Workflow destination.
