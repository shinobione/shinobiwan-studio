# SHINOBIWAN Studio — PHASE UX

Date opened: `2026-08-09`

Status: **AUTHORIZED — UX-1 IMPLEMENTED / LOCAL VALIDATION GREEN**

Phase 7: **NOT AUTHORIZED — ABSOLUTE STOP**

## Scope

PHASE UX transforms Studio's frontend into a calm, premium and understandable production cockpit while preserving the Phase 4/5/6 engines and contracts.

Primary repository: `shinobione/shinobiwan-studio`

Design reference: `shinobione/LaunchPAD-APP`

Frozen providers:

- Track Manager v5.15 / Studio bridge v1.7;
- public media Worker v2.6;
- LRC Maker 6.3.5;
- SonicTrace Phase 5 runtime and persistence;
- manifest schema v1 and canonical R2 layout.

## Non-goals

- no backend route or schema change;
- no Worker deployment;
- no R2 or production catalog mutation for testing;
- no LRC synchronization mechanics change;
- no SonicTrace schema/math change;
- no removal of Track Manager, LRC Maker or SonicTrace fallbacks;
- no Phase 7 implementation or preparation.

## Verified baseline

| Repository | Production branch | Verified HEAD |
|---|---|---|
| Studio | `main` | `5819914cd8db14f344754a02fe9cb966729b3b61` |
| LaunchPAD-APP | `main` | `0e508c893c038059da4a563365dbdba7094b638d` |
| LRC Maker | `master` | `3d7f65fbe023e6ac26f3ba93fdcc98a135023a98` |
| SonicTrace | `main` | `2a7f195298b8842d6bdb11ea63a11855c292a354` |

All four repositories were clean and synchronized with their upstream branches before PHASE UX work began.

## Safety and development references

- immutable Phase 6 checkpoint: `safety/phase6-complete-20260809-0513`;
- immutable post-hardening checkpoint: `safety/post-phase6-hardening-complete-20260809-1409`;
- PHASE UX pre-change checkpoint: `safety/pre-phase-ux-20260809-1426`;
- UX-1 development branch: `codex/phase-ux-foundation`.

## Information architecture decision

### Global Studio navigation

- Dashboard
- Catalog
- Intelligence
- Administration/System status as a separated utility destination

Lyrics, Assets and Publishing are removed from primary global navigation because their real actions require track context.

### Track-local navigation

- Overview
- Metadata
- Assets
- Lyrics
- SonicTrace

Publishing state is summarized in Overview/Metadata. Version/source diagnostics remain secondary and do not compete with production work.

## Design-system decision

Studio owns its design tokens and components. LaunchPAD is a reference, not a runtime CSS dependency.

Token families:

- deep navy/ink backgrounds;
- translucent glass surfaces;
- subtle neutral and cyan/violet borders;
- cyan-to-violet accent gradient;
- semantic success/warning/danger colors;
- 4/8/12/16/24/32 spacing rhythm;
- 10/14/18/24 radius scale;
- 42 px standard controls and buttons;
- visible focus ring;
- fast 160–220 ms transitions;
- reduced-motion fallback.

Initial shared primitives remain intentionally small: Button-compatible variants, Panel/Card, Badge/StatusPill, PageHeader, SectionHeader, ActionBar and Empty/Notice states.

## Delivery slices

### UX-1 — Foundation

Version target: Studio `0.10.0` / Build `22` / `phase-ux-foundation`

- centralized tokens and control geometry;
- redesigned app shell;
- simplified global navigation;
- calmer Dashboard hierarchy;
- track-local navigation normalization;
- responsive/mobile navigation foundation;
- navigation, release and no-Phase-7 regression guards.

### UX-2 — Catalog and Track Intake

- catalog-first hierarchy and obvious `+ New Track` CTA;
- progressive 2–3 step intake using existing protected routes;
- hidden/generated slug by default;
- inspect the current Track Manager and LaunchPAD cover-color extraction before implementation;
- reuse the existing canonical two-color palette field names, extraction behavior and persistence contract without introducing Studio-only fields or a second source of truth;
- automatically extract a two-color preview when a new cover is selected, render both swatches with their canonical names and values, and expose an explicit recalculate action;
- include the palette in Media and Review only where it improves clarity;
- never silently overwrite an existing track palette when its cover is replaced; an existing palette changes only after an explicit recalculation/update action;
- persist through existing Track Manager/manifest routes only; stop for authorization if the current backend cannot support the canonical palette without a new route;
- verified redirect into the new Track Workspace;
- no new bulk mutation.

#### UX-2 Cover Palette acceptance contract

This addendum is part of PHASE UX and is not Phase 7.

Before UX-2 code changes, confirm from current LaunchPAD/Track Manager source:

- the two canonical manifest field names;
- the existing browser extraction algorithm and fallbacks;
- how Track Manager previews, applies and persists those fields;
- how LaunchPAD consumes the colors.

Regression coverage must prove:

1. a valid selected cover produces two colors;
2. both detected colors and their actual values are visibly rendered;
3. cover replacement on an existing track does not silently overwrite the saved palette;
4. explicit recalculation updates the preview;
5. Studio uses exactly the same canonical palette contract as Track Manager and LaunchPAD.

Assets/Cover and Track Workspace may display the two saved colors when this adds useful context without clutter. No separate palette model, Studio-only palette field, route, storage layer or source of truth is authorized.

### UX-3 — Track Workspace

- compact persistent track context;
- Overview focused on readiness and next actions;
- five primary local tools;
- technical source/version information moved to secondary diagnostics.

### UX-4 — Module polish

- Metadata form hierarchy and action bars;
- Assets media-management cards;
- Lyrics container and plain-editor progressive disclosure;
- SonicTrace action/result hierarchy;
- no engine or persistence changes.

### UX-5 — Intelligence, responsive and accessibility closeout

- Catalog Intelligence presentation;
- final responsive validation at desktop, laptop, tablet and mobile;
- focus, labels, reduced motion and overflow guards;
- documentation, production smoke and final checkpoint.

## Validation record

The pre-change visual audit covered Dashboard, Catalog and Track Workspace at `1366×900` and `390×844`. No horizontal document overflow was observed. Excessive Catalog height and navigation density were confirmed and recorded in `docs/PHASE-UX-AUDIT.md`.

UX-1 local validation:

- integration contracts: PASS;
- Phase 5 algorithms: PASS;
- Phase 6 Lyrics integration: PASS;
- PHASE UX foundation guard: PASS;
- TypeScript typecheck: PASS;
- Vite production build: PASS;
- rendered Dashboard and Track Workspace at `1920×1080`, `1366×900`, `768×1024` and `390×844`;
- no horizontal document overflow at the four representative widths;
- no browser console warning/error during the rendered UX-1 smoke;
- mobile primary navigation exposes readable labels and three destinations;
- standard hero actions compute to the shared 42 px minimum height.

CI, PR, merge, deploy and smoke records will be appended per slice. Static Studio Pages deployment remains separate from Worker deployment. No Worker deployment is authorized for PHASE UX.

## Stop conditions

Stop before any backend/schema/Worker/R2 change, destructive migration, lyrics contract change, trackId change, major fallback removal or Phase 7 work.

At the end of PHASE UX: **STOP and wait for explicit Phase 7 authorization.**
