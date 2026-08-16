# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.22 · Build100 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-first-track-intake`  
Status: **REAL USER PASS — ACCEPTED**

Build100 closes the daily Album first-track intake deadlock without creating a second ownership authority. The Albums workspace derives ownership from canonical `album.trackIds`, offers only Tracks with no canonical Album owner, stages **Add to tracklist** locally, and keeps the existing Build87 resilient membership transaction as the sole canonical write.

```text
Runtime PR                #187
Exact tested head         9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Validation #503           31944882443 · SUCCESS
Runtime merge             49f5c8e0267a318e2b0900ba5e222bd56d098db8
Runtime Pages #194        31944932464 · SUCCESS
Candidate docs PR         #188
Candidate docs CI #504    31945020130 · SUCCESS
Candidate docs merge      2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages #195 31945131271 · SUCCESS
Safety post-deploy        safety/post-build100-deployed-candidate-20260816
Safety post-acceptance    safety/post-build100-real-user-pass-20260816-2255
Track Manager             v5.24 · unchanged by Build100
Studio bridge             v1.14
Public Worker             v2.7 · unchanged
Real-user smoke           BUILD100 SMOKED 💨 · 2026-08-16
Build101                  UNALLOCATED pending fresh read-only post-Build100 audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD100.md`](changelogs/CHANGELOG-BUILD100.md).

## Accepted predecessor

### v0.19.21 · Build99 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-asset-upload-success-verification-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build99 tightened normal successful Album cover/thumbnail verification. Its smoke also exposed the separate first-track intake deadlock that Build100 subsequently closed. Detailed accepted record: [`changelogs/CHANGELOG-BUILD99.md`](changelogs/CHANGELOG-BUILD99.md).

## Accepted predecessor

### v0.19.20 · Build98 — 2026-08-16

Codename: `studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective`  
Status: **REAL USER PASS — ACCEPTED**

Build98 is the bounded Studio compatibility corrective for Track Manager v5.24 / Studio bridge v1.14. It accepts the new duration-evidence bridge pair in metadata validation/save without changing automatic write retry semantics. The corrective was required because the genuine Build97 continuation exposed a pre-existing TM v5.23 generated-bundle scope defect after Track creation had already succeeded.

Exact accepted evidence:

```text
Studio PR                 #181
Exact final head          c393e26caa9a9e7d0b3ad71fccca92b9c1ae234b
Historical CI #495        31917263004 · FAILURE · inherited Build79 literal label only · never merged
Validation #496           31917295331 · SUCCESS
Runtime merge             5ebbf78f9d9296eaed998f1093f2ca7dad68fd1d
Runtime Pages #188        31917336845 · SUCCESS
Safety post-deploy        safety/post-build98-deployed-candidate-20260816
Safety post-acceptance    safety/post-build98-real-user-pass-20260816
TM corrective PR          LaunchPAD-APP #238
TM source merge           aaa28c90c95b6d5dbe76e34a840d95e194e0cc65
TM deploy run #40         31919397012 · SUCCESS · admin only
TM Worker Version ID      53abb651-4f3c-46a7-a37a-055f35d340b9
Track Manager             v5.24 · REAL USER VERIFIED
Studio bridge             v1.14
Public Worker             v2.7 · unchanged
Real-user smoke           MP3 + COVER + MP4 + TXT PASS MADAFAKA · 2026-08-16
Build99                   UNALLOCATED pending fresh read-only audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD98.md`](changelogs/CHANGELOG-BUILD98.md).

## Accepted predecessor

### v0.19.19 · Build97 — 2026-08-16

