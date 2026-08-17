# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build106 deployed candidate**. Build105 remains the latest accepted Studio runtime until Build106 real-user smoke.

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

Build104 attempted to fence true Deep Audio response loss after submit, but its normal-path real-user smoke proved every XHR transport error/timeout was being treated as if upload had already begun. Build105 corrected that boundary while retaining zero automatic Deep Audio retries.

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

Accepted receipt: [`docs/acceptance/BUILD105-REAL-USER-PASS.md`](docs/acceptance/BUILD105-REAL-USER-PASS.md).

Build104 remains rejected historical evidence; Build105 acceptance does not rewrite that verdict.

## In progress

### Phase 9 Slice23 — public catalog fallback transient retry

**Deployed candidate: Build106 · v0.19.28 · REAL USER SMOKE PENDING**

Fresh read-only post-Build105 audit proved the public LaunchPAD Track catalog fallback was still one-shot. Build106 preserves the existing initial public read and allows one additional public GET only after the private canonical read has ultimately failed and the first public request failed transiently.

```text
private succeeds
→ existing one-shot public enrichment only
→ NO second GET

private fails + public succeeds
→ use public fallback

private fails + public fails with timeout / browser transport
or HTTP 408 / 425 / 429 / 500 / 502 / 503 / 504
→ one retry
→ max 2 public attempts total

private fails + deterministic public failure / invalid response
→ no retry
```

Bounded endpoints:

```text
GET /health
GET /tracks
GET /tracks/<trackId>
```

The generic HTTP helper stays one-shot. No write, Worker, Track Manager, Public Worker, SonicTrace backend, R2 or Deep Audio behavior changed. Public Album artwork fallback remains outside this slice.

Candidate receipts:

```text
Audit base              7dfda47ed1186adf815bfd60a9c2affa5e1b255e
Runtime PR              #208
Exact tested head       61bca333a7f9898444c8d9e1610e3d6c6585664b
Final runtime CI        #611 · 32058498867 · SUCCESS
Runtime merge           9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Runtime Pages           #219 · 32058828759 · SUCCESS build + deploy
Safety pre-build        safety/pre-build106-public-catalog-fallback-retry-20260817
Safety green premerge   safety/post-build106-green-premerge-20260817-2112
Safety post-deploy      safety/post-build106-deployed-candidate-20260817-2115
```

Detailed candidate receipt: [`changelogs/CHANGELOG-BUILD106.md`](changelogs/CHANGELOG-BUILD106.md).

**Build105 remains the latest accepted runtime until the Build106 human smoke passes.**

## Next

Perform one **normal-path public-fallback** Build106 smoke in a browser context without the private Cloudflare Access session.

Expected:

```text
Studio v0.19.28 · Build106
→ private read unavailable
→ public LaunchPAD catalog loads published Tracks
→ one published Track detail opens normally
```

Do not deliberately trigger Public Worker timeout/503/network failure. Automated Build106 guards prove the transient retry classification; production smoke proves ordinary public fallback remains usable.

After explicit PASS: acceptance-closeout Build106, then a fresh read-only Phase9 audit before allocating another build. **Build107 remains UNALLOCATED.**

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
- Build106 must not be accepted until its normal-path public-fallback human smoke passes.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, [`docs/acceptance/BUILD105-REAL-USER-PASS.md`](docs/acceptance/BUILD105-REAL-USER-PASS.md) for the latest accepted Studio receipt, and [`changelogs/CHANGELOG-BUILD106.md`](changelogs/CHANGELOG-BUILD106.md) for the deployed candidate boundary.
