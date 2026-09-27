# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

## Current accepted runtime and evidence — 2026-09-27

Production main `72151c00c5a89cae2bf5e73a6fb98f9ba9c5d90a` after docs-only #245, Pages 36322272124 SUCCESS. Runtime merge `09681904e69b9f2c3ab7bf0d41de1cf1a7dd5d11` from merged [PR #244](https://github.com/shinobione/shinobiwan-studio/pull/244). Exact Build120 candidate `de1000940c32efcc8024c4fd61f240cfa7f93860` passed [CI #36318925988](https://github.com/shinobione/shinobiwan-studio/actions/runs/36318925988); automatic [Pages #36320947983](https://github.com/shinobione/shinobiwan-studio/actions/runs/36320947983) build/deploy SUCCESS on merge SHA. **Build120 / v0.19.42 A2.3 Slice 1 is accepted for its bounded private Catalogue session + native Overview scope.**

[Owner-reported Build120 browser receipt](docs/acceptance/BUILD120-REAL-USER-PASS.md): five requested checks PASS for source-derived Overview (168 Recordings, 84 Releases, 109 appearances, 120 known / 48 missing ISRC, 355 pending), tab/back navigation with no repeated import, two finding-group links into QA and Show all, Reset/refresh clearing the snapshot, and DevTools no private-source network upload, browser-storage persistence or source identifiers in URL. This is the owner's production confirmation, not an independently recorded DevTools session or a full security/accessibility/mobile audit. Pending QA has not been resolved.

Automated candidate validation, independently separate from the owner smoke: full release/TypeScript/build and inherited Build118, Build119 (55 synthetic cases), CPU guards; Build120 12 actual Chromium scenarios using synthetic fixture, source-derived projections/grouped QA/navigation/lifecycle/keyboard/layout privacy checks, and 130-file artifact/privacy scan PASS. [Original candidate handoff](docs/CATALOGUE-A2-3-SLICE1-VALIDATION.md) is preserved as historical pre-merge evidence. It must not be rewritten to claim original pre-merge acceptance.

The earlier [Build119 A2.2 owner receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 A2.1 original receipt](docs/acceptance/BUILD118-REAL-USER-PASS.md), [CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and Build117 reliability evidence remain distinct. The derived JSON omits parts of the ten-sheet workbook; no full source equivalence or current distributor/DSP verification is claimed. CPU issues STUDIO #238 and LaunchPAD #283 stay open without sustained measurements. Build120 involved no Worker/R2 or commercial write/persistence changes.

### Build121 candidate — automated validation, no REAL USER PASS

Local full build, release metadata/TypeScript, inherited Build118/119/120/CPU gates and artifact/privacy scan (133 runtime source/build files including maps) PASS. Build121 adds pure projection checks and nine real Chromium scenarios: empty/one/multiple releases; duplicate titles/UPC; exact evidence relationships under shuffled source order; per-release bound/unbound positions; source-only search/filter/stable sort; grid/list and 320/390/1280/2560px; native modal focus containment, Escape/close restoration; replacement/rejection/reset/pagehide/refresh/unmount; private URL/network/storage/log guards. Missing IDs/evidence/Recording references fail closed in rendered component checks. No new dependency or private source fixture. [Detailed handoff](docs/CATALOGUE-A2-3-SLICE2-VALIDATION.md).

Owner real-source correctness, target-browser/assistive-technology and production mobile/visual/privacy acceptance remain pending after separately authorized merge and Pages. Build120 remains the accepted production baseline.

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

Review Build121 Draft and exact-head CI, then follow the Slice 2 owner handoff after separately authorized deployment. Recording explorer and persistence/sync remain future scope; CPU incidents remain open without sustained telemetry.
