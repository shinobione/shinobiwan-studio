# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after explicit **Build83 REAL USER PASS**.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.5
Build                   Build83
Status                  REAL USER PASS
Runtime PR              #129
Exact tested head       beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Final CI                31856653579 · SUCCESS
Runtime merge           b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Pages                   31856698097 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #130
Candidate docs merge    afc526a59e5a2715929d200a32abbd49195b50bf
Candidate docs Pages    31856972224 · SUCCESS
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       BUILD83 PASS · 2026-08-15
```

## Build83 real-user smoke — PASS

The requested bounded normal-browser Lyrics regression smoke received the user's explicit verdict:

```text
BUILD83 PASS
```

The acceptance exercise was deliberately **not** defined as a forced lost-response/destructive production test. The required acceptance boundary was normal Studio/Lyrics regression behavior after hard refresh, with canonical private-read/validation behavior and surrounding workspace sanity checks; the response-loss branches remain primarily protected by source guards, typed classification and private canonical reread logic.

Result:

```text
Build83 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 migration or cross-repository change was required to reach acceptance.

## Build83 automated coverage

Final validation run `31856653579` passed the complete repository-native chain, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 guards;
- Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- new Phase9 Build83 canonical Lyrics response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

Build83 specifically guards:

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

Normal HTTP success remains behind exact canonical revision + ETag + normalized-text verification.

Useful red runs before the final Build83 head were **not merged**:

```text
31856480932  inherited Phase7-C successor allowlist rejected v0.19.5
31856531103  new guard was too syntax-literal about typed retrySafe=true
31856568244  Build83 guard passed; inherited Build64 successor allowlist then rejected v0.19.5
31856653579  SUCCESS · final exact tested head
```

The fixes to historical guards only widened bounded successor compatibility to v0.19.5 / Build83 while preserving their functional assertions and accepted ancestry.

## Accepted predecessor — Build82

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

Build82 hardened Track and Album destructive asset-delete response-loss truth. A deliberate lost-response destructive production test was not required for Build82 acceptance either.

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

Build83 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried.

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

No Build83 acceptance blocker remains.

Before any successor runtime work, perform a fresh bounded Phase9 audit. Leading candidates are:

1. SonicTrace analysis save response-loss commit-state truth;
2. broader guarded Album write response-loss truth;
3. Access/CORS hardening;
4. degraded/offline and PWA resilience scenarios.

These are **not** pre-allocated builds. Build84 remains unallocated until an audit proves a concrete scope.

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
