# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current PHASE UX release line

```text
Studio          v0.14.0 · Build 42
Codename        phase-ux-c3-b-v2e-parity
Status          C3-B IMPLEMENTED CANDIDATE · REAL USER SMOKE PENDING

LaunchPAD       2026.08.11.90
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha

LRC Maker       6.3.8
```

The validated runtime line is complete through C3-A plus the focused Album UX/palette and Build 41 New Track hotfix. Build 42 is the new C3-B candidate and still requires a real-user Intelligence smoke before acceptance.

Historical implementation details remain in milestone-specific docs/changelogs and Git history.

## Current milestone

**PHASE UX C2.5-A → C2.5-F is COMPLETE and real-user validated.**

The final C2.5-F smoke passed on desktop and mobile on 2026-08-11. LaunchPAD Build 89 established the validated canonical Album baseline with three canonical R2 Albums plus virtual Singles through public Worker v2.7.

**C3-A — SonicTrace Deep Audio resilience is COMPLETE — REAL USER PASS.**

After updating/restarting SonicTrace `V2-E · BUILD 06`, Studio ran a canonical-audio scan for **Stick to You** and produced an unsaved truthful **FULL** profile with DSP, mastering, Neural, finite 512D embedding, structure and semantic summary ready. The smoke did not write the new draft to R2.

**C3-B — Studio V2-E parity is IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING.**

Studio Build 42 now interprets the canonical persisted SonicTrace catalog directly inside Studio:

- deterministic 2D projection from finite 512D CLAP embeddings;
- acoustic K-means zones;
- separate Neural genre-derived sonic families;
- redundant-pair, outlier and bridge signals;
- canonical Album/Project coherence and bridge analysis;
- advisory project sequencing with original canonical position provenance;
- no automatic Album order/membership mutation.

The map semantics are explicitly:

```text
position = embedding proximity
color    = sonic family
zone     = acoustic neighborhood
```

C3-C premium interaction polish remains blocked until Build 42 passes its real-user Intelligence smoke.

See:

- [`docs/PHASE-UX-C2-5-CLOSEOUT.md`](docs/PHASE-UX-C2-5-CLOSEOUT.md)
- [`docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md`](docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md)
- [`docs/PHASE-UX-C3-ALBUMS-FOCUSED-WORKSPACE.md`](docs/PHASE-UX-C3-ALBUMS-FOCUSED-WORKSPACE.md)
- [`docs/PHASE-UX-C3-TRACK-CREATE-CAPABILITY-HOTFIX.md`](docs/PHASE-UX-C3-TRACK-CREATE-CAPABILITY-HOTFIX.md)
- [`docs/PHASE-UX-C3-B-V2E-PARITY.md`](docs/PHASE-UX-C3-B-V2E-PARITY.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`CHANGELOG-C2-5-CLOSEOUT.md`](CHANGELOG-C2-5-CLOSEOUT.md)
- [`CHANGELOG-C3-BUILD38.md`](CHANGELOG-C3-BUILD38.md)
- [`CHANGELOG-C3-BUILD39.md`](CHANGELOG-C3-BUILD39.md)
- [`CHANGELOG-C3-BUILD40.md`](CHANGELOG-C3-BUILD40.md)
- [`CHANGELOG-C3-BUILD41.md`](CHANGELOG-C3-BUILD41.md)
- [`CHANGELOG-C3-BUILD42.md`](CHANGELOG-C3-BUILD42.md)

## Important roadmap status

PHASE UX is **not finished yet**.

Current permitted milestone:

**C3-B — Studio V2-E parity candidate validation.**

C3-C may begin only after C3-B real-user acceptance.

Phase 7 remains **LOCKED / NOT AUTHORIZED**. Do not implement, scaffold, branch, merge or deploy Phase 7 without a new explicit user authorization after the final PHASE UX closeout.

## Product roles — frozen

- **Studio** — private artist cockpit / orchestrator.
- **LaunchPAD** — public listener product.
- **Track Manager** — protected admin/backend write authority.
- **SonicTrace** — audio intelligence / Catalog Intelligence engine.
- **LRC Maker** — lyrics synchronization engine.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **GitHub** — application-code authority.