Codename: `studio-focus-slice4-phase9-track-create-success-verification-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build97 tightens normal successful Track creation only: Track Manager's server-normalized response manifest must exactly match Studio's second private canonical reread before `clientVerified=true`. The genuine `Pixels & Promises` draft was created correctly. Its first asset continuation exposed the separate TM v5.23 `uploadEvidence` scope defect; after TM v5.24 + Build98 corrective deployment, the same Track successfully accepted MP3, cover JPEG, MP4 and TXT assets.

```text
Runtime PR                #179
Exact tested head         31facc9eb124d3068f4f870dcfa78e38284e2f6a
Validation #493           31914980387 · SUCCESS
Runtime merge             0519d3ad1c364ee34188e17ecb9d10c3f0308c54
Runtime Pages #186        31915029686 · SUCCESS
Candidate docs PR         #180
Candidate docs CI #494    31915104936 · SUCCESS
Candidate docs merge      99925484dc8143f6c12eb4c049690132e1a98dbc
Candidate docs Pages #187 31915152385 · SUCCESS
Real-user completion      MP3 + COVER + MP4 + TXT PASS MADAFAKA · 2026-08-16
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD97.md`](changelogs/CHANGELOG-BUILD97.md).

## Accepted predecessor

### v0.19.18 · Build96 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-create-success-verification-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build96 tightens only normal successful Album create verification. After Track Manager reports create success, Studio's private canonical reread must prove both the exact response/canonical revision and every metadata key supplied to create before returning `clientVerified=true`. Create response-loss recovery remains explicitly out of scope without operation identity, automatic create retries remain zero, and Album binary upload semantics are unchanged. Explicit verdict: **`Build 96 SMOKED 💨`** on 2026-08-16.

## Accepted predecessor

### v0.19.17 · Build95 — 2026-08-15

Codename: `studio-focus-slice4-phase9-albums-daily-resilient-service-convergence`  
Status: **REAL USER PASS — ACCEPTED**

Build95 closes a daily Albums wiring gap rather than inventing a new recovery algorithm. The normal `AlbumsWorkspace` now consumes the accepted Build85/86/87 resilient mutation services for metadata, move and ordered membership respectively.

Accepted behavior:

- daily Album metadata save uses Build85 resilient response-loss truth;
- daily Album move uses Build86 resilient response-loss truth;
- daily ordered tracklist save uses Build87 resilient response-loss truth;
- older generic metadata/membership/move mutations are no longer used by the daily Albums workspace;
- existing recovered-after-lost-response semantics remain explicit and no write is blindly retried;
- Album create, binary upload and asset delete remain out of scope;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD95 PASS MADAFAKA`** on 2026-08-16;
- acceptance did not deliberately cut network or invalidate Cloudflare Access to manufacture a lost response; automated guards own that proof.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815
Safety pre-PR            safety/post-build95-prepr-20260815
Safety green pre-merge   safety/post-build95-green-premerge-20260815
Studio PR                #171
Exact tested head        f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Historical CI #477       31911328839 · FAILURE · inherited Phase7-C Build69 successor cap only · never merged
Historical CI #482       31911459367 · FAILURE · inherited Build93 successor cap only · never merged
Validation               31911514334 · SUCCESS
Runtime merge            0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages            31911568069 · SUCCESS · exact runtime merge SHA
Candidate docs PR        #172
Candidate docs CI        31911702567 · SUCCESS
Candidate docs merge     1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages     31911746874 · SUCCESS
Acceptance docs PR       #173
Acceptance docs CI       31912389047 · SUCCESS
Acceptance docs merge    f6738d56eddcadc2810c7d5413700e14b20f71a3
Acceptance docs Pages    31912432617 · SUCCESS
Safety post-deploy       safety/post-build95-deployed-candidate-20260815
Safety post-acceptance   safety/post-build95-real-user-pass-20260816
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD95 PASS MADAFAKA · 2026-08-16
Build96                  UNALLOCATED pending fresh audit
```

The two red Build95 validation runs are preserved as inherited-guard history. Neither red head was merged and neither required a product-runtime change.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD95.md`](changelogs/CHANGELOG-BUILD95.md).

