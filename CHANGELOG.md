# SHINOBIWAN Studio Changelog

## 0.4.1 — Build 6 — 2026-08-08

Codename: `metadata-validation-preview`

### Added

- local Metadata proposal editor inside the track workspace;
- one credentialed validation-only `POST /api/studio/tracks/<trackId>/metadata/validate` client;
- required `X-Shinobiwan-Studio-Intent: metadata-validate-v1` request header;
- mandatory `expectedUpdatedAt` stale-manifest protection;
- normalized metadata preview, changed-field list and Track Manager quality/publishability preview;
- explicit `VALIDATION ONLY · NO WRITE` / `PREVIEW · NOT SAVED` UI states;
- safe disablement of metadata validation while Studio is operating from public fallback data;
- dedicated Phase 4B.1A integration documentation.

### Changed

- Studio release metadata advances to `0.4.1` / Build `6`;
- Track Workspace identifies the private backend as Track Manager `v5.9`;
- the production regression guard now permits exactly one explicit POST client path while continuing to forbid PUT/PATCH/DELETE and production mutation routes.

### Security / safety

- `adminService.writesEnabled` remains `false`;
- Studio still exposes no manifest save, asset upload, delete, publish, thumbnail write or catalog rebuild wrapper;
- the Metadata UI contains no production save CTA;
- validation requires the existing Cloudflare Access browser session and exact upstream CORS/intent contract;
- stale canonical revisions return `STALE_MANIFEST` and require reload before retry;
- LaunchPAD public Worker `v2.6` remains untouched;
- no R2 object, manifest, media file or `catalog/index.json` is modified by this Studio release;
- SonicTrace and LRC Maker are unchanged.

### Upstream dependency

- LaunchPAD Build `2026.08.08.66` / release `studio-metadata-validation-20260808`;
- LaunchPAD merge SHA `e30e6665566d5d1e4475ab24b92833a859e2d110`;
- Track Manager `v5.9` / Studio bridge `v1.1`;
- deployed private Worker Version ID `59ef19af-e189-42d3-ba08-bb5303bb75c1`;
- public Worker deployment was skipped and R2/catalog was not rebuilt.

Rollback target: normal revert of the Build 6 Studio PR; pre-Phase-4B.1A safety snapshots remain available and no R2 rollback is expected because Build 6 cannot save production state.

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
