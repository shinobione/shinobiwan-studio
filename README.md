# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Release:** `0.9.2`
**Build:** `17`
**Milestone:** Roadmap Phase 6 — embedded Lyrics Studio workflow complete + runtime hotfix
**Stop line:** Do not begin Phase 7 without explicit authorization.

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the SHINOBIWAN toolchain.

Core rules:

- `trackId = R2 manifest slug`;
- LaunchPAD stays the public product;
- R2 stays the catalog/media source of truth;
- Track Manager stays the protected catalog/admin backend and legacy fallback;
- SonicTrace stays the audio-intelligence engine;
- LRC Maker stays the advanced lyrics editing/synchronization engine;
- Studio degrades safely to public read-only behavior when private Track Manager access is unavailable.

## Roadmap Phase 6 status

Build 16 completed the Phase 6C product criterion rather than treating navigation to a separate LRC Maker page as the primary workflow. Build 17 is a runtime-only consumer hotfix that points Studio at the browser-safe LRC Maker 6.3.1 embedded bundle and cache-busts the previous 6.3.0 asset.

> A canonical track opens its real LRC Maker synchronization engine directly inside the Studio Lyrics workspace, with protected audio and `lyrics.txt` already contextualized, guarded save through Track Manager, and immediate canonical refresh after save.

Implemented:

- the real LRC Maker `Synchronizer` is exposed as the `shinobiwan-lyrics-studio` Web Component;
- Shadow DOM isolates LRC Maker styling from the Studio shell;
- the right-hand Track Workspace > Lyrics panel mounts that engine directly;
- no iframe and no copied/reimplemented synchronization engine;
- only canonical `trackId` is passed by Studio; no audio/blob/lyrics payload is put in a URL;
- protected canonical audio and `lyrics.txt` loading through Track Manager v5.15 / bridge v1.7;
- strict track-bound timestamp validation;
- manifest revision + lyrics ETag stale protection;
- UTF-8 `lyrics.txt` write through Track Manager only;
- catalog rebuild, canonical reread and rollback remain backend-authoritative;
- automatic Studio refresh after embedded save;
- timestamps inside `lyrics.txt` remain the only “Synced Lyrics” signal;
- optional `.lrc` export stays outside persistence and Content Health;
- standalone LRC Maker remains available as a secondary fallback.

LRC Maker `6.3.1` produces the stable embedded asset at `build/embed/lyrics-studio.js`. Its embed build now inlines the React production environment and rejects residual browser-unsafe `process.env` references after build. Studio Build 17 lazy-loads that asset with a `6.3.1` cache key from the deployed LRC Maker GitHub Pages project.

See [`docs/PHASE-6-LYRICS-COMPLETE.md`](docs/PHASE-6-LYRICS-COMPLETE.md).

## Roadmap Phase 5 status

Build 14 closes the Phase 5 criterion:

> A track can be analyzed from Studio and durably recover its SonicTrace profile in its workspace.

Implemented:

- canonical `SonicTraceAnalysis` schema v1;
- canonical R2 source revision/ETag fingerprint;
- one-upload SonicTrace coordinator endpoint;
- Browser DSP retained when the Deep Audio node is offline;
- explicit review before save;
- guarded `latest.json` + append-only history persistence;
- no retained/copy WAV in SonicTrace persistence;
- re-scan and outdated detection;
- 512D CLAP embedding index;
- cross-track similarity and deterministic clusters;
- analysis/master source-version history and comparison;
- partial-layer warnings without breaking the Studio workspace.

See [`docs/PHASE-5-SONICTRACE-COMPLETE.md`](docs/PHASE-5-SONICTRACE-COMPLETE.md).

## Roadmap Phase 4 status (preserved)

Build 13 closes the roadmap criterion:

> Principal Track Manager operations are achievable from the Studio workspace.

The complete Studio Phase 4 surface is:

- private-first unified catalog read with public fallback;
- Track Workspace;
- canonical draft track creation;
- metadata validation + guarded save;
- canonical lyrics read + ETag + validation + guarded save;
- `lyrics.txt` upload when missing;
- audio upload / replace / delete asset;
- cover upload / replace / delete asset;
- thumbnail upload / replace / delete asset;
- video/Canvas upload / replace / delete asset;
- upload progress;
- stale-manifest protection;
- published-track quality protection;
- explicit destructive confirmations;
- explicit canonical catalog rebuild;
- canonical reread verification after writes;
- old Track Manager retained as protected fallback.

Whole-track deletion is intentionally not exposed because the roadmap requires delete/replace **asset**, not deletion of the canonical track itself.

See [`docs/PHASE-4-COMPLETE.md`](docs/PHASE-4-COMPLETE.md).

## Deployed backend dependency

The current Lyrics workflow consumes the production-deployed private backend:

```text
Track Manager       v5.15
Studio bridge       v1.7
deployment target   admin
Cloudflare Access   protected
public Worker       unchanged
```

The protected backend keeps canonical lyrics context, validation, stale protection, save, catalog update when required, canonical reread and rollback behind specialized routes. Build 17 does not require another Worker deployment.

