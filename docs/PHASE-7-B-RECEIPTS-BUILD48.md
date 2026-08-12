# PHASE 7-B — CONTEXTUAL CONTINUATION RECEIPTS

Studio: `v0.17.0 · Build 48`
Codename: `phase7-b-contextual-receipts`
Date: 2026-08-12

## Status

**IMPLEMENTED CANDIDATE — REAL USER SMOKE REQUIRED**

Build 48 is based on the real current `main` after Studio Build 47 / Track-To-Market Bridge V3 staged FINAL preview. It preserves that corrective in full and adds the Phase 7-B continuation layer.

Phase 7-A answered: **what should I do next?**

Phase 7-B answers: **did the specialist really finish it, and is canonical state now updated?**

## Core rule

A specialist receipt is a continuation signal, **not a new source of truth**.

For canonical writes:

```text
specialist reports completion
        ↓
receipt(trackId + source + operation)
        ↓
Studio shows VERIFYING
        ↓
Studio re-reads getCatalogTrack(trackId)
        ↓
private Track Manager read required
        ↓
VERIFIED or VERIFICATION ERROR
```

Studio never marks a canonical write verified from optimistic child/local state alone.

## Receipt sources

### LRC Maker

`lyrics-saved` · `canonical-write`

Covered paths:

- embedded LRC Maker custom-element save event;
- standalone `shinobiwan:lyrics-saved:v1` postMessage from configured LRC Maker origin.

### SonicTrace

`analysis-saved` · `canonical-write`

The existing SonicTrace save owner is unchanged. Its completed save callback becomes a typed receipt; Studio then performs a fresh private canonical Track reread before showing VERIFIED.

### Track-To-Market V3

`final-pack-received` · `review-only`

Build 48 preserves Build 47 in full:

- Bridge `0.2.0`;
- integrated artwork strategy;
- actual FINAL preview staged in Studio;
- `data:image/*` validation and 2.5 MB cap;
- provider/model/artwork/branding provenance;
- expected origin + exact child Window;
- matching `trackId`;
- FINAL only / DRAFT rejected;
- no R2 write;
- no Track Manager mutation;
- no canonical cover replacement.

A matching FINAL additionally emits a **review-only receipt**. It never becomes a canonical completion claim.

## Receipt UI states

- `verifying` — canonical reread in progress;
- `verified` — private Track Manager reread succeeded;
- `review-only` — specialist result received, no canonical write expected/authorized;
- `verification-error` — Studio could not prove the write through the private canonical read layer.

## Stale / mismatch protection

- receipt `trackId` must equal current Workspace `trackId`;
- mismatched receipts are ignored;
- async verification uses an epoch guard;
- public LaunchPAD fallback cannot produce a green canonical-write verification;
- changing Track clears the current receipt.

## Authority boundary

Build 48 adds no generic write authority, no generic R2 route and no new Track Manager mutation endpoint. Existing specialist and operation-specific write owners stay unchanged.

## Files

```text
src/phase7-receipts.ts
src/phase7-receipts.css
src/components/TrackWorkspace.tsx
src/components/EmbeddedLyricsStudio.tsx
src/components/TrackToMarketPanel.tsx
src/App.tsx
src/release.ts
scripts/test-phase7-receipts-build48.mjs
```

## Safety / rollback

Current-main parent:

`Studio v0.16.1 · Build 47 · phase7-a-ttm-v3-staged-preview`

Pre-Build-48 anchor:

` safety/pre-phase7-b-build48-20260812-1008 `

Historical accepted Phase 7-A anchor:

` safety/post-phase7-a-build46-real-user-pass-20260812-0923 `

Build 48 remains a candidate until real-user smoke passes.
