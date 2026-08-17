# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build105 REAL USER PASS**.

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

### Phase 9 — accepted reliability / canonical truth lineage

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
Build104  Deep Audio response-loss fence candidate             REJECTED · false UNKNOWN classification
Build105  Deep Audio pre-submit transport corrective           REAL USER PASS
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

```text
canonical audio GET        one bounded transient retry allowed
POST /api/studio/analyze   ZERO automatic retries
canonical writes           unchanged / operation-specific no-blind-retry rules
```

Detailed receipt: [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md).

### Phase 9 Slice22 — Deep Audio pre-submit transport corrective

**Accepted runtime: Build105 · v0.19.27 · REAL USER PASS**

Build104 attempted to fence true Deep Audio response loss after submit, but its normal-path real-user smoke proved every XHR transport error/timeout was being treated as if upload had already begun. That could create a false `DEEP AUDIO STATE UNKNOWN` / `RELOAD BEFORE RESUBMIT` when the local coordinator was unavailable before upload start.

Build105 separates the two cases:

```text
transport / timeout BEFORE browser-observed upload start
→ PRE-SUBMIT UNREACHABLE
→ no duplicate-compute fence
→ Browser DSP fallback remains reviewable
→ ZERO automatic retry
→ explicit manual re-scan allowed after coordinator recovery

transport / timeout AFTER browser-observed upload start
→ COMPUTE UNKNOWN
→ exact Track + canonical source revision fenced in-page
→ ZERO automatic retry
→ explicit page reload required before deliberate manual resubmit
```

Synchronous `xhr.send()` failure is pre-submit and unfenced. The corrective changes only Studio; no SonicTrace backend, Track Manager, Worker, Public Worker or R2 schema/data deployment occurred.

Accepted receipts:

```text
Runtime PR             #204
Exact tested head      efa188b8d7181a4aa03bdea4bf2da40534203e9e
Final runtime CI       #585 · 32002434543 · SUCCESS
Runtime merge          f3a295d5e7bdbd0cfa05cc6d44901fab62e42c5b
Runtime Pages          #215 · 32002484381 · SUCCESS build + deploy
Candidate docs PR      #205
Candidate docs CI      #586 · 32002709875 · SUCCESS
Candidate docs merge   6de3709d4e89a2806cbf0cf9b598d71d49b1742f
Candidate docs Pages   #216 · 32002755699 · SUCCESS build + deploy
Human smoke            BUILD105 SMOKED 💨 · FULL profile ready · Deep Audio analysis complete
Safety pre-build       safety/pre-build105-deep-audio-presubmit-corrective-20260817
Safety green premerge  safety/post-build105-green-premerge-20260817-0838
Safety post-deploy     safety/post-build105-deployed-candidate-20260817-0839
Safety human pass      safety/post-build105-real-user-pass-20260817-0854
```

Detailed receipt: [`docs/acceptance/BUILD105-REAL-USER-PASS.md`](docs/acceptance/BUILD105-REAL-USER-PASS.md).

Build104 remains rejected historical evidence; Build105 acceptance does not rewrite that verdict.

## In progress

### Phase 9 — post-Build105 read-only audit boundary

No next build is allocated yet.

**Build106 is UNALLOCATED** until a fresh read-only audit of the real current repository/runtime state proves one smallest coherent reliability or truth gap that is safe to address without widening authority or retry semantics.

## Next

Perform a fresh **read-only post-Build105 Phase9 audit**.

The audit must start from real GitHub state and accepted runtime truth, not from an assumed next feature. If no bounded safe gap is proven, do not allocate Build106 merely to keep the build counter moving.

## Backlog

### Reliability candidates requiring stronger backend contracts

- Album create lost-response causality / operation identity;
- Track create lost-response causality / operation identity;
- exact-byte/digest proof for binary upload families;
- Deep Audio request status/idempotency if the coordinator later gains an operation identity contract;
- degraded/offline behavior that materially affects the private Studio workflow.

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
- Build104 remains rejected historical evidence; do not relabel it accepted because Build105 passed.
- Build106 remains unallocated until the post-Build105 audit proves a bounded next gap.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD105-REAL-USER-PASS.md`](docs/acceptance/BUILD105-REAL-USER-PASS.md) for the latest accepted Studio receipt.
