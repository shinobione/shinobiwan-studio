# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current PHASE UX release line

```text
Studio          v0.15.1 · Build 45
Codename        phase-ux-c3-track-to-market-bridge-v2
Status          BUILD 45 IMPLEMENTED CANDIDATE · REAL USER SMOKE PENDING

LaunchPAD       2026.08.11.91 candidate
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

Track-To-Market v0.1.5 · Bridge V2

SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha

LRC Maker       6.3.8
```

The functional PHASE UX line is real-user validated through **C3-B**. C3-C premium interaction remains a real-user-smoke candidate. Build 45 adds a bounded Track-To-Market Bridge V2 integration candidate without changing canonical write authorities or unlocking Phase 7.

## Current milestone

### C3-A — Deep Audio resilience
**COMPLETE — REAL USER PASS**

The local Build 06 SonicTrace coordinator and Studio produced a truthful FULL unsaved profile for **Stick to You**, with mastering, Neural, finite 512D embedding, structure and semantic summary all ready.

Checkpoint:

```text
safety/c3-a-real-user-pass-20260811-1900
```

### C3-B — Studio V2-E parity
**COMPLETE — REAL USER PASS**

Builds 42–43 provide canonical read-only Catalog Intelligence:

- deterministic 2D projection from finite canonical 512D CLAP embeddings;
- acoustic zones;
- separate Neural genre-derived sonic families;
- nearest-neighbor similarity;
- redundant/very-close pairs;
- outliers and cross-zone bridge candidates;
- canonical Album / Project embedding coverage, coherence, outliers and bridge candidate;
- read-only advisory continuity sequence;
- no standalone SonicTrace IndexedDB authority;
- no automatic Album order/membership mutation.

The final real-user smoke reported:

```text
ANALYZED          5
512D READY        4
HIDDEN FROM MAP   1
ACOUSTIC ZONES    2
SONIC FAMILIES    2
NEEDS UPDATE      0
```

`SINGULARITY :: OBLITERANT` was truthfully identified as the analyzed track without a usable 512D embedding. Four eligible points mapped correctly and nearest-neighbor comparisons worked.

Checkpoint:

```text
safety/post-c3-b-real-user-pass-20260811-1958
```

### C3-C — Premium Feel
**IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Studio Build 44 introduced the final PHASE UX interaction-quality layer:

- shared motion/easing tokens;
- tactile press/release feedback;
- restrained CTA glow/lift;
- coherent nav/tab/selection transitions;
- local form-control focus lighting;
- subtle depth only on already-interactive cards/rows;
- safe response on C3-B map points without replacing positional transforms;
- short non-looping view/feedback cues;
- touch-hover containment;
- explicit `prefers-reduced-motion` support.

LaunchPAD Build 91 carries the same interaction language without changing playback semantics.

No fake progress, infinite attention animation or transition delay is allowed.

### C3 bounded integration — Track-To-Market Bridge V2
**BUILD 45 IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

Studio v0.15.1 Build 45 adds a `Release Pack` tab inside the canonical Track Workspace.

Flow:

```text
Studio canonical track
  -> Open Track-To-Market v0.1.5
  -> short URL bootstrap: trackId / title / genres
  -> Bridge V2 ready handshake
  -> full context via postMessage: lyrics + audio/visual hints
  -> user explores DRAFT or imports premium FINAL
  -> FINAL-only pack return
  -> Studio transient review state
```

Build 45 safety rules:

- explicit GitHub Pages origin;
- returned `trackId` must match current track;
- only `releaseStatus === final` is accepted;
- DRAFT returns are rejected;
- no R2 write;
- no Track Manager mutation API in the panel;
- no LaunchPAD/SonicTrace/LRC Maker runtime change;
- returned FINAL data remains in React state only.

Rollback anchor:

```text
safety/pre-track-to-market-build45-20260812
```

See:

- [`docs/TRACK-TO-MARKET-BUILD45.md`](docs/TRACK-TO-MARKET-BUILD45.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`CHANGELOG-C3-BUILD45.md`](CHANGELOG-C3-BUILD45.md)
- [`docs/PHASE-UX-C3-C-PREMIUM-FEEL.md`](docs/PHASE-UX-C3-C-PREMIUM-FEEL.md)

