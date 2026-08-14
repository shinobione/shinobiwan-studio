# SHINOBIWAN Studio v0.19.3 · Build 77

Codename: `studio-focus-slice4-phase8-album-health-visual-polish`  
Date: 2026-08-14  
Status: **CANDIDATE — BUILD76 VISUAL CORRECTIVE**

## Why Build77 exists

Build76 proved the Phase8 Album Health functional contract, merged and deployed successfully, but the real-user browser review rejected its presentation as **not visually convincing**.

The uploaded smoke video showed concrete UX defects:

- two-column grid cards stretching to the height of their tallest row sibling;
- large empty card areas for releases with only one issue;
- weak Album identity because covers and canonical palette were absent from Album Health;
- generic dashboard-like KPI hierarchy;
- issue-count pills visually competing with Album titles;
- repeated per-track `Continue Intelligence →` rows creating a mechanical table feel;
- long Albums with many production gaps dominating the entire page.

Build76 is therefore **NOT REAL USER PASS**. Build75 remains the accepted baseline until Build77 passes browser smoke.

## Build77 visual corrective

Build77 preserves the Build76 truth engine and changes only presentation/visual read composition.

### Release identity

Each Album Health card now reuses:

- existing Album artwork projection;
- canonical `accent` / `accent2` palette;
- Album type/status metadata;
- canonical Track count;
- the same Build76 health state.

### Compact hierarchy

- the giant marketing-style Build76 hero is replaced by a compact `Album Health` heading;
- generic KPI cards become one compact four-cell summary ribbon;
- cards use actual release artwork and palette glow;
- card grid uses `align-items:start` so short cards are no longer stretched to tall siblings;
- manifest problems become compact issue chips plus details only when needed.

### Production-gap progressive disclosure

Album Health shows at most three Track Next Actions by default.

Additional actions stay inside a native `<details>` disclosure. This keeps large Albums useful without turning the page into a long diagnostic table.

The Track action itself remains the existing accepted Next Action (`trackHref(action.trackId, action.section)`). Build77 does not invent another workflow.

## Authority / safety unchanged

```text
Album membership/order authority  album.trackIds
Track-side album                  compatibility cache only
Album writes                      AlbumsWorkspace → Track Manager
Album Health                      read-only
Track production truth            existing Phase7/Build74 model
Sonic project intelligence        existing C3-B Intelligence
Automatic repair                  NONE
New writer                        NONE
Worker/backend change             NONE
R2 mutation/migration             NONE
```

Reduced-motion protection is retained for the new card/action motion.

## Safety receipts

```text
Accepted baseline        Build75 REAL USER PASS
Build76                  merged/deployed functional candidate · NOT RUP
Base main                39924cc4f176f2cd70254166bd16f6f9db6f5865
Safety pre               safety/pre-build77-album-health-visual-polish-20260814-2211
Feature                   agent/build77-album-health-visual-polish
PR                        #115
Initial runtime head      1c7131d3b048d5ba7cd05d995abd25f19794f26e
Initial runtime CI        31837328072 · SUCCESS
Track Manager             v5.22 · unchanged
Studio bridge             v1.12 · unchanged
TM Worker Version ID      df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker             v2.7 · unchanged
```

A fresh exact-head CI is required after this candidate changelog commit before any merge.

## Acceptance gate

```text
final exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser visual smoke
→ only then REAL USER PASS
```
