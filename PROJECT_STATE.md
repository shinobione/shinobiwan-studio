# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-17 after **Build102 REAL USER PASS**.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted runtime

```text
Studio version          v0.19.24
Studio build            Build102
Codename                studio-focus-slice4-phase9-track-asset-etag-representation-corrective
Acceptance              REAL USER PASS
Runtime PR              #193
Exact tested head       cfebb5cfe5b87627a29890a7477bd5628ef60759
Final runtime CI        #524 · 31979380563 · SUCCESS
Runtime merge SHA       64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages           #200 · 31979525479 · SUCCESS build + deploy
Candidate docs PR       #194
Candidate docs CI       #525 · 31979629544 · SUCCESS
Candidate docs merge    68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages    #201 · 31979667787 · SUCCESS
Real-user smoke         ASSET SAVED · Canonical reread Verified · Catalog rebuilt Yes
Canonical revision      2026-08-16T23:42:38.231Z
Safety pre-build        safety/pre-build102-etag-normalization-corrective-20260817-0120
Safety green premerge   safety/post-build102-green-premerge-20260817-0134
Safety post-deploy      safety/post-build102-deployed-candidate-20260817-0136
Safety post-acceptance  safety/post-build102-real-user-pass-20260817-0142
Worker deploy           NONE
Track Manager change    NONE
Public Worker change    NONE
R2 schema migration     NONE
```

**Build102 is the current accepted Studio runtime.** Build100 is the previous accepted feature runtime. Build101 is a historical **rejected candidate**: its cover write committed and remained present after refresh, but its normal-success verifier reported a false negative because Track Manager returned R2 `httpEtag` with HTTP quotes while the private reread exposed raw `etag` without those quotes.

Build102 changes only that representation comparison: trim whitespace, remove one symmetric outer pair of double quotes when present, then compare the remaining ETag exactly. Exact revision, filename, private presence, size, content type and duration checks remain unchanged. Automatic Track asset upload retries remain zero.

Detailed acceptance receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

## Current ecosystem baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
TM admin Worker         53abb651-4f3c-46a7-a37a-055f35d340b9
TM deployment run       31919397012 · SUCCESS · admin only
Public Worker           v2.7 · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

No Build102 backend deployment occurred. The only production media mutation used for acceptance was the intentional single real-user cover upload.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1–19       COMPLETE · Build82→Build100 REAL USER PASS
Phase 9 Slice20         COMPLETE · Build102 REAL USER PASS
Build101                REJECTED candidate · ETag representation false negative
Build103                UNALLOCATED · fresh read-only audit required
Phase 10                FUTURE · progressive extraction
Official Phase 11       NONE
```

### Phase9 Slice20 lineage

```text
Build101 · v0.19.23
  Track asset normal-success fingerprint verification
  → real-user write COMMITTED
  → false-negative `asset ETag` mismatch
  → NOT ACCEPTED

Build102 · v0.19.24
  bounded ETag representation corrective
  → full CI green
  → Pages deployed
  → real-user ASSET SAVED
  → canonical reread Verified
  → catalog rebuilt Yes
  → REAL USER PASS
```

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener UX.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` remains the same R2 slug across the toolchain.
- public fallback remains read-only and never verifies canonical writes.

## Current accepted reliability contracts

### Private reads

Build88–91 keep bounded GET retry semantics:

```text
timeout / transport / 408/425/429/500/502/503/504 → retry once max
401/403 / deterministic 4xx / Access gating / invalid JSON → NO RETRY
```

No GET retry rule authorizes write retry.

### Writes

Phase9 accepted write hardening keeps the operation-specific rule:

```text
write response unavailable
→ NEVER blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

Each operation keeps its own exact postcondition. Build102 does not generalize or weaken any write contract.

### Track asset normal success

```text
upload success response
→ exact response revision
→ exact manifest filename
→ private canonical asset present
→ server size/contentType/duration when supplied
→ ETag normalized only for one outer HTTP quote pair
→ exact normalized ETag value
→ Verified only if every required fact matches
```

## Immediate next action

**Fresh read-only post-Build102 Phase9 audit.** Do not allocate Build103 before the audit proves the smallest coherent next gap.

Candidates to re-evaluate include, without pre-selecting one:

- Album create lost-response causality / operation identity;
- exact-byte or digest proof for binary uploads where the backend contract can support it;
- remaining Track create/upload causality gaps;
- Deep Audio duplicate-compute risk and non-mutating/expensive retry boundaries;
- degraded/offline/PWA behavior;
- publication projection where a public Track may coexist with a canonical parent Album still marked Draft.

Only one independently reversible slice should be selected after the current code/contracts are reread.

## Backlog kept intact

- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions, reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator;
- no official Phase11.

## Release mechanics

The repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
