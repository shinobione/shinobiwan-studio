# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.4.3`  
**Build:** `8`  
**Current milestone:** Phase 4B.1B preparation — metadata write capability awareness, production writes still disabled

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the SHINOBIWAN toolchain.

Core rules:

- `trackId = R2 manifest slug`;
- LaunchPAD stays the public product;
- R2 stays the catalog/media source of truth;
- Track Manager stays the protected catalog/admin backend and write fallback;
- SonicTrace stays the audio-intelligence engine;
- LRC Maker stays the lyrics editing/synchronization engine during migration;
- Studio must degrade safely when Track Manager private access or the SonicTrace GPU node is unavailable.

## Current scope

Implemented today:

- GitHub Pages Studio shell;
- LaunchPAD public catalog read + Track Manager private-first read;
- automatic `PUBLIC FALLBACK` when private access is unavailable;
- Track Workspace with Overview, Audio Intelligence, Lyrics, Assets, Versions, Metadata and Publishing;
- Content Health with timestamp-aware synchronized lyrics semantics;
- metadata proposal editor;
- validation-only metadata POST with `expectedUpdatedAt` stale-manifest protection;
- no-preflight `text/plain` validation transport proven in real Chrome;
- strict build-time bridge regression guard.

Build 8 adds one compatibility rule only: Studio now recognizes **exactly one future bridge write capability**, `metadata`, so Track Manager v5.11 can advertise that capability without knocking Studio private reads into fallback.

Build 8 itself still exposes **no metadata save client, no Save CTA, no asset upload, no delete, no publish and no catalog rebuild action**. `adminService.writesEnabled` remains `false`.

## Why Build 8 exists

Build 7 deliberately rejected any non-empty `capabilities.write` list. That was correct while the bridge was validation-only, but it creates a deployment-order trap: deploying a future backend that truthfully advertises `write: ["metadata"]` would make the existing Studio reject the health response and fall back to the public catalog.

Build 8 removes that trap safely:

```text
accepted bridge write capabilities:
- []
- ["metadata"]

rejected:
- any other write capability
```

This allows the safe rollout sequence:

1. deploy Studio Build 8 while Track Manager v5.10 still reports `write: []`;
2. deploy Track Manager v5.11 / bridge v1.3 with `write: ["metadata"]`;
3. verify PRIVATE READ still works;
4. only then deploy the later Studio build that exposes the real Save metadata flow.

## Current production dependency

At the time Build 8 is prepared, production still runs:

- LaunchPAD public app: Build `2026.08.08.66` / release `studio-metadata-validation-20260808`;
- Track Manager `v5.10` / Studio bridge `v1.2`;
- private Worker Version ID `5ac91e36-9060-4e05-a76c-67c46459c72d`;
- public Worker `v2.6` unchanged;
- no R2 migration or catalog rebuild caused by Studio Build 8.

The next backend release is planned as Track Manager `v5.11` / bridge `v1.3`, metadata-write only.

## Metadata validation contract

Current browser validation request:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
Content-Type: text/plain;charset=UTF-8
Accept: application/json
credentials: include
```

JSON text body:

```json
{
  "intent": "metadata-validate-v1",
  "expectedUpdatedAt": "<canonical updatedAt>",
  "metadata": {}
}
```

The response is a preview only. No manifest, media object or catalog index is written by validation.

## Planned Phase 4B.1B write contract

The real metadata save path will remain deliberately narrow:

```text
Edit locally
  -> Validate
  -> Review normalized preview
  -> explicit Save metadata confirmation
  -> backend revalidates expectedUpdatedAt + quality
  -> write manifest metadata only
  -> rebuild catalog index
  -> reread canonical manifest
```

The write endpoint will not accept asset fields, slug replacement, media uploads, delete, thumbnail writes or publication shortcuts. Published metadata changes will still pass Track Manager quality checks.

## Lyrics semantics

Lyrics synchronization is content-driven:

- `lyrics.txt` present = canonical lyrics source;
- timestamps detected in the canonical lyrics content = `Synced Lyrics`;
- a separate `.lrc` sidecar is optional, not required.

## Safety / rollback

Current safety branches include:

```text
safety/pre-integration-20260808-1048
safety/pre-cors-hotfix-20260808-1540
safety/pre-4b1b-metadata-write-20260808-1612
```

Phase 4B.1B rollout rules:

- separate PRs per repository;
- no coordinated breaking merge;
- backend and Studio releases validated independently;
- no red CI merges;
- admin Worker deploy only when a Track Manager backend release requires it;
- public Worker stays untouched unless explicitly required;
- no media mutation in the metadata-write phase;
- Track Manager UI remains the operational fallback until Studio writes are proven in a real browser.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

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

`npm run build` runs the Studio bridge security regression guard before TypeScript/Vite compilation.

## Production URL

```text
https://shinobione.github.io/shinobiwan-studio/
```

## Versioning discipline

Every release updates together:

1. `package.json`;
2. `src/release.ts`;
3. visible version/build;
4. `CHANGELOG.md`;
5. README / affected `.md` documentation;
6. security-sensitive regression guards;
7. PR scope, dependency and rollback notes.
