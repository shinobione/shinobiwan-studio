# SHINOBIWAN Studio — Phase 6 complete

Studio release: `0.9.0` / Build `15` / `phase6-canonical-lyrics-workflow`

Track Manager target: `v5.15` / Studio bridge `v1.7`

LRC Maker target: `6.2.0`

## Canonical rule

The single authority is `tracks/<slug>/lyrics.txt`. Timestamp tags inside this text determine synchronization status. A `.lrc` download is an optional export and never a required catalog asset or Content Health input.

## Cross-repository workflow

1. Studio opens LRC Maker with a canonical `trackId` and safe return path only.
2. LRC Maker fetches the protected audio, lyrics text, manifest revision and lyrics ETag from Track Manager.
3. The editor preserves its existing timing workflow and serializes lyrics-only timestamp text.
4. Track Manager validates exact track identity, stale controls, UTF-8, timestamp syntax/order/completeness and audio duration.
5. Track Manager writes only `lyrics.txt`, advances the manifest revision and rebuilds the catalog.
6. Track Manager rereads the canonical objects; failures trigger lyrics, manifest and catalog rollback.
7. LRC Maker rereads the context and notifies its Studio opener.
8. Studio refreshes the canonical Track Workspace.

## Safety boundary

- no iframe or editor extraction;
- no audio or lyrics in query parameters;
- no direct browser write to R2;
- no `.lrc` source of truth;
- no production data mutation during implementation verification;
- no SonicTrace schema or data change;
- no public LaunchPAD version change;
- no Phase 7 work.

## Rollback

Each repository has an independent `codex/phase6-lyrics` branch. Production branches remain unchanged until review and merge. The pre-Phase 6 production heads are the existing Phase 5 checkpoints for Studio, LaunchPAD/Track Manager and SonicTrace; LRC Maker starts from its synchronized `master` head.
