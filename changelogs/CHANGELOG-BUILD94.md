# SHINOBIWAN Studio — Build94

Date: 2026-08-15  
Version: `v0.19.16`  
Build: `94`  
Codename: `studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth`  
Status: **REAL USER PASS · ACCEPTED**

## Fresh-audit decision

After accepted Build93, the fresh read-only Phase9 audit compared Album asset-upload response-loss truth, Album create response-loss truth, degraded/offline/PWA resilience, Deep Audio compute transport, Track create/assets, and remaining non-mutating validation seams.

Album create/upload remain causality-heavy mutations. Track create/assets are writes. Deep Audio `/api/studio/analyze` is non-canonical compute but may run for many minutes, so automatic retry could duplicate expensive work while the first request is still processing. The smallest coherent gap is canonical Lyrics **validation**.

`lyrics-validate-v1` is explicitly non-mutating and already had a finite 9-second timeout, but `validateAdminTrackLyrics()` still made only one attempt. A non-timeout browser fetch interruption on that validation path could also be surfaced as a misleading Cloudflare Access problem.

## Build94 scope

Build94 changes only Studio-side non-mutating `lyrics-validate-v1`:

- visible Lyrics **Validate** action;
- exact canonical Track revision + Lyrics ETag validation boundary;
- one bounded retry after timeout, browser transport interruption or HTTP `408/425/429/500/502/503/504`;
- maximum two total attempts;
- finite 9-second timeout per attempt;
- Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal are never retried.

It does **not** change:

- `lyrics-save-v1` transport;
- Build83 lost-response recovery;
- canonical `lyrics.txt` authority;
- Track create/assets;
- Album operations;
- SonicTrace / Deep Audio operations;
- Track Manager / Worker code;
- R2 schema/data;
- PWA/offline behavior.

## Frozen save boundary

Build83 remains unchanged:

```text
lyrics-save-v1 response unavailable
→ NEVER blind automatic retry
→ private canonical Lyrics + Track reread
→ committed / not-committed / ambiguous / unverified
```

Build94 keeps the zero automatic save retry boundary explicit as `maxAutomaticSaveRetries: 0`.

## Guard

`scripts/test-phase9-lyrics-validation-transient-retry-build94.mjs` protects:

- Build94 release identity + accepted Build93 ancestry;
- exact `lyrics-validate-v1` intent;
- explicit transient HTTP allowlist;
- finite 9-second timeout per attempt;
- exactly one retry / two total attempts;
- timeout + transport + transient HTTP retry only;
- Access and invalid-response non-retry;
- visible Lyrics Validate action using the hardened service;
- validation remaining explicitly non-mutating;
- inherited Build83 save timeout/transport + response-loss truth;
- zero automatic Lyrics save retry;
- inherited Phase9 Build82→Build93 gate.

The clean Build94 v2 exact-head CI also carries the inherited successor-guard alignment discovered during the reverted first attempt: private-read contract, Phase7-C Build69, Build90 Lyrics private-read and Studio Focus Build64–67 recognize Build94 while retaining their functional assertions.

## Red-merge rollback and clean reconstruction

The first Build94 candidate was merged before the inherited full-gate incompatibilities were fully resolved. Pages `31902471804` failed on the inherited private-read Lyrics POST count guard. Rather than stacking a hotfix onto a red runtime, the candidate was rolled back.

```text
Original runtime PR      #166
Original head            5f453868cc8cd2878e6964e3e747f841a5dde4c0
Original merge           5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Failed Pages             31902471804
Rollback main            6c9c677b2f6299d13949642b712f2bf39b48b676
Rollback Pages           31907580912 · SUCCESS
Superseded hotfix PR     #167 · CLOSED / SUPERSEDED
```

The rollback restored byte-identical accepted Build93 content. Build94 v2 was then reconstructed cleanly from that restored accepted tree with all inherited guard compatibility included before merge.

## Accepted runtime receipts

```text
Clean feature branch     phase9/build94-lyrics-validation-retry-v2
Reapply commit/head      81298582163505a11378fe1094f800f1f3d437b5
Runtime PR               #169
Full CI                  31907745153 · SUCCESS
Runtime merge            fe636560de9ca5f3f33aae76dddc5474ba990f17
Runtime Pages            31907784289 · SUCCESS · build + deploy
Safety post-deploy       safety/post-build94-deployed-candidate-20260815-2338
Safety post-acceptance   safety/post-build94-real-user-pass-20260815-2346
Worker deploy            NONE
Track Manager change     NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD94 PASS MADAFAKA · 2026-08-15
Build95                  UNALLOCATED pending fresh post-Build94 audit
```

## Real-user acceptance

The bounded normal-browser smoke received explicit **`BUILD94 PASS MADAFAKA`** on 2026-08-15.

The human smoke covered the deployed `v0.19.16 · Build94` runtime, normal canonical Lyrics loading on an existing Track, the visible non-mutating **Validate** path, unchanged canonical lyrics after reload, and surrounding Track / Albums / SonicTrace / Lyrics navigation sanity.

Acceptance deliberately did **not** cut network, invalidate Cloudflare Access or manufacture timeout/transport/transient-HTTP branches merely to trigger the retry. Automated guards own retry classification and the maximum-two-attempt proof.

No Lyrics save was required for this validation-only slice. Build83 lost-response recovery and the zero automatic Lyrics save retry boundary remain unchanged.

## Closeout truth

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build94 has now crossed all three states and is **REAL USER PASS / ACCEPTED**. Build95 remains unallocated until acceptance-docs CI/merge/Pages closeout is complete and a fresh read-only post-Build94 Phase9 audit proves the next smallest coherent gap.