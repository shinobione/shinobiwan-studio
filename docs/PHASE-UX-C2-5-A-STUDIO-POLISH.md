# PHASE UX C2.5-A — Studio Frontend Polish

Studio release candidate: `v0.10.8` / Build `30`

Codename: `phase-ux-c2-5-a-polish`

## Real-user findings

The C2.5-A review identified three Studio presentation/perceived-performance issues that are independent of the future canonical Album architecture:

1. Intelligence showed a horizontal scrollbar when a track row was hovered;
2. embedded Lyrics confirmations and selected/current line styling were visually intrusive or outside the Studio palette;
3. Catalog could sit on a mostly blank loading surface long enough to look frozen.

## Intelligence correction

The scrollbar was caused by a `translateX(2px)` hover transform inside `.intelligence-track-list`, which itself used `overflow:auto`.

Build 30 keeps the list vertical-only (`overflow-x:hidden`) and replaces translated hover motion with border/background feedback. Keyboard focus remains explicit.

## Catalog loading/perceived performance

Catalog now starts warming its canonical read when the Studio shell imports the Catalog module, before the user necessarily opens the Catalog route.

A module-level in-memory snapshot and shared in-flight request avoid repeating the same initial wait during route revisits. After a real catalog-changing action such as successful New Track creation, Studio forces a fresh canonical read rather than trusting the snapshot.

While no snapshot is available, the blank wait is replaced by:

- an accessible `role=status` loading message;
- a teal/cyan activity indicator;
- responsive skeleton cards matching the Catalog grid;
- reduced-motion handling.

This is deliberately a frontend optimization. It does not add an API, alter R2 reads, change Track Manager or modify catalog authority.

## Embedded Lyrics dependency

Build 30 pins LRC Maker embed `6.3.7`.

That release changes embedded presentation only:

- cleanup/audio confirmations are in-flow rather than fixed overlays;
- selected/current lyric lines use readable Studio teal/cyan states;
- standalone LRC Maker presentation is not changed;
- canonical Lyrics behavior remains the proven 6.3.6 contract.

## Frozen contracts

- `tracks/<slug>/lyrics.txt` remains the only canonical Lyrics source;
- timestamps inside `lyrics.txt` remain synchronization authority;
- `.lrc` remains export/compatibility only;
- Track Manager remains the only R2 write authority;
- no Worker source or deployment change;
- no R2 mutation/migration;
- no canonical Album schema/projection work;
- C2.5-B is not started;
- C3 SonicTrace V2-E parity remains suspended;
- final PHASE UX checkpoint is not created;
- Phase 7 is not started.

## Safety refs

- Studio: `safety/pre-c2-5-a-studio-ux-polish-20260809-2037`
- LRC Maker: `safety/pre-c2-5-a-studio-embed-polish-20260809-2037`

## Verification

`test-phase-ux-c2-5-a-polish.mjs` guards Catalog warming/cache/skeleton behavior, the Intelligence overflow correction, LRC Maker embed `6.3.7`, Studio `v0.10.8` / Build `30`, and final stylesheet ordering.

The LRC Maker producer also has a separate embed UX guard. CI and Pages deployment for LRC Maker must succeed before Studio is promoted, then Studio CI/Pages and a real-user browser smoke remain required.
