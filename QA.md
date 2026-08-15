# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after **Build89 DEPLOYED CANDIDATE** publication. Build88 remains REAL USER PASS.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.10
Build                   Build88
Status                  REAL USER PASS
Runtime PR              #144
Exact tested head       808b0c63fc22f17a04a9c544b934d97c791d3a73
Final CI                31871980725 · SUCCESS
Runtime merge           9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Pages                   31872073050 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #145
Candidate docs merge    316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages    31872540118 · SUCCESS
Acceptance docs PR      #146
Acceptance docs merge   aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages   31881075352 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       BUILD88 PASS MADAFAKA · 2026-08-15
```

## Current deployed candidate

```text
Version                 v0.19.11
Build                   Build89
Status                  DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #147
Exact tested head       8b73d19d8fced35642ee243cff0ac19d983fd0de
Final CI                31881635973 · SUCCESS
Runtime merge           b7ae769c66e9adccef79c80467cc8fd0a8534820
Pages                   31881682269 · SUCCESS · exact runtime merge SHA
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       PENDING
```

## Build89 automated coverage — GREEN

Final validation run `31881635973` passed the complete repository-native chain on the exact runtime head, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- new Phase9 Build89 Album private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build89 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical runs `31881467538` and `31881538488` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at `0.19.10 / Build88`. Those heads were never merged. The final exact head `8b73d19d8fced35642ee243cff0ac19d983fd0de` passed the full chain.

Build89 specifically guards canonical Album collection/detail private GETs:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build89 guarantees:

- non-timeout Album browser `fetch()` rejection is typed as `transport`, not falsely presented as `access-or-cors`;
- maximum attempts are exactly two total;
- a second failure surfaces immediately rather than starting a loop/backoff framework;
- `getAdminAlbums()` and `getAdminAlbum()` both use the bounded helper;
- private Album visual discovery inherits `getAdminAlbums()`;
- existing canonical Album rereads used by guarded verification/recovery inherit the same GET helper;
- every Album POST/write transport remains unchanged;
- no automatic Album write retry exists;
- Album create/upload response-loss semantics remain unchanged;
- Lyrics and SonicTrace private-read transports remain separate future audit families;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build89 real-user smoke — PENDING

The required acceptance smoke is intentionally a **normal-browser regression**, not a manufactured network-failure test.

Required boundary:

- hard refresh to deployed `v0.19.11 · Build89`;
- Albums loads the normal private canonical Album inventory;
- open at least one canonical Album detail;
- private artwork / metadata load normally;
- surrounding Track / Lyrics / SonicTrace navigation sanity.

Do **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches merely to prove the retry path. Those branches are covered by automated classification/attempt-bound guards.

Until explicit user verdict:

```text
Build89 = DEPLOYED CANDIDATE
```

## Build88 automated coverage — GREEN

Final validation run `31871980725` passed the complete repository-native chain on the exact runtime head, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- new Phase9 Build88 private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build88 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical runs `31871834515` and `31871883072` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at `0.19.9 / Build87`. Those heads were never merged. The final exact head `808b0c63fc22f17a04a9c544b934d97c791d3a73` passed the full chain.

Build88 specifically guards the common core private GET path:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build88 guarantees:

- non-timeout browser `fetch()` rejection is typed as `transport`, not falsely presented as `access-or-cors`;
- maximum attempts are exactly two total;
- a second failure surfaces immediately rather than starting a loop/backoff framework;
- public catalog fallback remains unchanged and is reached only after the private helper ultimately fails;
- the bounded retry applies only to private bridge health, Track inventory and Track detail GETs;
- metadata validation/save POST transports remain unchanged;
- no automatic write retry exists;
- no Album create/upload behavior changed;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build88 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured network-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD88 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.10 · Build88` runtime;
- Home / Tracks loading the normal private inventory, including Draft Tracks when present;
- opening a Track and loading normal private canonical detail;
- surrounding Albums / Track / Lyrics / SonicTrace navigation regression sanity.

Acceptance intentionally did **not** require cutting network, expiring Cloudflare Access or manufacturing timeout/transport/HTTP transient branches. Those branches remain protected by the automated Build88 retry-classification and attempt-bound guards.

