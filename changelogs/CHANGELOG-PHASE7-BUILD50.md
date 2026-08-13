# SHINOBIWAN Studio v0.17.0 · Build 50

Codename: `phase7-b-contextual-continuation-receipts`

Status: **DEPLOYED-CANDIDATE TARGET / REAL-USER SMOKE REQUIRED**. CI may validate the implementation, but this changelog does not claim REAL USER PASS.

## Why

Phase 7-A proved the read-only production workflow. Builds 48/49 then moved the useful Release Campaign workflow natively into Studio while preserving its browser-local/no-canonical-write boundary.

Phase 7-B adds the missing return path from specialist operations without creating a second authority: a specialist may report completion, but Studio must independently verify canonical state before presenting a canonical write as `VERIFIED`.

## Receipt contract

Typed sources:

- `lrc-maker`
- `sonictrace`
- `release-campaign`

Allowlisted operations/effects:

```text
lrc-maker       + lyrics-saved      → canonical-write
sonictrace      + analysis-saved    → canonical-write
release-campaign+ campaign-exported → review-only
```

Any unsupported source/operation/effect combination is rejected.

## Canonical-write verification

For Lyrics and SonicTrace completion receipts:

1. receipt must contain the exact canonical `trackId` currently open in the Track Workspace;
2. mismatched track receipts are ignored;
3. Studio enters `verifying` state;
4. Studio rereads the Track through the existing catalog read layer;
5. the reread must return the same `trackId`;
6. the reread must be `private` — public LaunchPAD fallback can never verify a canonical write;
7. operation-specific evidence must exist (`lyrics.txt` for Lyrics; persisted Audio Intelligence for SonicTrace);
8. only then does Studio display `Canonical reread verified` and replace local Track state with the reread result.

A verification epoch prevents a slow/stale async reread from overwriting a newer receipt or a different Track Workspace context.

## Release Campaign boundary

Native Release Campaign export emits a contextual receipt only as:

`release-campaign / campaign-exported / review-only`

It remains intentionally non-canonical:

- ZIP manifest keeps `canonicalWrite: false`;
- no R2 write;
- no Track Manager mutation;
- no FINAL artwork is silently converted into canonical cover/media;
- no generic write endpoint;
- no new campaign persistence authority.

The Build 48/49 MASTER → anchored 1:1 / anchored 9:16 workflow, browser-local draft, non-destructive concept reroll and direct Google Flow shortcut remain intact.

## Lyrics boundary

The inherited Phase 6 contract is unchanged:

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

Embedded LRC Maker 6.3.8 emits a typed completion receipt after its existing guarded save path. Standalone LRC Maker `postMessage` receipts are accepted only from the configured LRC Maker origin and are still canonically reread before verification.

## SonicTrace boundary

SonicTrace save completion now emits a typed receipt rather than asking the parent Track Workspace to trust optimistic child state. Persisted Audio Intelligence remains owned by the existing Track Manager/SonicTrace sidecar contract.

## UI

Track Workspace gains a contextual receipt banner with explicit states:

- `verifying`
- `verified`
- `review-only`
- `verification-error`

Reduced-motion preferences are respected.

## Historical guard modernization

Build 50 intentionally modernizes old tests that encoded obsolete release/STOP assumptions such as:

- Phase 7 successors must stay on `0.16.x`;
- any `phase7` marker is forbidden inside the previously frozen PHASE UX Workspace.

Only those historical assumptions were widened. Functional guards remain active for:

- private canonical read boundaries;
- Phase 5/C3 intelligence semantics;
- Phase 6 Lyrics contract;
- Album write/migration protections;
- Workflow 7-A read-only behavior;
- Build 45/47 no-write Release Pack history;
- Build 48 native Release Campaign boundaries;
- Build 49 non-destructive concept reroll / Flow handoff;
- full TypeScript and production Vite build.

## Safety

- GitHub/main was rechecked before reserving Build 50.
- Work started from `ef9eaa3e73fa704e8777a904d923e78648bb3001` (Build 49 main).
- Pre-change checkpoint: `safety/pre-phase7-b-build50-20260812-1826`.
- Old PR #60/#62 receipt attempts were not reopened or merged; compatible design ideas only were rebuilt on current main.
- No Worker deployment is required by Build 50.
- Public Worker is unchanged.
- No production R2 mutation is performed by implementation/CI.
- Phase 7-C is not started.

## Acceptance boundary

Build 50 may be merged/published as a candidate after exact-head CI is green and Pages succeeds.

**REAL USER PASS remains pending** until a browser smoke validates at minimum:

- a review-only Release Campaign completion receipt never claims canonical verification;
- a real existing specialist canonical write completion enters verifying state and becomes VERIFIED only after private reread;
- receipt UI remains scoped to the correct Track Workspace;
- no regression to Workflow 7-A or native Release Campaign.
