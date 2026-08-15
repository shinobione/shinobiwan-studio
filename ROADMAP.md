# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build84 REAL USER PASS**.

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
- no Worker/backend/R2 migration;
- lost response classified through private canonical Lyrics + Track reread;
- normal success retains exact canonical revision + ETag + text verification.

### Phase 9 Slice3 — SonicTrace save response-loss truth

**Build84 · v0.19.6 · REAL USER PASS**

The post-Build83 bounded audit proved SonicTrace persistence as the smallest coherent remaining gap:

- one save request has one unique `analysisId`;
- canonical persistence owns deterministic `latest.json` + `history/<analysisId>.json`;
- deployed Track Manager already writes history → latest → rereads both → attempts rollback on verification failure;
- no Track Manager or Worker change was required.

Accepted evidence and behavior:

- exact-head CI `31858911420` SUCCESS;
- runtime PR #132 merged at `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS on that exact merge;
- explicit real-user verdict `BUILD84 PASS` on 2026-08-15;
- dedicated SonicTrace save transport classification;
- pre-save canonical `analysisId` / source-version guard;
- no blind automatic retry after lost response;
- `analysisId` in both latest + history → committed/verified;
- `analysisId` absent from both → not committed / explicit retry may be safe;
- partial latest/history presence → ambiguous / do not retry;
- unreadable canonical state → unverified / do not retry;
- normal success also requires canonical latest + history verification;
- no Worker/backend/R2 schema migration.

## In progress

### Phase 9 — fresh reliability audit

Phase9 remains active, but **Build85 is not allocated**.

The current task is a fresh read-only audit to identify the smallest remaining reliability gap without duplicating existing recovery logic or turning Phase9 into a generic refactor bucket.

## Next

Audit these remaining candidates by proven risk / bounded scope, without assuming a build number:

1. broader guarded Album write response-loss truth;
2. Access/CORS hardening;
3. bounded read retries/timeouts;
4. degraded/offline UX;
5. PWA update and resilience behavior.

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
- Do not allocate Build85 before a fresh bounded audit selects its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build84 real-user PASS.
