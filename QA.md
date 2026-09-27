# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

## Current accepted runtime and evidence — 2026-09-27

GitHub verified `main` = `8c6a67eb9a1476fa864d136174199402a12498a8`, repository `shinobione/shinobiwan-studio`, production branch `main`. Documentation PR #241 is merged and automatic [Pages 36310871264](https://github.com/shinobione/shinobiwan-studio/actions/runs/36310871264) succeeded on that exact SHA. Production remains accepted Build118 / v0.19.40; a docs-only merge creates no runtime build. Runtime PR #240 merged at `650c8a3cf9a69f95732905562535394fac94a12e`, with exact-head [CI 36272677513](https://github.com/shinobione/shinobiwan-studio/actions/runs/36272677513) and merge-SHA [Pages 36272890963](https://github.com/shinobione/shinobiwan-studio/actions/runs/36272890963) successful.

The original [seven-check A2.1 REAL USER PASS](docs/acceptance/BUILD118-REAL-USER-PASS.md) is preserved verbatim from PR #237. The later CPU incident and recovery are separate: see [CPU closeout](docs/acceptance/BUILD118-CPU-RECOVERY.md). Owner-reported post-slice-4 sample: 7 canonical Albums, 4 Healthy / 3 Attention / 0 Unverified; artwork present; one HTTP 200 each for canonical Albums, Tracks, SonicTrace and health; no visible 503. This is bounded functionality/network acceptance, not sustained Cloudflare CPU compliance. No CPU durations were measured. Issues #238 and LaunchPAD #283 remain open.

LaunchPAD #284/#285/#286 are merged. Admin-only [deploy 36265326176](https://github.com/shinobione/LaunchPAD-APP/actions/runs/36265326176) succeeded at `e1737f0e29d3411c30c34c134ab0d68650b0617a`, version `51c9d61e-2c69-4f4a-b106-3e4829bfb461`. Public Worker steps were skipped. This documentation work deploys nothing and mutates no R2 data.

PR #237 stays open for owner review and is superseded for reconciliation by merged #241. Its stale canonical file versions were not copied. Build117 remains the accepted prior reliability baseline and its receipt is unchanged.

## Build119 / A2.2 — undeployed candidate validation

Draft #242 integrates current main without changing the reviewed runtime. Build119 is not merged or deployed and has no REAL USER PASS. The authorized integration ends at new exact-head CI and Draft review; merge, deployment and production writes remain unauthorized.

Post-integration automated checks PASS: 55 focused synthetic cases, inherited Build118/CPU regressions, typecheck, full build and artifact guard. The staged private fingerprint scan is recorded in the detailed validation receipt. The prior private local audit reported 444 rows, 0 rejected and 355 pending findings, with 3,024 field comparisons; these are local source-audit results, not public-CI reproduction. The derived JSON omits workbook evidence, so complete workbook equivalence is not established. Prior agent browser checks covered synthetic selection, QA, keyboard reset, malformed rejection and refresh. Owner private-source, Network/Storage, mobile and keyboard smoke remains pending. [Detailed validation and limitations](docs/CATALOGUE-A2-2-VALIDATION.md).

## Automated CPU regression coverage

The inherited Build118 gate retains lean canonical Albums, shared private requests, private/public Track provenance, independent full migration/write verification, transient retry ceilings, SonicTrace additive semantics, freshness and unmount checks. Local A2.2 tests and future owner smoke must be reported separately from these accepted production receipts.

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

Review A2.2 synthetic/source-compatibility/privacy evidence and exact-head CI. Owner browser acceptance of the candidate remains pending until separately authorized deployment. CPU incidents stay open without sustained telemetry.
