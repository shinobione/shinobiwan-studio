# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

## Current owner-observed runtime and evidence — 2026-09-28

**Build123 / v0.19.45** merged as [PR #253](https://github.com/shinobione/shinobiwan-studio/pull/253) at `bfcad4b2c75b72bf02c316b9f1096141dab05957`; exact tested feature head `78cab3b6fee6022df6ddffad91404e9c4edda9f5`, [CI #36459697086 SUCCESS](https://github.com/shinobione/shinobiwan-studio/actions/runs/36459697086). Owner saw Build123 live, imported their private v2 locally and reported bounded REAL USER PASS. Merge-SHA Pages workflow-run receipt was not separately obtained. [Sanitized Build123 receipt](docs/acceptance/BUILD123-REAL-USER-PASS.md): 14 detail rows / 14 exact existing appearance links / zero unlinked; one independent historical detail visually confirmed under exact appearance with original evidence; 355 QA findings pending and channel current status unknown; Reset/refresh and owner-reported DevTools privacy PASS. It does not prove every source row manually, whole original workbook, actual DSP availability, formal security/a11y audit, private write, backup or sustained CPU compliance.

**Next QA gate:** Owner chose Path A, a future explicit portable encrypted package. The proposed [C1 architecture and independently invented Node-only tests](docs/CATALOGUE-A2-4C-A-LOCAL-PACKAGE-C1-CONTRACT.md) check only dry-run aliases, revision conflicts, evidence edges, restore *planning* and zero-write discipline; they neither encrypt/decrypt nor write actual files. Actual KDF/AEAD, wrong password, tamper, nonce/salt, size, recovery-copy and private-browser Network/Storage must be independently tested at a separately approved C2 implementation. No Build124, persistence, Worker/R2/LaunchPAD mutation or commercial↔creative sync authorized. Preserve inherited v1 and Build118–122 regressions, exact evidence provenance and unresolved CPU #238 / LaunchPAD #283.

## Previous accepted runtime and evidence — 2026-09-27

Verified production pre-closeout `main` `58f976218600757632efd58e36b2c74a8a47fcef`, owner-authorized [PR #248](https://github.com/shinobione/shinobiwan-studio/pull/248). Exact final candidate `881845487d3119f45814a0ade2e8b7ef7487c352` passed [CI #36338838575](https://github.com/shinobione/shinobiwan-studio/actions/runs/36338838575); [Pages #36339663943](https://github.com/shinobione/shinobiwan-studio/actions/runs/36339663943) build/upload/deploy SUCCESS on the merge SHA. **Build122 / v0.19.44 A2.3 Slice 3 has bounded owner REAL USER PASS** for session-only Recordings explorer and evidence-linked contextual QA.

[Owner-reported Build122 production receipt](docs/acceptance/BUILD122-REAL-USER-PASS.md): all eight requested checks PASS — source-derived Recording/ISRC/appearance/finding counts; title/ISRC search, factual filters and identity-preserving sort; exact bound multi-Release/position/evidence detail and no unbound auto-link; transient Recording/Release/appearance/Back; contextual/global QA with Show all and full pagination; keyboard/focus and reported mobile/desktop comfort; section/replacement/Reset/refresh lifecycle; DevTools no private upload, durable browser Storage, source IDs in URL or external artwork fetch during tested flow. This is an owner's bounded report, not independently retained screenshots/Network logs, comprehensive accessibility/security certification or independent sustained performance/CPU evidence. Original source-specific findings remain pending.

Distinct candidate validation is recorded in the [original pre-merge handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md): release/TypeScript/build, inherited Build118–121/CPU checks, eight independently synthetic actual App/StrictMode Chromium scenarios covering provenance, exact identities, contextual/global QA, modal focus/navigation, responsive 320/390/768/1280/2560 widths, lifecycle/late Worker races and privacy, and 137-file artifact/source/build guard. Exact final-head CI rather than earlier implementation-only evidence is the delivery gate; historical handoff stays unmodified.

Source normalized identity rules: Recording QA = own and explicitly bound appearance evidence; Release QA = own and bound/unbound appearance evidence; Appearance QA = its own row; note-only source cases remain in the global findings. Build121 Release detail retains broader linked-Recording finding disclosure than the narrower Release QA filter; the distinction is explicit. Global findings are not deleted/resolved by filters. ISRC and title similarities never establish commercial Recording or creative Track binding. Current platform availability remains unknown.

Prior [Build121 Slice 2](docs/acceptance/BUILD121-REAL-USER-PASS.md), [Build120 Slice 1](docs/acceptance/BUILD120-REAL-USER-PASS.md), [Build119 import](docs/acceptance/BUILD119-REAL-USER-PASS.md), [Build118 A2.1](docs/acceptance/BUILD118-REAL-USER-PASS.md), [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md) and Build117 historical acceptance remain separate. Derived JSON lacks complete ten-sheet workbook evidence; the earlier 355 source-specific findings remain pending. No Worker/R2/backend/LaunchPAD/Blackhole deployment or commercial persistence/writes. Studio CPU #238 / LaunchPAD #283 remain open without sustained measurements.

### Next QA boundary

The three A2.3 session-only read/view slices now have independent bounded owner receipts. A future **living commercial Catalogue** needs separate identity/source-of-truth, richer private-source coverage if required, exact reviewed artwork/Track matching, channel-specific status/evidence, confidentiality, persistence, conflict/rollback and cross-repository write-authority design. This paragraph is the historical Build122-only closeout; Build123 later received its independent bounded owner acceptance as recorded above. No persistence or Build124 follows.

## Automated CPU regression coverage

The inherited Build118 gate retains lean canonical Albums, shared private requests, private/public Track provenance, independent full migration/write verification, transient retry ceilings, SonicTrace additive semantics, freshness and unmount checks. Local A2.2 tests and future owner smoke must be reported separately from these accepted production receipts.

## Historical Build109 accepted receipt

```text
Version                 v0.19.31
Build                   Build109
Status                  REAL USER PASS
Codename                studio-focus-slice4-track-create-operation-identity
Studio PR               #218
Exact candidate         5114875db99af8cfc9bc7f5747674321faf1fe7b
Studio CI               #660 · 34762678307 · SUCCESS
Studio merge            4a2014ba8828063d566c4f5df77c4f1095c0355f
Studio Pages            #229 · 34762759192 · SUCCESS build + deploy
Backend PR              LaunchPAD-APP #276
Backend candidate       3cf55f7338b9b139586b7a62c6eebfb6100f370f
Backend merge           5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80
Admin deploy            #44 · 34762956165 · SUCCESS · admin only
Real-user smoke         PASS · disposable Track create · exact creationOperationId reread
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
```

Detailed receipt: [`docs/acceptance/BUILD109-REAL-USER-PASS.md`](docs/acceptance/BUILD109-REAL-USER-PASS.md).

## Build109 automated coverage — GREEN

### Backend

LaunchPAD / Track Manager PR #276 added a bounded creation-operation identity contract around explicit Studio Track creation.

Automated proof covered:

- optional strict UUID v4 `operationId` for backward-compatible callers;
- private canonical `creationOperationId` persistence;
- immutability/preservation across later canonical Track mutations;
- public catalog/projection stripping of private creation identity;
- existing slug uniqueness and `TRACK_EXISTS` behavior;
- compatibility for legacy clients without operation identity;
- zero automatic create-write retries;
- lost-response evidence remaining operation-specific rather than generic idempotency infrastructure;
- full Cloudflare Worker validation and Wrangler dry-run chain.

The backend candidate `3cf55f7338b9b139586b7a62c6eebfb6100f370f` passed PR workflows `Validate Cloudflare Workers`, `Validate Launchpad` and `Validate Horizontal Overflow`. It merged at `5472d43eaf5d7fcbe3413ef9f6e1d088a2f80b80`. The protected admin-only production deployment run `34762956165` (#44) completed successfully. Public Worker deployment was intentionally skipped.

### Studio

Studio PR #218 validated exact Track-create operation identity behavior on candidate `5114875db99af8cfc9bc7f5747674321faf1fe7b` in `Validate SHINOBIWAN Studio` run `34762678307` (#660), result SUCCESS.

The guard locks:

- one secure browser UUID per explicit Track create;
- one-shot create POST with `maxAutomaticTrackCreateRetries: 0`;
- Build97 exact canonical manifest verification on normal success;
- timeout/transport/body-loss private canonical reread only;
- exact `creationOperationId` match as the only lost-response success recovery proof;
- mismatched/missing/legacy/unreadable evidence remaining ambiguous/unverified and non-retryable;
- no widening into a generic retry or idempotency helper.

The implementation merged at `4a2014ba8828063d566c4f5df77c4f1095c0355f`. Pages run `34762759192` (#229) completed build + deploy successfully.

## Build109 real-user smoke — PASS

The user performed a non-destructive Track-create smoke against the deployed backend and deployed Studio on 2026-09-13.

Canonical evidence:

```text
Title                   Build109 Smoke
slug                    build109-smoke-20260913
Album                   Singles
status                  draft
creationOperationId     77ce7e21-90b9-46a3-b166-6148003d50a8
private canonical read  verified
cleanup                 disposable Track deleted
```

This proves the deployed Studio generated the operation UUID and the deployed Track Manager persisted and exposed the exact private canonical creation identity.

Result: **PASS**.

Production was not intentionally interrupted to manufacture a transport failure. Timeout/transport/body-loss/mismatch/legacy/unreadable paths remain covered deterministically by automated Build109 tests.

## Build109 contract boundary

Accepted only for explicit Studio Track create:

```text
browser operationId UUID
        ↓
POST Track create (one shot)
        ↓
Track Manager private canonical creationOperationId
        ↓
private canonical reread after lost response
        ↓
exact UUID match = committed / recovered
```

Not generalized to:

```text
Album create
binary asset upload
metadata / Lyrics / SonicTrace writes
Deep Audio compute
```

No generic write-retry or generic idempotency service was introduced.

## Release metadata guard

Build109 release closeout adds `check:release` to the Studio build chain. It verifies:

- `package.json` version equals `src/release.ts` version;
- `studioRelease.build` equals the highest `check:buildNNN` gate;
- the active 0.19 release-line build/version mapping remains incremented;
- Build107+ stays under the active Phase10 program metadata;
- sidebar phase and summary are rendered from canonical `studioRelease` metadata instead of historical hard-coded copy.

This prevents the exact Build109 closeout error where functional code advanced while the visible release badge remained on Build108.

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
Build109     Track-create operation identity                        PASS
```

Build109 does not reopen Phase9 or alter Build107's numerical extraction contract.

## Historical Build109 cross-stack baseline

```text
Track Manager           v5.24 · protected canonical write authority
Studio bridge           v1.14
Admin Worker            Build109 admin deploy #44 · 34762956165 · SUCCESS
Public Worker           v2.8 · REAL USER PASS · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Build107 kernel owner   SonicTrace
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

## Remaining unproven areas — backend-contract candidates

- Album asset exact-byte/digest proof (Track assets are covered by accepted Build117);
- Deep Audio request status/idempotency if the coordinator gains an operation identity contract;
- degraded/offline behavior only where a future audit proves material daily-workflow impact.

Track-create operation identity is no longer unproven for the explicit Studio create path.
Catalog rebuild operation identity/generation evidence remains accepted from Build108.

Studio must not fabricate causal certainty when a different backend operation does not expose authoritative evidence.

## Next QA gate

Review the Build122 documentation-only owner receipt; plan any living commercial registry and STUDIO ↔ LaunchPAD sync as a separate architecture/authority gate before runtime allocation. QA and CPU incidents remain open without automatic resolution or sustained telemetry.
