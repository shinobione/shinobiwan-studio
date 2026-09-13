# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-09-13 after **Build111 REAL USER PASS**.

This file tracks durable Done / Active / Next / Backlog state. Historical detail belongs in changelogs, milestone docs and acceptance receipts.

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

Accepted / REAL USER PASS.

- one browser UUID per explicit rebuild;
- canonical `generationId` proof;
- no blind write retry after response loss.

### Build109 — Track-create operation identity

Accepted / REAL USER PASS.

- one browser UUID per explicit Track create;
- private immutable `creationOperationId` proof;
- no blind second create POST;
- legacy callers remain compatible.

### Build110 — human-first Studio simplification + premium feel

Accepted by real-user visual smoke.

Delivered:

- Home / Tracks / Albums as the clear daily navigation;
- specialist/maintenance tooling demoted from the normal path;
- duplicated facts/actions and technical noise reduced;
- more coherent hover / press / focus / selected / loading feedback;
- restrained premium interaction feel;
- canonical Track / Album / Lyrics / SonicTrace authority unchanged.

Build110 established a permanent product rule:

> Human-visible complexity must decrease unless new visible information directly helps a decision or action.

Machine-oriented IDs, revisions, ETags, transport/debug states and historical phase vocabulary belong outside the normal path unless actionable.

### Build111 — Release → Flow handoff simplification

Accepted / REAL USER PASS.

Release is no longer a second campaign manager. It now acts as a compact creative handoff:

```text
MASTER 16:9 prompt
→ 1:1 anchored adaptation prompt
→ 9:16 anchored adaptation prompt
→ optional Canvas / 8s loop prompt
→ Google Flow
```

Permanent SHINOBIWAN branding requirement in every visual prompt:

- attach the official logo reference in Flow;
- preserve logo identity exactly;
- integrate it coherently with the composition/materials/light;
- keep it visually secondary to the track title;
- logo must always be smaller than the title.

Removed from Studio Release:

- redundant Studio-side logo upload;
- returned 16:9 / 1:1 / 9:16 image uploads;
- Campaign Review / ratio review;
- ZIP export / JSZip;
- duplicate SoundCloud/social/tag generator;
- browser-local campaign image packaging.

Evidence:

```text
Studio PR              #222
Candidate head         2345dd52c31e28f12a8c0d6437563c9291c3c141
Validation CI          #710 · SUCCESS
Merge                  06e238ffd9e37f834bb1693ced37a247c07dbab8
Pages deploy           #238 · 34770445239 · SUCCESS
Real-user smoke        PASS
Backend / Worker / R2  unchanged
```

Acceptance receipt: [`docs/acceptance/BUILD111-REAL-USER-PASS.md`](docs/acceptance/BUILD111-REAL-USER-PASS.md).

## Active

### Phase 10 — progressive extraction

Phase10 remains active as a program, not as permission for continuous refactoring.

**Phase10 Slice2 remains unallocated.** Build108/109 are reliability slices outside it; Build110/111 are human-facing Studio simplification work outside it.

### Release discipline

- `src/release.ts` and `package.json` are canonical runtime identity.
- every allocated implementation build increments version/build at implementation start;
- matching `check:buildNNN` is wired immediately;
- `check:release` must pass before closeout.

### Operational execution guardrails — MANDATORY

These rules capture the recent failure modes and are not optional housekeeping.

#### 1. Assistant orchestrates; Codex/Astra run bounded missions only

- no open-ended `inspect all repos` by default;
- no subagent fan-out unless genuinely required;
- one objective, bounded repo set, explicit stop condition;
- mechanical GitHub/CI/PR/deploy work is handled directly when possible.

#### 2. Codex / Work / Astra quota is scarce

Before substantial agent work:

- check remaining quota + reset time;
- do not burn a reset rebuilding context already known or present in GitHub;
- do not spend large quota on discovery answerable by diff/log inspection;
- if Codex is quota-blocked, treat it as idle, not as background work.

Default rule: **value per quota**, not maximum model strength.

