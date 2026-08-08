# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Current release:** `0.3.2`  
**Build:** `4`  
**Current milestone:** Phase 3.1 — Track Workspace + timestamp-aware synchronized lyrics

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the existing music-tool ecosystem. It does **not** replace the underlying products by copying their code into one monolith.

Architecture rules:

- one canonical track identity: `trackId = R2 manifest slug`;
- LaunchPAD remains the public product;
- R2 remains the catalog/media source of truth;
- Track Manager remains the protected write backend/fallback until Phase 4 is proven;
- SonicTrace remains the audio-intelligence engine;
- LRC Maker remains the lyrics editing/synchronization engine during migration;
- Studio must remain usable when the optional local SonicTrace GPU node is offline.

## Current scope

Implemented:

- GitHub Pages shell;
- live LaunchPAD catalog read layer;
- search, filters and sorting;
- `#/track/<trackId>` Track Workspace;
- Overview, Audio Intelligence, Lyrics, Assets, Versions, Metadata and Publishing sections;
- deterministic Content Health;
- global readability floor for microcopy;
- timestamp-aware synchronized lyrics semantics.

Production writes remain locked in Studio until Phase 4 security work is separately reviewed and validated.

## Lyrics semantics

The canonical lyrics source may remain `tracks/<slug>/lyrics.txt`.

Studio determines synchronization from **content**, not from the filename extension:

- `lyrics.txt` present -> canonical lyrics source available;
- timestamp segments detected -> `Synced Lyrics = Ready`;
- optional `.lrc` sidecar present -> also valid synchronized lyrics;
- a separate `.lrc` file is **not required** when the canonical TXT already contains timestamps.

This avoids duplicate lyric sources and prevents false `Lyrics LRC: Missing` warnings for already-synchronized tracks.

## Safety / rollback policy

Before cross-repository integration work started on 2026-08-08, restoration branches were created:

- `shinobione/shinobiwan-studio` -> `safety/pre-integration-20260808-1048`
- `shinobione/LaunchPAD-APP` -> `safety/pre-studio-integration-20260808-1048`
- `shinobione/LM-IA-Analayse` -> `safety/pre-studio-integration-20260808-1048`
- `shinobione/lrc-maker` -> `safety/pre-studio-integration-20260808-1048`

The LaunchPAD snapshot also protects Track Manager because Track Manager lives inside `LaunchPAD-APP`.

See `docs/INTEGRATION_SAFETY.md` for the mandatory change policy.

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
npm run typecheck
npm run build
```

Every implementation PR must pass the validation workflow before merge.

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

This flag is **UI state only** and is not an authentication mechanism.

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
5. README / architecture documentation affected by the change;
6. PR description with validation and rollback scope.
