# CHANGELOG — Studio v0.17.0 · Build 47

Date: 2026-08-12
Codename: `phase7-b-contextual-receipts`

## Added

- typed Phase 7 continuation receipt contract;
- canonical-write vs review-only receipt effects;
- LRC Maker embedded save receipts;
- standalone LRC Maker save receipt parsing with configured-origin filtering;
- SonicTrace save receipts;
- Track-To-Market FINAL review-only receipts;
- Track Workspace receipt banner with verifying / verified / review-only / verification-error states;
- stale async receipt protection;
- canonical private reread requirement before write completion is presented as verified;
- dedicated Phase 7-B regression guard and reduced-motion receipt styling.

## Preserved

- Phase 7-A read-only Workflow and Next Action model;
- Track Manager as protected canonical write authority;
- `lyrics.txt` as the sole canonical Lyrics source;
- SonicTrace structured sidecar persistence contract;
- Track-To-Market Build 45 matching-trackId and FINAL-only gates;
- Track-To-Market FINAL as transient review state only;
- LaunchPAD Build 102 accepted baseline;
- no new Worker or generic write endpoint.

## Safety

Parent: Studio Build 46 Phase 7-A REAL USER PASS + final PHASE UX closeout.

Rollback anchor: `safety/pre-phase7-b-build47-20260812-0948`.

Build 47 is a candidate until real-user smoke passes.