Result:

```text
Build88 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build87 automated coverage — GREEN

Final validation run `31870328730` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- new Phase9 Build87 Album membership response-loss guard;
- missing-prior-Track cleanup behavior;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build87 CI run was merged or required.

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

Additional Build87 guarantees:

- exact Album revision is checked before POST;
- the snapshot/reread covers the union of previous and requested Track IDs;
- requested Tracks must exist;
- a historically missing prior Track can still be removed safely;
- requested Track cache must converge to the Album;
- removed Track whose cache claimed the Album must converge to transitional `Singles`;
- removed Track whose cache did not claim the Album must remain cache-stable;
- Album non-membership and Track non-Album shapes must remain stable;
- Tracks that require no cache mutation remain revision-stable;
- normal HTTP success verifies exact returned Album revision/order, every affected Track cache and server `trackCachesUpdated` when supplied;
- recovered success explicitly states that Studio did not retry the write.

The deployed Track Manager backend was audited read-only and already owns stale guards, ownership-conflict validation, deterministic membership/cache updates, catalog rebuild and rollback. No backend mutation was needed for Build87.

## Build87 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD87 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.9 · Build87` runtime;
- opening a safe canonical Album with at least two existing Tracks;
- harmless reordering of existing Tracks using the Album tracklist controls;
- one normal **Save tracklist**;
- verified receipt **`Album tracklist saved and canonically verified across Album + Track caches.`**;
- ordered tracklist persistence after canonical reload;
- reordered Tracks retaining the same Album compatibility-cache ownership;
- surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation regression sanity.

Acceptance intentionally did **not** require cutting network, invalidating Access or sabotaging a production membership save merely to force timeout/partial-write branches. Those failure paths remain protected by typed classification, stale guards and private canonical Album + Track-cache reread logic.

Result:

```text
Build87 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build86 automated coverage — GREEN

Final validation run `31868536718` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- new Phase9 Build86 Album move response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build86 CI run was merged or required.

Build86 specifically guards:

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ exact new target revision/order
   │  + exact source revision/removal when source exists
   │  + Track cache points to target
   │  + stable non-membership Album/Track shapes
   │    → COMMITTED / VERIFIED
   ├─ exact target/source/Track state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed/changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

The deployed Track Manager backend was audited read-only and already owns stale guards, deterministic target/source membership, Track compatibility-cache update, catalog rebuild, canonical target/source/Track reread and rollback. No backend mutation was needed for Build86.

## Build86 real-user smoke — PASS

The user completed the bounded normal-browser move smoke and returned:

```text
BUILD86 PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required.

## Build85 automated coverage — GREEN

Final validation run `31863267911` passed the complete repository-native chain on the exact runtime head on the first run. Build85 guards Album metadata save response-loss classification and exact canonical metadata/stable-shape verification without blind retry.

## Build85 real-user smoke — PASS

The user completed the bounded normal-browser Album metadata smoke and returned:

```text
BUILD85 PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required.

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

Build89 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Private reads

- bridge health, Track inventory and Track detail remain private-first with Build88 bounded retry;
- canonical Album collection/detail remain private-first with Build89 bounded retry;
- timeout/transport/selected transient HTTP failures may receive one retry only in those bounded helpers;
- Access/CORS, deterministic ordinary 4xx and invalid-response failures receive no retry;
- maximum attempts are two total;
- public fallback remains read-only and happens only where explicitly designed after private reads ultimately fail;
- private GET retry must never become automatic POST/write retry;
- Lyrics and SonicTrace private reads remain separate audit families until explicitly hardened.

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried.

### SonicTrace

- `latest.json` + append-only `history/<analysisId>.json` are durable canonical analysis sidecars;
- source audio is not persisted in the analysis directory;
- one save is identified by exact `analysisId`;
- partial latest/history presence after response loss is ambiguous;
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
- Build88 and Build89 do not alter any write retry rule.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

**Build89 real-user smoke is the active acceptance gap.**

After acceptance, a fresh bounded audit may compare Album create/upload backend-contract work, Lyrics private-read resilience, SonicTrace private-read resilience and degraded/offline/PWA behavior.

**Build90 is unallocated** while Build89 acceptance is pending.

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
