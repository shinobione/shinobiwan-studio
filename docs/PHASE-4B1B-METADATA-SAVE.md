# Phase 4B.1B — Guarded Metadata Save

Studio release: `0.5.0` / Build `9` / codename `guarded-metadata-save`  
Date: 2026-08-08

This is the first SHINOBIWAN Studio release allowed to mutate canonical production state.

The scope is intentionally narrow: **metadata only**.

## Production dependency

Public LaunchPAD remains unchanged:

- public app Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6`.

Protected Track Manager backend already deployed before Build 9:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- LaunchPAD merge SHA `49728e908fcfaff3f6edf9cf3f9b7d2bb23ce8a3`;
- protected deployment workflow run `31264114407`;
- deployment target `admin` only;
- Cloudflare Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- Cloudflare Access still protected (`302` unauthenticated smoke test);
- public Worker deployment steps were skipped.

Studio Build 8 was deployed first and proven `PRIVATE READ` against v5.11 before this client write was introduced.

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

The existing validation endpoint remains separate and non-mutating:

```text
POST /api/studio/tracks/<trackId>/metadata/validate
```

## Required user flow

Build 9 deliberately does not offer a one-click save.

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

A save is enabled only while the revision returned by validation still equals the revision currently loaded in the Track Workspace.

If another process changes the manifest first, Track Manager returns:

```text
409 STALE_MANIFEST
```

Studio must reload, validate again and only then allow another save attempt. It never performs last-write-wins overwrite behavior.

## Quality guard

The backend rebuilds the proposal from whitelist-only metadata and reruns the existing Track Manager quality inspection before persistence.

If the resulting manifest status is `published`, `quality.publishable` must be true. Otherwise Track Manager returns `QUALITY_BLOCKED` without persisting the proposal.

## Media isolation

Build 9 must not expose or call any mutation path for:

- audio;
- cover;
- thumbnail;
- lyrics TXT/LRC;
- Canvas/video;
- track deletion;
- arbitrary slug changes;
- standalone publication shortcut;
- standalone catalog rebuild.

The backend metadata module preserves:

- canonical slug / `trackId`;
- asset filenames;
- migration provenance;
- `createdAt`.

The only R2 write triggered by a successful metadata change is the canonical manifest plus the required canonical `catalog/index.json` rebuild.

## Rollback behavior

Track Manager v5.11 has a transactional recovery path around the manifest/catalog pair.

If the manifest was written but catalog rebuild or post-write verification fails, it attempts to:

1. restore the previous manifest;
2. rebuild the catalog from the restored state;
3. return `SAVE_ROLLBACK` with rollback status.

Studio treats `SAVE_ROLLBACK` as a stop condition. The user must verify Track Manager before retrying.

## Browser-side verification

A successful backend response is not the end of the Build 9 flow.

Studio performs `GET /api/studio/tracks/<trackId>` again and compares the canonical `updatedAt` with the saved revision.

The UI reports either:

```text
CANONICAL REREAD · VERIFIED
```

or a warning requiring reload before another edit.

The Track Workspace then refreshes through the normal private-first catalog service so the rest of the UI receives the new canonical metadata.

## Build-time regression guard

`scripts/check-private-read-contract.mjs` must prove all of the following:

- exactly two explicit Studio POST client paths exist: metadata validate + metadata save;
- both use the proven CORS-simple `text/plain` transport;
- no custom intent header / forced preflight path returns;
- no PUT/PATCH/DELETE client exists;
- no asset/delete/publish/standalone-rebuild mutation path exists;
- bridge write capabilities are allowlisted to `metadata` only;
- save checks that the deployed bridge actually advertises metadata write before posting;
- validation/review/confirmation/save UI exists;
- canonical reread verification exists;
- Studio release metadata is `0.5.0` / Build `9`.

## Safety snapshots

Pre-first-write checkpoints:

```text
safety/pre-4b1b-metadata-write-20260808-1612
safety/post-v5.11-pre-build9-20260808-1732
```

The second snapshot is the preferred rollback reference because it captures the exact state proven in the real browser after Track Manager v5.11 was deployed and before Studio exposed Save.

## First production smoke test

After Build 9 is deployed, the first real write must be intentionally harmless and easy to verify.

Recommended test:

1. open a known track in `PRIVATE READ`;
2. change one non-destructive metadata field to a clearly reversible value;
3. validate;
4. confirm exactly one changed field;
5. save;
6. confirm `CANONICAL REREAD · VERIFIED`;
7. confirm the new revision appears in Track Workspace;
8. open Track Manager and verify the same value/revision;
9. verify public LaunchPAD reflects the rebuilt catalog where applicable;
10. revert the test value through the same validated save flow if it was only a smoke-test marker.

Do not use asset replacement, deletion or publication as the first Studio production-write test.
