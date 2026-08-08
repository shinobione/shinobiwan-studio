# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio integration milestone: `0.4.2` / Build `7` / Phase 4B.1A metadata validation preview

This policy is mandatory for all work that can affect LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

## 1. Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## 2. Restoration snapshots

Baseline snapshots created before Studio integration:

- Studio: `safety/pre-integration-20260808-1048`
- LaunchPAD + Track Manager: `safety/pre-studio-integration-20260808-1048`
- SonicTrace: `safety/pre-studio-integration-20260808-1048`
- LRC Maker: `safety/pre-studio-integration-20260808-1048`

Fresh snapshots created immediately before the metadata-validation CORS hotfix:

- Studio: `safety/pre-cors-hotfix-20260808-1540`
- LaunchPAD + Track Manager: `safety/pre-cors-hotfix-20260808-1540`

These branches are rollback references and must not be used as development branches.

## 3. Mandatory change sequence

For every integration step:

1. inspect the current production branch and its version/build rules;
2. create or refresh a safety snapshot before a new risky boundary;
3. create a dedicated feature/fix branch from the current production branch;
4. make the smallest independently reversible change;
5. update version/build metadata and documentation in the affected repository;
6. add or extend a regression guard when the step affects an API/security boundary;
7. open a dedicated PR describing scope, risks, dependencies and rollback;
8. run repository-native validation/CI;
9. do not merge on red CI;
10. merge only the validated PR;
11. keep source merge, web deployment, Worker deployment and R2/catalog publication as distinct states;
12. verify the deployed surface before starting the next risky dependency.

## 4. Cross-repository rule

A feature requiring changes in several repositories must be split into separate PRs and deployed in dependency order.

Reference sequence already proven:

### Phase 4A — private reads

1. LaunchPAD/Track Manager Build 65 added the GET-only bridge in PR #157;
2. all LaunchPAD/Worker CI passed;
3. only the private/admin Worker was deployed and verified as Access-protected;
4. Studio Build 5 consumed that already-deployed contract in its own PR;
5. real Chrome testing confirmed `PRIVATE READ`.

### Phase 4B.1A — metadata validation

1. LaunchPAD Build 66 / Track Manager v5.9 added one exact non-mutating metadata-validation POST in PR #158;
2. Worker CI, bundle verification and Wrangler dry-run passed before merge;
3. only the private/admin Worker was deployed;
4. Studio Build 6 consumed the endpoint in a separate PR;
5. real Chrome testing then exposed a preflight-specific failure while private GETs remained healthy;
6. LaunchPAD/Track Manager PR #159 introduced the backward-compatible v5.10 / bridge v1.2 no-preflight transport;
7. the v5.10 private Worker was deployed admin-only and verified Access-protected;
8. Studio Build 7 consumes that already-deployed transport in a separate PR.

Never merge coordinated breaking changes in two repositories at the same time.

## 5. Data safety

- R2 remains the canonical media/catalog source of truth.
- No migration may delete or rewrite canonical media as a prerequisite.
- New Studio features must prefer additive fields/endpoints.
- Existing Track Manager workflows remain available as fallback until the replacement path is proven.
- SonicTrace analysis persistence must not duplicate source WAV files unnecessarily.
- Lyrics synchronization must not create two competing canonical lyric files.
- A Studio read/validation failure must not trigger a catalog rebuild, manifest rewrite or media repair automatically.
- Timestamped canonical `lyrics.txt` is already synchronized; `.lrc` is optional compatibility/export data.
- Phase 4B.1A is validation-only: metadata proposals may be normalized/quality-checked but must not be persisted.
- `catalog/index.json` must not be rebuilt as a side effect of validation.

## 6. Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent admin token in browser code;
- CORS changes must use explicit allowed origins, never `*` for credentialed private access;
- current Track Manager Studio origin is exactly `https://shinobione.github.io`;
- browser calls may send the user's existing Access cookies with `credentials: include`, but Studio must not manufacture or store those credentials;
- existing Track Manager production writes remain protected by their historical same-origin boundary unless a future route is separately reviewed and versioned;
- current Studio bridge advertises `write: []`;
- current Studio client keeps `adminService.writesEnabled = false`;
- Phase 4B.1A exposes exactly one cross-origin POST and it is validation-only: `/api/studio/tracks/<trackId>/metadata/validate`;
- metadata validation requires `expectedUpdatedAt` and rejects stale canonical state with `STALE_MANIFEST`;
- metadata fields are whitelist-only;
- Studio Build 7 uses `Content-Type: text/plain;charset=UTF-8` and places `intent: metadata-validate-v1` in the JSON-text body so the browser request remains CORS-safelisted;
- Studio Build 7 must not send `X-Shinobiwan-Studio-Intent` or validation `Content-Type: application/json`, because those recreate the OPTIONS preflight that failed behind Cloudflare Access in real Chrome;
- destructive actions require a future separate security-reviewed phase, explicit UI confirmation, server-side authorization and rollback plan.

## 7. Current production boundary

Public application:

- LaunchPAD build: `2026.08.08.66`;
- LaunchPAD release: `studio-metadata-validation-20260808`;
- public Worker: `v2.6`;
- public Worker was not redeployed for the v5.10 hotfix.

Private Track Manager:

- Track Manager contract: `v5.10`;
- Studio bridge contract: `v1.2`;
- hotfix PR: `#159`;
- merge commit: `c7cf9ae7ad78e6407dfc6950b3c5a558e2f7bb0b`;
- deployed private Worker Version ID: `5ac91e36-9060-4e05-a76c-67c46459c72d`;
- deployment workflow run: `31260738818`;
- deployment target: `admin` only;
- public Worker deploy steps: skipped;
- R2/catalog rebuild: not performed;
- post-deploy smoke: Cloudflare Access protection confirmed (`302` unauthenticated).

Studio Build 7 remains a **consumer** of that backend. It cannot save metadata or mutate production data.

## 8. Browser-validation rule

CI/dry-run proves source contracts; it does not replace real-browser verification of Cloudflare Access cookie/CORS behavior.

Therefore every newly exposed browser method must pass this sequence before the next risky phase:

1. authenticate normally in Track Manager;
2. confirm Studio reports `PRIVATE READ`;
3. exercise the new browser method;
4. confirm the response is the expected Worker JSON rather than an Access/preflight/network failure;
5. confirm no production write occurred unless the phase explicitly intended and separately authorized one.

Build 6 failing step 3 while step 2 passed is the reference example for why this rule is mandatory.

## 9. Rollback principle

If an integration step causes a regression:

1. stop the next phase;
2. revert only the affected repository/PR;
3. verify the original standalone tool still works;
4. if the regression is backend-only, redeploy only the private/admin Worker from the known-good source;
5. use the safety branch only if a normal PR revert is insufficient;
6. do not mutate R2 to compensate for a code-only failure.

For Studio Build 7 specifically:

- reverting the Studio PR returns the client to Build 6;
- the Track Manager v5.10 endpoint can remain deployed safely because it is backward-compatible and non-mutating;
- if v5.10 itself regresses Track Manager, redeploy admin-only from `safety/pre-cors-hotfix-20260808-1540`;
- no R2 rollback is expected.

The goal is that Studio integration can fail without taking LaunchPAD, Track Manager, LRC Maker or SonicTrace down with it.
