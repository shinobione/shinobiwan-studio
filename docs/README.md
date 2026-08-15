# SHINOBIWAN Studio — Documentation Map

The repository now separates **canonical current truth** from **historical evidence**.

## Mandatory current-state read order

1. [`../AGENTS.md`](../AGENTS.md) — agent/session startup contract.
2. [`../PROJECT_STATE.md`](../PROJECT_STATE.md) — exact current release, PR/SHA/CI/deploy/RUP, blockers and NEXT.
3. [`../ROADMAP.md`](../ROADMAP.md) — Done / In progress / Next / Backlog.
4. [`../DECISIONS.md`](../DECISIONS.md) — durable architecture/product/safety decisions.
5. [`../QA.md`](../QA.md) — accepted real-user smoke, automated coverage and open QA gaps.
6. [`INTEGRATION_SAFETY.md`](INTEGRATION_SAFETY.md) — detailed cross-repository and production safety policy.

These files are deliberately short enough to reconstruct the project without parsing the historical archive.

## Current status

```text
Studio                 v0.19.4 · Build82 · REAL USER PASS
Phase 8                COMPLETE
Phase 9                ACTIVE
Phase 9 Slice1         Build82 · COMPLETE / REAL USER PASS
Build83                UNUSED
Track Manager          v5.23 · deployed
Studio bridge          v1.13
Public Worker          v2.7 · unchanged
LaunchPAD public       2026.08.12.102 · REAL USER PASS
SonicTrace             V2-E Build08 · REAL USER PASS
Deep Audio             2.0.3-alpha
LRC Maker              6.3.8
```

## Compatibility pointers

- [`ROADMAP-CURRENT.md`](ROADMAP-CURRENT.md) is retained for old links but now points to root `ROADMAP.md`.
- [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md) is retained for old links but now points to the canonical startup set.

They are **not** independent authorities anymore.

## Historical evidence

The remaining `PHASE-*`, `BUILD*`, `C2.5`, `C3`, migration, parity and closeout documents are implementation/acceptance evidence. Open them only when a current task needs that history.

Detailed build records live under [`../changelogs/`](../changelogs/README.md).

Current Build82 detailed record:

- [`../changelogs/CHANGELOG-PHASE9-BUILD82.md`](../changelogs/CHANGELOG-PHASE9-BUILD82.md)

Important preserved contracts include:

- [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md)
- [`STUDIO-FOCUS-PRODUCTION-FIRST-UX.md`](STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [`PHASE-5-SONICTRACE-COMPLETE.md`](PHASE-5-SONICTRACE-COMPLETE.md)
- [`PHASE-6-LYRICS-COMPLETE.md`](PHASE-6-LYRICS-COMPLETE.md)
- [`NATIVE-RELEASE-CAMPAIGN-BUILD48.md`](NATIVE-RELEASE-CAMPAIGN-BUILD48.md)
- [`PHASE-UX-DURATION-AUTHORITY.md`](PHASE-UX-DURATION-AUTHORITY.md)

## Changelog policy

- Root [`../CHANGELOG.md`](../CHANGELOG.md) stays concise and current.
- Detailed milestone logs belong in [`../changelogs/`](../changelogs/README.md).
- Do not add new `CHANGELOG-*.md` files to repository root.

## Acceptance language

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Also distinguish code merge, Pages deployment, Worker deployment and R2/catalog mutation.

Historical candidates retain their original status. Docs-only closeouts never mint a runtime build.
