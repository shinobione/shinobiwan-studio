# SHINOBIWAN STUDIO — Repository Agent Contract

This file is the mandatory startup contract for any coding agent or assistant working in this repository.

## Read order before any mutation

Read these files in this exact order:

1. `PROJECT_STATE.md` — current release truth, receipts, blockers and exact next action.
2. `ROADMAP.md` — done / active / next / backlog.
3. `DECISIONS.md` — frozen architecture, UX and safety decisions.
4. `QA.md` — accepted real-user validation, current regression matrix and known gaps.
5. `docs/INTEGRATION_SAFETY.md` — detailed cross-repository and production safety policy when the task touches writes, Workers, R2, LaunchPAD, SonicTrace or LRC Maker.

Do **not** start by parsing the historical `docs/` and `changelogs/` trees. They are evidence/archive. Open them only when the canonical files above explicitly point to a historical receipt or when the task genuinely needs implementation history.

## Repository truth hierarchy

When sources disagree, use this order:

1. real GitHub state: production branch HEAD, PR state, exact tested SHA, Actions result and deployment result;
2. `PROJECT_STATE.md`;
3. `ROADMAP.md`;
4. `DECISIONS.md` and `QA.md`;
5. current README / concise changelog;
6. historical milestone docs and conversation context.

Never treat a stale document as evidence that a runtime is deployed or accepted.

## Mandatory preflight

Before changing code or runtime behavior:

- verify repository = `shinobione/shinobiwan-studio`;
- verify production branch = `main`;
- verify current `main` HEAD against `PROJECT_STATE.md`;
- inspect open/recent PRs relevant to the requested scope;
- inspect the latest relevant CI and Pages deployment state;
- identify the currently accepted REAL USER PASS baseline;
- confirm the exact active roadmap slice and stop line;
- confirm whether the task is runtime, docs-only, Worker/backend, cross-repository or production-data work.

If GitHub has advanced beyond `PROJECT_STATE.md`, stop treating the file as current truth: reconcile the real state first, then update the checkpoint in the same closeout.

## Acceptance states are distinct

Never collapse these states:

```text
CODED
CI GREEN
MERGED
PAGES DEPLOYED
WORKER DEPLOYED
R2/CATALOG MUTATED
REAL USER PASS
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

A docs-only merge never creates a new runtime build. A Pages deployment does not imply a Worker deployment. A Worker deployment does not imply an R2 mutation.

## Mutation discipline

- Work on a dedicated feature/docs branch.
- Prefer the smallest independently reversible slice.
- Never merge red CI.
- Merge only the exact tested head.
- Do not invent a build number before the scope is proven. An unused build remains unused.
- Do not perform opportunistic refactors during a bounded migration/reliability slice.
- Do not create a generic R2 writer or a second canonical authority.
- Do not automatically retry a write whose response was lost unless canonical reread proves retry safety for that exact operation.
- Do not manufacture destructive production smoke tests against important audio, covers, video, lyrics or Album assets.

## Cross-repository boundaries

Protected related repositories:

```text
shinobione/LaunchPAD-APP      main
shinobione/LM-IA-Analayse    main
shinobione/lrc-maker          master
shinobione/shinobiwan-studio main
```

Do not modify another repository merely because it is related. Cross-repository changes require an explicit dependency reason and independent receipts.

## Canonical closeout rule

At every significant accepted milestone, update the repository memory in the same closeout:

- `PROJECT_STATE.md` — release/runtime/PR/SHA/CI/deploy/RUP and exact next action;
- `ROADMAP.md` — move the slice between Done / Active / Next / Backlog;
- `QA.md` — record real-user smoke, automated coverage and known remaining gaps;
- `DECISIONS.md` — update only when an architecture/product decision is added, changed or superseded;
- `README.md` / `CHANGELOG.md` only when their concise public/current summary becomes stale.

Do not duplicate historical implementation detail into the canonical files. Link the detailed receipt instead.

## Current handoff rule

A new session should be able to begin with:

> Read `AGENTS.md` and resume from the canonical repository checkpoint.

The agent must then reconstruct the working state from the repository and GitHub, not from a previous chat transcript.
