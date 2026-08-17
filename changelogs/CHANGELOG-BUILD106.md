# CHANGELOG — Studio v0.19.28 · Build106

Date: 2026-08-17
Status: **SOURCE CANDIDATE · CI PENDING**
Codename: `studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth`

## Trigger

Fresh read-only post-Build105 Phase9 audit found that Studio's public LaunchPAD catalog fallback remained one-shot even though the preferred private Track Manager read family already had bounded transient GET retry.

When the private read ultimately fails, a single transient timeout/transport interruption or transient Public Worker HTTP failure could therefore make `health`, Track inventory or Track detail unavailable instead of safely repeating the idempotent public GET once.

## Build106 contract

- public catalog fallback only: `GET /health`, `GET /tracks`, `GET /tracks/<trackId>`;
- maximum 2 total attempts;
- one automatic retry only after the first timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`;
- deterministic ordinary HTTP failures do not retry;
- invalid JSON does not retry;
- semantic invalid payload (`ok:false`, missing Track/list) remains deterministic and does not retry;
- private Track Manager reads remain preferred canonical authority;
- public fallback still activates only after private read failure;
- generic `src/services/http.ts` stays one-shot;
- public Album artwork fallback is unchanged;
- all writes and Deep Audio compute semantics remain unchanged.

## Source receipts

```text
Accepted predecessor     Studio v0.19.27 · Build105 · REAL USER PASS
Audit base               7dfda47ed1186adf815bfd60a9c2affa5e1b255e
Pre-build safety         safety/pre-build106-public-catalog-fallback-retry-20260817
Feature branch           phase9/build106-public-catalog-fallback-transient-retry
Runtime PR               PENDING
Final runtime CI         PENDING
Runtime merge            PENDING
Runtime Pages            PENDING
Real-user smoke          PENDING
Worker deploy            NONE
Track Manager change     NONE
Public Worker change     NONE
SonicTrace backend       NONE
R2 migration/schema      NONE
```

## Regression guard

`scripts/test-phase9-public-catalog-fallback-transient-retry-build106.mjs` verifies:

- release/version ancestry;
- explicit bounded transient HTTP set;
- timeout/transport/transient-HTTP retry eligibility only;
- maximum two total attempts;
- invalid JSON stays non-retry;
- exactly the public health/list/detail family uses the dedicated helper;
- generic HTTP helper stays one-shot;
- private authority/fallback ordering stays intact;
- Album artwork fallback remains outside this slice;
- no POST/write path is introduced.

## Human acceptance boundary

After deployment, use a safe browser session without the private Cloudflare Access session and confirm Studio can still load the public fallback catalog and open one published Track detail. Do not deliberately break the Public Worker or network to force the retry branch; automated guards cover that boundary.
