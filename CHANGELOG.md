# SHINOBIWAN Studio — Changelog

This is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/).

## Current accepted release

### v0.19.31 · Build109 — 2026-09-13

Codename: `studio-focus-slice4-track-create-operation-identity`  
Status: **REAL USER PASS — ACCEPTED**

Build109 closes one specific reliability gap: causal proof for explicit Track creation after a lost HTTP response.

Studio now generates one browser UUID per explicit Track create. Track Manager persists it privately as immutable canonical `creationOperationId` evidence. Studio never retries the create POST automatically. Normal success keeps exact canonical verification; if the response is lost, Studio performs a private canonical reread and recovers success only when the exact creation UUID matches. Missing, mismatched, legacy or unreadable identity remains ambiguous/unverified and non-retryable.

```text
Backend PR               LaunchPAD-APP #276
Backend candidate        3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge            5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy             #44 · 34762956165 · SUCCESS · admin only
Studio PR                #218
Studio candidate         5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI                #660 · 34762678307 · SUCCESS
Studio merge             4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages             #229 · 34762759192 · SUCCESS build + deploy
Real-user smoke          build109-smoke-20260913 · canonical private reread verified
creationOperationId      77ce7e21-90b9-46a3-b166-6148003d50a8
Smoke cleanup            disposable Track deleted after verification
Public Worker            unchanged
R2 schema migration      NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD109.md`](changelogs/CHANGELOG-BUILD109.md).  
Real-user receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

## Accepted predecessor

### v0.19.30 · Build108 — 2026-09-13

Codename: `studio-focus-slice4-catalog-rebuild-generation-identity`  
Status: **REAL USER PASS — ACCEPTED**

Build108 closes one specific reliability gap: causal proof for the explicit Studio catalog rebuild.

Studio generates one browser UUID per explicit rebuild. Track Manager persists it as the canonical catalog `generationId`, verifies it before success response, and exposes it through the private catalog read model. Studio then rereads canonical state and requires the exact UUID match before declaring the rebuild verified. Lost-response handling remains zero-blind-retry.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD108.md`](changelogs/CHANGELOG-BUILD108.md).  
Real-user receipt: [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](docs/acceptance/BUILD108-REAL-USER-PASS.md).

### v0.19.29 · Build107 — 2026-09-13

Codename: `studio-focus-slice4-phase10-shared-catalog-projection-kernel`  
Status: **REAL USER PASS — ACCEPTED**

Build107 is the first accepted Phase10 extraction slice. SonicTrace owns the singular editable numerical projection kernel and Studio consumes a generated digest-pinned copy. Build108/109 do not alter that architecture.

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
Build109      explicit Track-create operation identity
```

All detailed per-build receipts remain preserved under `changelogs/` and `docs/`.
