# SHINOBIWAN Studio Changelog

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
- Track Manager production remains v5.11 / bridge v1.3;
- no Worker redeploy is required;
- no R2/catalog mutation occurs from deploying Build 11;
- LRC Maker and SonicTrace are untouched.

### Why

Track Manager v5.12 / bridge v1.4 is expected to truthfully advertise `write: ["metadata", "lyrics"]`. Without Build 11, the current Studio health allowlist would classify `lyrics` as an unexpected production write and could drop private reads into fallback. Build 11 removes that deployment-order hazard **before** any lyrics endpoint exists.

### Frozen lyrics contract

The Phase 4B.2 read-only audit confirmed:

- canonical R2 source is `tracks/<slug>/lyrics.txt`;
- timestamp content defines synchronization;
- `.lrc` is optional compatibility/export only;
- Track Manager canonical lyrics uploads already accept TXT only;
- LRC Maker can remain the external advanced editor for the first guarded save phase.

## 0.5.1 — Build 10 — 2026-08-08

Codename: `metadata-save-production-proven`

### Production proof

Phase 4B.1B is now proven end-to-end in the real production browser against Track Manager `v5.11` / Studio bridge `v1.3`.

Smoke write on `soft-addiction`:

- changed field: `keyConfidence` only;
- temporary value: `0.01`;
- saved revision: `2026-08-08T16:21:15.503Z`;
- catalog rebuilt: yes;
- canonical browser reread: verified;
- publishable: yes;
- media untouched.

Restoration write:

- `keyConfidence` restored to its original empty/null state;
- restored revision: `2026-08-08T16:22:10.890Z`;
- catalog rebuilt: yes;
- canonical browser reread: verified;
- quality: `ready`;
- publishable: yes;
- errors/warnings: `0 / 0`;
- media untouched.

### Changed

- Studio advances to `0.5.1` / Build `10`;
- visible milestone becomes `PHASE 4B.1B · PRODUCTION PROVEN`;
- Dashboard records that metadata save has passed validate → confirm → save → catalog rebuild → backend reread → browser reread in production;
- documentation records the exact smoke and restoration revisions;
- new post-proof rollback checkpoint: `safety/post-metadata-write-proven-20260808-1822` in Studio and LaunchPAD/Track Manager.

### Safety

- metadata remains the only Studio production write capability;
- exactly two Studio POST clients remain: metadata validation + metadata save;
- no PUT/PATCH/DELETE;
- no audio, cover, thumbnail, lyrics or video mutation client;
- no delete, publish shortcut or standalone catalog rebuild endpoint;
- Track Manager `v5.11`, bridge `v1.3`, public LaunchPAD Build `66`, public Worker `v2.6`, SonicTrace and LRC Maker are unchanged by this release;
- no backend redeploy is required for Build 10 because the backend runtime did not change.

### Next gate

Phase 4B.2 may begin only with a read-only audit of the existing lyrics/LRC paths. The canonical rule is frozen: timestamped `lyrics.txt` is synchronized content; a separate `.lrc` file is optional and must not become a mandatory second source of truth.

## 0.5.0 — Build 9 — 2026-08-08

Codename: `guarded-metadata-save`

### Added

- first real SHINOBIWAN Studio production write capability: metadata only;
- guarded `POST /api/studio/tracks/<trackId>/metadata/save` client using the proven no-preflight `text/plain` transport;
- mandatory bridge capability check before save: the deployed backend must explicitly advertise `write: ["metadata"]`;
- strict `Validate metadata → Review → Save metadata → explicit confirmation` workflow;
- browser confirmation listing changed fields and stating that manifest/catalog change while media objects remain untouched;
- client-side canonical reread after backend save;
- Track Workspace refresh through the normal private-first catalog layer after successful persistence;
- explicit `METADATA SAVED` / `CANONICAL REREAD · VERIFIED` result state;
- dedicated `docs/PHASE-4B1B-METADATA-SAVE.md` operational contract;
- fresh rollback checkpoint `safety/post-v5.11-pre-build9-20260808-1732`.

### Changed

- Studio advances to `0.5.0` / Build `9`;
- Dashboard reports Phase `4B.1B · METADATA SAVE` and one guarded production write instead of claiming all writes are locked;
- Track Workspace identifies the active private backend as Track Manager `v5.11` / bridge `v1.3`;
- Publishing continues to state that publication shortcuts, delete, asset replacement and standalone catalog rebuild remain locked;
- Metadata editor microcopy introduced after the original readability pass is raised to an 11px floor.

### Security / safety

