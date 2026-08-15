# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after explicit **Build94 REAL USER PASS**. Acceptance-docs closeout is in progress; its own CI/merge/Pages receipts must be recorded only after they actually exist.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump; detailed per-build evidence remains under `changelogs/`.

## Current accepted Studio runtime

```text
Version                 v0.19.16
Build                   Build94
Status                  REAL USER PASS
Runtime PR              #169
Exact tested head       81298582163505a11378fe1094f800f1f3d437b5
Final CI                31907745153 · SUCCESS
Runtime merge           fe636560de9ca5f3f33aae76dddc5474ba990f17
Pages                   31907784289 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build94-deployed-candidate-20260815-2338
Safety post-acceptance  safety/post-build94-real-user-pass-20260815-2346
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
Real-user verdict       BUILD94 PASS MADAFAKA · 2026-08-15
```

## Build94 automated coverage — GREEN

Final validation run `31907745153` passed the complete repository-native chain on exact head `81298582163505a11378fe1094f800f1f3d437b5`, including:

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
- inherited Phase9 Build92 Track metadata response-loss guard;
- inherited Phase9 Build93 Track metadata validation transient retry guard;
- new Phase9 Build94 Lyrics validation transient retry guard;
- Studio Focus inherited regression guards through bounded Build94 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Build94 specifically guards the non-mutating Lyrics validation path:

```text
lyrics-validate-v1 attempt 1
├─ timeout                            → one retry max
├─ transport/fetch interruption       → one retry max
├─ HTTP 408/425/429/500/502/503/504  → one retry max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return validation result

attempt 2 failure → surface immediately
```

Additional Build94 guarantees:

- maximum attempts are exactly two total;
- finite 9-second timeout remains per validation attempt;
- visible Lyrics **Validate** uses the hardened wrapper;
- `lyrics-validate-v1` remains explicitly non-mutating;
- browser transport interruption is typed separately from Access/session gating;
- Access/session gating does not enter transient retry;
- deterministic ordinary 4xx does not enter transient retry;
- invalid JSON/proposal does not enter transient retry;
- no generic retry/backoff framework is introduced;
- `lyrics-save-v1` remains at **zero automatic retries**;
- Build83 `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` and committed / not-committed / ambiguous / unverified lost-response recovery remain unchanged;
- no Track Manager, Worker or R2 schema/data mutation was required.

### Historical first Build94 attempt — rolled back, not accepted

The first Build94 candidate must remain visible as safety history rather than being rewritten as green:

```text
Original runtime PR     #166
Original head           5f453868cc8cd2878e6964e3e747f841a5dde4c0
Original merge          5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Pages                   31902471804 · FAILURE · inherited private-read Lyrics POST guard
Rollback main           6c9c677b2f6299d13949642b712f2bf39b48b676
Rollback Pages          31907580912 · SUCCESS
Superseded hotfix PR    #167 · CLOSED / SUPERSEDED
```

The rollback restored byte-identical accepted Build93 content. Build94 v2 was reconstructed cleanly from that state with inherited private-read, Phase7-C Build69, Build90 and Focus64–67 successor guard compatibility included before merge.

## Build94 real-user smoke — PASS

The acceptance smoke was intentionally a **normal-browser Lyrics validation regression**, not a manufactured transient-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD94 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.16 · Build94`;
- opening one existing Track with canonical `lyrics.txt`;
- canonical Lyrics loading normally;
- visible **Validate** completing normally through the non-mutating validation path;
- no Lyrics Save required for this validation-only slice;
- canonical lyrics unchanged after reload;
- surrounding Track / Albums / SonicTrace / Lyrics navigation sanity.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches. Those branches are protected by automated classification and attempt-bound guards.

Result:

```text
Build94 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Accepted Phase9 lineage

```text
Build82  destructive Track/Album asset-delete ambiguity          REAL USER PASS
Build83  canonical Lyrics save response-loss truth               REAL USER PASS
Build84  SonicTrace save response-loss truth                     REAL USER PASS
Build85  Album metadata response-loss truth                      REAL USER PASS
Build86  Album move response-loss truth                          REAL USER PASS
Build87  Album membership/order response-loss truth              REAL USER PASS
Build88  core private Track GET transient retry truth            REAL USER PASS
Build89  canonical Album GET transient retry truth               REAL USER PASS
Build90  canonical Lyrics GET transient retry truth              REAL USER PASS
Build91  private SonicTrace GET transient retry truth            REAL USER PASS
Build92  Track metadata save response-loss truth                 REAL USER PASS
Build93  Track metadata validation transient retry truth         REAL USER PASS
Build94  Lyrics validation transient retry truth                 REAL USER PASS
```

## Build93 accepted predecessor

```text
Version                 v0.19.15
Build                   Build93
Status                  REAL USER PASS
Runtime PR              #162
Exact tested head       fcbe4c59a3a364d9665eba2ed432f37475116364
Final CI                31898542379 · SUCCESS
Historical CI #457      31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458      31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Runtime merge           6c1ceb7d59971ec6c7e251532054392f02c08157
Pages                   31898639778 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #163
Candidate docs CI       31899284370 · SUCCESS
Candidate docs merge    6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages    31899342536 · SUCCESS
Acceptance docs PR      #164
Acceptance docs CI      31901050237 · SUCCESS
Acceptance docs merge   8df0417ee4d96de1e1b386c0fb15af60dcdbc661
Acceptance docs Pages   31901109789 · SUCCESS
Real-user verdict       BUILD93 PASS MADAFAKA · 2026-08-15
```

