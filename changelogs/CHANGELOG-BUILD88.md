# Studio v0.19.10 · Build88 — Phase9 core private-read transient retry truth

Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**.

## Fresh audit proof

Build88 was allocated only after Build87 received explicit REAL USER PASS and its acceptance closeout was merged and deployed.

The fresh read-only Phase9 audit compared:

- Album asset upload response-loss truth;
- Album create response-loss truth;
- Access/CORS hardening;
- bounded read retries/timeouts;
- degraded/offline/PWA resilience.

The smallest coherent proven gap is the **core private Track Manager GET path** used for bridge health, Track inventory and Track detail.

Before Build88, `fetchAdminJson()` already had finite 4.5–7s timeouts, but any non-timeout browser `fetch()` rejection was classified as `access-or-cors`. `catalog-api.ts` then immediately fell back to the public catalog after that first private failure. A transient network/transport blip could therefore be presented as an Access problem and temporarily hide private-only canonical truth such as Draft Tracks.

Album create remains deferred because absent→present creation has no pre-write revision or persisted client operation identifier strong enough to prove exact causality after a lost response without a backend contract change.

Album binary upload remains deferred because the server returns the canonical R2 ETag only after upload; Studio does not currently possess a precomputable exact digest/ETag contract that can prove the uploaded bytes after a lost response.

Offline/PWA resilience remains cross-cutting: Studio currently has no dedicated service-worker/PWA layer, so introducing one is not a bounded Phase9 reliability correction.

## Scope

Build88 changes only the common Studio private GET transport in `src/services/admin-api.ts` for:

- `/api/studio/health`;
- `/api/studio/tracks`;
- `/api/studio/tracks/:trackId`.

It does **not** change:

- any POST/write retry behavior;
- Album create/upload semantics;
- Album metadata/membership/move/delete semantics;
- Lyrics or SonicTrace write recovery;
- Track Manager source or Worker deployment;
- R2 schema/data;
- LaunchPAD, LRC Maker or SonicTrace Deep Audio.

## Retry classification

Core private GETs now distinguish:

```text
timeout                         transient → one retry max
transport/fetch interruption     transient → one retry max
HTTP 408/425/429/500/502/503/504 transient → one retry max

HTTP 401/403                     Access failure → NO RETRY
other deterministic 4xx          HTTP failure → NO RETRY
non-JSON Access/gating response  Access/CORS → NO RETRY
invalid JSON                     invalid response → NO RETRY
```

There are at most **two total attempts**. A second failure is surfaced immediately; there is no loop/backoff framework.

Public fallback remains unchanged in `catalog-api.ts`: it is consulted only after the private helper ultimately fails. Build88 simply prevents one transient private transport fault from causing an immediate downgrade to public truth.

## Safety boundary

This is GET-only retry. No write, validation POST, upload, deletion, catalog rebuild or other mutation is retried automatically.

The implementation exposes:

```text
privateReadRetryPolicy: one-retry-timeout-transport-transient-http-no-access-retry
privateReadMaxAttempts: 2
```

## Validation evidence

Build88 adds:

- `scripts/test-phase9-private-read-transient-retry-build88.mjs`;
- Phase9 gate inheritance Build82 → Build83 → Build84 → Build85 → Build86 → Build87 → Build88;
- immutable Build87 ancestry marker;
- bounded historical successor compatibility only where old guards explicitly capped the accepted runtime line.

Exact candidate evidence:

```text
Safety pre              safety/pre-phase9-private-read-retry-build88-20260815-0916
Runtime PR              #144
Exact tested head       808b0c63fc22f17a04a9c544b934d97c791d3a73
Final CI                31871980725 · SUCCESS
Runtime merge           9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages           31872073050 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build88-deployed-candidate-20260815-0932
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         PENDING
```

Historical CI runs:

- `31871834515` — red only because the inherited Phase7-C Build69 successor allowlist stopped at `0.19.9`;
- `31871883072` — Phase7/8/9 including the new Build88 guard passed, then the inherited Studio Focus Build64 successor allowlist stopped at `0.19.9`.

Those heads were never merged. The old guards were widened only for bounded Build88 successor compatibility while preserving their functional assertions. Final exact-head CI `31871980725` passed the complete repository-native chain.

## Real-user acceptance boundary

Build88 is **not yet REAL USER PASS**.

Use a normal browser regression after deployment:

- hard refresh Studio and verify `v0.19.10 · Build88`;
- Home / Tracks should load the normal private inventory, including Draft Tracks when present;
- open a Track and verify normal private canonical detail;
- quick Albums / Lyrics / SonicTrace navigation sanity.

Do **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture the retry branch. Automated guards cover the classification and bounded-attempt contract.

## Safety / rollback

Runtime rollback is Studio-only. Build88 introduces no backend deployment and no R2 schema/data migration. The safety checkpoints are:

- `safety/pre-phase9-private-read-retry-build88-20260815-0916`;
- `safety/post-build88-deployed-candidate-20260815-0932`.

## Stop line

- Do not turn Build88 into a generic retry framework.
- Do not retry writes.
- Do not retry deterministic Access/CORS or invalid-response failures.
- Do not merge red CI.
- Merge only the exact tested head.
- Do not allocate Build89 before Build88 explicit acceptance plus a fresh bounded audit.
