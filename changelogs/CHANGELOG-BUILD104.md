# CHANGELOG — Studio v0.19.26 · Build104

Date: 2026-08-17
Status: **SOURCE CANDIDATE · NOT DEPLOYED**
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

## Safety

```text
Accepted predecessor    Studio v0.19.25 · Build103 · REAL USER PASS
Base                     74afc0c052e80e7d8c2cd18df333d70ec363b614
Pre-build safety         safety/pre-build104-deep-audio-response-loss-fence-20260817
Feature branch           phase9/build104-deep-audio-response-loss-fence
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Detailed audit: [`../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).

Build104 remains a source candidate until the exact final PR head passes the full repository validation chain, is merged/deployed, and the required normal-path real-user smoke succeeds.
