# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after **Build85 deployed candidate** publication. Real-user acceptance remains pending.

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
Pages                   31858977765 · SUCCESS
Real-user verdict       BUILD84 PASS · 2026-08-15
```

## Current deployed candidate

```text
Version                 v0.19.7
Build                   Build85
Status                  DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Final CI                31863267911 · SUCCESS
Runtime merge           1199f6a0e26da88e54f64a369985c2a72267e5a5
Pages                   31863313848 · SUCCESS · exact runtime merge SHA
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       PENDING
```

## Build85 automated coverage — GREEN

Final validation run `31863267911` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- new Phase9 Build85 Album metadata response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build85 CI run was merged or required.

Build85 specifically guards:

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build85 guarantees:

- before POST, Studio privately rereads the canonical Album;
- exact `expectedUpdatedAt` is required and stale pre-write state is rejected;
- only timeout/transport-loss failures enter recovery;
- stable non-metadata shape checks canonical identity, ordered `trackIds`, assets and `createdAt`;
- normal HTTP success is not called verified unless the reread has the exact server-returned revision, requested metadata and stable non-metadata shape;
- recovered success explicitly states that Studio did not retry the write;
- existing Album mutation UI reloads canonical state after errors before another operator decision.

The deployed Track Manager backend was audited read-only and already stale-guards, writes the proposed Album manifest, updates title-dependent Track compatibility caches when needed, rebuilds catalog, rereads/verifies and rolls back touched state on failure. No backend mutation was needed for Build85.

## Build85 real-user smoke — PENDING

The required acceptance smoke is intentionally a **normal-browser regression**, not a manufactured failure test:

1. hard refresh Studio and verify `v0.19.7 · Build85`;
2. open a safe existing canonical Album;
3. note the current revision;
4. edit one harmless metadata field such as heading, description or accent;
5. perform one normal **Save metadata**;
6. verify **`Album metadata saved and canonically verified.`**;
7. confirm the canonical revision advances and the saved value survives reload;
8. sanity-check normal Albums / Track / Lyrics / SonicTrace navigation.

Do not cut network, invalidate Access or otherwise sabotage a production save merely to force timeout/partial-write branches.

Until explicit user verdict:

```text
Build85 != REAL USER PASS
```

## Build84 real-user smoke — PASS

Accepted predecessor:

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

The accepted smoke covered normal SonicTrace latest/history loading, normal scan/save with canonical verification and surrounding Track / Visuals / Lyrics / Albums navigation. Acceptance did not require manufactured network failure.

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

Build85 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

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
- membership, move, create and upload require their own operation-specific audits before similar recovery can be added.

### Writes / ambiguity

- public fallback never verifies a canonical write;
- a lost response is never automatic failure or automatic success;
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

Current acceptance gap:

1. Build85 normal-browser Album metadata regression smoke.

Do not allocate Build86 while Build85 acceptance remains pending.

After an explicit Build85 PASS, run a fresh bounded audit before any successor runtime work. Candidate areas include Album membership/move/upload/create response-loss truth, Access/CORS hardening, bounded read retries/timeouts and degraded/offline/PWA resilience.

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
