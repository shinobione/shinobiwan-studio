# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build82 REAL USER PASS**.

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

## In progress

### Phase 9 — Security / reliability / PWA

Phase9 is active, but **no next runtime build has been allocated**.

The current task is a fresh read-only audit to choose the smallest remaining reliability slice.

## Next

Audit these candidates in order of proven risk / bounded scope, without assuming a build number:

1. canonical Lyrics save response-loss truth;
2. SonicTrace analysis save response-loss truth;
3. broader guarded Album write response-loss truth.

Pick **one** coherent slice only after the audit proves the gap and confirms it does not duplicate existing recovery logic.

Possible Phase9 follow-ups after that:

- Access/CORS hardening;
- bounded read retries/timeouts;
- degraded/offline UX;
- PWA update and resilience behavior;
- anti-loss safeguards where canonical verification is possible.

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
- Do not pre-allocate Build83; it remains unused until a bounded Phase9 audit selects its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build82 real-user PASS.
