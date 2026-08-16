# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build102 REAL USER PASS**.

This file tracks only durable Done / Active / Next / Backlog state. Historical implementation detail belongs in `changelogs/`, `docs/` and the acceptance receipts.

## Done

### Foundation / integration

- Phases 0–6 — complete.
- Phase 7-A — complete / REAL USER PASS.
- Phase 7-B — complete / REAL USER PASS.
- Phase 7-C — complete / program closeout.

Accepted workflow authority remains:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

### Phase 8 — Content Health / semantic truth

Accepted through Build81. Content Health, Album Health, publication truth and Sonic/provider semantic cleanup are closed and must not be reopened merely for refactoring.

### Phase 9 — reliability / canonical truth

Accepted lineage:

```text
Build82   destructive Track/Album asset-delete ambiguity       REAL USER PASS
Build83   canonical Lyrics save response-loss truth            REAL USER PASS
Build84   SonicTrace save response-loss truth                  REAL USER PASS
Build85   Album metadata save response-loss truth              REAL USER PASS
Build86   Album move response-loss truth                       REAL USER PASS
Build87   Album ordered-membership response-loss truth         REAL USER PASS
Build88   core private Track GET transient retry truth         REAL USER PASS
Build89   private Album GET transient retry truth              REAL USER PASS
Build90   private Lyrics GET transient retry truth             REAL USER PASS
Build91   private SonicTrace GET transient retry truth         REAL USER PASS
Build92   Track metadata save response-loss truth              REAL USER PASS
Build93   Track metadata validation transient retry truth      REAL USER PASS
Build94   Lyrics validation transient retry truth              REAL USER PASS
Build95   daily Albums resilient-service convergence           REAL USER PASS
Build96   Album create normal-success verification truth       REAL USER PASS
Build97   Track create normal-success verification truth       REAL USER PASS
Build98   TM5.24 / bridge1.14 compatibility corrective         REAL USER PASS
Build99   Album asset upload normal-success verification       REAL USER PASS
Build100  Album first-track intake continuity                  REAL USER PASS
Build101  Track asset success verifier candidate               REJECTED · false-negative ETag representation
Build102  bounded ETag representation corrective              REAL USER PASS
```

### Phase 9 Slice20 — Track asset normal-success verification truth

**Accepted runtime: Build102 · v0.19.24 · REAL USER PASS**

Build101 introduced the intended stronger Track asset normal-success proof but failed real-user acceptance because identical R2 object ETags arrived in two syntax representations:

```text
Track Manager upload response → httpEtag with surrounding HTTP quotes
private canonical reread      → raw object.etag without quotes
```

The user did not retry. A refresh showed the cover persisted, proving the write was committed and Build101's `asset ETag` mismatch was a verification false negative.

Build102 is the bounded corrective:

- trims whitespace;
- removes only one symmetric outer pair of double quotes when present;
- compares the remaining ETag exactly;
- preserves exact revision, filename, presence, size, content type and duration verification;
- preserves zero automatic upload retries and existing response-loss safety semantics;
- changes no Track Manager, Worker, Public Worker, R2 schema or Album behavior.

Accepted receipts:

```text
Runtime PR              #193
Exact tested head       cfebb5cfe5b87627a29890a7477bd5628ef60759
Validation              #524 · 31979380563 · SUCCESS
Runtime merge           64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages           #200 · 31979525479 · SUCCESS build + deploy
Candidate docs PR       #194
Candidate docs CI       #525 · 31979629544 · SUCCESS
Candidate docs merge    68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages    #201 · 31979667787 · SUCCESS
Real-user result        ASSET SAVED · Canonical reread Verified · Catalog rebuilt Yes
Canonical revision      2026-08-16T23:42:38.231Z
Acceptance safety       safety/post-build102-real-user-pass-20260817-0142
```

Detailed receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

## In progress

### Post-Build102 fresh audit

Build102 is accepted. Phase9 returns to **read-only audit mode**.

No new runtime slice is allocated yet.

**Build103 remains UNALLOCATED.**

## Next

Run a fresh read-only audit against the current Studio/Track Manager/LaunchPAD contracts and select exactly one smallest coherent gap.

Re-evaluate, without assuming the winner:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can provide a trustworthy contract;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries;
- degraded/offline/PWA behavior;
- publication projection where a public Track may coexist with a canonical parent Album still Draft.

Do not allocate Build103 from memory. Do not bundle unrelated fixes.

## Backlog

### Premium interaction polish

Rolling, non-blocking product polish remains explicitly preserved:

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
- Do not reopen completed phases merely because historical docs are old or verbose.
- Do not use a new build as a bucket for opportunistic refactors.
- Do not treat a deployed candidate as accepted until real-user validation exists where required.
- Do not deliberately damage or interrupt production merely to prove retry/ambiguity behavior.
- Do not generalize GET retry into write retry.
- Do not generalize non-mutating validation retry into write retry.
- Do not generalize one write family's recovery postcondition into another operation family.
- Build101 remains rejected historical evidence; do not relabel it accepted because Build102 passed.
- Do not allocate Build103 before the post-Build102 fresh audit proves its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for the current runtime checkpoint, `QA.md` for the Build102 acceptance boundary, and [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md) for the detailed real-user receipt.
