# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.5.2`  
**Build:** `11`  
**Current milestone:** Phase 4B.2A — lyrics write capability awareness, lyrics writes still locked

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the SHINOBIWAN toolchain.

Core rules:

- `trackId = R2 manifest slug`;
- LaunchPAD stays the public product;
- R2 stays the catalog/media source of truth;
- Track Manager stays the protected catalog/admin backend and full-write fallback;
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
- non-mutating metadata validation with stale-manifest protection;
- no-preflight `text/plain` metadata transport proven in real Chrome;
- one guarded production write: metadata save;
- explicit validate → review → confirm → save flow;
- backend manifest reread + browser canonical reread after save;
- production proof + clean restoration of the metadata write;
- Phase 4B.2 read-only lyrics audit completed;
- future lyrics bridge capability recognized without activating a lyrics write client;
- strict build-time bridge/write regression guard.

## Phase 4B.2A — capability awareness only

Build 11 is deliberately **not** a lyrics-write release.

It solves the same safe-deployment ordering problem previously solved before metadata write: a future Track Manager backend must be able to truthfully advertise a new `lyrics` capability without an older Studio treating that capability as hostile and dropping into `PUBLIC FALLBACK`.

Build 11 therefore recognizes:

```text
metadata
lyrics
```

as allowed bridge write capability names, while its actually callable client surface remains:

```text
metadata only
```

The distinction is explicit:

```text
recognizedWriteCapabilities = ["metadata", "lyrics"]
writeCapabilities           = ["metadata"]
lyricsWriteEnabled          = false
```

Build 11 still has exactly two explicit POST clients:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
POST /api/studio/tracks/<trackId>/metadata/save
```

Build 11 has **no**:

```text
/lyrics/validate
/lyrics/save
PUT
PATCH
DELETE
```

and no asset upload, delete, publish shortcut or standalone catalog rebuild client.

This means Build 11 can safely be deployed against the current Track Manager v5.11 / bridge v1.3, and later remain compatible if a separately reviewed v5.12 / bridge v1.4 begins advertising `write: ["metadata", "lyrics"]`.

## Phase 4B.1B — production proof

Build 9 introduced exactly one production write capability:

```text
write: ["metadata"]
```

Build 10 recorded that the flow had been proven end-to-end in real production. Build 11 preserves that exact active write behavior while only widening future capability recognition.

The proven Metadata sequence is:

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

### Real production smoke test

Track: `soft-addiction` / **Soft Addiction**.

First reversible write:

- field: `keyConfidence`;
- temporary value: `0.01`;
- changed fields: exactly `keyConfidence`;
- saved canonical revision: `2026-08-08T16:21:15.503Z`;
- catalog rebuilt: yes;
- browser canonical reread: verified;
- quality remained publishable;
- media objects were not modified.

Restoration write:

- `keyConfidence` restored to its original empty/null state;
- changed fields: exactly `keyConfidence`;
- restored canonical revision: `2026-08-08T16:22:10.890Z`;
- catalog rebuilt: yes;
- browser canonical reread: verified;
- quality returned to `ready`, publishable `Yes`, errors/warnings `0 / 0`;
- media objects were not modified.

This completed an intentional write + restoration cycle without leaving the smoke-test marker in the canonical metadata.

## Production dependency

Public LaunchPAD remains unchanged:

- app Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6`.

Protected Track Manager backend:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- LaunchPAD merge SHA `49728e908fcfaff3f6edf9cf3f9b7d2bb23ce8a3`;
- private Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- protected deployment workflow run `31264114407`;
- deployment target `admin` only;
- Cloudflare Access protection confirmed (`302` unauthenticated);
- public Worker deployment steps were skipped.

Studio Build 9 merge SHA: `4737309b0d5c2814744d1ee999ce904af71ffcb7`.
Studio Build 10 production-proof merge SHA: `a01634b0db78354d238f1b1d97e8b4bfe0bdab5b`.

Build 11 itself requires **no Worker deployment** because the backend runtime is unchanged.

## Metadata endpoints

