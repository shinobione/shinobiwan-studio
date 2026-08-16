# SHINOBIWAN Studio — Changelog

This is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/).

## Current accepted release

### v0.19.24 · Build102 — 2026-08-17

Codename: `studio-focus-slice4-phase9-track-asset-etag-representation-corrective`  
Status: **REAL USER PASS — ACCEPTED**

Build102 is the bounded corrective for the Build101 real-user false negative. Build101 correctly hardened Track asset normal-success verification, but identical R2 ETags were compared as quoted HTTP `httpEtag` versus raw canonical `object.etag`, causing `ASSET_UPLOAD_UNVERIFIED` even though the cover write had committed and persisted after refresh.

Build102 trims whitespace, removes only one symmetric outer pair of double quotes when present, then compares the remaining ETag exactly. Exact revision, filename, presence, size, content type and duration checks remain intact. Automatic Track asset upload retries remain zero.

```text
Runtime PR                #193
Exact tested head         cfebb5cfe5b87627a29890a7477bd5628ef60759
Validation #524           31979380563 · SUCCESS
Runtime merge             64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages #200        31979525479 · SUCCESS build + deploy
Candidate docs PR         #194
Candidate docs CI #525    31979629544 · SUCCESS
Candidate docs merge      68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages #201 31979667787 · SUCCESS
Safety post-acceptance    safety/post-build102-real-user-pass-20260817-0142
Real-user smoke           ASSET SAVED · Canonical reread Verified · Catalog rebuilt Yes
Canonical revision        2026-08-16T23:42:38.231Z
Track Manager             v5.24 · unchanged
Studio bridge             v1.14
Public Worker             v2.7 · unchanged
Worker deploy             NONE
R2 schema migration       NONE
Build103                  UNALLOCATED pending fresh read-only post-Build102 audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD102.md`](changelogs/CHANGELOG-BUILD102.md).  
Real-user receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

## Rejected candidate

### v0.19.23 · Build101 — 2026-08-16

Codename: `studio-focus-slice4-phase9-track-asset-upload-success-verification-truth`  
Status: **REAL USER FALSE NEGATIVE — NOT ACCEPTED — SUPERSEDED BY BUILD102**

Build101's write safety was correct: after the verifier reported only an `asset ETag` mismatch, the user did not retry; a refresh showed the new cover remained present. The candidate is rejected because the normal-success verifier confused HTTP-quoted and raw ETag representations. Build102 preserves Build101's stronger proof boundary and corrects only that syntax mismatch.

Detailed record: [`changelogs/CHANGELOG-BUILD101.md`](changelogs/CHANGELOG-BUILD101.md).

## Accepted predecessor

### v0.19.22 · Build100 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-first-track-intake`  
Status: **REAL USER PASS — ACCEPTED**

Build100 closed the daily Album first-track intake deadlock without creating a second ownership authority. Canonical ownership remains `album.trackIds`; **Add to tracklist** stages locally and **Save tracklist** continues to use the accepted Build87 resilient membership transaction.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD100.md`](changelogs/CHANGELOG-BUILD100.md).

## Earlier accepted Phase9 lineage

```text
Build82–94   reliability / response-loss / bounded-read validation truth
Build95      daily Albums resilient-service convergence
Build96      Album create normal-success verification
Build97      Track create normal-success verification
Build98      TM5.24 / bridge1.14 compatibility corrective
Build99      Album asset upload normal-success verification
Build100     Album first-track intake continuity
```

All detailed per-build receipts remain preserved under `changelogs/` and `docs/`.
