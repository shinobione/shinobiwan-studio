# PHASE 7-A — END-TO-END WORKFLOW OVERVIEW

Studio: `v0.16.0 · Build 46`  
Codename: `phase7-a-workflow-overview`  
Date: 2026-08-12  
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

## Authorization

The user explicitly authorized beginning Phase 7 on 2026-08-12 and asked that the work continue with full README/.MD/rollback documentation.

The authorization happened while the final LaunchPAD Build 102 Visual Card smoke and Studio Build 45 Track-To-Market bridge smoke were still pending. Those earlier subjective acceptance gates remain pending; Phase 7 authorization does not rewrite their history.

## Safety boundary

The latest Studio checkpoint after Track-To-Market Build 45 and before Phase 7 source changes is:

` safety/pre-phase7-authorized-post-build45-20260812-0232 `

An older pre-Build45 Phase 7 checkpoint also exists, but Build 46 must roll back to the **post-Build45** anchor above so the Track-To-Market candidate is preserved.

## Why Phase 7-A starts read-only

The specialized products already have deliberately separated authorities:

- Track Manager owns protected canonical writes;
- LRC Maker owns synchronization UX while `lyrics.txt` remains canonical;
- SonicTrace owns audio analysis, with R2 sidecars persisted through guarded paths;
- Track-To-Market creates release-pack ideas/finals but is not canonical authority;
- LaunchPAD is public/read-only listener UX;
- Studio orchestrates.

The safest first end-to-end slice is therefore not a new mega-write endpoint. It is a single queue that answers:

**What does this track still need, and where is the already-validated place to do it?**

## Phase 7-A pipeline

```text
Identity → Core media → Lyrics → SonicTrace → Release
```

Each canonical Track gets five derived stages.

### Identity

Uses existing canonical track identity and quality data:

- title;
- type;
- status;
- Album/release binding;
- canonical quality error count when available.

Destination: Track Workspace `Metadata`.

### Core media

Uses existing asset state:

- Audio is a hard blocker when missing;
- Cover is attention-required when missing;
- Canvas/video is informative/optional and does not block this stage when Audio + Cover are present.

Destination: `Assets`.

### Lyrics

Uses the frozen canonical contract:

- no `lyrics.txt` → attention;
- TXT without recognized timestamps → attention;
- canonical TXT + timestamps → ready.

Destination: `Lyrics`.

No `.lrc` requirement is introduced.

### SonicTrace

Uses existing Studio `audioIntelligence` state:

- no analysis → attention;
- outdated analysis → attention;
- current analysis → ready.

Destination: `SonicTrace`.

### Release

Uses existing quality/publishing projection:

- canonical quality error or explicit `publishable === false` → blocked;
- published but missing catalog visibility → blocked;
- published + catalog-visible → ready;
- non-published + quality-ready → ready for release review;
- unknown readiness → attention.

Destination: existing publishing/metadata route; Build 46 does not publish anything automatically.

## Next Action policy

One deterministic next action is derived in this priority order:

1. Identity;
2. Core media;
3. Lyrics;
4. SonicTrace;
5. Release.

The action is only a deep-link into the existing Track Workspace section. No action executes a write from the Workflow page.

## User surface

New first-class route:

`#/workflow`

New Studio sidebar entry:

`Workflow`

The surface provides:

- total canonical tracks;
- workflow-ready count;
- Needs Attention count;
- blocked count;
- missing/outdated SonicTrace count;
- search;
- filters for Needs Attention, Blocked, Draft/unpublished, Ready and All;
- five-stage per-track rail;
- prioritized Next Action.

The page visibly states `READ ONLY` and identifies whether it is reading private canonical state or the public fallback.

## Mutation firewall

Phase 7-A intentionally imports none of the mutation surfaces used elsewhere in Studio. The dedicated guard rejects Phase 7-A source if it begins importing known track/asset/SonicTrace/catalog/Album write symbols.

Build 46 does **not**:

- POST/PATCH/PUT/DELETE from the Workflow component;
- mutate Track Manager;
- write R2;
- save SonicTrace;
- save Lyrics;
- publish/unpublish a Track;
- change Album membership/order;
- persist a Track-To-Market FINAL;
- alter LaunchPAD;
- deploy a Worker.

## Track-To-Market inheritance

Build 46 is based on Studio Build 45 and preserves its `Release Pack` Bridge V2 integration. Phase 7-A does not change the Bridge V2 origin, context handshake, matching-track FINAL gate or transient-only return state.

Build 45 real-user smoke remains separately pending.

## LaunchPAD / PHASE UX inheritance

LaunchPAD Build 102 is a separate C3-C Visual Card candidate. Its final user check remains pending. Phase 7-A does not import or change LaunchPAD runtime code.

## Regression guard

`scripts/test-phase7-workflow-build46.mjs` verifies:

- Studio 0.16.0 / Build 46 identity;
- the `workflow` route/nav/render path;
- five-stage canonical model inputs;
- deep-link Next Actions;
- visible read-only/no-write boundary;
- reduced-motion styling;
- absence of known mutation imports and direct HTTP write patterns from Phase 7-A.

`check:phase7` is part of the production `npm run build` chain.

## Real-user acceptance checklist

When the user returns:

1. verify sidebar shows `PHASE 7-A` and `v0.16.0 · Build 46`;
2. open `Workflow`;
3. compare 2–3 tracks with their actual Track Workspace state;
4. verify a missing Lyrics/analysis/media stage is truthful;
5. click Next Action and confirm the expected Track Workspace section opens;
6. change nothing and confirm canonical data remains unchanged;
7. verify mobile/tablet layout does not create horizontal page overflow.

Only then mark Phase 7-A `REAL USER PASS`.

## Planned continuation after 7-A

### Phase 7-B — Contextual continuation receipts

Specialist tools can report completion to Studio; Studio then re-reads canonical state instead of trusting optimistic local state.

### Phase 7-C — Guided end-to-end actions

A guarded resumable sequence can guide New Track → media → metadata → lyrics → analysis → release readiness using existing operation owners and explicit confirmations.

Neither follow-up is implemented by Build 46.