# Phase 7-A — Track-To-Market V3 staged review · Build 47

## Why this corrective exists

The Build 45 real-user smoke proved the standalone bridge and FINAL gate, but also exposed a product gap: Studio only received a textual `FINAL RECEIVED` state while the actual selected artwork lived in Track-To-Market.

Track-To-Market V0.2.0 also changes the premium flow materially:

- uploaded logo becomes an explicit premium-provider reference asset;
- integrated provider composition is the default;
- imported FINAL artwork is preserved instead of automatically receiving a generic title overlay.

Studio Build 47 therefore upgrades the review surface to match that richer contract.

## Contract

### Studio → Track-To-Market

After the child window announces readiness, Studio sends:

```ts
{
  type: 'shinobiwan:track-to-market:input',
  version: '0.2.0',
  input: {
    source: 'studio',
    trackId,
    title,
    genres,
    audioStyle,
    style,
    lyrics,
    artworkStrategy: 'integrated'
  }
}
```

Lyrics remain transported via `postMessage`, not query string.

### Track-To-Market → Studio

Studio accepts only a return that satisfies all of the following:

1. event origin is `https://shinobione.github.io`;
2. event source is the exact child Window opened by Studio;
3. returned `trackId` equals the current canonical track;
4. `releaseStatus === 'final'`.

Bridge V3 may additionally return:

- `previewDataUrl`;
- provider/model;
- artwork strategy;
- branding treatment;
- release-copy fields.

Preview is accepted only when it is a `data:image/*` URL no larger than 2.5 MB.

## UI semantics

`Release Pack` becomes a staging/review surface:

```text
Canonical track context
        ↓
Track-To-Market V0.2
        ↓
FINAL artwork selected/exported
        ↓
Bridge V3 return
        ↓
Studio staged preview + provenance
```

The staged preview is intentionally visually prominent because the user needs to judge the actual artwork, not merely trust a status badge.

## Authority boundary

Nothing in Build 47 persists the staged result.

The following remain untouched:

- `tracks/<slug>/manifest.json`;
- canonical cover objects;
- canonical thumbnails;
- Album manifests/order;
- public LaunchPAD catalog state;
- Track Manager writes;
- SonicTrace sidecars;
- canonical lyrics.

A future persist/apply action, if authorized, must use an explicit guarded Studio → Track Manager operation and must re-read canonical state afterward.

## Regression

Build 47 adds `scripts/test-phase7-a-build47-ttm-v3.mjs` and preserves all pre-existing Phase 0–6, C2.5, C3, Build 45 and Build 46 contracts.

Rollback anchor:

`safety/pre-build47-ttm-v3-preview-20260812`
