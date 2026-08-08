# SHINOBIWAN Studio Changelog

## 0.9.0 — Build 15 — 2026-08-09

Codename: `phase6-canonical-lyrics-workflow`

### Roadmap milestone

- completes **Phase 6 — Lyrics/LRC integration**;
- opens LRC Maker with minimal, track-bound context and preserves its standalone mode;
- saves through Track Manager v5.15 / bridge v1.7 only;
- keeps `tracks/<slug>/lyrics.txt` as the sole canonical lyrics source;
- keeps `.lrc` optional and outside Content Health;
- stops before Phase 7.

### Verification

- Studio contract, Phase 5 algorithm and Phase 6 regression suites pass;
- TypeScript and Vite production build pass;
- Track Manager strict timestamp/stale/rollback contract passes;
- LRC Maker context, lint, format and production build pass.

## 0.8.0 — Build 14 — 2026-08-08

Codename: `phase5-sonictrace-catalog-intelligence`

### Roadmap milestone

- completes **Phase 5 — SonicTrace + Catalog Intelligence**;
- keeps R2/Track Manager as the only authoritative catalog persistence layer;
- keeps SonicTrace source audio temporary and its standalone IndexedDB non-canonical;
- stops before Phase 6.

### Added

- `SonicTraceAnalysis` schema v1 with canonical `trackId`, `analysisId`, source revision, engine versions and provenance;
- one-upload `/api/studio/analyze` coordinator route with partial-layer warnings;
- in-Studio Browser DSP fallback when the local Deep Audio node is unavailable;
- review-before-save workflow and guarded Cloudflare Access persistence;
- R2 `latest.json` plus append-only history with verification and rollback;
- canonical-audio ETag/size freshness checks and outdated detection;
- re-scan support without deleting history;
- 512D embedding catalog index, cosine neighbors and deterministic sound clusters;
- analysis/master comparison using source versions and mastering history;
- Content Health partial state for outdated SonicTrace results.

### Preserved

- no WAV/MP3 duplication in the analysis directory;
- manifest schema v1 remains unchanged;
- public `catalog/index.json` remains unchanged by private analysis saves;
- Phase 4 Track Manager operations and legacy fallbacks remain available;
- LRC Maker remains unchanged until Phase 6 authorization.

## 0.7.0 — Build 13 — 2026-08-08

Codename: `phase4-track-manager-complete`

### Roadmap milestone

- closes SHINOBIWAN Studio roadmap **Phase 4 — Track Manager integration**;
- principal Track Manager operations are now represented directly in Studio;
- standalone Track Manager remains the protected fallback;
- Phase 5 is explicitly not started.

### Added — Catalog / create

- canonical draft creation from Catalog;
- canonical kebab-case trackId/slug generation and validation;
- duplicate-safe backend create contract;
- creation forced to `draft`;
- post-create canonical reread verification;
- automatic navigation to the new track Assets workspace after verified creation.

### Added — Assets Manager

- one-asset-at-a-time upload/replace for Audio, Cover, Thumbnail, Lyrics TXT and Video/Canvas;
- missing canonical `lyrics.txt` can now be uploaded from Studio;
- XHR upload progress while retaining Cloudflare Access credentials;
- multipart FormData without custom headers/preflight;
- canonical `expectedUpdatedAt` stale protection;
- explicit confirmation before upload/replace;
- individual asset delete with destructive confirmation;
- canonical reread verification after asset write/delete;
- published-track quality guard remains authoritative;
- whole-track deletion remains intentionally absent.

### Added — Catalog management

- explicit standalone canonical catalog rebuild from Administration;
- user confirmation plus backend `confirm: REBUILD` contract;
- private catalog reread verification after rebuild.

### Production backend proof

Build 13 consumes the successfully deployed Track Manager `v5.13` / Studio bridge `v1.5` backend:

```text
source SHA          df75509d89b1ed1477d4b249fab63a6bd41db311
workflow run        31272655808
deployment target   admin
Worker Version ID   781f75f9-776c-4e39-90a7-5cdf34854599
Access verification protected / HTTP 302 unauthenticated
public Worker       deploy/record/verify skipped
```

