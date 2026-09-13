# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-13 after **Build114 REAL USER PASS**.

This file tracks durable Done / Active / Next / Backlog state. Historical implementation detail belongs in changelogs, milestone docs and acceptance receipts.

## Done

### Foundation / integration

- Phases 0–6 — complete.
- Phase 7-A — complete / REAL USER PASS.
- Phase 7-B — complete / REAL USER PASS.
- Phase 7-C — complete / program closeout.
- Phase 8 — complete through Build81.
- Phase 9 — complete through accepted Build106.
- Phase 10 Slice1 — Build107 shared catalog projection kernel / REAL USER PASS.

Accepted workflow authority remains:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

### Build108 — catalog rebuild operation identity

Accepted / REAL USER PASS. One explicit rebuild action gets one UUID and canonical `generationId` proof; no blind write retry after response loss.

### Build109 — Track-create operation identity

Accepted / REAL USER PASS. One explicit Track create gets one private immutable `creationOperationId`; no blind second create POST; legacy callers stay compatible.

### Build110 — human-first Studio simplification + premium feel

Accepted by real-user visual smoke. Home / Tracks / Albums are the clear daily path; specialist tooling and technical noise are demoted; interaction feedback is restrained and coherent.

Permanent product rule:

> Human-visible complexity must decrease unless new visible information directly helps a decision or action.

### Build111 — Release → Flow handoff simplification

Accepted / REAL USER PASS. Release now hands off MASTER 16:9, anchored 1:1 / 9:16 adaptations and optional ≤8 s Canvas prompt to Google Flow. Official SHINOBIWAN logo identity is preserved and always visually subordinate to the title.

### Build112 — MUSIC Pack JSON V1 import

Complete bounded foundation:

- frozen versioned schema;
- import into selected Track only;
- visible identity mismatch confirmation;
- browser-local persistence per Track;
- MUSIC content stays non-canonical;
- no Track Manager / Worker / R2 writes from Pack import.

### Build113 — SoundCloud Pack priority

Accepted / REAL USER PASS. Imported SoundCloud title / description / tags / highlight are first-class and immediately visible; no duplicate manual authoring or audio re-selection; secondary Pack content remains collapsible.

### Build114 — Album-create operation identity

Accepted / REAL USER PASS after real-user corrective.

- one UUID per explicit Album create action;
- private immutable Album `creationOperationId`;
- lost response resolved by bounded private canonical reread;
- exact identity required before causal claim;
- no blind second POST;
- public projection excludes private creation evidence;
- blank / omitted Album year remains canonical `null`, never `0`.

Evidence is recorded in [`docs/acceptance/BUILD114-REAL-USER-PASS.md`](docs/acceptance/BUILD114-REAL-USER-PASS.md).

## Active

### Phase 10 — progressive extraction

Phase10 remains active as a program, not permission for continuous refactoring. **Phase10 Slice2 remains unallocated.** Builds108/109/114 are bounded reliability work outside it; Builds110–113 are human-facing/product workflow improvements outside it.

### Release discipline

- `src/release.ts` and `package.json` are canonical runtime identity.
- every allocated implementation build increments version/build at implementation start;
- matching `check:buildNNN` is wired immediately;
- `check:release` must pass before closeout.

### Operational execution guardrails — MANDATORY

1. Assistant orchestrates; Codex/Astra get bounded missions only.
2. Quota first; do not spend strong-model quota on mechanical GitHub inspection.
3. GitHub accepted `main` is canonical; local work requires remote/fetch/HEAD/ahead-behind/working-tree/diff preflight.
4. Diff first, model second.
5. No EOL / formatting explosions.
6. CI failures are fixed by stale-assumption family, not one guard at a time.
7. Green CI is not production deployment evidence.
8. Closeout: bounded diff → CI green → merge → required backend deploy → Studio deploy → real-user smoke → docs/current state.
9. No deliberate production damage to manufacture ambiguity/retry tests.

## Next

### Build115 — Safe Album Delete

Allocated after Build114 smoke exposed that Studio currently has no whole-Album deletion path.

Contract:

- whole-Album delete is explicit and destructive, never a casual secondary button;
- strong confirmation must name the canonical Album ID;
- Track Manager remains the sole R2 delete authority;
- request carries the expected canonical revision;
- no blind automatic retry after timeout / transport loss;
- backend removes Album manifest + Album-scoped assets as one guarded operation;
- any Track-side cached Album display metadata is returned to Singles / unassigned semantics where needed;
- catalog is rebuilt before success is reported;
- Studio verifies canonical Album absence after success;
- if response is lost, Studio rereads canonical Album/list state and only reports committed when absence is proven;
- rollback / ambiguity must stay visible and actionable;
- public Worker behavior must not change.

### Build116 — candidate after Build115

Build116 is authorized by the user but its exact implementation slice must be chosen only after Build115 CI/diff evidence. Preferred fresh-audit candidates, in order:

1. the next destructive-lifecycle gap directly adjacent to Safe Album Delete, if one is concretely proven;
2. otherwise exact-byte/digest proof for binary uploads, if backend evidence can support it without broadening write authority;
3. otherwise a bounded human-facing cleanup directly exposed by the Build115 smoke.

Do **not** allocate Build116 as an opportunistic-refactor bucket.

## Backlog

### Reliability candidates requiring stronger backend evidence

- exact-byte/digest proof for binary uploads;
- Deep Audio request status/idempotency only if coordinator/backend gains safe identity/status evidence;
- degraded/offline behavior only when it materially affects daily private Studio use.

### Future Phase10 extraction candidates

Hypotheses only until freshly audited:

- mature LRC synchronization boundaries;
- SonicTrace logic not already correctly reused;
- additional catalog logic only where exact duplication is proven;
- shared contracts/types only when authority remains singular and standalone apps stay safe.

There is currently **no official Phase11**.

## Frozen roadmap constraints

- no second queue, workflow-priority engine, Album authority or generic write service;
- no reopening completed phases merely because historical docs are verbose;
- no opportunistic-refactor bucket build;
- no deployed candidate is accepted without required real-user validation;
- no GET/validation retry generalized into write retry;
- no operation identity generalized into unrelated writes without fresh contract work;
- no causal proof when backend evidence does not support it;
- Build101 and Build104 remain rejected historical evidence;
- Build107 remains accepted Phase10 Slice1;
- every future UI addition must justify its visible space to the human operator;
- prefer removing redundant information/actions over adding another panel/status/card.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth and [`docs/acceptance/BUILD114-REAL-USER-PASS.md`](docs/acceptance/BUILD114-REAL-USER-PASS.md) for the latest accepted Studio receipt.
