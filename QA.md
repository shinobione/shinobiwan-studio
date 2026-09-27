# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

## Current accepted runtime and evidence — 2026-09-27

Verified current main `1add68bc6f9c476374eafaefd58f865263f6e9ad` after docs #247, Pages 36335916511 SUCCESS. Runtime merge `6fd52f9f21ceb54d2014eaa99efb77d5ec899937`, merged [PR #246](https://github.com/shinobione/shinobiwan-studio/pull/246). Exact final candidate `757a46d0d83804ae5cd2b7a7c03c483125c0c67e` passed [CI #36324001763](https://github.com/shinobione/shinobiwan-studio/actions/runs/36324001763); automatic [Pages #36325763251](https://github.com/shinobione/shinobiwan-studio/actions/runs/36325763251) build/upload/deploy SUCCESS on merge SHA. **Build121 / v0.19.43 A2.3 Slice 2 has bounded owner REAL USER PASS for session-only Releases gallery and detail.**

[Owner-reported Build121 production receipt](docs/acceptance/BUILD121-REAL-USER-PASS.md): all seven requested checks PASS — 84 distinct commercial Release cards and no remote artwork fetching; source-derived search/filter/sort and Grid/List; exact detailed metadata, source positions/linked Recording/provenance; visible unbound evidence with no fabricated association and publication state remaining unverified; keyboard open/Tab/Escape/Close restoring opener focus; shared session navigation with Reset/refresh clearing; DevTools no private-source upload, persistence, source identifiers in URL or external cover loads in the tested workflow. These are owner's reports, not independent captured browser logs, formal accessibility/penetration review or separate owner mobile certification. Findings remain pending.

Pre-merge automated candidate evidence is separately documented in the [original Build121 handoff](docs/CATALOGUE-A2-3-SLICE2-VALIDATION.md): full release check/TypeScript/build and inherited Build118, Build119 (55 synthetic tests), Build120 (12 actual synthetic Chromium scenarios), CPU gates, nine new Build121 real Chromium scenarios with independently fictional data, and a 133-file source/build/artifact privacy scan PASS. The head SHA of final CI, not the earlier implementation-only CI, is the delivery authority. Do not retroactively rewrite the pre-merge handoff as a production acceptance receipt.

[Build120 Slice 1](docs/acceptance/BUILD120-REAL-USER-PASS.md), [Build119 import](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 original A2.1](docs/acceptance/BUILD118-REAL-USER-PASS.md), [CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and Build117 historical reliability evidence remain independent. The derived JSON omits portions of the private workbook; 355 earlier findings are not resolved, channel availability is not live-verified, and no artwork authority is conferred. No Worker/R2/backend/LaunchPAD changes or commercial persistence/writes occurred. CPU issues Studio #238 and LaunchPAD #283 stay open without sustained measurements.

### Build122 candidate — independent automated and owner gates

Build122 adds pure exact-identity/evidence selectors, rendered missing-reference checks and eight synthetic real App/StrictMode Chromium scenarios covering Recordings filters, bound-only multi-Release detail, contextual/global QA, shared modal keyboard/navigation, responsive widths 320/390/768/1280/2560, lifecycle, late Worker races and privacy. The full gate inherits Build118–121/CPU, release checks, TypeScript/build and artifact scanning. Local full build PASS: inherited gates, eight Build122 Chromium scenarios, release/TypeScript and 137-file artifact/privacy scan. [Detailed contract and owner handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md).

Production remains accepted Build121. Build122 requires Draft PR/final-head CI before delivery; merge/Pages and owner private-source acceptance are separate. **No Build122 REAL USER PASS.**

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

Review the Build122 Draft and final-head CI, then perform the Slice 3 owner checklist after separately authorized deployment. Commercial persistence/sync remains out of scope; CPU issues remain open without sustained telemetry.
