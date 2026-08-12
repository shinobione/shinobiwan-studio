# PHASE 7-B — CONTEXTUAL CONTINUATION RECEIPTS

Studio: `v0.17.0 · Build 47`
Codename: `phase7-b-contextual-receipts`
Date: 2026-08-12

## Status

**IMPLEMENTED CANDIDATE — REAL USER SMOKE REQUIRED**

Phase 7-A answered: **what should I do next?**

Phase 7-B answers: **did the specialist really finish it, and is the canonical state now updated?**

## Core rule

A specialist receipt is a continuation signal, **not a new source of truth**.

For a canonical write:

```text
specialist reports completion
        ↓
receipt(trackId + source + operation)
        ↓
Studio shows VERIFYING
        ↓
Studio re-reads getCatalogTrack(trackId)
        ↓
private canonical Track Manager read required
        ↓
VERIFIED or VERIFICATION ERROR
```

Studio never marks a canonical write as verified from optimistic child/local state alone.

## Build 47 receipt types

### LRC Maker

Operation: `lyrics-saved`
Effect: `canonical-write`

Sources covered:

- embedded LRC Maker custom-element `lyrics-saved` event;
- standalone LRC Maker `shinobiwan:lyrics-saved:v1` postMessage from the configured LRC Maker origin.

After the receipt, Studio re-reads the private canonical Track before showing `Canonical reread verified`.

### SonicTrace

Operation: `analysis-saved`
Effect: `canonical-write`

The existing SonicTrace save authority is unchanged. Once the specialist reports its save callback, Studio converts that completion into a typed receipt and performs a fresh canonical Track reread before presenting completion.

### Track-To-Market

Operation: `final-pack-received`
Effect: `review-only`

Build 45 safety stays frozen:

- explicit Track-To-Market origin;
- exact child-window source;
- matching canonical `trackId`;
- FINAL-only acceptance;
- DRAFT/non-FINAL rejection;
- no R2 write;
- no Track Manager mutation;
- FINAL remains transient Studio review state.

A Track-To-Market FINAL receipt therefore displays as **review-only**. It deliberately does **not** trigger or imply canonical persistence.

## Receipt UI states

The Track Workspace exposes one compact continuation banner:

- `verifying` — canonical reread in progress;
- `verified` — private Track Manager canonical reread succeeded;
- `review-only` — specialist result received, but no canonical write is expected/authorized;
- `verification-error` — Studio could not prove the write through the private canonical read layer.

The receipt is scoped to the current Track and cleared when the Track changes.

## Stale/mismatched protection

- receipt `trackId` must equal the current Workspace `trackId`;
- mismatched receipts are ignored;
- asynchronous verification uses an epoch guard so an older reread cannot overwrite a newer receipt;
- public LaunchPAD fallback is insufficient to verify a canonical write and therefore yields `verification-error` rather than a false green state.

## Authority boundary

Build 47 adds **zero generic write authority**.

It does not add:

- a generic R2 endpoint;
- a generic Track Manager mutation route;
- automatic publishing;
- Album membership/order mutation;
- Track-To-Market persistence;
- a second Lyrics or SonicTrace source of truth.

Existing specialist/Track Manager operation owners remain unchanged.

## Files

```text
src/phase7-receipts.ts
src/phase7-receipts.css
src/components/TrackWorkspace.tsx
src/components/EmbeddedLyricsStudio.tsx
src/components/TrackToMarketPanel.tsx
src/App.tsx
src/release.ts
scripts/test-phase7-receipts-build47.mjs
```

## Safety / rollback

Pre-Build-47 anchor:

` safety/pre-phase7-b-build47-20260812-0948 `

Parent accepted baseline:

` safety/post-phase-ux-final-closeout-20260812-0948 `

Phase 7-A accepted anchor:

` safety/post-phase7-a-build46-real-user-pass-20260812-0923 `

## Acceptance boundary

CI/typecheck/build and deployment prove implementation integrity, not user-facing acceptance.

Build 47 remains a candidate until the real-user receipt smoke in `docs/PHASE-7-B-SMOKE-CHECKLIST.md` passes.
