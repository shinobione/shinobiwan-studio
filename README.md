# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Release candidate:** `0.7.0`  
**Build:** `13`  
**Milestone:** Roadmap Phase 4 — Track Manager integration complete  
**Stop line:** Phase 5 is not started.

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

## Roadmap Phase 4 status

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

## Backend dependency

Build 13 requires:

```text
Track Manager v5.13
Studio bridge v1.5
```

Source is merged in LaunchPAD at:

```text
df75509d89b1ed1477d4b249fab63a6bd41db311
```

The final Studio PR must not merge until the protected **admin-only** Worker deployment of that exact source has succeeded and its real Cloudflare Version ID/run have been recorded in this documentation.

Public LaunchPAD remains unchanged:

```text
Build 2026.08.08.66
release studio-metadata-validation-20260808
public Worker v2.6
```

## Bridge v1.5 capability contract

```json
{
  "read": ["tracks", "track", "lyrics"],
  "validate": ["metadata", "lyrics"],
  "write": ["metadata", "lyrics"],
  "manage": ["track-create", "assets", "catalog-rebuild"]
}
```

`manage` is separate from the narrower metadata/lyrics write family.

## Studio operations

### Create track

Catalog exposes **Create canonical draft**.

Creation:

- requires PRIVATE READ / bridge v1.5;
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

Existing lyrics use manifest revision + R2 ETag concurrency. Missing lyrics can be created by uploading a `.txt` file through Assets Manager. LRC Maker remains unchanged.

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

Administration exposes an explicit standalone catalog rebuild.

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
- every management call verifies the bridge `manage` capability first;
- standalone Track Manager remains the fallback.

## Safety / rollback

Current relevant checkpoints:

```text
Studio:    safety/pre-phase4-final-ui-20260808-2025
LaunchPAD: safety/pre-v5.13-phase4-ops-20260808-1948
Both:      safety/post-v5.12-pre-phase4-complete-20260808-1945
Both:      safety/post-metadata-write-proven-20260808-1822
```

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

## Verification policy

The final management code is protected by:

- Track Manager source guards;
- assembled Worker syntax checks;
- generated bundle verification;
- Wrangler dry-run;
- LaunchPAD regression CI;
- Studio build-time integration guards;
- TypeScript;
- Vite build;
- capability gating;
- stale checks;
- rollback contracts;
- explicit confirmations.

We do **not** replace or delete a production WAV/cover merely to manufacture a smoke test. A deliberately disposable draft can be used later if deeper destructive-media smoke testing is desired.

## Phase 5 stop line

**STOP after Build 13.**

Do not begin:

- SonicTrace result persistence;
- embeddings/fingerprints;
- Catalog Intelligence;
- similarity / duplicates;
- outdated-analysis engine;
- any other Phase 5 item.

Wait for new user instructions.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run typecheck
npm run build
```

`npm run build` runs the integration regression guard before TypeScript/Vite.

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
