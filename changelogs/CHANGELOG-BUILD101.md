# CHANGELOG — Studio v0.19.23 · Build101

Date: 2026-08-16
Status: **REAL USER SMOKE FAILED · FALSE NEGATIVE · SUPERSEDED BY BUILD102**
Codename: `studio-focus-slice4-phase9-track-asset-upload-success-verification-truth`

## Why

Fresh post-Build100 audit found one bounded Studio-only truth gap in the daily Track asset path. Track Manager already returns canonical upload evidence (new revision, filename, size, content type and ETag), but Studio's normal-success reread only checked revision + manifest filename + presence (+ audio duration). A successful HTTP response could therefore be labelled client-verified without proving the server fingerprint against private canonical asset state.

## Build101 contract

After a normal successful Track asset upload, Studio requires the private canonical reread to match:

- the exact new manifest revision returned by Track Manager;
- the canonical manifest asset filename;
- private asset presence;
- server-reported size when present;
- server-reported content type when present;
- server-reported ETag when present;
- server-reported audio duration when present.

Any mismatch or unreadable post-success canonical reread is **UNVERIFIED / DO NOT RETRY**. The selected daily UI continues to use `uploadAdminTrackAsset`.

## Explicit non-scope

- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema or media mutation caused by this release itself;
- no automatic upload retry;
- no change to the accepted lost-response recovery contract;
- no client-side digest / exact-byte cryptographic proof;
- no Album upload behavior change;
- no UI change.

## Safety and verification receipts

```text
Accepted predecessor       Studio v0.19.22 · Build100
Accepted base SHA          91a3d3fac276523d4c8cec2ab62d7dc4a23a426a
Pre-build safety           safety/pre-build101-track-asset-upload-verification-20260816-2352
Feature branch             phase9/build101-track-asset-upload-verification
Pre-PR safety              safety/post-build101-prepr-20260817-0007
Runtime PR                 #191
Runtime PR head            502d272c0335d9797186e93c5dad727e0a259bd6
Official Validate          #507 · run 31975409991 · SUCCESS
Green premerge safety      safety/post-build101-green-premerge-20260817-0010
Runtime merge              f181a5124002ce82122855cd4804dffef511bf60
Pages                      #198 · run 31975467523 · build SUCCESS · deploy SUCCESS
Postdeploy safety          safety/post-build101-deployed-candidate-20260817-0012
Worker deploy              NONE
Track Manager change       NONE
R2 migration/schema        NONE
```

Before the product candidate was allowed to commit, temporary preflight #5 (`31975310788`) ran the full repository `npm run build` successfully and then passed a bounded-path anti-tronçonneuse check. Earlier preflight attempts stopped before any product commit while inherited successor guards were aligned; no red preflight candidate was merged or deployed. All temporary preflight workflow/patcher files were removed before PR #191.

## Real-user smoke verdict

The genuine normal-success cover replacement returned Track Manager success, but Studio displayed `ASSET_UPLOAD_UNVERIFIED` with a single reported mismatch: **`asset ETag`**. The user correctly did **not** retry. A plain Track refresh showed the new cover still present without any second upload.

This proves:

```text
server write              COMMITTED
canonical asset           PRESENT after refresh
second upload             NONE
Build101 UI verdict       FALSE NEGATIVE
mismatch                  asset ETag representation only
```

Root cause: Track Manager v5.24's upload response uses R2 `httpEtag`, which carries surrounding HTTP quotes, while the private Track reread exposes the same R2 identity through raw `object.etag` without those quotes. Build101 compared those representations as raw strings.

Build101's **DO NOT RETRY** safety behavior was correct and prevented a duplicate write, but the candidate cannot be accepted because its normal-success verification misclassified an actually committed canonical upload.

## Disposition

Build101 is **not accepted**. Build100 remains the latest accepted Studio runtime. The bounded Studio-only corrective is Build102 (`v0.19.24`), which normalizes only one symmetric outer HTTP quote pair before exact ETag comparison while preserving every other Build101 fingerprint check and all zero-automatic-retry semantics.
