# SHINOBIWAN Studio — Phase 6 final production checkpoint

Date: `2026-08-09`

Status: **PHASE 6 COMPLETE — PRODUCTION VALIDATED**

Stop line: **PHASE 7 MUST NOT START WITHOUT EXPLICIT USER AUTHORIZATION.**

## Frozen production state

### SHINOBIWAN Studio

- release: `0.9.5`
- build: `20`
- codename: `phase6-native-lyrics-sync-restore`
- production source commit before this documentation-only closeout: `38b47441a7c59181045000ebcc4fd86b2d1829b3`
- producer dependency: LRC Maker `6.3.4`
- production deploy workflow: `31291318828`
- deploy result: success

### LRC Maker

- version: `6.3.4`
- production source commit: `8bd3f3fd52acc1217a65216541c0b7e40fcab5ba`
- PR: `#12`
- final PR Build workflow: `31291273801`
- production Pages deploy workflow: `31291292303`
- deploy result: success

### Track Manager / LaunchPAD-APP

- repository production head: `23a7b494b89d4958f573f0889057b53a44aa23b6`
- Track Manager: `v5.15`
- Studio bridge: `v1.7`
- deployment target remains: `admin`
- protected canonical media Range/206 support remains active
- no Track Manager code change was required by Build 20
- no new Worker deployment was performed for the Build 20 native LRC synchronization restore
- public LaunchPAD / public Worker remain outside this closeout and unchanged by the Build 20 hotfix

## Production smoke validation

The authenticated production browser smoke test was completed after both LRC Maker `6.3.4` and Studio `0.9.5` Build `20` were deployed.

Validated behavior:

1. standalone LRC Maker uses the restored native synchronization workflow;
2. simple click selects a lyric line without moving the audio;
3. double-click on a timestamped line repositions playback to that line timestamp;
4. `Espace` writes the current audio time to the selected line;
5. the selection then advances exactly one lyric line;
6. the next `Espace` timestamps the newly selected next line rather than the line above;
7. the same workflow is valid inside the embedded Lyrics Studio in SHINOBIWAN Studio;
8. protected canonical `lyrics.txt` save/reread succeeds without the false canonical-reread error banner introduced before the 6.3.3 normalization hotfix.

User production verdict after the requested standalone + embedded smoke sequence: **`nickel`**.

## Canonical contracts frozen at Phase 6 closeout

- `tracks/<slug>/lyrics.txt` is the only canonical lyrics source;
- timestamps inside canonical `lyrics.txt` define synchronized lyrics;
- `.lrc` remains optional export/compatibility only;
- `trackId` remains the canonical R2 slug across Studio, Track Manager, SonicTrace and LRC Maker context;
- Track Manager remains the sole protected R2 write authority;
- Studio passes only canonical context and does not ship R2/Access secrets;
- LRC Maker standalone remains the fallback and shares the same synchronization engine as the embed;
- canonical save keeps manifest revision + lyrics ETag stale guards;
- backend normalization remains BOM removal plus `CRLF` / `CR` to `LF` only;
- real canonical reread differences remain blocking;
- public LaunchPAD is not coupled to this private lyrics workflow.

## Final checkpoint branches

After this documentation-only closeout PR is merged and its Studio Pages deployment is green, create the same immutable operational checkpoint name on the final production heads:

` safety/phase6-complete-20260809-0513 `

Required repositories:

- `shinobione/shinobiwan-studio`
- `shinobione/lrc-maker`
- `shinobione/LaunchPAD-APP`

The Studio branch must point to the final documentation-closeout merge commit; LRC Maker must point to `8bd3f3fd52acc1217a65216541c0b7e40fcab5ba`; LaunchPAD-APP / Track Manager must point to `23a7b494b89d4958f573f0889057b53a44aa23b6`.

## Phase 7 STOP

Phase 6 is closed after the final checkpoint branches above are created and verified.

**Do not implement, scaffold, partially start, merge, deploy, or prepare Phase 7 runtime changes without a new explicit authorization from the user.**
