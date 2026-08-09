# SHINOBIWAN Studio — Phase 6 complete

Studio release: `0.9.4` / Build `19` / `phase6-canonical-reread-hotfix`

Track Manager target: `v5.15` / Studio bridge `v1.7`

LRC Maker target: `6.3.3`

## Canonical rule

The single authority is `tracks/<slug>/lyrics.txt`. Timestamp tags inside this text determine synchronization status. A `.lrc` download is an optional export and never a required catalog asset or Content Health input.

## Phase 6A / 6B — context and guarded save

1. Studio identifies the selected canonical `trackId`.
2. LRC Maker fetches the protected audio, lyrics text, manifest revision and lyrics ETag from Track Manager.
3. The timing engine serializes lyrics-only timestamp text.
4. LRC Maker canonicalizes only storage-level representation before validate/save: an initial UTF-8 BOM is removed and `CRLF` / `CR` line endings become `LF`, matching Track Manager normalization.
5. Track Manager validates exact track identity, stale controls, UTF-8, timestamp syntax/order/completeness and audio duration.
6. Track Manager writes only `lyrics.txt`, advances the manifest revision and rebuilds the catalog when the existing contract requires it.
7. Track Manager rereads the canonical objects; failures trigger the existing rollback path.
8. LRC Maker compares the canonical reread against the same canonicalized text representation. Line-ending-only differences no longer create a false save failure, while real lyric differences still fail the guard.
9. After save, Studio refreshes the canonical Track Workspace and derives Synced Lyrics from the reread timestamps.

## Phase 6C — embedded Lyrics Studio

The right-hand Lyrics workspace panel loads the **real LRC Maker synchronizer engine** through the dedicated `build/embed/lyrics-studio.js` bundle. LRC Maker registers a `shinobiwan-lyrics-studio` Web Component which:

- mounts the existing React `Synchronizer` and audio controls;
- receives only the canonical `trackId` from Studio;
- loads canonical audio and `lyrics.txt` through Track Manager;
- saves through the same v5.15 specialized guarded routes;
- emits a local `lyrics-saved` event after canonical reread;
- is isolated with Shadow DOM so LRC Maker styles do not leak into Studio;
- exposes tag cleanup, empty-line cleanup and timestamp click-to-seek in the embedded workflow.

This is intentionally **not an iframe**, not a copied synchronizer implementation and not a new lyrics store. The standalone LRC Maker page remains available as a secondary fallback.

## Build 19 regression hotfix

The Build 18 deployed workflow exposed a false negative after a successful save: LRC Maker compared `refreshed.lyrics.text` with the editor serialization byte-for-byte, while Track Manager intentionally normalizes BOM and line endings before R2 storage.

Build 19 + LRC Maker 6.3.3 preserve canonical reread verification but compare normalized storage representation instead of raw editor representation. Regression coverage explicitly proves:

- BOM removal is accepted;
- `CRLF` and `LF` forms of the same lyrics compare equal;
- a real wording difference still compares different;
- the previous raw `refreshed.lyrics.text !== lyrics` guard cannot return.

## Safety boundary

- no iframe;
- no audio or lyrics in query parameters;
- no direct browser write to R2;
- no `.lrc` source of truth;
- no Track Manager/Worker code change for Build 19;
- no Worker deployment required;
- no SonicTrace schema or data change;
- no public LaunchPAD version change;
- no Phase 7 work.

## Dependency order

1. LRC Maker `6.3.3` must be built and deployed first so the corrected `/lrc-maker/embed/lyrics-studio.js` is live.
2. Studio `0.9.4` / Build `19` then consumes that asset with cache key `6.3.3`.
3. Track Manager remains at v5.15 / bridge v1.7; no Cloudflare deployment is required.
4. One real protected save smoke test must confirm `lyrics.txt synchronisé et relu`, Studio refresh and Synced Lyrics before the final Phase 6 checkpoint is created.

## Rollback

Immediate pre-hotfix checkpoints:

- `lrc-maker`: `safety/pre-phase6-reread-hotfix-20260809-0354`
- `shinobiwan-studio`: `safety/pre-phase6-reread-hotfix-20260809-0354`

Feature branches:

- `hotfix/phase6-canonical-reread`

After the real save smoke test passes, create a final `safety/phase6-complete-*` checkpoint on the deployed production heads. Phase 7 remains strictly behind its STOP LINE.
