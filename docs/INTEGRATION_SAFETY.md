# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08

This policy is mandatory for all work that can affect LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

## 1. Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## 2. Restoration snapshots

Created before Phase 4 integration work:

- Studio: `safety/pre-integration-20260808-1048`
- LaunchPAD + Track Manager: `safety/pre-studio-integration-20260808-1048`
- SonicTrace: `safety/pre-studio-integration-20260808-1048`
- LRC Maker: `safety/pre-studio-integration-20260808-1048`

These branches are rollback references and must not be used as development branches.

## 3. Mandatory change sequence

For every integration step:

1. inspect the current production branch and its version/build rules;
2. create a dedicated feature branch;
3. make the smallest independently reversible change;
4. update version/build metadata and documentation in the affected repository;
5. open a dedicated PR describing scope, risks and rollback;
6. run repository-native validation/CI;
7. do not merge on red CI;
8. merge only the validated PR;
9. wait for deployment completion;
10. verify the deployed surface before starting the next risky dependency.

## 4. Cross-repository rule

A feature requiring changes in several repositories must be split into separate PRs.

Example:

- PR A: LaunchPAD/Track Manager compatibility endpoint or CORS change;
- validate LaunchPAD/Track Manager independently;
- PR B: Studio consumes the new contract;
- validate Studio independently.

Never merge coordinated breaking changes in two repositories at the same time.

## 5. Data safety

- R2 remains the canonical media/catalog source of truth.
- No migration may delete or rewrite canonical media as a prerequisite.
- New Studio features must prefer additive fields/endpoints.
- Existing Track Manager workflows remain available as fallback until the replacement path is proven.
- SonicTrace analysis persistence must not duplicate source WAV files unnecessarily.
- Lyrics synchronization must not create two competing canonical lyric files.

## 6. Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent admin token in browser code;
- CORS changes must use explicit allowed origins, never `*` for authenticated writes;
- write endpoints remain denied until authentication behavior has been tested from Studio;
- destructive actions require explicit UI confirmation and backend authorization.

## 7. Rollback principle

If an integration step causes a regression:

1. stop the next phase;
2. revert only the affected repository/PR;
3. verify the original standalone tool still works;
4. use the safety branch only if a normal PR revert is insufficient.

The goal is that Studio integration can fail without taking LaunchPAD, Track Manager, LRC Maker or SonicTrace down with it.
