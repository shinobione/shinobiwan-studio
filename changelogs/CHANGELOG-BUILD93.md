# SHINOBIWAN Studio — Build93

Date: 2026-08-15  
Version: `v0.19.15`  
Build: `93`  
Codename: `studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth`  
Status: **REAL USER PASS · ACCEPTED**

## Fresh-audit decision

The fresh post-Build92 read-only audit rechecked Album asset upload response-loss truth, Album create response-loss truth, degraded/offline/PWA resilience, and smaller remaining reliability gaps.

Album binary upload remains causality-heavy because the browser upload request still has no persisted operation identifier or exact client-side digest/ETag contract that can prove the selected bytes after a lost response. Album create remains causality-weak because absent→present does not uniquely attribute creation to one lost POST without a persisted operation identifier. PWA/offline remains cross-cutting.

The smaller proven gap was canonical Track metadata **validation**. `metadata-validate-v1` is non-mutating and already had a finite 7-second timeout, but the visible Validate flow and Build92 fresh pre-save validation could still fail after a single transient timeout/transport/HTTP interruption. Plain transport interruption was also still surfaced with misleading Cloudflare Access guidance.

## Build93 scope

Build93 changes only the Studio-side non-mutating `metadata-validate-v1` path used by:

- the visible Track Metadata **Validate** action;
- the Build92 fresh validation repeated immediately before explicit metadata Save;
- both plain validation and duration-aware validation when canonical audio evidence exists.

It does **not** change:

- `metadata-save-v1` write semantics;
- Build92 response-loss recovery;
- Track create or asset writes;
- Album operations;
- Lyrics or SonicTrace operations;
- Track Manager / Worker code;
- R2 schema/data;
- PWA/offline behavior.

## Retry truth

The validation operation is explicitly non-mutating, so one bounded retry is safe for transient failures only:

```text
metadata-validate-v1 attempt 1
├─ timeout                            → retry once max
├─ transport interruption             → retry once max
├─ HTTP 408/425/429/500/502/503/504  → retry once max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return reviewed proposal

attempt 2 failure → surface immediately
```

Maximum total attempts: **2**. No backoff framework or unbounded loop is introduced.

Build92 save remains zero automatic write retries. The save still reuses the exact fresh reviewed proposal, privately rereads canonical Track state and classifies response loss committed / not committed / ambiguous / unverified.

## Guard

`scripts/test-phase9-track-metadata-validation-transient-retry-build93.mjs` protects:

- release identity + Build92 ancestry;
- exact `metadata-validate-v1` intent;
- explicit transient HTTP allowlist;
- finite 7-second per-attempt timeout;
- exactly one retry / two total attempts;
- timeout + transport + transient HTTP retry only;
- Access and invalid-response non-retry;
- visible Validate action using the hardened wrapper;
- Build92 fresh pre-save validation using the same wrapper;
- duration-aware and plain validation convergence;
- zero automatic metadata Save retries;
- inherited Phase9 Build82→Build92 gate.

## Validation history

Historical CI `31898251689` failed only because the inherited Phase7-C Build69 successor allowlist stopped at `0.19.14 / Build92`. No Build93 runtime behavior was changed to repair that run.

Historical CI `31898329621` then passed Phase7-C, Phase8 and the complete Phase9 Build82→Build93 chain — including the new Build93 guard — and failed only because the inherited Studio Focus Build64 successor allowlist stopped at `0.19.14 / Build92`.

Focus Build64–67 were widened only to recognize `v0.19.15 / Build93` and Build92 ancestry; their functional assertions remain intact. Neither red head was merged.

Final exact head `fcbe4c59a3a364d9665eba2ed432f37475116364` passed the full repository-native validation chain in CI `31898542379`.

## Deployment receipts

Runtime PR #162 merged only the exact tested head above.

Runtime merge `6c1ceb7d59971ec6c7e251532054392f02c08157` deployed successfully through Pages run `31898639778` with both build and deploy jobs successful.

Candidate documentation PR #163 passed full CI `31899284370`, merged at `6464659428e34a679c8acfeb481bfaca78e05bc7`, and Pages run `31899342536` deployed that exact docs merge successfully.

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration, LaunchPAD change, LRC Maker change or SonicTrace runtime change was required.

## Real-user acceptance

The bounded normal-browser smoke completed on 2026-08-15 with the explicit verdict:

```text
BUILD93 PASS MADAFAKA
```

Acceptance covered the deployed `v0.19.15 · Build93` candidate in normal browser usage, including the Track metadata Validate path and surrounding product sanity. The transient timeout/transport/HTTP retry branch was **not deliberately manufactured** by cutting network or invalidating Cloudflare Access; automated guards remain the proof for those failure classifications and the two-attempt bound.

Build93 is therefore **REAL USER PASS / ACCEPTED**. Phase9 Slice12 is complete.

## Safety

```text
Safety pre              safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914
Safety pre-PR           safety/post-build93-prepr-20260815-1921
Safety pre-PR final     safety/post-build93-prepr-final-20260815-1923
Safety green pre-merge  safety/post-build93-green-premerge-20260815-1931
Runtime PR              #162
Exact tested head       fcbe4c59a3a364d9665eba2ed432f37475116364
Historical CI #457      31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458      31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Final validation        31898542379 · SUCCESS
Runtime merge           6c1ceb7d59971ec6c7e251532054392f02c08157
Runtime Pages           31898639778 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build93-deployed-candidate-20260815-1936
Candidate docs PR       #163
Candidate docs CI       31899284370 · SUCCESS
Candidate docs merge    6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages    31899342536 · SUCCESS · exact docs merge SHA
Safety post-acceptance  safety/post-build93-real-user-pass-20260815-2010
Acceptance docs PR      PENDING
Acceptance docs CI      PENDING
Acceptance docs merge   PENDING
Acceptance docs Pages   PENDING
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
Real-user smoke         BUILD93 PASS MADAFAKA · 2026-08-15
Build94                 UNALLOCATED
```

## Next boundary

Build94 remains **UNALLOCATED** until this acceptance-docs closeout is fully merged/deployed and a fresh read-only post-Build93 Phase9 audit proves the smallest coherent next reliability gap. Album create, Album binary upload and degraded/offline/PWA remain candidates, not commitments.
