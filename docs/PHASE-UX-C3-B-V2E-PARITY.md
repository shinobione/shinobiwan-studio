# PHASE UX / C3-B — Studio V2-E parity

Date: 2026-08-11
Studio candidate: `v0.14.0 · Build 42`
Codename: `phase-ux-c3-b-v2e-parity`
Safety checkpoint: `safety/pre-c3-b-v2e-parity-20260811-1910`
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

## Purpose

C3-B brings the useful Catalog Intelligence interpretation layer from SonicTrace V2-E into SHINOBIWAN Studio while preserving the architecture established in Phases 0–6 and PHASE UX C2.5.

This is not a catalog migration and not a new source of truth. Studio remains the orchestrator; Track Manager/R2 remain canonical authority; SonicTrace remains the intelligence engine.

## Canonical read sources

Studio C3-B reads:

1. protected canonical SonicTrace sidecars through Track Manager;
2. canonical Track metadata for optional BPM/key/energy enrichment;
3. canonical Album manifests through Track Manager, where ordered `album.trackIds` is authoritative membership and artistic order.

Studio C3-B does **not** read the standalone SonicTrace IndexedDB catalog as production authority.

## Catalog map contract

Only finite embeddings with exactly 512 dimensions participate in the map.

The map is computed deterministically from the current canonical embedding set:

- stable trackId ordering;
- vector normalization;
- centered 512D embedding matrix;
- deterministic power-iteration components for 2D projection;
- normalized map coordinates;
- deterministic 2D K-means acoustic zones;
- stable left-to-right zone relabeling.

The visible semantics are deliberately separated:

```text
position = similarity/proximity in persisted CLAP embedding space
color    = Neural genre-derived sonic family
zone     = acoustic K-means neighborhood in the 2D projection
```

A sonic family is therefore not an acoustic cluster. A track can share a family with tracks in another acoustic zone, and a zone can contain multiple families.

## Neural sonic-family contract

Families are consolidated from the persisted Neural genre evidence in the canonical SonicTrace semantic summary.

The stable high-level vocabulary includes:

- Hip-Hop / Trap;
- R&B / Soul;
- Bass / Dubstep;
- Pop / Electronic Pop;
- Electronic;
- Reggae / Dancehall;
- Lo-fi / Chillhop;
- Rock / Alternative;
- additional repeated genre evidence may form a derived fallback family.

A track may contribute to multiple families, but the map uses its strongest family assignment for color.

## Catalog signals

### Nearest neighbors

Cosine similarity is calculated on finite 512D embeddings. The UI may add shared Neural genre/mood/instrument evidence as explanation, but those labels do not replace the embedding similarity score.

### Redundant pairs

Pairs at or above the current `0.92` cosine-proximity threshold are surfaced as very-close/redundant candidates. This is advisory; it is not a claim that two compositions are duplicates.

### Outliers

A track may be surfaced as an outlier when its local nearest-neighborhood fit is meaningfully below the catalog baseline and enough analyzed tracks exist for the comparison to be useful.

### Bridges

A bridge candidate has useful embedding proximity into acoustic zones beyond its own. This is an interpretation aid, not an objective artistic classification.

## Album / Project intelligence

The selected Album is read from the canonical protected Album model.

`album.trackIds` remains authoritative. C3-B never sorts that array in place and never writes a replacement order.

For tracks with valid canonical embeddings, Studio calculates:

- embedding coverage;
- average pairwise coherence;
- local project outliers;
- a bridge candidate;
- an advisory sequence.

The advisory sequence combines:

- CLAP proximity;
- an energy-arc target from persisted Neural traits or canonical Track metadata when available;
- optional BPM compatibility;
- optional key/harmonic metadata compatibility;
- a small bias toward continuity with the existing artistic order.

Every suggested item carries its original canonical index. The UI explicitly says that the canonical order is unchanged and exposes no automatic apply action.

## Degraded-read behavior

C3-B does not fabricate missing data:

- no valid 512D embedding -> track does not participate in map/similarity math;
- incomplete Album coverage -> coverage warning and lower-confidence project result;
- Track metadata read unavailable -> project sequencing uses embedding/Neural evidence only;
- canonical Album read unavailable -> Album/Project intelligence is unavailable, but catalog intelligence can still render;
- SonicTrace sidecar read unavailable -> Intelligence shows a hard read error rather than manufacturing a local catalog.

## Write boundary

C3-B is read-only.

Forbidden from this surface:

- direct R2 writes;
- Track Manager Album metadata/membership/move mutations;
- automatic adoption of an advisory sequence;
- SonicTrace standalone IndexedDB writes as production state;
- public Worker mutations;
- LaunchPAD mutations.

Canonical edits remain in their existing dedicated Studio/Track Manager workflows.

## Regression protection

The Build 42 production build runs `scripts/test-phase-ux-c3-b-v2e-parity.mjs` in addition to the existing Phase 0–6, C2.5 and C3 guards.

The C3-B guard verifies:

- 512D finite-vector validation;
- deterministic projection independent of API ordering;
- deterministic acoustic zones;
- style-family/zone separation;
- nearest-neighbor behavior;
- redundant-pair behavior;
- read-only project analysis;
- preservation of canonical `trackIds` input order;
- advisory sequence completeness.

The integration/UX guards also reject C3-B dependencies on standalone IndexedDB and Album write functions.

## Real-user smoke plan

After Build 42 is deployed:

1. hard-refresh Studio and confirm `v0.14.0 · Build 42`;
2. open **Intelligence**;
3. verify the 2D map renders real analyzed tracks without errors;
4. select several points/tracks and verify nearest-neighbor changes are coherent;
5. verify zone labels and sonic-family labels are both visible and clearly distinct concepts;
6. inspect redundant/outlier/bridge surfaces, accepting truthful zero-states where the real catalog does not cross a threshold;
7. choose a canonical Album and verify coverage/coherence/bridge/advisory sequence render;
8. confirm there is no save/apply-order action and the canonical Album order remains unchanged;
9. check desktop layout first, then a narrow/mobile viewport if the desktop smoke is clean.

Only after that real-user check may C3-B be marked **COMPLETE — REAL USER PASS** and C3-C become the active implementation slice.

## Frozen downstream boundary

C3-C remains the planned premium interaction/motion polish layer after C3-B acceptance.

Phase 7 remains **LOCKED / NOT AUTHORIZED**.
