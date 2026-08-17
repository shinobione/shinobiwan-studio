# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-17 after **Build103 deployment candidate**; Build102 remains the latest accepted Studio runtime pending Build103 real-user smoke.

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

### Phase 9 Slice21 candidate — canonical audio pre-compute transient retry

**Deployed candidate: Build103 · v0.19.25 · REAL USER SMOKE PENDING**

Fresh post-Build102 audit selected the smallest coherent remaining gap: the non-mutating canonical master-audio GET performed before SonicTrace Deep Audio compute had no transient retry.

Build103 adds exactly one bounded retry for timeout, browser transport interruption, or HTTP `408/425/429/500/502/503/504`, with at most two total GET attempts. Access failures, deterministic ordinary HTTP failures, and empty/invalid successful responses remain non-retry.

Critical boundary remains frozen:

```text
canonical audio GET        one bounded transient retry allowed
POST /api/studio/analyze   ZERO automatic retries
canonical writes           unchanged / operation-specific no-blind-retry rules
```

Deployment receipts:

```text
Runtime PR             #198
Exact tested head      9d89aa1051b67b828836a45b648b6f45b69dbe74
Final runtime CI       #543 · 31981673322 · SUCCESS
Runtime merge          5732741bbe0c96d7f6c8d3e1b5b4989af1fa9b83
Runtime Pages          #209 · 31981768144 · SUCCESS build + deploy
Green premerge safety  safety/post-build103-green-premerge-20260817-0217
Post-deploy safety     safety/post-build103-deployed-candidate-20260817-0223
Backend deploy         NONE
R2 schema/data         NONE
```

Detailed candidate contract: [`changelogs/CHANGELOG-BUILD103.md`](changelogs/CHANGELOG-BUILD103.md).

## Next

Run one **normal-path real-user SonicTrace / Deep Audio smoke** against a known-good existing Track with canonical master audio.

Expected:

- canonical audio loads;
- browser DSP completes;
- Deep Audio compute starts once and completes;
- FULL / PARTIAL / UNAVAILABLE truth remains intact;
- no duplicate submit and no unexpected retry UI.

Do not deliberately manufacture timeout/network loss/Access failure in production to exercise the retry branch. The automated Build103 guard owns that proof.

If the smoke passes: close Build103 acceptance first, then perform a fresh read-only Phase9 audit before allocating Build104.

Remaining candidates after Build103 acceptance are still:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary upload families where the backend can provide trustworthy evidence;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and expensive-analysis retry boundaries beyond the safe pre-compute GET;
- degraded/offline behavior that materially affects the private Studio workflow.

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
- Build102 remains the latest accepted Studio runtime until Build103 human acceptance.
- Do not allocate Build104 before Build103 acceptance and a fresh post-acceptance read-only audit prove its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md) for the latest accepted Studio receipt, and [`changelogs/CHANGELOG-BUILD103.md`](changelogs/CHANGELOG-BUILD103.md) for the deployed Build103 candidate contract.