Worker source validation, bridge guards and Wrangler dry-run passed again immediately before deployment. Public LaunchPAD remained Build 66 / public Worker v2.6.

### Preserved

- metadata validation/save and production proof;
- canonical lyrics read/validate/save with manifest+ETag guard;
- `lyrics.txt` as canonical source and timestamp-derived sync;
- `.lrc` as optional compatibility/export only;
- public LaunchPAD Build `2026.08.08.66` and public Worker `v2.6`;
- exact-origin Cloudflare Access boundary;
- Track Manager legacy fallback;
- SonicTrace and LRC Maker runtime unchanged.

### Stop line

No Phase 5 code is added. SonicTrace persistence, fingerprints, embeddings, Catalog Intelligence, similarity/duplicate detection and outdated-analysis logic wait for new user instructions.

## 0.6.0 — Build 12 — 2026-08-08

Codename: `guarded-lyrics-save`

### Added

- guarded canonical lyrics reader against Track Manager `v5.12` / bridge `v1.4`;
- canonical R2 lyrics ETag surfaced to the Studio editor;
- dedicated `lyrics-validate-v1` and `lyrics-save-v1` clients using the proven CORS-simple `text/plain` transport;
- double concurrency guard: canonical manifest `updatedAt` + lyrics R2 ETag;
- Track Workspace canonical `lyrics.txt` editor with local reset/reload;
- normalized validation preview with bytes, timestamp count, segment count and quality state;
- explicit confirmation before production lyrics save;
- backend + browser canonical reread verification after save;
- Workspace refresh after successful lyrics persistence;
- dedicated `docs/PHASE-4B2C-LYRICS-SAVE.md` release contract;
- pre-Build-12 safety checkpoint `safety/pre-build12-lyrics-ui-20260808-1948`.

### Canonical lyrics rule

- `lyrics.txt` remains the only required canonical lyrics asset;
- timestamps inside `lyrics.txt` define synchronized state;
- `.lrc` remains optional compatibility/export data;
- LRC Maker is not modified by Build 12.

### Safety boundary

- metadata save remains unchanged and production-proven;
- lyrics save is limited to an already-existing canonical `lyrics.txt` because v5.12 refuses missing-file creation and noncanonical filenames;
- no asset upload/replace/delete client is added yet;
- no track-create, track-delete, publish shortcut or explicit catalog-rebuild client is added yet;
- no PUT/PATCH/DELETE client is introduced;
- all Studio POSTs keep `credentials: include` + CORS-simple `text/plain;charset=UTF-8`;
- Phase 5 / SonicTrace catalog persistence remains explicitly out of scope.

### Backend dependency

- LaunchPAD public remains Build `2026.08.08.66` / public Worker `v2.6`;
- Track Manager `v5.12` / bridge `v1.4` merge SHA `98504263dac8a5f284337fe7e26fa6c808ad75e3`;
- private Worker Version ID `3aa3136f-492d-46c5-af0a-fd3b048e8666`;
- deployment workflow run `31270132063`, target `admin` only;
- public Worker deployment steps were skipped.

## 0.5.2 — Build 11 — 2026-08-08

Codename: `lyrics-write-capability-awareness`

### Added

- compatibility awareness for the future bridge write capability `lyrics`;
- strict separation between **recognized** bridge writes (`metadata`, `lyrics`) and **active Studio write clients** (`metadata` only);
- `lyricsWriteEnabled: false` as an explicit Build 11 contract;
- fresh safety checkpoint `safety/pre-4b2-lyrics-write-20260808-1837` in Studio and LaunchPAD/Track Manager;
- dedicated Phase 4B.2A capability-preparation documentation.

### Unchanged runtime boundary

- metadata remains the only active Studio production write;
- exactly two explicit Studio POST clients remain: metadata validate + metadata save;
- `/lyrics/validate` and `/lyrics/save` do not exist in Build 11;
- no PUT/PATCH/DELETE;
- no audio, cover, thumbnail, video, delete, publish or standalone catalog rebuild mutation client;
- Track Manager production remained v5.11 / bridge v1.3 at Build 11 release time;
- no Worker redeploy was required for Build 11;
- LRC Maker and SonicTrace were untouched.

