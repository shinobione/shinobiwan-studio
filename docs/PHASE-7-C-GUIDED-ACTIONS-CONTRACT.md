# PHASE 7-C — Guided end-to-end actions contract

Status: **ACTIVE — SLICE 1 REAL USER PASS / SLICE 2 REAL USER PASS**

Authorization: explicit user `GO PHASE 7-C` on 2026-08-13; runtime authorization renewed after Build68, with broad continuation authorization renewed on 2026-08-14 after Build71 REAL USER PASS.

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

## Slice 1 — guided Metadata / Identity completion · ACCEPTED

Accepted runtime flow:

```text
Home / Tracks / Workflow Next Action
        ↓
Track → guided Metadata / Identity context
        ↓
edit
        ↓
Validate metadata
        ↓
review normalized proposal + changed fields + exact quality issues
        ↓
explicit Save / Publish confirmation
        ↓
existing guarded metadata operation
        ↓
backend canonical verification
        ↓
Studio private canonical reread
        ↓
VERIFIED + refreshed workflow / next action
```

The accepted Slice1 runtime is the cumulative Build69→70→71 chain:

```text
Build69  guided Metadata / Identity routing and private reread semantics
Build70  readiness/publication separation + Album semantics + New Track safe publish flow
Build71  canonical audio-duration evidence corrective + TM5.22 / bridge1.12 · REAL USER PASS
```

Accepted record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

## Slice 2 — guided Core Media · ACCEPTED

Slice2 extends the same guided-action contract to the first unresolved production prerequisite after Identity: **Core Media**.

Canonical stage order:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

### Existing protected authority reused

Track Manager v5.22 / bridge v1.12 already exposes the production-proven `assets` capability and protected `asset-upload-v1` operation. No new Worker route, Track Manager bump or Worker deployment was required.

The existing asset client preserves:

- exact valid `trackId`;
- advertised `assets` capability;
- required `expectedUpdatedAt`;
- private canonical reread before mutation;
- stale revision hard stop;
- explicit one-asset confirmation in Studio;
- no blind retry after ambiguous transport failure;
- private canonical reread after mutation;
- exact manifest revision + asset presence verification;
- Build71 audio-duration evidence for audio uploads.

### Guided Core Media flow

```text
master audio missing
→ Fix Core media
→ Track / overview
→ existing Master audio AssetsManager
→ explicit confirmation
→ existing asset-upload-v1
→ canonical verification
→ workflow recompute

master audio ready + cover missing
→ Continue Core media
→ Visuals / assets
→ existing Cover AssetsManager
→ explicit confirmation
→ existing asset-upload-v1
→ canonical verification
→ workflow recompute

Audio + Cover ready
→ continue to Lyrics
```

### Stage ownership and status truth

Build72 corrected two orchestration defects:

1. missing master audio previously routed to `assets`, but that workspace section is Visuals and contains no audio uploader;
2. aggregate Track Manager quality error counts were treated as Identity work, allowing media/lyrics errors to hijack stage priority.

Build73 then closed the real-user-smoke presentation mismatch found on Zero-SUM:

```text
Visuals ready = canonical cover present
Canvas        = optional
Lyrics ready  = canonical lyrics.txt + recognized timestamps
TXT only      = attention / Timing needed
```

Accepted stage ownership:

- Identity owns explicit identity prerequisites only;
- Core Media owns required master audio and cover presence;
- Lyrics owns canonical lyrics source/timing prerequisites;
- Intelligence owns SonicTrace availability/freshness;
- Release retains the aggregate Track Manager quality gate;
- Home, Tracks, Workflow and Track Workspace use the same `workflow.nextAction` authority.

### Slice2 acceptance evidence

```text
Build72 safety pre       safety/pre-phase7c-slice2-build72-20260814-1221
Build72 PR               #103
Build72 tested head      b79ce03a98fad46e6bf4c488e456af07bba951be
Build72 CI               31792368962 · SUCCESS
Build72 runtime merge    dceee27dd8f8cdc96f8f88f10c5588e283e56699
Build72 Pages            31792436456 · SUCCESS
Build72 post-deploy      safety/post-build72-deployed-candidate-20260814-1230

Build73 safety pre       safety/pre-build73-status-truth-corrective-20260814-1312
Build73 PR               #105
Build73 tested head      b6dc39e7555aa040740de5efa54bd75b1e78101a
Build73 CI               31795481278 · SUCCESS
Build73 runtime merge    4684291f64d12bd514f103ba1c5050d05d0143ac
Build73 Pages            31795547072 · SUCCESS · exact merge SHA
Build73 post-deploy      safety/post-build73-deployed-candidate-20260814-1318
Build73 post-RUP         safety/post-build73-real-user-pass-20260814-1715
Real-user verdict        BUILD73 PASS

Track Manager            v5.22 · unchanged
Studio bridge            v1.12 · unchanged
TM Worker Version ID     df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker            v2.7 · unchanged
```

Accepted record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD73.md).

Historical distinction:

```text
Build72  Slice2 origin · merged/deployed candidate
Build73  Slice2 corrective · REAL USER PASS
```

Build72 is not retroactively relabeled as accepted.

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

## Historical cross-stack baseline at Phase 7-C opening

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

Current Phase 7-C safety anchors:

```text
Slice1 pre         safety/pre-phase7c-slice1-build69-20260814-0013
Build71 post-RUP   safety/post-build71-real-user-pass-20260814-1217
Slice2 pre         safety/pre-phase7c-slice2-build72-20260814-1221
Build72 deployed   safety/post-build72-deployed-candidate-20260814-1230
Build73 pre        safety/pre-build73-status-truth-corrective-20260814-1312
Build73 deployed   safety/post-build73-deployed-candidate-20260814-1318
Build73 post-RUP   safety/post-build73-real-user-pass-20260814-1715
```

## Next slice

No Slice3 runtime is started by this contract closeout. A new slice requires a fresh GitHub/deployment audit, explicit scope, unused build number, fresh safety checkpoint, exact-head CI, exact deployment proof and a new real-user smoke gate.

## Stop conditions

Stop the slice and do not merge/accept if any implementation requires one of the forbidden authority expansions above, if a write cannot be canonically reread, if public fallback can trigger/verify it, or if the exact runtime candidate fails CI/deployment/real-user smoke.
