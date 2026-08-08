# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.6.0`  
**Build:** `12`  
**Current milestone:** Phase 4B.2C — guarded canonical lyrics save

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the SHINOBIWAN toolchain.

Core rules:

- `trackId = R2 manifest slug`;
- LaunchPAD stays the public product;
- R2 stays the catalog/media source of truth;
- Track Manager stays the protected catalog/admin backend and full-write fallback until Phase 4 is fully migrated;
- SonicTrace stays the audio-intelligence engine;
- LRC Maker stays the advanced lyrics editing/synchronization engine;
- Studio must degrade safely when Track Manager private access or the SonicTrace GPU node is unavailable.

## Current scope

Implemented today:

- GitHub Pages Studio shell;
- LaunchPAD public catalog read + Track Manager private-first read;
- automatic `PUBLIC FALLBACK` when private access is unavailable;
- Track Workspace with Overview, Audio Intelligence, Lyrics, Assets, Versions, Metadata and Publishing;
- Content Health with timestamp-aware synchronized lyrics semantics;
- metadata proposal editor + non-mutating validation + guarded save;
- real-browser production proof and clean restoration of metadata write;
- canonical lyrics `GET` + R2 ETag read;
- guarded lyrics validation with manifest revision + lyrics ETag concurrency protection;
- guarded canonical `lyrics.txt` save with explicit confirmation;
- backend lyrics/manifest/catalog rollback on publication failure;
- backend reread + Studio browser canonical reread after lyrics save;
- no-preflight `text/plain` POST transport proven with Cloudflare Access;
- strict build-time bridge/write regression guard;
- Track Manager remains available as fallback while the remaining Phase 4 asset/create/rebuild operations are integrated.

## Phase 4B.2C — guarded lyrics save

Build 12 activates the lyrics surface already deployed in Track Manager `v5.12` / Studio bridge `v1.4`.

The canonical model is fixed:

```text
tracks/<slug>/lyrics.txt = source of truth
timestamps inside lyrics.txt = synchronized
.lrc sidecar = optional compatibility/export only
```

Studio now performs:

```text
GET canonical lyrics.txt + ETag
  -> edit locally
  -> Validate lyrics
  -> Review normalized proposal + timestamp/quality state
  -> Save lyrics.txt
  -> explicit confirmation
  -> backend stale/quality revalidation
  -> canonical lyrics write
  -> manifest revision update
  -> catalog/index.json rebuild
  -> backend reread verification
  -> Studio canonical lyrics + manifest reread
  -> Track Workspace refresh
```

Both validate and save require:

```text
expectedUpdatedAt
expectedLyricsEtag
```

A stale manifest or stale lyrics object is rejected rather than overwritten.

Build 12 only edits an **existing** canonical `lyrics.txt`. Initial lyrics upload belongs to the remaining Phase 4 Assets integration, alongside audio, cover, thumbnail and video/Canvas.

See [`docs/PHASE-4B2C-LYRICS-SAVE.md`](docs/PHASE-4B2C-LYRICS-SAVE.md).

## Phase 4B.1B — metadata production proof

Metadata remains the other production-proven Studio write.

The proven flow is:

```text
Edit locally
  -> Validate metadata
  -> Review normalized proposal + quality
  -> Save metadata
  -> explicit confirmation
  -> backend stale/quality revalidation
  -> canonical manifest metadata write
  -> catalog/index.json rebuild
  -> backend manifest reread
  -> Studio canonical GET reread
  -> Track Workspace refresh
```

Real production smoke test on `soft-addiction` / **Soft Addiction**:

- temporary `keyConfidence = 0.01` save revision: `2026-08-08T16:21:15.503Z`;
- catalog rebuilt: yes;
- browser canonical reread: verified;
- restoration to original empty/null `keyConfidence` revision: `2026-08-08T16:22:10.890Z`;
- final quality: `ready`, publishable `Yes`, errors/warnings `0 / 0`;
- media untouched.

## Production dependencies

Public LaunchPAD remains unchanged:

- app Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6`.

Protected Track Manager backend currently deployed:

- Track Manager `v5.12`;
- Studio bridge `v1.4`;
- LaunchPAD merge SHA `98504263dac8a5f284337fe7e26fa6c808ad75e3`;
- private Worker Version ID `3aa3136f-492d-46c5-af0a-fd3b048e8666`;
- protected deployment workflow run `31270132063`;
- deployment target `admin` only;
- Cloudflare Access protection confirmed (`302` unauthenticated);
- public Worker deployment steps were skipped.

## Active Studio endpoints

Private reads:

```text
GET /api/studio/health
GET /api/studio/tracks
GET /api/studio/tracks/<trackId>
GET /api/studio/tracks/<trackId>/lyrics
```

Metadata:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
POST /api/studio/tracks/<trackId>/metadata/save
```

