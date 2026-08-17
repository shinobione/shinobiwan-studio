# CHANGELOG — Studio v0.19.28 · Build106

Date: 2026-08-17
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**
Codename: `studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth`

## Trigger

Fresh read-only post-Build105 Phase9 audit found that Studio's public LaunchPAD catalog fallback remained one-shot even though the preferred private Track Manager read family already had bounded transient GET retry.

When the private read ultimately fails, a single transient timeout/transport interruption or transient Public Worker HTTP failure could therefore make `health`, Track inventory or Track detail unavailable instead of safely repeating the idempotent public GET once.

## Build106 contract

Build106 deliberately preserves the existing initial public enrichment read as a one-shot request started in parallel with the private canonical read. A second public GET is allowed only after **both** of these facts are true:

1. the preferred private canonical read has ultimately failed; and
2. the already-started public read failed with a bounded transient class.

Then, and only then:

```text
first public timeout / browser transport interruption
or HTTP 408 / 425 / 429 / 500 / 502 / 503 / 504
→ exactly one fallback GET retry
→ maximum 2 public attempts total
```

Deterministic ordinary HTTP failures, invalid JSON and semantic invalid payloads (`ok:false`, missing Track/list) do not retry.

The bounded family is only:

```text
GET /health
GET /tracks
GET /tracks/<trackId>
```

The generic `src/services/http.ts` helper remains one-shot. Public Album artwork fallback is unchanged. Private Track Manager authority remains preferred. All writes and Deep Audio compute semantics remain unchanged.

## Validation and deployment receipts

```text
Accepted predecessor     Studio v0.19.27 · Build105 · REAL USER PASS
Audit base               7dfda47ed1186adf815bfd60a9c2affa5e1b255e
Pre-build safety         safety/pre-build106-public-catalog-fallback-retry-20260817
Feature branch           phase9/build106-public-catalog-fallback-transient-retry
Runtime PR               #208
Exact tested head        61bca333a7f9898444c8d9e1610e3d6c6585664b
Final runtime CI         #611 · 32058498867 · SUCCESS
Green premerge safety    safety/post-build106-green-premerge-20260817-2112
Runtime merge SHA        9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Runtime Pages            #219 · 32058828759 · SUCCESS build + deploy
Post-deploy safety       safety/post-build106-deployed-candidate-20260817-2115
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
- maximum two public attempts total;
- invalid JSON stays non-retry;
- initial public enrichment reads remain one-shot;
- a second public GET can happen only inside the final private-read failure path;
- exactly the public health/list/detail family participates;
- generic HTTP helper stays one-shot;
- private authority/fallback ordering stays intact;
- Album artwork fallback remains outside this slice;
- no POST/write path is introduced.

Historical guards were extended only to recognize Build106 as a bounded successor. Build88 was strengthened rather than weakened: it now explicitly requires the public retry resolver to remain downstream of final private-read failure.

## Explicit non-scope

- no POST/write retry;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no SonicTrace coordinator/backend change;
- no R2 schema/data/media mutation;
- no Deep Audio behavior change;
- no create/upload causality work;
- no public Album artwork retry change.

## Human acceptance boundary

Use a safe browser context without the private Cloudflare Access session and confirm Studio still falls back to the public LaunchPAD catalog:

```text
Studio v0.19.28 · Build106
→ private Track Manager read unavailable
→ public published Track catalog loads
→ one published Track detail opens normally
```

Do **not** deliberately break the Public Worker, network or Cloudflare to manufacture a transient failure. Automated guards own retry classification. Build105 remains the latest accepted Studio runtime until this smoke passes.
