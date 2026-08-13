# SHINOBIWAN Studio — v0.11.2 / Build 34

Codename: `phase-ux-c2-5-d2-album-request-hotfix`

## Fixed
- A manually entered non-Singles Album request now overrides the intake's safe initial `albumId = singles` state.
- Unknown Album titles therefore resolve to `missing` and block Metadata → Review instead of silently remaining Singles.
- Existing canonical draft Album titles still resolve correctly even if the stale initial ID is `singles`.
- D2 regression coverage now includes the exact real-user case found during smoke testing.

## Preserved
- Track creation still stages recoverably in Singles before any canonical Album binding.
- Missing Albums are never auto-created; the explicit confirmed draft-creation button remains the only write path.
- No Track Manager / Worker / R2 change is included.
- No historical Album migration is started.
- LaunchPAD remains Build 88; LRC Maker remains 6.3.8; SonicTrace remains unchanged.
- C2.5-E/F, C3, final PHASE UX checkpoint and Phase 7 remain untouched.
