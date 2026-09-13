# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-13 after **Build111 REAL USER PASS**.

This is the short current checkpoint. Historical implementation detail remains in `changelogs/`, milestone docs and acceptance receipts.

## Current accepted Studio runtime

```text
Studio version          v0.19.33
Studio build            Build111
Codename                studio-focus-build111-release-handoff
Acceptance              REAL USER PASS
Studio PR               #222
Candidate head          2345dd52c31e28f12a8c0d6437563c9291c3c141
Validation CI           #710 · SUCCESS
Merge                    06e238ffd9e37f834bb1693ced37a247c07dbab8
Studio Pages            #238 · 34770445239 · SUCCESS build + deploy
Backend change          NONE
Worker / R2 change      NONE
Real-user smoke         PASS · production UI smoke reported by user
```

**Build111 is the current accepted Studio runtime identity.**

Detailed acceptance receipt: [`docs/acceptance/BUILD111-REAL-USER-PASS.md`](docs/acceptance/BUILD111-REAL-USER-PASS.md).

## What Build110–111 changed for the human workflow

### Build110 — human-first Studio cleanup

Build110 reduced ambient UI complexity and established the current presentation direction:

- daily navigation centered on Home / Tracks / Albums;
- specialist / maintenance surfaces demoted out of the normal path;
- duplicated status, technical noise and historical phase vocabulary reduced;
- interaction states made more coherent and restrained;
- canonical Track / Album / Lyrics / SonicTrace authority remained unchanged.

### Build111 — Release handoff simplification

The Release surface is now a compact Flow-oriented handoff rather than a second campaign manager.

Accepted behavior:

```text
MASTER 16:9 prompt
→ 1:1 anchored adaptation prompt
→ 9:16 anchored adaptation prompt
→ optional Canvas / 8s loop prompt
→ Google Flow handoff
```

Permanent visual-branding rule:

- the official SHINOBIWAN logo is referenced in every visual prompt;
- the real logo asset is attached in Flow, not redundantly uploaded into Studio first;
- logo identity must be preserved exactly;
- logo placement/material/light integration must fit the composition;
- logo must always remain visually subordinate to, and smaller than, the track title.

Removed from the normal Release workflow:

- Studio-side logo upload;
- returned 16:9 / 1:1 / 9:16 image imports;
- ratio review / Campaign Review;
- ZIP export and JSZip;
- duplicate SoundCloud / social / tag generation;
- obsolete browser-local campaign-image storage.

Studio remains non-canonical for these generated release handoff artifacts.

## Current ecosystem baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
Public Worker           v2.8 · unchanged by Build110/111
LaunchPAD public        2026.08.12.102
SonicTrace              V2-E Build08
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE
Phase 8                 COMPLETE · Build81 closeout
Phase 9                 COMPLETE · accepted through Build106
Phase 10 Slice1         COMPLETE · Build107 REAL USER PASS
Phase 10 Slice2         UNALLOCATED
Build108                COMPLETE · catalog rebuild identity
Build109                COMPLETE · Track create operation identity
Build110                COMPLETE · human-first / premium UX cleanup
Build111                COMPLETE · Release → Flow handoff simplification · REAL USER PASS
Official Phase 11       NONE
```

Build108/109 remain bounded reliability work outside Phase10 Slice2. Build110/111 are human-facing Studio simplification work and do not consume Phase10 Slice2.

## Frozen authority / reliability rules

- GitHub = application-code authority; R2 = canonical catalog/media/data authority.
- Track Manager remains the protected Track/Album write authority.
- Album `trackIds` remains canonical Album-membership authority.
- no generic blind write retry.
- public fallback remains read-only and never verifies writes.
- Build108 `generationId` and Build109 `creationOperationId` remain operation-specific proof, not generic idempotency infrastructure.
- no Studio-only code may claim write causality the backend cannot prove.
- Build101 and Build104 remain rejected historical candidates.

## Operational guardrails — mandatory

These are permanent lessons from the recent Build107–111 cycle:

1. **Quota first.** Check Codex/Work/Astra quota and reset time before substantial agent work. Do not burn high-value quota on mechanical GitHub checks or broad exploratory audits.
2. **GitHub/local preflight first.** Before any local implementation or audit: `fetch`, branch, HEAD, `origin/main`, ahead/behind, working tree and exact diff. Never treat a stale or dirty local checkout as canonical.
3. **Diff first, model second.** Establish the real changed-file set before asking a stronger model for interpretation.
4. **No formatting/EOL explosions.** Unexpected mass modifications are suspicious until proven semantic.
5. **CI failures are fixed by family.** Read the failure log, identify the whole stale-guard family, patch it together, then run one new CI. No guard-by-guard hamster wheel.
6. **Build identity at start.** Increment release version/build and wire the matching build guard when implementation starts, not at closeout.
7. **CI is not deployment.** Confirm the actual production deploy separately.
8. **Closeout stays short.** Diff bounded → CI green → merge known → deploy green → real-user smoke → docs/current state updated. No extra audit without new evidence.
9. **Assistant orchestrates.** Codex/Astra are bounded execution tools, not default project managers.

## Immediate next action

**Build112 is not allocated.**

The preferred next product improvement is the separately tracked **PACK COMPLET JSON → Studio import** (`#221`), but implementation should begin only after the MUSIC-side export schema is deliberately defined.

Target flow:

```text
ChatGPT project MUSIC
→ generates the normal PACK COMPLET
→ also emits one SHINOBIWAN track-pack JSON
→ Studio imports it
→ Studio presents the already-approved release information in one place
```

Studio should consume approved MUSIC output rather than regenerate competing versions.

Expected JSON candidates include, where present:

- track identity / positioning;
- SoundCloud title/description/tags and highlight window;
- social copy;
- cover prompts 16:9 / 1:1 / 9:16;
- Canvas / loop prompt;
- other final PACK COMPLET fields worth retrieving without scrolling through chat history.

## Release mechanics

Runtime identity is canonical in `src/release.ts` and must match `package.json`. `check:release` must remain green. The repository still has no formal GitHub Release object/tag requirement; runtime truth is carried by code, docs and deployed Pages.
