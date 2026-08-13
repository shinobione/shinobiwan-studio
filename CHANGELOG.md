# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records are organized under [`changelogs/`](changelogs/README.md).

## Current deployed candidate

### v0.19.3 · Build 68 — 2026-08-13

Codename: `studio-focus-slice4-home-lead-priority`  
Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

Home lead priority corrective:

- a production-complete track can no longer remain the large Home lead merely because it was the last track opened;
- Home keeps the last-opened track only while that track is unfinished;
- otherwise Home selects the first unfinished workflow item;
- when no track needs attention, Home shows `PRODUCTION QUEUE CLEAR` while retaining the summary counters;
- no Worker route, R2 mutation, Track Manager authority change or public Worker deployment;
- Phase 7-C runtime Slice 1 remains not started.

Exact candidate evidence:

```text
Safety before change  safety/pre-build68-home-lead-priority-20260813-2228
Feature branch        agent/build68-home-lead-priority
PR                    #96
Tested head           cf5131f489d72ca5fae72544dacd9eaecc78077f
Validation run        31741483430 · SUCCESS
Merge / current main  5c0428e500b4e6d5c9d1069bb440eac78b79955e
Pages deploy run      31743413418 · SUCCESS
Real-user smoke       PENDING
```

Detailed record: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md).

## Current accepted release

### v0.19.3 · Build 67 — 2026-08-13

Codename: `studio-focus-slice4-lyrics-source-anchor`  
Status: **COMPLETE — REAL USER PASS**

Foundation Regression Repair closeout:

- private/draft Album artwork renders from protected canonical Album media rather than depending on public projection;
- generic Track metadata no longer edits the Track-side Album cache;
- explicit Album membership verification/repair respects authoritative `album.trackIds` and guarded Track Manager operations;
- Track Manager v5.21 removes `album` from the generic Studio metadata allowlist and adds protected Album media reads;
- Build 64 is preserved as a deployed candidate that **FAILED REAL USER SMOKE** because of a self-triggering Lyrics `MutationObserver` loop;
- Build 65 fixed the Track/Lyrics crash without changing backend/write authority;
- Build 66 made Audio, Cover, Thumbnail, Lyrics TXT and Video/Canvas roles visually distinct and exposed the missing-master-audio synchronization prerequisite;
- Build 67 moves canonical `LYRICS TXT` into a permanent top-level Lyrics source block before synchronization;
- public fallback remains read-only and public Worker v2.7 was not redeployed;
- Phase 7-C foundation-repair gate is cleared, while runtime Slice 1 remains not yet started.

Accepted deployment evidence:

```text
Studio tested head    6c1d801b14ae8daedfb246da539a42125f7c80d9
Studio validation     31738652169    SUCCESS
Studio accepted main  5f061a460f17e27b9c2f06fdcbdda2f34e07e240
Studio Pages run      31738982707    SUCCESS
Track Manager         v5.21
Studio bridge         v1.11
TM Worker run         31728992790    SUCCESS · admin only
TM Worker Version ID  0e1b9a3f-eabd-432e-8872-24ff0a9c085f
Public Worker         v2.7            unchanged
```

Full acceptance evidence: [`docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md).

## Immediate predecessor

### v0.19.2 · Build 62 — Studio Focus program closeout REAL USER PASS

Build 62 remains the accepted Studio Focus program closeout. Build 67 is a later foundation-repair closeout and does not create a new Studio Focus slice.

Historical Build 63 remains superseded and is not reused. Build 64 remains failed-smoke evidence; Builds 65 and 66 are corrective lineage superseded by Build 67.

## Detailed history

- Build 68 candidate: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md)
- Foundation repair closeout: [`docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- Build 64 failed-smoke repair record: [`docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md`](docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md)
- Build 67 detailed record: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD67.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD67.md)
- Build 30→61 milestone logs: [`changelogs/README.md`](changelogs/README.md)
- Build 62 corrective record: [`docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md`](docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md)
- Studio Focus final closeout: [`docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)
- Original monolithic history through Build 29: [`changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md`](changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md)
- Current roadmap: [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- Next-session handoff: [`docs/NEXT-SESSION-HANDOFF.md`](docs/NEXT-SESSION-HANDOFF.md)
- Documentation map: [`docs/README.md`](docs/README.md)

Repository cleanup on 2026-08-13 moved detailed `CHANGELOG-*.md` records out of the repository root **without altering historical contents**. The root keeps only this current changelog entry point.
