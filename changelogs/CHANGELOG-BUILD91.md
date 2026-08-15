# Studio v0.19.13 · Build91 — Phase9 SonicTrace private-read transient retry truth

Status: **REAL USER PASS · ACCEPTED**.

## Fresh audit proof

Build91 was allocated only after Build90 received explicit `BUILD90 PASS MADAFAKA`, its acceptance closeout was merged/deployed, and a fresh read-only post-Build90 audit compared the remaining reliability families.

The audit confirmed:

- SonicTrace canonical private reads still used one historical `adminJson()` helper for both Track latest/history state and the SonicTrace catalog;
- that helper already had finite 12s / 20s timeouts but a non-timeout browser `fetch()` rejection was still presented as a Cloudflare Access/authentication problem and received no retry;
- the canonical save POST remains isolated in `postSonicTraceSave()` and Build84 response-loss recovery is operation-specific and mature;
- therefore SonicTrace GET hardening can strengthen normal state/catalog reads plus Build84 verification/recovery rereads without retrying a write;
- Album create still lacks a persisted operation identifier/pre-write revision sufficient for exact lost-response causality without backend contract work;
- Album binary upload still sends multipart bytes without a client-side exact digest/ETag contract sufficient to prove selected bytes after response loss;
- degraded/offline/PWA resilience remains cross-cutting and has no dedicated service-worker boundary in the current repo.

## Scope

Build91 changes only private Track Manager SonicTrace GETs:

```text
GET /api/studio/tracks/:trackId/analysis/sonictrace
GET /api/studio/analysis/sonictrace
```

Retry classification:

```text
timeout                          → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                          → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Maximum attempts: **2 total**.

A second transient failure surfaces immediately. There is no delay/backoff framework and no generic retry service.

## Build84 write boundary preserved

Build91 does **not** alter:

- `sonictrace-analysis-save-v1` POST semantics;
- `SONICTRACE_SAVE_TIMEOUT` / `SONICTRACE_SAVE_TRANSPORT` classification;
- Build84 committed / not-committed / ambiguous / unverified recovery;
- the rule that a lost save response is never blindly retried.

`getSonicTraceAnalysisState()` continues to be the canonical latest/history reread used before save, after lost response, and after normal success. The only difference is that the GET may now survive one transient read failure before the existing Build84 recovery logic gives up.

## Explicit non-scope

Build91 does **not** change:

- SonicTrace Deep Audio health or analysis POST/XHR behavior;
- canonical audio temporary download behavior;
- Album create or upload response-loss semantics;
- Track / Album / Lyrics private-read behavior already accepted in Build88–90;
- Track Manager / Worker code;
- R2 schema/data;
- LaunchPAD or LRC Maker;
- any user-facing layout or workflow.

## Validation

Build91 adds `scripts/test-phase9-sonictrace-private-read-transient-retry-build91.mjs` and keeps Build90 as immutable accepted ancestry.

The guard requires:

- exact v0.19.13 / Build91 / codename identity;
- Build90 ancestry marker;
- explicit SonicTrace transient HTTP allowlist;
- transport interruption distinct from Access/CORS;
- maximum two total private SonicTrace GET attempts;
- no retry for Access/CORS or invalid JSON;
- both latest/history state and catalog use the bounded helper;
- private helper cannot accept an arbitrary request method;
- exactly the inherited Track Manager SonicTrace save POST transport remains;
- Build84 save timeout/transport and no-blind-retry markers remain intact;
- no automatic SonicTrace save/analysis retry helper exists;
- Build82→Build91 remain in the full Phase9 gate.

Known historical successor guards were widened only through bounded `v0.19.13 / Build91` compatibility while keeping all functional assertions intact.

Exact runtime evidence:

```text
Safety pre              safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
Safety pre-PR           safety/post-build91-prepr-20260815-1555
Runtime PR              #154
Exact tested head       b8ee223b2d077e5d14936530be219f78ed7910ac
Validation              31888303536 · SUCCESS · first run
Runtime merge           591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6
Runtime Pages           31888346988 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build91-deployed-candidate-20260815-1559
Candidate docs PR       #155
Candidate docs merge    32a57f50c90f3f7677e3a45ad46eace8bd988b3d
Candidate docs Pages    31889030115 · SUCCESS · exact candidate-docs merge SHA
Safety post-acceptance  safety/post-build91-real-user-pass-20260815-1700
Acceptance docs PR      #156
Acceptance docs merge   PENDING
Acceptance docs Pages   PENDING
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

## Real-user acceptance

The required browser boundary was deliberately a **normal SonicTrace private-read regression**, not a manufactured transient-failure test.

The user returned the explicit verdict on 2026-08-15:

```text
BUILD91 PASS MADAFAKA
```

The accepted boundary is the prescribed Build91 smoke:

- deployed `v0.19.13 · Build91` visible after refresh;
- an existing Track with canonical SonicTrace analysis loads normal canonical latest/history state;
- a normal SonicTrace catalog/Intelligence surface loads successfully;
- surrounding Track / Albums / Lyrics / SonicTrace navigation remains sane;
- no canonical write is required for this read-only slice.

Acceptance intentionally did **not** cut network, invalidate Cloudflare Access, or manufacture timeout/transport/transient-HTTP failures. Those branches remain protected by automated classification and attempt-bound guards.

Result:

```text
Build91 = REAL USER PASS · ACCEPTED
Phase9 Slice10 = COMPLETE
Build92 = UNALLOCATED pending a fresh post-Build91 audit
```

## Safety stop line

- GET-only retry.
- Never turn Build91 into SonicTrace save/analysis retry.
- Do not broaden Build91 into Album create/upload or PWA work.
- Do not modify Track Manager / Worker / R2 for this slice.
- Do not generalize one read/write family into another without a fresh audit.
- Build92 remains unallocated until the Build91 acceptance closeout is published and a fresh audit selects the next bounded scope.