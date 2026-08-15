# SHINOBIWAN Studio — Build94

Date: 2026-08-15  
Version: `v0.19.16`  
Build: `94`  
Codename: `studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth`  
Status: **IMPLEMENTED CANDIDATE · CI PENDING**

## Fresh-audit decision

After accepted Build93, the fresh read-only Phase9 audit compared Album asset-upload response-loss truth, Album create response-loss truth, degraded/offline/PWA resilience, Deep Audio compute transport, Track create/assets, and remaining non-mutating validation seams.

Album create/upload remain causality-heavy mutations. Track create/assets are writes. Deep Audio `/api/studio/analyze` is non-canonical compute but may run for many minutes, so automatic retry could duplicate expensive work while the first request is still processing. The smallest coherent gap is canonical Lyrics **validation**.

`lyrics-validate-v1` is explicitly non-mutating and already had a finite 9-second timeout, but `validateAdminTrackLyrics()` still made only one attempt. A non-timeout browser fetch interruption on that validation path could also be surfaced as a misleading Cloudflare Access problem.

## Build94 scope

Build94 changes only Studio-side non-mutating `lyrics-validate-v1`:

- visible Lyrics **Validate** action;
- exact canonical Track revision + Lyrics ETag validation boundary;
- one bounded retry after timeout, browser transport interruption or HTTP `408/425/429/500/502/503/504`;
- maximum two total attempts;
- finite 9-second timeout per attempt;
- Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal are never retried.

It does **not** change:

- `lyrics-save-v1` transport;
- Build83 lost-response recovery;
- canonical `lyrics.txt` authority;
- Track create/assets;
- Album operations;
- SonicTrace / Deep Audio operations;
- Track Manager / Worker code;
- R2 schema/data;
- PWA/offline behavior.

## Frozen save boundary

Build83 remains unchanged:

```text
lyrics-save-v1 response unavailable
→ NEVER blind automatic retry
→ private canonical Lyrics + Track reread
→ committed / not-committed / ambiguous / unverified
```

Build94 makes the zero automatic save retry boundary explicit as `maxAutomaticSaveRetries: 0`.

## Guard

`scripts/test-phase9-lyrics-validation-transient-retry-build94.mjs` protects:

- Build94 release identity + accepted Build93 ancestry;
- exact `lyrics-validate-v1` intent;
- explicit transient HTTP allowlist;
- finite 9-second timeout per attempt;
- exactly one retry / two total attempts;
- timeout + transport + transient HTTP retry only;
- Access and invalid-response non-retry;
- visible Lyrics Validate action using the hardened service;
- validation remaining explicitly non-mutating;
- inherited Build83 save timeout/transport + response-loss truth;
- zero automatic Lyrics save retry;
- inherited Phase9 Build82→Build93 gate.

## Safety

```text
Accepted base main      ce9667cc80dbdc07ef74d9c0068d15b2b0ec2201
Safety pre              safety/pre-phase9-lyrics-validation-retry-build94-20260815-2010
Feature branch          phase9/build94-lyrics-validation-retry
Worker deploy           NONE planned
Track Manager change    NONE
R2 migration/write      NONE caused by implementation
```

CI, merge, Pages and real-user acceptance remain separate future states.
