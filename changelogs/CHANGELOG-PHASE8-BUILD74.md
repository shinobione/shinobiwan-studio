# SHINOBIWAN Studio v0.19.3 · Build 74

Codename: `studio-focus-slice4-phase8-content-health-truth`  
Date: 2026-08-14  
Status: **CANDIDATE — PHASE 8 SLICE 1 / CONTENT HEALTH TRUTH**

## Scope

Build74 is the first genuine Phase8 runtime slice after Phase7-C program completion on accepted Build73.

It repairs two production-health truth mismatches and adds one compact read-only global health surface on Home.

### Per-track readiness truth

```text
old
Cover          10
Canvas/Video   10   ← incorrectly penalized optional Canvas

Build74
Audio          20
Cover          20   ← required Core Media asset
Identity       20
Lyrics TXT     10
Lyrics timing  10
SonicTrace     20
Canvas          0   ← optional / not an attention item
```

### Production/publication separation

Home no longer derives `PRODUCTION COMPLETE` from full workflow completion, because full workflow completion includes the Release/publication stage.

A production-ready Draft can now truthfully appear as:

```text
Production complete  YES
Draft                YES
Next Action          Publish track
```

without contradiction.

### Global Content Health

Home gains a compact Phase8 panel for:

- missing master audio;
- missing required cover;
- missing canonical lyrics source;
- lyrics timing needed;
- SonicTrace missing/outdated;
- Track Manager Release blockers;
- published Tracks with production gaps;
- production-ready Drafts.

The panel is read-only. Its actions point to each affected Track's existing `workflow.nextAction`; it does not introduce another priority model or another write surface.

### Action wording

Home preserves the accepted operation intent:

- explicit publish remains `Publish track`;
- Release quality failures present as `Fix release blockers`;
- Identity remains the artist-friendly `Fix track details`.

## Safety / architecture

```text
Accepted base          Build73 REAL USER PASS
Base main              39585dfa057dc024f8bf28140a604b78b325d956
Safety pre             safety/pre-phase8-content-health-build74-20260814-1810
Feature branch         agent/phase8-content-health-build74
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
Public Worker          v2.7 · unchanged
R2 migration           NONE
New write authority    NONE
```

No Track Manager/Worker deploy is required by this slice.

## Validation

`check:phase8` is added to the normal Studio build and asserts the Build74 identity, optional-Canvas rule, production/publication separation, signal set, existing Next Action reuse and absence of Phase8 write paths.

## Acceptance gate

```text
exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser smoke
→ only then REAL USER PASS
```

**Build73 remains the current accepted runtime until the final browser smoke passes.**