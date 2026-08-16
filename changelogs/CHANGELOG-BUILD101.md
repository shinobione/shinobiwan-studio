# CHANGELOG — Studio v0.19.23 · Build101

Date: 2026-08-16
Status: **SOURCE CANDIDATE · NOT DEPLOYED**
Codename: `studio-focus-slice4-phase9-track-asset-upload-success-verification-truth`

## Why

Fresh post-Build100 audit found one bounded Studio-only truth gap in the daily Track asset path. Track Manager already returns canonical upload evidence (new revision, filename, size, content type and ETag), but Studio's normal-success reread only checked revision + manifest filename + presence (+ audio duration). A successful HTTP response could therefore be labelled client-verified without proving the server fingerprint against private canonical asset state.

## Build101 contract

After a normal successful Track asset upload, Studio now requires the private canonical reread to match:

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
- no Album upload behavior change.

Build100 remains the accepted predecessor until Build101 passes source CI, deploys as a candidate and receives an explicit real-user smoke verdict.
