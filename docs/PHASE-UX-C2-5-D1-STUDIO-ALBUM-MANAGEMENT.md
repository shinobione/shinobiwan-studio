# PHASE UX · C2.5-D1 — Studio Album Management

Studio release: `0.11.0` / Build `32`  
Codename: `phase-ux-c2-5-d1-studio-album-management`  
Backend dependency: Track Manager `v5.17` / Studio bridge `v1.9`  
Backend deployment run: `31435939170`  
Backend Worker Version ID: `de516167-e5d7-4ca0-a9f3-e732e6d88a37`  
Safety ref: `safety/pre-c2-5-d-studio-20260810-2356`

## Purpose
C2.5-D is deliberately split into two Studio-only slices. D1 introduces the canonical **Albums / Projects** workspace. D2 will integrate New Track intake with canonical Album lookup/create/binding after D1 is green and published.

## Authority / routes
Studio is only a client. Track Manager remains the sole protected write authority and R2 remains canonical. D1 consumes the already deployed C2.5-C Album reads, create, metadata, membership/order, move and guarded cover/thumbnail routes. Every mutation reuses `updatedAt` stale protection and performs a canonical reread before Studio treats the action as verified.

## Studio surface
D1 adds canonical Album/EP/Collection listing, explicit draft creation with immutable ID, metadata/status/palette editing, ordered `album.trackIds` reorder/removal, transactional moves **between already-canonical Albums**, cover preview, explicit palette application, sequential cover+thumbnail upload and guarded asset deletion. Whole-Album deletion is intentionally absent.

## Migration boundary
D1 deliberately does **not** offer “attach any unowned catalog track”. Existing legacy/Singles tracks stay outside canonical Album membership until C2.5-E. This prevents Album Management from becoming a hidden production migration tool. D2 may bind **newly-created** tracks through the guarded Album write routes; historical Album/Singles migration remains a separately authorized C2.5-E operation.

## Frozen boundaries
D1 does **not** migrate Neon Heartbreaks, Coal to Diamond, Love Letters from Saigon or Singles; create an Album automatically during CI; remove the LaunchPAD fallback; change public LaunchPAD Build 88; deploy a Worker; change Track Manager v5.17 / bridge v1.9; change LRC Maker 6.3.8 or `lyrics.txt`; resume C3; create final PHASE UX checkpoint; or start Phase 7.

## Regression-guard policy
Historical PHASE UX tests protect the behavior introduced by their milestones instead of pinning Studio forever to Build 31. Exact current release identity is owned by the active C2.5-D guard. Mobile navigation is explicitly guarded for the new fourth primary destination.

## Next slice
**C2.5-D2 — New Track canonical Album integration.** New Track will stop accepting phantom Album references. A non-Singles Album selected/detected from TXT must resolve to a canonical Album, or Studio must require an explicit canonical draft creation step before binding via the guarded Album routes.
