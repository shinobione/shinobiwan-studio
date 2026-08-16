# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-17 after **Build102 REAL USER PASS** and current cross-stack reconciliation.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

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
Acceptance docs CI      #526 · 31980142885 · SUCCESS
Acceptance docs merge   ae297162fd6579eabe2d455d65f57b129dce58bc
Acceptance docs Pages   #206 · 31980208567 · SUCCESS
Acceptance safety       safety/post-build102-real-user-pass-20260817-0142
```

## Build102 automated coverage — GREEN

Official validation `31979380563` passed the complete repository-native `npm run build` chain on exact head `cfebb5cfe5b87627a29890a7477bd5628ef60759`, including inherited Phase 0–9 / Studio Focus guards, Build101 Track-asset success verification, the Build102 ETag representation regression, TypeScript and Vite.

Build102 normal-success proof remains:

```text
Track asset upload HTTP success
→ exact new canonical revision
→ exact manifest filename
→ private canonical presence
→ exact server size/content type/duration when supplied
→ ETag: trim + remove only one symmetric outer HTTP quote pair
→ exact remaining ETag value
→ Verified only if every required fact matches
```

No automatic asset-upload retry was added.

## Build102 real-user smoke — PASS

The user performed one genuine normal-success cover upload and returned:

```text
ASSET SAVED
Canonical reread: Verified
Catalog rebuilt: Yes
Revision: 2026-08-16T23:42:38.231Z
```

One upload only; no manufactured timeout, Access expiry, duplicate write or destructive failure branch.

## Build101 real-user smoke — REJECTED FALSE NEGATIVE

Build101's upload committed and persisted, but quoted `httpEtag` versus raw `object.etag` produced a single `asset ETag` mismatch. Its **DO NOT RETRY** behavior correctly prevented a duplicate write, but the candidate was not accepted. Build102 is the accepted corrective.

## Accepted Phase9 Studio regression baseline

```text
Build82–100  accepted Phase9 reliability/canonical-truth lineage   PASS
Build101     rejected candidate / false-negative evidence          NOT ACCEPTED
Build102     Track asset ETag representation corrective            PASS
```

Detailed historical per-slice evidence remains under `changelogs/` and `docs/`.

## Cross-stack accepted baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
TM admin Worker         53abb651-4f3c-46a7-a37a-055f35d340b9
TM deploy run           31919397012 · SUCCESS · admin only
Public Worker           v2.8 · REAL USER PASS
Public Worker PR        LaunchPAD-APP #241
Public source merge     b99ff00bb2483b46c7b1e02c874ebfc22892156d
Public deploy run       31974132377 · target public
Public Worker Version   49d87191-a13e-41a7-80c8-d1fd9362af77
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

### Public parent-Album visibility — PASS

Public Worker v2.8 uses canonical Album `trackIds` ownership and withholds a published Track when its canonical parent Album remains Draft/archived. The gate covers public Track list, direct Track detail and media.

Automated regression proves:

- standalone published Single stays public;
- Track owned by published Album stays public;
- Track owned by Draft/archived Album is withheld;
- ownership conflict fails closed;
- a new catalog generation after Album publication restores visibility.

Production human smoke proved the withholding side with `Pixels & Promises` canonically published but absent from public LaunchPAD while `Anh Yêu Em` remained Draft. The reverse Album-publication transition was not manufactured in production merely for smoke evidence.

The previously listed publication-projection question is therefore **closed cross-stack** and is not a Build103 candidate.

## Failure-path policy still protected

For accepted Phase9 writes:

```text
response lost / timeout
→ no blind automatic retry
→ private canonical reread
→ committed / not committed / ambiguous / unverified
```

Failure-path acceptance does not require deliberately damaging production or forcing network/Access failures when automated guards prove bounded classification logic.

## Remaining unproven / audit candidates

These are **not promises for Build103**. They must be reread against the current implementation before scope allocation:

- Album create lost-response causality / durable operation identity;
- exact-byte or digest proof for binary upload families where the backend can expose trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry behavior;
- degraded/offline behavior that materially affects the private Studio workflow.

## Next QA gate

Build103 remains **UNALLOCATED**. The next runtime mutation must follow a fresh read-only post-Build102 audit, select one independently reversible slice, pass the full repository-native validation chain, deploy on the exact merge SHA and preserve all accepted regression contracts above.