## Accepted predecessor

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
- visible Lyrics **Validate** uses the hardened wrapper;
- `lyrics-save-v1` remains zero automatic retries;
- Build83 committed / not-committed / ambiguous / unverified save response-loss recovery is unchanged;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD94 PASS MADAFAKA`** on 2026-08-15;
- acceptance did not deliberately cut network or invalidate Cloudflare Access to manufacture a transient retry; automated guards own that failure-path proof.

Exact acceptance evidence:

```text
Original runtime PR       #166 · rolled back after red Pages inherited guard
Original merge            5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Original Pages            31902471804 · FAILURE
Rollback main             6c9c677b2f6299d13949642b712f2bf39b48b676 · byte-identical accepted Build93 tree
Rollback Pages            31907580912 · SUCCESS
Superseded hotfix PR      #167 · CLOSED / SUPERSEDED
Studio PR                 #169
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
Build95                   UNALLOCATED pending acceptance-docs closeout + fresh audit
```

The first Build94 merge remains explicit safety history. It was rolled back rather than patched in-place after Pages exposed inherited guard incompatibility. Build94 v2 was reconstructed from the restored accepted Build93 tree with inherited private-read, Phase7-C Build69, Build90 and Focus64–67 successor guard alignment included before merge.

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
- Track create/assets, Album operations, Lyrics/SonicTrace operations and PWA/offline remain out of scope;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD93 PASS MADAFAKA`** on 2026-08-15;
- acceptance did not deliberately cut network or invalidate Cloudflare Access to manufacture a transient retry; automated guards own that failure-path proof.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914
Safety pre-PR            safety/post-build93-prepr-20260815-1921
Safety pre-PR final      safety/post-build93-prepr-final-20260815-1923
Safety green pre-merge   safety/post-build93-green-premerge-20260815-1931
Studio PR                #162
Exact tested head        fcbe4c59a3a364d9665eba2ed432f37475116364
Historical CI #457       31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458       31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Validation               31898542379 · SUCCESS
Runtime merge            6c1ceb7d59971ec6c7e251532054392f02c08157
Runtime Pages            31898639778 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build93-deployed-candidate-20260815-1936
Candidate docs PR        #163
Candidate docs CI        31899284370 · SUCCESS
Candidate docs merge     6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages     31899342536 · SUCCESS
Safety post-acceptance   safety/post-build93-real-user-pass-20260815-2010
Acceptance docs PR       #164
Acceptance docs CI       31901050237 · SUCCESS
Acceptance docs merge    8df0417ee4d96de1e1b386c0fb15af60dcdbc661
Acceptance docs Pages    31901109789 · SUCCESS · exact docs merge SHA
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD93 PASS MADAFAKA · 2026-08-15
```

Historical CI `31898251689` was red only because inherited Phase7-C Build69 stopped at `0.19.14 / Build92`. Historical CI `31898329621` then passed Phase7-C, Phase8 and Phase9 Build82→93 — including the new Build93 guard — and stopped only at the inherited Focus Build64 successor cap. Focus64–67 were widened only for `v0.19.15 / Build93`; functional assertions remain intact. Neither red head was merged.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD93.md`](changelogs/CHANGELOG-BUILD93.md).

## Accepted predecessor

### v0.19.14 · Build92 — 2026-08-15

Codename: `studio-focus-slice4-phase9-track-metadata-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build92 adds response-loss truth to canonical Track **metadata save only**.

Accepted behavior:

- the same non-mutating metadata validation is repeated immediately before POST;
- exact normalized `proposed` manifest + exact `expectedUpdatedAt` become the operation-specific postcondition;
- already-supported derived audio duration is included in the proposal when canonical audio evidence exists, while `duration` remains non-editable;
- timeout / transport response loss is never blindly retried;
- new revision + exact reviewed proposal → recovered `COMMITTED / VERIFIED`;
- original revision unchanged → `NOT COMMITTED / explicit retry safe after reconnect`;
- changed revision without exact proposal → `AMBIGUOUS / DO NOT RETRY`;
- unreadable canonical reread → `UNVERIFIED / DO NOT RETRY`;
- normal `saved:true` and `noChange:true` responses are also canonically reread and exactly verified;
- recovered-after-lost-response verifies canonical Track manifest truth but does not fabricate an independently unobservable `catalogRebuilt:true` receipt;
- accepted normal-browser smoke confirmed one harmless reversible metadata edit through Validate → one normal Save, `CANONICAL REREAD · VERIFIED`, persistence after reload and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a timeout/transport/Access/response-loss branch;
- Track create, Track asset upload/delete, Album create/upload, Lyrics/SonicTrace writes and PWA/offline remain out of scope;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-track-metadata-response-loss-build92-20260815-1722
Safety pre-PR            safety/post-build92-prepr-20260815-1740
Studio PR                #158
Exact tested head        2b859d831f5fc46eea9853f31c4b86057041128b
Validation               31893496536 · SUCCESS
Historical guard CI      31893447100 · FAILURE · Build80 seam assertion only · never merged
Runtime merge            d0ca8b3aa4481c3217f79790e347000bfd22823a
Runtime Pages            31893652679 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build92-deployed-candidate-20260815-1748
Candidate docs PR        #159
Candidate docs CI        31894353160 · SUCCESS
Candidate docs merge     f46b846841e6ef9ce705b2fa3817baecd0aecefa
Candidate docs Pages     31894411652 · SUCCESS
Safety post-acceptance   safety/post-build92-real-user-pass-20260815-1819
Acceptance docs PR       #160
Acceptance docs CI       31896013803 · SUCCESS
Acceptance docs merge    a26c8c0540607c99147c0b6d30b5d3c7ccf6efc9
Acceptance docs Pages    31896073093 · SUCCESS
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD92 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD92.md`](changelogs/CHANGELOG-BUILD92.md).

## Accepted predecessor

### v0.19.13 · Build91 — 2026-08-15

