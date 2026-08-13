# Phase 7-C Runtime Slice 1 — Build 69 Guided Metadata / Identity

Status: **IMPLEMENTATION CANDIDATE — PR #99 · EXACT-HEAD CI REQUIRED**  
Date: 2026-08-14  
Version: **v0.19.3 · Build 69**  
Codename: `studio-focus-slice4-phase7c-slice1-guided-metadata`

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

## Release-line decision

The first Build 69 candidate used `v0.20.0 / phase7c-*`. Repository CI correctly exposed that this crossed historical compatibility whitelists even though the runtime change itself remained inside the existing Studio Focus / Slice 4 shell.

A later `v0.19.4 / studio-focus-*` candidate proved that inherited Build 60→68 guards also intentionally pin the accepted `0.19.3` / `studio-focus-slice4-*` ancestry. Rather than weakening those historical proofs, Build 69 was normalized to the conservative successor identity:

```text
v0.19.3 · Build 69
studio-focus-slice4-phase7c-slice1-guided-metadata
```

This keeps the accepted runtime release line and Slice 4 presentation ancestry explicit while naming the new Phase 7-C Runtime Slice 1 milestone. Historical C3 / TTME / PHASE UX / Studio Focus guards remain intact. Only the current cross-stack private-read integration guard is extended where necessary for the real Phase 7-C / Track Manager v5.21 / bridge v1.11 state.

## Safety / candidate evidence

```text
Accepted baseline      v0.19.3 · Build 68 · REAL USER PASS
Pre-slice checkpoint   safety/pre-phase7c-slice1-build69-20260814-0013
Feature branch         agent/phase7c-runtime-slice1
PR                     #99 · DRAFT
Initial CI             31749799202 · FAILED on successor identity whitelist
Interim CI lineage     guard-lineage failures only · no production deployment
Final identity         v0.19.3 · Build 69 · studio-focus-slice4-phase7c-slice1-guided-metadata
Historical guards      inherited C3 / TTME / PHASE UX / Focus assertions preserved
Current guard update   private-read integration only · PHASE 7-C / TM5.21 / bridge1.11
Final exact-head CI    REQUIRED before merge
Runtime merge          PENDING
Pages deployment       PENDING
Real-user smoke        PENDING
```

The failed candidate runs are preserved as evidence and did not deploy production. They stopped inside repository regression guards before acceptance because earlier candidate release identities did not fit the intentionally inherited compatibility lineage.

## Acceptance gate

Build 69 is not accepted until all of the following are true:

1. final PR head passes repository-native CI;
2. `main` is reread to prove no drift before merge;
3. the exact tested head is merged;
4. GitHub Pages deploys the exact merge SHA successfully;
5. real-user smoke confirms direct guided metadata routing, explicit validation/review/confirmation, canonical reread `VERIFIED`, persistence after reload, and truthful recomputed Next Action.

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**
