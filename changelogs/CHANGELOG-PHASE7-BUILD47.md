# SHINOBIWAN Studio v0.16.1 · Build 47

Codename: `phase7-a-ttm-v3-staged-preview`  
Date: 2026-08-12

## Scope

Build 47 is a bounded Phase 7-A corrective/integration slice. It consumes Track-To-Market V0.2.0 / Bridge V3 and improves Release Pack review without adding any canonical write path.

## Delivered

- Studio sends Bridge protocol `0.2.0`.
- New TTM sessions default to `artworkStrategy=integrated`.
- FINAL returns may contain a compressed preview of the actual selected cover.
- Studio validates preview payload type and caps it at 2.5 MB before rendering.
- Staged FINAL panel now displays:
  - artwork preview;
  - provider / source model;
  - artwork strategy;
  - branding treatment;
  - mode;
  - bridge version;
  - SoundCloud copy;
  - social caption.
- Existing origin, exact child Window, matching canonical trackId and FINAL-only gates remain mandatory.

## Safety boundary

Build 47 remains **Stage + review only**:

- no R2 write;
- no Track Manager mutation API import;
- no canonical cover replacement;
- no preview persistence;
- no new Worker;
- no LaunchPAD change;
- no automatic publish action.

## Regression guards

Historical Build 45 and Build 46 guards were generalized only where they had been tied to literal UI copy/version numbers:

- Build 45 guard now asserts the actual no-R2-write and no-Track-Manager-mutation invariants instead of one historical sentence.
- Build 46 guard now accepts authorized `0.16.x` Phase 7 successors while still protecting the complete read-only Workflow model.

New guard:

`scripts/test-phase7-a-build47-ttm-v3.mjs`

## Rollback

`safety/pre-build47-ttm-v3-preview-20260812`

## Dependency

Track-To-Market V0.2.0 must be deployed before Build 47 is merged/deployed.
