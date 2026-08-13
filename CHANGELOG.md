# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records are organized under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.1 · Build 61 — 2026-08-13

Codename: `studio-focus-slice4-polish`  
Status: **COMPLETE — REAL USER PASS**

Accepted Studio Focus Slice 4 baseline:

- production/publication semantics remain separated (`Needs attention / Production complete` vs `Published / Drafts`);
- compact artist-facing SonicTrace summary lives in Track;
- FULL / PARTIAL / UNAVAILABLE / OUTDATED truth states remain inherited from the protected SonicTrace profile contract;
- Style / Mood / Character, Arrangement / Master and Palette are composed as a compact artist summary;
- full SonicTrace diagnostics remain behind `Details / Advanced`;
- `PHASE 7-B · FOCUS` release/status card is anchored at the bottom of the desktop sidebar;
- no canonical authority changed;
- Release Campaign remains `canonicalWrite: false`;
- Phase 7-C remains **CLOSED / NOT STARTED**.

Real-user acceptance checkpoint:

```text
safety/post-studio-focus-build61-real-user-pass-20260813-1347
```

Full acceptance evidence: [`docs/STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md).

## Immediate predecessor

### v0.19.0 · Build 60 — historical deployed candidate

Build 60 introduced the compact SonicTrace artist summary and clarified production vs publication. Real-user smoke found two presentation issues (sidebar footer placement and under-composed SonicTrace card), so Build 60 was **not** promoted to REAL USER PASS. Build 61 is its accepted corrective.

Detailed record: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD60.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD60.md).

## Detailed history

- Build 30→61 milestone logs: [`changelogs/README.md`](changelogs/README.md)
- Original monolithic history through Build 29: [`changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md`](changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md)
- Current roadmap: [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- Documentation map: [`docs/README.md`](docs/README.md)

Repository cleanup on 2026-08-13 moved the detailed `CHANGELOG-*.md` records out of the repository root **without altering their historical contents**. The root now keeps only this current changelog entry point.