Codename: `studio-focus-slice4-phase9-sonictrace-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build91 extends bounded private-read resilience to private Track Manager SonicTrace **GETs only**.

Accepted behavior:

- non-timeout SonicTrace browser `fetch()` interruption is classified as `SONICTRACE_READ_TRANSPORT`, not falsely as Cloudflare Access;
- timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive exactly one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum attempts are two total;
- canonical latest/history state and the SonicTrace catalog use the bounded helper;
- state keeps the existing 12-second timeout and catalog keeps its 20-second timeout;
- the helper is GET-only and no longer accepts arbitrary `RequestInit` / methods;
- Build84 `sonictrace-analysis-save-v1` POST remains unchanged;
- `SONICTRACE_SAVE_TIMEOUT` / `SONICTRACE_SAVE_TRANSPORT` and Build84 committed / not-committed / ambiguous / unverified recovery remain intact;
- no automatic SonicTrace save/analysis retry exists;
- Deep Audio health/analysis XHR and canonical audio download remain unchanged;
- Album create/upload and degraded/offline/PWA remain separate future audit families;
- normal-browser acceptance confirmed deployed Build91, canonical latest/history loading on an existing Track, a normal SonicTrace catalog/Intelligence read and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a timeout/transport/Access failure branch;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
Safety pre-PR            safety/post-build91-prepr-20260815-1555
Studio PR                #154
Exact tested head        b8ee223b2d077e5d14936530be219f78ed7910ac
Validation               31888303536 · SUCCESS · first run
Runtime merge            591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6
Runtime Pages            31888346988 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build91-deployed-candidate-20260815-1559
Candidate docs PR        #155
Candidate docs merge     32a57f50c90f3f7677e3a45ad46eace8bd988b3d
Candidate docs Pages     31889030115 · SUCCESS
Safety post-acceptance   safety/post-build91-real-user-pass-20260815-1700
Acceptance docs PR       #156
Acceptance docs merge    80b6c34f2bd8937cbbc4ef5e24899d13a6949731
Acceptance docs Pages    31892156760 · SUCCESS
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD91 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD91.md`](changelogs/CHANGELOG-BUILD91.md).

## Accepted predecessor

### v0.19.12 · Build90 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build90 extends bounded private-read resilience to canonical Lyrics **GET only**.

Accepted behavior:

- non-timeout canonical Lyrics browser `fetch()` interruption is classified as `LYRICS_READ_TRANSPORT`, not falsely as Cloudflare Access;
- timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive exactly one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum attempts are two total, with the existing 7-second timeout per attempt;
- normal canonical Lyrics loading uses the bounded helper;
- Build83 `rereadLyricsTruth()` continues to combine canonical Lyrics + Track rereads and merely inherits the hardened GET;
- Lyrics validation/save POSTs remain unchanged;
- `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` and Build83 committed / not-committed / ambiguous / unverified recovery remain intact;
- no automatic Lyrics validation/save retry exists;
- normal-browser acceptance confirmed deployed Build90, canonical `lyrics.txt` loading on an existing Track and surrounding Track / Albums / SonicTrace / Lyrics navigation sanity;
- acceptance did not manufacture a timeout/transport/Access failure branch;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD, LRC Maker or SonicTrace Deep Audio change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
Safety pre-PR            safety/post-build90-prepr-20260815-1424
Studio PR                #150
Exact tested head        48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01
Validation               31884568681 · SUCCESS · first run
Runtime merge            8a851a7d53d3b4f45359c7036011684441bb25bb
Runtime Pages            31884614863 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build90-deployed-candidate-20260815-1429
Candidate docs PR        #151
Candidate docs merge     442b488511d77da15592a37d6e8d2dca0ed30fb8
Candidate docs Pages     31885123431 · SUCCESS
Safety post-acceptance   safety/post-build90-real-user-pass-20260815-1512
Acceptance docs PR       #152
Acceptance docs merge    ebc501df90b8a8bf9229da4a61d7784beba13b78
Acceptance docs Pages    31887090784 · SUCCESS
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD90 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD90.md`](changelogs/CHANGELOG-BUILD90.md).

## Accepted predecessor

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
Acceptance docs PR       #149
Acceptance docs merge    07bfd3c6b4fa19ccea0656b9ce194f239b7f7c65
Acceptance docs Pages    31884092117 · SUCCESS
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
Acceptance docs PR       #146
Acceptance docs merge    aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages    31881075352 · SUCCESS
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

Finish Build94 acceptance-docs exact-head CI / merge / Pages, then run a fresh read-only post-Build94 Phase9 reliability audit. Build95 remains **UNALLOCATED** until that audit proves the smallest coherent next scope.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.