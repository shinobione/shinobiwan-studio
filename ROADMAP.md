# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-27 after Build121 / A2.3 Slice 2 merged, Pages deployed and bounded owner REAL USER PASS. Build122 Recordings explorer / contextual QA is the separately authorized active candidate. See PROJECT_STATE.md for exact receipts.

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

### Catalogue A2.1 — Build118 accepted foundation

Native empty read-only Catalogue accepted by the owner's original seven checks. Documentation #241 is merged and preserves the [original acceptance receipt](docs/acceptance/BUILD118-REAL-USER-PASS.md) separately from the later CPU recovery. The later, independent A2.2 import belongs to accepted Build119 below.

### CPU corrective slices 2–3 — bounded functional recovery

Studio #239 lean canonical Album consumer is merged and Pages deployed. The separately deployed LaunchPAD Tracks CPU corrective and Studio slice 2 received a bounded Albums/Tracks functional PASS in [issue #238](https://github.com/shinobione/shinobiwan-studio/issues/238#issuecomment-5849807422). This does not close the incident or prove sustained CPU compliance; frontend request sharing is now merged in #240.

### CPU corrective slice 4 — merged, deployed, bounded owner PASS

PR #240 merged at `650c8a3cf9a69f95732905562535394fac94a12e`; exact-head CI and Pages succeeded. Owner reports one HTTP 200 per core private collection/health endpoint on a clean load, correct artwork and 7 Albums (4/3/0). Sustained CPU compliance remains unmeasured and incidents remain open. [Separate original and recovery receipts](docs/acceptance/BUILD118-CPU-RECOVERY.md).

### Catalogue A2.2 — Build119 accepted

PR #242 merged at `20a0adf15271a0f9bff0cbd2a318c441685ec2bc`; candidate CI 36312536104 and Pages 36316493317 SUCCESS. The owner confirmed the explicit local-private JSON import (444 rows / 168 Recordings / 84 Releases / 109 appearances / 120 known and 48 missing ISRC / 0 rejected / 355 pending), QA, Reset/unload, refresh-empty and no private upload/storage in DevTools. Scope is **temporary, read-only, session-only**; no resolved source cases, full workbook coverage, persistent registry or A2.3 browsing. [Owner receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md).

### Catalogue A2.3 Slice 1 — Build120 accepted

PR #244 exact candidate `de1000940c32efcc8024c4fd61f240cfa7f93860` passed CI 36318925988; merge `09681904e69b9f2c3ab7bf0d41de1cf1a7dd5d11`, Pages 36320947983 SUCCESS. Owner confirmed the five requested checks: live source-derived metrics, session continuity across Catalogue sections, finding-group QA links/Show all, Reset/refresh empty and DevTools no private upload/storage/source ID in route. **Bounded REAL USER PASS** for session + Overview only. [Owner receipt](docs/acceptance/BUILD120-REAL-USER-PASS.md); [original candidate validation](docs/CATALOGUE-A2-3-SLICE1-VALIDATION.md). No commercial persistence, source auto-link or release gallery.

### Catalogue A2.3 Slice 2 — Build121 accepted

[PR #246](https://github.com/shinobione/shinobiwan-studio/pull/246), final candidate `757a46d0d83804ae5cd2b7a7c03c483125c0c67e`, [CI #36324001763](https://github.com/shinobione/shinobiwan-studio/actions/runs/36324001763) SUCCESS, merged at `6fd52f9f21ceb54d2014eaa99efb77d5ec899937`; [Pages #36325763251](https://github.com/shinobione/shinobiwan-studio/actions/runs/36325763251) SUCCESS. Owner confirmed seven production checks on private source: 84 distinct Releases, source search/filter/sort and Grid/List, exact detail/provenance including unbound appearances, unknown publication and honest artwork placeholders, keyboard focus, session/reset/refresh and DevTools privacy. **Bounded REAL USER PASS** for gallery/detail only. [Owner receipt](docs/acceptance/BUILD121-REAL-USER-PASS.md). [Original candidate validation](docs/CATALOGUE-A2-3-SLICE2-VALIDATION.md) remains historical. No commercial persistence, source auto-link or real cover mapping.

## Active

### Catalogue A2.3 Slice 3 — Build122 candidate

Native Recordings explorer, exact bound multi-Release detail and evidence-linked contextual QA; all findings remain globally available. Dedicated branch from verified main; Draft PR/final-head CI delivery only. No merge/deployment/REAL USER PASS. [Implementation and owner handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md).

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

Review Build122 Draft and final-head CI, then separately authorize merge/Pages and perform the Slice 3 owner acceptance handoff. Commercial persistence/STUDIO ↔ LaunchPAD sync and real artwork mapping require later authority decisions. PR #237 remains open, superseded by merged #241; CPU issues remain open without sustained measurements.

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

See `PROJECT_STATE.md`, [Build121 owner A2.3 Slice 2 acceptance](docs/acceptance/BUILD121-REAL-USER-PASS.md), [Build120 Slice 1 acceptance](docs/acceptance/BUILD120-REAL-USER-PASS.md), [Build119 import acceptance](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 A2.1 acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md) and [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md). CPU issues remain open without sustained CPU measurements.
