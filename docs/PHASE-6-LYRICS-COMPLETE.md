# SHINOBIWAN Studio — Phase 6 complete

Studio release: `0.9.1` / Build `16` / `phase6-embedded-lyrics-studio`

Track Manager target: `v5.15` / Studio bridge `v1.7`

LRC Maker target: `6.3.0`

## Canonical rule

The single authority is `tracks/<slug>/lyrics.txt`. Timestamp tags inside this text determine synchronization status. A `.lrc` download is an optional export and never a required catalog asset or Content Health input.

## Phase 6A / 6B — context and guarded save

1. Studio identifies the selected canonical `trackId`.
2. LRC Maker fetches the protected audio, lyrics text, manifest revision and lyrics ETag from Track Manager.
3. The timing engine serializes lyrics-only timestamp text.
4. Track Manager validates exact track identity, stale controls, UTF-8, timestamp syntax/order/completeness and audio duration.
5. Track Manager writes only `lyrics.txt`, advances the manifest revision and rebuilds the catalog when the existing contract requires it.
6. Track Manager rereads the canonical objects; failures trigger the existing rollback path.
7. After save, Studio refreshes the canonical Track Workspace and derives Synced Lyrics from the reread timestamps.

## Phase 6C — embedded Lyrics Studio

Build 16 completes the intended UI integration rather than treating the external LRC Maker page as the primary workflow.

The right-hand Lyrics workspace panel loads the **real LRC Maker synchronizer engine** through a dedicated `build/embed/lyrics-studio.js` bundle. LRC Maker registers a `shinobiwan-lyrics-studio` Web Component which:

- mounts the existing React `Synchronizer` and audio controls;
- receives only the canonical `trackId` from Studio;
- loads canonical audio and `lyrics.txt` through Track Manager;
- saves through the same v5.15 specialized guarded routes;
- emits a local `lyrics-saved` event after canonical reread;
- is isolated with Shadow DOM so LRC Maker styles do not leak into Studio.

This is intentionally **not an iframe**, not a copied synchronizer implementation and not a new lyrics store. The standalone LRC Maker page remains available as a secondary fallback.

## Safety boundary

- no iframe;
- no audio or lyrics in query parameters;
- no direct browser write to R2;
- no `.lrc` source of truth;
- no backend/Worker change for Build 16;
- no SonicTrace schema or data change;
- no public LaunchPAD version change;
- no Phase 7 work.

## Dependency order

1. LRC Maker `6.3.0` must be built and deployed first so `/lrc-maker/embed/lyrics-studio.js` exists.
2. Studio `0.9.1` / Build `16` may then consume that stable embed asset.
3. Track Manager remains at v5.15 / bridge v1.7; no Cloudflare deployment is required for this Phase 6C patch.

## Rollback

Pre-patch checkpoints:

- `lrc-maker`: `safety/pre-phase6-embedded-lyrics-20260809-0147`
- `shinobiwan-studio`: `safety/pre-phase6-embedded-lyrics-20260809-0147`

Feature branches:

- `agent/phase6-embedded-lyrics-studio`

Phase 7 remains behind its STOP LINE until the embedded workflow is smoke-tested in the deployed Studio.
