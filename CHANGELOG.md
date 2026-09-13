# SHINOBIWAN Studio — Changelog

This is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/).

## Current accepted release

### v0.19.30 · Build108 — 2026-09-13

Codename: `studio-focus-slice4-catalog-rebuild-generation-identity`  
Status: **REAL USER PASS — ACCEPTED**

Build108 closes one specific reliability gap: causal proof for the explicit Studio catalog rebuild.

Studio now generates one browser UUID per explicit rebuild. Track Manager persists it as the canonical catalog `generationId`, verifies it before success response, and exposes it through the private catalog read model. Studio then rereads canonical state and requires the exact UUID match before declaring the rebuild verified. Lost-response handling remains zero-blind-retry: exact canonical generation proof can recover success; missing/mismatched proof remains ambiguous or unverified.

```text
Backend PR               LaunchPAD-APP #275
Backend merge            31675ba4444282691c6e4d55d098f187ab3c4bad
Admin deploy             34753041082 · SUCCESS · admin only
Admin Worker version     ff037b48-b717-49a4-82ad-395aa06b6f6f
Studio PR                #216
Studio head              b27a2891d2041d79aad4ab2910a150516af74ad4
Studio CI                #639 · 34752807960 · SUCCESS
Studio merge             e380a6ab098bddad8b744812515df36fe3ef5906
Studio Pages             #227 · 34753099885 · SUCCESS build + deploy
Real-user smoke          CATALOG REBUILT · 45 tracks · canonical reread verified
generation               c4072021-707b-4d03-be8e-d21324a348b4
generatedAt              2026-09-13T10:57:36.269Z
Public Worker            unchanged
R2 schema migration      NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD108.md`](changelogs/CHANGELOG-BUILD108.md).  
Real-user receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

## Accepted predecessor

### v0.19.29 · Build107 — 2026-09-13

Codename: `studio-focus-slice4-phase10-shared-catalog-projection-kernel`  
Status: **REAL USER PASS — ACCEPTED**

Build107 is the first accepted Phase10 extraction slice. SonicTrace owns the singular editable numerical projection kernel and Studio consumes a generated digest-pinned copy. Build108 does not alter that architecture.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD107.md`](changelogs/CHANGELOG-BUILD107.md).  
Real-user receipt: [`docs/acceptance/BUILD107-REAL-USER-PASS.md`](docs/acceptance/BUILD107-REAL-USER-PASS.md).

## Rejected historical candidates

- **Build101** — Track asset normal-success false negative caused by quoted/raw ETag representation mismatch; superseded by accepted Build102.
- **Build104** — falsely classified pre-submit/node-offline Deep Audio transport as compute UNKNOWN; superseded by accepted Build105.

## Accepted lineage

```text
Build82–100   Phase9 reliability / canonical-truth lineage
Build102      ETag representation corrective
Build103      canonical audio pre-compute transient retry
Build105      Deep Audio pre-submit transport corrective
Build106      public catalog fallback transient GET retry
Build107      Phase10 shared catalog projection kernel
Build108      explicit catalog rebuild generation identity
```

All detailed per-build receipts remain preserved under `changelogs/` and `docs/`.
