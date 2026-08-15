# SHINOBIWAN Studio — Build96

Date: 2026-08-16  
Version: `v0.19.18`  
Build: `96`  
Codename: `studio-focus-slice4-phase9-album-create-success-verification-truth`  
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**

## Fresh-audit decision

The post-Build95 read-only audit compared the remaining heavy reliability candidates against smaller operation-specific seams.

- Full Album create lost-response recovery still lacks a persisted operation identifier capable of proving causality after an absent→present transition.
- Album binary upload still lacks request-side digest / operation identity sufficient to prove that canonical bytes are exactly the selected bytes after response loss.
- Deep Audio automatic retry remains unsafe while duplicate expensive compute cannot be excluded.

The smaller proven gap is on **normal successful Album create**. `createAdminAlbum()` already performed a private canonical reread, but it called the shared `verify()` helper without the requested metadata. A matching response/canonical revision could therefore set `clientVerified=true` without proving that the requested `title`, `type`, `year`, `releaseDate` or any other supplied create metadata actually matched canonical state.

## Build96 scope

Build96 changes only Studio-side normal-success verification:

```text
album-create-v1 HTTP success
→ existing private canonical Album reread
→ require exact returned/canonical revision
→ require every requested metadata key/value to match canonical manifest
   ├─ exact → clientVerified=true
   └─ mismatch / reread unavailable → clientVerified=false + existing warning
```

The implementation reuses the existing `metadataMismatch()` + `verify(... expectedMetadata ...)` path already used by Album metadata save. It does not create a second comparison model.

## Explicit non-goals

Build96 does **not** add:

- Album create response-loss recovery;
- any automatic Album create retry;
- operation IDs;
- Album asset upload digest/response-loss recovery;
- Track Manager / Worker changes;
- R2 schema/data changes;
- Album metadata/membership/move algorithm changes;
- Lyrics, Track metadata, SonicTrace or Deep Audio behavior changes;
- LaunchPAD or LRC Maker changes.

Create lost-response policy remains explicit: `not-covered-no-operation-id-no-blind-retry`, with `maxAutomaticCreateRetries: 0`.

## Validation history

The first full Build96 validation run is retained explicitly and was never merged:

```text
CI #488 / run 31912907163  FAILURE
  → product chain passed through inherited Build95 guard
  → new Build96 guard was too literal about the legacy UI local variable name
  → legacy surface uses `r.clientVerified`, focused surface uses `result.clientVerified`
  → only the guard assertion changed to require semantic `if (!<variable>.clientVerified)`
  → zero runtime/product changes were made for this correction
```

Final exact-head validation:

```text
Runtime PR              #175
Exact tested head       8ee5711d57f3a3986bf1e054b637f8ee3d5f7efe
Final full CI           31912951430 · SUCCESS
Runtime merge           1cb14c3ad96087cd9f8fc7de62119b8b5be0ee94
Runtime Pages           31913006240 · SUCCESS · build + deploy on exact merge SHA
Safety pre              safety/pre-phase9-album-create-success-verification-build96-20260816
Safety pre-PR           safety/post-build96-prepr-20260816
Safety green pre-merge  safety/post-build96-green-premerge-20260816
Safety post-deploy      safety/post-build96-deployed-candidate-20260816
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
```

## Human acceptance boundary

Build96 is **deployed candidate only** until an explicit real-user verdict is received.

A throwaway canonical Album must **not** be created merely to manufacture smoke evidence: Album IDs are immutable and Studio intentionally exposes no whole-Album deletion. Human verification of the changed create path should therefore use a **real Album / EP / collection the artist genuinely intends to create**. Until such a real create is available and succeeds with the requested metadata preserved canonically, Build96 remains pending human acceptance.

No network cut, Cloudflare invalidation or lost-response failure needs to be manufactured. Build96 concerns normal successful create verification only; lost-response recovery remains explicitly out of scope.

```text
Build96 = DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Build97 = UNALLOCATED
```
