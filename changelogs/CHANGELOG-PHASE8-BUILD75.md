# SHINOBIWAN Studio v0.19.3 · Build 75

Codename: `studio-focus-slice4-phase8-health-drilldown`  
Date: 2026-08-14  
Status: **MERGED + DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

## Why this build exists

Build74 made global Content Health truthful, but aggregate signal cards only exposed the first affected Track as an action target.

Build75 makes every non-zero health count fully actionable without creating another queue or another priority engine:

```text
Home Content Health signal
→ bounded health drill-down route
→ existing Workflow queue filtered to all affected Tracks
→ existing stages + existing workflow.nextAction
→ existing Track Workspace action
```

The two production/publication cross-axis counters gain the same drill-down behavior:

- Published with production gaps;
- Production-ready Drafts.

## Shared health authority

One `catalogHealthDrilldownMatches()` implementation now owns the eight supported issue predicates:

```text
audio
cover
lyricsTxt
syncedLyrics
sonicTrace
releaseQuality
publishedProductionGaps
productionReadyDrafts
```

The router uses a strict allowlist for the same IDs. Unknown health routes do not create arbitrary filters.

## Workflow behavior

The existing Workflow page remains the sole detailed production queue.

A Phase8 health drill-down:

- starts on Queue = All so the health issue itself defines the initial affected set;
- can still be narrowed with the existing Queue selector and search;
- keeps the accepted Phase7 stage rail;
- keeps the accepted `workflow.nextAction` for each Track;
- can be cleared back to the normal Needs Attention queue;
- performs no writes.

## Shell truth correction

The audit also found two stale read-only labels inherited from older runtime lineage:

```text
old fallback    Track Manager v5.21 · bridge v1.11
accepted        Track Manager v5.22 · bridge v1.12

old sidebar     PHASE 7-C
current         PHASE 8
```

Build75 aligns those labels only; no backend changes.

## Safety / architecture

```text
Accepted base          Build74 REAL USER PASS
Base main              2b9fb1fec8da4dc7be467fe647162ab147341799
Safety pre             safety/pre-phase8-health-drilldown-build75-20260814-1946
Feature branch         agent/phase8-health-drilldown-build75
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
TM Worker Version ID   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker          v2.7 · unchanged
R2 migration           NONE
New write authority    NONE
```

No Track Manager/Worker deployment is required by this slice.

## Validation / deployment receipts

`check:phase8` preserves the accepted Build74 Content Health guard and adds the Build75 health-drill-down guard.

```text
PR                       #110
Initial candidate head   d7af7700c652f11a42c36d6aa0495649e92a9eb1
Initial CI               31826089546 · FAILURE
Failure                  historical Phase7 guard required the literal read-only boundary copy
Corrected runtime head   fa09c903d122c1e33440335e5c1c691c7c7c698d
Corrected CI             31826190402 · SUCCESS
Final tested head        e0cbc92b7d42de2354201da525852c5efe4c6d20
Final exact-head CI      31826276973 · SUCCESS
Anti-drift main          2b9fb1fec8da4dc7be467fe647162ab147341799
Runtime merge            e6c2649583446087d0d256b48e556e9c6e93ede9
Pages                    31826452231 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build75-deployed-candidate-20260814-1959
```

The initial red run did not expose a runtime/type/backend fault. The Phase7 guard correctly caught removal of its explicit historical read-only sentence. Build75 restored that sentence and appended the Phase8 filtering explanation rather than weakening the inherited guard.

## Acceptance gate

Completed:

```text
exact-head CI            ✅
anti-drift main          ✅
exact tested-head merge  ✅
exact merge-SHA Pages    ✅
```

Still required:

```text
real-user browser smoke  ⏳
→ only then REAL USER PASS
```

**Build74 remains the current accepted runtime until the final Build75 browser smoke passes.**
