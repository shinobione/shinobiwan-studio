# PHASE 7-C — Guided end-to-end actions contract

Status: **STARTED — CONTRACT LOCKED / RUNTIME SLICE 1 BUILD 69 IMPLEMENTATION CANDIDATE**

Authorization: explicit user `GO PHASE 7-C` on 2026-08-13; fresh runtime authorization renewed on 2026-08-14 after Build 68 REAL USER PASS.

This document operationalizes the current-roadmap definition of Phase 7-C. It does **not** create a new write authority. It defines how Studio may guide an artist through already-authorized, operation-specific production actions while preserving the accepted Phase 7-A / 7-B and Track Manager safety model.

## Purpose

Phase 7-A made the end-to-end production state visible and gave each Track one truthful Next Action.

Phase 7-B made specialist completion return to Studio with typed receipts and required canonical rereads before a canonical write could be shown as verified.

Phase 7-C connects those two accepted layers into **guided end-to-end actions**:

```text
truthful current state
        ↓
one explicit next action
        ↓
existing operation-specific protected action
        ↓
canonical reread / typed receipt
        ↓
verified current state
        ↓
recompute the next useful action
```

The goal is less manual navigation and less ambiguity, **not** broader mutation power.

## Frozen authority

- GitHub remains application-code authority.
- Cloudflare R2 remains canonical catalog/media/data authority.
- Track Manager remains protected canonical write authority.
- Studio remains a private cockpit/orchestrator and never becomes a generic R2 owner.
- LaunchPAD remains the public listener experience.
- SonicTrace remains audio-intelligence authority for its analysis flow.
- LRC Maker remains lyrics-synchronization authority for its editing flow.
- canonical `trackId` is identical across the toolchain.
- public fallback is read-only and can never verify a canonical mutation.

## Definition of a guided write

A Phase 7-C guided write is **not a new endpoint** and **not a generic Studio save**.

It is a Studio-guided presentation of an already-existing, allowlisted operation whose canonical owner and backend protections already exist.

Every guided canonical mutation must satisfy all applicable gates below:

1. exact current canonical `trackId`;
2. authenticated private read available before the operation;
3. required operation capability advertised by the deployed bridge;
4. fresh canonical revision (`expectedUpdatedAt`) and, where applicable, fresh ETag/state token;
5. local edit/preview or specialist review before mutation when the underlying operation supports it;
6. explicit human confirmation before the canonical mutation;
7. one narrow operation at a time — no hidden batch action;
8. Track Manager/backend stale and quality guards remain authoritative;
9. no blind retry after ambiguous transport/server failure — reread canonical state first;
10. private canonical reread after success before Studio shows the mutation as verified;
11. exact returned/current identity must still match the requested `trackId`;
12. workflow state and Next Action are recomputed from the reread canonical state, not from optimistic local state.

## Phase 7-B receipt inheritance

The accepted receipt authority remains unchanged:

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

For canonical-write receipts, `VERIFIED` still requires the existing private Track Manager reread, exact ID match, operation-specific evidence and stale-async protection.

A public fallback can never promote a receipt to canonical `VERIFIED`.

## Explicitly forbidden in Phase 7-C

- generic Studio → R2 write API;
- generic `saveTrack` or arbitrary-path mutation surface;
- silent publication;
- silent Album membership/order changes;
- automatic whole-track deletion;
- optimistic success before canonical reread;
- blind retry after an ambiguous write response;
- treating Release Campaign ZIP/export as a canonical write;
- promoting browser-local Release Campaign artwork into R2 without a separately designed, operation-specific Track Manager contract;
- weakening `STALE_MANIFEST`, ETag, state-token, quality, Access or same-origin protections;
- making public fallback capable of writes or write verification.

## Release Campaign remains review-only

The native Release Campaign contract remains frozen:

- MASTER FINAL 16:9 is the anchor;
- 1:1 and 9:16 derive independently from MASTER;
- 9:16 never derives from 1:1;
- browser-local drafts remain browser-local;
- ZIP/export remains `canonicalWrite: false`;
- `campaign-exported` remains `review-only`.

Phase 7-C may guide the artist *to* Release Campaign as a Next Action. It may not reinterpret export as publication or persistence.

## Slice 1 — guided Metadata / Identity completion

The first runtime slice uses the oldest production-proven guarded Studio write path rather than inventing a new backend capability.

Target flow:

```text
Home / Tracks / Workflow Next Action
        ↓
Track → guided Metadata / Identity context
        ↓
edit
        ↓
Validate metadata
        ↓
review normalized proposal + changed fields
        ↓
explicit Save confirmation
        ↓
existing guarded metadata-save operation
        ↓
backend canonical reread
        ↓
Studio private canonical reread
        ↓
VERIFIED + refreshed workflow / next action
```

Slice 1 constraints:

- reuse the existing Metadata validate/save clients and Track Manager operation-specific authority;
- no new Worker route;
- no Track Manager version bump unless implementation audit proves one is genuinely required;
- no R2 mutation performed by deployment itself;
- no auto-save;
- no auto-publish;
- no Album mutation;
- no Lyrics/SonicTrace persistence change;
- Phase 7-B receipt rules remain active;
- public fallback must show the guided action as locked/unavailable rather than offer a fake save path.

### Build 69 implementation candidate

`v0.20.0 · Build 69 · phase7c-slice1-guided-metadata` is the first runtime candidate under PR #99.

Implementation audit confirmed that Track Manager v5.21 / bridge v1.11 already exposes the required production-proven `metadata` capability and guarded validate/save operations, so **no Worker route or Worker deployment is required for this slice**.

Build 69 adds only Studio orchestration around that authority:

- direct Metadata destination from Home when Identity is the workflow Next Action;
- existing direct Tracks / Workflow destinations preserved;
- guided exact-track context in the Track Metadata surface;
- strict post-save Studio reread that rejects public fallback as proof;
- workflow / Next Action recomputation from the reread Track state;
- a focused regression guard preserving all prior guards.

Candidate record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD69.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD69.md).

Build 69 remains **unaccepted** until exact-head CI, anti-drift, exact merge-SHA Pages deployment and real-user browser smoke all pass.

## Runtime acceptance discipline

For every Phase 7-C runtime slice:

```text
safety checkpoint
→ dedicated branch
→ exact-head CI
→ anti-drift main reread
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ deployed real-user smoke
→ only then REAL USER PASS
```

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

## Current cross-stack baseline at Phase 7-C opening

The following is the immutable opening snapshot, retained for history rather than current-state reporting:

```text
Studio main       46b92cbb984cde2c10b4957e425a4fb99d6d5e81
Studio            v0.19.2 · Build 62 · Studio Focus REAL USER PASS
Track Manager     v5.20
Studio bridge     v1.11
TM Worker ID      78609aff-1f4a-4a21-b618-cb97add0c416
LaunchPAD main    d3d162de14d7ad9bbcbc8835b664c4db27b42351
Public Worker     v2.7 · unchanged
LRC Maker         v6.3.8
SonicTrace        V2-E Build 08 · REAL USER PASS
```

Opening safety anchors:

```text
Studio:    safety/pre-phase7c-guided-actions-20260813-1837
LaunchPAD: safety/pre-phase7c-guided-actions-20260813-1837
```

Current Slice 1 safety anchor:

```text
Studio:    safety/pre-phase7c-slice1-build69-20260814-0013
```

## Stop conditions

Stop the slice and do not merge/accept if any implementation requires one of the forbidden authority expansions above, if a write cannot be canonically reread, if public fallback can trigger/verify it, or if the exact runtime candidate fails CI/deployment/real-user smoke.
