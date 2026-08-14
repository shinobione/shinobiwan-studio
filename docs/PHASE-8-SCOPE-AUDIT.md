# PHASE 8 — Slice 1 scope audit

Date: 2026-08-14  
Status: **COMPLETE — BUILD74 REAL USER PASS / CONTENT HEALTH TRUTH**

Phase 7-C is program-complete on accepted Studio Build73. Build74 is the first genuine Phase8 runtime scope and is now accepted after the full exact-head/deployment/browser gate.

Safety checkpoints:

```text
pre-runtime       safety/pre-phase8-content-health-build74-20260814-1810
post-deploy       safety/post-build74-deployed-candidate-20260814-1827
post-RUP          safety/post-build74-real-user-pass-20260814-1926
```

Runtime branch / receipts:

```text
feature branch    agent/phase8-content-health-build74
PR                #108
exact tested head da7b5498dd8e1f6120c346e07fe1b1e741d40104
validation        31819203565 · SUCCESS
runtime merge     c95e33bcb0c33b18fc8e6e9a35a05ec28ad142a9
Pages             31819333501 · SUCCESS · exact merge SHA
real-user smoke   BUILD74 PASS · 2026-08-14
```

## Why Build74 exists

The post-Phase7-C audit found a real contract drift in the existing `src/content-health.ts` engine:

```text
Build73 accepted truth:   Cover required · Canvas optional
old content-health score: Cover 10 · Canvas/Video 10
```

That meant Track Workspace could correctly show `Visuals ✓ · Cover ready · Canvas optional` while its overall readiness score still lost 10 points because Canvas was absent.

A second truth mismatch also remained on Home: `PRODUCTION COMPLETE` was derived from full `workflow.ready`, which includes the Release/publication stage. A production-ready Draft could therefore be counted as not production-complete merely because publication was intentionally still pending.

These were genuine Phase8 Content Health problems: global/readiness presentation was not fully aligned with the accepted production model.

## Accepted Build74 scope

### 1. Unified per-track production readiness

The accepted 100-point production health model is:

```text
Identity      20
Core media    40  = Audio 20 + required Cover 20
Lyrics        20  = canonical lyrics.txt 10 + synchronization 10
Intelligence  20  = current SonicTrace
-----------------------------------------------
Production   100
```

Canvas contributes **0** points and creates **0** attention items because it is optional.

Identity health mirrors the accepted Phase7 workflow prerequisites:

- title;
- type;
- status;
- Album/release binding;
- valid year when present.

Genres, languages and release-date completeness remain useful metadata/quality concerns but do not independently redefine the Phase7 Identity stage.

### 2. Production and publication are separate on Home

The accepted summary keeps the established vocabulary:

```text
NEEDS ATTENTION
PRODUCTION COMPLETE
PUBLISHED
DRAFTS
```

`NEEDS ATTENTION` and `PRODUCTION COMPLETE` now use production truth only. `PUBLISHED` and `DRAFTS` remain the separate publication axis.

A production-ready Draft therefore remains production-complete while still waiting for the explicit Publish action.

### 3. Compact global Content Health on Home

No new top-level page or duplicate Workflow queue was introduced.

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

### 4. Home Next Action vocabulary truth

Home preserves explicit accepted actions:

- `Publish track` remains `Publish track`;
- Release quality failure becomes `Fix release blockers` rather than generic `Fix track details`;
- Identity remains the artist-friendly `Fix track details`;
- the production step label is `Sonic`, not the obsolete `Sound` wording.

## Explicit non-scope — preserved

Build74 did **not**:

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

Cross-stack remains:

```text
Track Manager       v5.22 · unchanged
Studio bridge       v1.12 · unchanged
TM Worker Version   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker       v2.7 · unchanged
R2 migration        NONE
```

## Validation guard

Build74 added `scripts/test-phase8-content-health-build74.mjs` and wired `check:phase8` into the normal Studio build.

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

The final exact tested head also passed all inherited Phase6, C3, UX, Phase7 and Studio Focus guards plus typecheck/build.

## Acceptance result

```text
exact-head CI             PASS
anti-drift main           PASS
exact tested-head merge   PASS
exact merge-SHA Pages     PASS
real-user browser smoke   PASS
```

**Build74 = REAL USER PASS / Phase8 Slice1 closed.**

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains the acceptance policy for every later runtime slice.