### Frozen lyrics contract

The Phase 4B.2 read-only audit confirmed:

- canonical R2 source is `tracks/<slug>/lyrics.txt`;
- timestamp content defines synchronization;
- `.lrc` is optional compatibility/export only;
- Track Manager canonical lyrics uploads already accept TXT only;
- LRC Maker can remain the external advanced editor.

## 0.5.1 — Build 10 — 2026-08-08

Codename: `metadata-save-production-proven`

### Production proof

Phase 4B.1B was proven end-to-end in the real production browser against Track Manager `v5.11` / Studio bridge `v1.3`.

Smoke write on `soft-addiction`:

- changed field: `keyConfidence` only;
- temporary value: `0.01`;
- saved revision: `2026-08-08T16:21:15.503Z`;
- catalog rebuilt: yes;
- canonical browser reread: verified;
- publishable: yes;
- media untouched.

Restoration write:

- `keyConfidence` restored to original empty/null state;
- restored revision: `2026-08-08T16:22:10.890Z`;
- catalog rebuilt: yes;
- canonical browser reread: verified;
- quality: `ready`;
- publishable: yes;
- errors/warnings: `0 / 0`;
- media untouched.

### Safety

- metadata remained the only Studio production write capability at this release;
- no PUT/PATCH/DELETE;
- no media mutation client;
- no backend redeploy was required for Build 10.

## 0.5.0 — Build 9 — 2026-08-08

Codename: `guarded-metadata-save`

### Added

- first real SHINOBIWAN Studio production write capability: metadata only;
- guarded `POST /api/studio/tracks/<trackId>/metadata/save` client using the proven no-preflight `text/plain` transport;
- mandatory bridge capability check before save;
- strict `Validate metadata → Review → Save metadata → explicit confirmation` workflow;
- client-side canonical reread after backend save;
- explicit `METADATA SAVED` / `CANONICAL REREAD · VERIFIED` result state;
- dedicated `docs/PHASE-4B1B-METADATA-SAVE.md` operational contract.

### Security / safety

- no PUT/PATCH/DELETE client;
- no media mutation client;
- both metadata POSTs keep `credentials: include` and `text/plain;charset=UTF-8`;
- save requires `expectedUpdatedAt`;
- backend quality/stale guards remain authoritative;
- Track Manager performs manifest/catalog rollback if publication fails after manifest write;
- Studio performs an additional canonical GET verification after backend success.

## 0.4.3 — Build 8 — 2026-08-08

Codename: `metadata-write-capability-awareness`

- recognized future `write: ["metadata"]` before activating a save client;
- no `/metadata/save` client yet;
- no production write CTA yet;
- preserved safe deployment ordering.

## 0.4.2 — Build 7 — 2026-08-08

Codename: `metadata-validation-simple-transport`

- fixed real Chrome validation failure caused by Access/CORS preflight;
- moved validation transport to CORS-safelisted `text/plain;charset=UTF-8`;
- kept `expectedUpdatedAt`, exact origin and Access authentication.

## 0.4.1 — Build 6 — 2026-08-08

Codename: `metadata-validation-preview`

- added local metadata proposal editor and validation-only POST;
- added stale-manifest protection and normalized preview;
- still exposed no production save.

## 0.4.0 — Build 5 — 2026-08-08

Codename: `private-read-bridge`

- added authenticated private-first catalog reads with public fallback;
- no write path exposed.

## 0.3.2 — Build 4 — 2026-08-08

Codename: `synced-lyrics-semantics`

- replaced mandatory `Lyrics LRC` semantics with content-derived `Synced Lyrics`;
- timestamped canonical `lyrics.txt` counts as synchronized;
- separate `.lrc` remains optional.

## 0.3.1 — Build 3 — 2026-08-08

- raised audited microcopy at 8px or smaller to an 11px readability floor.

## 0.3.0 — Build 2 — 2026-08-08

- added Track Workspace and Content Health V1.

## 0.2.0 — Build 1 — 2026-08-08

- connected the live LaunchPAD public catalog read layer.
