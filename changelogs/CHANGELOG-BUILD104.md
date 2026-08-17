# CHANGELOG — Studio v0.19.26 · Build104

Date: 2026-08-17
Status: **REAL USER SMOKE FAILED · FALSE UNKNOWN CLASSIFICATION · SUPERSEDED BY BUILD105**
Codename: `studio-focus-slice4-phase9-deep-audio-response-loss-fence`

## Why

Fresh post-Build103 audit proved the smallest coherent remaining Studio-only gap was not a retry: it was **truth and duplicate-compute protection after Deep Audio POST response loss**.

The SonicTrace coordinator has no client operation/idempotency key and generates `analysisId` only at the end of a successful analysis envelope. Therefore, after `/api/studio/analyze` has genuinely begun uploading and its response is then lost, Studio cannot prove whether GPU compute ran or is still running.

## Intended Build104 contract

- timeout after Deep Audio submit → `DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED`;
- browser transport response loss after submit → `DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED`;
- both states are **COMPUTE UNKNOWN**, never retry-safe;
- exact Track + canonical source version is fenced in memory for the current page;
- a second call for that exact source is rejected before another Deep Audio POST with `DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED`;
- explicit page reload is required before a deliberate manual resubmit;
- browser DSP fallback remains reviewable, but saving it does not prove the uncertain Deep Audio compute did not run;
- Build103 canonical-audio GET retry remains unchanged;
- Deep Audio automatic POST retries remain zero.

## Real-user smoke failure

The normal production smoke on an existing known-good Track displayed:

```text
DEEP AUDIO STATE UNKNOWN
A previous Deep Audio submit for this exact Track/audio revision lost its response.
Reload Studio before any explicit re-scan.
```

The same screen retained the prior FULL canonical profile and produced a Browser-DSP-only unsaved review. No new analysis was saved.

Fresh code reread found the classification bug: Build104 armed `deepAudioResponseLossFence` on **every** `XMLHttpRequest.onerror` / timeout, even when the browser had not observed the upload phase start. For the default local coordinator (`http://127.0.0.1:8000`), node-offline / blocked / preflight / pre-submit transport failures can therefore be mislabeled as post-submit response loss.

That is too conservative in the wrong place: it creates a false UNKNOWN state and blocks a safe manual re-scan even when no Deep Audio upload was observed.

## Corrective direction

Build105 narrows the fence boundary:

```text
transport/timeout BEFORE XHR upload phase starts
→ PRE-SUBMIT UNREACHABLE
→ no fence
→ zero automatic retries
→ explicit manual re-scan allowed after coordinator recovery

transport/timeout AFTER XHR upload phase starts
→ COMPUTE UNKNOWN
→ fence exact Track/source in-page
→ zero automatic retries
→ reload required before deliberate resubmit
```

Build104 is therefore **not accepted**. Build103 remains the latest accepted Studio runtime until Build105 passes deployment and real-user smoke.

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
Candidate docs PR        #203
Candidate docs merge     aa448498549964fe44bd14a1c1767c400ddb8e2d
Candidate docs Pages     #214 · 31983689742 · SUCCESS build + deploy
Real-user smoke          FAILED · false UNKNOWN classification on normal-path test
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Detailed audit: [`../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](../docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).
