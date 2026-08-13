# SHINOBIWAN Studio — Documentation map

This directory contains architecture, roadmap, milestone and acceptance records. Keep **current truth easy to find** while preserving historical evidence.

## Read these first

1. [`../README.md`](../README.md) — concise current state.
2. [`ROADMAP-CURRENT.md`](ROADMAP-CURRENT.md) — current roadmap authority.
3. [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md) — exact next-session starting point.
4. [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md) — Phase 7-C contract and runtime gates.
5. [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md) — accepted Build 67 / TM5.21 repair closeout.
6. [`../changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](../changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md) — deployed Build 68 Home corrective; real-user smoke pending.
7. [`STUDIO-FOCUS-PRODUCTION-FIRST-UX.md`](STUDIO-FOCUS-PRODUCTION-FIRST-UX.md) — accepted Studio Focus UX contract.
8. [`INTEGRATION_SAFETY.md`](INTEGRATION_SAFETY.md) — authority and integration safety rules.
9. [`../CHANGELOG.md`](../CHANGELOG.md) — concise current changelog.
10. [`../changelogs/README.md`](../changelogs/README.md) — detailed changelog archive.

## Current status

```text
Accepted Studio runtime  v0.19.3 · Build 67 · REAL USER PASS
Deployed candidate       v0.19.3 · Build 68 · Home lead fix · REAL USER SMOKE PENDING
Track Manager             v5.21 · bridge v1.11 · repair scope REAL USER PASS
Phase 7-C                 contract locked · runtime Slice 1 NOT STARTED
```

Build 68 must receive browser acceptance before it replaces Build 67 as the accepted baseline.

## Accepted closeouts

- [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- [`PHASE-UX-FINAL-CLOSEOUT-20260812.md`](PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`PHASE-7-A-REAL-USER-SMOKE-PASS.md`](PHASE-7-A-REAL-USER-SMOKE-PASS.md)
- [`PHASE-7-B-BUILD51-REAL-USER-PASS.md`](PHASE-7-B-BUILD51-REAL-USER-PASS.md)
- [`TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)

## Active reference docs

- [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [`STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md`](STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md)
- [`PHASE-5-SONICTRACE-COMPLETE.md`](PHASE-5-SONICTRACE-COMPLETE.md)
- [`PHASE-6-LYRICS-COMPLETE.md`](PHASE-6-LYRICS-COMPLETE.md)
- [`NATIVE-RELEASE-CAMPAIGN-BUILD48.md`](NATIVE-RELEASE-CAMPAIGN-BUILD48.md)
- [`PHASE-UX-DURATION-AUTHORITY.md`](PHASE-UX-DURATION-AUTHORITY.md)

## Historical docs

The remaining `PHASE-*`, `C2.5`, `C3`, migration and parity documents are preserved as implementation evidence. They are **not current roadmap authority** unless explicitly linked above.

`archive/` is reserved for documents that are no longer active references but remain useful for recovery.

## Changelog policy

- Root [`../CHANGELOG.md`](../CHANGELOG.md) stays concise and current.
- Detailed milestone logs belong in [`../changelogs/`](../changelogs/README.md).
- Do not add new `CHANGELOG-*.md` files to repository root.

## Acceptance language

- **CI GREEN** = automated validation only.
- **DEPLOYED CANDIDATE** = tested code is published.
- **REAL USER PASS** = deployed behavior was actually exercised and accepted.

Historical candidates never receive retroactive REAL USER PASS.
