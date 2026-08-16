# CHANGELOG — Studio v0.19.24 · Build102

Date: 2026-08-17
Status: **SOURCE CANDIDATE · NOT DEPLOYED**
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

## Safety

```text
Accepted predecessor       Studio v0.19.22 · Build100
Rejected candidate         Studio v0.19.23 · Build101 (real-user false-negative ETag representation mismatch)
Build101 write verdict     COMMITTED — cover persisted after refresh without re-upload
Build102 base              690828f5d33f0c0884fcef29334567407b639e61
Pre-build safety           safety/pre-build102-etag-normalization-corrective-20260817-0120
Feature branch             phase9/build102-etag-representation-corrective
Worker deploy              NONE
Track Manager change       NONE
R2 migration/schema        NONE
```

Build100 remains the latest **accepted** Studio runtime until this corrective passes CI, deploys as a candidate and receives a clean real-user smoke.
