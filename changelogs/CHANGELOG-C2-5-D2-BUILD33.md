# SHINOBIWAN Studio — v0.11.1 / Build 33

Codename: `phase-ux-c2-5-d2-new-track-album-binding`

## Added
- Canonical Album resolution inside New Track intake.
- TXT/manual Album requests resolve against Track Manager v5.17 canonical Albums before Review.
- Unknown Album references are blocked instead of becoming phantom `albumId` values.
- Explicit confirmed creation of a missing canonical Album / EP / Collection draft.
- New tracks targeting an Album are created first in recoverable Singles state, then bound transactionally after verified uploads.
- Fresh target Album reread and draft-status check immediately before binding.
- Lost Album-write response recovery by canonical Album + track reread; no blind retry.
- Pure Album resolver regression tests for Singles, existing draft, missing, published and archived states.

## Preserved
- D1 Album Manager remains intact.
- Existing legacy/Singles tracks cannot be assigned by this intake; historical migration remains C2.5-E.
- LaunchPAD public remains Build 88.
- Track Manager remains v5.17 / bridge v1.9; no Worker deployment is required.
- No CI or Pages task creates production Album/track data.
- `lyrics.txt` remains canonical and LRC Maker remains 6.3.8.
- C2.5-E/F, C3, final PHASE UX checkpoint and Phase 7 remain untouched.
