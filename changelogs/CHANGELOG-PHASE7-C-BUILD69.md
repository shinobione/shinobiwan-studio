# Phase 7-C Runtime Slice 1 — Build 69 Guided Metadata / Identity

Status: **IMPLEMENTATION CANDIDATE — PR #99 · EXACT-HEAD CI REQUIRED**  
Date: 2026-08-14  
Version: **v0.20.0 · Build 69**  
Codename: `phase7c-slice1-guided-metadata`

## Purpose

Connect the accepted Phase 7 workflow Next Action to the existing guarded metadata operation without creating a new write authority.

```text
Home / Tracks / Workflow Next Action
→ Track guided Metadata / Identity context
→ edit
→ Validate metadata
→ review normalized proposal + changed fields
→ explicit human confirmation
→ existing metadata-save-v1 Track Manager operation
→ backend verification + Studio private canonical reread
→ VERIFIED only when private exact-track reread succeeds
→ recompute Workflow / Next Action from reread canonical state
```

## Runtime changes

- Home no longer collapses a metadata Next Action back to Track overview; identity actions deep-link to the Metadata context.
- Tracks and Workflow continue to route using the canonical workflow section directly.
- Track Metadata exposes a Phase 7-C guided context with exact `trackId`, private/public lock state and the current workflow Next Action.
- The existing `MetadataValidationPanel` validate → normalized proposal → explicit confirmation → save flow is reused unchanged.
- The existing Track Manager `metadata` write capability and `expectedUpdatedAt` stale guard remain authoritative.
- Post-save Track Workspace refresh refuses a public fallback or mismatched trackId as canonical verification.
- Workflow recomputation happens only after the Track state is replaced by the reread canonical private Track.

## Authority / non-scope

No new Worker route is required. No Track Manager bump is required. Deployment itself performs no R2 mutation.

Unchanged:

- Track Manager remains canonical write authority;
- public fallback remains read-only and cannot verify a write;
- Album membership/order remains owned only by `album.trackIds` operations;
- Lyrics and SonicTrace persistence are unchanged;
- Phase 7-B receipt authority is unchanged;
- Release Campaign remains browser-local / review-only with `canonicalWrite:false`;
- no auto-save, auto-publish, hidden batch write or generic Studio/R2 writer.

## Safety / candidate evidence

```text
Accepted baseline      v0.19.3 · Build 68 · REAL USER PASS
Pre-slice checkpoint   safety/pre-phase7c-slice1-build69-20260814-0013
Feature branch         agent/phase7c-runtime-slice1
PR                     #99 · DRAFT
Initial CI             31749799202 · FAILED on historical successor whitelist
Root cause             old guard allowed Phase 7-B / TM<=5.19 / Studio<=0.19 only
Guard repair           additive successor whitelist; existing assertions preserved
Final exact-head CI    REQUIRED before merge
Runtime merge          PENDING
Pages deployment       PENDING
Real-user smoke        PENDING
```

The failed initial CI is preserved as candidate evidence and is not a production regression: it stopped in `check-private-read-contract.mjs` before runtime/typecheck/build because the historical release-line whitelist had not yet been extended for the explicitly authorized Phase 7-C successor.

## Acceptance gate

Build 69 is not accepted until all of the following are true:

1. final PR head passes repository-native CI;
2. `main` is reread to prove no drift before merge;
3. the exact tested head is merged;
4. GitHub Pages deploys the exact merge SHA successfully;
5. real-user smoke confirms direct guided metadata routing, explicit validation/review/confirmation, canonical reread `VERIFIED`, persistence after reload, and truthful recomputed Next Action.

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**
