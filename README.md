# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current PHASE UX release line

```text
Studio          v0.13.0 · Build 38
Codename        phase-ux-c3-deep-audio-resilience

LaunchPAD       2026.08.11.89
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

SonicTrace      V2-E Build 06
Deep Audio      2.0.1-alpha

LRC Maker       6.3.8
```

C2.5 remains the last fully real-user-validated milestone. Build 38 / SonicTrace Build 06 is the C3-A candidate and must still pass the local-GPU real-user smoke before C3-A is accepted.

Historical implementation details remain in milestone-specific docs/changelogs and Git history.

## Current milestone

**PHASE UX C2.5-A → C2.5-F is COMPLETE and real-user validated.**

The final C2.5-F smoke passed on desktop and mobile on 2026-08-11. LaunchPAD Build 89 displays the three canonical R2 Albums plus virtual Singles through public Worker v2.7.

**C3 — SonicTrace Deep Audio / V2-E parity is now STARTED.**

C3-A focuses on the real-user `FFmpeg loudnorm did not return a measurement block` failure and truthful `FULL / PARTIAL / UNAVAILABLE / OUTDATED` Studio semantics. C3-B remains the V2-E parity layer after C3-A real-user validation.

See:

- [`docs/PHASE-UX-C2-5-CLOSEOUT.md`](docs/PHASE-UX-C2-5-CLOSEOUT.md)
- [`docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md`](docs/PHASE-UX-C3-DEEP-AUDIO-RESILIENCE.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`CHANGELOG-C2-5-CLOSEOUT.md`](CHANGELOG-C2-5-CLOSEOUT.md)
- [`CHANGELOG-C3-BUILD38.md`](CHANGELOG-C3-BUILD38.md)

## Important roadmap status

PHASE UX is **not finished yet**.

Current permitted milestone:

**C3 — SonicTrace Deep Audio / V2-E parity.**

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

Track Manager remains the only protected write authority. The C3 release itself performs no R2 write.

## Completed architecture phases

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC integration ✅ real-user validated
- PHASE UX C2.5-A → F ✅ real-user validated
- PHASE UX C3 ⏳ in progress

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

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.

Source merge, web deployment, local Deep Audio runtime, Worker deployment and R2/catalog mutation are separate facts and must remain separately auditable.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run check:phase5
npm run check:phase6
npm run check:c3
npm run check:ux
npm run typecheck
npm run build
```

## Production URL

```text
https://shinobione.github.io/shinobiwan-studio/
```

## Versioning discipline

A real Studio runtime release updates together:

1. `package.json`;
2. `src/release.ts`;
3. visible version/build/codename copy;
4. changelog + affected docs;
5. README;
6. security/integration regression guards;
7. PR dependency and rollback notes.

Documentation-only milestone closeouts do **not** fabricate a runtime build/version bump.
