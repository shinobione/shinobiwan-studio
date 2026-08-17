# Phase 9 · Build104 — Deep Audio response-loss ambiguity fence

Date: 2026-08-17
Status: **SOURCE CANDIDATE**

## Fresh post-Build103 audit

Build103 is accepted and closes the safe pre-compute canonical-audio GET retry gap. The next audit re-read the remaining create/upload and Deep Audio boundaries instead of pre-allocating a successor.

### Why create/upload were not selected

Album/Track create and binary upload families still lack a request-scoped operation identity or trustworthy client-byte digest that can prove causality after a lost response. A canonical object merely existing after response loss does not prove that the uncertain request created it. Treating existence alone as `COMMITTED` would weaken the Phase9 no-guessing rule.

Those families therefore remain backend-contract work, not a safe Studio-only Build104.

### Concrete smaller gap selected

The long-running SonicTrace coordinator request `POST /api/studio/analyze` already has **zero automatic retries**, which is correct. But its browser transport handling previously collapsed timeout/transport response loss into generic “offline/timed out” fallback wording.

That wording was too strong. Once upload/submit has begun, a timeout or browser transport interruption cannot prove that the coordinator did not receive, start, finish, or continue the GPU compute.

The current SonicTrace coordinator contract confirms why Studio cannot recover causality locally:

- the request carries `track_id`, `source_version` and the temporary file;
- there is no client operation/idempotency key;
- `analysisId` is generated server-side only when the final analysis envelope is built;
- the coordinator does not expose an operation-status reread endpoint for an uncertain submit.

Therefore the correct state after timeout/transport is **COMPUTE UNKNOWN**, not “not started”, “failed”, or “retry safe”.

## Build104 contract

Studio `v0.19.26 · Build104` adds an in-page fence keyed by exact Track + canonical source version:

```text
Deep Audio POST submitted
→ response received normally
   → existing FULL/PARTIAL result flow

→ timeout / browser transport response loss
   → DEEP_AUDIO_COMPUTE_*_UNVERIFIED
   → compute state = UNKNOWN
   → zero automatic retry
   → exact Track/source key fenced in memory
   → another call in the same page is rejected BEFORE POST
   → explicit page reload required before manual resubmit
```

The fence is intentionally memory-only. A reload is a deliberate operator boundary; it does not pretend to discover whether the old compute ran.

Browser DSP remains reviewable as a fallback, but UI copy explicitly states that saving a browser-only fallback does **not** prove the uncertain Deep Audio compute did not run.

## Frozen boundaries

- Build103 canonical-audio GET: max two total attempts, unchanged.
- Deep Audio POST: exactly one transport per allowed call, zero automatic retries.
- SonicTrace canonical save: Build84 latest/history response-loss recovery unchanged.
- no Track Manager change;
- no SonicTrace coordinator/backend change;
- no Public Worker change;
- no R2 schema/data migration;
- no deliberate production fault injection required for acceptance.

## Acceptance boundary

Automated guards prove the failure-path fence. Human smoke must exercise only the ordinary known-good analysis path and verify no regression / no unexpected duplicate submit. Production timeout/network-loss manufacture is explicitly out of scope.

Build104 must remain a deployed candidate until that normal-path real-user smoke passes.
