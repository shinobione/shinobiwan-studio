# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-11 after C2.5 closeout, C3-A implementation, the focused Album UX corrective, the Album palette slice and the Build 41 New Track real-user pass.

This file is the concise current roadmap. Historical release details remain in the milestone-specific documents and Git history.

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — code authority.
- Canonical `trackId` is the R2 track slug everywhere.

## Completed product phases

### Phase 0 — Architecture freeze / data contracts
Status: **COMPLETE**

### Phase 1 — Studio shell
Status: **COMPLETE**

### Phase 2 — Unified catalog read
Status: **COMPLETE**

### Phase 3 — Track Workspace
Status: **COMPLETE**

### Phase 4 — Track Manager integration
Status: **COMPLETE**

### Phase 5 — SonicTrace / Catalog Intelligence
Status: **COMPLETE**

Canonical analysis persistence, 512D embeddings, history/freshness, review-before-save and Catalog Intelligence are operational.

### Phase 6 — Lyrics / LRC integration
Status: **COMPLETE — REAL USER VALIDATED**

Canonical contract remains:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

## PHASE UX

PHASE UX is a post-Phase-6 product-quality project and is **not Phase 7**.

### C2.5-A — Albums scalability + frontend/mobile/player polish
Status: **COMPLETE — REAL USER PASS**

LaunchPAD Build 87 remains the sanctuarized touch/player baseline inherited by later builds.

### C2.5-B — Canonical Album read model
Status: **COMPLETE**

Canonical R2 Album schema and projection contract established.

### C2.5-C — Guarded canonical Album writes
Status: **COMPLETE**

Protected Track Manager Album create/edit/membership/order/assets with stale guards and rollback.

### C2.5-D — Studio Album Management + New Track binding
Status: **COMPLETE — REAL USER VALIDATED**

Unknown requested Albums block Review; canonical draft creation is explicit; Singles is safe fallback.

### C2.5-E — Controlled legacy Album migration
Status: **COMPLETE**

Three legacy Albums migrated to canonical R2; Singles transitioned to virtual collection semantics.

### C2.5-F — LaunchPAD canonical Album cutover
Status: **COMPLETE — REAL USER PASS DESKTOP + MOBILE**

LaunchPAD Build 89 + public Worker v2.7 established the validated canonical R2 Album baseline. Public authority exposes three canonical Albums and virtual Singles.

See `docs/PHASE-UX-C2-5-CLOSEOUT.md`.

### C3 — SonicTrace Deep Audio / V2-E parity
Status: **IN PROGRESS**

#### C3-A — Deep Audio resilience + truthful profile semantics
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Candidate engine/UI releases:

- SonicTrace `V2-E · BUILD 06` / Deep Audio `2.0.1-alpha`;
- Studio Deep Audio baseline `v0.13.0 · Build 38`, carried forward into current Studio Build 41.

Scope:

- robust FFmpeg `loudnorm` measurement parsing;
- real FFmpeg EBU R128 fallback;
- unavailable mastering measurements become warnings instead of aborting Neural / embedding / structure;
- accurate `FULL / PARTIAL / UNAVAILABLE / OUTDATED` profile semantics;
- distinguish coordinator transport/offline failures from coordinator processing failures;
- null mastering values render as missing, never as numeric zero;
- schema v1, Track Manager persistence and R2 paths unchanged.

Acceptance still requires a real canonical Studio scan after the local SonicTrace coordinator is updated/restarted. Prefer a track that previously triggered the loudnorm measurement-block failure.

#### C3-UX corrective — Focused Album workspace + canonical palette
Status: **COMPLETE — REAL USER PASS**

Studio `v0.13.1 · Build 39` fixed the post-C2.5 Album-management composition:

- Albums / Projects is a canonical cover-first library;
- selecting one Album renders only that Album;
- focused `Overview / Tracklist / Assets` tabs replace the previous endless stacked editor flow;
- current canonical artwork is visible in the editor;
- completed C2.5-E migration tooling lives in `System` as a collapsed maintenance/archive disclosure.

Studio `v0.13.2 · Build 40` + LaunchPAD `2026.08.11.90` added the requested palette slice:

- raw `Accent` / `Accent 2` inputs are replaced with **Primary color** / **Secondary color** controls;
- native color picker + validated HEX editing + optional eyedropper;
- existing cover-derived palette extraction remains available in Assets;
- canonical field names remain `album.accent` and `album.accent2`;
- LaunchPAD public Album detail pages consume those values as scoped theme variables for hero/artwork/actions/track states;
- missing or malformed colors use the existing LaunchPAD visual fallback;
- no Worker version, R2 data, Album membership/order, player, queue or Lyrics path changes.

Real-user review confirmed the focused Album workspace, Tracklist controls, canonical artwork view and palette-driven public Album presentation. Track Manager remains the sole protected Album write authority.

See `docs/PHASE-UX-C3-ALBUMS-FOCUSED-WORKSPACE.md`, `CHANGELOG-C3-BUILD40.md` and LaunchPAD `CHANGELOG-C3-ALBUM-PALETTE-BUILD90.md`.

#### C3 operational hotfix — New Track additive capability compatibility
Status: **COMPLETE — REAL USER PASS**

