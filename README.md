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
- LRC Maker stays the advanced lyrics editing/synchronization engine during migration;
- Studio must degrade safely when private services are unavailable.

## Current production boundary

Studio already has one production-proven write capability:

```text
metadata
```

The metadata write was proven end-to-end on `soft-addiction`, then restored cleanly:

- temporary revision `2026-08-08T16:21:15.503Z`;
- restored revision `2026-08-08T16:22:10.890Z`;
- catalog rebuilt on both saves;
- browser canonical reread verified;
- final quality `ready`, publishable `Yes`, errors/warnings `0 / 0`;
- audio, cover, thumbnail, lyrics and video were untouched.

Protected backend currently deployed:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- private Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- public LaunchPAD Build `2026.08.08.66` unchanged;
- public media Worker `v2.6` unchanged.

## Phase 4B.2A — what Build 11 changes

Build 11 is a **compatibility-preparation release only**.

It lets Studio accept a future bridge that truthfully reports:

```json
{
  "write": ["metadata", "lyrics"]
}
```

without forcing private reads into `PUBLIC FALLBACK`.

This does **not** activate lyrics writing.

The distinction is explicit in code:

```text
recognized bridge capabilities: metadata, lyrics
active Studio write clients:     metadata only
lyricsWriteEnabled:              false
```

Build 11 still contains exactly two explicit POST clients:

```text
POST .../metadata/validate
POST .../metadata/save
```

It contains no:

```text
/lyrics/validate
/lyrics/save
PUT
PATCH
DELETE
```

and no audio/cover/thumbnail/video/delete/publish/standalone-rebuild mutation client.

## Frozen lyrics model

The read-only Phase 4B.2 audit confirmed that the existing toolchain already supports the desired model:

```text
canonical source = tracks/<slug>/lyrics.txt
timestamps in lyrics.txt = synchronized
.lrc sidecar = optional compatibility/export only
```

Track Manager already accepts `.txt` only for its canonical `lyrics` upload kind and derives `timestampsAvailable` from the text contents rather than the filename extension.

LRC Maker can import `.txt` or `.lrc`, preserve timestamp text and export `text/plain`; it does not need a runtime change for the first Studio lyrics-write phase.

## Safe Phase 4B.2 rollout

1. **Build 11 / 4B.2A** — Studio recognizes a future lyrics capability but exposes no lyrics write.
2. **Backend 4B.2B** — add an independently guarded Track Manager lyrics validation/update contract only after Build 11 is live.
3. Verify Build 11 remains `PRIVATE READ` against the future backend.
4. **Studio 4B.2C** — only then expose lyrics validation/save UI.
5. Prove a reversible real-browser lyrics write + restoration before broadening scope.

The proposed first backend update must operate on an existing canonical `lyrics.txt` only. Creation of missing lyrics files and legacy filename migration are separate later subphases.

## Proposed concurrency rule for lyrics

A future lyrics write should require both:

```text
expectedUpdatedAt
expectedLyricsRevision
```

The second value should be an opaque server-provided R2 object revision/ETag so stale lyrics tabs cannot overwrite a newer `lyrics.txt` even if manifest state is otherwise valid.

See the backend audit: `LaunchPAD-APP/docs/STUDIO-LYRICS-WRITE-AUDIT.md`.

## Safety / rollback

Current preferred known-good checkpoint after the metadata production proof:

```text
safety/post-metadata-write-proven-20260808-1822
```

Fresh checkpoint immediately before Phase 4B.2 runtime work:

```text
safety/pre-4b2-lyrics-write-20260808-1837
```

Both names exist in Studio and LaunchPAD/Track Manager.

Build 11 does not require a Track Manager Worker redeploy because the backend runtime is still v5.11/v1.3. No R2 object or catalog index is modified by deploying Build 11.

See:

- [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md)
- [`docs/PHASE-4B1B-METADATA-SAVE.md`](docs/PHASE-4B1B-METADATA-SAVE.md)
- [`docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md`](docs/PHASE-4B2A-LYRICS-CAPABILITY-PREP.md)

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

Backend/web deployment and R2 mutations remain separate facts. Unnecessary Worker redeploys are treated as risk, not progress.
