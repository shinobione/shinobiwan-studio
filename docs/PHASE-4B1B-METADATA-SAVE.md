# Phase 4B.1B — Guarded Metadata Save

Studio release: `0.5.1` / Build `10` / codename `metadata-save-production-proven`  
Date: 2026-08-08

Phase 4B.1B is the first SHINOBIWAN Studio capability allowed to mutate canonical production state. Its scope remains intentionally narrow: **metadata only**.

Build 10 does not add another write path. It records the successful production proof of the Build 9 contract and preserves all existing guards.

## Production dependency

Public LaunchPAD remains unchanged:

- public app Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6`.

Protected Track Manager backend:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- LaunchPAD merge SHA `49728e908fcfaff3f6edf9cf3f9b7d2bb23ce8a3`;
- protected deployment workflow run `31264114407`;
- deployment target `admin` only;
- Cloudflare Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- Cloudflare Access still protected (`302` unauthenticated smoke test);
- public Worker deployment steps were skipped.

Studio Build 9 merge SHA: `4737309b0d5c2814744d1ee999ce904af71ffcb7`.

## Allowed production write

Exactly one capability is exposed:

```text
write: ["metadata"]
```

Exactly one Studio production mutation endpoint is callable:

```text
POST /api/studio/tracks/<trackId>/metadata/save
Content-Type: text/plain;charset=UTF-8
credentials: include
```

Body:

```json
{
  "intent": "metadata-save-v1",
  "expectedUpdatedAt": "<revision validated by Studio>",
  "metadata": {}
}
```

The validation endpoint remains separate and non-mutating:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
```

## Required user flow

```text
Edit locally
  -> Validate metadata
  -> Review normalized preview + quality
  -> Save metadata
  -> explicit browser confirmation
  -> backend revalidates stale revision + quality
  -> write canonical manifest metadata
  -> rebuild catalog/index.json
  -> backend rereads saved manifest
  -> Studio performs a second canonical GET reread
  -> Track Workspace refreshes from the private-first catalog layer
```

Changing any form field invalidates the previous validation preview and removes save readiness.

## Stale-write protection

`expectedUpdatedAt` is mandatory for both validate and save.

If another process changes the manifest first, Track Manager returns:

```text
409 STALE_MANIFEST
```

Studio must reload, validate again and only then allow another save attempt. It never performs last-write-wins overwrite behavior.

## Quality guard

The backend rebuilds the proposal from whitelist-only metadata and reruns the existing Track Manager quality inspection before persistence.

If the resulting manifest status is `published`, `quality.publishable` must be true. Otherwise Track Manager returns `QUALITY_BLOCKED` without persisting the proposal.

## Media isolation

Build 10 does not expose or call mutation paths for:

- audio;
- cover;
- thumbnail;
- lyrics TXT/LRC;
- Canvas/video;
- track deletion;
- arbitrary slug changes;
- standalone publication shortcut;
- standalone catalog rebuild.

The backend metadata module preserves canonical slug, asset filenames, migration provenance and `createdAt`.

The only R2 writes triggered by a successful metadata change are the canonical manifest plus the required canonical `catalog/index.json` rebuild.

## Rollback behavior

Track Manager v5.11 has a transactional recovery path around the manifest/catalog pair.

If the manifest was written but catalog rebuild or post-write verification fails, it attempts to:

1. restore the previous manifest;
2. rebuild the catalog from the restored state;
3. return `SAVE_ROLLBACK` with rollback status.

Studio treats `SAVE_ROLLBACK` as a stop condition.

## Browser-side verification

A successful backend response is not the end of the flow.

Studio performs `GET /api/studio/tracks/<trackId>` again and compares the canonical `updatedAt` with the saved revision.

The UI reports either:

```text
CANONICAL REREAD · VERIFIED
```

or a warning requiring reload before another edit.

## Production proof completed

The first real write was intentionally harmless and reversible on `soft-addiction`.

### Smoke write

- field: `keyConfidence`;
- previous state: empty/null;
- temporary value: `0.01`;
- validation reported exactly one changed field: `keyConfidence`;
- quality state: `ready`;
- publishable: `Yes`;
- errors/warnings after temporary value: `0 / 1`;
- saved canonical revision: `2026-08-08T16:21:15.503Z`;
- catalog rebuilt: `Yes`;
- browser reread: `Verified`;
- media objects: untouched.

### Restoration write

- `keyConfidence` restored to the original empty/null state;
- validation again reported exactly one changed field: `keyConfidence`;
- final quality state: `ready`;
- final publishable: `Yes`;
- final errors/warnings: `0 / 0`;
- restored canonical revision: `2026-08-08T16:22:10.890Z`;
- catalog rebuilt: `Yes`;
- browser reread: `Verified`;
- media objects: untouched.

This proves the entire production cycle, including restoration to a clean canonical state.

## Build-time regression guard

`scripts/check-private-read-contract.mjs` must continue to prove:

- exactly two explicit Studio POST client paths exist: metadata validate + metadata save;
- both use CORS-simple `text/plain` transport;
- no custom intent header / forced preflight path returns;
- no PUT/PATCH/DELETE client exists;
- no asset/delete/publish/standalone-rebuild mutation path exists;
- bridge write capabilities remain allowlisted to `metadata` only;
- save checks that the deployed bridge advertises metadata write before posting;
- validation/review/confirmation/save UI remains present;
- canonical reread verification remains present;
- Studio release metadata is `0.5.1` / Build `10`.

## Safety snapshots

```text
safety/pre-4b1b-metadata-write-20260808-1612
safety/post-v5.11-pre-build9-20260808-1732
safety/post-metadata-write-proven-20260808-1822
```

The last snapshot is the preferred current rollback reference because it captures the exact known-good state after the successful write + restoration cycle.

## Handoff to Phase 4B.2

Phase 4B.2 may now be investigated, but only after a read-only audit.

Frozen lyrics rule:

```text
canonical source = lyrics.txt
timestamped lyrics.txt = synchronized
.lrc sidecar = optional compatibility/export only
```

A future lyrics save must not introduce a mandatory second `.lrc` source of truth and must be independently guarded from metadata, media, delete and publishing writes.
