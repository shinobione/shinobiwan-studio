# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-09-26 for CPU slice 2 candidate; Build117 remains the latest merged acceptance receipt, with separate Build118 shell acceptance docs pending in #237.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

**v0.19.39 / Build117 — REAL USER PASS.** See the [Build117 receipt](docs/acceptance/BUILD117-REAL-USER-PASS.md) for the precise production smoke boundary: metadata-validation corrective passed; exact-byte upload proof is automated evidence.

Runtime PR #234, final head `b843acf030195b726725af2d0f7e148607b8b9bb`, validation `35435903134` SUCCESS. Current main is now `b035fb226e8c9a2654306076522faa4da97fb3ea` (Build118 PR #236), with Pages build/deploy `36249977846` SUCCESS. Track Manager remains the protected write authority. The limited Build118 shell smoke reported in still-open #237 does not establish private-read reliability; #238 remains open.

## Build118 / CPU slice 2 — candidate only

The corrective changes only the ordinary Album collection URL to `?view=canonical`. Focused synthetic tests execute the actual clients, Health/Management rendering, migration evidence, error classification, bounded retries, artwork discovery and private write verification. The inherited build includes Album reliability guards, TypeScript and the post-build Catalogue privacy scan. Commercial empty/read-only/no-network behavior remains guarded.

No browser acceptance, CPU benchmark or incident resolution is claimed for this corrective. Its exact-head CI belongs to the Draft PR, not a production deployment. See [compatibility, test scope and proposed browser checklist](docs/CPU-SLICE2-LEAN-ALBUM-CONSUMER.md).

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

Review CPU slice 2 Draft PR and exact-head CI. Merge/deployment require separate authorization, followed by the proposed browser acceptance checklist. Local-private import remains on hold; the overall CPU incident remains unresolved.
