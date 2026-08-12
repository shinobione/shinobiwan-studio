# CHANGELOG — Studio v0.17.0 · Build 48

Date: 2026-08-12
Codename: `phase7-b-contextual-receipts`

## Added

- typed contextual continuation receipt contract;
- canonical-write vs review-only receipt effects;
- embedded LRC Maker save receipts;
- standalone LRC Maker save receipt parsing with configured-origin filtering;
- SonicTrace save receipts;
- Track-To-Market V3 matching FINAL review-only receipts;
- Track Workspace receipt banner with verifying / verified / review-only / verification-error states;
- canonical private reread requirement before write completion is presented as verified;
- stale async verification guard;
- dedicated Build 48 regression guard and reduced-motion receipt styling.

## Inherited intact from Build 47

- Track-To-Market Bridge `0.2.0` / V3;
- actual selected FINAL artwork preview;
- `data:image/*` validation + 2.5 MB cap;
- integrated artwork strategy and branding provenance;
- expected-origin + exact-child + matching-trackId + FINAL-only gates;
- transient staged review only;
- no R2 / Track Manager write.

## Preserved

- Phase 7-A read-only Workflow / Next Action model;
- Build 45 accepted context/finality transport history;
- Track Manager as protected canonical write authority;
- `lyrics.txt` as sole canonical Lyrics source;
- SonicTrace structured sidecar persistence contract;
- LaunchPAD Build 102 accepted baseline;
- no generic write endpoint.

## Safety

Pre-Build-48 rollback anchor:

` safety/pre-phase7-b-build48-20260812-1008 `

Build 48 is a candidate until real-user smoke passes.
