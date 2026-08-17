# CHANGELOG — Studio v0.19.27 · Build105

Date: 2026-08-17
Status: **SOURCE CANDIDATE · NOT DEPLOYED**
Codename: `studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective`

## Trigger

Build104 real-user normal-path smoke displayed `DEEP AUDIO STATE UNKNOWN` / `RELOAD BEFORE RESUBMIT` on an existing known-good Track.

Fresh code reread proved Build104 armed the duplicate-compute fence for every XHR transport error/timeout, even when the browser had not observed the Deep Audio upload phase begin. With the default local SonicTrace coordinator at `http://127.0.0.1:8000`, node-offline, blocked/preflight, or other pre-submit transport failure could therefore become a false compute-UNKNOWN state.

## Build105 corrective contract

- track exact XHR upload phase start (`upload.onloadstart`, positive upload progress, upload completion);
- transport/timeout **before upload phase start** → typed pre-submit unreachable state;
- pre-submit unreachable does **not** arm `deepAudioResponseLossFence`;
- Browser DSP fallback remains reviewable;
- explicit manual re-scan is allowed after the local coordinator is restored;
- zero automatic Deep Audio POST retries remains frozen;
- transport/timeout **after upload phase start** keeps Build104 truth: compute state UNKNOWN, exact Track/source in-page fence, reload required before deliberate resubmit;
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

## Explicit non-scope

- no SonicTrace coordinator/backend change;
- no automatic Deep Audio retry;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema/data mutation;
- no Album/Track create/upload causality work;
- no manufactured production timeout/disconnect smoke.

## Safety

```text
Latest accepted runtime  Studio v0.19.25 · Build103 · REAL USER PASS
Rejected candidate       Studio v0.19.26 · Build104 · false UNKNOWN classification
Base                     aa448498549964fe44bd14a1c1767c400ddb8e2d
Pre-build safety         safety/pre-build105-deep-audio-presubmit-corrective-20260817
Feature branch           phase9/build105-deep-audio-presubmit-transport-corrective
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

Build105 remains a source candidate until its exact final PR head passes the full repository-native validation chain, is merged/deployed, and a normal-path real-user smoke succeeds.
