# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.11 · Build89 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build89 extends bounded private-read resilience to canonical Album collection/detail **GETs only**.

Accepted behavior:

- non-timeout Album browser `fetch()` interruption is classified as `transport`, not falsely as `access-or-cors`;
- timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive exactly one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum attempts are two total;
- `getAdminAlbums()` and `getAdminAlbum()` share the bounded helper;
- private Album visual discovery and existing canonical Album rereads inherit those GETs;
- every Album POST/write path remains unchanged;
- Album create and binary-upload response-loss semantics remain unchanged;
- Lyrics and SonicTrace private reads remain separate future audit families;
- normal-browser acceptance confirmed Album inventory, canonical Album detail, private artwork/metadata and surrounding Track / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a timeout/transport/Access failure branch;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-album-private-read-retry-build89-20260815-1307
Safety pre-PR            safety/post-build89-prepr-20260815-1310
Studio PR                #147
Exact tested head        8b73d19d8fced35642ee243cff0ac19d983fd0de
Validation               31881635973 · SUCCESS
Runtime merge            b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages            31881682269 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build89-deployed-candidate-20260815-1319
Candidate docs PR        #148
Candidate docs merge     a7894dad8f4b4015ca1cba47b12781bab417fdcf
Candidate docs Pages     31882384329 · SUCCESS
Safety post-acceptance   safety/post-build89-real-user-pass-20260815-1404
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD89 PASS MADAFAKA · 2026-08-15
```

Historical CI runs `31881467538` and `31881538488` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at Build88. Those heads were never merged. Final exact-head CI `31881635973` passed the complete repository-native chain.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

## Accepted predecessor

### v0.19.10 · Build88 — 2026-08-15

Codename: `studio-focus-slice4-phase9-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build88 extends Phase9 reliability to the core private Track Manager **GET** path only.

Accepted behavior:

- non-timeout browser `fetch()` interruption is classified as `transport`, not falsely as `access-or-cors`;
- timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive exactly one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum attempts are two total;
- public fallback remains unchanged and is only reached after the private helper ultimately fails;
- the retry applies only to bridge health, Track inventory and Track detail GETs;
- metadata validation/save and every other POST/write path remain unchanged and are never automatically retried by Build88;
- no Album create/upload behavior changed;
- normal-browser acceptance confirmed private inventory, normal private Track detail and surrounding navigation sanity;
- acceptance did not manufacture a timeout/transport/Access failure branch;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-private-read-retry-build88-20260815-0916
Studio PR                #144
Exact tested head        808b0c63fc22f17a04a9c544b934d97c791d3a73
Validation               31871980725 · SUCCESS
Runtime merge            9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages            31872073050 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build88-deployed-candidate-20260815-0932
Candidate docs PR        #145
Candidate docs merge     316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages     31872540118 · SUCCESS
Safety post-acceptance   safety/post-build88-real-user-pass-20260815-1253
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD88 PASS MADAFAKA · 2026-08-15
```

Historical CI runs `31871834515` and `31871883072` were red only because inherited successor allowlists stopped at Build87. Those heads were never merged. Final exact-head CI `31871980725` passed the complete repository-native chain.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

## Accepted predecessor

### v0.19.9 · Build87 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-membership-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build87 extends Phase9 reliability to canonical Album **bulk membership / ordered tracklist save** only.

Accepted behavior:

- private pre-read captures the exact Album revision plus every Track in the union of previous/requested `album.trackIds`;
- timeout, fetch interruption or unreadable JSON response is **never blindly retried**;
- requested Track → compatibility cache must point to the Album;
- removed Track whose cache claimed the Album → transitional `Singles` cache;
- removed Track whose cache did not claim the Album → cache remains unchanged;
- historically missing prior Track may be removed, but a missing Track may not be newly requested;
- exact new Album revision + requested ordered `trackIds` + exact expected Track caches + stable non-membership shapes = recovered `COMMITTED / VERIFIED`;
- exact unchanged pre-write Album + Track state = `NOT COMMITTED`, explicit retry may be safe after fresh reload;
- partial/mixed changed state = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal success also requires exact returned revision/order, complete Album + Track-cache canonical verification and `trackCachesUpdated` agreement when provided;
- normal-browser acceptance confirmed ordered tracklist persistence, preserved Album cache ownership and surrounding navigation sanity;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
Safety pre-PR            safety/post-build87-prepr-20260815-0844
Studio PR                #141
Exact tested head        5f155d312b0af7227325a78480bfd424a96e7859
Validation               31870328730 · SUCCESS · first run
Runtime merge            b9e1f121c7dc111ee6db06fd4d00227426d96ce7
Runtime Pages            31870370403 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build87-deployed-candidate-20260815-0853
Candidate docs PR        #142
Candidate docs merge     453be9e9d72c9d90cd97ad5f57be02821efec12a
Candidate docs Pages     31870838391 · SUCCESS
Safety post-acceptance   safety/post-build87-real-user-pass-20260815-0903
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD87 PASS · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

## Accepted predecessor

### v0.19.8 · Build86 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-move-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build86 extends Phase9 reliability to canonical Album **move** only.

Accepted behavior:

- covers canonical Album→Album move and `sourceAlbumId:null` authority repair;
- private pre-read captures target Album + optional source Album + Track compatibility cache;
- exact target/source revisions and exact expected target order/source removal are required before POST;
- timeout, fetch interruption or unreadable JSON response is **never blindly retried**;
- exact target/source membership + Track cache + stable non-membership shapes = recovered `COMMITTED / VERIFIED`;
- exact unchanged pre-write state = `NOT COMMITTED`, explicit retry may be safe after fresh reload;
- partial/mixed changed state = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal success also requires exact returned revisions + exact target/source tracklists + Track cache verification;
- normal-browser acceptance confirmed source removal, target insertion/order persistence, Track compatibility-cache convergence and surrounding navigation sanity;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-album-move-response-loss-build86-20260815-0757
Studio PR                #138
Exact tested head        0d99d17631e3f72a360f404a1269cc05cda33dd8
Validation               31868536718 · SUCCESS · first run
Runtime merge            866ebf9c2a501d11102ed994717b50f6d8189b0d
Runtime Pages            31868570112 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build86-deployed-candidate-20260815-0808
Candidate docs PR        #139
Candidate docs merge     9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7
Candidate docs Pages     31869026213 · SUCCESS
Safety post-acceptance   safety/post-build86-real-user-pass-20260815-0823
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD86 PASS · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD86.md`](changelogs/CHANGELOG-BUILD86.md).

