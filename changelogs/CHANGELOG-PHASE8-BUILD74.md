# SHINOBIWAN Studio v0.19.3 · Build 74

Codename: `studio-focus-slice4-phase8-content-health-truth`  
Date: 2026-08-14  
Status: **COMPLETE — PHASE 8 SLICE 1 / REAL USER PASS**

## Acceptance

Build74 is the first genuine Phase8 runtime slice after Phase7-C program completion on accepted Build73.

Real-user browser smoke passed on 2026-08-14. Build74 is therefore the **current accepted Studio runtime**.

Exact acceptance receipts:

```text
Accepted base          Build73 REAL USER PASS
Base main              39585dfa057dc024f8bf28140a604b78b325d956
Safety pre             safety/pre-phase8-content-health-build74-20260814-1810
Feature branch         agent/phase8-content-health-build74
Studio PR              #108
Exact tested head      da7b5498dd8e1f6120c346e07fe1b1e741d40104
Validation run         31819203565 · SUCCESS
Runtime merge          c95e33bcb0c33b18fc8e6e9a35a05ec28ad142a9
Pages deploy run       31819333501 · SUCCESS · exact merge SHA
Safety post-deploy     safety/post-build74-deployed-candidate-20260814-1827
Real-user smoke        BUILD74 PASS · 2026-08-14
Safety post-RUP        safety/post-build74-real-user-pass-20260814-1926
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` was preserved throughout the gate. Historical red CI attempts were guard-discovery only and were never merged.

## Scope delivered

Build74 repairs two production-health truth mismatches and adds one compact read-only global health surface on Home.

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

Canvas is therefore fully optional in production-health scoring, matching the accepted Build73 status truth.

### Production/publication separation

Home no longer derives `PRODUCTION COMPLETE` from full workflow completion, because full workflow completion includes the Release/publication stage.

A production-ready Draft can truthfully appear as:

```text
Production complete  YES
Draft                YES
Next Action          Publish track
```

without contradiction.

The accepted Home terminology remains:

```text
NEEDS ATTENTION
PRODUCTION COMPLETE
PUBLISHED
DRAFTS
```

but the production counts now reflect production truth independently from publication.

### Global Content Health

Home now exposes a compact Phase8 panel for:

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

Home preserves operation intent:

- explicit publish remains `Publish track`;
- Release quality failures present as `Fix release blockers`;
- Identity remains the artist-friendly `Fix track details`;
- production step vocabulary uses `Sonic`, not the obsolete `Sound` label.

## Safety / architecture

```text
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
TM admin Worker        df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker          v2.7 · unchanged
R2 migration           NONE
New write authority    NONE
```

No Track Manager/Worker deployment was required by this slice. No deployment-time or Phase8-specific R2 mutation occurred.

## Validation coverage

`check:phase8` is part of the normal Studio build and asserts:

- Build74 release identity;
- optional-Canvas rule;
- production/publication separation;
- Phase8 signal set;
- reuse of the existing Next Action authority;
- absence of Phase8 write paths.

The final exact tested head also passed all inherited Phase6, C3, UX, Phase7 and Studio Focus guards plus typecheck/build.

## Result

**Build74 = REAL USER PASS / current accepted Studio runtime.**

Phase8 Slice1 is closed. Any next runtime build must start from the accepted Build74 baseline under a fresh bounded Phase8 sub-scope, with a new safety checkpoint and the full exact-head → deployment → real-user gate.