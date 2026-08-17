# CHANGELOG — Studio v0.19.28 · Build106

Date: 2026-08-17
Status: **REAL USER PASS · ACCEPTED**
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

## Validation, deployment and candidate-doc receipts

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
Candidate docs PR        #209
Candidate docs CI        #612 · 32059364849 · SUCCESS
Candidate docs merge     24125d13962d8394ff0026ebbe38341607726054
Candidate docs Pages     #220 · 32059459541 · SUCCESS build + deploy
Real-user smoke          PASS · private/incognito · PUBLIC READ-ONLY FALLBACK · Ghost Signal detail opened
Human-pass safety        safety/post-build106-real-user-pass-20260817-2141
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

## Real-user acceptance

The requested smoke was performed in a browser **private/incognito** context without the private Cloudflare Access session.

Visible evidence showed:

```text
Studio footer           v0.19.28 · Build 106
Track                    Ghost Signal · PUBLISHED
Fallback banner          PUBLIC READ-ONLY FALLBACK
Fallback state           Private production tools are temporarily locked
Read source              LaunchPAD public catalog
Track detail             opened successfully
Lyrics canonical source  lyrics.txt PRESENT · READ ONLY
```

This proves the ordinary fallback path remains usable when private production reads are unavailable. No Public Worker timeout, 503, network disconnect or other artificial fault was manufactured. Automated guards remain the authority for the bounded transient retry branch.

Result: **PASS**.

## Acceptance boundary

Build106 is now the latest accepted Studio runtime. Build105 remains its accepted predecessor. Build101 and Build104 remain rejected historical candidates and are not rewritten by successor acceptance.

This acceptance does **not** authorize automatic retry of writes, Deep Audio compute, or generic HTTP calls.

Next action: fresh read-only post-Build106 Phase9 audit. **Build107 stays unallocated until that audit proves one bounded next gap.**
