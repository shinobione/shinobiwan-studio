# SHINOBIWAN Studio — PHASE UX audit

Date: `2026-08-09`

Baseline: Studio `0.9.6` / Build `21` / `post-phase6-hardening`

Safety snapshot: `safety/pre-phase-ux-20260809-1426` at `5819914cd8db14f344754a02fe9cb966729b3b61`

Phase 7 status: **NOT AUTHORIZED — STOP**

## Executive finding

Studio is technically complete through Phase 6, but its information architecture still mirrors the implementation history. The shell exposes seven global destinations, several of which are explanatory placeholders for tools that only make sense inside a track. The Catalog opens with a full technical creation form before the user sees the catalog. The Track Workspace is useful but gives seven local tabs equal visual weight and exposes implementation language such as `trackId`, R2, bridge versions, manifests and canonical revisions in primary copy.

The visual baseline is already strong: dark surfaces, cyan accents, glass panels, clear track artwork and a capable responsive grid. PHASE UX should preserve that foundation while adopting LaunchPAD's calmer violet/blue depth, stronger hierarchy, consistent controls and progressive disclosure.

## Validation method

- inspected every Studio route and frontend component;
- inspected Studio CSS, routing and responsive rules;
- inspected LaunchPAD's current design tokens, panels, navigation, controls and breakpoints;
- rendered Studio locally at `1366×900` and `390×844`;
- inspected Dashboard, Catalog and an existing Track Workspace;
- confirmed no horizontal document overflow at those two widths;
- observed excessive vertical height: Catalog measured more than 4,100 px at laptop width and more than 6,100 px on mobile before any track was opened.

## Application shell and global navigation

### Problems

- Seven equal global navigation entries make Studio feel like a collection of modules.
- Lyrics, Assets and Publishing are global placeholder screens even though their actionable forms live inside a track.
- Administration competes visually with everyday work.
- Service health pills expose operational details permanently and can crowd the laptop top bar.
- Mobile removes the sidebar but replaces it with seven tiny icons without labels, producing weak orientation.
- The shell repeatedly surfaces Phase numbers and backend architecture rather than the user's current task.

### Direction

- Primary navigation: Dashboard, Catalog, Intelligence.
- Secondary utility: System status/Administration, visually separated.
- Track tools remain track-local.
- Use explicit active states, readable labels and a compact mobile navigation.
- Keep service diagnostics available in a secondary status area.

## Dashboard

### Problems

- The hero is polished but architecture-centric.
- “canonical slug”, R2 and Track Manager are prominent on the first screen.
- Four status cards repeat facts more useful to maintainers than music operators.
- The main CTA says “Open Track Workspace” even though no track is selected.

### Direction

- Lead with Catalog and `+ New Track`.
- Show concise operational overview and recent/attention-oriented information.
- Move architecture facts into Administration or diagnostics.

## Catalog

### Problems

- The full creation form appears before search and tracks.
- The primary screen can exceed 4,100 px at laptop width.
- “TRACK MANAGER / CREATE”, `trackId / slug`, “manifest-only”, “bridge” and “canonical reread” expose backend vocabulary.
- The locked form remains visually dominant when Access is unavailable.
- Track cards expose many chips and asset flags simultaneously.
- There is no isolated, unmistakable `+ New Track` entry action.

### Direction

- Catalog header with title, useful summary and `+ New Track` primary CTA.
- Search/filter toolbar immediately above tracks.
- New Track becomes a dedicated progressive flow, not an always-open panel.
- Generate the slug internally and hide it under optional technical details.
- Keep cards scannable: cover, title, release/status, Content Health summary and Open action.

## New Track / intake

### Problems

- Current creation is a single technical form followed by separate asset work.
- Confirmation dialog exposes `trackId` and catalog rebuild behavior.
- Required versus optional information is not visually explained.
- Success redirects to Assets, but there is no visible completion or next-step state.

### Direction

- Maximum three understandable steps: Basics, Media guidance, Review.
- Reuse the existing draft-create bridge exactly as-is.
- No bulk backend route or new mutation.
- Clear required/optional labels, generated identifier hidden by default.
- After verified creation, open the new workspace with a concise success handoff.

### UX-2 addendum — Cover Palette

Track Manager currently provides useful cover-assisted intake behavior that Studio must study before redesigning New Track. UX-2 must inspect the current Track Manager and LaunchPAD implementations and reuse their existing canonical two-color palette contract exactly.

The New Track Media step must make palette extraction understandable rather than technical: selecting a valid cover should calculate a preview automatically, display two clear swatches with the real color values and canonical field names, and provide an explicit “Recalculate palette” or “Extract colors” action. The same preview should remain visible in Review when it helps the user confirm the draft.

For an existing track, selecting or replacing a cover must not silently mutate a saved palette. Recalculation and persistence must be an explicit user action. Assets/Cover or the Track Workspace summary may expose the two saved colors only when useful and uncluttered.

No second palette model, Studio-only fields, alternate persistence or new backend route is permitted. If the existing protected contract cannot persist the canonical fields, UX-2 stops before implementation and reports that backend blocker.

### UX-2 cover palette source audit — completed