- Studio exposes exactly two explicit POST client paths: metadata validation and metadata save;
- no PUT/PATCH/DELETE client exists;
- no audio, cover, thumbnail, lyrics or video mutation client exists;
- no delete, publish shortcut or standalone catalog rebuild endpoint is exposed;
- both metadata POSTs keep `credentials: include` and CORS-simple `text/plain;charset=UTF-8` transport;
- no custom request header is used, so the real-browser Cloudflare Access preflight regression cannot silently return;
- save requires `expectedUpdatedAt` from the validated canonical revision;
- editing any form field invalidates the previous validation preview;
- backend quality/stale guards remain authoritative;
- Track Manager v5.11 performs manifest/catalog rollback if publication fails after the manifest write;
- Studio performs an additional canonical GET verification after backend success;
- timeout/ambiguous-save errors explicitly tell the user not to retry blindly.

### Upstream dependency proven before Build 9

- LaunchPAD public application remains Build `2026.08.08.66` / release `studio-metadata-validation-20260808`;
- Track Manager PR `#160`, merge SHA `49728e908fcfaff3f6edf9cf3f9b7d2bb23ce8a3`;
- Track Manager `v5.11` / Studio bridge `v1.3`;
- deployed private Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- protected deployment workflow run `31264114407` targeted `admin` only;
- public Worker deployment steps were skipped;
- Cloudflare Access smoke test remained protected (`302` unauthenticated);
- Studio Build 8 remained `PRIVATE READ` against v5.11 in the real browser before the Build 9 client write was opened.

### Rollback

Preferred rollback target is `safety/post-v5.11-pre-build9-20260808-1732`, which captures the exact v5.11-compatible Studio/LaunchPAD state proven in Chrome immediately before the first Studio Save client.

## 0.4.3 — Build 8 — 2026-08-08

Codename: `metadata-write-capability-awareness`

### Added

- explicit recognition of the future Track Manager bridge capability `write: ["metadata"]`;
- strict allowlist logic that accepts only `metadata` as a known future write capability while rejecting any other write capability;
- regression coverage proving Build 8 still exposes no metadata save route or production write CTA.

### Why

Build 7 rejected any non-empty `capabilities.write` list. Deploying the next truthful backend contract first would therefore have forced Studio into `PUBLIC FALLBACK`. Build 8 removes that deployment-order hazard before the backend write capability is enabled.

### Safety

- `adminService.writesEnabled` remains `false`;
- no `/metadata/save` client exists yet;
- no Save metadata CTA exists yet;
- validation stays the only explicit POST in Studio;
- no PUT/PATCH/DELETE path exists;
- LaunchPAD, Track Manager production data, R2, SonicTrace and LRC Maker are untouched by Build 8;
- new safety snapshot: `safety/pre-4b1b-metadata-write-20260808-1612`.

### Rollout sequence

1. deploy Build 8 against current Track Manager v5.10 / bridge v1.2;
2. deploy Track Manager v5.11 / bridge v1.3 with metadata-only write capability;
3. verify PRIVATE READ remains healthy;
4. only then expose real metadata saving in the following Studio build.

## 0.4.2 — Build 7 — 2026-08-08

Codename: `metadata-validation-simple-transport`

### Fixed

- real Chrome metadata-validation failure where `PRIVATE READ` worked but the validation POST failed before reaching Track Manager;
- removed the Build 6 browser preflight trigger (`Content-Type: application/json` + `X-Shinobiwan-Studio-Intent`) from the Studio client;
- metadata validation now uses a CORS-safelisted `text/plain;charset=UTF-8` request body while preserving JSON payload semantics;
- validation intent moves into the JSON body as `intent: "metadata-validate-v1"`;
- Dashboard/Workspace static backend labels now identify Track Manager `v5.10` instead of older `v5.8/v5.9` text.

### Security / safety

- Cloudflare Access credentials remain browser-session based and `credentials: include` remains required;
- exact-origin CORS remains upstream at `https://shinobione.github.io`;
- `expectedUpdatedAt` stale-manifest protection remains mandatory;
- `adminService.writesEnabled` remains `false`;
- Studio still exposes exactly one explicit POST client path and no PUT/PATCH/DELETE wrapper;
- no Save, asset upload/replace, delete, publish, thumbnail write or catalog rebuild CTA/path is exposed;
- the build guard fails if the validation client reintroduces `X-Shinobiwan-Studio-Intent` or `application/json`, because either would recreate the problematic preflight path;
- no R2 object, manifest, media file or `catalog/index.json` is modified by this Studio release;
- LaunchPAD public Worker `v2.6`, SonicTrace and LRC Maker are unchanged.

## 0.4.1 — Build 6 — 2026-08-08

Codename: `metadata-validation-preview`

- added the local metadata proposal editor and validation-only POST;
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
