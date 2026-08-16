# SHINOBIWAN Studio — Build99

Date: 2026-08-16  
Version: `v0.19.21`  
Build: `99`  
Codename: `studio-focus-slice4-phase9-album-asset-upload-success-verification-truth`  
Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**

## Why this slice exists

The fresh read-only post-Build98 audit found a smaller, provable reliability seam than Album upload lost-response recovery or exact selected-byte digest truth.

Track asset normal-success already requires a canonical reread that proves revision + manifest pointer + asset presence (and duration when applicable). Album asset normal-success still called the shared Album verifier without an operation-specific postcondition, so `clientVerified=true` could be based on the new Album revision alone.

Track Manager v5.24 already returns bounded Album asset evidence on successful upload (`kind`, `path`, `size`, `contentType`, `etag`) and the private Album reread exposes the canonical manifest slot plus asset state. Build99 consumes that existing evidence; it does not change backend authority.

## Runtime scope

Build99 changes only Studio-side normal-success verification for Album cover/thumbnail upload:

```text
successful Album asset response
  -> require requested kind + canonical path in response
  -> private canonical Album reread
  -> exact response revision
  -> requested manifest slot points to response path
  -> private asset state is present
  -> response size matches reread size when returned
  -> response contentType matches reread contentType when returned
  -> response ETag matches reread ETag when returned
  -> only then clientVerified=true
```

The daily Albums UI already rejects `clientVerified=false`, so both sequential cover and generated thumbnail uploads inherit the stronger success truth without UI restructuring.

## Explicit non-goals

Build99 does **not** claim:

- that Studio proves the exact selected client bytes with a client-computed digest;
- that Album asset upload lost-response causality is solved;
- that an absent/present asset transition proves a lost request caused the change;
- any new operation ID contract;
- any automatic upload retry;
- any Worker or R2 change.

Those boundaries remain explicit:

```text
assetUploadExactBytesPolicy = not-covered-no-client-digest
assetUploadLostResponsePolicy = not-covered-no-operation-id-no-blind-retry
maxAutomaticAssetUploadRetries = 0
```

## Preserved accepted ancestry

Build99 preserves:

- Build96 Album create normal-success metadata verification;
- Build97 Track create normalized-response/private-reread equality;
- Build98 bounded TM v5.24 / Studio bridge v1.14 compatibility;
- Build82–94 response-loss/read/validation safety;
- Build95 daily Albums resilient metadata/membership/move wiring;
- zero blind automatic write retries.

## Candidate receipts

```text
Accepted Studio base       857280a7e832d6aa3151a9672e79f80ffe204504
Safety pre                  safety/pre-build99-album-asset-success-verification-20260816
Runtime PR                  #183
Initial clean PR head       4b0dfca4df86263b1a84f9b066f74f2de8e0aafe
Historical full CI #498     31920761317 · FAILURE · inherited C2.5-D literal verifier guard only · never merged
Exact final tested head     3cc99aabd18d23ec38ba4df9fd042e03aace8238
Final full CI #499          31920824628 · SUCCESS
Runtime merge               dd26df1664fa7de2b2e77b0d2ae3d9d48cb9eefd
Runtime Pages #190          31920895328 · SUCCESS / SUCCESS · exact runtime merge SHA
Safety pre-PR               safety/post-build99-prepr-20260816
Safety green pre-merge      safety/post-build99-green-premerge-20260816
Safety post-deploy          safety/post-build99-deployed-candidate-20260816
Worker deploy               NONE
Track Manager change        NONE
R2 migration/write          NONE caused by implementation
Public Worker               v2.7 unchanged
```

Full CI #498 exposed only the inherited C2.5-D guard's literal expectation for `return verify(albumId, payload)`. That guard alone was widened to recognize Build99's same canonical verifier with the new `expectedAsset` postcondition while preserving Track Manager authority and zero automatic Album asset upload retries. No runtime logic changed in response to that red run. Full CI #499 then passed on the exact final head.

## Human acceptance boundary

Build99 is **not yet REAL USER PASS**.

A useful real-user smoke is a genuine Album cover/thumbnail replacement on an Album that actually needs artwork changed. Normal success must complete without a verification error; after reload, the cover/thumbnail must remain canonically present. Do not create a disposable canonical Album and do not deliberately break network/Cloudflare Access merely to manufacture a lost-response branch.

Build100 remains **UNALLOCATED** pending Build99 human acceptance, acceptance-docs closeout, and a fresh read-only post-Build99 audit.
