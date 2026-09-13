# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-13 after **Build109 REAL USER PASS** and release-metadata closeout.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.31
Studio build            Build109
Codename                studio-focus-slice4-track-create-operation-identity
Acceptance              REAL USER PASS
Studio PR               #218
Exact candidate         5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI               #660 · 34762678307 · SUCCESS
Studio merge            4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages            #229 · 34762759192 · SUCCESS build + deploy
Backend PR              LaunchPAD-APP #276
Backend candidate       3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge           5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy            #44 · 34762956165 · SUCCESS · admin only
Public Worker deploy    NONE / unchanged
R2 schema migration     NONE
Real-user smoke         PASS · disposable Track create + private canonical reread
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
Smoke cleanup           build109-smoke-20260913 deleted after verification
```

**Build109 is the current accepted Studio runtime identity.**

Build109 is a bounded reliability/backend-contract slice for explicit Track creation. Studio generates one browser UUID per explicit create and Track Manager persists it privately as immutable canonical `creationOperationId` evidence. The create POST remains one-shot. On a lost response, Studio performs only a private canonical reread and recovers success only when the exact operation UUID matches.

Lost-response policy:

```text
explicit create
→ one browser UUID operationId
→ one POST
→ response unavailable
→ no blind automatic second POST
→ private canonical Track reread
→ exact creationOperationId match = committed / recovered
→ mismatch / missing / unreadable proof = ambiguous or unverified
```

Detailed acceptance receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

Detailed changelog: [`changelogs/CHANGELOG-BUILD109.md`](changelogs/CHANGELOG-BUILD109.md).

## Accepted predecessor / historical lineage

Build108 remains the accepted predecessor for explicit catalog-rebuild causal identity via canonical `generationId`.

Build107 remains the first accepted Phase10 progressive-extraction slice. Its SonicTrace-owned catalog projection kernel remains unchanged and singular.

Build106 remains accepted Phase9 predecessor truth for bounded public catalog fallback retry.

Build105 remains accepted predecessor truth for the Deep Audio pre-submit/post-upload response-loss boundary. `POST /api/studio/analyze` remains one-shot per explicit user action with zero automatic retries.

Build104 remains **REJECTED** historical evidence because it falsely classified pre-submit/node-offline Deep Audio transport as compute UNKNOWN. Build105 corrected that boundary.

Build101 remains **REJECTED** historical evidence because quoted R2 `httpEtag` versus raw canonical `etag` caused a Track-asset verification false negative. Build102 corrected only that representation comparison.

Build109 does not alter any of those verdicts.

## Current ecosystem baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
Admin Worker            Build109 admin deploy #44 · 34762956165 · SUCCESS
Public Worker           v2.8 · REAL USER PASS · unchanged by Build109
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build109 changed only the protected admin Worker Track-create contract and the Studio Track-create consumer. It introduced no Public Worker change and no R2 schema migration.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 COMPLETE · program closeout on accepted Build106
Build101                REJECTED candidate · ETag representation false negative
Build104                REJECTED candidate · false Deep Audio UNKNOWN classification
Phase 10 Slice1         COMPLETE · Build107 REAL USER PASS
Phase 10 Slice2         UNALLOCATED · no justified extraction allocated
Phase 10                ACTIVE · progressive extraction by bounded audited slices
Build108                COMPLETE · catalog rebuild identity · REAL USER PASS
Build109                COMPLETE · Track-create operation identity · REAL USER PASS
Official Phase 11       NONE
```

Build108 and Build109 are separately bounded reliability/backend-contract work and do not retroactively become Phase10 Slice2.

## Frozen authority and reliability rules

- GitHub = application-code authority; R2 = canonical catalog/media/data authority.
- Track Manager = protected Track/Album write authority; Studio = private orchestrator, never a generic R2 writer.
- Album `trackIds` remains the sole canonical Album-membership authority.
- public fallback is read-only and never verifies writes.
- private GET/transient retry is bounded and never authorizes write retry.
- accepted writes use operation-specific canonical postconditions; no generic blind write retry exists.
- Build103 retries only the pre-compute canonical-audio GET.
- Build105 never automatically retries Deep Audio compute; it fences only after browser-observed upload start.
- Build106 retries only a transient public GET fallback after final private-read failure.
- Build107 changes no persistence/write authority and keeps SonicTrace as singular editable projection-kernel owner.
- Build108 proves only explicit catalog-rebuild causality using a browser UUID persisted as canonical `generationId`.
- Build109 proves only explicit Track-create causality using a browser UUID persisted privately as immutable `creationOperationId`.
- Build109 does **not** authorize generic idempotency infrastructure or automatic write retry for Album create, assets, Lyrics, SonicTrace or Deep Audio.
- no Studio-only code may claim write causality that current backend evidence cannot prove.

## Human acceptance evidence

The Build109 smoke was performed against the deployed Studio and deployed protected admin Worker.

Visible/canonical evidence:

```text
Track                   build109-smoke-20260913
status                  draft
Album                   Singles
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
private canonical read  verified
cleanup                 disposable Track deleted
```

Result: **PASS**.

Production was not intentionally interrupted to manufacture a response-loss condition. The deployed operation-identity path was proved non-destructively; deterministic automated tests cover timeout/transport/body-loss/mismatch/legacy/unreadable branches.

## Release identity rule

Runtime identity is canonical in `src/release.ts` and must match `package.json`. The build now runs `check:release`, which fails when the latest `check:buildNNN` gate does not match `studioRelease.build`, when package/release versions drift, or when the current 0.19 build/version sequence is not incremented.

The sidebar phase/version/build/summary are rendered from `studioRelease` rather than hard-coded historical copy.

## Immediate next action

**No Build110 is allocated.**

Any next build requires a fresh bounded scope/audit first. Do not consume Build110 merely for opportunistic refactoring or cleanup.

## Backlog kept intact

- Album create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- future Deep Audio operation status/idempotency only if the coordinator gains a safe contract;
- degraded/offline workflow work when a bounded slice is proven;
- premium interaction polish without blurring a future slice boundary;
- further Phase10 progressive extraction only after fresh scope proof;
- no official Phase11.

Track-create operation identity is **removed from backlog** because Build109 accepted that exact path.
Catalog-rebuild operation identity/generation evidence remains accepted from Build108.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