Public LaunchPAD remains a separate surface and is not modified by this Phase 6C hotfix.

## Studio operations

### Create track

Catalog exposes **Create canonical draft**.

Creation:

- requires PRIVATE READ and the current protected bridge;
- requires canonical lower-case kebab-case trackId;
- rejects duplicates;
- always starts as `draft`;
- writes manifest only, then rebuilds catalog;
- verifies the canonical draft reread;
- navigates to Assets so media can be attached separately.

### Metadata

Metadata keeps the production-proven flow:

```text
Edit -> Validate -> Review -> Save -> confirm -> backend guard -> catalog rebuild -> canonical reread
```

The real `soft-addiction` smoke write and restoration remain documented:

- temporary revision `2026-08-08T16:21:15.503Z`;
- restored revision `2026-08-08T16:22:10.890Z`;
- final quality `ready`, publishable `Yes`, errors/warnings `0 / 0`;
- media untouched.

### Lyrics

Canonical rule:

```text
tracks/<slug>/lyrics.txt = source of truth
timestamps inside lyrics.txt = synchronized
.lrc = optional compatibility/export only
```

The Lyrics workspace has two paths sharing the same canonical contract:

1. **embedded Lyrics Studio** — the primary Build 17 workflow using LRC Maker 6.3.1's real synchronizer inside the right-hand workspace panel;
2. **standalone LRC Maker** — retained as an advanced recovery/fallback path.

Both use the same protected Track Manager context/write authority. Neither creates a second lyrics source of truth.

### Assets

Assets Manager supports exactly:

```text
audio
cover
thumbnail
lyrics
video
```

Each operation processes one asset kind only.

Upload/replace:

- uses multipart FormData with no custom request header;
- exposes XHR upload progress;
- requires `expectedUpdatedAt`;
- reuses Track Manager extension/size validation;
- temporarily backs up the previous R2 object outside the canonical track prefix;
- updates manifest + catalog;
- performs backend verification + Studio canonical reread;
- performs compensating rollback on failure.

Delete asset:

- requires explicit confirmation;
- requires canonical revision;
- blocks destructive changes that make a published track non-publishable;
- backs up before deletion;
- updates and verifies manifest/catalog;
- compensates on failure.

### Catalog rebuild

Administration exposes an explicit standalone canonical catalog rebuild.

It:

- requires a user confirmation;
- sends `confirm: REBUILD` to Track Manager;
- rebuilds only `catalog/index.json` from current manifests;
- performs a private catalog reread verification;
- does not mutate track metadata or media.

## Security

- Cloudflare Access remains mandatory;
- exact Studio origin remains `https://shinobione.github.io`;
- no Access/R2 secret is shipped to GitHub Pages;
- no wildcard credentialed CORS;
- JSON mutation controls use CORS-simple `text/plain;charset=UTF-8`;
- asset uploads use browser multipart FormData without custom headers;
- no PUT/PATCH/DELETE client is introduced;
- no generic legacy `saveTrack()` route is opened cross-origin;
- no whole-track delete route is exposed;
- standalone Track Manager remains the fallback;
- the embedded LRC Maker engine receives only `trackId` from Studio and fetches canonical data through the existing protected bridge;
- Shadow DOM is used for UI isolation, not as a security boundary;
- no iframe is used for Phase 6C.

## Safety / rollback

Current Phase 6C pre-patch checkpoints:

```text
Studio:    safety/pre-phase6-embedded-lyrics-20260809-0147
LRC Maker: safety/pre-phase6-embedded-lyrics-20260809-0147
```

Earlier Phase 4/5 safety branches remain untouched.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

## Verification policy

The current code is protected by:

- Track Manager source guards;
- protected admin-only backend deployment and Cloudflare Access verification;
- Studio build-time integration guards;
- Phase 5 algorithm guards;
- Phase 6 embedded-engine regression guards, including the required LRC Maker `6.3.1` cache key;
- LRC Maker format/lint/context guards;
- LRC Maker post-build embedded runtime guard rejecting residual `process.env` references;
- TypeScript;
- Vite production builds;
- capability gating;
- stale checks;
- rollback contracts;
- explicit confirmations.

We do **not** replace or delete a production WAV/cover merely to manufacture a smoke test. A deliberately disposable draft can be used later if deeper destructive-media smoke testing is desired.

## Phase 7 stop line

**STOP after Build 17.**

Do not begin any Phase 7 item.

Wait for new user instructions after the deployed embedded Lyrics Studio smoke test.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run check:phase5
npm run check:phase6
npm run typecheck
npm run build
```

`npm run build` runs the integration regression guards before TypeScript/Vite.

## Production URL

```text
https://shinobione.github.io/shinobiwan-studio/
```

## Versioning discipline

Every Studio release updates together:

1. `package.json`;
2. `src/release.ts`;
3. visible version/build/phase copy;
4. `CHANGELOG.md`;
5. README and affected docs;
6. security/integration regression guards;
7. PR dependency and rollback notes.

Source merge, web deployment, Worker deployment and R2/catalog mutation remain separate facts.
