# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

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
Acceptance docs PR       PENDING
Acceptance docs merge    PENDING
Acceptance docs Pages    PENDING
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
Real-user smoke          BUILD92 PASS MADAFAKA · 2026-08-15
Build93                  UNALLOCATED
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD92.md`](changelogs/CHANGELOG-BUILD92.md).

## Accepted predecessor

### v0.19.13 · Build91 — 2026-08-15

Codename: `studio-focus-slice4-phase9-sonictrace-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build91 extends bounded private-read resilience to private Track Manager SonicTrace **GETs only**.

- runtime PR #154;
- exact head `b8ee223b2d077e5d14936530be219f78ed7910ac`;
- CI `31888303536` SUCCESS on first run;
- runtime merge `591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6`;
- Pages `31888346988` SUCCESS;
- acceptance docs merge `80b6c34f2bd8937cbbc4ef5e24899d13a6949731` / Pages `31892156760` SUCCESS;
- explicit verdict `BUILD91 PASS MADAFAKA`;
- latest/history + catalog GETs gain one bounded transient retry;
- Build84 SonicTrace save truth remains unchanged;
- no automatic write retry.

Detailed record: [`changelogs/CHANGELOG-BUILD91.md`](changelogs/CHANGELOG-BUILD91.md).

## Accepted predecessor

### v0.19.12 · Build90 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #150;
- exact head `48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01`;
- CI `31884568681` SUCCESS on first run;
- merge `8a851a7d53d3b4f45359c7036011684441bb25bb`;
- Pages `31884614863` SUCCESS;
- acceptance docs Pages `31887090784` SUCCESS;
- explicit verdict `BUILD90 PASS MADAFAKA`;
- canonical Lyrics GET gains one bounded transient retry;
- Build83 Lyrics save truth remains unchanged.

Detailed record: [`changelogs/CHANGELOG-BUILD90.md`](changelogs/CHANGELOG-BUILD90.md).

## Accepted predecessor

### v0.19.11 · Build89 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #147;
- exact head `8b73d19d8fced35642ee243cff0ac19d983fd0de`;
- CI `31881635973` SUCCESS;
- merge `b7ae769c66e9adccef79c80467cc8fd0a8534820`;
- Pages `31881682269` SUCCESS;
- acceptance docs Pages `31884092117` SUCCESS;
- explicit verdict `BUILD89 PASS MADAFAKA`;
- Album collection/detail GETs gain one bounded transient retry;
- every Album write remains unchanged.

Historical CI runs `31881467538` and `31881538488` were red only because inherited successor allowlists stopped at Build88. Those heads were never merged.

Detailed record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

## Accepted predecessor

### v0.19.10 · Build88 — 2026-08-15

Codename: `studio-focus-slice4-phase9-private-read-transient-retry-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #144;
- exact head `808b0c63fc22f17a04a9c544b934d97c791d3a73`;
- CI `31871980725` SUCCESS;
- merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS;
- acceptance docs Pages `31881075352` SUCCESS;
- explicit verdict `BUILD88 PASS MADAFAKA`;
- bridge health / Track inventory / Track detail GETs gain one bounded transient retry;
- no write retry behavior changed.

Historical CI runs `31871834515` and `31871883072` were red only because inherited successor allowlists stopped at Build87. Those heads were never merged.

Detailed record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

## Accepted predecessor

### v0.19.9 · Build87 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-membership-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #141;
- exact head `5f155d312b0af7227325a78480bfd424a96e7859`;
- CI `31870328730` SUCCESS on first run;
- merge `b9e1f121c7dc111ee6db06fd4d00227426d96ce7`;
- Pages `31870370403` SUCCESS;
- explicit verdict `BUILD87 PASS MADAFAKA`;
- exact Album order + affected Track caches + stable shapes classify membership response-loss truth;
- no blind automatic retry.

Detailed record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

## Accepted predecessor

### v0.19.8 · Build86 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-move-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #138;
- exact head `0d99d17631e3f72a360f404a1269cc05cda33dd8`;
- CI `31868536718` SUCCESS on first run;
- merge `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS;
- explicit verdict `BUILD86 PASS`;
- target/source Album membership + Track cache classify move response-loss truth.

Detailed record: [`changelogs/CHANGELOG-BUILD86.md`](changelogs/CHANGELOG-BUILD86.md).

## Accepted predecessor

### v0.19.7 · Build85 — 2026-08-15

Codename: `studio-focus-slice4-phase9-album-metadata-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #135;
- exact head `4bbfb93dfc9333eb1e8fc3a35b62699611e69367`;
- CI `31863267911` SUCCESS on first run;
- merge `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS;
- explicit verdict `BUILD85 PASS`;
- exact metadata + stable non-metadata Album shape classify response-loss truth.

Detailed record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

## Accepted predecessor

### v0.19.6 · Build84 — 2026-08-15

Codename: `studio-focus-slice4-phase9-sonictrace-save-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #132;
- exact head `377de51416d4aea258830e55e894707d9f3f6512`;
- CI `31858911420` SUCCESS;
- merge `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS;
- explicit verdict `BUILD84 PASS`;
- exact `analysisId` across latest + history classifies SonicTrace save truth.

Detailed record: [`changelogs/CHANGELOG-BUILD84.md`](changelogs/CHANGELOG-BUILD84.md).

## Accepted predecessor

### v0.19.5 · Build83 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-save-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

- CI `31856653579` SUCCESS;
- merge `b168d8cda805e5c50480a3e26c5d52e490fb7ac6`;
- Pages `31856698097` SUCCESS;
- explicit verdict `BUILD83 PASS`;
- new revision + ETag + exact normalized text classify canonical `lyrics.txt` save truth.

Detailed record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

## Accepted predecessor

### v0.19.4 · Build82 — 2026-08-15

Codename: `studio-focus-slice4-phase9-destructive-write-ambiguity-guard`  
Status: **REAL USER PASS — ACCEPTED**

- runtime PR #126;
- exact head `07fbcb4efdcd57e79614825d7c45bccd4ab2d860`;
- CI `31854468795` SUCCESS;
- merge `7a0d52fcc0bf862478c459f0648afc1c6690b34f`;
- Pages `31854528438` SUCCESS;
- explicit verdict `BUILD82 PASS`;
- Track + Album asset delete response-loss truth, no blind retry.

Detailed record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

## Accepted predecessor

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

Run a fresh post-Build92 Phase9 reliability audit. Build93 remains **UNALLOCATED** until that audit proves the smallest coherent next scope.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.