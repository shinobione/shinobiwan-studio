# CHANGELOG — Studio v0.19.26 · Build104

Date: 2026-08-17
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
Codename: `studio-focus-slice4-phase9-deep-audio-response-loss-fence`

## Why

Fresh post-Build103 audit proved the smallest coherent remaining Studio-only gap is not a retry: it is **truth and duplicate-compute protection after Deep Audio POST response loss**.

The SonicTrace coordinator has no client operation/idempotency key and generates `analysisId` only at the end of a successful analysis envelope. Therefore, after `/api/studio/analyze` has been submitted and its response is lost to timeout/transport, Studio cannot prove whether GPU compute ran or is still running.

## Build104 contract

- timeout after Deep Audio submit → `DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED`;
- browser transport response loss after submit → `DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED`;
- both states are **COMPUTE UNKNOWN**, never retry-safe;
- exact Track + canonical source version is fenced in memory for the current page;
- a second call for that exact source is rejected **before another Deep Audio POST** with `DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED`;
- explicit page reload is required before a deliberate manual resubmit;
- browser DSP fallback remains reviewable, but saving it does not prove the uncertain Deep Audio compute did not run;
- Build103 canonical-audio GET retry remains unchanged;
- Deep Audio automatic POST retries remain zero.

## Explicit non-scope

- no SonicTrace coordinator/backend deployment;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema/data mutation;
- no operation-status endpoint or idempotency protocol added;
- no forced production timeout/network-loss smoke;
- no Album/Track create or binary-upload causality claim.

## Safety and deployment receipts

```text
Accepted predecessor    Studio v0.19.25 · Build103 · REAL USER PASS
Base                     74afc0c052e80e7d8c2cd18df333d70ec363b614
Pre-build safety         safety/pre-build104-deep-audio-response-loss-fence-20260817
Feature branch           phase9/build104-deep-audio-response-loss-fence
Runtime PR               #202
Exact tested head        8060a81b7fdb6a608244c768a042e56e630451f0
Final runtime CI         #564 · 31983472391 · SUCCESS
Green premerge safety    safety/post-build104-green-premerge-20260817-0258
Runtime merge SHA        a0a082376eedc6c5c90bad59bbc5e92bf72e6cdd
Runtime Pages            #213 · 31983514507 · SUCCESS build + deploy
Post-deploy safety       safety/post-build104-deployed-candidate-20260817-0301
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Detailed audit: [`../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).

## Human acceptance boundary

Build104 remains **not accepted** until a normal-browser, known-good SonicTrace / Deep Audio analysis smoke passes in production.

The smoke must **not** manufacture a timeout, disconnect the network, or force an Access failure. The response-loss fence is regression-tested automatically. Human validation exists only to prove that the healthy analysis path still acquires canonical audio, runs Browser DSP + Deep Audio once, returns the truthful FULL/PARTIAL backend result, and does not show the UNKNOWN-state fence unexpectedly.

**Build103 remains the latest accepted Studio runtime until explicit Build104 REAL USER PASS.**
