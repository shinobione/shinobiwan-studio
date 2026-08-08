# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

## Phase 1 scope

This repository starts as a **read-first shell**. It deliberately does not perform production writes.

Architecture rules inherited from LaunchPAD's Phase 0 integration contract:

- one canonical track identity: `trackId = R2 manifest slug`;
- LaunchPAD remains the public product;
- R2 remains the catalog/media source of truth;
- SonicTrace remains the audio-intelligence engine;
- LRC Maker remains the lyrics engine during migration;
- Track Manager remains the protected write fallback until the Phase 4 browser write path is reviewed and validated.

## Stack

- React 18.2 (aligned with the current LRC Maker codebase)
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

## Routes

```text
#/dashboard
#/catalog
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

The build is configured for:

```text
https://shinobione.github.io/shinobiwan-studio/
```

The included Actions workflow builds `dist/` and deploys it through GitHub Pages.
