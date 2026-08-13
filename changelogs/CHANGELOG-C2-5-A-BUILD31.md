# SHINOBIWAN Studio — v0.10.9 / Build 31

Codename: `phase-ux-c2-5-a-lrc-638`

## PHASE UX C2.5-A — Lyrics embed cascade correction

Real-user smoke of Build 30 showed a partial visual correction: Studio teal/cyan borders were visible around selected/current Lyrics rows, while the row fill remained purple. The host integration itself was correct; the LRC Maker standalone skin was winning the Shadow DOM cascade with historical `!important` purple backgrounds.

Build 31:

- pins embedded Lyrics Studio to LRC Maker `6.3.8`;
- keeps the existing canonical `trackId`-only embed contract;
- keeps in-flow cleanup/audio confirmations from 6.3.7;
- relies on 6.3.8 scoped authoritative dark teal/cyan row states while standalone LRC Maker remains unchanged;
- advances all Studio release/Phase 6/C2.5-A regression guards to `0.10.9` / Build `31`;
- preserves Build 30 Catalog warm/cache/skeleton and Intelligence overflow fixes;
- changes no Track Manager route, Worker, R2 object, Album schema, SonicTrace persistence or Phase 7 runtime.

Promotion dependency: LRC Maker `6.3.8` must be merged and its Pages artifact published before Studio Build 31 is promoted.

Safety ref: `safety/pre-build31-lrc-638-20260809-2128`.