Lyrics:

```text
POST /api/studio/tracks/<trackId>/lyrics/validate
POST /api/studio/tracks/<trackId>/lyrics/save
```

All Studio POSTs remain CORS-simple:

```text
Content-Type: text/plain;charset=UTF-8
credentials: include
```

No custom request header is used.

## Data safety

Metadata save is whitelist-only and does not accept media or identity fields.

Lyrics save is limited to the existing canonical `lyrics.txt` object and cannot mutate audio, cover, thumbnail or video.

Preserved by the backend:

- slug / canonical `trackId`;
- unrelated asset filenames;
- migration provenance;
- `createdAt`;
- existing Cloudflare Access boundary.

Still intentionally outside Studio Build 12:

- track creation;
- audio upload/replace/delete;
- cover upload/replace/delete;
- thumbnail upload/replace/delete;
- video/Canvas upload/replace/delete;
- missing lyrics TXT creation/upload;
- explicit standalone catalog rebuild UI;
- track deletion;
- Phase 5 SonicTrace catalog persistence.

These are not forgotten: the applicable Track Manager operations are the remaining work required before **Phase 4** is declared complete.

## Stale, quality and rollback guards

Metadata validate/save requires `expectedUpdatedAt`.

Lyrics validate/save requires both `expectedUpdatedAt` and `expectedLyricsEtag`.

Track Manager v5.11 metadata save restores the previous manifest/catalog if publication fails after the manifest write.

Track Manager v5.12 lyrics save attempts to restore:

1. previous lyrics bytes/object metadata;
2. previous manifest;
3. previous catalog projection.

Studio performs an additional canonical reread after successful metadata and lyrics saves.

## Safety checkpoints

Preferred rollback references, newest first:

```text
safety/post-v5.12-pre-phase4-complete-20260808-1945
safety/pre-build12-lyrics-ui-20260808-1948
safety/pre-4b2-lyrics-write-20260808-1837
safety/post-metadata-write-proven-20260808-1822
safety/post-v5.11-pre-build9-20260808-1732
safety/pre-4b1b-metadata-write-20260808-1612
safety/pre-cors-hotfix-20260808-1540
safety/pre-integration-20260808-1048
```

Safety branches are rollback references only and must never become development branches.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md), [`docs/PHASE-4B1B-METADATA-SAVE.md`](docs/PHASE-4B1B-METADATA-SAVE.md), [`docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md`](docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md) and [`docs/PHASE-4B2C-LYRICS-SAVE.md`](docs/PHASE-4B2C-LYRICS-SAVE.md).

## Lyrics semantics

Lyrics synchronization is content-driven:

- `lyrics.txt` present = canonical lyrics source;
- timestamps detected in canonical lyrics content = `Synced Lyrics`;
- a separate `.lrc` sidecar is optional, not required.

Track Manager canonical lyrics uploads accept TXT. LRC Maker can import `.txt`/`.lrc`, preserve timestamps and export plain text. Studio does not create a mandatory second source of truth.

## Remaining Phase 4 gate

After Build 12, Phase 4 is **not yet complete**. The roadmap criterion remains:

> the principal Track Manager operations must be achievable from the Studio workspace.

Remaining operational scope:

- create track;
- upload/replace audio;
- upload/replace cover;
- upload/replace thumbnail;
- upload/replace video/Canvas;
- upload/create lyrics TXT when missing;
- delete/replace individual assets;
- explicit catalog rebuild;
- upload progress;
- destructive confirmations;
- keep Track Manager as fallback.

Phase 5 is explicitly outside the current delivery and must not begin until new user instructions are provided.

## Readability rule

Studio keeps an 11px floor for previously microscopic status/microcopy roles.

## Stack

- React 18.2
- TypeScript 5.8.3
- Vite 6.3.5
- GitHub Pages
- Cloudflare Access-protected Track Manager Worker

## Development and validation

```bash
npm install
npm run dev
npm run check:private-read
npm run typecheck
npm run build
```

`npm run build` executes the Studio bridge/write regression guard before TypeScript/Vite compilation.

## Production URL

```text
https://shinobione.github.io/shinobiwan-studio/
```

## Versioning discipline

Every Studio release updates together:

1. `package.json`;
2. `src/release.ts`;
3. visible version/build and phase copy;
4. `CHANGELOG.md`;
5. README / affected `.md` documentation;
6. security-sensitive regression guards;
7. PR scope, dependency and rollback notes.

A backend version/build is not bumped merely to document an already-deployed runtime when no backend code changed; unnecessary Worker redeploys are treated as risk, not progress.

No risky cross-repository capability is considered complete until CI, deployment and the appropriate browser/contract verification have passed independently.
