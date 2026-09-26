# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-26 for CPU corrective slice 2; see PROJECT_STATE.md for reconciled deployment and acceptance boundaries.

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

### Builds108–109 — operation identity foundation

- Build108 catalog rebuild identity — accepted / REAL USER PASS.
- Build109 Track-create identity — accepted / REAL USER PASS.

### Builds110–113 — human-first production workflow

- Build110 human-first Studio simplification + premium feel — accepted by real-user visual smoke.
- Build111 Release → Flow handoff — REAL USER PASS.
- Build112 MUSIC Pack JSON V1 import — complete bounded foundation.
- Build113 SoundCloud Pack priority — REAL USER PASS.

Permanent product rule:

> Human-visible complexity must decrease unless new visible information directly helps a decision or action.

### Build114 — Album-create operation identity

Accepted / REAL USER PASS after real-user corrective. One browser UUID per explicit Album create; private immutable `creationOperationId`; no blind second POST; public projection excludes private evidence; blank Album year remains canonical `null`.

Evidence: [`docs/acceptance/BUILD114-REAL-USER-PASS.md`](docs/acceptance/BUILD114-REAL-USER-PASS.md).

### Build115 — Safe Album Delete

Accepted / REAL USER PASS.

- exact canonical Album ID confirmation;
- expected canonical revision required;
- Track Manager-only destructive authority;
- guarded Album deletion with canonical absence proof;
- affected Tracks return to Singles / unassigned compatibility semantics;
- lost response resolved by reread, never blind destructive retry.

Evidence: [`docs/acceptance/BUILD115-REAL-USER-PASS.md`](docs/acceptance/BUILD115-REAL-USER-PASS.md).

### Build116 — Safe Track Delete

Accepted / REAL USER PASS after contextual-UX corrective.

- exact canonical Track ID + destructive confirmation;
- expected revision required;
- hard block while any canonical Album owns the Track through `album.trackIds`;
- no silent Album membership mutation;
- Track-scoped R2 backup/delete/rollback + catalog rebuild + canonical absence proof;
- lost response resolved by reread, never blind destructive retry;
- contextual `Delete Track…` action lives on the current Track workspace.

Evidence: [`docs/acceptance/BUILD116-REAL-USER-PASS.md`](docs/acceptance/BUILD116-REAL-USER-PASS.md).

### Build117 — exact-byte SHA-256 proof for Track asset uploads

Accepted / REAL USER PASS.

- browser computes SHA-256 of the exact selected Track asset before upload;
- digest is carried by existing multipart `asset-upload-v1`;
- Track Manager validates and stores digest as private R2 custom metadata;
- backend reread verifies exact digest persistence;
- private Track read exposes digest to Studio without changing public projection;
- normal success requires selected digest == response digest == private canonical digest;
- lost-response recovery commits only on new canonical revision + exact digest;
- unchanged revision remains NOT COMMITTED / explicit retry safe;
- changed state with missing/different digest remains AMBIGUOUS / do not retry;
- zero blind upload retries.

Pre-merge corrective: bounded duration-evidence compatibility now explicitly includes v5.26/v1.16, v5.27/v1.17 and v5.28/v1.18 in both validation and resilient metadata save seams; the guard still rejects unbounded numeric successor assumptions.

Evidence: [`docs/acceptance/BUILD117-REAL-USER-PASS.md`](docs/acceptance/BUILD117-REAL-USER-PASS.md).

## Active

### CPU corrective slice 2 — lean canonical Album consumer

Build118 A2.1 was merged in #236 and deployed at `b035fb226e8c9a2654306076522faa4da97fb3ea`. Its separate acceptance-docs PR #237 remains open and excluded from this branch. The commercial foundation stays empty and read-only.

Issue #238 / LaunchPAD #283: consume the lean endpoint delivered by LaunchPAD #284, preserving full migration evidence, private authority, bounded retries and write verification. No frontend deduplication, Track/SonicTrace changes, backend changes or production-data work. Stop at Draft PR + exact-head CI. See [corrective receipt](docs/CPU-SLICE2-LEAN-ALBUM-CONSUMER.md).

### Phase 10 — progressive extraction

Phase10 remains active as a program, not permission for continuous refactoring. **Phase10 Slice2 remains unallocated.** Builds108/109/114–117 are bounded reliability/lifecycle work outside it; Builds110–113 are human-facing/product workflow improvements outside it.

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

### Corrective review / browser gate

Review CPU slice 2 Draft PR and exact-head validation before separately authorizing merge/deployment and browser acceptance. The overall CPU incident remains open. A2.2 local-private import/dry-run stays on hold; A2.3 populated views require a separate mission. The limited A2.1 shell smoke in #237 does not prove stable private Album reads.

Album asset exact-byte/digest proof remains independently auditable backlog and is not part of Build118.

## Backlog

### Reliability candidates requiring stronger backend evidence

- Album asset exact-byte/digest proof, subject to fresh audit;
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

See `PROJECT_STATE.md` for current runtime/cross-stack truth and [`docs/acceptance/BUILD117-REAL-USER-PASS.md`](docs/acceptance/BUILD117-REAL-USER-PASS.md) for the latest accepted Studio receipt.
