# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after explicit **Build84 REAL USER PASS**.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.6
Build                   Build84
Status                  REAL USER PASS
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final CI                31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Pages                   31858977765 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #133
Candidate docs merge    ea93441094173b3c05a1e08b22f7c53ef87f3783
Candidate docs Pages    31859213261 · SUCCESS
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       BUILD84 PASS · 2026-08-15
```

## Build84 automated coverage — GREEN

Final validation run `31858911420` passed the complete repository-native chain on the exact runtime head, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 guards;
- Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- new Phase9 Build84 SonicTrace response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

Build84 specifically guards:

```text
SonicTrace save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of latest + history
   ├─ requested analysisId present in BOTH
   │    → COMMITTED / VERIFIED
   ├─ requested analysisId absent from BOTH
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ requested analysisId present in only one
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build84 guarantees:

- before POST, Studio rereads canonical SonicTrace state;
- already-canonical `analysisId` is rejected;
- stale canonical audio source evidence is rejected;
- normal HTTP save success is not called verified unless the requested `analysisId` is in both canonical latest + history;
- recovered lost-response success explicitly states that Studio did not retry the write.

The Track Manager backend was audited read-only and already writes history first, then latest, rereads both, and attempts rollback on verification failure. No backend mutation was needed for Build84.

## Build84 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD84 PASS
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.6 · Build84` runtime;
- private Track / canonical master-audio path;
- normal SonicTrace latest/history loading;
- normal SonicTrace scan and review flow;
- one intentional normal analysis save;
- canonical save verification through `latest.json` + `history/<analysisId>.json`;
- latest/history state update;
- surrounding Track / Visuals / Lyrics / Albums navigation regression sanity.

Acceptance intentionally did **not** require cutting network, invalidating Access or sabotaging a production save merely to force timeout/partial-write branches. Those failure paths remain protected by typed classification, source guards and private canonical reread logic.

Result:

```text
Build84 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build83 automated coverage

Final validation run `31856653579` passed the complete repository-native chain, including the inherited Build82 guard and the Build83 canonical Lyrics response-loss guard.

Build83 guards:

```text
Lyrics save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of Lyrics + Track manifest
   ├─ new revision + new ETag + exact requested normalized text
   │    → COMMITTED / VERIFIED
   ├─ same revision + same ETag
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ changed state but exact requested postcondition is not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Useful red Build83 runs before the final head were **not merged**:

```text
31856480932  inherited Phase7-C successor allowlist rejected v0.19.5
31856531103  new guard was too syntax-literal about typed retrySafe=true
31856568244  Build83 guard passed; inherited Build64 successor allowlist then rejected v0.19.5
31856653579  SUCCESS · final exact tested head
```

## Build83 real-user smoke — PASS

The requested bounded normal-browser Lyrics regression smoke received the user's explicit verdict:

```text
BUILD83 PASS
```

Acceptance intentionally did **not** require cutting the network, invalidating Access or sabotaging a production write merely to force a timeout/lost-response branch.

## Build82 real-user smoke — PASS

Accepted predecessor:

```text
Version                 v0.19.4
Build                   Build82
Status                  REAL USER PASS
Runtime PR              #126
Exact tested head       07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Final CI                31854468795 · SUCCESS
Runtime merge           7a0d52fcc0bf862478c459f0648afc1c6690b34f
Pages                   31854528438 · SUCCESS
Real-user verdict       BUILD82 PASS · 2026-08-15
```

Validated in the user browser after hard refresh:

- Studio reports `v0.19.4 · Build82`;
- normal Track workspace/navigation remains functional;
- Visuals loads existing covers/previews/asset cards normally;
- delete controls and confirmations remain present without requiring destructive use;
- Albums / Album Health / Album editor remain functional;
- Album Assets loads canonical cover/thumbnail and their controls;
- System/private status remains coherent;
- no regression requiring a Track Manager, Worker, public Worker or R2 change was observed.

## Current ecosystem validation baseline

```text
LaunchPAD public        2026.08.12.102 · REAL USER PASS
Track Manager           v5.23 · deployed protected authority
Studio bridge           v1.13
Public Worker           v2.7 · unchanged
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build84 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried.

### SonicTrace

- `latest.json` + append-only `history/<analysisId>.json` are the durable canonical analysis sidecars;
- source audio is not persisted in the analysis directory;
- one save is identified by the exact requested `analysisId`;
- partial latest/history presence after response loss is ambiguous, never automatic success or automatic failure;
- public fallback never verifies SonicTrace writes.

### Albums

- `albums/<album-id>/manifest.json` is canonical;
- ordered `album.trackIds` is sole membership/artistic-order authority;
- Track-side Album metadata is compatibility/cache data;
- generic Track metadata writes do not independently mutate Album membership.

### Writes / ambiguity

- public fallback never verifies a canonical write;
- a lost write response is never treated as automatic failure or automatic success;
- no blind retry after response loss;
- canonical reread must prove exact operation-specific postconditions.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

No Build84 acceptance blocker remains.

Before any successor runtime work, perform a fresh bounded Phase9 audit. Remaining candidate areas include:

1. broader guarded Album write response-loss truth;
2. Access/CORS hardening;
3. bounded read retries/timeouts;
4. degraded/offline and PWA resilience scenarios.

These are **not yet accepted fixes** and do not imply Build85. Build85 remains unallocated until a fresh bounded audit proves a concrete scope.

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
