# Build106 — REAL USER PASS

Date: 2026-08-17
Runtime: **Studio v0.19.28 · Build106**
Codename: `studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth`
Status: **ACCEPTED**

## Accepted scope

Build106 hardens the public LaunchPAD Track-catalog fallback that is used only after the preferred private canonical Track Manager read has ultimately failed.

- the existing initial public health/list/detail request remains one-shot and may still run in parallel for enrichment;
- a second public GET is allowed only after final private-read failure and only when that first public request failed transiently;
- retryable classes are timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`;
- maximum public attempts are **2**;
- deterministic HTTP failures, invalid JSON and invalid semantic payloads remain non-retry;
- the bounded family is only `GET /health`, `GET /tracks`, and `GET /tracks/<trackId>`;
- generic `src/services/http.ts` remains one-shot;
- public Album artwork fallback remains unchanged;
- no write retry, Deep Audio retry, Track Manager, Worker, Public Worker, SonicTrace backend or R2 schema/data change occurred.

## Runtime and candidate-doc receipts

```text
Base                     7dfda47ed1186adf815bfd60a9c2affa5e1b255e
Runtime PR               #208
Exact tested head        61bca333a7f9898444c8d9e1610e3d6c6585664b
Final runtime CI         #611 · 32058498867 · SUCCESS
Runtime merge            9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Runtime Pages            #219 · 32058828759 · SUCCESS build + deploy
Candidate docs PR        #209
Candidate docs CI        #612 · 32059364849 · SUCCESS
Candidate docs merge     24125d13962d8394ff0026ebbe38341607726054
Candidate docs Pages     #220 · 32059459541 · SUCCESS build + deploy
Acceptance docs PR       PENDING
Acceptance docs CI       PENDING
Acceptance docs merge    PENDING
Acceptance docs Pages    PENDING
Safety pre-build         safety/pre-build106-public-catalog-fallback-retry-20260817
Safety green premerge    safety/post-build106-green-premerge-20260817-2112
Safety post-deploy       safety/post-build106-deployed-candidate-20260817-2115
Safety real-user pass    safety/post-build106-real-user-pass-20260817-2141
Worker deploy            NONE
Track Manager change     NONE
Public Worker change     NONE
SonicTrace backend       NONE
R2 migration/schema      NONE
```

## Human smoke

The user executed the requested normal-path smoke in a browser **private/incognito** context without the private Cloudflare Access session.

The supplied visual evidence showed:

```text
Studio release identity  v0.19.28 · Build 106
Track                     Ghost Signal · PUBLISHED
Fallback banner           PUBLIC READ-ONLY FALLBACK
Fallback explanation      Private production tools are temporarily locked
Read source               LaunchPAD public catalog
Track detail              opened successfully
Lyrics canonical source   lyrics.txt PRESENT · READ ONLY
```

The screenshot therefore proves the acceptance boundary directly:

```text
private canonical read unavailable
→ Studio enters public read-only fallback
→ published Track workspace remains available
→ published Track detail opens normally
```

No Public Worker timeout, HTTP 503, network disconnect, coordinator stop or other destructive fault was deliberately manufactured. The transient retry branch is covered by automated Build106 guards; this real-user smoke proves the normal public-fallback product path remains usable.

Result: **PASS**.

## Acceptance boundary

Build106 is now the latest accepted Studio runtime. Build105 remains its accepted predecessor.

Build101 remains rejected historical evidence for the Track-asset ETag representation false negative. Build104 remains rejected historical evidence for the Deep Audio false-UNKNOWN classification. Successor acceptance does not rewrite either verdict.

This acceptance does **not** authorize automatic retry of Track/Album writes, Deep Audio compute, generic HTTP operations, or any other non-idempotent operation.

Next action: fresh read-only post-Build106 Phase9 audit. **Build107 stays unallocated until that audit proves one bounded next gap.**