Validation remains non-mutating:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
Content-Type: text/plain;charset=UTF-8
credentials: include
```

Save remains the only mutating Studio route:

```text
POST /api/studio/tracks/<trackId>/metadata/save
Content-Type: text/plain;charset=UTF-8
credentials: include
```

Save body:

```json
{
  "intent": "metadata-save-v1",
  "expectedUpdatedAt": "<validated canonical revision>",
  "metadata": {}
}
```

Before posting, Studio rereads bridge health and refuses to save unless the deployed bridge advertises `write: ["metadata"]`.

## Data safety

Metadata save is whitelist-only and does not accept media or identity fields.

Preserved by the backend:

- slug / canonical `trackId`;
- audio/cover/thumbnail/lyrics/video asset filenames;
- migration provenance;
- `createdAt`.

Still unavailable in Studio Build 11:

- audio upload/replace;
- cover upload/replace;
- thumbnail mutation;
- **lyrics validate/save**;
- Canvas/video upload/replace;
- track delete;
- standalone publish shortcut;
- standalone catalog rebuild.

A successful metadata change writes the canonical manifest and rebuilds `catalog/index.json` so LaunchPAD cannot drift from the canonical manifest.

## Stale and quality guards

Both metadata validation and save require `expectedUpdatedAt`.

If another tool changes the manifest first, Track Manager returns `STALE_MANIFEST`; Studio requires reload + new validation instead of overwriting.

Published proposals must satisfy Track Manager quality rules. A non-publishable published proposal is rejected with `QUALITY_BLOCKED` before persistence.

## Rollback

Track Manager v5.11 attempts transactional recovery if catalog publication fails after the manifest write:

1. restore the previous manifest;
2. rebuild the catalog from the restored state;
3. return `SAVE_ROLLBACK` with rollback status.

Preferred rollback checkpoints:

```text
safety/pre-4b2-lyrics-write-20260808-1837
safety/post-metadata-write-proven-20260808-1822
safety/post-v5.11-pre-build9-20260808-1732
safety/pre-4b1b-metadata-write-20260808-1612
safety/pre-cors-hotfix-20260808-1540
safety/pre-integration-20260808-1048
```

The first checkpoint is the immediate pre-4B.2 runtime boundary. The second is the last fully production-proven write boundary.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md), [`docs/PHASE-4B1B-METADATA-SAVE.md`](docs/PHASE-4B1B-METADATA-SAVE.md) and [`docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md`](docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md).

## Lyrics semantics

Lyrics synchronization is content-driven:

- `lyrics.txt` present = canonical lyrics source;
- timestamps detected in the canonical lyrics content = `Synced Lyrics`;
- a separate `.lrc` sidecar is optional, not required.

The Phase 4B.2 audit confirmed this model is already native to Track Manager: canonical lyrics uploads are TXT-only and `timestampsAvailable` is derived from text parsing, not an `.lrc` filename.

LRC Maker remains compatible because it can import `.txt`/`.lrc`, preserve timestamps and export plain text. No LRC Maker runtime change is needed before the first guarded Studio lyrics save.

## Next safety gate — Phase 4B.2B

Only after Build 11 is merged, deployed and verified `PRIVATE READ` may a backend lyrics capability be opened.

The audited target design requires:

1. a dedicated Track Manager lyrics contract, separate from metadata;
2. `expectedUpdatedAt` plus a server-provided lyrics object revision/ETag;
3. first implementation limited to updating an existing canonical `lyrics.txt`;
4. no missing-file creation or filename migration in the first write subphase;
5. no audio/cover/thumbnail/video/delete/arbitrary-metadata mutation;
6. catalog refresh so timestamp/sync projection stays current;
7. rollback of lyrics + manifest + catalog if publication fails;
8. real-browser write + restoration proof before broadening scope.

The backend audit/spec lives in `LaunchPAD-APP/docs/STUDIO-LYRICS-WRITE-AUDIT.md`.

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

No risky cross-repository capability is considered complete until CI, deployment and a real-browser smoke test have all passed independently.