Current code confirms one shared contract:

| Concern | Current authority | Verified behavior |
|---|---|---|
| Extraction | LaunchPAD-APP `08c-feature-10-color-diversity.inject.part` | Feature 10.3 samples a 96×96 canvas, scores quantized colors and selects a hue-diverse pair. |
| Field names | Track Manager manifest normalization | `accent` and `accent2` only. |
| Existing-cover safety | Track Manager Phase 12 + Milestone 3 controls | Cover selection preserves saved colors; extraction is an explicit action. |
| Persistence | Track create + guarded metadata save | Both existing routes already whitelist `accent` and `accent2`; no route change is needed. |
| Public consumption | LaunchPAD `remote-catalog.js` + `theme.js` | Valid manifest colors become track `accent` / `accent2` and CSS `--accent` / `--accent2`. |

Useful Track Manager intake behaviors retained by UX-2 are cover-aware preview, two theme colors, browser-side thumbnail generation, optional multi-media intake, draft-first creation and quality-protected canonical writes. Studio uses its existing one-asset-at-a-time endpoints after the draft reread rather than reproducing Track Manager's older multipart whole-form route.

The requested new-track exception is safe: automatic extraction changes only unsaved local preview state because a new track has no existing canonical palette. An existing track still requires explicit extraction and a second explicit, confirmed metadata save. Cover upload alone never calls the palette save path.

## Track Workspace

### Problems

- Seven tabs give Versions and Publishing the same priority as Metadata, Assets and Lyrics.
- “Audio Intelligence” is long and wraps poorly at constrained widths.
- Overview's complete Content Health breakdown dominates the viewport.
- Technical source/revision language is visible in primary panels.
- The header is attractive but can be more compact and sticky.

### Direction

- Primary local navigation: Overview, Metadata, Assets, Lyrics, SonicTrace.
- Publishing state belongs in Overview/Metadata; technical Versions becomes secondary details.
- Compact sticky track header with cover, title, status, release and completeness.
- One tool at a time; no return to a giant stacked page.

### UX-3 implementation decision

The header is reduced to durable track context: cover, title, album/release, status, a few genres, operational readiness and the two saved canonical cover colors. Read-source labels no longer compete with the track identity.

Overview is reorganized into five concise answers:

1. readiness and the next priority;
2. remaining checklist actions;
3. current production media;
4. core music facts and playback;
5. release plus SonicTrace state.

The previous always-expanded eight-row Content Health detail is replaced by compact readiness pills. This is a presentation change only; the existing scoring inputs and 100-point completeness contract are untouched. Source, revision and `trackId` remain available in a collapsed diagnostics disclosure.

## Metadata

### Problems

- The underlying form is comprehensive but dense.
- Validation and save actions have competing emphasis.
- Error payloads and revision language can reach the primary UI.
- Button classes and action rows are not fully normalized.

### Direction

- Group identity, release, classification and publishing fields.
- One primary Save action; validation is integrated or secondary.
- Human summary first, expandable diagnostics second.
- Preserve revision and stale-write semantics internally.

### UX-4 implementation decision

The flat metadata field wall becomes five semantic groups: Identity, Release, Discovery, Music details and LaunchPAD theme. Validation remains an explicit non-mutating review gate before Save, but canonical revision and backend version wording no longer lead the normal workflow.

## Assets

### Problems

- Current assets are shown once as a technical R2 list and again as management cards.
- Upload/replace/delete controls vary in density and alignment.
- Canonical filename and storage explanations are too prominent.

### Direction

- One media-management surface for Audio, Cover, Thumbnail, Lyrics TXT and Video.
- Each asset card has current state, one primary upload/replace action, secondary open and subdued danger action.
- Preserve progress, validation, confirmations and protected writes.

### UX-4 implementation decision

The duplicate read-only asset projection is removed from the tab. The existing protected Assets Manager becomes the single media surface, presented as responsive media cards with aligned actions. Cover palette extraction/save remains explicitly separate from cover upload.

## Lyrics / embedded LRC Maker

### Findings

- The canonical boundary is correctly represented.
- Embedded and standalone workflows are both preserved.
- The current screen stacks a state panel, embedded engine and plain editor, which creates competing editing surfaces.

### Direction

- Embedded LRC Maker remains the primary synchronization surface.
- Plain text editor becomes secondary/collapsible when the embed is available.
- Preserve simple-click/no-seek, double-click seek, Space timestamp-and-advance, canonical reread and fallback unchanged.

### UX-4 implementation decision

Embedded LRC Maker is now the primary full-width working surface. A compact status row explains source and synchronization, standalone LRC Maker remains the visible fallback, and the plain-text editor is available through explicit progressive disclosure. No timing mechanic or persistence behavior changes.

## SonicTrace

### Problems

- Engine/model/GPU terminology is prominent.
- Analysis action, state, history and diagnostics compete for attention.

### Direction

- Lead with readiness, Analyze action, progress and latest result.
- Move model/GPU/source-version details into diagnostics.
- Preserve Phase 5 persistence and 512D contracts unchanged.

### UX-4 implementation decision

