# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-14 after **Build116 REAL USER PASS**.

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
- guarded Album manifest + Album asset deletion;
- affected Track compatibility metadata returns to Singles / unassigned semantics;
- catalog rebuilt and Album absence canonically verified;
- lost response resolved by reread, never blind destructive retry.

Evidence: [`docs/acceptance/BUILD115-REAL-USER-PASS.md`](docs/acceptance/BUILD115-REAL-USER-PASS.md).

### Build116 — Safe Track Delete

Accepted / REAL USER PASS after contextual-UX corrective.

- exact canonical Track ID + second destructive confirmation;
- expected revision required;
- hard block while any canonical Album owns the Track through `album.trackIds`;
- no silent Album membership mutation;
- Track-scoped R2 backup/delete/rollback + catalog rebuild + canonical absence proof;
- lost response resolved by reread, never blind destructive retry;
- contextual `Delete Track…` action lives on the current Track workspace.

Evidence: [`docs/acceptance/BUILD116-REAL-USER-PASS.md`](docs/acceptance/BUILD116-REAL-USER-PASS.md).

## Active

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

### Build117 — exact-byte SHA-256 proof for Track asset uploads

Allocated via issue #232 after a fresh bounded audit.

Current Track asset upload proof is strong but not exact-byte causal proof:

- normal success checks canonical revision, filename, presence, size, content type, server ETag and duration where applicable;
- lost-response recovery checks new revision + selected-file size/content type + changed server fingerprint;
- therefore a compatible newly stored object can be proven, but exact equality with the browser-selected bytes cannot.

Build117 contract:

- compute SHA-256 of the selected Track asset in Studio before upload;
- send the digest inside existing multipart `asset-upload-v1`;
- Track Manager validates and stores the digest as private R2 custom metadata;
- backend reread requires exact digest persistence before success;
- private Track read exposes the stored digest to Studio;
- normal success requires selected digest == response digest == canonical private reread digest;
- lost-response recovery reports committed only on exact digest match at a new revision;
- same revision remains NOT COMMITTED / explicit retry safe;
- changed state with missing/different digest remains AMBIGUOUS / do not retry;
- zero blind upload retries;
- no public projection dependency and no generic idempotency framework.

Deliberate boundary: **Track asset uploads only**. Album asset digest proof remains a separate fresh-audit candidate.

## Backlog

### Reliability candidates requiring stronger backend evidence

- Album asset exact-byte/digest proof after Build117 evidence;
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

See `PROJECT_STATE.md` for current runtime/cross-stack truth and [`docs/acceptance/BUILD116-REAL-USER-PASS.md`](docs/acceptance/BUILD116-REAL-USER-PASS.md) for the latest accepted Studio receipt.
