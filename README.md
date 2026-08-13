# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Current accepted baseline

```text
Studio          v0.19.1 · Build 61    Studio Focus Slice 4 · REAL USER PASS
LaunchPAD       2026.08.12.102        C3-C · REAL USER PASS
Track Manager   v5.19                 protected canonical write authority
Studio bridge   v1.11
Public Worker   v2.7
SonicTrace      V2-E Build 08         durable FULL profile lineage · REAL USER PASS
Deep Audio      2.0.3-alpha
LRC Maker       6.3.8
```

Accepted Studio lineage:

```text
Phase 7-A       Build 46   REAL USER PASS
Phase 7-B       Build 51   REAL USER PASS
Studio Focus 1  Build 53   REAL USER PASS
Studio Focus 2  Build 56   REAL USER PASS
Studio Focus 3  Build 58   REAL USER PASS
Studio Focus 4  Build 61   REAL USER PASS
```

Build 60 remains historical deployed candidate evidence and is superseded by Build 61 for Slice 4 acceptance. Build 59 was reserved by a parallel branch and was deliberately not reused.

**Phase 7-C remains CLOSED / NOT STARTED.** No later phase starts by implication.

## Daily product model

Normal Studio use is intentionally reduced to:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace is organized around the artist mental model:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace artist summary.
- **Visuals** — canonical Cover / Thumbnail / Canvas; canonical Canvas preview is 9:16.
- **Lyrics** — embedded LRC Maker; `lyrics.txt` is the only canonical lyrics source.
- **Release** — final checklist + native browser-local Release Campaign.
- **Details / Advanced** — full metadata, SonicTrace diagnostics and technical depth when deliberately requested.

Production and publication are separate overlapping axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Drafts
```

A published track may still need lyrics timing, SonicTrace refresh or another useful production action.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical write authority.
- **Studio** — private cockpit/orchestrator; never a second generic write owner.
- **LaunchPAD** — public listener experience.
- **SonicTrace** — audio-intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- canonical `trackId` is the same R2 track slug everywhere.

**Orchestration does not mean centralization.** Public fallback is never a second source of truth.

## Canonical contracts

### Lyrics

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export / compatibility only
```

### Albums

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

`album.trackIds` owns membership and artistic order. Track-side Album title/id fields are compatibility cache only.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is never persisted in the analysis sidecar.

### Phase 7-B receipts

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Canonical-write receipts require exact `trackId`, an allowlisted operation and a **private Track Manager canonical reread** before Studio may display VERIFIED. Public fallback can never verify a write.

## Native Release Campaign

Primary visual-generation/review contract:

```text
Canonical Track context
        ↓
MASTER FINAL 16:9
        ├── 1:1 derived independently from MASTER
        └── 9:16 derived independently from MASTER
```

**9:16 is never derived from 1:1.** Both are sibling derivatives anchored to MASTER.

Campaign drafts remain browser-local. ZIP export is review-only and keeps `canonicalWrite: false`; a visual FINAL is never silently promoted to canonical R2 media.

## Documentation

Start here:

- [Current roadmap](docs/ROADMAP-CURRENT.md)
- [Documentation map](docs/README.md)
- [Studio Focus product/UX contract](docs/STUDIO-FOCUS-PRODUCTION-FIRST-UX.md)
- [Build 61 REAL USER PASS](docs/STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Current concise changelog](CHANGELOG.md)
- [Detailed changelog archive](changelogs/README.md)

Historical milestone documents remain available under `docs/`; `docs/archive/` is reserved for material that is no longer an active reference.

## Safety / acceptance policy

For any runtime change:

1. verify the real `main` head and build identity;
2. create a safety anchor;
3. work on a dedicated feature branch;
4. run the complete inherited CI chain on the exact feature head;
5. reread `main` before merge to prevent stale merges;
6. merge only the tested head;
7. verify Pages/production deployment on the exact merge SHA;
8. perform real-user browser smoke;
9. only observed behavior may be promoted to **REAL USER PASS**.

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Do not mutate production media merely to manufacture smoke evidence.
