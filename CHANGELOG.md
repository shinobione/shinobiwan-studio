# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records are organized under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.2 · Build 62 — 2026-08-13

Codename: `studio-focus-program-closeout`  
Status: **COMPLETE — REAL USER PASS**

Accepted Studio Focus program closeout:

- public-cover `Extract colors` no longer fails from credential/CORS mismatch;
- artist-facing production wording uses `Sonic` / `SonicTrace` rather than the ambiguous legacy `Sound` label;
- the misleading Release Campaign `Premium provider` selector is removed because provider selection did not alter MASTER, 1:1 or 9:16 prompt generation;
- prompt generation remains provider-agnostic and Google Flow remains a direct convenience handoff;
- the extracted-palette layout remains stable when save controls appear;
- legacy French artist-facing `Titre d'Album` is presented as `Album track` without silently changing stored metadata;
- paired Track Manager v5.20 stabilizes legacy manifest revisions so an unchanged legacy track no longer produces a false `STALE_MANIFEST` during palette save;
- explicit palette save on `Magnetic Midnight` passed real-user production smoke;
- Workflow remains under Advanced while Home remains the daily continuation/attention surface;
- Phase 7-C remains **CLOSED / NOT STARTED**.

Final accepted deployment:

```text
Studio main       b464c0930a5659b208b3a059d443f708b8e55dba
Studio Pages run  31713370595    SUCCESS
Track Manager     v5.20
Studio bridge     v1.11
LaunchPAD main    586c71333c902fc2ebef214c63e9234ece9e1711
Worker run        31714222431    SUCCESS · admin only
Worker Version ID 78609aff-1f4a-4a21-b618-cb97add0c416
Public Worker     v2.7            unchanged
```

Full acceptance evidence: [`docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md).

## Immediate predecessor

### v0.19.1 · Build 61 — Studio Focus Slice 4 REAL USER PASS

Build 61 remains the accepted Slice 4 baseline. Build 62 did not create a fifth Studio Focus slice; it corrected issues found by the final cross-flow closeout and then completed program-level acceptance.

Build 60 remains historical deployed candidate evidence and was superseded by Build 61 for Slice 4 acceptance.

## Detailed history

- Build 30→61 milestone logs: [`changelogs/README.md`](changelogs/README.md)
- Build 62 corrective record: [`docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md`](docs/STUDIO-FOCUS-BUILD62-CLOSEOUT-CORRECTIVE.md)
- Studio Focus final closeout: [`docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md)
- Original monolithic history through Build 29: [`changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md`](changelogs/LEGACY-CHANGELOG-THROUGH-BUILD29.md)
- Current roadmap: [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- Documentation map: [`docs/README.md`](docs/README.md)

Repository cleanup on 2026-08-13 moved the detailed `CHANGELOG-*.md` records out of the repository root **without altering their historical contents**. The root now keeps only this current changelog entry point.
