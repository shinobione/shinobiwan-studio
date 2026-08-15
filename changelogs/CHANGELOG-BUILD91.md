# Studio v0.19.13 · Build91 — Phase9 SonicTrace private-read transient retry truth

Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**.

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
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
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

## Validation evidence

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

Final exact-head validation and deploy:

```text
Runtime PR              #154
Exact tested head       b8ee223b2d077e5d14936530be219f78ed7910ac
Final CI                31888303536 · SUCCESS · first run
Runtime merge           591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6
Runtime Pages           31888346988 · SUCCESS · exact runtime merge SHA
```

No red intermediary Build91 validation run was required or merged.

## Safety

```text
Safety pre              safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
Safety pre-PR           safety/post-build91-prepr-20260815-1555
Safety post-deploy      safety/post-build91-deployed-candidate-20260815-1559
Feature branch          phase9/build91-sonictrace-private-read-retry
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Build92                 UNALLOCATED
```

## Real-user acceptance boundary — PENDING

Use a normal browser regression only:

- hard refresh and verify `v0.19.13 · Build91`;
- open a Track that already has canonical SonicTrace analysis;
- open SonicTrace and confirm canonical latest/history state loads normally;
- open a Studio surface that consumes the SonicTrace catalog and confirm it loads normally;
- make **no write** — Build91 is a read slice;
- quick Track / Albums / Lyrics / SonicTrace navigation sanity.

Do **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture the retry branch. Automated guards own failure-path classification proof.

Until explicit user verdict:

```text
Build91 = DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
```

## Stop line

- GET-only retry.
- Never turn Build91 into SonicTrace save/analysis retry.
- Do not broaden Build91 into Album create/upload or PWA work.
- Do not modify Track Manager / Worker / R2 for this slice.
- Do not merge red CI.
- Merge only the exact tested head.
- Do not allocate Build92 before Build91 explicit acceptance plus a fresh audit.
