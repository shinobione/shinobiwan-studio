# SHINOBIWAN Studio

Artist Content & Intelligence Manager — private orchestration cockpit for the SHINOBIWAN toolchain.

## Current production state

```text
Studio          v0.12.2 · Build 37
Codename        phase-ux-c2-5-e3-migration-diagnostics
Runtime SHA     e449c19968c7faff548c8bf32332b4f0848c41a9

LaunchPAD       2026.08.11.89
LaunchPAD main  c128113638dde45e845393eff9bf931d92567adb
Public Worker   v2.7
Worker Version  ddd90621-35d4-44b0-9c22-4e5a72291d9b

Track Manager   v5.19
Studio bridge   v1.11

SonicTrace      V2-E Build 05
SonicTrace main 513ccf28caf46b34a316f818bb3a52ef2546d499

LRC Maker       6.3.8
LRC Maker main  46c724779cefe20519e1191da4a398210c2c7242
```

This README reflects the current runtime truth. Historical implementation details remain in milestone-specific docs/changelogs and Git history.

## Current milestone

**PHASE UX C2.5-A → C2.5-F is COMPLETE and real-user validated.**

The final C2.5-F smoke passed on desktop and mobile on 2026-08-11. LaunchPAD Build 89 displays the three canonical R2 Albums plus virtual Singles through public Worker v2.7.

See:

- [`docs/PHASE-UX-C2-5-CLOSEOUT.md`](docs/PHASE-UX-C2-5-CLOSEOUT.md)
- [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- [`CHANGELOG-C2-5-CLOSEOUT.md`](CHANGELOG-C2-5-CLOSEOUT.md)

## Important roadmap status

PHASE UX is **not finished yet**.

Next permitted milestone:

**C3 — SonicTrace Deep Audio / V2-E parity** — **NOT STARTED** at the C2.5 closeout.

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

## Completed architecture phases

- Phase 0 — Architecture freeze / data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Unified catalog read ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC integration ✅ real-user validated
- PHASE UX C2.5-A → F ✅ real-user validated

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

Latest C2.5 closeout checkpoint:

```text
safety/phase-ux-c2-5-complete-20260811-1356
```

created on both Studio and LaunchPAD before documentation closeout work.

Older validated Phase 6 checkpoints remain historical rollback anchors and are not replaced by this documentation checkpoint.

## Verification policy

Real-user smoke remains authoritative for user-facing milestone acceptance. CI is necessary but not sufficient.

Do not mutate production WAV/cover/lyrics/Album objects merely to manufacture a frontend smoke test.

Source merge, web deployment, Worker deployment and R2/catalog mutation are separate facts and must remain separately auditable.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run check:phase5
npm run check:phase6
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