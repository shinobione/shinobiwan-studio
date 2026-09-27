# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, read in order:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify real GitHub state before mutation.

## Current accepted state

**Build122 / v0.19.44 — Catalogue A2.3 Slice 3 · bounded REAL USER PASS.** Owner-authorized [PR #248](https://github.com/shinobione/shinobiwan-studio/pull/248) merged at `58f976218600757632efd58e36b2c74a8a47fcef`; exact final candidate `881845487d3119f45814a0ade2e8b7ef7487c352` passed [CI #36338838575](https://github.com/shinobione/shinobiwan-studio/actions/runs/36338838575), and [Pages #36339663943](https://github.com/shinobione/shinobiwan-studio/actions/runs/36339663943) build/upload/deploy SUCCESS on the merge SHA. Shino reported eight live private-source checks PASS: Recording/ISRC/appearance/finding counts, factual filters/search/identity sorts, exact multi-Release evidence with unbound exclusion, transient Recording/Release/appearance/Back navigation, contextual/global QA and pagination, keyboard/focus/mobile/desktop, session/discard lifecycle, and DevTools no private-source upload/storage/IDs in routes/external artwork retrieval. [Bounded owner receipt](docs/acceptance/BUILD122-REAL-USER-PASS.md) · [original candidate handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md).

The Catalogue remains explicit local-selection, read-only and temporary. A2.3's Overview, Releases and Recordings/QA views have separate bounded acceptances, **not** a persisted living registry. The derived source omits some private workbook evidence; earlier 355 source-specific findings are still pending, current external platform publication is unknown, and no artwork/genre/Studio Track auto-binding, commercial persistence, distributor write or sync authority has been granted.

**Build121 / v0.19.43** retains its [A2.3 Slice 2 owner acceptance](docs/acceptance/BUILD121-REAL-USER-PASS.md); **Build120 / v0.19.42** its [A2.3 Slice 1 acceptance](docs/acceptance/BUILD120-REAL-USER-PASS.md); **Build119 / v0.19.41** its [A2.2 private import receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md); **Build118 / v0.19.40** its separate [A2.1 original acceptance](docs/acceptance/BUILD118-REAL-USER-PASS.md) and [bounded CPU recovery](docs/acceptance/BUILD118-CPU-RECOVERY.md). Studio CPU #238 / LaunchPAD #283 remain open without sustained Free CPU compliance measurement.

## Next decision — living commercial Catalogue architecture (planning only)

[Catalogue A2.3 blueprint](docs/CATALOGUE-A2-3-BLUEPRINT.md) outlines later work, not authorization: private source completeness/richer export, exact commercial source-of-truth and review, artwork, per-channel release observations, secure persistence, revision/conflict/rollback and STUDIO ↔ LaunchPAD write boundaries. The Build122 docs closeout allocates **no Build123**, new persistence, sync, runtime PR or deployment.

## Product model

```text
Home
Tracks
Albums
Catalogue

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace summary.
- **Visuals** — cover, thumbnail and Canvas. Cover is required; Canvas is optional.
- **Lyrics** — canonical `lyrics.txt`, embedded LRC Maker and text editing.
- **Release** — final production check + browser-local Release Campaign.
- **Sonic / Details / Advanced** — full SonicTrace analysis and deliberately requested technical depth.

Production and publication remain separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Draft
```

Public visibility is additionally gated by canonical parent-Album publication in Public Worker v2.8.

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same workflow authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             COMPLETE · program closeout on accepted Build106
Phase 10 Slice1     Build107 · REAL USER PASS
Phase 10 Slice2     UNALLOCATED
Phase 10            ACTIVE · progressive extraction by bounded audited slices
Build108            COMPLETE · catalog rebuild identity · REAL USER PASS
Build109            COMPLETE · Track-create identity · REAL USER PASS
Build110–117        COMPLETE · see canonical checkpoint and acceptance receipts
Build118            ACCEPTED · A2.1 PASS; deployed CPU slice 4 bounded owner PASS
Build119            ACCEPTED · A2.2 local-private dry-run · bounded REAL USER PASS
Build120            ACCEPTED · A2.3 Slice 1 shared session/Overview · bounded REAL USER PASS
Build121            ACCEPTED · A2.3 Slice 2 Releases gallery/detail · bounded REAL USER PASS
Build122            ACCEPTED · A2.3 Slice 3 Recordings/contextual QA · bounded REAL USER PASS
Official Phase 11   NONE
```

Build118–122 are independently accepted Catalogue product slices outside Phase10 Slice2. A long-lived commercial registry and cross-repository synchronization remain separately scoped.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD / Public Worker** — public listener and public-read visibility layer.
- **SonicTrace** — audio intelligence and canonical owner of the Build107 projection kernel.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- canonical Album membership/ownership = Album `trackIds`.
- public fallback remains read-only and never verifies canonical writes.

## Reliability rules

Private GET retry is bounded to accepted transient classes and at most one retry. It never authorizes write retry.

For accepted write-hardening slices:

```text
response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

Build108 adds stronger evidence only for explicit catalog rebuild through canonical `generationId`.
Build109 adds stronger evidence only for explicit Track create through private immutable `creationOperationId`.
Neither authorizes generic operation IDs or retries for unrelated write families.

## Release identity rule

`src/release.ts` and `package.json` carry canonical Studio runtime identity. The build runs `check:release`, which rejects stale build/version metadata relative to the latest `check:buildNNN` gate and keeps the visible sidebar phase/version/build/summary tied to `studioRelease` instead of hard-coded historical copy.

## Roadmap continuity

Preserved backlog includes Album asset exact-byte/digest proof, optional future Deep Audio operation identity/status, degraded/offline workflow work only when a bounded product slice is proven, premium interaction polish, and further Phase10 extraction only when singular authority and independent rollback remain explicit.

See [`ROADMAP.md`](ROADMAP.md) for current Done / Active / Next / Backlog state and [`QA.md`](QA.md) for accepted test boundaries.

The repository still publishes no formal GitHub Release objects and no Git tags. Runtime identity is carried by code, docs and Pages.
