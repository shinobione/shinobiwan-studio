# CHANGELOG — Studio v0.19.23 · Build101

Date: 2026-08-16
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
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

## Human smoke boundary

Use a genuine normal successful Track asset upload through the daily **Track → Visuals / Assets** surface. Prefer a replaceable cover or thumbnail on a safe draft/unpublished Track. Do not manufacture a timeout, lost response, fingerprint mismatch or destructive failure branch.

Expected normal-success result:

1. the upload completes once;
2. Studio reports the canonical reread as verified;
3. reload the Track and confirm the asset remains present;
4. no retry or second upload is needed.

Build100 remains the latest **accepted** Studio runtime until this deployed candidate receives an explicit real-user PASS. Build102 remains **UNALLOCATED** until Build101 acceptance and a fresh read-only audit identify a concrete next gap.
