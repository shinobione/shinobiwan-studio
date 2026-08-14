# SHINOBIWAN Studio — Documentation map

This directory contains architecture, roadmap, milestone and acceptance records. Keep **current truth easy to find** while preserving historical evidence.

## Read these first

1. [`../README.md`](../README.md) — concise current state.
2. [`ROADMAP-CURRENT.md`](ROADMAP-CURRENT.md) — current roadmap authority.
3. [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md) — exact next-session starting point.
4. [`../changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD72.md) — current deployed Build72 candidate / Slice2 smoke gate.
5. [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md) — current accepted Build71 / TM5.22 REAL USER PASS record.
6. [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md) — Phase 7-C contract and runtime gates.
7. [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md) — accepted Build67 / TM5.21 repair closeout.
8. [`STUDIO-FOCUS-PRODUCTION-FIRST-UX.md`](STUDIO-FOCUS-PRODUCTION-FIRST-UX.md) — accepted Studio Focus UX contract.
9. [`INTEGRATION_SAFETY.md`](INTEGRATION_SAFETY.md) — authority and integration safety rules.
10. [`../CHANGELOG.md`](../CHANGELOG.md) — concise current changelog.
11. [`../changelogs/README.md`](../changelogs/README.md) — detailed changelog archive.

## Current status

```text
Accepted Studio runtime  v0.19.3 · Build 71 · REAL USER PASS
Deployed candidate       v0.19.3 · Build 72 · Phase 7-C Slice 2 · SMOKE PENDING
Phase 7-C Slice 1        COMPLETE · Builds69→71 corrective chain
Phase 7-C Slice 2        DEPLOYED CANDIDATE · guided Core Media
Track Manager            v5.22 · bridge v1.12 · deployed admin-only
TM Worker Version ID     df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker            v2.7 · unchanged
```

Build71 remains the accepted cumulative runtime. Build72 is merged/deployed but cannot replace it until the real-user Core Media smoke passes. Builds69/70 remain historical candidate lineage and are not retroactively relabeled REAL USER PASS.

## Accepted closeouts

- [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- [`PHASE-UX-FINAL-CLOSEOUT-20260812.md`](PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`PHASE-7-A-REAL-USER-SMOKE-PASS.md`](PHASE-7-A-REAL-USER-SMOKE-PASS.md)
- [`PHASE-7-B-BUILD51-REAL-USER-PASS.md`](PHASE-7-B-BUILD51-REAL-USER-PASS.md)
- [`TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)

## Active reference docs

- [`../changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD72.md)
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
