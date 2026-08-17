# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build102 REAL USER PASS** and reconciliation of the already-accepted Public Worker v2.8 corrective.

This file tracks only durable Done / Active / Next / Backlog state. Historical implementation detail belongs in `changelogs/`, `docs/` and acceptance receipts.

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

Accepted Studio lineage:

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

### Cross-stack publication projection — CLOSED

The post-Build100 audit separately proved a public visibility leak: a Track could already be `published` while its canonical parent Album remained Draft. This was **not a Studio runtime gap** and did not need a Studio build.

LaunchPAD-APP Public Worker **v2.8** now gates public list/detail/media visibility from canonical Album `trackIds` ownership:

```text
published Track + no canonical Album owner          → PUBLIC
published Track + published canonical Album owner   → PUBLIC
published Track + draft/archived canonical owner    → WITHHELD
ownership conflict                                  → WITHHELD / fail closed
```

Accepted receipts:

```text
LaunchPAD PR            #241
Source merge            b99ff00bb2483b46c7b1e02c874ebfc22892156d
Cloudflare deploy       31974132377 · target public
Public Worker           v2.8
Cloudflare Version ID   49d87191-a13e-41a7-80c8-d1fd9362af77
Real-user smoke         Pixels & Promises hidden while Anh Yêu Em remained Draft
Admin Worker            SKIPPED / unchanged TM v5.24
R2 write/schema         NONE
```

The reverse Draft→Published visibility restoration remains automated-regression evidence; the production human smoke did not publish the Album merely to manufacture proof.

### Phase 9 Slice20 — Track asset normal-success verification truth

**Accepted runtime: Build102 · v0.19.24 · REAL USER PASS**

Build101 introduced the intended stronger Track asset normal-success proof but failed real-user acceptance because identical R2 object ETags arrived in quoted HTTP and raw canonical representations. Build102 normalizes only one symmetric outer quote pair before exact comparison and preserves exact revision, filename, presence, size, content type, duration and zero-auto-retry semantics.

Detailed receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

## In progress

### Post-Build102 fresh audit

Build102 is accepted. Phase9 is back in **read-only audit mode**.

**Build103 remains UNALLOCATED.**

## Next

Reread current Studio / Track Manager contracts and select exactly one smallest coherent gap. Remaining candidates are:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can provide trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries;
- degraded/offline behavior that materially affects the private Studio workflow.

The public Track-vs-Draft-Album projection item is already closed by Public Worker v2.8 and must not be reallocated as Build103.

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

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md) for the detailed Build102 receipt.
