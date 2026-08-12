# SHINOBIWAN Studio v0.17.2 · Build 52

Codename: `phase7-b-postpass-tracks-nav-polish`

Status: **POST-PHASE-7-B MICRO-POLISH**.

## Change

Daily Studio navigation now presents the existing `catalog` route as **Tracks** instead of **Catalog**.

This is intentionally a presentation-only rename:

- route remains `catalog`;
- `CatalogView` and Track Workspace behavior remain unchanged;
- canonical catalog/data contracts remain unchanged;
- no Track Manager, SonicTrace, LRC Maker, Worker or R2 behavior changes;
- no write authority changes;
- no layout/refactor work is included.

## Safety

Base: `2559d2a19e03a87cde4f0abab24e66bb9eca8089` — Phase 7-B Build 51 REAL USER PASS closeout.

Pre-change checkpoint:

`safety/pre-build52-tracks-nav-polish-20260812-2128`

The accepted Phase 7-B receipt contract remains guarded. Build 52 adds a focused regression check ensuring the visible label is `Tracks` while the established `catalog` route and Track Workspace stay intact.

## Stop line

**Phase 7-C is not started by Build 52.**

Any broader Studio information-architecture simplification remains proposal-only until explicitly authorized.
