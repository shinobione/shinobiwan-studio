# SHINOBIWAN Studio — Documentation map

This directory contains architecture, roadmap, milestone and acceptance records. Keep **current truth easy to find** while preserving historical evidence.

## Read these first

1. [`../README.md`](../README.md) — concise current state.
2. [`ROADMAP-CURRENT.md`](ROADMAP-CURRENT.md) — current roadmap authority; Build74 is accepted and the next Phase8 sub-scope is not yet allocated.
3. [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md) — exact next-session starting point.
4. [`../changelogs/CHANGELOG-PHASE8-BUILD74.md`](../changelogs/CHANGELOG-PHASE8-BUILD74.md) — accepted Build74 / Phase8 Slice1 REAL USER PASS record.
5. [`PHASE-8-SCOPE-AUDIT.md`](PHASE-8-SCOPE-AUDIT.md) — Build74 Content Health Truth scope, validation and accepted non-scope.
6. [`PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md) — proof that Phase7-C is program-complete without a synthetic Slice3 runtime.
7. [`../changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD73.md) — accepted Build73 / Phase7-C Slice2 REAL USER PASS record.
8. [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md) — accepted Slice1 / TM5.22 REAL USER PASS record.
9. [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md) — preserved Phase7-C guided-action safety contract.
10. [`INTEGRATION_SAFETY.md`](INTEGRATION_SAFETY.md) — authority and integration safety rules.
11. [`../CHANGELOG.md`](../CHANGELOG.md) — concise current changelog.
12. [`../changelogs/README.md`](../changelogs/README.md) — detailed changelog archive.

## Current status

```text
Accepted Studio runtime  v0.19.3 · Build 74 · Phase8 Slice1 · REAL USER PASS
Phase 7-C Slice 1        COMPLETE · Builds69→71 corrective chain
Phase 7-C Slice 2        COMPLETE · Builds72→73 corrective chain
Phase 7-C Program        COMPLETE · no Slice3 runtime required
Phase 8 Slice 1          COMPLETE · Build74 Content Health Truth · REAL USER PASS
Next runtime scope       Phase8 · fresh bounded audit required
Next build               Build75 · UNUSED
Track Manager            v5.22 · bridge v1.12 · deployed admin-only
TM Worker Version ID     df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker            v2.7 · unchanged
```

Build74 is the current accepted Studio runtime. It made global Content Health match the accepted production model: Cover required, Canvas optional, production completion independent from publication, and all health actions reusing the existing `workflow.nextAction` authority.

Build73 remains the accepted Phase7-C program baseline underneath Build74. Build72 remains historical deployed-candidate lineage and is not retroactively relabeled REAL USER PASS. Builds69/70 remain historical Slice1 candidate lineage superseded by Build71 acceptance.

**Build75 is unused.** A future Phase8 slice must be proven by a fresh code audit before any runtime branch is opened.

## Accepted closeouts

- [`../changelogs/CHANGELOG-PHASE8-BUILD74.md`](../changelogs/CHANGELOG-PHASE8-BUILD74.md)
- [`PHASE-8-SCOPE-AUDIT.md`](PHASE-8-SCOPE-AUDIT.md)
- [`PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md)
- [`../changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD73.md)
- [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- [`PHASE-UX-FINAL-CLOSEOUT-20260812.md`](PHASE-UX-FINAL-CLOSEOUT-20260812.md)
- [`PHASE-7-A-REAL-USER-SMOKE-PASS.md`](PHASE-7-A-REAL-USER-SMOKE-PASS.md)
- [`PHASE-7-B-BUILD51-REAL-USER-PASS.md`](PHASE-7-B-BUILD51-REAL-USER-PASS.md)
- [`TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md`](TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md)
- [`STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)

## Active reference docs

- [`ROADMAP-CURRENT.md`](ROADMAP-CURRENT.md)
- [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md)
- [`PHASE-8-SCOPE-AUDIT.md`](PHASE-8-SCOPE-AUDIT.md)
- [`PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md)
- [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [`STUDIO-FOCUS-PRODUCTION-FIRST-UX.md`](STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
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

Historical candidates never receive retroactive REAL USER PASS. Docs-only closeouts never mint or advance a runtime build by themselves.