# SHINOBIWAN Studio Changelog

## 0.3.2 — Build 4 — 2026-08-08

Codename: `synced-lyrics-semantics`

### Changed

- replaced the Content Health requirement `Lyrics LRC` with `Synced Lyrics`;
- synchronized lyrics now score 10/10 when timestamp data is detected in the canonical lyrics source;
- detailed track loading also derives synchronization from returned timestamp segments, even if the upstream boolean flag is stale;
- removed the misleading mandatory `Lyrics LRC` asset row from Track Workspace;
- clarified that `.lrc` is an optional compatibility/export sidecar, not a second required source of truth;
- added centralized Studio release metadata (`src/release.ts`);
- added explicit build numbering and integration safety documentation.

### Safety

No production write path changed. No LaunchPAD, Track Manager, SonicTrace or LRC Maker runtime code changed in this release.

Rollback target: `safety/pre-integration-20260808-1048`.

## 0.3.1 — Build 3 — 2026-08-08

- raised audited microcopy at 8px or smaller to an 11px readability floor;
- no functional write-path changes.

## 0.3.0 — Build 2 — 2026-08-08

- added the Track Workspace;
- added Content Health V1;
- added Overview, Intelligence, Lyrics, Assets, Versions, Metadata and Publishing views.

## 0.2.0 — Build 1 — 2026-08-08

- connected the live LaunchPAD public catalog read layer;
- added catalog search, filters, sorting and track routing.
