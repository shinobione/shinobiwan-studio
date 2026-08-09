# PHASE UX — SonicTrace integration parity audit

Date: 2026-08-09
Scope: current SonicTrace V2-E versus Studio; no legacy production import; not Phase 7.

## Runtime diagnosis

The local coordinator is healthy at `http://127.0.0.1:8000`:

- `/api/live`: HTTP 200;
- API schema `2.2`;
- node `RTX3060-PRIMARY`, coordinator role;
- GPU, Neural, Stems, Anatomy, Fusion and V2-E reported ready.

Studio production nevertheless reports `TypeError: Failed to fetch`. A browser Private Network Access preflight from `https://shinobione.github.io` receives HTTP 400 with `Disallowed CORS private-network`. Normal CORS origin allowance is present. The engine is online; the browser-to-loopback permission contract is incomplete.

## Canonical storage boundary

Standalone SonicTrace V2-E stores structured local memory in IndexedDB (`sonictrace-catalog`). That memory is a standalone fallback and is not production truth. Local-only IDs and JSON exports must never be imported automatically into R2.

Studio's durable intelligence source remains:

```text
tracks/<trackId>/analysis/sonictrace/latest.json
tracks/<trackId>/analysis/sonictrace/history/<analysisId>.json
```

Only Track Manager writes those private R2 sidecars. SonicTrace computes temporary results and retains no canonical audio.

## Current parity matrix

| Capability | Standalone V2-E | Studio before C1 | Corrective direction |
|---|---|---|---|
| Canonical identity | canonical `trackId` when supplied; otherwise explicit local-only ID | canonical R2 `trackId` | keep Studio/R2 authority |
| Profile completeness | full capture requires neural embedding plus structure | saved layers shown individually | C1 adds FULL/PARTIAL/OUTDATED |
| Similarity | weighted, renormalized seven-component score | raw 512D cosine only | port current V2-E math over R2 entries |
| Reasons | mood, genre, energy, vocal, space, tempo, key, structure, mastering | shared labels or embedding fallback | port human reasons |
| Map | deterministic PCA-like 2D projection | none | add read-only R2-backed map |
| Clusters | k-means on 2D projection | k-means directly in 512D | align with current V2-E projection contract |
| Insights | redundant pairs, outliers, bridge tracks | none | add catalog insights |
| Album/EP | coherence, outliers, bridge and sequencing | none | add ephemeral selection analysis; do not create a second project store |
| Import/export | local JSON backup | none | automatic legacy import forbidden |

## Data-shape gap

The private catalog endpoint currently exposes embedding, semantic summary, mastering and structure. `semanticSummary` contains ranked genres, moods, instruments and neural traits. The endpoint does not currently expose the compact browser DSP object, so BPM/key components cannot be reproduced for every saved R2 profile without either:

- a minimal read-response expansion from the already persisted sidecar; or
- deterministic renormalization over the available components.

No new R2 field or alternate analysis object is required. Any read-response expansion must remain private and must not rewrite sidecars.

## Profile classification

Studio C1 uses:

- `FULL`: DSP, mastering, neural, exact 512D embedding and structure are all present and the audio source is current;
- `PARTIAL`: a saved profile is current but at least one core layer is absent;
- `OUTDATED`: the saved profile's `sourceVersion` does not match the current canonical audio, regardless of layer completeness.

Browser-DSP-only fallback remains valid but explicitly `PARTIAL`.

## Safety decisions

- No standalone IndexedDB or export is imported into R2.
- No automatic migration or production data mutation is authorized.
- No source audio is persisted in Studio or analysis sidecars.
- Track Manager remains the sole analysis-sidecar write authority.
- Phase 7 is not started.
