# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio milestone: `0.5.2` / Build `11` / Phase 4B.2A lyrics capability preparation

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

Metadata-write checkpoints:

- Studio + LaunchPAD/Track Manager: `safety/pre-4b1b-metadata-write-20260808-1612`
- Studio + LaunchPAD/Track Manager: `safety/post-v5.11-pre-build9-20260808-1732`
- Studio + LaunchPAD/Track Manager: `safety/post-metadata-write-proven-20260808-1822`

Fresh pre-lyrics-runtime checkpoint:

- Studio: `safety/pre-4b2-lyrics-write-20260808-1837`
- LaunchPAD + Track Manager: `safety/pre-4b2-lyrics-write-20260808-1837`

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

## Production proof — Phase 4B.1B

Real-browser metadata smoke test on `soft-addiction` completed successfully and was restored cleanly.

Temporary revision:

```text
2026-08-08T16:21:15.503Z
```

Restored revision:

```text
2026-08-08T16:22:10.890Z
```

Final state: quality `ready`, publishable `Yes`, errors/warnings `0 / 0`, media untouched.

Metadata therefore remains the only production-proven Studio write.

## Phase 4B.2A compatibility boundary

Build 11 changes capability recognition only.

Allowed bridge write advertisements become:

```text
metadata
lyrics
```

but active Studio write clients remain:

```text
metadata only
```

Required Build 11 invariants:

- exactly two explicit POST clients remain: metadata validate + metadata save;
- `/lyrics/validate` absent;
- `/lyrics/save` absent;
- `lyricsWriteEnabled: false`;
- no PUT/PATCH/DELETE;
- no media/delete/publish/standalone-rebuild mutation client;
- deploying Build 11 must not mutate R2 or require a Worker deployment.

This sequencing prevents a future v5.12/v1.4 backend from truthfully advertising a lyrics capability and accidentally pushing Build 10 into public fallback.

## Lyrics safety rule — frozen

- `lyrics.txt` is the canonical lyrics source.
- Timestamp data inside canonical `lyrics.txt` means the lyrics are synchronized.
- A separate `.lrc` sidecar is optional compatibility/export data, not a required second source of truth.
- Track Manager already accepts TXT only for canonical lyrics uploads.
- LRC Maker can remain the advanced timestamp editor without a runtime change for the first Studio lyrics-write phase.
- Future lyrics validation/save must be independently stale-guarded.
- Proposed concurrency requires both manifest `expectedUpdatedAt` and a server-provided lyrics object revision/ETag.
- First write scope should update an existing canonical `lyrics.txt` only; creation/migration is a later subphase.
- A lyrics module must not mutate audio, cover, thumbnail, video, delete state or arbitrary metadata.

## Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent browser admin token;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser uses the existing Cloudflare Access session with `credentials: include`;
- guarded POSTs use CORS-simple `text/plain` JSON transport unless a later reviewed contract explicitly changes it;
- no autosave, background write or keyboard-shortcut save is permitted for guarded write phases;
- Studio verifies the deployed bridge advertises a capability before any corresponding save call is allowed.

## Real-browser gate for future writes

CI and Wrangler dry-run are necessary but not sufficient.

Before any new write capability becomes production-proven:

1. authenticate in Track Manager;
2. confirm Studio reports `PRIVATE READ`;
3. exercise a reversible, narrow change;
4. verify the exact intended changed object/state;
5. verify canonical reread;
6. restore the temporary test change;
7. verify the final state is clean;
8. verify LaunchPAD, Track Manager, SonicTrace and LRC Maker remain independently usable;
9. create a post-proof safety checkpoint before opening the next write boundary.

## Rollback principle

If a regression appears:

1. stop the next phase immediately;
2. do not perform unrelated media/catalog edits to compensate;
3. revert the affected Studio PR if the client/UI is at fault;
4. if backend-only, redeploy the private/admin Worker from a known-good commit or safety branch;
5. prefer `safety/pre-4b2-lyrics-write-20260808-1837` for Phase 4B.2 runtime rollback and `safety/post-metadata-write-proven-20260808-1822` for the last fully production-proven write boundary;
6. verify standalone Track Manager, LaunchPAD, LRC Maker and SonicTrace independently before resuming.

The objective is simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