#### 3. Local ↔ GitHub preflight before audit or implementation

GitHub accepted `main` is canonical. For every participating local repo, verify:

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

Interpretation:

```text
HEAD == origin/main              → clean canonical base
local ahead                      → inspect exact intentional delta
local behind                     → update/rebase first
working tree dirty               → classify every change first
unexpected remote/path/branch    → STOP
```

For cross-repo work, do this for every repo.

#### 4. Diff first, model second

Before model quota is spent, establish the exact accepted base, candidate head and changed-file allowlist.

If local and GitHub disagree, resolve that first.

#### 5. No EOL / formatting explosions

- never normalize a repo unless explicitly required;
- large unexpected `M` sets are suspicious;
- separate semantic changes from line-ending/format churn;
- remove EOL-only churn before commit.

#### 6. CI failures are fixed by family, not one stale guard at a time

When CI fails:

1. read the failure log;
2. identify the complete family of the same stale assumption;
3. patch that family together;
4. run one new CI cycle.

No guard-by-guard hamster wheel.

#### 7. Validation is not deployment

A green CI/dry-run is not production evidence. Confirm the real deployment workflow/run/version separately.

#### 8. Closeout checklist is fixed and short

```text
bounded diff reviewed
CI green
merge SHA known
required backend deploy confirmed
Studio deploy confirmed
real-user smoke performed when required
smoke data cleaned if applicable
release metadata correct
canonical docs/current state updated
local checkout compared/synchronized with GitHub main before next local work
```

Do not launch extra audits after this without new concrete evidence.

## Next

### PACK COMPLET JSON → Studio import — tracked in #221

This is the preferred next **product** improvement, but **Build112 is not allocated yet**.

Problem to solve:

The MUSIC ChatGPT project already produces the useful final release information. Scrolling through a long MUSIC conversation to recover SoundCloud copy, tags, highlights, cover prompts, Canvas instructions, etc. is wasteful. Studio should not regenerate weaker competing versions.

Target flow:

```text
ChatGPT project MUSIC
→ generates normal PACK COMPLET
→ also outputs one versioned SHINOBIWAN track-pack JSON
→ Studio imports JSON
→ Studio becomes the retrieval/dashboard surface for the approved pack
```

Schema candidates:

- schema version;
- track identity/title/version;
- creative positioning / summary;
- SoundCloud copy + tags + highlight time window;
- social copy;
- cover prompt MASTER 16:9;
- cover adaptation prompts 1:1 and 9:16;
- Canvas / loop prompt;
- any other final PACK COMPLET fields that are genuinely reused.

Rules before implementation:

- define the MUSIC-side JSON schema first;
- schema must be versioned and import-safe;
- Studio imports/presents approved content rather than silently regenerating it;
- missing optional fields must degrade cleanly;
- no backend/R2 write authority is implied merely by importing a pack;
- no Build112 allocation until the schema + exact UI destination are bounded.

## Backlog

### Reliability candidates requiring stronger backend evidence

- Album create lost-response operation identity;
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
- no deliberate production damage to manufacture ambiguity/retry tests;
- no GET/validation retry generalized into write retry;
- no Build108/109 operation identity generalized into unrelated writes without fresh contract work;
- no causal proof when backend evidence does not support it;
- Build101 and Build104 remain rejected historical evidence;
- Build107 remains accepted Phase10 Slice1;
- Build108/109 remain accepted reliability work outside Phase10 Slice2;
- Build110/111 remain accepted human-facing simplification work outside Phase10 Slice2;
- every substantial Codex/Astra task must pass quota + local/GitHub preflight;
- every future UI addition must justify its visible space to the human operator;
- prefer removing redundant information/actions over adding another panel/status/card.

## Current acceptance pointer

See `PROJECT_STATE.md` for current runtime/cross-stack truth and [`docs/acceptance/BUILD111-REAL-USER-PASS.md`](docs/acceptance/BUILD111-REAL-USER-PASS.md) for the latest accepted Studio receipt.
