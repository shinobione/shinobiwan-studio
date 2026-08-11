# PHASE UX / C3-A — SonicTrace Deep Audio resilience

Date: 2026-08-11

Studio release candidate: `v0.13.0 · Build 38` (carried forward in current Studio `v0.13.3 · Build 41`)
SonicTrace companion release: `V2-E · BUILD 06` / engine `2.0.1-alpha`
Post-pass checkpoint: `safety/c3-a-real-user-pass-20260811-1900`

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

The critical acceptance behaviors are:

1. `/api/studio/analyze` returns a schema-v1 envelope instead of HTTP 500 when only mastering measurement degrades;
2. Neural / embedding / structure are still attempted and retained when their runtimes are healthy;
3. Studio labels the result FULL or PARTIAL according to the actual retained layers;
4. it never calls a responding coordinator offline;
5. no save to R2 is required for the first smoke.

## Real-user acceptance — PASS

**Accepted 2026-08-11.**

The local SonicTrace installation was updated and restarted on the production RTX machine, then Studio `v0.13.3 · Build 41` ran a real canonical-audio scan for **Stick to You** without saving the new draft to R2.

The `REVIEW / NOT SAVED` result was:

```text
Profile          FULL
DSP              ready
MASTERING        ready
NEURAL           ready
EMBEDDING        ready
STRUCTURE        ready
SEMANTICSUMMARY  ready
Browser RMS      -15.8 dBFS
LUFS             -13.7 LUFS
True peak        -0.8 dBTP
Sections         9
```

This real-user scan proves the updated coordinator/Studio integration completes the full Deep Audio stack on canonical production audio with truthful FULL semantics and without a pre-save R2 mutation.

The historical track that originally triggered the exact loudnorm measurement-block failure could not be reliably reidentified from the archived screenshot/transcript, so the live smoke did not deliberately reproduce that exact file-specific failure. The degraded-mastering branch remains explicitly protected in source regression coverage:

- `backend/tests/test_ffmpeg_analysis.py` covers noisy loudnorm parsing, missing measurement objects, EBU R128 fallback parsing and explicit unavailable loudness shape;
- `backend/tests/test_studio_contract.py::test_partial_mastering_warning_does_not_drop_other_deep_layers` proves unavailable mastering retains Neural, finite 512D embedding and structure while surfacing a warning.

Taken together, the real-user full-stack scan plus the dedicated degraded-path regression contract closes C3-A without inventing a production failure or mutating canonical analysis merely for testing.

### Screenshot diagnostic note

The top `Engine diagnostics` card in Studio reads the already-saved durable `latest` profile, not the current unsaved `draft`. Therefore an older `2.0.0-alpha` value can still appear there while the new Build 06 scan is sitting in `REVIEW / NOT SAVED`. That is a presentation nuance, not evidence that the current draft ran on the old engine. A later UX pass may expose the draft engine version directly in Review to remove this ambiguity.

C3-A is now **COMPLETE — REAL USER PASS**. C3-B V2-E parity is the next active PHASE UX slice. Phase 7 stays locked.
