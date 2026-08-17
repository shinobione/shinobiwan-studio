# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build103 REAL USER PASS**.

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
Build103  canonical audio pre-compute transient retry          REAL USER PASS
```

### Cross-stack publication projection — CLOSED

LaunchPAD-APP Public Worker **v2.8** gates public list/detail/media visibility from canonical Album `trackIds` ownership. Published Tracks owned by Draft/archived Albums are withheld; standalone published Tracks and Tracks owned by published Albums remain public. This is accepted cross-stack truth and is not a Studio build candidate.

### Phase 9 Slice20 — Track asset normal-success verification truth

**Accepted runtime: Build102 · v0.19.24 · REAL USER PASS**

Build101 introduced the stronger Track asset normal-success proof but failed real-user acceptance because identical R2 object ETags arrived in quoted HTTP and raw canonical representations. Build102 normalizes only one symmetric outer quote pair before exact comparison and preserves exact revision, filename, presence, size, content type, duration and zero-auto-retry semantics.

Detailed receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

### Phase 9 Slice21 — canonical audio pre-compute transient retry

**Accepted runtime: Build103 · v0.19.25 · REAL USER PASS**

Build103 adds exactly one bounded retry to the non-mutating canonical master-audio GET before SonicTrace / Deep Audio compute for timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`.

Critical boundary remains frozen:

```text
canonical audio GET        one bounded transient retry allowed
POST /api/studio/analyze   ZERO automatic retries
canonical writes           unchanged / operation-specific no-blind-retry rules
```

Accepted receipts:

```text
Runtime PR             #198
Exact tested head      9d89aa1051b67b828836a45b648b6f45b69dbe74
Final runtime CI       #543 · 31981673322 · SUCCESS
Runtime merge          5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages          #209 · 31981768144 · SUCCESS build + deploy
Candidate docs PR      #199
Candidate docs merge   c98bfbba7c48d2cbf96b7b4760204b6d0523c228
Candidate docs Pages   #210 · 31981993765 · SUCCESS build + deploy
Real-user smoke        BUILD103 SMOKED 💨
```

Detailed receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md).

## In progress

### Post-Build103 fresh audit

Build103 is accepted. Phase9 is back in **read-only audit mode**.

**Build104 remains UNALLOCATED** until the audit proves one smallest coherent next gap.

## Next

Re-read the current Studio / Track Manager / SonicTrace contracts and select exactly one bounded gap. Candidates to re-evaluate include:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can provide trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries beyond the safe pre-compute GET;
- degraded/offline behavior that materially affects the private Studio workflow.

Do not pre-select a candidate merely because it appears in this list.

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
- Do not allocate Build104 before Build103 acceptance and a fresh post-acceptance read-only audit prove its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md) for the latest accepted Studio receipt.
