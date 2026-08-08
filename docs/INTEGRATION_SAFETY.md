# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio milestone: `0.5.0` / Build `9` / Phase 4B.1B guarded metadata save

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

Pre-first-write checkpoint:

- Studio: `safety/pre-4b1b-metadata-write-20260808-1612`
- LaunchPAD + Track Manager: `safety/pre-4b1b-metadata-write-20260808-1612`

Preferred checkpoint immediately after Track Manager v5.11 was deployed and verified in the real browser, but before Studio exposed Save:

- Studio: `safety/post-v5.11-pre-build9-20260808-1732`
- LaunchPAD + Track Manager: `safety/post-v5.11-pre-build9-20260808-1732`

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

## Cross-repository deployment rule

Breaking coordination between repositories is forbidden.

Phase 4B.1B rollout order is deliberately asymmetric:

1. Studio Build 8 learned to tolerate only `write: ["metadata"]` while exposing no save client;
2. Build 8 was deployed and verified against Track Manager v5.10;
3. Track Manager v5.11 / bridge v1.3 was merged and deployed `admin` only;
4. Build 8 was verified `PRIVATE READ` against v5.11 in the real browser;
5. only then was Studio Build 9 allowed to expose the real Save metadata client.

This sequence prevents a truthful backend capability advertisement from breaking an older Studio and prevents the client from attempting a write against an older backend.

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

Deployment of v5.11 itself did not invoke the metadata-save endpoint and therefore did not mutate R2/catalog/media.

## Data safety

- R2 remains the canonical media/catalog source of truth.
- Build 9 may mutate metadata only.
- Audio, cover, thumbnail, lyrics and video objects are outside the Build 9 client surface.
- `trackId`/slug is immutable in the metadata write route.
- Existing asset filenames, migration provenance and `createdAt` are preserved.
- `expectedUpdatedAt` is mandatory before every validation or save.
- stale state returns `STALE_MANIFEST`; Studio must reload rather than overwrite.
- changing the form after validation invalidates the preview before save.
- published proposals must pass Track Manager quality checks before persistence.
- metadata save rebuilds `catalog/index.json` so public LaunchPAD does not drift from the canonical manifest.
- if catalog rebuild or backend reread fails after a manifest write, v5.11 attempts to restore the previous manifest and rebuild the restored catalog.
- validation alone never writes R2 or rebuilds catalog.
- LRC synchronization stays content-driven; timestamped `lyrics.txt` is already synchronized.

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
- Studio rejects any bridge write capability other than `metadata`;
- before saving, Studio verifies the deployed bridge actually advertises `metadata` write capability;
- Build 9 exposes exactly two explicit POST clients: validation + metadata save;
- no Studio PUT/PATCH/DELETE client exists;
- asset upload, delete, publish shortcuts, thumbnail writes and standalone catalog rebuild endpoints stay outside Phase 4B.1B.

## Save confirmation policy

A production metadata save must never happen directly from form editing.

Required browser path:

1. edit locally;
2. validate against the canonical revision;
3. review normalized changed fields and quality;
4. click `Save metadata`;
5. accept an explicit confirmation that names the changed fields and states that manifest + catalog index will change while media stays untouched;
6. wait for backend result;
7. verify the canonical reread before another edit.

No autosave, keyboard shortcut save or background write is permitted in Phase 4B.1B.

## Double verification

Track Manager v5.11 rereads the saved manifest after persistence.

Studio Build 9 performs a second authenticated canonical GET after the successful save response and compares `updatedAt`.

The UI may report a fully verified state only when this second reread matches the saved revision.

If the second reread fails, the backend save result is not silently discarded; Studio reports a warning and requires reload before another edit to avoid accidental duplicate writes.

## Real-browser gate

CI and Wrangler dry-run are necessary but not sufficient for browser integration.

For the first Build 9 production write:

1. authenticate in Track Manager;
2. confirm Studio reports `PRIVATE READ`;
3. choose a known track and one harmless reversible metadata field;
4. validate;
5. verify the preview reports exactly the expected changed field(s);
6. save and confirm;
7. require `CANONICAL REREAD · VERIFIED`;
8. verify the new canonical revision in Studio;
9. verify the same value in Track Manager;
10. verify LaunchPAD reflects the rebuilt catalog where applicable;
11. verify SonicTrace and LRC Maker remain independently usable.

Only after that smoke test may Phase 4B.1B be considered proven in production.

## Rollback principle

If a regression appears:

1. stop the next phase immediately;
2. do not attempt unrelated media/catalog edits to compensate;
3. revert the affected Studio PR if the client/UI is at fault;
4. if backend-only, redeploy the private/admin Worker from a known-good commit or safety branch;
5. prefer `safety/post-v5.11-pre-build9-20260808-1732` for client-write rollback because it represents the exact v5.11-compatible no-save state proven in Chrome;
6. verify standalone Track Manager, LaunchPAD, LRC Maker and SonicTrace independently before resuming.

The objective is simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
