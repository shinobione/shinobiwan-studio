# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-17 after explicit **Build102 REAL USER PASS**.

This file records what is actually accepted, the automated proof boundary, real-user smoke evidence and the major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

```text
Version                 v0.19.24
Build                   Build102
Status                  REAL USER PASS
Codename                studio-focus-slice4-phase9-track-asset-etag-representation-corrective
Runtime PR              #193
Exact tested head       cfebb5cfe5b87627a29890a7477bd5628ef60759
Final CI                #524 · 31979380563 · SUCCESS
Runtime merge           64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages           #200 · 31979525479 · SUCCESS build + deploy
Candidate docs PR       #194
Candidate docs CI       #525 · 31979629544 · SUCCESS
Candidate docs merge    68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages    #201 · 31979667787 · SUCCESS
Acceptance safety       safety/post-build102-real-user-pass-20260817-0142
Track Manager           v5.24 · unchanged by Build102
Studio bridge           v1.14
Public Worker           v2.7 · unchanged
Worker deploy           NONE
R2 schema migration     NONE
```

## Build102 automated coverage — GREEN

Official validation `31979380563` passed the complete repository-native `npm run build` chain on exact head `cfebb5cfe5b87627a29890a7477bd5628ef60759`, including inherited Phase 0–9 / Studio Focus guards, the Build101 Track asset success-verification guard, the Build102 ETag representation regression guard, TypeScript and Vite production build.

Build102 specifically protects this normal-success path:

```text
Track asset upload HTTP success
→ exact new canonical revision
→ exact manifest filename
→ private canonical presence
→ exact server size when supplied
→ exact server content type when supplied
→ exact server duration when supplied
→ normalize ETag representation only:
     trim whitespace
     remove one symmetric outer pair of HTTP double quotes when present
→ compare remaining ETag value exactly
→ Verified only if all required facts match
```

The corrective does **not** strip weak validators, prefixes, internal characters or arbitrary punctuation. It does not weaken any non-ETag fingerprint check and does not add automatic write retries.

Historical red Build102 PR runs were caused by inherited successor guards that had not yet admitted `v0.19.24 / Build102`; those guards were aligned before the final exact head. No red Build102 head was merged.

## Build102 real-user smoke — PASS

The user performed one genuine normal-success cover upload through the daily **Track → Visuals / Assets** surface and returned:

```text
ASSET SAVED
Canonical reread: Verified
Catalog rebuilt: Yes
Revision: 2026-08-16T23:42:38.231Z
```

Acceptance confirms:

- the upload executed once;
- Track Manager reported success;
- Studio's private canonical reread verified the new revision and asset fingerprint;
- the derived catalog rebuild receipt was positive on normal HTTP success;
- no duplicate upload was required;
- no timeout, network interruption, Access expiry or destructive failure branch was manufactured;
- no Track Manager, Worker, Public Worker or R2 schema deployment was required.

Result:

```text
Build102 = REAL USER PASS
```

Detailed receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

## Build101 real-user smoke — REJECTED FALSE NEGATIVE

Build101 (`v0.19.23`) introduced the intended stronger Track asset normal-success fingerprint proof. The real-user cover upload returned `ASSET_UPLOAD_UNVERIFIED` with only `asset ETag` mismatching.

The user correctly did **not** retry. A plain refresh showed the new cover still present, proving:

```text
write                    COMMITTED
canonical cover          PRESENT
second upload            NONE
Build101 verifier        FALSE NEGATIVE
root cause               quoted httpEtag vs raw object.etag representation
```

Build101's **DO NOT RETRY** safety behavior was correct, but the candidate is not accepted because normal success was misclassified. Build102 is the bounded corrective and accepted successor.

## Accepted Phase9 regression baseline

The following accepted slices remain regression requirements:

```text
Build82   destructive Track/Album asset-delete ambiguity       PASS
Build83   canonical Lyrics save response-loss truth            PASS
Build84   SonicTrace save response-loss truth                  PASS
Build85   Album metadata save response-loss truth              PASS
Build86   Album move response-loss truth                       PASS
Build87   Album ordered-membership response-loss truth         PASS
Build88   core private Track GET transient retry truth         PASS
Build89   private Album GET transient retry truth              PASS
Build90   private Lyrics GET transient retry truth             PASS
Build91   private SonicTrace GET transient retry truth         PASS
Build92   Track metadata save response-loss truth              PASS
Build93   Track metadata validation retry truth                PASS
Build94   Lyrics validation retry truth                        PASS
Build95   daily Albums resilient-service convergence           PASS
Build96   Album create normal-success verification             PASS
Build97   Track create normal-success verification             PASS
Build98   TM5.24 / bridge1.14 compatibility corrective         PASS
Build99   Album asset upload normal-success verification       PASS
Build100  Album first-track intake continuity                  PASS
Build101  rejected candidate / false-negative evidence         NOT ACCEPTED
Build102  Track asset ETag representation corrective           PASS
```

## Cross-stack accepted baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
TM admin Worker         53abb651-4f3c-46a7-a37a-055f35d340b9
TM deploy run           31919397012 · SUCCESS · admin only
Public Worker           v2.7 · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Failure-path policy still protected

For accepted Phase9 writes:

```text
response lost / timeout
→ no blind automatic retry
→ private canonical reread
→ committed / not committed / ambiguous / unverified
```

Failure-path acceptance does not require deliberately damaging production or forcing network/Access failures when automated guards can prove the bounded classification logic.

For bounded private GETs and non-mutating validations, retry remains limited to the explicitly accepted transient classes and at most one retry. These rules do not authorize write retry.

## Remaining unproven / audit candidates

These are **not promises for Build103**. They must be reread against the current implementation before scope allocation:

- Album create lost-response causality / durable operation identity;
- exact-byte or digest proof for binary upload families where the backend can expose trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry behavior;
- degraded/offline/PWA behavior;
- publication projection where a Track may be public while its canonical parent Album remains Draft.

## Next QA gate

Build103 remains **UNALLOCATED**. The next mutation must follow a fresh read-only post-Build102 audit, select one independently reversible slice, run the full repository-native validation chain and preserve all accepted regression contracts above.
