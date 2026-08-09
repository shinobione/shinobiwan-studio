# SHINOBIWAN Studio — Phase 6 complete

Studio release: `0.9.5` / Build `20` / `phase6-native-lyrics-sync-restore`

Track Manager target: `v5.15` / Studio bridge `v1.7`

LRC Maker target: `6.3.4`

Production status: **VALIDATED / COMPLETE**

Final checkpoint name: `safety/phase6-complete-20260809-0513`

Phase 7: **STOP — explicit user authorization required**

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

## Final production proof — 2026-08-09

The requested real-browser production smoke was completed after both runtime deployments were green.

Frozen runtime revisions used by the smoke:

```text
Studio       0.9.5 / Build 20
Studio SHA   38b47441a7c59181045000ebcc4fd86b2d1829b3
Studio deploy workflow 31291318828

LRC Maker    6.3.4
LRC SHA      8bd3f3fd52acc1217a65216541c0b7e40fcab5ba
LRC PR CI    31291273801
LRC deploy workflow 31291292303

Track Manager v5.15 / bridge v1.7
LaunchPAD-APP SHA 23a7b494b89d4958f573f0889057b53a44aa23b6
```

Validated in production:

1. standalone simple click selects without seeking;
2. standalone double-click returns to the existing timestamp;
3. standalone `Espace` timestamps the selected line then advances exactly one line;
4. the following `Espace` timestamps the newly selected next line rather than the line above;
5. embedded Lyrics Studio reproduces the same native sequence;
6. protected canonical `lyrics.txt` save/reread succeeds without the false canonical-reread mismatch banner;
7. the user confirmed the complete requested smoke sequence with **`nickel`**.

See [`PHASE-6-FINAL-CHECKPOINT.md`](PHASE-6-FINAL-CHECKPOINT.md) for the frozen repository heads and final STOP boundary.

## Safety boundary

- no iframe;
- no audio or lyrics in query parameters;
- no direct browser write to R2;
- no `.lrc` source of truth;
- no Track Manager/Worker code change for Build 20;
- no Worker deployment required for Build 20;
- no SonicTrace schema or data change;
- no public LaunchPAD version change;
- no Phase 7 work.

## Dependency order — completed

1. LRC Maker `6.3.4` was built and deployed first.
2. Studio `0.9.5` / Build `20` then consumed that asset with cache key `6.3.4`.
3. Track Manager remained at v5.15 / bridge v1.7.
4. Standalone synchronization smoke passed.
5. Embedded synchronization smoke passed.
6. Protected canonical `lyrics.txt` save/reread passed.
7. Final Phase 6 checkpoint is frozen as `safety/phase6-complete-20260809-0513` on Studio, LRC Maker and LaunchPAD-APP / Track Manager production heads after the documentation-only closeout merge.
8. **STOP before Phase 7.**

## Rollback

Earlier immediate pre-hotfix checkpoints remain preserved:

- `lrc-maker`: `safety/pre-phase6-reread-hotfix-20260809-0354`
- `shinobiwan-studio`: `safety/pre-phase6-reread-hotfix-20260809-0354`
- `lrc-maker`: `safety/pre-phase6-native-sync-restore-20260809-0443`
- `shinobiwan-studio`: `safety/pre-phase6-native-sync-restore-20260809-0443`

Final Phase 6 checkpoint:

- `shinobione/shinobiwan-studio`: `safety/phase6-complete-20260809-0513`
- `shinobione/lrc-maker`: `safety/phase6-complete-20260809-0513`
- `shinobione/LaunchPAD-APP`: `safety/phase6-complete-20260809-0513`

## Phase 7 stop line

**PHASE 6 IS COMPLETE.**

Do not implement, scaffold, prepare, merge or deploy Phase 7 work until the user gives a new explicit authorization.
