# Phase 4A — Track Manager private read bridge

Studio release: `0.4.0` / Build `5`  
Date: 2026-08-08

## Goal

Give SHINOBIWAN Studio access to the richer canonical Track Manager catalog state **without opening a Studio write path** and without making Studio availability depend on private authentication.

This phase is deliberately incremental:

```text
private read succeeds -> use canonical Track Manager state
private read fails    -> keep LaunchPAD public catalog
```

No automatic repair, migration or write is triggered by either state.

## Upstream dependency

The private bridge was implemented first in `shinobione/LaunchPAD-APP`:

- LaunchPAD Build: `2026.08.08.65`
- release: `studio-private-read-bridge-20260808`
- Track Manager: `v5.8`
- bridge: `v1.0`
- PR: `#157`
- merge commit: `d74e37ef69ebd4801d922ab22262332468178c49`
- production private Worker version: `b89fac19-78f8-4d39-abd5-76e93de976ae`

The Cloudflare workflow was launched with target `admin` only. The public Worker was skipped. The workflow did not rebuild `catalog/index.json` and did not mutate R2 media.

## Private bridge routes

```text
OPTIONS /api/studio/*
GET     /api/studio/health
GET     /api/studio/tracks
GET     /api/studio/tracks/<trackId>
```

The Worker continues to verify Cloudflare Access before Studio data GETs.

Exact browser origin:

```text
https://shinobione.github.io
```

CORS contract:

- exact origin only;
- credentials allowed;
- methods `GET, OPTIONS` only;
- no browser secret embedded in Studio.

The bridge health response advertises:

```json
{
  "capabilities": {
    "read": ["tracks", "track"],
    "write": []
  }
}
```

Studio rejects the health contract if a write capability unexpectedly appears.

## Studio request behavior

`src/services/admin-api.ts` is the only Track Manager private browser client in Build 5.

Requests use:

```text
Accept: application/json
credentials: include
mode: cors
cache: no-store
```

The client intentionally does not set an HTTP method, so browser fetch defaults to GET.

It contains no FormData/write-payload path and exposes no POST/PUT/PATCH/DELETE wrapper.

## Data merge strategy

The two read layers have complementary roles.

### Private Track Manager

Preferred source for:

- canonical manifest state;
- draft/archived tracks;
- canonical status;
- Track Manager quality state;
- publishability;
- canonical asset presence/filenames;
- timestamp/lyrics quality state;
- manifest created/updated timestamps.

### Public LaunchPAD Worker

Retained for:

- proven published media URLs;
- published cover/thumbnail/audio/video delivery;
- public lyrics raw text and parsed timestamp segments;
- safe operation when private authentication is unavailable.

### Merge rule

For published tracks present in both responses:

1. canonical/admin fields come from Track Manager when available;
2. proven public asset URLs and lyrics payload remain attached;
3. Track Manager quality can upgrade synchronization state even if the public boolean is stale;
4. no data is written back upstream.

For private-only tracks such as drafts, Studio can construct protected Track Manager media references, but those remain subject to Cloudflare Access.

## Fallback behavior

Private read failures are classified but are not fatal when the public catalog still works.

Examples:

- no usable Cloudflare Access cookie;
- browser blocks cross-site credential behavior;
- CORS/network failure;
- private timeout;
- private bridge returns invalid/non-JSON data.

In these cases Studio shows:

```text
PUBLIC FALLBACK
```

and continues using the Build 4-style LaunchPAD public catalog.

Only if **both** private and public reads fail does Studio surface a catalog/track read error.

## Browser validation caveat

The production deployment smoke test confirmed that the private Worker remains protected by Cloudflare Access (`302` without a service token). It did not simulate the user's authenticated browser cookie from GitHub Pages.

Therefore `PRIVATE READ` must be validated in a real browser after Build 5 deployment.

Expected validation flow:

1. open/authenticate Track Manager normally;
2. open SHINOBIWAN Studio;
3. Dashboard Catalog pill should report `private read`;
4. Catalog should report `CATALOG / PRIVATE CANONICAL READ`;
5. drafts, if present, should appear;
6. a track workspace should show `PRIVATE READ` and Track Manager quality state;
7. reload and confirm no production write/rebuild occurs.

If the browser continues to show `PUBLIC FALLBACK`, keep the fallback. Do not weaken Cloudflare Access or broaden authenticated CORS merely to force the private state.

## Write boundary

Phase 4A does **not** expose:

- metadata save;
- asset upload/replacement/removal;
- thumbnail write;
- publish/unpublish;
- delete;
- catalog rebuild;
- LRC save;
- SonicTrace persistence.

Those operations remain in their existing tools/backend paths until separate phases are designed and proven.

## Regression guard

`npm run check:private-read` verifies that:

- the browser client uses credentials and CORS;
- the three GET bridge routes remain wired;
- the bridge health write capability is checked;
- `writesEnabled` remains false;
- the admin client contains no `method:` override;
- the admin client contains no write-payload plumbing;
- public fallback remains present;
- release metadata remains `0.4.0` / Build `5`;
- production build runs this guard before TypeScript/Vite compilation.

## Rollback

Preferred rollback is a normal revert of the Studio Build 5 PR.

That restores Studio Build 4 public-read behavior without touching:

- LaunchPAD Build 65;
- Track Manager v5.8;
- the deployed additive private bridge;
- public Worker v2.6;
- R2;
- SonicTrace;
- LRC Maker.

Last-resort Studio restoration reference:

```text
safety/pre-integration-20260808-1048
```
