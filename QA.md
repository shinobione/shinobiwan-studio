# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-09-13 after **Build108 REAL USER PASS** and acceptance closeout.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

```text
Version                 v0.19.30
Build                   Build108
Status                  REAL USER PASS
Codename                studio-focus-slice4-catalog-rebuild-generation-identity
Studio PR               #216
Exact implementation    b27a2891d2041d79aad4ab2910a150516af74ad4
Studio CI               #639 · 34752807960 · SUCCESS
Studio merge            e380a6ab098bddad8b744812515df36fe3ef5906
Studio Pages            #227 · 34753099885 · SUCCESS build + deploy
Backend PR              LaunchPAD-APP #275
Backend merge           31675ba4444282691c6e4d55d098f187ab3c4bad
Admin deploy            34753041082 · SUCCESS · admin only
Admin Worker version    ff037b48-b717-49a4-82ad-395aa06b6f6f
Real-user smoke         PASS · 45 tracks · exact generation UUID · canonical reread verified
```

Detailed receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

## Build108 automated coverage — GREEN

### Backend

LaunchPAD / Track Manager PR #275 added a bounded generation-identity decorator around explicit Studio catalog rebuilds.

Automated proof covered:

- malformed operation UUID rejection;
- `generationId` persistence in the canonical catalog projection;
- private read exposure of canonical projection identity;
- exact server-side identity verification before success response;
- compatibility for implicit catalog writers when no generation identity is supplied;
- zero automatic write retries;
- no Track/Album/media destructive mutation added by the slice;
- full Cloudflare Worker validation and Wrangler dry-run chain.

The backend merged at `31675ba4444282691c6e4d55d098f187ab3c4bad`. The protected admin-only deployment run `34753041082` completed successfully and deployed Worker version `ff037b48-b717-49a4-82ad-395aa06b6f6f`. The post-deploy Access verification passed; Public Worker deployment was skipped intentionally.

### Studio

Studio PR #216 validated exact operation-identity behavior on head `b27a2891d2041d79aad4ab2910a150516af74ad4` in `Validate SHINOBIWAN Studio` run `34752807960` (#639), result SUCCESS.

The guard locks:

- one browser UUID per explicit rebuild;
- existing `catalog-rebuild-v1` intent and explicit `REBUILD` confirmation;
- exact echoed operation/generation identity on normal success;
- private canonical reread proof;
- response-loss recovery only when exact `generationId` matches;
- mismatch/superseded/unavailable proof remaining non-retryable;
- `maxAutomaticWriteRetries: 0`;
- no widening of Track Create or other Phase4 write semantics.

The implementation merged at `e380a6ab098bddad8b744812515df36fe3ef5906`. Pages run `34753099885` (#227) completed build + deploy successfully.

## Build108 real-user smoke — PASS

The user performed the explicit catalog rebuild against the deployed backend and Studio candidate on 2026-09-13.

Visible result:

```text
CATALOG REBUILT
45 tracks
generated               2026-09-13T10:57:36.269Z
generation              c4072021-707b-4d03-be8e-d21324a348b4
canonical reread        verified
```

This is the exact causal proof Build108 was designed to create: the browser operation UUID was persisted into the canonical projection and then observed again through the private canonical reread.

Result: **PASS**.

The smoke mutated only `catalog/index.json` by rebuilding it from current canonical manifests. It did not modify Track or Album manifests, media, Lyrics or SonicTrace analysis objects.

## Build108 contract boundary

Accepted only for explicit Studio catalog rebuild:

```text
browser operationId UUID
        ↓
POST /api/studio/catalog/rebuild
        ↓
Track Manager canonical generationId
        ↓
private canonical reread
        ↓
exact UUID match = verified commit
```

Not generalized to:

```text
Track create
Album create
binary asset upload
metadata / Lyrics / SonicTrace writes
Deep Audio compute
```

No generic write-retry or generic idempotency service was introduced.

## Accepted regression baseline

```text
Build82–100  accepted Phase9 reliability/canonical-truth lineage  PASS
Build101     rejected Track-asset false-negative candidate         NOT ACCEPTED
Build102     ETag representation corrective                        PASS
Build103     canonical audio pre-compute transient retry           PASS
Build104     rejected Deep Audio false-UNKNOWN candidate            NOT ACCEPTED
Build105     Deep Audio pre-submit transport corrective             PASS
Build106     public catalog fallback transient GET retry            PASS
Build107     Phase10 shared catalog projection kernel               PASS
Build108     catalog rebuild generation identity                    PASS
```

Build108 does not reopen Phase9 or alter Build107's numerical extraction contract.

## Cross-stack accepted baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
Admin Worker            ff037b48-b717-49a4-82ad-395aa06b6f6f
Public Worker           v2.8 · REAL USER PASS · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Remaining unproven areas — backend-contract candidates

- Track create lost-response causality / durable operation identity;
- Album create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- Deep Audio request status/idempotency if the coordinator gains an operation identity contract;
- degraded/offline behavior only where a future audit proves material daily-workflow impact.

Catalog rebuild operation identity/generation evidence is no longer unproven for the explicit Studio rebuild path.

Studio must not fabricate causal certainty when a different backend operation does not expose authoritative evidence.

## Next QA gate

Before any Build109 implementation, perform a fresh bounded Track-create operation-identity audit. The audit must prove durable identity semantics, duplicate-create safety, canonical reread classification, compatibility/rollout order and a non-destructive real-user acceptance boundary.
