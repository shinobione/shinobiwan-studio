# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio integration milestone: `0.4.0` / Build `5` / Phase 4A private reads

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
5. add or extend a regression guard when the step affects an API/security boundary;
6. open a dedicated PR describing scope, risks, dependencies and rollback;
7. run repository-native validation/CI;
8. do not merge on red CI;
9. merge only the validated PR;
10. wait for deployment completion;
11. verify the deployed surface before starting the next risky dependency.

## 4. Cross-repository rule

A feature requiring changes in several repositories must be split into separate PRs.

The Phase 4A sequence is the reference pattern:

1. LaunchPAD/Track Manager Build 65 added the GET-only bridge in PR #157;
2. all LaunchPAD/Worker CI passed;
3. Build 65 merged and GitHub Pages deployed;
4. only the private/admin Worker was deployed and verified as Access-protected;
5. Studio Build 5 consumes that already-deployed contract in a separate PR;
6. no coordinated breaking merge is required.

Never merge coordinated breaking changes in two repositories at the same time.

## 5. Data safety

- R2 remains the canonical media/catalog source of truth.
- No migration may delete or rewrite canonical media as a prerequisite.
- New Studio features must prefer additive fields/endpoints.
- Existing Track Manager workflows remain available as fallback until the replacement path is proven.
- SonicTrace analysis persistence must not duplicate source WAV files unnecessarily.
- Lyrics synchronization must not create two competing canonical lyric files.
- A Studio read failure must not trigger a catalog rebuild, manifest rewrite or media repair automatically.
- Phase 4A is read-only and must remain capable of falling back to the public LaunchPAD catalog without mutating production state.

## 6. Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent admin token in browser code;
- CORS changes must use explicit allowed origins, never `*` for credentialed private access;
- current Track Manager Studio origin is exactly `https://shinobione.github.io`;
- Phase 4A browser calls may send the user's existing Access cookies with `credentials: include`, but Studio must not manufacture or store those credentials;
- private bridge routes are GET/OPTIONS only;
- existing Track Manager POST/PUT/PATCH/DELETE routes remain same-origin protected;
- Studio Build 5 exposes no HTTP method override or write-payload plumbing in its admin client;
- destructive actions require a future separate security-reviewed phase, explicit UI confirmation and backend authorization.

## 7. Phase 4A production boundary

Upstream production state validated before Studio Build 5:

- LaunchPAD Build: `2026.08.08.65`;
- Track Manager contract: `v5.8`;
- Studio bridge contract: `v1.0`;
- LaunchPAD PR: `#157`;
- LaunchPAD merge commit: `d74e37ef69ebd4801d922ab22262332468178c49`;
- deployed private Worker version: `b89fac19-78f8-4d39-abd5-76e93de976ae`;
- deployment target: `admin` only;
- public Worker: not deployed by this change;
- R2/catalog rebuild: not performed;
- post-deploy smoke: Cloudflare Access protection confirmed (`302`).

An authenticated data read from a real Studio browser session is still a separate runtime validation. If browser cookie policy prevents it, Studio must show/use `PUBLIC FALLBACK`; authentication must not be weakened to force `PRIVATE READ`.

## 8. Rollback principle

If an integration step causes a regression:

1. stop the next phase;
2. revert only the affected repository/PR;
3. verify the original standalone tool still works;
4. use the safety branch only if a normal PR revert is insufficient.

For Studio Build 5 specifically, reverting the Studio PR returns the app to Build 4 public-read behavior without requiring any LaunchPAD, Track Manager, SonicTrace, LRC Maker or R2 rollback. The deployed Track Manager v5.8 bridge is additive and can remain unused safely.

The goal is that Studio integration can fail without taking LaunchPAD, Track Manager, LRC Maker or SonicTrace down with it.
