# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-09-26 for CPU slice 4 candidate; Build117 remains the latest merged standalone acceptance receipt. Build118 corrective functional acceptance is recorded in issue #238; shell acceptance docs remain pending in #237.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

**Deployed v0.19.40 / Build118 CPU slice 2 + backend slice 3 — bounded Albums/Tracks functional REAL USER PASS.** [Owner evidence](https://github.com/shinobione/shinobiwan-studio/issues/238#issuecomment-5849807422): 7 Albums, 4 Healthy / 3 Attention / 0 Unverified, artwork and Track work rows restored; all captured GET invocations `Ok` in two sampled loads. No sustained CPU/load proof. The [Build117 receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) remains the prior accepted reliability baseline, with exact-byte upload proof automated rather than physical smoke evidence.

Current main is `9306ab4b6dafcce87c1bc68411719d01102612c0` (PR #239), with Pages `36258902897` SUCCESS. Candidate `a910b70856e344bc6c6896cc59a9f9107f9539a1` passed validation `36258542918`. Backend deployed source/version and separate acceptance boundaries are in PROJECT_STATE.md. Track Manager remains the protected write authority; #238 remains open and #237 needs reconciliation.

## Build118 / CPU slice 4 — candidate only

The corrective shares pending browsing operations across Health/Management/Tracks, removes Tracks import-time prefetch and settled caching, and reuses Album payloads for artwork. Synthetic tests execute actual clients and component effects to count requests, verify retry ceilings, forced-read replacement, fresh navigation, unmount safety, provenance and independent canonical/migration reads. Existing slice-2 tests retain private delete recovery/detail-write verification and Health/Management rendering. The full build includes reliability guards, TypeScript and the Catalogue artifact/privacy scan.

No slice-4 browser acceptance, CPU benchmark or incident resolution is claimed. Exact-head CI belongs to the Draft PR, not a deployment. See [scope, validation and proposed browser checklist](docs/CPU-SLICE4-SHARED-PRIVATE-READS.md). Navigation now performs a fresh read after prior work settles; the existing loading skeleton remains visible during that read.

## Historical Build109 accepted receipt

```text
Version                 v0.19.31
Build                   Build109
Status                  REAL USER PASS
Codename                studio-focus-slice4-track-create-operation-identity
Studio PR               #218
Exact candidate         5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI               #660 · 34762678307 · SUCCESS
Studio merge            4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages            #229 · 34762759192 · SUCCESS build + deploy
Backend PR              LaunchPAD-APP #276
Backend candidate       3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge           5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy            #44 · 34762956165 · SUCCESS · admin only
Real-user smoke         PASS · disposable Track create · exact creationOperationId reread
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
```

Detailed receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

## Build109 automated coverage — GREEN

### Backend

LaunchPAD / Track Manager PR #276 added a bounded creation-operation identity contract around explicit Studio Track creation.

Automated proof covered:

- optional strict UUID v4 `operationId` for backward-compatible callers;
- private canonical `creationOperationId` persistence;
- immutability/preservation across later canonical Track mutations;
- public catalog/projection stripping of private creation identity;
- existing slug uniqueness and `TRACK_EXISTS` behavior;
- compatibility for legacy clients without operation identity;
- zero automatic create-write retries;
- lost-response evidence remaining operation-specific rather than generic idempotency infrastructure;
- full Cloudflare Worker validation and Wrangler dry-run chain.

The backend candidate `3cf55f7338b9b139586b7a62c6eebfb6100f370f` passed PR workflows `Validate Cloudflare Workers`, `Validate Launchpad` and `Validate Horizontal Overflow`. It merged at `5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80`. The protected admin-only production deployment run `34762956165` (#44) completed successfully. Public Worker deployment was intentionally skipped.

### Studio

Studio PR #218 validated exact Track-create operation identity behavior on candidate `5114875db99af8cfc9bc7f5747674321faf1fe7b` in `Validate SHINOBIWAN Studio` run `34762678307` (#660), result SUCCESS.

The guard locks:

- one secure browser UUID per explicit Track create;
- one-shot create POST with `maxAutomaticTrackCreateRetries: 0`;
- Build97 exact canonical manifest verification on normal success;
- timeout/transport/body-loss private canonical reread only;
- exact `creationOperationId` match as the only lost-response success recovery proof;
- mismatched/missing/legacy/unreadable evidence remaining ambiguous/unverified and non-retryable;
- no widening into a generic retry or idempotency helper.

The implementation merged at `4a2014ba8828063d566c4f5df77c4f1095c0355f`. Pages run `34762759192` (#229) completed build + deploy successfully.

## Build109 real-user smoke — PASS

The user performed a non-destructive Track-create smoke against the deployed backend and deployed Studio on 2026-09-13.

Canonical evidence:

```text
Title                   Build109 Smoke
slug                    build109-smoke-20260913
Album                   Singles
status                  draft
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
private canonical read  verified
cleanup                 disposable Track deleted
```

This proves the deployed Studio generated the operation UUID and the deployed Track Manager persisted and exposed the exact private canonical creation identity.

Result: **PASS**.

Production was not intentionally interrupted to manufacture a transport failure. Timeout/transport/body-loss/mismatch/legacy/unreadable paths remain covered deterministically by automated Build109 tests.

## Build109 contract boundary

Accepted only for explicit Studio Track create:

```text
browser operationId UUID
        ↓
POST Track create (one shot)
        ↓
Track Manager private canonical creationOperationId
        ↓
private canonical reread after lost response
        ↓
exact UUID match = committed / recovered
```

Not generalized to:

```text
Album create
binary asset upload
metadata / Lyrics / SonicTrace writes
Deep Audio compute
```

No generic write-retry or generic idempotency service was introduced.

## Current mission overlay — Build119 candidate validation

The earlier slice-4 candidate wording is superseded by merged #240 / Pages 36272890963 and the owner's bounded post-deploy report; #241 holds the reconciled historical acceptance. No sustained CPU compliance is claimed.

A2.2: 55 focused synthetic cases, inherited Build118/CPU regressions, typecheck and full build pass. Actual local JSON compatibility: 444 rows, 0 rejected, 355 pending findings. Agent browser tested synthetic selection, QA, keyboard reset, malformed rejection and refresh. Private audit found coverage omissions, explicitly disclosed; no source rows in CI. [Detailed validation, privacy evidence and pending owner checklist](docs/CATALOGUE-A2-2-VALIDATION.md). Build119 has no production deployment or REAL USER PASS.

## Release metadata guard

Build109 release closeout adds `check:release` to the Studio build chain. It verifies:

- `package.json` version equals `src/release.ts` version;
- `studioRelease.build` equals the highest `check:buildNNN` gate;
- the active 0.19 release-line build/version mapping remains incremented;
- Build107+ stays under the active Phase10 program metadata;
- sidebar phase and summary are rendered from canonical `studioRelease` metadata instead of historical hard-coded copy.

This prevents the exact Build109 closeout error where functional code advanced while the visible release badge remained on Build108.

## Accepted regression baseline

```text
Build82–100  accepted Phase9 reliability/canonical-truth lineage  PASS
Build101     rejected Track-asset false-negative candidate         NOT ACCEPTED
Build102     ETag representation corrective                        PASS
Build103     canonical audio pre-compute transient retry           PASS
Build104     rejected Deep Audio false-UNKNOWN candidate            NOT ACCEPTED
Build105     Deep Audio pre-submit transport corrective             PASS
Build106     public catalog fallback transient GET retry            PASS
Build107     Phase10 shared catalog projection kernel               PASS
Build108     catalog rebuild generation identity                    PASS
Build109     Track-create operation identity                        PASS
```

Build109 does not reopen Phase9 or alter Build107's numerical extraction contract.

## Historical Build109 cross-stack baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
Admin Worker            Build109 admin deploy #44 · 34762956165 · SUCCESS
Public Worker           v2.8 · REAL USER PASS · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Remaining unproven areas — backend-contract candidates

- Album asset exact-byte/digest proof (Track assets are covered by accepted Build117);
- Deep Audio request status/idempotency if the coordinator gains an operation identity contract;
- degraded/offline behavior only where a future audit proves material daily-workflow impact.

Track-create operation identity is no longer unproven for the explicit Studio create path.
Catalog rebuild operation identity/generation evidence remains accepted from Build108.

Studio must not fabricate causal certainty when a different backend operation does not expose authoritative evidence.

## Next QA gate

Review CPU slice 4 Draft PR and exact-head CI. Merge/deployment require separate authorization, followed by the proposed browser acceptance checklist. Local-private import remains on hold; bounded prior recovery does not close the CPU incident.
