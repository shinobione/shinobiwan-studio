# SHINOBIWAN Studio — Build95

Date: 2026-08-15  
Version: `v0.19.17`  
Build: `95`  
Codename: `studio-focus-slice4-phase9-albums-daily-resilient-service-convergence`  
Status: **REAL USER PASS · ACCEPTED**

## Fresh-audit decision

The post-Build94 read-only audit rechecked the known heavy reliability candidates: Album create response-loss truth, Album binary upload response-loss truth, degraded/offline/PWA resilience, Deep Audio transport/compute behavior, Track create/assets and any smaller bounded seams.

Album create still lacks a persisted operation identifier sufficient to prove exact causality after an absent→present transition when the POST response disappears. Album binary upload still lacks a request-side digest/operation identifier sufficient to prove the canonical asset is exactly the selected bytes after response loss. Blind retry of long-running Deep Audio compute may duplicate expensive work while the first request is still running.

The audit found a smaller and more immediate cross-stack gap: the accepted resilient Album mutation engines from Build85/86/87 already existed, but the **actual daily Albums route** was not consuming them.

Canonical route proof:

```text
App.tsx
  route === 'albums'
    → AlbumHealthWorkspace
      → AlbumsWorkspace
```

Before Build95, `AlbumsWorkspace.tsx` still called the older generic Album metadata / membership / move mutations from `album-admin-api.ts`, while the inherited Build85/86/87 guards protected the resilient services through `AlbumManager.tsx`. The hardened engines were present and green, but the focused daily Albums editor could bypass their response-loss truth.

## Build95 scope

Build95 is deliberately a **wiring convergence**, not a new recovery algorithm.

The real daily `AlbumsWorkspace` now uses:

- `saveAdminAlbumMetadataResilient()` — accepted Build85 metadata save truth;
- `saveAdminAlbumMembershipResilient()` — accepted Build87 ordered membership + Track-cache truth;
- `moveAdminAlbumTrackResilient()` — accepted Build86 target/source/Track-cache move truth.

The daily UI also surfaces the existing truthful recovered-success distinction:

```text
RECOVERED AFTER LOST RESPONSE
→ canonical operation-specific postcondition verified
→ Studio did not retry the write
```

Normal success copy now reflects the full canonical verification already provided by those services, including Album + Track-cache verification for membership and target/source/Track-cache verification for move.

## Frozen out-of-scope operations

Build95 does **not** change:

- Album create semantics or transport;
- Album cover/thumbnail upload semantics or transport;
- Album asset delete semantics;
- any Build85/86/87 resilient service algorithm;
- Track operations;
- Lyrics operations;
- SonicTrace / Deep Audio operations;
- Track Manager / Worker code;
- R2 schema/data;
- LaunchPAD;
- LRC Maker;
- PWA/offline behavior.

`createAdminAlbum`, `uploadAdminAlbumAsset` and `deleteAdminAlbumAsset` remain on their existing paths. Build95 does not falsely claim those operation families gained new response-loss guarantees.

## Guard

`scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs` protects:

- Build95 release identity + accepted Build94 ancestry;
- actual daily route `App → AlbumHealthWorkspace → AlbumsWorkspace`;
- daily metadata save wired to Build85 resilient service;
- daily ordered membership save wired to Build87 resilient service;
- daily Album move wired to Build86 resilient service;
- generic metadata/membership/move mutations absent from the daily workspace;
- recovered-after-lost-response truth and explicit no-retry copy;
- inherited Build85/86/87 operation-specific no-blind-retry policies;
- create/upload/delete remaining explicitly out of Build95 scope;
- inherited Phase9 Build82→Build94 gate;
- Build95 guard included in repository-native Phase9/full build gate.

## Validation history

The first two Build95 CI runs were intentionally **not merged** and are retained as historical successor-guard evidence:

```text
CI #477 / run 31911328839  FAILURE
  → inherited Phase7-C Build69 successor cap stopped at v0.19.16
  → private-read, Phase5, Phase6, C3 and UX had already passed

CI #482 / run 31911459367  FAILURE
  → after Build69 + Focus64–67 bounded successor alignment
  → inherited Build93 successor cap stopped at Build94
  → Phase7, Phase8 and Phase9 Build82→92 had already passed
```

No Build95 product behavior was changed to repair those runs. Only inherited successor allowlists/ancestry assertions were widened to recognize `v0.19.17 / Build95` while retaining their functional assertions.

Final exact-head validation and deployed-candidate receipts:

```text
Runtime PR              #171
Exact tested head       f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Final full CI           31911514334 · SUCCESS
Runtime merge           0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages           31911568069 · SUCCESS · build + deploy on exact merge SHA
Candidate docs PR       #172
Candidate docs CI       31911702567 · SUCCESS
Candidate docs merge    1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages    31911746874 · SUCCESS · build + deploy on exact docs merge SHA
Acceptance docs PR      #173
Acceptance docs CI      31912389047 · SUCCESS
Acceptance docs merge   f6738d56eddcadc2810c7d5413700e14b20f71a3
Acceptance docs Pages   31912432617 · SUCCESS · build + deploy on exact docs merge SHA
Safety pre              safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815
Safety pre-PR           safety/post-build95-prepr-20260815
Safety green pre-merge  safety/post-build95-green-premerge-20260815
Safety post-deploy      safety/post-build95-deployed-candidate-20260815
Safety candidate docs   safety/post-build95-candidate-docs-closeout-20260815
Safety post-acceptance  safety/post-build95-real-user-pass-20260816
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
Real-user smoke         BUILD95 PASS MADAFAKA · 2026-08-16
```

## Real-user acceptance — 2026-08-16

Explicit human verdict:

```text
BUILD95 PASS MADAFAKA
```

The bounded normal-browser smoke covered the **real daily Albums route** after hard refresh:

- deployed `v0.19.17 · Build95` identity visible;
- an existing safe Album opened from the normal Albums surface;
- one harmless/reversible metadata save completed normally and persisted after reload;
- one ordered tracklist save completed normally and persisted after reload;
- the `Move to…` control remained present/coherent; no unnecessary destructive real-world move was required merely to manufacture evidence;
- surrounding `Albums → Track → Lyrics → SonicTrace → Albums` navigation remained healthy.

No network cut, Cloudflare invalidation or fabricated lost-response failure was performed. Automated guards own the response-loss classification and prove that the daily UI traverses the already accepted Build85/86/87 resilient services. Album create, binary upload and asset delete remain outside Build95 scope.

## Accepted boundary

```text
Build95 = REAL USER PASS / ACCEPTED · seven-document closeout complete
Build96 = UNALLOCATED pending fresh read-only audit
```

Build95 closes the daily Albums resilient-service convergence gap without changing Track Manager authority, Worker code, R2 schema/data or the operation semantics of create/upload/delete.