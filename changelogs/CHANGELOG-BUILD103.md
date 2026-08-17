# CHANGELOG — Studio v0.19.25 · Build103

Date: 2026-08-17
Status: **SOURCE CANDIDATE · NOT DEPLOYED**
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

## Safety

```text
Accepted predecessor    Studio v0.19.24 · Build102 · REAL USER PASS
Base                     1b9934288043b85bbed537b0e8cf1ddc4f786184
Pre-build safety         safety/pre-build103-canonical-audio-download-retry-20260817
Feature branch           phase9/build103-canonical-audio-download-transient-retry
Worker deploy            NONE
Track Manager change     NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Detailed audit: [`../docs/PHASE9-BUILD103-CANONICAL-AUDIO-DOWNLOAD-RETRY.md`](../docs/PHASE9-BUILD103-CANONICAL-AUDIO-DOWNLOAD-RETRY.md).

Build103 remains a source candidate until the complete repository-native validation passes on its exact head, it is merged/deployed, and the required normal-browser human smoke succeeds.
