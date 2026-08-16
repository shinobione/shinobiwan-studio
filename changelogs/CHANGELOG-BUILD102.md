# CHANGELOG — Studio v0.19.24 · Build102

Date: 2026-08-17
Status: **REAL USER PASS · ACCEPTED**
Codename: `studio-focus-slice4-phase9-track-asset-etag-representation-corrective`

## Real-user trigger

Build101 (`v0.19.23`) required a normal successful Track asset upload to prove the exact new canonical revision plus the server asset fingerprint returned by Track Manager.

The real-user cover smoke produced `ASSET_UPLOAD_UNVERIFIED` with a single mismatch: `asset ETag`. The user did **not** retry. A plain Track refresh showed the new cover still present, proving the write had committed and the Build101 warning was a false negative rather than a lost or rolled-back mutation.

## Root cause

Track Manager v5.24 verifies the newly written R2 object before returning success. Its upload response derives the ETag through `studioLyricsObjectEtag()`, which prefers R2 `httpEtag` and therefore returns the HTTP representation with surrounding quotes.

The private Track reread builds `AdminAssetState.etag` from raw R2 `object.etag`, which exposes the same object identity without those surrounding HTTP quotes. Build101 compared the two representations as raw strings.

## Build102 corrective contract

Build102 keeps the Build101 proof boundary and changes only ETag representation comparison:

1. trim surrounding whitespace;
2. if and only if the entire value is wrapped by one symmetric pair of double quotes, remove that outer pair;
3. compare the remaining ETag value exactly;
4. do **not** strip weak validators, internal characters, prefixes or arbitrary punctuation;
5. keep exact canonical revision, filename, private presence, size, content type and duration checks unchanged;
6. keep all no-blind-retry / lost-response recovery semantics unchanged.

Diagnostics retain both response and canonical reread ETags if verification still fails.

## Explicit non-scope

- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema migration;
- no automatic upload retry;
- no weakening of canonical revision or fingerprint verification;
- no Album asset behavior change;
- no UI/layout change.

## Runtime and candidate receipts

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
Candidate docs PR          #194
Candidate docs CI          #525 · run 31979629544 · SUCCESS
Candidate docs merge       68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages       #201 · run 31979667787 · SUCCESS
Acceptance safety          safety/post-build102-real-user-pass-20260817-0142
Worker deploy              NONE
Track Manager change       NONE
Public Worker change       NONE
R2 migration/schema        NONE
```

The official final-head validation passed the complete repository-native `npm run build` gate, including all inherited Phase 0–9 / Studio Focus checks, TypeScript, Vite, the Build101 verification guard and the Build102 ETag representation regression guard. Earlier red PR runs were caused by inherited successor guards that had not yet admitted `0.19.24`; they were aligned before the final head and no red head was merged.

## Real-user acceptance smoke

A genuine normal-success cover upload through the daily **Track → Visuals / Assets** surface returned:

```text
ASSET SAVED
Canonical reread: Verified
Catalog rebuilt: Yes
Revision: 2026-08-16T23:42:38.231Z
```

The upload was performed once. No timeout, response loss, duplicate upload, Access expiry or destructive failure branch was manufactured.

Acceptance proves the Build102 representation normalization resolves the observed false negative while retaining the stricter Build101 fingerprint boundary.

## Verdict

```text
Build101  NOT ACCEPTED · real-user false-negative verifier
Build102  REAL USER PASS · current accepted Studio runtime
Build103  UNALLOCATED · fresh read-only post-Build102 audit required
```

Detailed human receipt: [`../docs/acceptance/BUILD102-REAL-USER-PASS.md`](../docs/acceptance/BUILD102-REAL-USER-PASS.md).