## Accepted predecessor

### v0.19.7 · Build85 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-metadata-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build85 extends Phase9 reliability to Studio-side canonical **Album metadata save** only.

Accepted behavior:

- private canonical pre-read requires the exact expected Album revision;
- timeout / transport loss is **never blindly retried**;
- new revision + exact requested metadata + stable non-metadata Album shape = recovered `COMMITTED / VERIFIED`;
- original revision unchanged = `NOT COMMITTED`, explicit retry may be safe;
- changed revision without exact metadata-only postcondition = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal HTTP success also requires exact server-returned revision + requested metadata + stable non-metadata shape;
- stable shape covers identity, ordered `trackIds`, assets and `createdAt`;
- Album create, membership, move and upload remain separate operation-specific audit families;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Studio PR                #135
Exact tested head        4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Validation               31863267911 · SUCCESS · first run
Runtime merge            1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages            31863313848 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build85-deployed-candidate-20260815-0602
Candidate docs PR        #136
Candidate docs merge     40917edc6a341ca7d19907d8afe59123f44c8d03
Candidate docs Pages     31863566190 · SUCCESS
Safety post-acceptance   safety/post-build85-real-user-pass-20260815-0748
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD85 PASS · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

## Accepted predecessor

### v0.19.6 · Build84 — 2026-08-15

