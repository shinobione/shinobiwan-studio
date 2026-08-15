# SHINOBIWAN Studio — Build93

Date: 2026-08-15  
Version: `v0.19.15`  
Build: `93`  
Codename: `studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth`  
Status: **IMPLEMENTED CANDIDATE · CI PENDING**

## Fresh-audit decision

The fresh post-Build92 read-only audit rechecked Album asset upload response-loss truth, Album create response-loss truth, degraded/offline/PWA resilience, and smaller remaining reliability gaps.

Album binary upload remains causality-heavy because the browser upload request still has no persisted operation identifier or exact client-side digest/ETag contract that can prove the selected bytes after a lost response. Album create remains causality-weak because absent→present does not uniquely attribute creation to one lost POST without a persisted operation identifier. PWA/offline remains cross-cutting.

The smaller proven gap was canonical Track metadata **validation**. `metadata-validate-v1` is non-mutating and already has a finite 7-second timeout, but the visible Validate flow and Build92 fresh pre-save validation could still fail after a single transient timeout/transport/HTTP interruption. Plain transport interruption was also still surfaced with misleading Cloudflare Access guidance.

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
├─ timeout                         → retry once max
├─ transport interruption          → retry once max
├─ HTTP 408/425/429/500/502/503/504 → retry once max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal → NO RETRY
└─ success                         → return reviewed proposal

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

## Safety

```text
Safety pre              safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914
Safety pre-PR           safety/post-build93-prepr-20260815-1921
Base accepted main      30f846df9185935a5b8d2d5e466b551c83079879
Implementation head     cf0c9f1be37a435a8bffcf37134283ae41d24f05
Worker deploy           NONE planned
Track Manager change    NONE
R2 migration/write      NONE caused by implementation
```

CI, merge, Pages and real-user acceptance remain separate future states.
