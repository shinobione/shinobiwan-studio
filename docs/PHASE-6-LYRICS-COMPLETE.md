# SHINOBIWAN Studio — Phase 6 complete

Studio release: `0.9.5` / Build `20` / `phase6-native-lyrics-sync-restore`

Track Manager target: `v5.15` / Studio bridge `v1.7`

LRC Maker target: `6.3.4`

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
- exposes tag cleanup and empty-line cleanup in the embedded workflow;
- uses the native LRC Maker timing interaction: simple click selects, double-click repositions to an existing timestamp, `Espace` timestamps the selected line then advances exactly one line.

This is intentionally **not an iframe**, not a copied synchronizer implementation and not a new lyrics store. The standalone LRC Maker page remains available as a secondary fallback and shares the same synchronization behavior.

## Build 19 regression hotfix — canonical reread

Build 18 exposed a false negative after a successful save: LRC Maker compared `refreshed.lyrics.text` with the editor serialization byte-for-byte, while Track Manager intentionally normalizes BOM and line endings before R2 storage.

Build 19 + LRC Maker 6.3.3 preserve canonical reread verification but compare normalized storage representation instead of raw editor representation. Regression coverage proves BOM removal and CRLF/LF equivalence are accepted while a real wording difference remains blocking.

## Build 20 stabilization hotfix — restore native synchronization flow

Production testing then exposed a separate interaction regression introduced by LRC Maker 6.3.2. The added **single-click seek** changed the mature synchronization sequence. While correcting a line and continuing playback, the selection/timing flow could become conceptually offset so subsequent `Espace` presses appeared to timestamp the line above the intended lyric.

The decisive observation was that the same behavior occurred in standalone LRC Maker. This isolates the issue from Studio, Track Manager, R2 and the protected Range/206 media route.

LRC Maker 6.3.4 therefore restores the pre-click-to-seek `Synchronizer` behavior from commit `10dc5dce566db1ce31998680c3c40bf461c492e4`:

- simple click only selects a line;
- simple click does not assign `audioRef.currentTime`;
- double-click is again the explicit action to return to an existing line timestamp;
- `Espace` keeps native `ActionType.next`: write current audio time to the selected line, then select the next line.

Studio Build 20 changes only the embedded LRC Maker cache key from `6.3.3` to `6.3.4`, updates release metadata/docs and regression guards. No Track Manager or public LaunchPAD deployment is required.

## Safety boundary

- no iframe;
- no audio or lyrics in query parameters;
- no direct browser write to R2;
- no `.lrc` source of truth;
- no Track Manager/Worker code change for Build 20;
- no Worker deployment required;
- no SonicTrace schema or data change;
- no public LaunchPAD version change;
- no Phase 7 work.

## Dependency order

1. LRC Maker `6.3.4` must be built and deployed first so the restored `/lrc-maker/embed/lyrics-studio.js` is live.
2. Studio `0.9.5` / Build `20` then consumes that asset with cache key `6.3.4`.
3. Track Manager remains at v5.15 / bridge v1.7; no Cloudflare deployment is required.
4. Smoke test standalone first: double-click known line, play, `Espace`, verify selection advances one line; continue to next phrase and verify timestamp lands on the selected next line.
5. Repeat the same sequence in embedded Lyrics Studio.
6. Save `lyrics.txt` and verify canonical reread succeeds.
7. Only after those checks pass, create the final Phase 6 safety checkpoint and STOP.

## Rollback

Existing immediate pre-hotfix checkpoints remain preserved:

- `lrc-maker`: `safety/pre-phase6-reread-hotfix-20260809-0354`
- `shinobiwan-studio`: `safety/pre-phase6-reread-hotfix-20260809-0354`

Current stabilization branches:

- `lrc-maker`: `fix/phase6-restore-native-sync-flow`
- `shinobiwan-studio`: `fix/phase6-lrc-6.3.4-native-sync`

After the real standalone + embedded synchronization smoke test and protected save pass, create a final `safety/phase6-complete-*` checkpoint on the deployed production heads. Phase 7 remains strictly behind its STOP LINE.
