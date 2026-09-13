# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-13 after **Build108 REAL USER PASS** and acceptance closeout.

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

Evidence:

```text
Backend PR             LaunchPAD-APP #275
Backend merge          31675ba4444282691c6e4d55d098f187ab3c4bad
Admin deploy           34753041082 · SUCCESS · admin only
Admin Worker version   ff037b48-b717-49a4-82ad-395aa06b6f6f
Studio PR              #216
Studio head            b27a2891d2041d79aad4ab2910a150516af74ad4
Studio CI              #639 · 34752807960 · SUCCESS
Studio merge           e380a6ab098bddad8b744812515df36fe3ef5906
Studio Pages           #227 · 34753099885 · SUCCESS
Real-user smoke        PASS · 45 tracks · generation c4072021-707b-4d03-be8e-d21324a348b4 · verified
```

Accepted Build108 receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

## Active

### Phase 10 — progressive extraction

Phase10 remains active as a **program**, not as permission for continuous refactoring.

The post-Build107 fresh audit found no justified Slice2 extraction. Slice2 remains unallocated.

### Reliability contract hardening

Build108 proves that stronger backend evidence can safely close one causality gap without generalizing write retry. Future slices must be independently scoped and must not assume Build108's generation identity applies to unrelated write families.

## Next

### Fresh bounded Track-create operation-identity audit

Before Build109 or any code change, perform a read-only Studio + Track Manager audit of Track Create.

The audit must prove all of the following:

```text
1. one durable client operation identity can be bound to a single intended Track creation;
2. duplicate create after response loss cannot silently create a second canonical Track;
3. canonical reread can distinguish committed / not committed / ambiguous truthfully;
4. no automatic blind write retry is introduced;
5. existing TRACK_EXISTS / slug / manifest authority remains intact;
6. old clients remain compatible or the migration boundary is explicit;
7. backend and Studio can be rolled out in a safe order;
8. CI and real-user acceptance boundaries are exact and non-destructive.
```

Do not allocate Build109 until this audit passes.

## Backlog

### Reliability candidates requiring stronger backend contracts

- Album create lost-response causality / durable operation identity;
- Track create lost-response causality / durable operation identity — **next audit candidate**;
- exact-byte/digest proof for binary upload families;
- Deep Audio request status/idempotency if the coordinator later gains an operation identity contract;
- degraded/offline behavior that materially affects the private Studio workflow.

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
- Do not generalize Build108's `generationId` into unrelated write families without a fresh contract audit.
- Do not fake causal proof when the backend exposes no operation identity/digest/status evidence.
- Build101 and Build104 remain rejected historical evidence.
- Phase9 is complete.
- Build107 remains accepted Phase10 Slice1 and must not expand retroactively.
- Build108 is accepted reliability work outside Phase10 Slice2.
- Any Phase10 Slice2 still requires a fresh bounded audit.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md) for the latest accepted Studio runtime receipt.