Canonical `trackId` is the R2 track slug everywhere.

Studio never becomes another catalog and does not replace the specialized applications.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

Frozen rules:

- Album ID is immutable storage identity;
- ordered `album.trackIds` is authoritative membership and artistic order;
- track-manifest `album.id/title` is compatibility cache during migration, not authority;
- `catalog/index.json` is a rebuildable projection, not Album authority;
- Singles is a virtual collection derived from tracks not owned by a canonical Album.

Current canonical Album set:

- Neon Heartbreaks;
- Coal to Diamond;
- Love Letters from Saigon.

Build 40 Studio Album management reads private canonical manifests through Track Manager and artwork previews from the public Worker v2.7 Album projection. `accent` and `accent2` remain canonical Album manifest fields; Studio presents them as Primary / Secondary colors, and LaunchPAD Build 90 uses them only as a scoped Album-detail theme.

### C3-B Album/Project rule

Build 42 reads those same protected canonical Album manifests for intelligence. Ordered `album.trackIds` remains authoritative and is never rewritten by the Intelligence view.

A C3-B proposed sequence is advisory only. It carries each track's original canonical index and exposes no automatic apply/save-order operation.

## Canonical Lyrics contract

This rule is non-negotiable:

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export/compatibility only
```

A missing `.lrc` does not mean lyrics are unsynchronized. An optional `.lrc` can never become a second source of truth.

The embedded and standalone LRC Maker modes use the same synchronization engine. Studio passes minimal `trackId` context; protected audio and lyrics are loaded through Track Manager.

Canonical save remains guarded by stale revisions/ETags, strict timestamp/UTF-8 validation, Track Manager write authority, canonical reread and compensating rollback where required.

## SonicTrace C3-A contract

The old `/api/studio/analyze` path could abort before Neural / embedding / structure when the V2-A loudnorm parser did not find a JSON measurement block.

C3-A changes the failure boundary without changing schema or persistence:

- loudnorm JSON parsing is robust to FFmpeg output spacing/order;
- a real FFmpeg EBU R128 measurement is used as fallback;
- if mastering measurement is still unavailable, it is returned as an explicit unavailable sub-layer instead of terminating the endpoint;
- Neural, 512D embedding, structure and optional stems/fusion can continue;
- Studio distinguishes a responding coordinator with PARTIAL layers from an unreachable coordinator;
- Browser-DSP-only fallbacks are labeled Deep Audio `UNAVAILABLE`;
- missing mastering metrics display `—`, never fabricated zeroes.

Persistence remains:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Track Manager remains the only protected write authority.

### C3-A acceptance

Real-user acceptance passed on 2026-08-11 using **Stick to You** after updating/restarting the local Build 06 coordinator. The unsaved review reported:

```text
Profile          FULL
DSP              ready
MASTERING        ready
NEURAL           ready
EMBEDDING        ready
STRUCTURE        ready
SEMANTICSUMMARY  ready
LUFS             -13.7
True peak        -0.8 dBTP
Browser RMS      -15.8 dBFS
Sections         9
```

Post-pass checkpoint on Studio and SonicTrace:

```text
safety/c3-a-real-user-pass-20260811-1900
```

## C3-B canonical intelligence contract

Build 42 uses three protected read sources:

1. canonical persisted SonicTrace sidecars through Track Manager;
2. canonical Track metadata for optional BPM/key/energy enrichment;
3. canonical Album manifests through Track Manager.

Only finite 512D embeddings participate in map/similarity calculations.

The 2D map is deterministic for the same canonical embedding set and is recalculated in Studio. The standalone SonicTrace IndexedDB catalog is not a production authority and is not read by the C3-B engine.

C3-B surfaces:

- nearest-neighbor cosine proximity;
- deterministic 2D map;
- acoustic zones;
- separate Neural sonic families;
- redundant/very-close pairs;
- catalog outliers;
- cross-zone bridge candidates;
- Album embedding coverage;
- mean Album/project coherence;
- project outliers;
- project bridge candidate;
- advisory continuity sequence.

Missing data degrades honestly:

- no valid embedding -> no map/similarity claim for that track;
- partial Album coverage -> explicit coverage warning;
- Track metadata unavailable -> sequencing falls back to embedding/Neural evidence;
- Album read unavailable -> project intelligence unavailable without inventing an Album;
- SonicTrace sidecar read unavailable -> Intelligence reports the protected-read error.

Build 42 adds no R2 write and no Track Manager mutation call to the Intelligence surface.

## C3 Album UX corrective

Builds 39–40 remove completed migration clutter and make Album identity/palette understandable without changing the canonical contract:

```text
Albums / Projects
  -> cover-first canonical library
  -> one selected Album at a time
      -> Overview
         -> Album palette
            -> Primary color
            -> Secondary color
      -> Tracklist
      -> Assets

