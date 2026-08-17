# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build104 deployed candidate**. Build103 remains the latest accepted Studio runtime until real-user smoke.

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

## In progress

### Phase 9 Slice22 — Deep Audio response-loss ambiguity fence

**Deployed candidate: Build104 · v0.19.26 · REAL USER SMOKE PENDING**

Fresh post-Build103 audit rejected create/upload response-loss causality as a safe Studio-only change because those operations still lack request identity/digest evidence. It instead proved a bounded Deep Audio truth gap: after `/api/studio/analyze` submit begins, timeout/transport cannot prove whether GPU compute ran or is still running.

Build104 contract:

```text
Deep Audio POST response received
→ existing normal FULL / PARTIAL path

Deep Audio POST timeout / browser transport response loss
→ COMPUTE UNKNOWN
→ ZERO automatic retry
→ exact Track + canonical source revision fenced in-page
→ second same-source POST rejected before submit
→ explicit page reload required before deliberate manual resubmit
```

Browser DSP remains reviewable, but saving browser-only fallback does not prove an uncertain Deep Audio compute did not run.

Candidate receipts:

```text
Runtime PR             #202
Exact tested head      8060a81b7fdb6a608244c768a042e56e630451f0
Final runtime CI       #564 · 31983472391 · SUCCESS
Runtime merge          a0a082376eedc6c5c90bad59bbc5e92bf72e6cdd
Runtime Pages          #213 · 31983514507 · SUCCESS build + deploy
Safety pre-build       safety/pre-build104-deep-audio-response-loss-fence-20260817
Safety green premerge  safety/post-build104-green-premerge-20260817-0258
Safety post-deploy     safety/post-build104-deployed-candidate-20260817-0301
```

Detailed audit: [`docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md`](docs/PHASE9-BUILD104-DEEP-AUDIO-RESPONSE-LOSS-FENCE.md).

**Build103 remains the latest accepted runtime until the Build104 human smoke passes.**

## Next

Perform one **normal-path** Build104 real-user SonicTrace / Deep Audio analysis on a known-good existing Track.

Do not deliberately trigger timeout, network loss or Access failure. The automated Build104 guard proves the ambiguity fence; production smoke only proves the healthy path remains normal and does not duplicate compute.

After explicit PASS: acceptance-closeout Build104, then a fresh read-only Phase9 audit before allocating another build.

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
- Build104 must not be accepted until its normal-path human smoke passes.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, [`docs/acceptance/BUILD103-REAL-USER-PASS.md`](docs/acceptance/BUILD103-REAL-USER-PASS.md) for the latest accepted Studio receipt, and [`changelogs/CHANGELOG-BUILD104.md`](changelogs/CHANGELOG-BUILD104.md) for the deployed candidate boundary.
