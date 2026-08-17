# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Phase9 program closeout audit** on accepted Build106.

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

### Phase 9 — reliability / canonical truth — PROGRAM COMPLETE

Phase9 is closed on accepted **Studio v0.19.28 · Build106** after a fresh read-only post-Build106 audit found no additional honest Studio-only runtime slice under current backend contracts.

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
Build106  public catalog fallback transient GET retry           REAL USER PASS
```

Accepted Build106 receipt: [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md).

Phase9 closeout audit: [`docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md).

The closeout audit explicitly checked the remaining one-shot/read seams and rejected fake work:

- public Album visuals do not rescue Albums without private canonical Album truth;
- SonicTrace `/api/live` is diagnostic System Status only;
- Album migration dry-run is archived maintenance, not daily workflow;
- Home / Workflow / Track Workspace converge through the already hardened catalog layer;
- Album / Lyrics / SonicTrace canonical reads and metadata/Lyrics validations are already bounded;
- catalog rebuild lost-response causality cannot be proven client-side from catalog count alone;
- create lost-response and exact-byte binary causality require stronger backend evidence;
- further Deep Audio ambiguity hardening requires coordinator operation identity/status/idempotency.

**Build107 remains UNALLOCATED / UNUSED.** Phase9 does not consume it.

### Cross-stack publication projection — CLOSED

LaunchPAD-APP Public Worker **v2.8** gates public list/detail/media visibility from canonical Album `trackIds` ownership. Published Tracks owned by Draft/archived Albums are withheld; standalone published Tracks and Tracks owned by published Albums remain public. This is accepted cross-stack truth and is not a Studio build candidate.

## Active

No runtime phase is active.

The project is intentionally at a **transition boundary** between closed Phase9 and future Phase10. No version/build is allocated by this docs-only state transition.

## Next

### Phase 10 — progressive extraction — SCOPE AUDIT REQUIRED

Perform a fresh read-only cross-repository scope audit before any implementation.

Phase10's durable direction is **progressive extraction of mature LRC / SonicTrace / catalog capabilities while Studio remains the orchestrator**. The audit must prove one smallest independently reversible slice rather than assuming extraction is automatically beneficial.

Before allocating Build107, verify:

```text
1. which engine capability is genuinely mature enough to extract/reuse;
2. where its canonical authority already lives;
3. whether extraction removes duplication instead of creating a second source of truth;
4. whether standalone LaunchPAD / Track Manager / SonicTrace / LRC Maker remain functional;
5. whether Studio remains orchestration/UI rather than becoming a monolith;
6. exact rollback boundary;
7. exact CI + real-user acceptance boundary.
```

**Do not allocate Build107 until this audit yields one bounded Phase10 slice.**

## Backlog

### Reliability candidates requiring stronger backend contracts

These are intentionally carried beyond Phase9; they are not unfinished Studio client work:

- Album create lost-response causality / operation identity;
- Track create lost-response causality / operation identity;
- exact-byte/digest proof for binary upload families;
- catalog rebuild operation identity/generation evidence;
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

This polish may be folded into a future bounded product slice only when it does not blur the scope or acceptance boundary.

### Phase 10 — progressive extraction candidates

Potential future extraction/reuse areas to audit, not promises:

- mature LRC synchronization engine boundaries;
- mature SonicTrace analysis/profile/catalog logic;
- catalog projection/normalization logic where duplication is proven;
- shared contracts/types only when authority remains singular and standalone apps remain safe.

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
- Do not fake causal proof when the backend exposes no operation identity/digest/status evidence.
- Build101 remains rejected historical evidence; do not relabel it accepted because Build102 passed.
- Build104 remains rejected historical evidence; do not relabel it accepted because Build105 passed.
- Phase9 is complete; do not allocate Build107 as a Phase9 filler build.
- Build107 may be allocated only after the Phase10 scope audit proves one bounded runtime slice.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md) for the latest accepted Studio runtime receipt, and [`docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md) for the Phase9 program-closeout decision.