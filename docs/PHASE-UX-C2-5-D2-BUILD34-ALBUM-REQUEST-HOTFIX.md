# PHASE UX · C2.5-D2 — Build 34 Album request resolver hotfix

Studio release: `0.11.2` / Build `34`  
Codename: `phase-ux-c2-5-d2-album-request-hotfix`

## Real-user defect
During the first D2 browser smoke, Studio was opened with the intake's safe initial state:

- `albumId = singles`
- `albumTitle = Singles`

The user then typed a non-existent Album title into **Album request**. The visible title changed, but the internal `albumId` remained `singles`. The resolver treated any `albumId = singles` as authoritative, so the explicit non-Singles title was ignored and Review stayed eligible as Singles.

This contradicted the D2 contract: an explicit unknown Album request must resolve to `missing` and block Review rather than becoming a phantom Album or silently falling back to Singles.

## Root cause
`resolveIntakeAlbum()` used `normalizedId === 'singles'` as an unconditional Singles decision. That was valid for the initial safe state but invalid once a later TXT/manual Album title explicitly requested another release.

## Fix
The resolver now treats `singles` as the safe default only while there is no explicit non-Singles Album title. When a non-Singles title exists:

- a real canonical draft title can resolve to the existing Album;
- an unknown title resolves to `missing`;
- the stale transitional `singles` ID cannot override the explicit request.

The initial `Singles` state and explicit selection of Singles remain unchanged.

## Regression coverage
The D2 test now executes both real-user variants:

- `albumId = singles` + `albumTitle = Ghost Signal` → canonical draft `existing`;
- `albumId = singles` + `albumTitle = ALBUM TEST QUI N'EXISTE PAS` → `missing`, `ready = false`.

The D2 historical guard was also made build-inheritable so this fix does not force future releases to pretend Build 33 is still current.

## Safety boundary
This hotfix is Studio-only. It does not:

- deploy or modify Track Manager / bridge v1.9;
- write or migrate R2 Albums;
- create a production Album during CI;
- alter LaunchPAD public Build 88;
- touch LRC Maker 6.3.8 or SonicTrace;
- start C2.5-E/F, C3 or Phase 7.
