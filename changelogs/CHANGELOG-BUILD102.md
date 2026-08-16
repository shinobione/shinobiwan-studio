# CHANGELOG — Studio v0.19.24 · Build102

Date: 2026-08-17
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
Codename: `studio-focus-slice4-phase9-track-asset-etag-representation-corrective`

## Real-user trigger

Build101 (`v0.19.23`) was deployed specifically to require a normal successful Track asset upload to prove the exact new canonical revision plus the server asset fingerprint returned by Track Manager.

The real-user cover smoke produced `ASSET_UPLOAD_UNVERIFIED` with a single mismatch: `asset ETag`. The user did **not** retry the upload. A plain Track refresh immediately showed the new cover still present, proving the write had committed and the Build101 warning was a false negative rather than a lost/rolled-back mutation.

## Root cause

Track Manager v5.24 verifies the newly written R2 object before returning success. Its upload response derives the ETag through `studioLyricsObjectEtag()`, which prefers R2 `httpEtag` and therefore returns the HTTP representation with surrounding quotes (for example `"abc123"`).

The private Track reread builds `AdminAssetState.etag` from R2 `object.etag`, which exposes the same ETag value without the surrounding HTTP quotes (`abc123`). Build101 compared those two representations as raw strings, so identical R2 object identities could fail strict equality solely because of representation syntax.

## Build102 corrective contract

Build102 keeps the Build101 proof boundary and changes only ETag representation comparison:

1. trim surrounding whitespace;
2. if and only if the entire value is wrapped by one symmetric pair of double quotes, remove that outer pair;
3. compare the remaining ETag value exactly;
4. do **not** strip weak validators, internal characters, prefixes or arbitrary punctuation;
5. keep exact canonical revision, filename, private presence, size, content type and duration checks unchanged;
6. keep all no-blind-retry / lost-response recovery semantics unchanged.

The diagnostic details now retain both the response ETag and canonical reread ETag when verification still fails.

## Explicit non-scope

- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema or media mutation caused by this release itself;
- no automatic upload retry;
- no weakening of canonical revision or fingerprint verification;
- no Album asset behavior change;
- no UI/layout change.

## Safety and verification receipts

```text
Accepted predecessor       Studio v0.19.22 · Build100
Rejected candidate         Studio v0.19.23 · Build101 · REAL USER FALSE NEGATIVE
Build101 write verdict     COMMITTED — cover persisted after refresh without re-upload
Build102 base              690828f5d33f0c0884fcef29334567407b639e61
Pre-build safety           safety/pre-build102-etag-normalization-corrective-20260817-0120
Feature branch             phase9/build102-etag-representation-corrective
Runtime PR                 #193
Runtime PR head            cfebb5cfe5b87627a29890a7477bd5628ef60759
Official Validate          #524 · run 31979380563 · SUCCESS
Green premerge safety      safety/post-build102-green-premerge-20260817-0134
Runtime merge              64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Pages                      #200 · run 31979525479 · build SUCCESS · deploy SUCCESS
Postdeploy safety          safety/post-build102-deployed-candidate-20260817-0136
Worker deploy              NONE
Track Manager change       NONE
Public Worker change       NONE
R2 migration/schema        NONE
```

The official final-head validation ran the repository-native full `npm run build` and passed the complete inherited Phase 0–9, Studio Focus, typecheck and Vite build gate, including both the Build101 verification guard and the new Build102 ETag representation regression guard. Earlier red PR runs were caused by inherited successor guards that had not yet admitted `0.19.24`; they were aligned before the final head and no red head was merged.

## Human smoke boundary

Use a genuine normal successful Track asset upload through the daily **Track → Visuals / Assets** surface. Prefer a replaceable cover or thumbnail on a safe draft/unpublished Track. Do not manufacture a timeout, lost response, fingerprint mismatch or destructive failure branch.

Expected normal-success result:

1. the upload completes once;
2. Studio reports **`ASSET SAVED`**;
3. Studio reports **`Canonical reread: Verified`**;
4. Studio reports **`Catalog rebuilt: Yes`**;
5. reload the Track and confirm the new asset remains present;
6. no retry or second upload is needed.

Build100 remains the latest **accepted** Studio runtime until Build102 receives an explicit real-user PASS. Build101 is not accepted and is retained only as the candidate that exposed the ETag representation mismatch. No Build103 work begins before Build102 acceptance and a fresh read-only post-acceptance audit.