System
  -> Album migration archive · C2.5 complete
     (collapsed by default)
```

Ordered `album.trackIds` remains the only canonical membership/artistic-order authority. Metadata, membership, move and asset mutations use the same guarded Track Manager APIs as C2.5-D. Whole-Album deletion remains unavailable.

## C3 Track Create capability hotfix

Build 41 corrects a real-user New Track failure without changing the write transaction itself. Track Manager's capability contract is additive: Track creation still requires `track-create`, asset writes require `assets`, catalog rebuild requires `catalog-rebuild`, while unrelated current/future capabilities no longer invalidate a healthy backend.

No Track Manager, Worker, R2 or schema change was part of that hotfix.

## Completed architecture phases

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC integration ✅ real-user validated
- PHASE UX C2.5-A → F ✅ real-user validated
- PHASE UX C3-A ✅ real-user validated
- PHASE UX C3-B 🧪 Build 42 candidate / smoke pending
- PHASE UX C3-C 🔒 waits for C3-B acceptance

See [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md) for the current roadmap and later Phase 8–10 plan.

## Public Worker / C2.5-F deployment note

The public v2.7 deploy succeeded during workflow `31485890830`, producing Worker Version ID:

```text
ddd90621-35d4-44b0-9c22-4e5a72291d9b
```

A later read-only live probe confirmed:

```text
/health  -> v2.7 / canonical-r2 / 3 Albums
/tracks  -> canonical-r2
/albums  -> 3 Albums / canonical-r2
```

LaunchPAD Build 90 is frontend-only relative to that Worker and consumes canonical Album palette metadata without changing Worker authority.

## Security rules

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- JSON-like cross-origin mutation controls use the established CORS-simple transport where required;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin track-write route is introduced;
- standalone Track Manager remains fallback;
- Shadow DOM isolation is presentation isolation, not a security boundary;
- C3-B Intelligence imports no Album mutation API and uses no standalone IndexedDB authority.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

## Safety / rollback

C3-B pre-work checkpoint:

```text
safety/pre-c3-b-v2e-parity-20260811-1910
```

C3-A real-user pass checkpoint (Studio + SonicTrace):

```text
safety/c3-a-real-user-pass-20260811-1900
```

Build 41 New Track capability checkpoints:

```text
safety/pre-build41-track-create-capability-20260811-1801
safety/post-build41-real-user-pass-20260811-1833
```

C3 Album UX checkpoint:

```text
safety/pre-c3-ux-albums-20260811-1530
```

C3 pre-work checkpoint:

```text
safety/pre-c3-deep-audio-20260811-1426
```

C2.5 closeout checkpoint remains:

```text
safety/phase-ux-c2-5-complete-20260811-1356
```

Older validated Phase 6 checkpoints remain historical rollback anchors.

## Verification policy

Real-user smoke remains authoritative for user-facing milestone acceptance. CI is necessary but not sufficient.

Build 42 adds a dedicated C3-B regression guard proving deterministic projection/zone identity, Neural-family separation, catalog insight behavior and preservation of canonical Album `trackIds` during project sequencing.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.