## Architecture roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Track-To-Market** — release-pack ideation/finalization assistant, not canonical write authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

Studio never becomes another catalog and does not replace the specialized applications.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

Frozen rules:

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership and artistic order;
- track-manifest `album.id/title` is compatibility cache during migration, not authority;
- `catalog/index.json` is a rebuildable projection, not Album authority;
- Singles is a virtual collection derived from tracks not owned by a canonical Album.

Current canonical Album set:

- Neon Heartbreaks;
- Coal to Diamond;
- Love Letters from Saigon.

`accent` and `accent2` remain canonical Album manifest fields. Studio exposes them as Primary / Secondary colors and LaunchPAD consumes them as scoped Album-detail theme metadata.

C3-B Album/Project Intelligence reads canonical `album.trackIds` and never exposes an automatic apply-order write.

## Canonical Lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

A missing `.lrc` does not mean lyrics are unsynchronized. An optional `.lrc` can never become a second source of truth.

Build 45 transports `lyricsRaw` to Track-To-Market by `postMessage`; it does not duplicate or persist a second lyrics authority.

## Track Manager / protected-write rules

Track Manager remains the only protected write authority. Studio uses guarded operation-specific capabilities:

- `track-create` for Track Create;
- `assets` for track asset mutation;
- `catalog-rebuild` for catalog rebuild;
- later additive `manage` capabilities do not invalidate a compatible bridge.

Whole-track delete remains unavailable in Studio.

Track-To-Market Build 45 imports none of these mutation surfaces.

## SonicTrace / C3 rules

Persistence remains:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

C3-A preserves schema v1 and makes mastering failure non-fatal to later Deep Audio layers.

C3-B reads the same canonical sidecars and treats only finite 512D embeddings as map/similarity eligible. Standalone SonicTrace IndexedDB is not production authority.

C3-C changes presentation/interaction only; it does not change SonicTrace algorithms or persistence.

Build 45 may derive read-only release hints from track genres/BPM/key/moods/themes but changes no SonicTrace sidecar.

## Completed architecture / PHASE UX status

- Phase 0 — Architecture freeze ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC ✅ real-user validated
- PHASE UX C2.5-A → F ✅ real-user validated
- PHASE UX C3-A ✅ real-user validated
- PHASE UX C3-B ✅ real-user validated
- PHASE UX C3-C 🧪 Build 44 / LaunchPAD 91 candidate
- PHASE UX C3 bounded TTME bridge 🧪 Studio Build 45 candidate

## Security / safety

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin track-write route is introduced;
- standalone Track Manager remains fallback;
- C3-B Intelligence imports no Album mutation API;
- C3-C adds no data authority or backend route;
- Build 45 uses an explicit Track-To-Market origin and FINAL/trackId checks;
- Track-To-Market returned data is review-only in Build 45.

## Rollback anchors

```text
safety/pre-track-to-market-build45-20260812
safety/post-c3-b-real-user-pass-20260811-1958
safety/pre-c3-b-map-clarity-20260811-1950
safety/pre-c3-b-v2e-parity-20260811-1910
safety/c3-a-real-user-pass-20260811-1900
safety/post-build41-real-user-pass-20260811-1833
safety/pre-c3-ux-albums-20260811-1530
safety/phase-ux-c2-5-complete-20260811-1356
```

## Verification policy

Real-user smoke remains authoritative for user-facing milestone acceptance. CI is necessary but not sufficient.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.

Build 45 requires a real-user Bridge V2 smoke before acceptance; C3-C premium-interaction smoke also remains pending.

## Phase 7

**LOCKED / NOT AUTHORIZED.**

Build 45 is a bounded PHASE UX C3 bridge/review integration. It does not implement the Phase 7 end-to-end write workflow.

Do not implement, scaffold, branch, merge or deploy Phase 7 until PHASE UX closeout is complete and the user explicitly authorizes it.
