# SHINOBIWAN Studio v0.14.1 · Build 43

Codename: `phase-ux-c3-b-map-clarity`
Date: 2026-08-11

## Real-user finding

The first Build 42 C3-B smoke showed 5 canonical SonicTrace analyses but only 4 plotted points. The data was internally consistent (`512D READY = 4`), because the deterministic map can only plot analyses with a valid finite 512D embedding, but the UI did not explain the mismatch clearly enough.

## Fix

Build 43 makes map eligibility explicit without changing any intelligence math:

- adds `HIDDEN FROM MAP` to the KPI strip;
- map header now reports mapped and hidden counts together;
- lists every analyzed track excluded from the map and names the reason;
- analyzed-track rows expose `512D ready` / `512D missing` instead of the ambiguous generic `Current` state;
- selecting a track without a valid embedding now says `512D embedding unavailable` rather than `No neighbors yet`;
- adds a `Show only map-ready tracks` filter;
- uses the same `validEmbedding()` validator for the map, badges, filter and missing-state explanation;
- keeps acoustic zones, Neural families, similarity, redundancy, outlier, bridge and project sequencing algorithms unchanged.

## Frozen boundaries

- Studio-only UI/clarity hotfix;
- no R2 write or schema change;
- no Worker or Track Manager change/deploy;
- no Album membership/order mutation;
- no LaunchPAD, SonicTrace runtime or LRC Maker change;
- Phase 7 remains locked.

Safety checkpoint: `safety/pre-c3-b-map-clarity-20260811-1950`.

Real-user acceptance remains pending after deployment.