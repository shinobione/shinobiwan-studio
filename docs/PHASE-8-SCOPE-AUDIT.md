# PHASE 8 — Scope audit seed

Date: 2026-08-14  
Status: **PLANNING ONLY — RUNTIME NOT STARTED**

Phase 7-C is program-complete on accepted Studio Build73. `Build74` remains unused.

This seed records the boundary for the next fresh audit; it does **not** authorize or implement Build74 by itself.

## Phase 8 direction

**Dashboard Intelligence & Content Health**

The goal is a global actionable health layer on top of the accepted production/workflow model.

It must not duplicate the existing C3-B SonicTrace catalog map and must not create a second workflow priority model.

Candidate read-only signals:

```text
missing canonical audio
missing required cover
missing canonical lyrics.txt
lyrics timing missing
SonicTrace missing
SonicTrace outdated
canonical release quality blockers
published but production-incomplete
Draft but production-ready
```

Every actionable signal should route back to the existing Track `workflow.nextAction` / canonical workspace section.

## Frozen constraints

- Build73 remains the accepted baseline until a future Build74 passes the full runtime gate.
- Build74 remains unused at this planning point.
- production and publication remain separate axes.
- existing `buildTrackWorkflow` / `workflow.nextAction` remains action priority authority.
- existing C3-B Catalog Intelligence remains the sonic-analysis/map authority.
- no new generic write surface.
- no Worker, Track Manager or R2 mutation is assumed.
- public fallback remains read-only.
- any Phase8 runtime must start from a fresh safety branch and dedicated feature branch after this audit is finalized.

## Runtime gate when Phase8 actually starts

```text
fresh safety checkpoint
→ Build74 feature branch
→ exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser smoke
→ only then REAL USER PASS
```
