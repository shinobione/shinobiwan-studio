# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.4.0`  
**Build:** `5`  
**Current milestone:** Phase 4A — authenticated Track Manager private reads + safe public fallback

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the existing music-tool ecosystem. It does **not** replace the underlying products by copying their code into one monolith.

Architecture rules:

- one canonical track identity: `trackId = R2 manifest slug`;
- LaunchPAD remains the public product;
- R2 remains the catalog/media source of truth;
- Track Manager remains the protected catalog/admin backend and write fallback;
- SonicTrace remains the audio-intelligence engine;
- LRC Maker remains the lyrics editing/synchronization engine during migration;
- Studio must remain usable when the optional local SonicTrace GPU node is offline or when the private Track Manager read session is unavailable.

## Current scope

Implemented:

- GitHub Pages shell;
- LaunchPAD public catalog read layer;
- Track Manager v5.8 authenticated **GET-only** Studio bridge support;
- private-first catalog reads with automatic public fallback;
- private canonical drafts/status/quality visibility when Cloudflare Access is usable from the browser;
- public media/lyrics URL reuse for already-published tracks;
- search, filters and sorting;
- `#/track/<trackId>` Track Workspace;
- Overview, Audio Intelligence, Lyrics, Assets, Versions, Metadata and Publishing sections;
- deterministic Content Health;
- timestamp-aware synchronized lyrics semantics;
- explicit read provenance (`PRIVATE READ` / `PUBLIC FALLBACK`);
- build-time regression guard forbidding Studio Phase 4A write plumbing.

Studio production writes remain locked. Build 5 adds **no** POST/PUT/PATCH/DELETE wrapper.

## Phase 4A private read architecture

LaunchPAD Build 65 / Track Manager v5.8 exposes an additive bridge behind Cloudflare Access:

```text
OPTIONS /api/studio/*
GET     /api/studio/health
GET     /api/studio/tracks
GET     /api/studio/tracks/<trackId>
```

Browser origin allowlist:

```text
https://shinobione.github.io
```

Studio calls these routes with browser credentials and never stores a Cloudflare secret or service token.

Read strategy:

```text
Studio
  |
  +--> Track Manager private GET bridge
  |      |
  |      +--> canonical manifests / drafts / quality
  |
  +--> LaunchPAD public Worker
         |
         +--> published media URLs / public lyrics / safe fallback
```

If the private request cannot use a valid Cloudflare Access session, Studio does **not** weaken authentication or CORS. It automatically continues with the established LaunchPAD public read-only catalog.

See [`docs/PHASE-4A-PRIVATE-READ.md`](docs/PHASE-4A-PRIVATE-READ.md).

## Browser authentication note

The Track Manager Worker remains protected by Cloudflare Access. A successful Worker deployment proves the backend contract and Access protection, but real-browser cookie behavior still depends on the active browser session and cross-site cookie policy.

Therefore:

- `PRIVATE READ` means Studio successfully reached the authenticated bridge;
- `PUBLIC FALLBACK` is a valid safe operating mode, not a write/security failure;
- if private reads are unavailable, open the existing Track Manager and authenticate normally, then retry Studio;
- do **not** put Access credentials in `VITE_*` variables;
- do **not** relax the Worker to wildcard authenticated CORS.

## Lyrics semantics

The canonical lyrics source may remain `tracks/<slug>/lyrics.txt`.

Studio determines synchronization from **content**, not from the filename extension:

- `lyrics.txt` present -> canonical lyrics source available;
- timestamp segments or Track Manager timestamp quality state detected -> `Synced Lyrics = Ready`;
- optional `.lrc` sidecar present -> also valid synchronized lyrics;
- a separate `.lrc` file is **not required** when the canonical TXT already contains timestamps.

This avoids duplicate lyric sources and false `Lyrics LRC: Missing` warnings for already-synchronized tracks.

## Safety / rollback policy

Before cross-repository integration work started on 2026-08-08, restoration branches were created:

- `shinobione/shinobiwan-studio` -> `safety/pre-integration-20260808-1048`
- `shinobione/LaunchPAD-APP` -> `safety/pre-studio-integration-20260808-1048`
- `shinobione/LM-IA-Analayse` -> `safety/pre-studio-integration-20260808-1048`
- `shinobione/lrc-maker` -> `safety/pre-studio-integration-20260808-1048`

The LaunchPAD snapshot also protects Track Manager because Track Manager lives inside `LaunchPAD-APP`.

Build 5 depends on the separately validated/deployed LaunchPAD Build 65 / Track Manager v5.8 bridge. It does not modify LaunchPAD, Track Manager, SonicTrace, LRC Maker or R2 data itself.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md) for the mandatory change policy.

## Stack

- React 18.2
- TypeScript 5.8.3
- Vite 6.3.5
- static GitHub Pages deployment
- dependency-free hash routing for Pages-safe deep navigation

## Local development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run check:private-read
npm run typecheck
npm run build
```

`npm run build` runs the private-read guard before TypeScript/Vite compilation. Every implementation PR must pass the GitHub validation workflow before merge.

## Routes

```text
#/dashboard
#/catalog
#/track/<trackId>
#/track/<trackId>/intelligence
#/track/<trackId>/lyrics
#/track/<trackId>/assets
#/track/<trackId>/versions
#/track/<trackId>/metadata
#/track/<trackId>/publishing
#/intelligence
#/lyrics
#/assets
#/publishing
#/administration
```

## Admin UI flag

For continuity with LaunchPAD conventions:

```text
?admin=1
?admin=0
```

This flag is **UI state only** and is not an authentication mechanism. Cloudflare Access remains the private API authentication boundary.

## Environment

See `.env.example`. No secret belongs in a `VITE_*` variable because all Vite client variables are public browser data.

## GitHub Pages

Production URL:

```text
https://shinobione.github.io/shinobiwan-studio/
```

The Actions workflow builds `dist/` and deploys through GitHub Pages.

## Versioning discipline

Each release must update together:

1. `package.json` version;
2. `src/release.ts` version/build/codename;
3. visible Studio release label;
4. `CHANGELOG.md`;
5. README / integration documentation affected by the change;
6. regression guards for security-sensitive contracts;
7. PR description with validation, dependency and rollback scope.
