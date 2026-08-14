# PHASE 8 — Slice 2 Health Drill-down audit

Date: 2026-08-14  
Status: **BUILD75 RUNTIME CANDIDATE — GLOBAL HEALTH → EXISTING WORKFLOW**

Accepted base:

```text
Studio                 v0.19.3 · Build74 · REAL USER PASS
main                   2b9fb1fec8da4dc7be467fe647162ab147341799
Safety pre             safety/pre-phase8-health-drilldown-build75-20260814-1946
Feature branch         agent/phase8-health-drilldown-build75
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
TM Worker Version ID   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker          v2.7 · unchanged
R2 migration           NONE
```

## Audit finding

Build74 correctly established global Content Health truth, but its actionable signal model stores only:

```text
affected tracks
→ actionFor(affected[0])
```

Home therefore exposes the correct aggregate count (`Cover missing = N`, `SonicTrace gap = N`, etc.) while its action opens only the first affected Track.

That is a real Phase8 gap: the dashboard knows the global problem but cannot take the artist from that global signal to the complete affected set.

The existing Phase7 Workflow page already owns the detailed searchable/filterable queue and already renders each Track's accepted stages plus `workflow.nextAction`. C3-B already owns sonic-map/catalog-intelligence relationships. Creating another list or another priority engine would duplicate accepted capability.

## Build75 bounded scope

### 1. One shared health predicate authority

`src/content-health.ts` exports a bounded `CatalogHealthDrilldownId` and one shared `catalogHealthDrilldownMatches()` implementation for:

```text
Master audio missing
Cover missing
Lyrics source missing
Lyrics timing needed
SonicTrace missing/outdated
Release blockers
Published with production gaps
Production-ready Drafts
```

Home counters and Workflow filtering therefore use the same issue definitions.

### 2. Bounded route contract

Health drill-down routes are allowlisted only:

```text
#/workflow/health/audio
#/workflow/health/cover
#/workflow/health/lyricsTxt
#/workflow/health/syncedLyrics
#/workflow/health/sonicTrace
#/workflow/health/releaseQuality
#/workflow/health/publishedProductionGaps
#/workflow/health/productionReadyDrafts
```

Unknown values resolve to no health filter.

### 3. Home → existing Workflow

Every non-zero Content Health signal now opens the existing Workflow queue filtered to the complete affected set.

The two production/publication cross-axis counters become drill-downs too:

- published with production gaps;
- production-ready Drafts.

No second queue is created on Home.

### 4. Workflow keeps authority

The health filter is only an additional read predicate over the existing Workflow list. Every row retains:

- the accepted Phase7 stages;
- the accepted stage ordering;
- the existing `workflow.nextAction`;
- the existing workspace deep-link.

Search and the existing Queue selector can further narrow the health result. Clearing the health filter returns to the normal attention queue.

### 5. Shell truth correction discovered by audit

The accepted backend is Track Manager v5.22 / bridge v1.12 and the accepted program is now Phase8, but `App.tsx` still carried fallback presentation text for TM v5.21 / bridge v1.11 and a `PHASE 7-C` sidebar tag.

Build75 corrects only those read-only labels/fallbacks:

```text
PHASE 8
Track Manager v5.22 · bridge v1.12
```

No backend behavior changes.

## Explicit non-scope

Build75 does **not**:

- add another dashboard;
- add another Workflow/priority engine;
- alter `workflow.nextAction`;
- add a generic write API;
- alter Track Manager;
- deploy an admin/public Worker;
- mutate or migrate R2;
- change Album authority;
- change Lyrics authority;
- change SonicTrace save authority;
- auto-publish Tracks;
- make Release Campaign canonical;
- duplicate the C3-B sonic map, families, neighbors, redundancy or outlier intelligence.

## Validation contract

Build75 adds `scripts/test-phase8-health-drilldown-build75.mjs` and extends `check:phase8` after the accepted Build74 guard.

The Build75 guard proves:

- exact Build75 identity and Build74 ancestry;
- all eight drill-down IDs are shared between health engine and router allowlist;
- Home uses Workflow drill-down links for all signals and both axes;
- Workflow uses the shared health predicate and keeps existing Next Actions;
- hash changes correctly set/clear the health filter;
- Phase8 shell / TM v5.22 bridge v1.12 fallback truth is current;
- no Phase8 save/write surface is introduced.

## Acceptance gate

Build74 remains the accepted runtime until Build75 completes:

```text
exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser smoke
→ only then REAL USER PASS
```

**CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS.**
