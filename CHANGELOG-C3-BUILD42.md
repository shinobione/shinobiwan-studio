# SHINOBIWAN Studio v0.14.0 · Build 42

Codename: `phase-ux-c3-b-v2e-parity`

Date: 2026-08-11
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

## C3-B — Canonical V2-E parity in Studio

Build 42 brings the useful read-only Catalog Intelligence surfaces from the standalone SonicTrace V2-E line into Studio without changing canonical authority.

### Canonical catalog map

- reads persisted SonicTrace sidecars through the protected Track Manager read API;
- validates finite 512D CLAP embeddings before using them;
- computes a deterministic 2D projection in Studio from those persisted embeddings;
- recomputes the same map deterministically regardless of API result order;
- never reads SonicTrace standalone IndexedDB as Studio authority.

The visual language is intentionally split into three independent meanings:

```text
position = CLAP embedding proximity
color    = Neural genre-derived sonic family
zone     = acoustic K-means neighborhood
```

Acoustic zones and sonic/style families are therefore not aliases for one another.

### Catalog signals

Build 42 adds advisory catalog-level signals derived from canonical embeddings:

- redundant/very-close pairs;
- neighborhood outliers;
- cross-zone bridge tracks;
- nearest-neighbor similarity with semantic evidence when available.

These surfaces are read-only and never rewrite track metadata.

### Album / Project intelligence

Studio reads canonical Album manifests through Track Manager and uses ordered `album.trackIds` as the only membership/artistic-order authority.

For the selected canonical Album, Build 42 can display:

- valid-embedding coverage;
- mean project coherence;
- project outliers;
- strongest bridge candidate;
- an advisory continuity sequence using embedding proximity plus available energy/BPM/key metadata.

The recommendation is explicitly non-authoritative. It never changes Album membership or order and exposes no apply/save-order action. Any artistic adoption remains a deliberate manual action in Albums / Projects.

### Resilience / degradation

- SonicTrace catalog sidecars are required for Intelligence;
- Track metadata enrichment can fail independently and project sequencing then falls back to embedding/Neural evidence;
- protected canonical Album read can fail independently without inventing Albums;
- incomplete 512D coverage is shown honestly and reduces project-confidence coverage rather than fabricating data.

### UI / accessibility

- responsive 2D map and project surfaces;
- keyboard-focusable/selectable map points and track list;
- existing Studio 11px minimum microcopy/readability floor preserved;
- explicit explanation of map semantics and data authority;
- mobile breakpoints for map, KPI, insight and sequence layouts.

## Regression coverage

`scripts/test-phase-ux-c3-b-v2e-parity.mjs` protects:

- finite 512D validation;
- cosine nearest-neighbor behavior;
- deterministic projection independent of API ordering;
- deterministic acoustic-zone identity;
- separation of Neural sonic families from acoustic zones;
- redundant-pair detection;
- project analysis without mutation of canonical `trackIds`;
- advisory sequence completeness and original-position provenance.

Historical C2.5/C3 guards were advanced only to recognize the deliberate Studio `0.14.x` successor line while retaining their original write-authority and safety assertions.

## Frozen contracts

Build 42 does **not**:

- add any R2 write;
- change Track Manager write APIs;
- deploy or modify the public Worker;
- change canonical Album membership/order authority;
- change LaunchPAD runtime;
- change SonicTrace runtime or Deep Audio schema;
- change LRC Maker;
- make SonicTrace IndexedDB a Studio source of truth;
- begin or scaffold Phase 7.

Safety checkpoint before C3-B source changes:

` safety/pre-c3-b-v2e-parity-20260811-1910 `

## Real-user acceptance

Pending after deployment. Acceptance requires a Studio Build 42 smoke of the Intelligence page against the real canonical catalog and at least one canonical Album/Project. CI is necessary but does not replace that user-facing check.
