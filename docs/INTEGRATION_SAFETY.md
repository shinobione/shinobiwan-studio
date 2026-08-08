# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio milestone: `0.4.3` / Build `8` / Phase 4B.1B preparation

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

Fresh checkpoint immediately before the first real Studio write phase:

- Studio: `safety/pre-4b1b-metadata-write-20260808-1612`
- LaunchPAD + Track Manager: `safety/pre-4b1b-metadata-write-20260808-1612`

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

For Phase 4B.1B the safe order is intentionally:

1. **Studio Build 8** learns to tolerate only `write: ["metadata"]`, while still exposing no write client;
2. verify Build 8 is live against current Track Manager v5.10 / bridge v1.2;
3. deploy **Track Manager v5.11 / bridge v1.3** with one metadata-only write capability;
4. verify Studio remains `PRIVATE READ` and existing Track Manager still works;
5. only then deploy the later Studio build that exposes the real Save metadata UI/client.

This prevents a truthful backend capability advertisement from knocking an older Studio build into fallback.

## Data safety

- R2 remains the canonical media/catalog source of truth.
- Metadata write phase must never alter audio, cover, thumbnail, lyrics or video objects.
- `trackId`/slug is immutable in the metadata write route.
- Existing asset filenames, migration provenance and `createdAt` are preserved.
- `expectedUpdatedAt` is mandatory before every validation or save.
- stale state returns `STALE_MANIFEST`; Studio must reload rather than overwrite.
- published proposals must pass Track Manager quality checks before persistence.
- metadata save must rebuild `catalog/index.json` so public LaunchPAD does not drift from the canonical manifest.
- if catalog rebuild fails after a metadata manifest write, backend must attempt to restore the previous manifest before returning failure.
- validation alone never writes R2 or rebuilds catalog.
- LRC synchronization stays content-driven; timestamped `lyrics.txt` is already synchronized.

## Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent browser admin token;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser uses the existing Cloudflare Access session with `credentials: include`;
- simple `text/plain` JSON transport is used for cross-origin metadata POSTs to avoid the previously proven OPTIONS/Access preflight failure;
- request body carries an exact intent value;
- metadata fields are whitelist-only;
- Build 8 recognizes only `metadata` as a future write capability and rejects any other advertised bridge write;
- Build 8 still has `writesEnabled: false` and no save client/CTA;
- asset upload, delete, publish shortcuts, thumbnail writes and arbitrary catalog rebuild endpoints stay outside Phase 4B.1B.

## Current production boundary before backend v5.11

Public LaunchPAD:

- Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6` unchanged.

Private Track Manager:

- Track Manager `v5.10`;
- Studio bridge `v1.2`;
- merge `c7cf9ae7ad78e6407dfc6950b3c5a558e2f7bb0b`;
- private Worker Version ID `5ac91e36-9060-4e05-a76c-67c46459c72d`;
- deployment target was `admin` only;
- Cloudflare Access protection confirmed (`302` unauthenticated);
- no R2/catalog rebuild performed by the v5.10 validation hotfix.

## Real-browser gate

CI and Wrangler dry-run are necessary but not sufficient for browser integration.

Before progressing after any new browser method:

1. authenticate in Track Manager;
2. confirm Studio reports `PRIVATE READ`;
3. exercise the method;
4. confirm expected Worker JSON returns;
5. verify exactly the intended production state changed — or nothing changed for validation-only steps;
6. verify LaunchPAD, Track Manager, LRC Maker and SonicTrace remain independently usable.

## Rollback principle

If a regression appears:

1. stop the next phase;
2. revert the affected PR only;
3. if backend-only, redeploy the private/admin Worker from the known-good commit/safety branch;
4. verify the standalone Track Manager still works;
5. use the fresh `pre-4b1b` safety branches if a normal revert is insufficient;
6. never mutate media/R2 merely to compensate for a code regression.

The objective is simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
