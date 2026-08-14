# SHINOBIWAN Studio v0.19.3 · Build 72

Codename: `studio-focus-slice4-phase7c-slice2-guided-core-media`  
Date: 2026-08-14  
Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

## Scope

Phase 7-C Slice 2 extends the accepted guided-action model from Metadata / Release into the first unresolved production prerequisite after Identity: **Core Media**.

The slice deliberately reuses the existing protected Track Manager `asset-upload-v1` operation. It does not add a generic Studio write surface and does not require a Track Manager or Worker version bump.

## Audit findings

The accepted workflow order is:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Two routing problems prevented Core Media from being a truthful guided Next Action:

1. `mediaStage()` routed a missing master audio to workspace section `assets`, but `assets` is the Visuals surface and exposes cover / thumbnail / Canvas only. The canonical master audio uploader lives under Track / `overview`.
2. `identityStage()` treated the aggregate Track Manager quality error count as an Identity problem. A media or lyrics quality error could therefore make Studio recommend `Continue Identity` before the stage that actually owned the prerequisite.

## Build 72 behavior

### Truthful stage ownership

Identity now owns its explicit identity prerequisites only:

- title;
- type;
- status;
- Album/release binding;
- valid release year when a year is present.

Aggregate Track Manager quality remains authoritative at the final Release stage. Build72 does **not** hide or downgrade canonical quality errors; it prevents unrelated errors from masquerading as Identity work.

### Guided Core Media destinations

```text
master audio missing
→ Fix Core media
→ Track / overview
→ existing Master audio AssetsManager
→ explicit confirmation
→ asset-upload-v1
→ stale guard + canonical reread
→ workflow recompute

master audio ready + cover missing
→ Continue Core media
→ Visuals / assets
→ existing Cover AssetsManager
→ explicit confirmation
→ asset-upload-v1
→ stale guard + canonical reread
→ workflow recompute
```

When both audio and cover are ready, the workflow advances to Lyrics instead of keeping Core Media open.

## Existing protected asset authority reused

`src/services/phase4-admin-api.ts` already provides the required safety contract:

- advertised `assets` capability required;
- exact canonical `trackId`;
- `expectedUpdatedAt` required;
- private canonical reread before mutation;
- stale revision hard stop;
- one asset per operation;
- explicit user confirmation in the existing AssetsManager;
- no blind retry after ambiguous transport failure;
- canonical reread after the operation;
- exact updated manifest + asset presence verification;
- audio-duration evidence from Build71 retained;
- no `saveTrack` / arbitrary-path writer.

Therefore Build72 is **Studio orchestration only**. Track Manager remains v5.22 / Studio bridge v1.12 and the public Worker remains v2.7 unchanged.

## Safety

Accepted base before Slice 2:

```text
Studio accepted main  5324922fab4e7493bac69c3046b5f585c25fef07
Studio accepted       v0.19.3 · Build71 · REAL USER PASS
Track Manager         v5.22
Studio bridge         v1.12
TM Worker Version ID  df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker         v2.7 · unchanged
```

Fresh rollback checkpoint:

`safety/pre-phase7c-slice2-build72-20260814-1221`

Feature branch:

`agent/phase7c-slice2-guided-core-media-build72`

Post-deploy candidate checkpoint:

`safety/post-build72-deployed-candidate-20260814-1230`

## Regression guard

Build72 adds `scripts/test-phase7-c-guided-core-media-build72.mjs` and wires it into `check:phase7`.

The guard proves:

- Build72 identity/codename;
- audio-missing routes to Track / overview;
- cover-missing routes to Visuals / assets;
- workflow priority remains Identity → Media → Lyrics → Intelligence → Release;
- aggregate quality still blocks Release;
- the routed surfaces actually contain the expected audio / visual AssetsManager controls;
- existing Track Manager capability, stale, ambiguous-write and reread guards remain present;
- no generic `saveTrack` path appears.

## Exact candidate evidence

```text
Accepted base          5324922fab4e7493bac69c3046b5f585c25fef07
Feature tested head    b79ce03a98fad46e6bf4c488e456af07bba951be
Studio CI              31792368962 · SUCCESS
PR                     #103 · merged exact tested head
Runtime merge          dceee27dd8f8cdc96f8f88f10c5588e283e56699
Pages deployment       31792436456 · SUCCESS · exact merge SHA
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
TM Worker Version ID   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker          v2.7 · unchanged
R2 deployment mutation none
Real-user smoke        PENDING
```

## Remaining acceptance gate

Only the real-user browser smoke remains before Build72 can replace Build71 as the accepted Studio baseline.

Required smoke:

- a track missing audio must recommend `Fix Core media` and land on Track / Master audio, not Visuals;
- a verified master upload must refresh canonical state and advance the Next Action to cover when cover is missing;
- cover Next Action must land in Visuals;
- after audio + cover are ready, workflow must advance to Lyrics;
- public fallback must remain unable to perform the upload;
- explicit confirmation and canonical reread verification must remain visible.

**CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS.**
