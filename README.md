# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current PHASE UX release line

```text
Studio          v0.13.3 · Build 41
Codename        phase-ux-c3-track-create-capability-hotfix

LaunchPAD       2026.08.11.90
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha

LRC Maker       6.3.8
```

The current runtime line is real-user validated through C3-A: focused Album UX/palette, Build 41 New Track compatibility and the local-GPU Deep Audio integration smoke have all passed. C3-B Studio V2-E parity is the next active slice; C3-C premium interaction polish remains after it.

Historical implementation details remain in milestone-specific docs/changelogs and Git history.

## Current milestone

**PHASE UX C2.5-A → C2.5-F is COMPLETE and real-user validated.**

The final C2.5-F smoke passed on desktop and mobile on 2026-08-11. LaunchPAD Build 89 established the validated canonical Album baseline with three canonical R2 Albums plus virtual Singles through public Worker v2.7.

**C3-A — SonicTrace Deep Audio resilience is COMPLETE — REAL USER PASS.**

After updating/restarting SonicTrace `V2-E · BUILD 06`, Studio ran a canonical-audio scan for **Stick to You** and produced an unsaved truthful **FULL** profile with DSP, mastering, Neural, finite 512D embedding, structure and semantic summary ready. The smoke did not write the new draft to R2.

The focused Album UX/palette corrective and Build 41 New Track capability hotfix are also real-user validated. The next active milestone is **C3-B — Studio V2-E parity**.

See:

- [`docs/PHASE-UX-C2-5-CLOSEOUT.md`](docs/PHASE-UX-C2-5-CLOSEOUT.md)
- [`docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md`](docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md)
- [`docs/PHASE-UX-C3-ALBUMS-FOCUSED-WORKSPACE.md`](docs/PHASE-UX-C3-ALBUMS-FOCUSED-WORKSPACE.md)
- [`docs/PHASE-UX-C3-TRACK-CREATE-CAPABILITY-HOTFIX.md`](docs/PHASE-UX-C3-TRACK-CREATE-CAPABILITY-HOTFIX.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`CHANGELOG-C2-5-CLOSEOUT.md`](CHANGELOG-C2-5-CLOSEOUT.md)
- [`CHANGELOG-C3-BUILD38.md`](CHANGELOG-C3-BUILD38.md)
- [`CHANGELOG-C3-BUILD39.md`](CHANGELOG-C3-BUILD39.md)
- [`CHANGELOG-C3-BUILD40.md`](CHANGELOG-C3-BUILD40.md)
- [`CHANGELOG-C3-BUILD41.md`](CHANGELOG-C3-BUILD41.md)

## Important roadmap status

PHASE UX is **not finished yet**.

Current permitted milestone:

**C3-B — Studio V2-E parity.**

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

LaunchPAD currently exposes 30 public tracks and three canonical Albums; Singles is virtual.

Build 40 Studio Album management reads private canonical manifests through Track Manager and artwork previews from the already validated public Worker v2.7 `/albums` projection. `accent` and `accent2` remain canonical Album manifest fields; Studio presents them as Primary / Secondary colors, and LaunchPAD Build 90 uses them only as a scoped Album-detail theme. Public artwork or palette failure never authorizes a direct Studio R2 write path.

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

The exact historical file that originally produced the loudnorm measurement-block error could not be reliably reidentified. The degraded path is independently protected by SonicTrace regression coverage for loudnorm parsing/fallback/unavailable shape and for retaining Neural + 512D embedding + structure when mastering loudness is unavailable.

The Studio `Engine diagnostics` card shows the already-saved durable `latest` profile, not the current unsaved review draft. An older engine string there during `REVIEW / NOT SAVED` is therefore not the current draft's engine identity.

Post-pass checkpoint on Studio and SonicTrace:

```text
safety/c3-a-real-user-pass-20260811-1900
```

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

Build 41 corrects a real-user New Track failure without changing the write transaction itself. The old Phase 4 client required Track Manager's `manage` capability list to contain *only* `track-create`, `assets` and `catalog-rebuild`. Track Manager v5.19 / bridge v1.11 correctly advertises those plus the later C2.5 Album capabilities, so the exact-list guard rejected a healthy backend before `POST /api/studio/tracks/create` was sent.

Build 41 now uses operation-specific capability checks:

- Track creation still requires `track-create`;
- asset writes still require `assets`;
- catalog rebuild still requires `catalog-rebuild`;
- additional current/future capabilities do not invalidate compatibility;
- missing required capability still blocks the write;
- no Track Manager, Worker, R2 or schema change is part of the hotfix.

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
- PHASE UX C3-B ⏭ next

See [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md) for the current roadmap and later Phase 8–10 plan.

## C2.5 summary

### C2.5-A
LaunchPAD Albums scalability, mobile/player/Android/PWA hardening and Build 87 touch baseline.

### C2.5-B
Canonical R2 Album read model and projection contract.

### C2.5-C
Protected Track Manager Album create/edit/membership/order/assets with stale protection and transactional rollback.

### C2.5-D
Studio Album Management + New Track canonical Album binding. Unknown Albums block Review; draft creation remains explicit; Singles is safe fallback.

### C2.5-E
Controlled migration of the three legacy Albums to canonical R2 with dry-run, state fingerprints, one-Album apply and rollback. Singles transitioned to virtual semantics.

### C2.5-F
LaunchPAD Build 89 canonical public cutover through Worker v2.7, followed by desktop + mobile real-user validation.

## Public Worker / C2.5-F deployment note

The public v2.7 deploy succeeded during workflow `31485890830`, producing Worker Version ID:

```text
ddd90621-35d4-44b0-9c22-4e5a72291d9b
```

That workflow initially displayed failure because the post-deploy verifier observed an older Cloudflare edge response during a roughly 20-second convergence window. A later read-only live probe confirmed:

```text
/health  -> v2.7 / canonical-r2 / 3 Albums
/tracks  -> 30 tracks / 3 Albums / canonical-r2
/albums  -> 3 Albums / canonical-r2
```

LaunchPAD PR #207 hardened only the deployment verifier; it did not change Worker runtime behavior or R2 data. No second Worker deploy was required.

## Security rules

- Cloudflare Access remains mandatory for the private bridge;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- JSON-like cross-origin mutation controls use the established CORS-simple transport where required;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin track-write route is introduced;
- standalone Track Manager remains fallback;
- Shadow DOM isolation is presentation isolation, not a security boundary.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

## Safety / rollback

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

created on Studio and SonicTrace before C3 source changes.

C2.5 closeout checkpoint remains:

```text
safety/phase-ux-c2-5-complete-20260811-1356
```

Older validated Phase 6 checkpoints remain historical rollback anchors.

## Verification policy

Real-user smoke remains authoritative for user-facing milestone acceptance. CI is necessary but not sufficient.

Build 41 adds a dedicated regression guard proving that the exact current Track Manager manage-capability set — including all six `album-*` capabilities — remains compatible with Track Create, while a missing required capability still blocks the write.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.
