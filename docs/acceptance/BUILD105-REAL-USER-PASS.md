# Build105 — REAL USER PASS

Date: 2026-08-17
Runtime: **Studio v0.19.27 · Build105**
Codename: `studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective`
Status: **ACCEPTED**

## Accepted scope

Build105 corrects the false compute-UNKNOWN classification exposed by the rejected Build104 real-user smoke.

- browser-observed Deep Audio upload start is now the boundary between pre-submit unreachable and post-upload response-loss ambiguity;
- transport/timeout before upload start remains unfenced and does not claim compute may have started;
- transport/timeout after upload start retains the exact Track/source `COMPUTE UNKNOWN` fence and reload-before-resubmit rule;
- synchronous `xhr.send()` failure remains pre-submit and unfenced;
- Browser DSP fallback remains reviewable when Deep Audio is unavailable;
- `POST /api/studio/analyze` remains one-shot per explicit user action with **zero automatic retries**;
- Build103 canonical-audio GET retry remains unchanged;
- no SonicTrace coordinator/backend, Track Manager, Worker, Public Worker or R2 schema/data change occurred.

## Runtime receipts

```text
Base                     aa448498549964fe44bd14a1c1767c400ddb8e2d
Runtime PR               #204
Exact tested head        efa188b8d7181a4aa03bdea4bf2da40534203e9e
Final runtime CI         #585 · 32002434543 · SUCCESS
Runtime merge            f3a295d5e7bdbd0cfa05cc6d44901fab62e42c5b
Runtime Pages            #215 · 32002484381 · SUCCESS build + deploy
Candidate docs PR        #205
Candidate docs CI        #586 · 32002709875 · SUCCESS
Candidate docs merge     6de3709d4e89a2806cbf0cf9b598d71d49b1742f
Candidate docs Pages     #216 · 32002755699 · SUCCESS build + deploy
Safety pre-build         safety/pre-build105-deep-audio-presubmit-corrective-20260817
Safety green premerge    safety/post-build105-green-premerge-20260817-0838
Safety post-deploy       safety/post-build105-deployed-candidate-20260817-0839
Safety real-user pass    safety/post-build105-real-user-pass-20260817-0854
Worker deploy            NONE
Track Manager change     NONE
SonicTrace backend       NONE
Public Worker change     NONE
R2 migration/schema      NONE
```

## Human smoke

The user executed the requested normal-path production smoke on the known-good existing Track **Ghost Signal** with the local SonicTrace / Deep Audio path healthy.

Visible smoke evidence showed:

```text
FULL profile ready
Audio match: Current
History: 1 scan
Deep Audio analysis complete
Browser RMS: -14.7 dBFS
LUFS: -12.5 LUFS
True Peak: -0.3 dBTP
Sections: 9
```

The normal path reached the review surface with DSP, MASTERING, NEURAL, EMBEDDING, STRUCTURE and SEMANTIC SUMMARY layers available. It did **not** show `DEEP AUDIO STATE UNKNOWN` or `RELOAD BEFORE RESUBMIT`.

Result: **PASS** — `BUILD105 SMOKED 💨`.

The pre-submit-unreachable and post-upload-response-loss branches remain covered by automated guards rather than destructive production fault injection.

## Acceptance boundary

Build105 is now the latest accepted Studio runtime. Build104 remains rejected historical evidence and must not be relabelled accepted.

This acceptance does **not** authorize automatic retry of Deep Audio compute, Track/Album writes, or any other non-idempotent operation.

Next action: fresh read-only post-Build105 Phase9 audit. **Build106 stays unallocated until that audit proves one bounded next gap.**
