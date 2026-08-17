# CHANGELOG — Studio v0.19.27 · Build105

Date: 2026-08-17
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
Codename: `studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective`

## Trigger

Build104 real-user normal-path smoke displayed `DEEP AUDIO STATE UNKNOWN` / `RELOAD BEFORE RESUBMIT` on an existing known-good Track.

Fresh code reread proved Build104 armed the duplicate-compute fence for every XHR transport error/timeout, even when the browser had not observed the Deep Audio upload phase begin. With the default local SonicTrace coordinator at `http://127.0.0.1:8000`, node-offline, blocked/preflight, or other pre-submit transport failure could therefore become a false compute-UNKNOWN state.

Build104 is therefore **REAL USER SMOKE FAILED · FALSE UNKNOWN CLASSIFICATION · SUPERSEDED BY BUILD105**. Build103 remains the latest accepted Studio runtime until Build105 receives an explicit real-user PASS.

## Build105 corrective contract

- track exact XHR upload phase start (`upload.onloadstart`, positive upload progress, upload completion);
- transport/timeout **before upload phase start** → typed pre-submit unreachable state;
- pre-submit unreachable does **not** arm `deepAudioResponseLossFence`;
- Browser DSP fallback remains reviewable and explicitly `UNAVAILABLE` for Deep Audio;
- explicit manual re-scan is allowed after the local coordinator is restored;
- zero automatic Deep Audio POST retries remains frozen;
- transport/timeout **after upload phase start** keeps the intended Build104 truth: compute state UNKNOWN, exact Track/source in-page fence, reload required before deliberate resubmit;
- synchronous `xhr.send()` failure is also pre-submit and unfenced;
- Build103 canonical-audio GET retry remains unchanged.

## New typed states

```text
DEEP_AUDIO_COMPUTE_PRESUBMIT_TRANSPORT
DEEP_AUDIO_COMPUTE_PRESUBMIT_TIMEOUT
```

These are deliberately distinct from:

```text
DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED
DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED
DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED
```

## Validation and deployment receipts

```text
Latest accepted runtime  Studio v0.19.25 · Build103 · REAL USER PASS
Rejected candidate       Studio v0.19.26 · Build104 · false UNKNOWN classification
Base                     aa448498549964fe44bd14a1c1767c400ddb8e2d
Pre-build safety         safety/pre-build105-deep-audio-presubmit-corrective-20260817
Feature branch           phase9/build105-deep-audio-presubmit-transport-corrective
Runtime PR               #204
Exact tested head        efa188b8d7181a4aa03bdea4bf2da40534203e9e
Final runtime CI         #585 · 32002434543 · SUCCESS
Green premerge safety    safety/post-build105-green-premerge-20260817-0838
Runtime merge SHA        f3a295d5e7bdbd0cfa05cc6d44901fab62e42c5b
Runtime Pages            #215 · 32002484381 · SUCCESS build + deploy
Post-deploy safety       safety/post-build105-deployed-candidate-20260817-0839
Real-user smoke          PENDING
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

## Explicit non-scope

- no SonicTrace coordinator/backend change;
- no automatic Deep Audio retry;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema/data mutation;
- no Album/Track create/upload causality work;
- no manufactured production timeout/disconnect smoke.

## Human acceptance boundary

One ordinary analysis on a known-good existing Track while the local SonicTrace coordinator is healthy:

```text
canonical audio read
→ Browser DSP
→ one Deep Audio POST
→ normal FULL or legitimate PARTIAL response
→ review normally
```

The healthy path must not show `DEEP AUDIO STATE UNKNOWN` or `RELOAD BEFORE RESUBMIT`.

Do **not** manufacture a timeout, disconnect the network, or stop the coordinator for the acceptance smoke. Automated guards cover the pre-submit-vs-response-loss distinction.
