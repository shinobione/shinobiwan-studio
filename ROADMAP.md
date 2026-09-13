# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-13 after **Build109 REAL USER PASS**, release closeout, post-mortem operational guardrails, and Build110 UX planning.

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

### Operational execution guardrails — MANDATORY

These rules are the post-mortem outcome of the Build107–109 work and are part of the roadmap, not optional housekeeping.

#### 1. Assistant orchestrates; Codex/Astra execute only bounded missions

- Do not launch broad multi-repo exploration just because a stronger model is available.
- No `inspect all repos`, open-ended architecture audit, or subagent fan-out by default.
- One concrete objective, one bounded repo scope, explicit stop condition, explicit expected output.
- Cross-repo work is allowed only when the contract genuinely spans those repos and the exact pair is named up front.
- Mechanical GitHub state checks, workflow checks, PR/merge/deploy inspection and simple closeout work should be handled directly without burning Codex/Astra quota.

#### 2. Codex / Work quota is a scarce resource

Before starting any substantial Codex/Work/Astra run:

- check remaining quota and reset time in the UI;
- do not burn a reset to reconstruct context already known by the assistant or present in GitHub;
- do not spend a large quota block on open-ended discovery when a bounded GitHub diff/log inspection can answer the question;
- if Codex is quota-blocked, treat it as idle — it is not continuing useful work in the background and can be closed safely.

The default decision rule is **value per quota**, not maximum model strength.

#### 3. Remote/local truth must be checked before any audit or implementation

GitHub accepted `main` is the canonical accepted repository state. A local checkout may be stale, dirty, on the wrong branch, or contain EOL-only churn. Never ask Codex/Astra to audit or implement against a local checkout before proving its relation to GitHub.

For every participating local repo, run a bounded preflight equivalent to:

```powershell
git -C $repo remote -v
git -C $repo fetch origin --prune
git -C $repo status --short --branch
git -C $repo rev-parse HEAD
git -C $repo rev-parse origin/main
git -C $repo rev-list --left-right --count HEAD...origin/main
git -C $repo diff --name-status
git -C $repo diff --name-status origin/main...HEAD
```

Interpretation must be explicit before work starts:

```text
local HEAD == origin/main        → clean canonical base
local branch ahead of main       → inspect exact intentional delta
local branch behind main         → update/rebase before audit
working tree dirty               → classify every local change first
unexpected remote/path/branch    → STOP
```

For cross-repo work, do this for **every repo**, not just the first one.

#### 4. Diff first, model second

Before spending model quota, compare the exact accepted GitHub base with the intended candidate/local head. The question is always:

```text
What is actually different?
```

Use commit/file diffs and changed-file allowlists before asking for architectural interpretation. If the local checkout and GitHub history disagree, resolve that discrepancy first; do not let an agent infer project state from stale files.

#### 5. No EOL / formatting explosions

- Never normalize the whole repository unless that is the explicit task.
- Large unexpected `M` sets after an agent run are presumed suspicious until proven semantic.
- Use changed-file allowlists and ignore-space/EOL comparisons to distinguish real edits from line-ending churn.
- Restore EOL-only changes before commit; do not carry them into a feature PR.

#### 6. One bounded fix → one grouped commit/CI cycle

When CI fails:

1. read the failing job/log first;
2. identify the complete family of the same stale assumption;
3. patch that family together;
4. launch one new CI cycle.

Do **not** fix historical successor/version guards one file at a time and trigger a chain of redundant CI runs.

#### 7. Build identity is allocated at build start, not at closeout

As soon as a new Studio build is allocated for implementation:

- increment `src/release.ts`;
- increment `package.json`;
- add/update the matching `check:buildNNN` gate;
- verify `check:release` before functional closeout.

A planned roadmap candidate may be named before implementation starts, but the accepted/runtime identity remains on the current build until the implementation branch begins. A build is never accepted while the visible/runtime metadata still names its predecessor.

#### 8. Validation is not deployment

Always distinguish:

```text
CI / dry-run / validation
from
actual production deployment
```

A green validation workflow is not evidence that a Worker was deployed. For backend-contract changes, identify the actual deployment topology and confirm the production deployment run/version explicitly. Respect backend-first rollout when Studio depends on a new backend capability.

#### 9. Closeout checklist is fixed and short

Before declaring a build closed:

```text
candidate diff bounded and reviewed
CI green
merge SHA known
required backend deploy confirmed
Studio deploy confirmed
real-user smoke performed when required
smoke data cleaned up
release metadata matches build number
local checkout compared/synchronized with GitHub main
no unexplained local changes remain
```

Do not add extra audits after these conditions are satisfied unless new evidence shows a concrete problem.

## Next

### Build110 — Studio simplification + premium interaction polish — PLANNED / NOT STARTED

Build110 is now the preferred next Studio candidate. Its purpose is deliberately **human-visible**: make Studio calmer, faster to understand, more coherent, and more pleasant to use without changing canonical ownership or backend contracts.

