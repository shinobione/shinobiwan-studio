# SHINOBIWAN Studio — v0.11.0 / Build 32

Codename: `phase-ux-c2-5-d1-studio-album-management`

## Added
- `Albums / Projects` canonical release workspace.
- Guarded Track Manager v5.17 Album client.
- Draft Album / EP / Collection creation.
- Metadata/status/palette editing with canonical reread.
- Ordered canonical membership reorder/removal and transactional cross-Album move UI.
- Cover + generated thumbnail upload and guarded asset deletion.
- Four-destination mobile primary navigation.
- C2.5-D regression guard in `npm run check:ux`.

## Safety boundary
- Existing legacy/Singles tracks cannot be manually attached from D1; historical membership migration remains C2.5-E.
- D2 will bind newly-created tracks through guarded Album writes.
- Whole-Album deletion is not exposed.

## Preserved
LaunchPAD public remains Build 88. No Worker deployment is required. Tests/deployment perform no automatic production R2 Album mutation. No legacy Album migration or Singles conversion occurs. `lyrics.txt` remains canonical, LRC Maker remains 6.3.8, C3 remains suspended and Phase 7 remains forbidden.

## Test maintenance
Historical PHASE UX tests now guard their feature behavior rather than pinning the application forever to Build 31. Exact Build 32 identity is owned by the current C2.5-D guard.

## Next
Build 33 / C2.5-D2 integrates New Track with canonical Album resolution and guarded binding after Build 32 is green and published.
