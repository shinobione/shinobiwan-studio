# Phase9 Build106 — Public catalog fallback transient retry audit

Date: 2026-08-17
Audit base: `7dfda47ed1186adf815bfd60a9c2affa5e1b255e`
Status: **BOUNDED GAP PROVED · SOURCE CANDIDATE**

## Fresh read-only finding

After accepted Build105 closeout, a fresh reread of current `main` found one bounded Studio-only reliability gap.

Private Track Manager reads already use a maximum of two attempts for timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`. Studio's public LaunchPAD fallback did not: `health`, Track list and Track detail still used the generic one-shot `fetchJson()` helper.

Studio starts those public reads in parallel with the preferred private canonical reads. When the private side is unavailable because of Access/CORS or another final private-read failure, a single transient Public Worker timeout/transport/503 could therefore make the whole catalog surface fail even though one second idempotent GET would be safe.

## Chosen Build106 slice

Build106 hardens only these public read-only endpoints:

```text
GET /health
GET /tracks
GET /tracks/<trackId>
```

Policy:

```text
first timeout / browser transport interruption
or HTTP 408 / 425 / 429 / 500 / 502 / 503 / 504
→ exactly one automatic GET retry
→ maximum 2 total attempts

ordinary deterministic HTTP failure
or invalid JSON / invalid semantic payload
→ no automatic retry
```

The generic `src/services/http.ts` helper remains one-shot. Build106 therefore does not silently change unrelated callers.

## Explicit exclusions

- no POST, write, mutation or write retry;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no SonicTrace coordinator/backend change;
- no R2 schema/data/media mutation;
- no Deep Audio behavior change;
- no create/upload causality work;
- no change to public Album artwork fallback.

`getPublicAlbumVisuals()` remains private-canonical-first. Its public `/albums` projection is supplementary and intentionally swallowed on failure because private canonical artwork is already sufficient for Studio; it is not the same availability boundary as Track catalog fallback.

## Human acceptance boundary after deployment

Do not manufacture a Public Worker outage or transient HTTP failure in production. Automated guards own retry classification.

The human smoke should instead prove the normal public fallback remains usable without a private Cloudflare Access session, for example in an incognito/separate browser session:

```text
Studio loads
→ private Track Manager read unavailable
→ public LaunchPAD catalog fallback loads published Tracks
→ one published Track detail opens normally
```

Build105 remains the latest accepted runtime until that smoke passes. Build107 stays unallocated.
