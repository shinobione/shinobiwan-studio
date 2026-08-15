# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after explicit **Build92 REAL USER PASS**.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.14
Build                   Build92
Status                  REAL USER PASS
Runtime PR              #158
Exact tested head       2b859d831f5fc46eea9853f31c4b86057041128b
Final CI                31893496536 · SUCCESS
Historical guard CI     31893447100 · FAILURE · Build80 seam assertion only · never merged
Runtime merge           d0ca8b3aa4481c3217f79790e347000bfd22823a
Pages                   31893652679 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #159
Candidate docs CI       31894353160 · SUCCESS
Candidate docs merge    f46b846841e6ef9ce705b2fa3817baecd0aecefa
Candidate docs Pages    31894411652 · SUCCESS
Acceptance docs PR      PENDING
Acceptance docs merge   PENDING
Acceptance docs Pages   PENDING
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       BUILD92 PASS MADAFAKA · 2026-08-15
```

## Build92 automated coverage — GREEN

Final validation run `31893496536` passed the complete repository-native chain on exact head `2b859d831f5fc46eea9853f31c4b86057041128b`, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics save response-loss guard;
- inherited Phase9 Build84 SonicTrace save response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- inherited Phase9 Build89 Album private-read transient retry guard;
- inherited Phase9 Build90 Lyrics private-read transient retry guard;
- inherited Phase9 Build91 SonicTrace private-read transient retry guard;
- new Phase9 Build92 Track metadata response-loss guard;
- Studio Focus inherited regression guards through bounded Build92 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical run `31893447100` was red only because the inherited Build80 duration-evidence guard still expected validation and save bridge checks in the same source file. Build92 intentionally moved the save seam into the resilient Track metadata service. The guard was updated to protect the same bounded `5.22/1.12` + `5.23/1.13` contract across both seams; no runtime product change was made to repair that red run. The red head was never merged.

Build92 specifically guards canonical Track metadata save:

```text
metadata save response unavailable
→ NEVER automatic retry
→ private canonical Track reread
   ├─ new revision + exact reviewed normalized proposal
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry safe after reconnect
   ├─ changed revision but exact reviewed proposal unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build92 guarantees:

- the same non-mutating metadata validation is repeated immediately before POST;
- reviewed proposal is anchored to exact Track ID + `expectedUpdatedAt`;
- private pre-write Track reread rejects stale canonical revision;
- optional audio evidence uses only the bounded Track Manager/bridge pairs already accepted by the duration-evidence contract;
- derived `duration` remains non-editable but is included in the exact reviewed proposal when evidence exists;
- timeout and transport loss are typed separately as `TRACK_METADATA_SAVE_TIMEOUT` / `TRACK_METADATA_SAVE_TRANSPORT`;
- response-loss recovery starts only for those typed timeout/transport failures;
- Access gating, invalid JSON and ordinary server rejection do not enter lost-response recovery;
- exact proposal comparison ignores only top-level runtime `updatedAt` and `updatedBy`;
- normal `saved:true` requires canonical reread revision === server `updatedAt` plus exact reviewed proposal;
- normal `noChange:true` requires original revision plus exact reviewed proposal;
- mismatch is ambiguous; unreadable reread is unverified;
- no `retryTrackMetadataSave` helper and no write retry loop exist;
- recovered-after-lost-response verifies canonical Track metadata/duration but does not fabricate an independently unobservable `catalogRebuilt:true` receipt;
- no Track Manager, Worker or R2 schema/data mutation was required.

## Build92 real-user smoke — PASS

The acceptance smoke was intentionally a **normal-browser metadata regression**, not a manufactured response-loss test.

The user returned the explicit verdict:

```text
BUILD92 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.14 · Build92`;
- opening one safe existing private canonical Track;
- one harmless reversible metadata edit;
- **Validate** and review of the normalized proposal;
- one normal explicit **Save**;
- canonical reread verification (`CANONICAL REREAD · VERIFIED`);
- persistence of the metadata edit after canonical reload;
- surrounding Track / Albums / Lyrics / SonicTrace navigation sanity.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/ambiguous-write branches. Those failure paths remain protected by automated Build92 classification guards.

Result:

```text
Build92 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build91 automated coverage — GREEN

Final validation run `31888303536` passed the complete repository-native chain on the exact runtime head **on the first run**. Build91 protects private Track Manager SonicTrace GETs with one bounded retry for timeout / transport / HTTP `408/425/429/500/502/503/504`, while Access/CORS, deterministic ordinary 4xx, non-JSON gating and invalid JSON are not retried. Maximum attempts are two total. Build84 `sonictrace-analysis-save-v1` POST truth remains unchanged.

## Build91 real-user smoke — PASS

```text
BUILD91 PASS MADAFAKA
```

Accepted smoke: deployed Build91, canonical latest/history loading, normal SonicTrace catalog/Intelligence read and surrounding Track / Albums / Lyrics / SonicTrace navigation. No manufactured transient failure branch.

## Build90 automated coverage — GREEN

Final validation run `31884568681` passed the complete repository-native chain **on the first run**. Build90 protects canonical Lyrics private GET with one bounded retry for timeout / transport / explicit transient HTTP statuses. Build83 Lyrics save POST behavior and committed / not-committed / ambiguous / unverified response-loss truth remain unchanged.

## Build90 real-user smoke — PASS

```text
BUILD90 PASS MADAFAKA
```

Accepted smoke: deployed Build90, canonical `lyrics.txt` loading and surrounding Track / Albums / SonicTrace / Lyrics navigation. No manufactured network/Access failure branch.

## Build89 automated coverage — GREEN

Final validation run `31881635973` passed the complete repository-native chain. Historical runs `31881467538` and `31881538488` were red only because inherited successor allowlists stopped at Build88; neither head was merged.

Build89 protects canonical Album collection/detail GETs with one bounded transient retry and no write retry. Album inventory/detail, private visual discovery and existing canonical Album rereads inherit the helper.

## Build89 real-user smoke — PASS

```text
BUILD89 PASS MADAFAKA
```

Accepted smoke: Album inventory, canonical Album detail, private artwork/metadata and surrounding Track / Lyrics / SonicTrace navigation. No manufactured network/Access failure branch.

## Build88 automated coverage — GREEN

Final validation run `31871980725` passed the complete repository-native chain. Historical runs `31871834515` and `31871883072` were red only because inherited successor allowlists stopped at Build87; neither head was merged.

Build88 protects bridge health, Track inventory and Track detail private GETs with one bounded retry for transient failures. Public fallback remains read-only and is reached only after the private helper ultimately fails. No write retry exists.

## Build88 real-user smoke — PASS

```text
BUILD88 PASS MADAFAKA
```

Accepted smoke: Home / Tracks private inventory, normal private Track detail and surrounding navigation. No manufactured transient branch.

## Build87 automated coverage — GREEN

Final validation run `31870328730` passed the complete repository-native chain on the exact runtime head **on the first run**.

Build87 specifically guards:

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track-cache reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + stable Album non-membership shape
   │  + every Track cache equals its expected postcondition
   │  + only Tracks requiring cache mutation changed revision
   │  + Track non-album shapes remain stable
   │    → COMMITTED / VERIFIED
   ├─ exact Album + Track pre-write state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed/changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Requested Tracks must exist. Historically missing prior Tracks may be removed safely. Removed Tracks whose cache claimed the Album converge to transitional `Singles`; unrelated cache claims remain stable. Normal success verifies exact returned Album revision/order, affected Track caches and `trackCachesUpdated` when supplied.

## Build87 real-user smoke — PASS

```text
BUILD87 PASS MADAFAKA
```

Accepted smoke: one safe Album reorder, verified canonical Album + Track-cache receipt, persistence after reload, surrounding navigation. No manufactured failure branch.

## Build86 automated coverage — GREEN

Final validation run `31868536718` passed the complete repository-native chain **on the first run**.

Build86 guards Album move response-loss truth across target + optional source + Track compatibility cache. Exact unchanged pre-write state means not committed; exact target/source/cache postcondition means committed; mixed state is ambiguous; unreadable reread is unverified.

## Build86 real-user smoke — PASS

```text
BUILD86 PASS
```

Accepted smoke: one genuine safe Album→Album move, canonical source removal, target insertion/order, Track cache convergence and surrounding navigation.

## Build85 automated coverage — GREEN

Final validation run `31863267911` passed the complete repository-native chain **on the first run**.

Build85 guards Album metadata-save response-loss truth with exact expected revision, stable non-metadata Album shape and no blind retry.

## Build85 real-user smoke — PASS

```text
BUILD85 PASS
```

Accepted smoke: harmless Album metadata edit/save, canonical verification, revision advance, persistence after reload and surrounding navigation.

## Build84 real-user smoke — PASS

```text
Version                 v0.19.6
Build                   Build84
Status                  REAL USER PASS
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final CI                31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Pages                   31858977765 · SUCCESS
Real-user verdict       BUILD84 PASS · 2026-08-15
```

Build84 protects SonicTrace latest/history save truth using exact `analysisId`. Accepted smoke covered normal SonicTrace loading, normal scan/save with canonical verification and surrounding navigation.

## Build83 real-user smoke — PASS

```text
Version                 v0.19.5
Build                   Build83
Status                  REAL USER PASS
Final CI                31856653579 · SUCCESS
Runtime merge           b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Pages                   31856698097 · SUCCESS
Real-user verdict       BUILD83 PASS · 2026-08-15
```

Build83 protects canonical `lyrics.txt` response-loss truth through private Lyrics + Track reread and exact revision + ETag + normalized-text postconditions.

## Build82 real-user smoke — PASS

```text
Version                 v0.19.4
Build                   Build82
Status                  REAL USER PASS
Final CI                31854468795 · SUCCESS
Runtime merge           7a0d52fcc0bf862478c459f0648afc1c6690b34f
Pages                   31854528438 · SUCCESS
Real-user verdict       BUILD82 PASS · 2026-08-15
```

Build82 protects Track/Album asset deletion response-loss truth without requiring destructive production smoke.

## Current ecosystem validation baseline

```text
LaunchPAD public        2026.08.12.102 · REAL USER PASS
Track Manager           v5.23 · deployed protected authority
Studio bridge           v1.13
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker           v2.7 · unchanged
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build92 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Private reads

