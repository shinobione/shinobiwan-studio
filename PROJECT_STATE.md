# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-09-13 after **Build108 REAL USER PASS** and acceptance closeout.

This is the short current checkpoint to read immediately after `AGENTS.md`. Historical implementation detail remains in `changelogs/` and milestone docs.

## Current accepted Studio runtime

```text
Studio version          v0.19.30
Studio build            Build108
Codename                studio-focus-slice4-catalog-rebuild-generation-identity
Acceptance              REAL USER PASS
Studio PR               #216
Exact implementation    b27a2891d2041d79aad4ab2910a150516af74ad4
Studio CI               #639 · 34752807960 · SUCCESS
Studio merge            e380a6ab098bddad8b744812515df36fe3ef5906
Studio Pages            #227 · 34753099885 · SUCCESS build + deploy
Backend PR              LaunchPAD-APP #275
Backend merge           31675ba4444282691c6e4d55d098f187ab3c4bad
Admin deploy            34753041082 · SUCCESS · admin only
Admin Worker version    ff037b48-b717-49a4-82ad-395aa06b6f6f
Public Worker deploy    NONE / skipped
R2 schema migration     NONE
Catalog projection      rebuilt explicitly for smoke
Real-user smoke         PASS · 45 tracks · exact generation UUID · canonical reread verified
generation              c4072021-707b-4d03-be8e-d21324a348b4
generatedAt             2026-09-13T10:57:36.269Z
```

**Build108 is the current accepted Studio runtime identity.**

Build108 is a bounded reliability/backend-contract slice for explicit catalog rebuild only. Studio generates one browser UUID per explicit rebuild. Track Manager persists that identity as the canonical `catalog/index.json` `generationId`, verifies it server-side, and exposes the current canonical projection identity through the private read model. Studio accepts success only after an exact private canonical reread match.

Lost-response policy remains:

```text
response unavailable
→ no blind automatic write retry
→ private canonical catalog reread
→ exact generationId match = committed / recovered
→ mismatch / missing proof = ambiguous or unverified
```

Detailed acceptance receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

Detailed changelog: [`changelogs/CHANGELOG-BUILD108.md`](changelogs/CHANGELOG-BUILD108.md).

## Accepted predecessor / historical lineage

Build107 remains the accepted predecessor and the first accepted Phase10 progressive-extraction slice. Its SonicTrace-owned catalog projection kernel remains unchanged and singular.

Build106 remains accepted Phase9 predecessor truth for bounded public catalog fallback retry.

Build105 remains accepted predecessor truth for the Deep Audio pre-submit/post-upload response-loss boundary. `POST /api/studio/analyze` remains one-shot per explicit user action with zero automatic retries.

Build104 remains **REJECTED** historical evidence because it falsely classified pre-submit/node-offline Deep Audio transport as compute UNKNOWN. Build105 corrected that boundary.

Build101 remains **REJECTED** historical evidence because quoted R2 `httpEtag` versus raw canonical `etag` caused a Track-asset verification false negative. Build102 corrected only that representation comparison.

Build108 does not alter any of those verdicts.

## Current ecosystem baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
TM admin Worker         ff037b48-b717-49a4-82ad-395aa06b6f6f
Public Worker           v2.8 · REAL USER PASS · unchanged by Build108
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build108 changed only the protected admin Worker and Studio catalog-rebuild consumer. It introduced no Public Worker change, no schema migration and no Track/Album/media mutation path.

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
Phase 10 Slice2         UNALLOCATED · fresh audit found no justified extraction
Phase 10                ACTIVE · progressive extraction by bounded audited slices
Build108                COMPLETE · reliability/backend-contract slice · REAL USER PASS
Official Phase 11       NONE
```

Build108 is deliberately **outside Phase10 Slice2**. The fresh cross-repository audit did not justify another extraction slice; Build108 instead closed one separately proven backend evidence gap.

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
- Build108 does **not** authorize generic operation-ID infrastructure or retry for Track create, Album create, assets, Lyrics, SonicTrace or Deep Audio.
- no Studio-only code may claim write causality that current backend evidence cannot prove.

## Human acceptance evidence

The Build108 smoke was performed against the deployed Studio candidate after the protected admin Worker deployment.

Visible evidence:

```text
CATALOG REBUILT
45 tracks
generated               2026-09-13T10:57:36.269Z
generation              c4072021-707b-4d03-be8e-d21324a348b4
canonical reread        verified
```

Result: **PASS**.

The smoke intentionally rebuilt only the canonical catalog projection from current manifests. No Track manifest, Album manifest, media object, Lyrics file or SonicTrace sidecar was modified.

## Immediate next action

**Fresh bounded Track-create operation-identity audit before any Build109 implementation.**

Track Create remains the clearest next reliability candidate because its current lost-response policy still lacks durable operation identity. Do not allocate Build109 until a read-only backend + Studio audit proves a singular durable identity, safe canonical reread semantics, no duplicate-create risk, explicit rollback/compatibility boundaries and exact CI + real-user acceptance gates.

## Backlog kept intact

- Track create lost-response causality / durable operation identity;
- Album create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- future Deep Audio operation status/idempotency only if the coordinator gains a safe contract;
- degraded/offline workflow work when a bounded slice is proven;
- premium interaction polish without blurring a future slice boundary;
- further Phase10 progressive extraction only after fresh scope proof;
- no official Phase11.

Catalog rebuild operation identity/generation evidence is **removed from backlog** because Build108 accepted it for the explicit Studio rebuild path.

## Release mechanics

The Studio repository still has no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
