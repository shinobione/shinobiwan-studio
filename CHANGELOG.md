# SHINOBIWAN Studio Changelog

## 0.4.0 — Build 5 — 2026-08-08

Codename: `private-read-bridge`

### Added

- authenticated GET-only integration with the LaunchPAD Build 65 / Track Manager v5.8 Studio bridge;
- private-first catalog loading for canonical manifests, drafts and Track Manager quality state;
- automatic LaunchPAD public read-only fallback when Cloudflare Access/CORS/browser credentials are unavailable;
- explicit `PRIVATE READ` / `PUBLIC FALLBACK` provenance in Dashboard, Catalog and Track Workspace;
- Track Manager quality/publishability/error/warning visibility in the Publishing workspace when private reads succeed;
- `scripts/check-private-read-contract.mjs`, executed by the production build, to regression-protect the GET-only/write-locked contract.

### Changed

- published tracks merge private canonical/admin state with the proven LaunchPAD public media and lyrics URLs;
- private-only tracks can expose protected Track Manager media references without inventing a second storage layer;
- Track Workspace activity, assets, versions, metadata and publishing copy now identifies the active read source instead of assuming all data is public;
- Studio release metadata advances to `0.4.0` / Build `5`.

### Security / safety

- Studio sends browser credentials only to the existing protected Track Manager Worker;
- no Cloudflare Access secret, service token or permanent browser admin token is introduced;
- no POST, PUT, PATCH or DELETE wrapper is exposed in Studio;
- existing Track Manager same-origin write protection remains unchanged;
- LaunchPAD public Worker v2.6 remains untouched;
- no R2 object, manifest, media file or `catalog/index.json` is modified by this Studio release;
- SonicTrace and LRC Maker are unchanged.

### Upstream dependency

- LaunchPAD Build `2026.08.08.65` / release `studio-private-read-bridge-20260808`;
- Track Manager `v5.8`;
- LaunchPAD PR `#157`, merge commit `d74e37ef69ebd4801d922ab22262332468178c49`;
- deployed private Worker version `b89fac19-78f8-4d39-abd5-76e93de976ae`;
- public Worker deployment was skipped and R2 was not rebuilt.

Rollback target: `safety/pre-integration-20260808-1048` plus a normal revert of this Studio PR if needed.

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
