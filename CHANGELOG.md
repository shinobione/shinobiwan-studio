# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.16 · Build94 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build94 hardens canonical Lyrics **validation only**. `lyrics-validate-v1` is non-mutating, so the visible Lyrics Validate flow may receive one bounded retry after a transient failure without changing save semantics.

Accepted behavior:

- timeout / browser transport interruption / HTTP `408/425/429/500/502/503/504` may receive exactly one retry;
- maximum attempts are two total;
- finite 9-second timeout remains per validation attempt;
- Access/session gating and deterministic ordinary 4xx are never retried;
- invalid JSON / invalid proposal shape are never retried;
- visible Lyrics **Validate** uses the hardened service;
- `lyrics-validate-v1` remains explicitly non-mutating;
- `lyrics-save-v1` remains at **zero automatic retries**;
- Build83 `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` and committed / not-committed / ambiguous / unverified response-loss recovery are unchanged;
- Track create/assets, Album operations, SonicTrace/Deep Audio operations and PWA/offline remain out of scope;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD94 PASS MADAFAKA`** on 2026-08-15;
- acceptance did not deliberately cut network or invalidate Cloudflare Access to manufacture a transient retry; automated guards own that failure-path proof.

Exact accepted runtime evidence:

```text
Original runtime PR       #166 · rolled back after red Pages inherited guard
Original merge            5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Original Pages            31902471804 · FAILURE
Rollback main             6c9c677b2f6299d13949642b712f2bf39b48b676 · byte-identical accepted Build93 tree
Rollback Pages            31907580912 · SUCCESS
Superseded hotfix PR      #167 · CLOSED / SUPERSEDED
Clean runtime PR          #169
Exact tested head         81298582163505a11378fe1094f800f1f3d437b5
Validation                31907745153 · SUCCESS
Runtime merge             fe636560de9ca5f3f33aae76dddc5474ba990f17
Runtime Pages             31907784289 · SUCCESS · exact runtime merge SHA
Safety post-deploy        safety/post-build94-deployed-candidate-20260815-2338
Safety post-acceptance    safety/post-build94-real-user-pass-20260815-2346
Track Manager             v5.23 · unchanged
Studio bridge             v1.13 · unchanged
TM Worker Version ID      439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker             v2.7 · unchanged
Worker deploy             NONE
R2 migration/write        NONE caused by implementation/deployment
Real-user smoke           BUILD94 PASS MADAFAKA · 2026-08-15
Build95                   UNALLOCATED pending fresh post-Build94 audit
```

The first Build94 merge is retained as explicit safety history. Pages exposed inherited guard assumptions that still expected the pre-Build94 Lyrics POST shape. The runtime was rolled back rather than hotfixed in-place; Build94 v2 was reconstructed cleanly from restored accepted Build93 with private-read, Phase7-C Build69, Build90 and Focus64–67 successor guard alignment included **before** merge. Full CI `31907745153` then passed the complete repository-native chain on the exact #169 head.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD94.md`](changelogs/CHANGELOG-BUILD94.md).

## Accepted predecessor

### v0.19.15 · Build93 — 2026-08-15

Codename: `studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build93 hardens canonical Track **metadata validation only**. `metadata-validate-v1` is non-mutating, so the visible Validate flow and Build92 fresh pre-save validation may receive one bounded retry after a transient failure without changing write semantics.

Accepted behavior:

- plain and duration-aware metadata validation use the same bounded policy;
- timeout / browser transport interruption / HTTP `408/425/429/500/502/503/504` may receive exactly one retry;
- maximum attempts are two total;
- Access/session gating and deterministic ordinary 4xx are never retried;
- invalid JSON / invalid proposal shape are never retried;
- finite 7-second timeout remains per validation attempt;
- visible **Validate** uses the hardened wrapper;
- Build92's fresh validation immediately before explicit Save uses the same wrapper;
- Build92 `metadata-save-v1` remains zero automatic write retries;
- Build92 committed / not-committed / ambiguous / unverified response-loss recovery is unchanged;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD93 PASS MADAFAKA`** on 2026-08-15.

Exact acceptance evidence:

```text
Runtime PR                #162
Exact tested head         fcbe4c59a3a364d9665eba2ed432f37475116364
Validation                31898542379 · SUCCESS
Runtime merge             6c1ceb7d59971ec6c7e251532054392f02c08157
Runtime Pages             31898639778 · SUCCESS
Candidate docs PR         #163 · CI 31899284370 · merge 6464659428e34a679c8acfeb481bfaca78e05bc7 · Pages 31899342536
Acceptance docs PR        #164 · CI 31901050237 · merge 8df0417ee4d96de1e1b386c0fb15af60dcdbc661 · Pages 31901109789
Real-user smoke           BUILD93 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD93.md`](changelogs/CHANGELOG-BUILD93.md).

## Accepted Phase9 lineage

### v0.19.14 · Build92 — Track metadata response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #158;
- exact-head CI `31893496536` SUCCESS;
- merge `d0ca8b3aa4481c3217f79790e347000bfd22823a`;
- Pages `31893652679` SUCCESS;
- explicit verdict `BUILD92 PASS MADAFAKA`;
- one metadata write is anchored to exact reviewed proposal + expected Track revision;
- lost response is never blindly retried and is classified by private canonical Track reread.

