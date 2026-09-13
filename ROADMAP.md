# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-13 after **Build109 REAL USER PASS** and release closeout.

This file tracks durable Done / Active / Next / Backlog state. Historical implementation detail belongs in `changelogs/`, `docs/` and acceptance receipts.

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

Phase9 is closed on accepted **Studio v0.19.28 · Build106**. Its reliability contracts remain frozen.

Accepted Build106 receipt: [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md).

Phase9 closeout audit: [`docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md).

### Phase 10 Slice1 — Build107 shared catalog projection kernel — REAL USER PASS

Build107 remains the first accepted Phase10 progressive-extraction slice. SonicTrace owns the sole editable numerical kernel; Studio consumes the generated digest-pinned copy. Surrounding projection, clustering, zones, nearest and semantic policy remain application-owned.

Accepted Build107 receipt: [`docs/acceptance/BUILD107-REAL-USER-PASS.md`](docs/acceptance/BUILD107-REAL-USER-PASS.md).

### Build108 — explicit catalog rebuild generation identity — REAL USER PASS

Build108 is a separately bounded reliability/backend-contract slice, **not Phase10 Slice2**.

Accepted contract:

```text
explicit Studio rebuild
→ one browser UUID operationId
→ Track Manager persists catalog generationId
→ server verifies identity before success
→ Studio private canonical reread
→ exact generationId match = verified commit
```

Lost HTTP response never causes blind automatic write retry. Success recovery is allowed only when canonical reread proves the exact operation UUID.

Accepted Build108 receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

### Build109 — explicit Track-create operation identity — REAL USER PASS

Build109 is a separately bounded reliability/backend-contract slice, **not Phase10 Slice2**.

Accepted contract:

```text
explicit Track create
→ one browser UUID operationId
→ one create POST
→ Track Manager persists private immutable creationOperationId
→ normal success keeps exact canonical verification
→ lost response triggers private canonical reread only
→ exact creationOperationId match = committed / recovered
→ mismatch / missing / unreadable proof = ambiguous or unverified
```

Compatibility remains intact for old callers without `operationId`. Existing slug uniqueness / `TRACK_EXISTS` authority remains unchanged. The private creation identity is stripped from public catalog/projection output.

Evidence:

```text
Backend PR             LaunchPAD-APP #276
Backend candidate      3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge          5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy           #44 · 34762956165 · SUCCESS · admin only
Studio PR              #218
Studio candidate       5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI              #660 · 34762678307 · SUCCESS
Studio merge           4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages           #229 · 34762759192 · SUCCESS
Real-user smoke        PASS · creationOperationId 77ce7e21-90b9-46a3-b166-6148003d50a8
Smoke cleanup          build109-smoke-20260913 deleted
```

Accepted Build109 receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

## Active

### Phase 10 — progressive extraction

Phase10 remains active as a **program**, not as permission for continuous refactoring.

Phase10 Slice2 remains unallocated. Build108/109 are independently bounded reliability work and do not consume that slice.

### Release discipline

Accepted runtime identity must advance with each allocated build. `src/release.ts` and `package.json` are canonical release metadata, and `check:release` now rejects stale build/version metadata relative to the latest `check:buildNNN` gate.

## Next

### No Build110 allocated

Do not allocate Build110 until a fresh bounded audit proves a specific safe scope, rollback boundary, validation matrix and acceptance condition.

The next candidate may come from reliability, product polish or Phase10 extraction, but it must be selected by evidence rather than by build-number momentum.

## Backlog

### Reliability candidates requiring stronger backend contracts

- Album create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- Deep Audio request status/idempotency if the coordinator later gains an operation identity contract;
- degraded/offline behavior that materially affects the private Studio workflow.

Track-create operation identity is no longer backlog: Build109 accepted that exact path.
Catalog rebuild operation identity/generation evidence is no longer backlog: Build108 accepted that exact path.

### Premium interaction polish

Rolling, non-blocking product polish remains preserved:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

### Future Phase10 extraction candidates

Candidates remain hypotheses until audited:

- mature LRC synchronization boundaries;
- SonicTrace analysis/profile/catalog logic not already correctly reused;
- additional catalog logic only where exact duplication is proven;
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
- Do not generalize Build108 `generationId` or Build109 `creationOperationId` into unrelated write families without a fresh contract audit.
- Do not fake causal proof when the backend exposes no operation identity/digest/status evidence.
- Build101 and Build104 remain rejected historical evidence.
- Phase9 is complete.
- Build107 remains accepted Phase10 Slice1 and must not expand retroactively.
- Build108 and Build109 are accepted reliability work outside Phase10 Slice2.
- Any Phase10 Slice2 still requires a fresh bounded audit.
- Every allocated build must increment the canonical Studio build/version metadata and pass `check:release` before acceptance.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md) for the latest accepted Studio runtime receipt.
