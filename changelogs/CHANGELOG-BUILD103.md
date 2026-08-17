# CHANGELOG — Studio v0.19.25 · Build103

Date: 2026-08-17
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
Codename: `studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth`

## Why

Fresh post-Build102 audit selected the canonical-audio download as the smallest coherent remaining reliability gap.

Before Deep Audio compute starts, Studio downloads the canonical Track audio through a non-mutating GET. That request had a finite 180-second timeout but no transient retry. A single short transport interruption or transient server response therefore aborted the analysis even though retrying that **pre-compute GET** is safe and cannot duplicate GPU analysis or canonical writes.

Heavier candidates remain unallocated: create/upload causality needs stronger operation/digest contracts, Deep Audio POST retry can duplicate expensive compute, and degraded/offline work is cross-cutting.

## Build103 contract

- canonical audio GET may retry **once** after timeout, browser transport interruption or HTTP `408/425/429/500/502/503/504`;
- maximum canonical-audio attempts are **two total**;
- 401/403 Access responses do not retry;
- deterministic ordinary HTTP failures do not retry;
- empty/invalid successful responses do not retry;
- the long-running `POST /api/studio/analyze` remains **zero automatic retries**;
- SonicTrace save retry/lost-response semantics remain unchanged;
- no canonical write path is widened.

## Explicit non-scope

- no SonicTrace coordinator/backend change;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema/data mutation caused by deployment;
- no automatic Deep Audio compute retry;
- no PWA/offline redesign;
- no UI/layout refactor.

## Safety and deployment receipts

```text
Accepted predecessor    Studio v0.19.24 · Build102 · REAL USER PASS
Base                     1b9934288043b85bbed537b0e8cf1ddc4f786184
Pre-build safety         safety/pre-build103-canonical-audio-download-retry-20260817
Feature branch           phase9/build103-canonical-audio-download-transient-retry
Green premerge safety    safety/post-build103-green-premerge-20260817-0217
Runtime PR               #198
Exact tested head        9d89aa1051b67b828836a45b648b6f45b69dbe74
Final runtime CI         #543 · 31981673322 · SUCCESS
Runtime merge SHA        5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages            #209 · 31981768144 · SUCCESS build + deploy
Post-deploy safety       safety/post-build103-deployed-candidate-20260817-0223
Worker deploy            NONE
Track Manager change     NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Detailed audit: [`../docs/PHASE9-BUILD103-CANONICAL-AUDIO-DOWNLOAD-RETRY.md`](../docs/PHASE9-BUILD103-CANONICAL-AUDIO-DOWNLOAD-RETRY.md).

## Required human smoke

Use a normal Track whose canonical master audio is already known-good and run the ordinary SonicTrace / Deep Audio analysis flow in a healthy browser session.

Expected normal-path evidence:

1. canonical audio downloads successfully;
2. browser DSP completes;
3. Deep Audio compute starts once and completes normally;
4. the result renders with the existing FULL / PARTIAL / UNAVAILABLE truth model;
5. no duplicate analysis submit or unexpected retry UI appears.

Do **not** manufacture a timeout, disconnect the network, corrupt Access, or otherwise force the retry path in production. The bounded transient-retry branch and zero-retry Deep Audio POST boundary are protected by the repository-native Build103 guard; the human smoke is a no-regression production-path confirmation.

**Build102 remains the latest accepted Studio runtime until this Build103 smoke is explicitly passed.**