The primary panel now leads with Analyze/Re-scan, progress, saved/current state and history count. Analysis IDs, engine version, embedding dimension and source version move into a diagnostics disclosure. Review-before-save, partial browser-DSP fallback and append-only persistence remain unchanged.

## Catalog Intelligence and Catalog Rebuild

- Catalog Intelligence should remain a global workspace, but relationships and similarity need editorial hierarchy rather than debug-console density.
- Catalog Rebuild is an Administration action and must not compete with daily workflows.
- No automatic rebuild will be introduced as a UX side effect.

### UX-5 implementation decision

Catalog Intelligence now leads with the user task, human summary metrics, searchable analyzed-track selection, ranked sonic neighbors and readable family cards. The saved 512D embedding contract, nearest-neighbor math and deterministic clustering remain unchanged. Engine methodology is available through a secondary disclosure, while loading, errors and selection use semantic status/alert/pressed states. Catalog Rebuild remains isolated in Administration and is never triggered as a UX side effect.

## States and feedback

### Problems

- Loading and read errors are mostly plain panels.
- Raw exception text can be the most visible message.
- Success states are inconsistent across modules.

### Direction

- Standard EmptyState, Notice, Progress and ActionBar patterns.
- Messages answer what happened and what to do next.
- Technical details become expandable diagnostics.

## Buttons and forms

### Problems

- Multiple button families (`primary-btn`, `ghost-btn`, operation buttons and component-specific controls) use different heights and padding.
- Action rows can place validation, save, refresh and delete at competing levels.
- Disabled, focus and success behavior is not uniformly represented.

### Direction

- Shared 42 px control/button baseline, compact 36 px option where necessary.
- Primary, secondary, ghost and danger variants.
- Danger actions isolated from the normal primary flow.
- Unified focus-visible ring and minimum 11 px useful microcopy.

## Responsive and accessibility findings

- No document-level horizontal overflow was observed at 1366 px or 390 px.
- Mobile Catalog is excessively tall because intake is permanently expanded.
- Mobile navigation icons lack sufficient labels/context.
- Track tabs require better overflow or wrapping behavior.
- Semantic links/buttons and labels are generally present and should be preserved.
- Add consistent focus-visible states and reduced-motion handling.

## PHASE UX principles

1. Show the user's task before implementation details.
2. Keep three global destinations and five track-local tools.
3. Use progressive disclosure for creation, diagnostics and technical metadata.
4. Give every screen one obvious primary action.
5. Preserve all guarded backend contracts behind simpler language.
6. Use shared tokens and primitives instead of component-specific control geometry.
7. Keep track context visible and reduce unnecessary scrolling.
8. Treat Content Health strictly as operational completeness.
9. Preserve all standalone fallbacks.
10. Never introduce Phase 7 behavior or a new source of truth.

## Live-smoke corrective audit — 2026-08-09

Baseline: Studio `0.10.4` / Build `26` production merge `2a1f74f2b3487501fbeffe94d53f6c5015955ba1`; Track Manager `v5.15`, bridge `v1.7`, LaunchPAD repository `0e508c893c038059da4a563365dbdba7094b638d`.

### Findings and dispositions

| Finding | Current-code evidence | Corrective disposition |
|---|---|---|
| Studio asset upload failed before a Worker JSON response | Cross-origin `XMLHttpRequest` registered `xhr.upload.onprogress`, forcing CORS preflight; the current asset route is not an allowed preflight path | Studio-only credentialed multipart `fetch`; browser boundary; no Worker/CORS change |
| A lost response could invite a duplicate manual upload | No canonical reread occurred after status-zero transport failure | Reread `updatedAt` and asset fingerprint; recover verified writes, allow retry only for unchanged revision, block ambiguity |
| New Track lagged Track Manager intake | Separate role-specific pickers; TXT uploaded without current parser/inference | Multi-file drop, role review, current TXT field map, release/album/slug and Feature 10.2 genre/mood/theme inference |
| Metadata origin was invisible | No detected/inferred/manual provenance | Explicit provenance badges and `EXISTING USER VALUE PRESERVED` guard |
| Cover workflow lacked image/manual palette affordances | Palette swatches only | Local/current cover preview, canonical field swatches/values, color and HEX inputs, optional native EyeDropper |
| Cover replacement could be misunderstood as palette replacement | Saved colors displayed without selected-cover image context | Selected cover preview plus explicit Extract and Save; no automatic existing-palette mutation |
| Track Workspace controls overlapped while scrolling | Full header sticky at 88/72 px and tabs independently sticky at 205/178 px | Header scrolls; one compact sticky context/navigation bar at 76/72 px |

### Safety result

- Track Manager remains the only protected R2 write authority.
- No Worker, Cloudflare Access policy, backend route, schema, R2 data, LaunchPAD runtime, SonicTrace runtime or LRC Maker runtime was modified.
- `trackId`, `lyrics.txt`, `accent` and `accent2` remain the only canonical identifiers/fields involved.
- Corrective automated tests are read-only and use synthetic buffers/text plus source-contract assertions.
- Production mutation smoke is deliberately pending explicit user execution after Pages deployment.
- Phase 7 is neither authorized nor present in runtime code.
