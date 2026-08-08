# Phase 4A — Track Manager private read bridge

> Historical baseline document. Phase 4A originally shipped with Studio `0.4.0` / Build `5`, Track Manager `v5.8` and bridge `v1.0`. The current runtime has advanced to Studio `0.4.2` / Build `7` and Track Manager `v5.10` / bridge `v1.2`, while preserving this private-read/public-fallback foundation. Current metadata-validation details live in [`PHASE-4B1A-METADATA-VALIDATION.md`](PHASE-4B1A-METADATA-VALIDATION.md).

Studio release at phase introduction: `0.4.0` / Build `5`  
Date: 2026-08-08

## Goal

Give SHINOBIWAN Studio access to the richer canonical Track Manager catalog state **without opening a Studio write path** and without making Studio availability depend on private authentication.

This phase is deliberately incremental:

```text
private read succeeds -> use canonical Track Manager state
private read fails    -> keep LaunchPAD public catalog
```

No automatic repair, migration or write is triggered by either state.

## Upstream dependency at phase introduction

The private bridge was implemented first in `shinobione/LaunchPAD-APP`:

- LaunchPAD Build: `2026.08.08.65`
- release: `studio-private-read-bridge-20260808`
- Track Manager: `v5.8`
- bridge: `v1.0`
- PR: `#157`
- merge commit: `d74e37ef69ebd4801d922ab22262332468178c49`
- production private Worker version: `b89fac19-78f8-4d39-abd5-76e93de976ae`

The Cloudflare workflow was launched with target `admin` only. The public Worker was skipped. The workflow did not rebuild `catalog/index.json` and did not mutate R2 media.

Current successor state is documented separately and must not be inferred from these historical version markers.

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

Original Phase 4A CORS contract:

- exact origin only;
- credentials allowed;
- methods `GET, OPTIONS` only;
- no browser secret embedded in Studio.

The bridge health response advertised:

```json
{
  "capabilities": {
    "read": ["tracks", "track"],
    "write": []
  }
}
```

The current bridge still advertises `write: []`; later Phase 4B.1A adds a separate non-mutating validation capability without changing that production-write state.

Studio rejects the health contract if a write capability unexpectedly appears.

## Studio request behavior at Build 5

`src/services/admin-api.ts` was the only Track Manager private browser client in Build 5.

GET requests use:

```text
Accept: application/json
credentials: include
mode: cors
cache: no-store
```

The private-read foundation remains in the current Studio runtime. Build 7 additionally contains one separately guarded validation-only POST; see the Phase 4B.1A document for its current transport contract.

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

and continues using the LaunchPAD public catalog.

Only if **both** private and public reads fail does Studio surface a catalog/track read error.

## Real-browser validation result

The original deployment smoke test confirmed that the private Worker remained protected by Cloudflare Access (`302` without authentication). Real-browser validation was then completed successfully:

1. Track Manager was authenticated normally;
2. Studio Dashboard reported `PRIVATE READ`;
3. Catalog reported the private canonical read layer;
4. Track Workspace reported `PRIVATE READ` and exposed canonical quality state;
5. public fallback remained available as the safe alternate path.

This successful Phase 4A browser validation is the foundation on which Phase 4B.1A was allowed to proceed.

A later Build 6 browser test demonstrated a separate lesson: successful authenticated GETs do not guarantee that a preflighted cross-origin POST will traverse Cloudflare Access. That issue is documented and guarded in the Build 7 Phase 4B.1A contract.

## Write boundary at Phase 4A

Phase 4A did **not** expose:

- metadata save;
- asset upload/replacement/removal;
- thumbnail write;
- publish/unpublish;
- delete;
- catalog rebuild;
- LRC save;
- SonicTrace persistence.

The current Build 7 still exposes none of those production writes. It adds metadata validation only.

## Regression evolution

The original Build 5 regression guard verified the GET-only private bridge and public fallback. That guard has since evolved with the product:

- Build 6 allowed exactly one non-mutating metadata-validation POST;
- Build 7 additionally enforces the CORS-safelisted no-preflight transport for that validation POST;
- `writesEnabled: false` and public fallback remain protected;
- PUT/PATCH/DELETE and production mutation routes remain forbidden in the Studio client.

## Rollback

The historical Build 5 rollback reference remains:

```text
safety/pre-integration-20260808-1048
```

For the current Build 7 / v5.10 boundary, prefer the newer pre-hotfix references:

```text
safety/pre-cors-hotfix-20260808-1540
```

Rollback remains repository-scoped: Studio can be reverted independently, and a Track Manager backend rollback uses an admin-only Worker deployment. Neither rollback should require R2 mutation for this validation-only phase.
