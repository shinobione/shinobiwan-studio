# PHASE UX / C3-A — SonicTrace Deep Audio resilience

Date: 2026-08-11

Studio release candidate: `v0.13.0 · Build 38`
SonicTrace companion release: `V2-E · BUILD 06` / engine `2.0.1-alpha`

## Why C3-A exists

Real-user Studio analysis showed a coordinator-side failure:

`FFmpeg loudnorm did not return a measurement block.`

Browser DSP succeeded and the coordinator endpoint was reachable, but the old SonicTrace endpoint executed mastering before Neural / embedding / structure. The mastering exception aborted the entire HTTP request, so Studio only received an error and manufactured a Browser-DSP-only fallback.

The UI then called the coordinator `offline`, which was inaccurate.

## New failure semantics

### FULL

A current profile is FULL only when Studio has:

- Browser DSP;
- usable mastering loudness and levels measurements;
- Neural result;
- a finite 512D embedding;
- structure.

### PARTIAL

PARTIAL means the coordinator returned a valid analysis envelope with some retained Deep Audio layers, but at least one expected layer is unavailable or missing.

A missing loudness measurement can therefore coexist with a valid Neural result, 512D embedding and structure.

### UNAVAILABLE

UNAVAILABLE is reserved for the Browser-DSP fallback where Deep Audio itself could not return retained layers. Transport failures and coordinator processing failures are described separately in the notice.

### OUTDATED

OUTDATED remains the existing canonical-audio revision mismatch state.

## Transport vs processing

- XHR transport error / timeout: coordinator unreachable, offline or browser-blocked.
- HTTP error from `/api/studio/analyze`: coordinator responded but processing failed.
- successful schema-v1 response with warnings: coordinator completed the analysis; profile may be PARTIAL.

These states must never be collapsed into the same `offline` message.

## Mastering truthfulness

A mastering object containing `provenance: unavailable` is not considered a ready mastering layer.

Null metrics are rendered as `—`. JavaScript numeric coercion must never turn missing values into `0.0`.

## Persistence

The persistence contract is unchanged:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Track Manager remains the protected write authority. Studio can still explicitly save a PARTIAL or UNAVAILABLE profile after review, preserving warnings and history.

No audio is retained by SonicTrace.

## Acceptance boundary

C3-A requires a real-user scan after the local coordinator is updated to SonicTrace Build 06.

The critical acceptance case is an audio file that previously triggered the loudnorm measurement-block failure. Expected result:

1. `/api/studio/analyze` returns a schema-v1 envelope instead of HTTP 500 when only mastering measurement degrades;
2. Neural / embedding / structure are still attempted and retained when their runtimes are healthy;
3. Studio labels the result FULL or PARTIAL according to the actual retained layers;
4. it never calls a responding coordinator offline;
5. no save to R2 is required for the first smoke.

C3-B V2-E parity and final PHASE UX closeout remain after this acceptance. Phase 7 stays locked.