Studio `v0.13.3 · Build 41` fixed the real-user New Track pre-write failure where the legacy Phase 4 capability guard rejected Track Manager v5.19 / bridge v1.11 for advertising legitimate newer Album capabilities.

The compatibility rule is now operation-specific:

- Track Create requires `track-create`;
- track asset mutation requires `assets`;
- catalog rebuild requires `catalog-rebuild`;
- unrelated current/future `manage` capabilities are additive and do not invalidate the bridge;
- a missing required capability still blocks the operation;
- no Track Manager, Worker, R2, schema, Album authority or transaction-order change.

Regression coverage includes the exact current capability list (`album-create`, `album-metadata`, `album-membership`, `album-move`, `album-assets`, `album-migration`) plus a synthetic future capability.

Real-user retry passed on 2026-08-11 with **Stick to You** after checking canonical state before retry. The New Track flow completed successfully under Build 41. Post-pass rollback anchor: `safety/post-build41-real-user-pass-20260811-1833`.

See `docs/PHASE-UX-C3-TRACK-CREATE-CAPABILITY-HOTFIX.md` and `CHANGELOG-C3-BUILD41.md`.

**Next active step: resume the existing C3-A local-GPU smoke.** C3-A remains unaccepted until that scan passes.

#### C3-B — Studio V2-E parity
Status: **NOT STARTED**

Planned read-only intelligence parity after C3-A smoke:

- deterministic 2D projection from canonical persisted 512D embeddings;
- acoustic zones separate from sonic/style families;
- redundant pairs, outliers and bridges;
- canonical Album/Project intelligence using Album `trackIds` + canonical SonicTrace sidecars;
- advisory coherence / bridge / proposed sequence only; never silently rewrite artistic Album order;
- standalone SonicTrace IndexedDB remains local standalone memory, not Studio/R2 authority.

#### C3-C — Premium interaction polish / motion feel
Status: **NOT STARTED**

Final cross-app interaction-quality pass before PHASE UX closeout. This is a presentation/interaction layer, not a new data or architecture phase.

Planned themes:

- tactile button press/release states so clicks feel intentional rather than static;
- subtle glow / light response on primary actions and active controls;
- short, coherent hover/focus/selection transitions across Studio and LaunchPAD;
- smoother panel, tab, disclosure, modal and state transitions where they improve orientation;
- premium feedback for success, loading, active, disabled and destructive states without noisy animation;
- consistent micro-interactions for cards, icon buttons, toggles, sliders and track/Album actions;
- motion timings and easing standardized as shared design tokens instead of one-off effects;
- preserve mobile responsiveness, keyboard focus visibility and `prefers-reduced-motion` accessibility;
- no gratuitous layout shifts, no fake progress, no animation that delays an actual action;
- no changes to canonical data, Worker/R2 authority, player semantics or specialized-tool contracts merely for visual polish.

Target feel: restrained, responsive and premium — visible enough that interactions feel alive, subtle enough that the UI never becomes a neon arcade.

After C3-C:

- final PHASE UX cross-app real-user smoke;
- documentation reconciliation;
- final PHASE UX safety checkpoint;
- explicit user decision on whether to authorize Phase 7.

## Phase 7 — End-to-end workflow
Status: **LOCKED / NOT AUTHORIZED**

Do not implement, scaffold, branch, merge or deploy Phase 7 without explicit user authorization after PHASE UX closeout.

## Later original roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Goal: Studio opens directly onto actionable catalog health.

Planned themes:

- global catalog summary;
- Needs Attention;
- incomplete tracks;
- stale SonicTrace;
- missing cover/lyrics/Canvas;
- drafts/unpublished;
- recent activity;
- GPU/Worker/R2/catalog status;
- global search.

### Phase 9 — Security / reliability / PWA

Planned themes:

- Cloudflare Access/CORS hardening;
- no secrets in Pages;
- timeouts/retries;
- anti-loss saves;
- clear errors;
- degraded/offline behavior;
- PWA cache/update robustness;
- Android/Chrome resilience;
- graceful SonicTrace/Worker outages.

### Phase 10 — Progressive extraction of shared engines

Potential mature extractions only after behavior is stable:

- LRC Maker → reusable `lrc-engine`;
- SonicTrace → `sonictrace-engine`;
- Track Manager → `catalog-api`;
- Studio remains orchestrator.

There is currently **no official Phase 11**.

## Current runtime / candidate baseline

```text
Last fully real-user baseline:
Studio          0.12.2 / Build 37
LaunchPAD       2026.08.11.89
Track Manager   v5.19
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 05
LRC Maker       6.3.8

Current C3 candidate:
Studio          0.13.3 / Build 41
LaunchPAD       2026.08.11.90
SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha
```

The focused C3 Album UX/palette slice and the Build 41 New Track capability hotfix are now real-user validated. Build 41 still carries the C3-A Build 38 Deep Audio candidate, which remains pending its local-GPU canonical scan. LaunchPAD Build 90 is frontend-only and consumes canonical Album palette metadata without changing Worker v2.7 or R2 authority. UI and New Track passes do not fabricate Deep Audio acceptance.
