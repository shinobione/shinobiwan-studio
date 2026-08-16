# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, read in order:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify real GitHub state before mutation.

## Current accepted state

```text
Studio                v0.19.24 · Build102 · REAL USER PASS
Codename              studio-focus-slice4-phase9-track-asset-etag-representation-corrective
Runtime PR            #193
Exact tested head     cfebb5cfe5b87627a29890a7477bd5628ef60759
Validation            #524 · 31979380563 · SUCCESS
Runtime merge         64ac5ed4d53daeafc4fa5b7a25ec66594eef274d
Runtime Pages         #200 · 31979525479 · SUCCESS build + deploy
Candidate docs PR     #194
Candidate docs CI     #525 · 31979629544 · SUCCESS
Candidate docs merge  68b39ce99e29745c14e004ae8e6fd1218f66b18c
Candidate docs Pages  #201 · 31979667787 · SUCCESS
Real-user smoke       ASSET SAVED · Canonical reread Verified · Catalog rebuilt Yes
Canonical revision    2026-08-16T23:42:38.231Z
Safety human-pass     safety/post-build102-real-user-pass-20260817-0142
Build101              REJECTED candidate · real-user ETag representation false negative
Build100              v0.19.22 · REAL USER PASS
Track Manager         v5.24 · REAL USER VERIFIED
Studio bridge         v1.14
TM deploy run         31919397012 · SUCCESS · admin only
TM admin Worker       53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.24 · Build102 is the current accepted runtime.**

Build101 introduced stronger normal-success verification for Track asset uploads but failed real-user acceptance because identical R2 ETags were compared in two syntax representations: quoted HTTP `httpEtag` from the upload response versus raw `object.etag` from the private canonical reread. The write itself committed and the cover remained present after refresh without re-upload.

Build102 corrects only that representation mismatch: one symmetric outer pair of HTTP double quotes may be removed before exact ETag comparison. Exact canonical revision, filename, presence, size, content type and duration checks remain intact, and automatic upload retries remain zero.

Detailed acceptance receipt: [`docs/acceptance/BUILD102-REAL-USER-PASS.md`](docs/acceptance/BUILD102-REAL-USER-PASS.md).

The repository still publishes **no formal GitHub Release objects and no Git tags**. Runtime release identity is carried by code, docs and Pages.

## Product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace summary.
- **Visuals** — cover, thumbnail and Canvas. Cover is required; Canvas is optional.
- **Lyrics** — canonical `lyrics.txt`, embedded LRC Maker and text editing.
- **Release** — final production check + browser-local Release Campaign.
- **Sonic / Details / Advanced** — full SonicTrace analysis and deliberately requested technical depth.

Production and publication remain separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Draft
```

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same workflow authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1–19   Build82→Build100 · REAL USER PASS
Phase 9 Slice20     Build102 · REAL USER PASS
Build101            REJECTED candidate · false-negative ETag representation
Build103            UNALLOCATED · fresh read-only post-Build102 audit required
Phase 10            FUTURE · progressive extraction
Official Phase 11   NONE
```

The immediate next action is a **fresh read-only post-Build102 Phase9 audit**. Build103 remains unallocated until the current implementation proves one smallest coherent next gap.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener UX.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- public fallback is read-only and never verifies canonical writes.

## Reliability rules

Private GET retry is bounded to the accepted transient classes and at most one retry. It never authorizes write retry.

For accepted Phase9 writes:

```text
response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

Each write family keeps operation-specific postconditions.

For Build102 Track asset normal success:

```text
upload success
→ exact response revision
→ exact manifest filename
→ private canonical presence
→ server fingerprint fields when supplied
→ normalize only one outer HTTP quote pair on ETag
→ exact normalized ETag comparison
→ Verified only when every required fact matches
```

## Roadmap continuity

Preserved backlog includes:

- premium interaction polish: tactile press/release, restrained glow/focus, coherent hover/active states, smooth panel/tab transitions and reduced-motion-safe motion;
- Phase10 progressive extraction of mature LRC / SonicTrace / catalog engines while Studio remains orchestrator;
- no official Phase11.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.