Runtime remains **v0.19.31 · Build109** until the Build110 implementation branch actually begins. At implementation start, release metadata must advance immediately to **v0.19.32 · Build110** before feature work proceeds.

#### Product objective

Studio must stop behaving like a diagnostic cockpit presented directly to a human operator. The default UI should show **only what is useful for the current human task**.

Target experience:

```text
open Studio
→ immediately understand where I am
→ see the next useful action
→ perform it without hunting through duplicate controls or technical noise
→ get clear visual feedback
→ move naturally to the next step
```

#### Scope A — information architecture / decluttering

Perform a bounded Studio-only UI inventory and remove or demote ambient clutter:

- remove duplicated facts, duplicated actions and repeated status copy;
- collapse multiple entry points that perform the same human action unless there is a proven workflow reason to keep both;
- remove explanatory text that merely restates labels or obvious UI behavior;
- remove or hide internal implementation vocabulary from default surfaces;
- move raw IDs, UUIDs, revisions, ETags, transport details, provider/debug state and similar machine-oriented evidence out of normal human workflow surfaces;
- keep technical diagnostics available only where genuinely useful, preferably under `Advanced`, an explicit disclosure, or a dedicated diagnostics surface;
- eliminate empty/dead cards, placeholder sections, decorative status boxes and panels that consume space without enabling an action;
- avoid showing the same Track/Album state simultaneously in sidebar, header, card and body unless each occurrence has a distinct human purpose;
- shorten verbose banners/messages to the minimum human-meaningful state + action;
- preserve one clear source of truth in the UI for each important fact and each primary action.

The default screen should be **quiet by design**. Information earns visible space only if it helps the human decide or act.

#### Scope B — workflow coherence

Preserve the accepted authority chain:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

But present it as a fluid human workflow rather than a collection of historical modules:

- navigation labels and page hierarchy must use consistent language;
- Track workspace should make the current task and next logical task obvious;
- primary actions should be visually dominant; secondary maintenance/diagnostic actions should not compete with them;
- progressive disclosure should replace permanently visible specialist controls where possible;
- avoid forcing the user to understand which historical phase/build/module produced a control;
- deep links and specialist capabilities may remain for compatibility, but they must not clutter the normal daily path.

#### Scope C — premium interaction feel

Apply a coherent interaction language across Studio:

- tactile but restrained button press/release feedback;
- coherent hover, active, selected, disabled and focus states;
- short smooth transitions for tabs, panels and selection changes;
- restrained glow/highlight only where it communicates focus or successful interaction;
- clear loading → success/error feedback without layout jumping;
- reduced-motion-safe behavior;
- no gratuitous animation, long easing, pulsing decoration or effects that slow repetitive work.

The target is **premium and responsive**, not flashy.

#### Scope D — explicit non-scope / safety boundary

Build110 should be presentation-first:

- no Track Manager backend redesign;
- no Worker/R2 schema change;
- no new generic write service;
- no change to Album/Track/Lyrics/SonicTrace canonical authority;
- no retry/idempotency expansion;
- no Phase10 extraction bundled into the UX cleanup;
- no multi-repo architecture audit unless a concrete UI dependency proves it necessary;
- no removal of a functional capability merely because it is hidden from the default view — specialist capability must remain reachable where required.

#### Build110 acceptance bar

Build110 is not accepted merely because CSS looks nicer. Real-user smoke must demonstrate that normal daily tasks are **simpler**.

Acceptance should verify at minimum:

```text
fewer competing visible actions / duplicate facts
no loss of required Track workflow capability
clear primary action on key daily screens
technical diagnostics absent from default path unless actionable
navigation + terminology coherent
buttons/tabs/panels visibly responsive and consistent
no obvious layout regressions at desktop ultrawide and normal widths
prefers-reduced-motion remains usable
canonical writes/read authorities unchanged
```

A short before/after UI inventory should document what was removed, merged, demoted to Advanced, or retained and why.

## Backlog

### Reliability candidates requiring stronger backend contracts

- Album create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- Deep Audio request status/idempotency if the coordinator later gains an operation identity contract;
- degraded/offline behavior that materially affects the private Studio workflow.

Track-create operation identity is no longer backlog: Build109 accepted that exact path.
Catalog rebuild operation identity/generation evidence is no longer backlog: Build108 accepted that exact path.

### Premium interaction polish

Promoted into the planned Build110 scope. Additional polish after Build110 should remain rolling and non-blocking rather than becoming another open-ended program.

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
- Every allocated implementation build must increment the canonical Studio build/version metadata and pass `check:release` before acceptance.
- Every substantial Codex/Astra task must pass the quota + local-vs-GitHub preflight above before execution.
- Never audit a stale or unexplained local checkout as if it were canonical.
- Never declare closeout from CI alone when a production deployment is required.
- Build110 must reduce human-visible complexity; adding another always-visible status, diagnostic panel or duplicate action requires explicit justification.
- Machine-oriented evidence belongs outside the default human workflow unless it directly changes the user's next decision.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth, `QA.md` for accepted validation boundaries, and [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md) for the latest accepted Studio runtime receipt.