- bridge health, Track inventory and Track detail remain private-first with Build88 bounded retry;
- canonical Album collection/detail remain private-first with Build89 bounded retry;
- canonical Lyrics read uses Build90 bounded retry;
- private SonicTrace canonical latest/history state and catalog use Build91 bounded retry;
- timeout/transport/selected transient HTTP failures may receive one retry only in those bounded helpers;
- Access/CORS, deterministic ordinary 4xx and invalid-response failures receive no retry;
- maximum attempts are two total;
- public fallback remains read-only and happens only where explicitly designed after private reads ultimately fail;
- private GET retry must never become automatic POST/write retry.

### Track metadata

- `metadata-validate-v1` remains non-mutating;
- `metadata-save-v1` remains guarded by exact `expectedUpdatedAt`;
- Build92 repeats validation immediately before save to obtain the exact normalized proposal;
- derived `duration` may be included from canonical audio evidence but remains non-editable;
- a lost metadata-save response is never blindly retried;
- new revision + exact reviewed proposal is the only recovered committed proof;
- unchanged revision proves not committed / explicit retry safe after reconnect;
- changed but non-matching revision is ambiguous;
- reread unavailable is unverified;
- recovered canonical Track truth does not fabricate an independently unobservable catalog rebuild receipt.

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried;
- Build90 changes only the GET side of normal reads and recovery/verification rereads.

### SonicTrace

- `latest.json` + append-only `history/<analysisId>.json` are durable canonical analysis sidecars;
- source audio is not persisted in the analysis directory;
- one save is identified by exact `analysisId`;
- partial latest/history presence after response loss is ambiguous;
- Build91 changes private Track Manager reads only;
- Build84 save POST/lost-response recovery remains unchanged and is never automatically retried;
- public fallback never verifies SonicTrace writes.

### Albums

- `albums/<album-id>/manifest.json` is canonical;
- ordered `album.trackIds` is sole membership/artistic-order authority;
- Track-side Album metadata is compatibility/cache data;
- generic Track metadata writes do not independently mutate Album membership;
- Build85 response-loss recovery applies to **Album metadata save only**;
- Build86 response-loss recovery applies to **`album-track-move-v1` only**;
- Build87 response-loss recovery applies to **bulk membership / ordered tracklist save only**;
- Build89 changes **GET reads only** and does not alter those write contracts;
- create and binary upload require their own operation-specific backend/causality audits before similar recovery can be added.

### Writes / ambiguity

- public fallback never verifies a canonical write;
- a lost response is never automatic failure or automatic success;
- no blind retry after response loss;
- canonical reread must prove exact operation-specific postconditions;
- Build88, Build89, Build90 and Build91 do not alter any write retry rule;
- Build92 adds operation-specific Track metadata recovery only and must not be generalized to create/upload or another write family.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

No Build92 acceptance blocker remains.

Before any successor runtime work, perform a fresh bounded post-Build92 Phase9 audit. Candidate areas include Album asset upload response-loss truth, Album create response-loss truth, degraded/offline/PWA behavior, or another smaller reliability gap only if fresh evidence proves it.

**Build93 is unallocated** until that fresh bounded audit proves a concrete scope.

## Standard validation commands

Repository-native full validation:

```text
npm run build
```

Focused Phase9 guard:

```text
npm run check:phase9
```

TypeScript only:

```text
npm run typecheck
```

Do not replace the native full validation chain with a smaller ad-hoc test when preparing a runtime merge.

## Acceptance recording rule

For each future runtime candidate, record separately:

```text
scope / version / build
feature PR + exact tested head
CI run + result
runtime merge SHA
Pages deployment + exact SHA
Worker deployment, if any
R2/catalog mutation, if any
real-user smoke scenario + verdict
known residual issues
```

Only explicit real-user validation may promote a deployed candidate to **REAL USER PASS** when the roadmap requires it.