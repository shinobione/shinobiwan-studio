# PHASE 8 — Slice 1 scope audit

Date: 2026-08-14  
Status: **BUILD74 RUNTIME CANDIDATE — CONTENT HEALTH TRUTH**

Phase 7-C is program-complete on accepted Studio Build73. Build74 is the first genuine Phase8 runtime scope.

Safety checkpoint:

```text
safety/pre-phase8-content-health-build74-20260814-1810
```

Feature branch:

```text
agent/phase8-content-health-build74
```

## Why Build74 exists

The post-Phase7-C audit found a real contract drift in the existing `src/content-health.ts` engine:

```text
Build73 accepted truth:   Cover required · Canvas optional
old content-health score: Cover 10 · Canvas/Video 10
```

That meant Track Workspace could correctly show `Visuals ✓ · Cover ready · Canvas optional` while its overall readiness score still lost 10 points because Canvas was absent.

A second truth mismatch also remained on Home: `PRODUCTION COMPLETE` was derived from full `workflow.ready`, which includes the Release/publication stage. A production-ready Draft could therefore be counted as not production-complete merely because publication was intentionally still pending.

These are genuine Phase8 Content Health problems: global/readiness presentation was not fully aligned with the accepted production model.

## Build74 bounded runtime scope

### 1. Unify per-track production readiness

The 100-point production health model becomes:

```text
Identity      20
Core media    40  = Audio 20 + required Cover 20
Lyrics        20  = canonical lyrics.txt 10 + synchronization 10
Intelligence  20  = current SonicTrace
-----------------------------------------------
Production   100
```

Canvas contributes **0** points and creates **0** attention items because it is optional.

Identity health now mirrors the accepted Phase7 workflow prerequisites instead of the older metadata wish-list:

- title;
- type;
- status;
- Album/release binding;
- valid year when present.

Genres, languages and release-date completeness remain useful metadata/quality concerns but do not independently redefine the Phase7 Identity stage.

### 2. Separate production from publication on Home

Home summary becomes explicit:

```text
PRODUCTION ATTENTION
PRODUCTION COMPLETE
PUBLISHED
DRAFTS
```

`PRODUCTION COMPLETE` uses only the accepted non-Release stages. A production-ready Draft therefore remains production-complete while still waiting for the separate explicit Publish action.

### 3. Add compact global Content Health on Home

No new top-level page or duplicate Workflow queue is introduced.

Read-only signals:

```text
Master audio missing
Cover missing
Lyrics source missing
Lyrics timing needed
SonicTrace missing/outdated
Track Manager Release blockers
```

Two cross-axis indicators are also shown:

```text
Published with production gaps
Production-ready Drafts
```

Each actionable signal links to the affected Track's **existing `workflow.nextAction`**. Phase8 does not invent a second priority model.

### 4. Fix Home Next Action vocabulary drift

Home now preserves explicit accepted actions that were previously collapsed by presentation logic:

- `Publish track` remains `Publish track`;
- Release quality failure becomes `Fix release blockers` rather than generic `Fix track details`;
- Identity still presents as the artist-friendly `Fix track details`.

## Explicit non-scope

Build74 does **not**:

- add a generic write API;
- alter Track Manager;
- deploy an admin/public Worker;
- mutate or migrate R2;
- change Album authority;
- change Lyrics authority;
- change SonicTrace save authority;
- auto-publish a Track;
- make Release Campaign canonical;
- add a second Workflow/priority engine;
- duplicate the C3-B SonicTrace map.

## Validation guard

Build74 adds `scripts/test-phase8-content-health-build74.mjs` and wires `check:phase8` into the normal Studio build.

The guard asserts:

- Build74 exact identity/codename and Build73 ancestry;
- no Canvas/Video scored health item;
- required Cover carries the removed optional-Canvas weight;
- production completion excludes Release/publication;
- all Phase8 signals exist;
- actions reuse `item.nextAction`;
- Home shows separate production/publication summaries;
- no Phase8 `saveTrack`/fetch mutation surface;
- Phase8 styling is explicitly loaded.

## Acceptance gate

Build73 remains the accepted runtime until Build74 completes:

```text
exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser smoke
→ only then REAL USER PASS
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.
