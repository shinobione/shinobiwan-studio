# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build86 REAL USER PASS**.

This file is the durable roadmap summary. Historical implementation detail belongs in `docs/` and `changelogs/`; do not copy it here unless it changes what is done, active, next or backlogged.

## Done

### Foundation / integration

- Phases 0–6 — complete.
- Phase 7-A — complete / REAL USER PASS.
- Phase 7-B — complete / REAL USER PASS.
- Phase 7-C — complete / program closeout.

Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

### Phase 8 — Content Health / truth

Accepted lineage:

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health drill-down                            REAL USER PASS
Build76  Album Health truth                           historical candidate
Build77  Album Health visual polish                   historical candidate
Build78  Track-side Album mismatch human UX           historical candidate
Build79  Album publication truth                      historical candidate
Build80  cumulative Album Health/publication runtime  REAL USER PASS
Build81  Sonic/provider semantic truth cleanup        REAL USER PASS / Phase8 closeout
```

### Phase 9 Slice1 — destructive-write ambiguity

**Build82 · v0.19.4 · REAL USER PASS**

- Track asset delete lost-response classification;
- Album asset delete lost-response classification;
- no blind automatic retry;
- private canonical reread required;
- normal success also canonically verified;
- no Worker/backend/R2 migration.

### Phase 9 Slice2 — canonical Lyrics save response-loss truth

**Build83 · v0.19.5 · REAL USER PASS**

- exact-head CI `31856653579` SUCCESS;
- runtime PR #129 merged at `b168d8cda805e5c50480a3e26c5d52e490fb7ac6`;
- Pages `31856698097` SUCCESS;
- explicit real-user verdict `BUILD83 PASS` on 2026-08-15;
- lost response classified through private canonical Lyrics + Track reread;
- no Worker/backend/R2 migration.

### Phase 9 Slice3 — SonicTrace save response-loss truth

**Build84 · v0.19.6 · REAL USER PASS**

- exact-head CI `31858911420` SUCCESS;
- runtime PR #132 merged at `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS;
- explicit real-user verdict `BUILD84 PASS` on 2026-08-15;
- exact requested `analysisId` across canonical latest + history classifies response-loss truth;
- no Track Manager / Worker / R2 schema migration.

### Phase 9 Slice4 — Album metadata save response-loss truth

**Build85 · v0.19.7 · REAL USER PASS**

The fresh post-Build84 audit proved **Album metadata save only** as the smallest coherent remaining write-truth gap.

Accepted evidence and behavior:

- exact-head CI `31863267911` SUCCESS on first run;
- runtime PR #135 merged at `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS on that exact merge;
- explicit real-user verdict `BUILD85 PASS` on 2026-08-15;
- canonical pre-read requiring exact `expectedUpdatedAt`;
- dedicated 30s metadata save transport classification;
- no blind automatic retry after lost response;
- new revision + exact requested metadata + stable non-metadata Album shape → committed/verified;
- original revision unchanged → not committed / explicit retry may be safe;
- changed revision without exact metadata-only postcondition → ambiguous / do not retry;
- unreadable canonical state → unverified / do not retry;
- normal HTTP success also requires exact response revision + requested metadata + stable non-metadata shape;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build85 intentionally does **not** bundle Album create, membership, move or upload. Each has distinct canonical postconditions and remains a separate audit candidate.

### Phase 9 Slice5 — Album move response-loss truth

**Build86 · v0.19.8 · REAL USER PASS**

The fresh post-Build85 audit selected Album move as the smallest coherent remaining gap.

Accepted evidence and behavior:

- exact-head CI `31868536718` SUCCESS on first run;
- runtime PR #138 merged at `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS on that exact merge;
- candidate docs PR #139 merged at `9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7`;
- candidate docs Pages `31869026213` SUCCESS;
- explicit real-user verdict `BUILD86 PASS` on 2026-08-15;
- covers Album→Album move plus `sourceAlbumId:null` authority repair;
- exact target/source pre-write revisions and exact expected target order/source removal;
- response-unavailable moves are never blindly retried;
- exact target/source membership + Track cache + stable non-membership shapes → committed/verified;
- exact unchanged target/source/Track state → not committed / explicit retry may be safe after fresh reload;
- partial/mixed state → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- normal HTTP success also requires exact response revisions + exact target/source tracklists + Track cache verification;
- normal-browser acceptance confirmed source removal, target persistence/order, Track compatibility-cache convergence and surrounding navigation sanity;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build86 intentionally does **not** bundle Album bulk membership, create or upload.

## In progress

### Phase 9 — fresh reliability audit

Phase9 remains active, but **Build87 is not allocated**.

The current task is a fresh read-only audit to identify the smallest remaining reliability gap without duplicating existing recovery logic or turning Phase9 into a generic refactor bucket.

## Next

Audit these remaining candidates by proven risk / bounded scope, without assuming a build number:

1. Album bulk membership response-loss truth;
2. Album asset upload response-loss truth;
3. Album create response-loss truth;
4. Access/CORS hardening;
5. bounded read retries/timeouts;
6. degraded/offline/PWA resilience.

Pick **one** coherent slice only after the audit proves the gap and confirms it does not duplicate existing recovery logic.

## Backlog

### Premium interaction polish

Rolling, non-blocking product polish:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

### Phase 10 — progressive extraction

Potential future extraction of mature LRC / SonicTrace / catalog engines while Studio remains orchestrator.

There is currently **no official Phase 11**.

## Frozen roadmap constraints

- Do not create a second queue, workflow-priority engine, Album authority or generic write service.
- Do not reopen completed phases merely because their historical docs are verbose or old.
- Do not use a new phase/build as a bucket for opportunistic refactors.
- Do not treat a candidate as accepted until real-user validation exists where required.
- Do not deliberately damage or interrupt a production write merely to prove an ambiguity guard.
- Do not generalize one write family's recovery postcondition into another operation family.
- Do not allocate Build87 before a fresh bounded audit selects its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build86 real-user PASS.
