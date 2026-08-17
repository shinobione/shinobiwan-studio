# Phase9 · Build103 — canonical audio download transient retry truth

Date: 2026-08-17
Studio candidate: `v0.19.25 · Build103`
Codename: `studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth`

## Fresh post-Build102 audit

The post-Build102 audit first reconciled real cross-stack GitHub truth: Public Worker v2.8 had already closed the parent-Album publication-projection gap, so that item was removed from Studio Build103 candidates before any runtime allocation.

The remaining heavier gaps were re-read rather than selected from memory:

- Album create lost-response causality still lacks durable operation identity;
- exact binary-upload byte proof still needs a trustworthy digest contract across client/backend/object storage;
- Track create/upload causality has the same operation-identity problem;
- degraded/offline behavior is cross-cutting;
- retrying the long-running Deep Audio compute POST itself can duplicate expensive GPU work if the client loses the response while the coordinator continues processing.

A smaller independently reversible seam exists immediately before Deep Audio compute: Studio first downloads canonical audio with a non-mutating GET. That download had a 180-second timeout but **zero transient retry**, so a momentary transport interruption or transient HTTP response aborted the entire analysis before any expensive compute had begun.

## Build103 boundary

Build103 changes only the canonical-audio download stage used by SonicTrace analysis.

```text
canonical audio GET attempt 1
├─ timeout / browser transport interruption
│    → one retry max
├─ HTTP 408/425/429/500/502/503/504
│    → one retry max
├─ 401/403 Access response
│    → NO RETRY
├─ deterministic ordinary HTTP failure
│    → NO RETRY
├─ empty/invalid successful response
│    → NO RETRY
└─ valid non-empty Blob
     → continue to Browser DSP / Deep Audio

attempt 2 transient failure
→ surface error immediately
→ Deep Audio POST has NOT been submitted
```

Maximum canonical-audio GET attempts: **2**.

## Critical expensive-compute boundary

`POST /api/studio/analyze` remains **zero automatic retries**.

Build103 must never generalize the safe pre-compute GET retry into a retry of the long-running coordinator analysis request. A timeout or transport loss after Deep Audio POST submission still produces the existing Browser-DSP fallback/review semantics rather than blindly submitting a second expensive GPU analysis.

## Non-scope

- no SonicTrace coordinator/backend change;
- no Track Manager/admin Worker change;
- no Public Worker change;
- no R2 schema/data migration;
- no canonical SonicTrace save behavior change;
- no automatic retry of `POST /api/studio/analyze`;
- no automatic retry of any canonical write;
- no PWA/offline redesign;
- no UI/layout refactor.

## Acceptance plan

Automated acceptance must prove exact release identity, the transient status allowlist, maximum two canonical-audio attempts, deterministic/non-transient exclusions, and zero automatic Deep Audio POST retries.

After exact-head CI and Pages deployment, human smoke should be a **normal successful SonicTrace analysis** on an existing safe Track with canonical audio. No network cut or manufactured transient failure is required. No R2 save is required for this read/compute-boundary slice.