Codename: `studio-focus-slice4-phase9-sonictrace-save-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build84 extends Phase9 reliability to the Studio-side canonical SonicTrace analysis save path.

Accepted behavior:

- one save is identified by the exact requested `analysisId`;
- Studio rereads canonical SonicTrace state before POST to reject duplicate IDs / stale source-audio evidence;
- a lost response or timeout is **never blindly retried**;
- private canonical reread checks both `latest.json` and append-only `history/<analysisId>.json`;
- requested `analysisId` in both = recovered `COMMITTED / VERIFIED`;
- requested `analysisId` absent from both = `NOT COMMITTED`, explicit retry may be safe;
- requested `analysisId` in only one sidecar = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal HTTP success also requires exact latest + history verification;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or Deep Audio compute change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
Studio PR                #132
Exact tested head        377de51416d4aea258830e55e894707d9f3f6512
Validation               31858911420 · SUCCESS
Runtime merge            b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages            31858977765 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build84-deployed-candidate-20260815-0425
Candidate docs PR        #133
Candidate docs merge     ea93441094173b3c05a1e08b22f7c53ef87f3783
Candidate docs Pages     31859213261 · SUCCESS
Safety post-acceptance   safety/post-build84-real-user-pass-20260815-0435
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD84 PASS · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD84.md`](changelogs/CHANGELOG-BUILD84.md).

## Accepted predecessor

### v0.19.5 · Build83 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-save-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build83 extends Phase9 reliability to the native canonical `lyrics.txt` save path.

Accepted behavior:

- Lyrics save timeout / transport loss is classified separately from ordinary server errors;
- the write is **never blindly retried** after response loss;
- Studio privately rereads canonical Lyrics + Track manifest;
- new revision + new ETag + exact requested normalized text = recovered `COMMITTED / VERIFIED`;
- unchanged revision + unchanged ETag = `NOT COMMITTED`, explicit retry may be safe;
- changed but causality/postcondition unproven = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal HTTP success still requires exact canonical revision + ETag + normalized-text verification;
- no Track Manager, Worker, public Worker, R2 migration, SonicTrace, LRC Maker or LaunchPAD change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
Studio PR                #129
Exact tested head        beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Validation               31856653579 · SUCCESS
Runtime merge            b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages            31856698097 · SUCCESS · exact runtime merge SHA
Safety post-acceptance   safety/post-build83-real-user-pass-20260815-0406
Real-user smoke          BUILD83 PASS · 2026-08-15
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

## Accepted predecessor

### v0.19.4 · Build82 — 2026-08-15

Codename: `studio-focus-slice4-phase9-destructive-write-ambiguity-guard`  
Status: **REAL USER PASS — ACCEPTED**

Build82 opened Phase9 with bounded response-loss truth for destructive asset deletion.

Accepted behavior:

- Track asset delete captures canonical pre-write revision/state;
- Album asset delete captures canonical pre-write revision/state;
- a lost response or timeout is **never blindly retried**;
- private canonical reread classifies committed / not committed / ambiguous / unverified;
- normal success also requires exact new revision + canonical asset absence;
- no generic retry framework or second write authority was introduced;
- no Track Manager, Worker, public Worker or R2 migration change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
Studio PR                #126
Exact tested head        07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Validation               31854468795 · SUCCESS
Runtime merge            7a0d52fcc0bf862478c459f0648afc1c6690b34f
Runtime Pages            31854528438 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build82-deployed-candidate-20260815-0248
Real-user smoke          BUILD82 PASS · 2026-08-15
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

## Accepted predecessor

### v0.19.3 · Build81 — 2026-08-15

Status: **REAL USER PASS — Phase8 closeout**

Build81 closed the Phase8 semantic-truth cleanup:

- Track production/intelligence wording `Sound` → `Sonic`;
- decorative Release Campaign `Premium provider` selector removed because provider choice never changed prompt builders;
- Release Campaign remains provider-agnostic and browser-local/review-only.

Detailed record: [`changelogs/CHANGELOG-PHASE8-BUILD81.md`](changelogs/CHANGELOG-PHASE8-BUILD81.md).

## Accepted Phase8 lineage

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health drill-down                            REAL USER PASS
Build76  Album Health truth                           historical candidate
Build77  Album Health visual polish                   historical candidate
Build78  humanized Track-side Album mismatch UX      historical candidate
Build79  Album publication truth                      historical candidate
Build80  cumulative Album Health/publication fix     REAL USER PASS
Build81  semantic truth cleanup                       REAL USER PASS / Phase8 closeout
```

Historical candidates remain historical evidence; they are not retroactively relabelled accepted.

## Phase 7-C baseline

Phase7-C remains program-complete on Build73. Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

All Phase8/9 health and guidance surfaces continue to preserve the same canonical authority boundaries.

## Next bounded action

Run a fresh post-Build89 Phase9 reliability audit. Build90 remains **UNALLOCATED** until that audit proves the smallest coherent next scope.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.