Build93 protects non-mutating `metadata-validate-v1` with one bounded retry for timeout / transport / HTTP `408/425/429/500/502/503/504`, maximum two attempts, while Access/deterministic ordinary 4xx and invalid JSON/proposal are non-retry. Build92 `metadata-save-v1` remains zero automatic write retries.

Detailed Build93 evidence remains in `changelogs/CHANGELOG-BUILD93.md`.

## Accepted predecessor receipts

Detailed accepted records remain canonical in the per-build changelogs. High-value runtime receipts:

```text
Build92  PR #158 · CI 31893496536 · merge d0ca8b3aa4481c3217f79790e347000bfd22823a · Pages 31893652679 · BUILD92 PASS MADAFAKA
Build91  PR #154 · CI 31888303536 · merge 591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6 · Pages 31888346988 · BUILD91 PASS MADAFAKA
Build90  PR #150 · CI 31884568681 · merge 8a851a7d53d3b4f45359c7036011684441bb25bb · Pages 31884614863 · BUILD90 PASS MADAFAKA
Build89  PR #147 · CI 31881635973 · merge b7ae769c66e9adccef79c80467cc8fd0a8534820 · Pages 31881682269 · BUILD89 PASS MADAFAKA
Build88  PR #144 · CI 31871980725 · merge 9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633 · Pages 31872073050 · BUILD88 PASS MADAFAKA
Build87  PR #141 · CI 31870328730 · merge b9e1f121c7dc111ee6db06fd4d00227426d96ce7 · Pages 31870370403 · BUILD87 PASS MADAFAKA
Build86  PR #138 · CI 31868536718 · merge 866ebf9c2a501d11102ed994717b50f6d8189b0d · Pages 31868570112 · BUILD86 PASS
Build85  PR #135 · CI 31863267911 · merge 1199f6a0e26da88e54f64a369985c2a72267e5a5 · Pages 31863313848 · BUILD85 PASS
Build84  PR #132 · CI 31858911420 · merge b7cf745e11adee1eb77900a32b9b6ca8ea80e000 · Pages 31858977765 · BUILD84 PASS
Build83  PR #129 · CI 31856653579 · merge b168d8cda805e5c50480a3e26c5d52e490fb7ac6 · Pages 31856698097 · BUILD83 PASS
Build82  PR #126 · CI 31854468795 · merge 7a0d52fcc0bf862478c459f0648afc1c6690b34f · Pages 31854528438 · BUILD82 PASS
```

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

Build94 does not supersede those products' independent validation histories.

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
- Build93 allows that non-mutating validation one bounded retry only for timeout, transport interruption and HTTP `408/425/429/500/502/503/504`;
- Build93 validation maximum is two total attempts;
- Access/deterministic ordinary 4xx and invalid JSON/proposal do not retry;
- visible Validate and Build92 fresh pre-save validation use the same bounded validation wrapper;
- `metadata-save-v1` remains guarded by exact `expectedUpdatedAt`;
- Build92 repeats validation immediately before save to obtain the exact normalized proposal;
- derived `duration` may be included from canonical audio evidence but remains non-editable;
- a lost metadata-save response is never blindly retried;
- new revision + exact reviewed proposal is the only recovered committed proof;
- unchanged revision proves not committed / explicit retry safe after reconnect;
- changed but non-matching revision is ambiguous;
- reread unavailable is unverified;
- recovered canonical Track truth does not fabricate an independently unobservable catalog rebuild receipt;
- Build93 does not authorize any automatic write retry.

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried;
- Build90 changes only the GET side of normal reads and recovery/verification rereads;
- Build94 applies one bounded retry only to non-mutating `lyrics-validate-v1`;
- Build94 maximum validation attempts are two total, with finite 9-second timeout per attempt;
- timeout/transport/HTTP `408/425/429/500/502/503/504` may retry once;
- Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal do not retry;
- `lyrics-save-v1` remains zero automatic retries;
- Build83 save response-loss recovery remains committed / not-committed / ambiguous / unverified through private canonical reread.

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
- Build92 adds operation-specific Track metadata recovery only and must not be generalized to create/upload or another write family;
- Build93 and Build94 add bounded retry only to explicitly non-mutating validation operations and must not be generalized into write retry.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

No Build94 runtime acceptance blocker remains.

The current QA boundary is:

1. finish Build94 acceptance-docs exact-head CI / merge / Pages;
2. run a fresh bounded post-Build94 Phase9 audit before any successor allocation.

Album asset upload and Album create remain known heavier candidates; degraded/offline/PWA remains cross-cutting; Deep Audio compute retry is causality/cost-sensitive. A smaller gap may win only if fresh evidence proves it.

**Build95 is unallocated** until the post-Build94 audit proves a concrete scope.

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

Do not replace the native full validation chain with a smaller ad-hoc test when preparing a runtime or acceptance-docs merge.

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

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```