# SHINOBIWAN Studio — Roadmap Phase 4 Complete

Date: 2026-08-08  
Studio release: `0.7.0` / Build `13` / `phase4-track-manager-complete`  
Backend: Track Manager `v5.13` / Studio bridge `v1.5`  
Public LaunchPAD: Build `2026.08.08.66` / public Worker `v2.6` unchanged

## Production backend proof

```text
Track Manager       v5.13
Studio bridge       v1.5
source SHA          df75509d89b1ed1477d4b249fab63a6bd41db311
workflow run        31272655808
deployment target   admin
Worker Version ID   781f75f9-776c-4e39-90a7-5cdf34854599
Access verification protected / HTTP 302 unauthenticated
public Worker       deploy/record/verify skipped
```

The protected deployment completed Worker source validation, bridge guards, Wrangler dry-run, private Worker upload and Access verification before the final Studio release. Deploying the Worker itself did not rebuild the catalog or mutate R2 media.

## Roadmap criterion

The Phase 4 completion criterion from `SHINOBIWAN_STUDIO_ROADMAP.txt` is:

> Principal Track Manager operations are achievable from the Studio workspace.

Build 13 closes that criterion without merging the legacy Track Manager UI into Studio and without weakening Cloudflare Access.

## Completed Phase 4 operations

### Catalog / create

- create a canonical track from Studio Catalog;
- canonical `trackId` is the R2 slug;
- duplicate slugs are rejected;
- creation always starts as `draft`;
- creation writes the manifest, rebuilds the catalog and verifies a canonical reread;
- media is attached later from the new Track Workspace rather than hidden inside creation.

### Manifest / metadata

- edit the approved metadata whitelist;
- validate before save;
- stale-manifest protection with `expectedUpdatedAt`;
- quality checks before published-state persistence;
- explicit confirmation before production save;
- manifest + catalog compensation on publication failure;
- second Studio canonical reread after backend success.

Metadata save is production-smoke-proven and was restored cleanly on `soft-addiction`.

### Lyrics

- canonical source is `tracks/<slug>/lyrics.txt`;
- timestamps inside TXT define synchronized state;
- `.lrc` remains optional compatibility/export only;
- read canonical lyrics + R2 ETag;
- validate against both manifest revision and lyrics ETag;
- save existing canonical lyrics with explicit confirmation;
- upload/create a missing canonical lyrics TXT through Assets Manager;
- backend lyrics/manifest/catalog rollback on failure;
- Studio canonical reread after save.

LRC Maker remains the advanced timing editor and is not modified by Phase 4.

### Assets Manager

Supported canonical kinds:

```text
audio
cover
thumbnail
lyrics
video
```

Studio supports:

- initial upload;
- replace;
- upload progress;
- delete individual asset;
- destructive confirmation;
- canonical manifest revision guard;
- existing Track Manager extension/size validation;
- R2 rollback backup during replace/delete;
- quality protection for published tracks;
- manifest + catalog update;
- backend verification;
- Studio canonical reread.

A whole-track delete route is deliberately not exposed. The Phase 4 roadmap requires delete/replace **asset**, and the standalone Track Manager remains the fallback for legacy operations outside the frozen Studio scope.

### Catalog publication

- metadata, lyrics and asset changes rebuild the canonical catalog through the protected backend;
- Administration exposes an explicit standalone catalog rebuild;
- standalone rebuild requires an explicit user confirmation in Studio and `confirm: REBUILD` at the Worker contract;
- the rebuild endpoint has no hidden track/media mutation.

### Fallback

The existing Track Manager remains linked from Administration and can still be used as the protected full legacy fallback.

## Backend capability contract

Track Manager v5.13 / bridge v1.5 advertises:

```json
{
  "read": ["tracks", "track", "lyrics"],
  "validate": ["metadata", "lyrics"],
  "write": ["metadata", "lyrics"],
  "manage": ["track-create", "assets", "catalog-rebuild"]
}
```

The `manage` family stays separate from the narrower metadata/lyrics `write` family.

## Security boundary

- Cloudflare Access remains mandatory;
- exact Studio origin remains `https://shinobione.github.io`;
- no wildcard credentialed CORS;
- no Cloudflare Access or R2 secret is shipped to GitHub Pages;
- JSON control POSTs use CORS-simple `text/plain;charset=UTF-8`;
- asset upload uses browser-generated multipart FormData without custom request headers;
- every operation checks the deployed capability before sending a mutation;
- unrelated legacy Track Manager writes still require same-origin;
- no generic legacy `saveTrack()` route is opened cross-origin;
- no whole-track delete is opened cross-origin.

## Rollback references

Most relevant checkpoints:

```text
Studio:    safety/pre-phase4-final-ui-20260808-2025
LaunchPAD: safety/pre-v5.13-phase4-ops-20260808-1948
Both:      safety/post-v5.12-pre-phase4-complete-20260808-1945
Both:      safety/post-metadata-write-proven-20260808-1822
```

## Verification policy

Metadata write has a real reversible production smoke proof.

The final asset/create management paths are covered by source guards, Track Manager bundle assembly, Wrangler dry-run, protected admin-only deployment, Access verification, capability gating, stale checks, quality checks, transaction compensation and explicit UI confirmations. Phase 4 completion does **not** justify replacing or deleting an existing production WAV/cover merely to manufacture a smoke-test badge.

A future intentionally supplied disposable draft can be used for deeper destructive/media smoke testing without risking catalog assets.

## Phase 5 stop line

**STOP.**

Phase 5 — SonicTrace / Catalog Intelligence — is not started by Build 13.

No embedding persistence, SonicTrace analysis storage, fingerprinting, catalog intelligence, similarity, duplicate detection or outdated-analysis engine is introduced here.

Wait for new user instructions before any Phase 5 work.
