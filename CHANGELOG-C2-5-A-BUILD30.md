# Studio v0.10.8 / Build 30 — PHASE UX C2.5-A polish

Date: 2026-08-09

- removed the hover-triggered horizontal scrollbar from Intelligence track selection;
- warmed and cached the canonical Catalog read in the frontend and added an animated accessible skeleton/loading state;
- force-refreshes the Catalog snapshot after successful New Track creation;
- consumes LRC Maker embed 6.3.7 for in-flow confirmations and Studio-consistent lyric line states;
- added dedicated regression coverage;
- no Worker deployment, R2 mutation, Album schema/migration, C2.5-B, C3 or Phase 7 work.

Safety refs:
- `safety/pre-c2-5-a-studio-ux-polish-20260809-2037`
- `safety/pre-c2-5-a-studio-embed-polish-20260809-2037`
