# SHINOBIWAN Studio — Build96

Date: 2026-08-16  
Version: `v0.19.18`  
Build: `96`  
Codename: `studio-focus-slice4-phase9-album-create-success-verification-truth`  
Status: **REAL USER PASS · ACCEPTED**

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

## Human acceptance — PASS

Build96 received explicit real-user acceptance on 2026-08-16:

```text
Build 96 SMOKED 💨
```

The changed path was verified using a **real Album / EP / collection the artist genuinely intended to create**, avoiding a throwaway immutable canonical Album ID. The normal successful create completed and the requested create metadata remained canonical after reload.

No network cut, Cloudflare invalidation or lost-response failure was manufactured. Build96 concerns normal successful create verification only; create lost-response recovery remains explicitly out of scope, with zero automatic create retries.

```text
Build96 = REAL USER PASS · ACCEPTED
Build97 = UNALLOCATED pending fresh read-only post-Build96 audit
```

Acceptance closeout safety checkpoint:

```text
safety/post-build96-real-user-pass-20260816
```
## Acceptance-docs closeout receipts

```text
Acceptance docs PR       #177
Exact docs head          70fc1a6ee18cf2089ef3d3f11a96a19bac772e8b
Acceptance docs CI       31914122068 · SUCCESS
Acceptance docs merge    b5448ebbd1ab3aa27c21804d06a78ec4beffa669
Acceptance docs Pages    31914188650 · SUCCESS · build + deploy
Safety docs green        safety/post-build96-rup-docs-green-premerge-20260816
Safety docs closeout     safety/post-build96-rup-docs-closeout-20260816
```

