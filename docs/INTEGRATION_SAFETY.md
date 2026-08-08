# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio milestone: `0.5.1` / Build `10` / Phase 4B.1B production-proven

This policy is mandatory for work affecting LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

## Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## Restoration snapshots

Baseline:

- Studio: `safety/pre-integration-20260808-1048`
- LaunchPAD + Track Manager: `safety/pre-studio-integration-20260808-1048`
- SonicTrace: `safety/pre-studio-integration-20260808-1048`
- LRC Maker: `safety/pre-studio-integration-20260808-1048`

CORS hotfix checkpoint:

- Studio: `safety/pre-cors-hotfix-20260808-1540`
- LaunchPAD + Track Manager: `safety/pre-cors-hotfix-20260808-1540`

Pre-first-write checkpoints:

- Studio + LaunchPAD/Track Manager: `safety/pre-4b1b-metadata-write-20260808-1612`
- Studio + LaunchPAD/Track Manager: `safety/post-v5.11-pre-build9-20260808-1732`

Preferred checkpoint after the successful production write + restoration cycle:

- Studio: `safety/post-metadata-write-proven-20260808-1822`
- LaunchPAD + Track Manager: `safety/post-metadata-write-proven-20260808-1822`

Safety branches are rollback references only and must never be used as development branches.

## Mandatory sequence

For every risky integration step:

1. inspect current production branch and version/build rules;
2. create a fresh safety snapshot when crossing a new write/security boundary;
3. create a dedicated feature branch;
4. make the smallest independently reversible change;
5. update version/build metadata and documentation;
6. add/extend regression guards;
7. open a dedicated PR with scope, dependency and rollback notes;
8. run repository-native CI;
9. never merge red CI;
10. keep source merge, web deployment, Worker deployment and R2/catalog mutation as distinct states;
11. verify the deployed surface in a real browser before opening the next riskier capability.

## Current production backend

Public LaunchPAD:

- Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6` unchanged.

Private Track Manager:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- merge SHA `49728e908fcfaff3f6edf9cf3f9b7d2bb23ce8a3`;
- deployment workflow run `31264114407`;
- deployment target `admin` only;
- Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- Cloudflare Access protection confirmed (`302` unauthenticated);
- public Worker deployment steps skipped.

Studio guarded-write baseline:

- Studio Build 9 merge SHA `4737309b0d5c2814744d1ee999ce904af71ffcb7`;
- metadata only;
- two POST clients: validate + save;
- no PUT/PATCH/DELETE;
- no media/delete/publish/standalone-rebuild mutation surface.

## Production proof — Phase 4B.1B

Real-browser smoke test on `soft-addiction` completed successfully.

Temporary write:

- field `keyConfidence` only;
- value `0.01`;
- canonical revision `2026-08-08T16:21:15.503Z`;
- catalog rebuilt;
- browser canonical reread verified;
- media untouched.

Restoration write:

- `keyConfidence` returned to original empty/null state;
- canonical revision `2026-08-08T16:22:10.890Z`;
- catalog rebuilt;
- browser canonical reread verified;
- quality `ready`, publishable `Yes`, errors/warnings `0 / 0`;
- media untouched.

Only after this restoration cycle is Phase 4B.1B considered production-proven.

## Data safety

- R2 remains the canonical media/catalog source of truth.
- Metadata is currently the only Studio production write capability.
- Audio, cover, thumbnail, lyrics and video objects remain outside the current client surface.
- `trackId`/slug is immutable in the metadata write route.
- Existing asset filenames, migration provenance and `createdAt` are preserved.
- `expectedUpdatedAt` is mandatory before every metadata validation or save.
- stale state returns `STALE_MANIFEST`; Studio reloads rather than overwrites.
- changing the form after validation invalidates the preview before save.
- published proposals must pass Track Manager quality checks before persistence.
- metadata save rebuilds `catalog/index.json` so LaunchPAD does not drift from the canonical manifest.
- if catalog rebuild or backend reread fails after a manifest write, v5.11 attempts to restore the previous manifest and rebuild the restored catalog.
- validation alone never writes R2 or rebuilds catalog.

## Lyrics safety rule — frozen before Phase 4B.2

- `lyrics.txt` is the canonical lyrics source.
- Timestamp data inside canonical `lyrics.txt` means the lyrics are synchronized.
- A separate `.lrc` sidecar is optional compatibility/export data, not a required second source of truth.
- Phase 4B.2 must not introduce mandatory `.lrc` persistence merely because the UI uses LRC-style timestamps.
- A future lyrics save must be independently stale-guarded and must not mutate audio, cover, thumbnail, video or arbitrary metadata.

## Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent browser admin token;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser uses the existing Cloudflare Access session with `credentials: include`;
- metadata POSTs use CORS-simple `text/plain` JSON transport to avoid the proven OPTIONS/Access preflight failure;
- validation body intent is exactly `metadata-validate-v1`;
- save body intent is exactly `metadata-save-v1`;
- metadata fields are whitelist-only;
- Studio rejects any bridge write capability other than currently approved capabilities;
- before saving, Studio verifies the deployed bridge advertises the required capability;
- no autosave, background write or keyboard shortcut save is permitted for guarded write phases.

## Real-browser gate for future writes

CI and Wrangler dry-run are necessary but not sufficient.

Before any new write capability becomes production-proven:

1. authenticate in Track Manager;
2. confirm Studio reports `PRIVATE READ`;
3. exercise a reversible, narrow change;
4. verify the exact intended changed field/object;
5. verify canonical reread;
6. restore the temporary test change if applicable;
7. verify the final state is clean;
8. verify LaunchPAD, Track Manager, SonicTrace and LRC Maker remain independently usable;
9. create a post-proof safety checkpoint before opening the next write boundary.

## Rollback principle

If a regression appears:

1. stop the next phase immediately;
2. do not perform unrelated media/catalog edits to compensate;
3. revert the affected Studio PR if the client/UI is at fault;
4. if backend-only, redeploy the private/admin Worker from a known-good commit or safety branch;
5. prefer `safety/post-metadata-write-proven-20260808-1822` as the current known-good checkpoint;
6. verify standalone Track Manager, LaunchPAD, LRC Maker and SonicTrace independently before resuming.

The objective is simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
