# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after **Build82 REAL USER PASS**.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

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

## Build82 real-user smoke — PASS

Validated in the user browser after hard refresh:

- Studio reports `v0.19.4 · Build82`;
- normal Track workspace/navigation remains functional;
- Visuals loads existing covers/previews/asset cards normally;
- delete controls and confirmations remain present without requiring destructive use;
- Albums / Album Health / Album editor remain functional;
- Album Assets loads canonical cover/thumbnail and their controls;
- System/private status remains coherent;
- no regression requiring a Track Manager, Worker, public Worker or R2 change was observed.

Result:

```text
BUILD82 PASS
```

A deliberate lost-response destructive production test was **not** required for acceptance. The ambiguity branches are primarily protected by source guards, typecheck and canonical-reread logic.

## Build82 automated coverage

Final validation run `31854468795` passed the complete repository chain, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 guards;
- Phase8 guards;
- Phase9 Build82 ambiguity guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

Useful red runs before the final head were not merged:

```text
31853871778  accidental third Phase4 POST transport rejected
31854043923  inherited Build69 version pin caught
31854129202  Phase9 guard implementation check corrected
31854193885  inherited Build64 version pin caught
31854313889  real TypeScript Album delete return-union error caught
31854468795  SUCCESS · final exact tested head
```

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

Build82 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification.

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

These are **not yet accepted fixes** and do not imply Build83:

1. canonical Lyrics save response-loss commit-state truth;
2. SonicTrace analysis save response-loss commit-state truth;
3. broader guarded Album write response-loss truth;
4. later Access/CORS, degraded/offline and PWA resilience scenarios.

Each requires a fresh bounded audit before mutation.

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