Detailed record: [`changelogs/CHANGELOG-BUILD92.md`](changelogs/CHANGELOG-BUILD92.md).

### v0.19.13 · Build91 — SonicTrace private-read transient retry truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #154;
- exact-head CI `31888303536` SUCCESS;
- merge `591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6`;
- Pages `31888346988` SUCCESS;
- explicit verdict `BUILD91 PASS MADAFAKA`;
- private SonicTrace latest/history/catalog GETs receive at most one bounded transient retry;
- SonicTrace save POST and Deep Audio compute remain unchanged.

Detailed record: [`changelogs/CHANGELOG-BUILD91.md`](changelogs/CHANGELOG-BUILD91.md).

### v0.19.12 · Build90 — Lyrics private-read transient retry truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #150;
- exact-head CI `31884568681` SUCCESS;
- merge `8a851a7d53d3b4f45359c7036011684441bb25bb`;
- Pages `31884614863` SUCCESS;
- explicit verdict `BUILD90 PASS MADAFAKA`;
- canonical Lyrics GET receives at most one bounded transient retry;
- Build83 Lyrics save POST/recovery remains unchanged.

Detailed record: [`changelogs/CHANGELOG-BUILD90.md`](changelogs/CHANGELOG-BUILD90.md).

### v0.19.11 · Build89 — Album private-read transient retry truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #147;
- exact-head CI `31881635973` SUCCESS;
- merge `b7ae769c66e9adccef79c80467cc8fd0a8534820`;
- Pages `31881682269` SUCCESS;
- explicit verdict `BUILD89 PASS MADAFAKA`;
- canonical Album collection/detail GETs receive at most one bounded transient retry;
- Album POST/write paths remain unchanged.

Detailed record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

### v0.19.10 · Build88 — core private-read transient retry truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #144;
- exact-head CI `31871980725` SUCCESS;
- merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS;
- explicit verdict `BUILD88 PASS MADAFAKA`;
- core private Track Manager GETs receive at most one bounded transient retry;
- no write retry was introduced.

Detailed record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

### v0.19.9 · Build87 — Album membership response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #141;
- CI `31870328730` SUCCESS;
- merge `b9e1f121c7dc111ee6db06fd4d00227426d96ce7`;
- Pages `31870370403` SUCCESS;
- explicit verdict `BUILD87 PASS MADAFAKA`;
- Album ordered tracklist save verifies Album + every affected Track compatibility cache;
- lost response is never blindly retried.

Detailed record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

### v0.19.8 · Build86 — Album move response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #138;
- CI `31868536718` SUCCESS;
- merge `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS;
- explicit verdict `BUILD86 PASS`;
- target/source membership + Track cache are canonically verified;
- no blind move retry.

Detailed record: [`changelogs/CHANGELOG-BUILD86.md`](changelogs/CHANGELOG-BUILD86.md).

### v0.19.7 · Build85 — Album metadata response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #135;
- CI `31863267911` SUCCESS;
- merge `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS;
- explicit verdict `BUILD85 PASS`;
- exact metadata + stable non-metadata Album shape are required for recovered committed proof.

Detailed record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

### v0.19.6 · Build84 — SonicTrace save response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #132;
- CI `31858911420` SUCCESS;
- merge `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS;
- explicit verdict `BUILD84 PASS`;
- exact `analysisId` presence across canonical latest + history proves save truth.

Detailed record: [`changelogs/CHANGELOG-BUILD84.md`](changelogs/CHANGELOG-BUILD84.md).

### v0.19.5 · Build83 — canonical Lyrics save response-loss truth

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #129;
- CI `31856653579` SUCCESS;
- merge `b168d8cda805e5c50480a3e26c5d52e490fb7ac6`;
- Pages `31856698097` SUCCESS;
- explicit verdict `BUILD83 PASS`;
- exact revision + ETag + requested normalized text are required for recovered committed proof;
- no blind Lyrics save retry.

Detailed record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

### v0.19.4 · Build82 — destructive-write ambiguity guard

Status: **REAL USER PASS — ACCEPTED**

- runtime PR #126;
- CI `31854468795` SUCCESS;
- merge `7a0d52fcc0bf862478c459f0648afc1c6690b34f`;
- Pages `31854528438` SUCCESS;
- explicit verdict `BUILD82 PASS`;
- Track/Album asset deletion lost-response truth uses private canonical reread and never blind retry.

Detailed record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

## Accepted Phase8 closeout

### v0.19.3 · Build81 — 2026-08-15

Status: **REAL USER PASS — Phase8 closeout**

Build81 closed the Phase8 semantic-truth cleanup:

- Track production/intelligence wording `Sound` → `Sonic`;
- decorative Release Campaign `Premium provider` selector removed because provider choice never changed prompt builders;
- Release Campaign remains provider-agnostic and browser-local/review-only.

Detailed record: [`changelogs/CHANGELOG-PHASE8-BUILD81.md`](changelogs/CHANGELOG-PHASE8-BUILD81.md).

## Phase 7-C baseline

Phase7-C remains program-complete on Build73. Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

All Phase8/9 health and guidance surfaces continue to preserve the same canonical authority boundaries.

## Next bounded action

Finish Build94 acceptance-docs exact-head CI / merge / Pages. Then run a fresh read-only post-Build94 Phase9 reliability audit. **Build95 remains UNALLOCATED** until that audit proves the smallest coherent next scope.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.