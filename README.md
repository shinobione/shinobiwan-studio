# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.4.1`  
**Build:** `6`  
**Current milestone:** Phase 4B.1A — metadata validation preview, production writes still locked

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the existing music-tool ecosystem. It does **not** replace the underlying products by copying their code into one monolith.

Architecture rules:

- one canonical track identity: `trackId = R2 manifest slug`;
- LaunchPAD remains the public product;
- R2 remains the catalog/media source of truth;
- Track Manager remains the protected catalog/admin backend and write fallback;
- SonicTrace remains the audio-intelligence engine;
- LRC Maker remains the lyrics editing/synchronization engine during migration;
- Studio must remain usable when the optional local SonicTrace GPU node is offline or when the private Track Manager read session is unavailable.

## Current scope

Implemented:

- GitHub Pages shell;
- LaunchPAD public catalog read layer;
- Track Manager v5.9 authenticated Studio bridge support;
- private-first catalog reads with automatic public fallback;
- private canonical drafts/status/quality visibility when Cloudflare Access is usable from the browser;
- public media/lyrics URL reuse for already-published tracks;
- search, filters and sorting;
- `#/track/<trackId>` Track Workspace;
- Overview, Audio Intelligence, Lyrics, Assets, Versions, Metadata and Publishing sections;
- deterministic Content Health;
- timestamp-aware synchronized lyrics semantics;
- explicit read provenance (`PRIVATE READ` / `PUBLIC FALLBACK`);
- local Metadata proposal editor;
- validation-only metadata POST with stale-manifest protection;
- normalized proposal + quality preview without saving;
- build-time regression guard allowing exactly one validation POST while forbidding production write plumbing.

Studio production writes remain locked. Build 6 exposes **no save, upload, delete, publish or catalog-rebuild wrapper**.

## Phase 4B.1A metadata validation architecture

LaunchPAD Build 66 / Track Manager v5.9 / Studio bridge v1.1 keeps the private GET routes and adds exactly one validation-only endpoint:

```text
OPTIONS /api/studio/*
GET     /api/studio/health
GET     /api/studio/tracks
GET     /api/studio/tracks/<trackId>
POST    /api/studio/tracks/<trackId>/metadata/validate
```

Browser origin allowlist:

```text
https://shinobione.github.io
```

The validation POST requires:

```text
Content-Type: application/json
X-Shinobiwan-Studio-Intent: metadata-validate-v1
credentials: include
expectedUpdatedAt: canonical manifest revision
```

If the manifest changed since the workspace loaded, Track Manager returns `409 / STALE_MANIFEST`. Studio refuses to continue with that stale proposal until the track is reloaded.

The response is a preview only: normalized proposed metadata, changed fields and Track Manager quality state. The endpoint and Studio Build 6 do not write the manifest, media or `catalog/index.json`.

See [`docs/PHASE-4B1A-METADATA-VALIDATION.md`](docs/PHASE-4B1A-METADATA-VALIDATION.md).

## Read architecture and fallback

Studio continues to call private routes with browser credentials and never stores a Cloudflare secret or service token.

```text
Studio
  |
  +--> Track Manager private bridge
  |      |
  |      +--> canonical manifests / drafts / quality
  |      +--> metadata validation preview
  |
  +--> LaunchPAD public Worker
         |
         +--> published media URLs / public lyrics / safe fallback
```

If the private request cannot use a valid Cloudflare Access session, Studio does **not** weaken authentication or CORS. It automatically continues with the established LaunchPAD public read-only catalog. Metadata validation is disabled in that fallback mode because the public projection cannot guarantee canonical `updatedAt`.

## Production dependency

Build 6 is aligned to the deployed upstream backend:

- LaunchPAD Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- LaunchPAD merge SHA `e30e6665566d5d1e4475ab24b92833a859e2d110`;
- Track Manager `v5.9`;
- private Worker Version ID `59ef19af-e189-42d3-ba08-bb5303bb75c1`;
- public Worker remains `v2.6` and was not deployed for Build 66;
- no R2 migration or catalog rebuild was performed.

## Browser authentication note

The Track Manager Worker remains protected by Cloudflare Access. A successful Worker deployment proves the backend contract and Access protection, but real-browser cookie behavior still depends on the active browser session and cross-site cookie policy.

Therefore:

- `PRIVATE READ` means Studio successfully reached the authenticated bridge;
- `PUBLIC FALLBACK` is a valid safe operating mode, not a write/security failure;
- if private reads are unavailable, open the existing Track Manager and authenticate normally, then retry Studio;
- do **not** put Access credentials in `VITE_*` variables;
- do **not** relax the Worker to wildcard authenticated CORS.

## Lyrics semantics

The canonical lyrics source may remain `tracks/<slug>/lyrics.txt`.

Studio determines synchronization from **content**, not from the filename extension:

- `lyrics.txt` present -> canonical lyrics source available;
- timestamp segments or Track Manager timestamp quality state detected -> `Synced Lyrics = Ready`;
- optional `.lrc` sidecar present -> also valid synchronized lyrics;
- a separate `.lrc` file is **not required** when the canonical TXT already contains timestamps.

This avoids duplicate lyric sources and false `Lyrics LRC: Missing` warnings for already-synchronized tracks.

## Safety / rollback policy

Cross-repository restoration branches created before Studio integration remain rollback references. Phase 4B.1A also has a dedicated pre-phase safety snapshot.

Build 6 changes only `shinobione/shinobiwan-studio`. It consumes the separately validated/deployed LaunchPAD Build 66 / Track Manager v5.9 bridge and does not modify LaunchPAD, Track Manager, SonicTrace, LRC Maker or R2 data itself.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md) for the mandatory change policy.

## Stack

- React 18.2
- TypeScript 5.8.3
- Vite 6.3.5
- static GitHub Pages deployment
- dependency-free hash routing for Pages-safe deep navigation

## Local development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run check:private-read
npm run typecheck
npm run build
```

`npm run build` runs the Studio bridge security regression guard before TypeScript/Vite compilation. Every implementation PR must pass the GitHub validation workflow before merge.

## Routes

```text
#/dashboard
#/catalog
#/track/<trackId>
#/track/<trackId>/intelligence
#/track/<trackId>/lyrics
#/track/<trackId>/assets
#/track/<trackId>/versions
#/track/<trackId>/metadata
#/track/<trackId>/publishing
#/intelligence
#/lyrics
#/assets
#/publishing
#/administration
```

## Admin UI flag

For continuity with LaunchPAD conventions:

```text
?admin=1
?admin=0
```

This flag is **UI state only** and is not an authentication mechanism. Cloudflare Access remains the private API authentication boundary.

## Environment

See `.env.example`. No secret belongs in a `VITE_*` variable because all Vite client variables are public browser data.

## GitHub Pages

Production URL:

```text
https://shinobione.github.io/shinobiwan-studio/
```

The Actions workflow builds `dist/` and deploys through GitHub Pages.

## Versioning discipline

Each release must update together:

1. `package.json` version;
2. `src/release.ts` version/build/codename;
3. visible Studio release label;
4. `CHANGELOG.md`;
5. README / integration documentation affected by the change;
6. regression guards for security-sensitive contracts;
7. PR description with validation, dependency and rollback scope.
