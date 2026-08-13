# Studio v0.15.1 · Build 45 — Track-To-Market Bridge V2

Date: 2026-08-12
Codename: `phase-ux-c3-track-to-market-bridge-v2`
Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

## Added

- New `Release Pack` tab in the canonical Track Workspace.
- New read/review-only `TrackToMarketPanel`.
- Track-To-Market standalone URL in Studio config.
- Bridge V2 ready/input/final-return handshake.
- Long canonical lyrics transport through `postMessage`, not query parameters.
- FINAL-only return review card showing provider/model/mode/bridge version.
- Responsive dedicated Track-To-Market workspace styles.
- Build 45 regression guard.

## Safety

- No R2 write.
- No Track Manager mutation call.
- No LaunchPAD change.
- No SonicTrace runtime/persistence change.
- No LRC Maker change.
- Returned `trackId` must match the current Studio track.
- Returned `releaseStatus` must equal `final`.
- DRAFT returns are rejected.
- Returned FINAL data is transient React state only.

Rollback anchor: `safety/pre-track-to-market-build45-20260812`.

## Phase lineage

Build 45 stays inside the `phase-ux-c3-*` release lineage so existing Phase 7 lock guards remain authoritative.

This change does **not** mark C3-C premium-feel real-user smoke as passed and does **not** authorize Phase 7.

## Acceptance gate

CI validates structure and safety, but real-user acceptance requires:

1. open `Release Pack` on a real canonical track;
2. open Track-To-Market and verify title/genres/trackId;
3. verify full lyrics arrive through Bridge V2;
4. create/import a FINAL cover in Track-To-Market;
5. export FINAL and verify Studio receives the matching FINAL pack;
6. verify no canonical R2/track data changed during the smoke.
