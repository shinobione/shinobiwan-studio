# PHASE UX · C2.5-D2 — New Track canonical Album binding

Studio release: `0.11.1` / Build `33`  
Codename: `phase-ux-c2-5-d2-new-track-album-binding`  
Backend dependency: Track Manager `v5.17` / Studio bridge `v1.9`  
Backend deployment run: `31435939170`  
Backend Worker Version ID: `de516167-e5d7-4ca0-a9f3-e732e6d88a37`  
Safety ref: `safety/pre-c2-5-d2-new-track-album-binding-20260810-0032`

## Purpose
D2 closes the New Track / Album architecture gap without starting historical Album migration. TXT/manual `ALBUM` values are resolved against canonical Album manifests before Review. Studio refuses to create a track with an unknown or non-draft canonical Album reference.

## Safe transaction order
When the requested target is a canonical draft Album:

1. create the new track as a recoverable `Singles` draft;
2. canonical reread of that draft;
3. upload selected track assets sequentially with fresh manifest revisions;
4. fresh-read the target canonical Album;
5. require the target to still be `draft`;
6. bind only the newly-created track through Track Manager `album-track-move-v1` with `sourceAlbumId: null`;
7. canonical reread verifies Album membership and the track Album cache.

If any pre-binding step fails, the track remains a valid draft in transitional Singles. An Album transport failure is never blindly retried; Studio rereads Album + track state and treats only a verified committed move as success.

## Missing Album flow
An unknown `ALBUM:` value cannot pass Metadata → Review. Studio displays that no canonical Album exists and offers an explicit, confirmed **Create canonical Album/EP/Collection draft** action. This write happens only on the user click and does not migrate any legacy Album or existing track.

## Published / archived Albums
A new draft track cannot be added from intake to a canonical `published` or `archived` Album. Studio blocks Review and points the user to Albums / Projects. This aligns with Track Manager quality guards and prevents a published release from being silently degraded by an unpublished track.

## Frozen migration boundary
D2 binds only the track that this intake just created. Existing legacy/Singles tracks remain unavailable for ad-hoc canonical assignment until the separately authorized C2.5-E migration.

## Preserved
- LaunchPAD public remains Build 88.
- Track Manager remains v5.17 / bridge v1.9; no Worker change/deploy is required.
- No automatic production R2 mutation occurs in CI or Pages deployment.
- LRC Maker remains 6.3.8 and `lyrics.txt` remains the unique canonical Lyrics source.
- C2.5-E/F remain not started.
- SonicTrace C3 remains suspended.
- Final PHASE UX checkpoint is not created.
- Phase 7 remains forbidden.
