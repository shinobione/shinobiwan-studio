# PHASE 8 — Slice 3 Album Health Truth audit

Date: 2026-08-14  
Status: **BUILD76 RUNTIME CANDIDATE — CANONICAL ALBUM OPERATIONAL HEALTH**

Accepted base:

```text
Studio                 v0.19.3 · Build75 · REAL USER PASS
main                   235233a4094149042d751f2273d8cb962ee137e4
Safety pre             safety/pre-phase8-album-health-build76-20260814-2101
Feature branch         agent/phase8-album-health-build76
Track Manager          v5.22 · unchanged
Studio bridge          v1.12 · unchanged
TM Worker Version ID   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker          v2.7 · unchanged
R2 migration           NONE
```

## Audit finding

The accepted stack already has three mature but separate Album-related capabilities:

1. Home / Workflow owns Track production health and the accepted `workflow.nextAction` priority.
2. C3-B Intelligence owns sonic/project analysis: embedding coverage, coherence, outliers, bridges and advisory sequence.
3. Albums / Projects owns canonical Album writes through Track Manager: metadata, `album.trackIds`, order/move and assets.

What was still missing was **operational integrity truth for a canonical Album**.

No current surface answered, without performing a write:

- does the canonical Album have its required cover?;
- is its authoritative `album.trackIds` empty?;
- do all canonical member IDs still resolve to protected Track manifests?;
- which canonical members still have accepted production gaps?;
- does the track-side `track.album` compatibility cache disagree with authoritative `album.trackIds`?;

This is distinct from Build74/75 Track health and distinct from C3-B sonic/project intelligence.

## Build76 bounded scope

### 1. One pure Album health authority

`src/album-health.ts` adds `buildCatalogAlbumHealth()`.

It computes only read-model facts from:

```text
canonical Album manifests
+ protected/private Track catalog when available
+ accepted Track production workflow truth
```

It performs no fetch and no write itself.

### 2. Membership authority remains unchanged

```text
albums/<album-id>/manifest.json
→ album.trackIds = sole canonical membership/order authority
```

Track-side `track.album` is checked only as a compatibility cache.

Build76 can report cache drift in both directions:

- canonical member whose track cache points elsewhere;
- Track cache that claims an Album whose canonical `album.trackIds` does not own that Track.

Reporting drift does **not** promote the cache to authority and does not repair it automatically.

### 3. Public fallback cannot manufacture integrity failures

`getCatalogTracks()` can fall back to the public catalog when the protected Track read is unavailable.

A public projection may omit draft/private state. Therefore Build76 only asserts cross-model facts when every returned Track is marked `readSource === 'private'` and the protected set is non-empty.

Without that evidence:

```text
missing Track refs       NOT ASSERTED
member production gaps   NOT ASSERTED
track.album cache drift  NOT ASSERTED
state                     UNVERIFIED when no local Album issue exists
```

Canonical Album-local facts such as missing cover or empty `album.trackIds` can still be shown because the Album read itself is protected/canonical.

### 4. Member production gaps reuse existing Track truth

Build76 does not invent Album readiness weights or an Album priority engine.

For each resolved canonical member it reuses:

```text
buildCatalogWorkflow()
isProductionWorkflowReady()
existing item.nextAction
```

Affected Track links therefore open the existing Track Next Action context.

### 5. Albums route keeps the accepted editor

Build76 mounts a read-only `AlbumHealthWorkspace` wrapper above the existing `AlbumsWorkspace`.

The existing C3 Album editor remains unchanged and remains the only daily Album mutation surface.

The health layer shows:

- canonical release count;
- verified healthy count;
- attention count;
- cross-check-unverified count;
- per-Album cover / empty tracklist / broken refs / production gaps / compatibility-cache drift;
- direct existing Next Action links for member production gaps;
- a scroll-to-editor affordance for Album-local review.

No Album repair button or batch action is introduced.

## Explicit non-scope

Build76 does **not**:

- add or alter a Track Manager route;
- add a generic Studio writer;
- deploy an admin/public Worker;
- mutate or migrate R2;
- repair Album caches automatically;
- redefine Album membership authority;
- add an Album readiness score;
- duplicate C3-B embedding/coherence/outlier/sequence intelligence;
- add another Workflow queue or priority model;
- auto-publish Tracks or Albums;
- change Lyrics/SonicTrace/Release authority.

## Historical guard discoveries

The first three validation runs exposed only old presentation guards that required `AlbumsWorkspace` to be mounted directly in `App.tsx`.

Build76 preserves their real contracts and updates them to recognize the bounded read-only wrapper while still proving the canonical editor and migration separation remain intact.

```text
Initial head / CI       1b5a9992382658c4b66ccead13d9c09c8c4cdf25 · 31832120410 · FAILURE
Cause                   C3 Album UX guard pinned direct AlbumsWorkspace mount

Second head / CI        83ced488d1bc77b0da781026b416bee700aa10bc · 31832220250 · FAILURE
Cause                   C2.5-D Album authority guard pinned direct mount

Third head / CI         b932236bea41e349e5291108e6d8622b5e88f38e · 31832282694 · FAILURE
Cause                   C2.5-E migration-separation guard pinned direct mount

Corrected head / CI     bf4dd033c61d6c124c84b74f284f6399ea5b5340 · 31832367787 · SUCCESS
```

No failed run exposed a TypeScript/runtime/backend fault. The final corrected runtime head passed inherited Phase0–8/C3/UX/Focus guards, typecheck and Vite build.

## Acceptance gate

Build75 remains the accepted runtime until Build76 completes:

```text
final exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user browser smoke
→ only then REAL USER PASS
```

**CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS.**
