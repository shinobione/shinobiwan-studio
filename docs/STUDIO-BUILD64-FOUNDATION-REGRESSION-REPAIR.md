# Studio v0.19.3 · Build 64 — Foundation Regression Repair

Status: **DEPLOYED CANDIDATE · FAILED REAL USER SMOKE · SUPERSEDED**  
Date: 2026-08-13  
Trigger: real Studio smoke performed before Phase 7-C runtime Slice 1  
Backend dependency: **Track Manager v5.21 · Studio bridge v1.11**

## Why Build 64 exists

The accepted Build 62 Studio Focus runtime exposed three foundation regressions during a new real-user smoke after Phase 7-C contract documentation was merged:

1. **Canonical Album artwork wrote successfully but Studio still rendered initials.**
   - The Album manifest + private asset state reported Cover and Thumbnail present.
   - Studio artwork presentation incorrectly depended on the public LaunchPAD Album projection, which does not have to expose a private/draft Album.
2. **Track-side Album cache and canonical Album membership could diverge.**
   - A Track could display `Pulse Dominion` while `album.trackIds` still contained zero tracks.
   - The generic Track Metadata editor exposed Album title/ID even though `album.trackIds` is the membership authority.
3. **Missing canonical lyrics had a Focus UX dead-end.**
   - `AssetsManager` already supported guarded `lyrics` TXT upload.
   - The Focus Lyrics page no longer surfaced that operation when `lyrics.txt` was absent.

These were foundation repairs, so Phase 7-C runtime Slice 1 was paused while the repair was validated.

## Corrective contract

### Album artwork

- Studio Album visuals prefer private canonical Album asset state.
- If a private Cover/Thumbnail exists, Studio uses the protected Track Manager Album media URL.
- Public Album visuals are only fallback for Albums without private artwork state.
- Draft artwork is not exposed through the public Worker.

### Album authority

- `album.trackIds` remains the only membership/order authority.
- Track Metadata no longer exposes editable Album title/ID.
- Studio Metadata patches no longer send the track-side `album` compatibility cache.
- Track Manager v5.21 also removes `album` from the generic Studio metadata allowlist, closing the same hole server-side.
- Track Details exposes **Verify / repair membership** for a non-Singles cache claim.
- Verification fresh-reads the claimed Album plus all canonical Album owners.
- No write occurs when membership is already correct.
- A conflicting canonical owner blocks repair; Studio never guesses.
- Automatic repair is only offered for a fresh `draft` target Album.
- Repair requires explicit browser confirmation.
- Repair uses existing guarded `album-track-move-v1` with `sourceAlbumId: null`.
- Success requires client reread of target Album, optional source Album, and Track cache.
- No blind retry is introduced.

### Lyrics

- When private read is active and `lyrics.txt` is missing, the Focus Lyrics path exposes the existing guarded Lyrics asset operation.
- Upload semantics remain explicit file choice + confirmation + Track Manager guarded asset write + canonical reread.
- `lyrics.txt` remains the unique canonical lyrics source; `.lrc` remains optional export/compatibility.

## Backend dependency — TM v5.21

Track Manager v5.21 / bridge v1.11 adds protected read-only Album media routes and removes the Album cache field from the generic Studio metadata write allowlist. The public Worker remains v2.7 and was not redeployed for this repair.

## Why Build 64 failed smoke

The deployed Build 64 candidate fixed the original foundation issues, but its Lyrics compatibility adapter introduced a self-triggering `MutationObserver` loop. Rewriting the disclosure label generated another DOM mutation, which could repeatedly retrigger the observer and freeze affected Track/Lyrics routes.

The user therefore encountered `Loading Track Workspace…` hangs and Lyrics-route crashes on Tracks with missing lyrics. Build 64 was correctly rejected and never received REAL USER PASS.

## Successor lineage

- **Build 65** — idempotent Lyrics crash corrective; removed the mutation-loop failure mode.
- **Build 66** — stronger Audio/Cover/Thumbnail/Lyrics/Video-Canvas identity and explicit missing-master-audio synchronization prerequisite.
- **Build 67** — permanent top-level `LYRICS TXT` source anchor before synchronization; final accepted repair runtime.

Final closeout: [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md).

Historical candidates never receive retroactive acceptance.
