# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-09-13 after **Build107 REAL USER PASS** and Phase10 Slice1 acceptance closeout.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

```text
Version                 v0.19.29
Build                   Build107
Status                  REAL USER PASS
Codename                studio-focus-slice4-phase10-shared-catalog-projection-kernel
Implementation PR       #214
Exact implementation    b827e7076610c840f8e0f4446f5cf6fd33411008
Implementation CI       #617 · 34749718962 · SUCCESS
Implementation merge    9b40d2cc3fb1bd22e950a94af859564fadf8dfff
Implementation Pages    #225 · 34750194798 · SUCCESS build + deploy
SonicTrace source PR    #86
SonicTrace source       70b0bf277a01f3817dd2db71c91233a8fe91debf
SonicTrace CI           #107 · 34749669665 · SUCCESS
Kernel SHA-256          f883aa12011d0714049717c6de6a426fbc7c8296a5aa872a978aaeefc47f34d8
Real-user smoke         PASS · Studio Intelligence + SonicTrace standalone catalog maps
```

Detailed receipt: [`docs/acceptance/BUILD107-REAL-USER-PASS.md`](docs/acceptance/BUILD107-REAL-USER-PASS.md).

## Build107 automated coverage — GREEN

Studio validation on PR #214 completed successfully on exact head `b827e7076610c840f8e0f4446f5cf6fd33411008`. The repository-native build starts with `check:phase10`, which verifies the pinned source metadata, rejects tampered bytes/metadata and executes numerical kernel regression before the inherited Phase0–9 / UX / Focus / typecheck / Vite chain.

The implementation merge `9b40d2cc3fb1bd22e950a94af859564fadf8dfff` then completed GitHub Pages run `34750194798` successfully for both build and deploy.

SonicTrace PR #86 validated the source-side extraction on commit `70b0bf277a01f3817dd2db71c91233a8fe91debf`. Workflow run `34749669665` finished SUCCESS. Its contract job passed Build107 kernel coverage plus the existing Python, semantic and catalog regressions. The real Discogs-EffNet ONNX smoke initially hit a network timeout while downloading metadata; the isolated job rerun completed successfully, confirming the earlier failure was external/transient rather than a Build107 numerical regression.

Local pre-PR proof additionally covered exact cross-implementation parity, frozen whole-catalog outputs, empty/zero/collinear/rank-deficient/512D cases, orthogonal PC2, unequal-length dot products, determinism, no mutation, source digest integrity and SonicTrace loader initialization.

## Build107 real-user smoke — PASS

The user performed the requested non-mutating smoke on 2026-09-13 against the deployed Studio implementation and normal SonicTrace standalone runtime.

Visible Studio evidence:

```text
Intelligence analyzed    45
512D ready               45
Hidden from map          0
Acoustic zones           5
Sonic families           11
Catalog map              rendered
Selected track           NGÀY EM VỀ NHÀ
Closest-sound panel      rendered
```

Visible SonicTrace standalone evidence:

```text
Catalog titles           20
Acoustic zones           3
Sonic families           4
Outliers                  0
Catalog map              rendered
Selected track           Saigon Sun, Toulouse Moon
Neighbor links           rendered
```

The smoke exercised exactly the affected product surface: deterministic projection, map rendering, zones/families, active selection and neighbor/closest-sound presentation. No write, R2 mutation, Track Manager mutation or deliberate production failure was introduced.

Result: **PASS**.

## Build107 contract boundary

Shared and singular:

```text
SonicTrace canonical source
  js/catalog-projection-kernel.mjs
  normalize / dot / powerComponent
        ↓ generated + pinned copy
Studio
  src/vendor/catalog-projection-kernel.mjs
```

Still application-owned:

```text
Studio:      512D validity · canonical ordering · centering · map normalization · zones · nearest · semantics
SonicTrace:  input cleaning · projection policy · fallback · clustering · scoring · semantics
```

The Studio copy is not an independently editable source. Provenance pins repository, commit, path and SHA-256. No live cross-origin runtime dependency exists.

## Known non-blocking environment limitations

The original local Windows CRLF checkout still hits the pre-existing Build79 LF-sensitive assertion when the full chain is run directly. The exact tracked source passes in LF/CI form, and working-checkout typecheck plus Vite build passed. Build107 did not introduce that line-ending guard.

The first local SonicTrace real-model smoke lacked `librosa`; GitHub CI installed the required CPU smoke dependencies. The first CI model smoke then encountered a metadata download timeout, and the isolated rerun passed. These are recorded as environment/network limitations, not hidden as green first-attempt results.

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
```

Build107 does not reopen or alter Phase9 reliability policy.

## Cross-stack accepted baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
Public Worker           v2.8 · REAL USER PASS
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Remaining unproven areas — backend-contract candidates

These remain outside Build107:

- Album create lost-response causality / durable operation identity;
- Track create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- catalog rebuild operation identity / generation evidence;
- Deep Audio request status/idempotency if the coordinator gains an operation identity contract;
- degraded/offline behavior only where a future audit proves material daily-workflow impact.

Studio must not fabricate causal certainty when the backend does not expose authoritative evidence.

## Next QA gate

Before any Phase10 Slice2 implementation, perform a fresh bounded cross-repository scope audit. A future slice must prove one real duplication/reuse boundary, preserve standalone applications and singular authority, be independently reversible, pass exact-head repository CI and receive real-user acceptance when behavior materially changes.
