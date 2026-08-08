# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current Studio milestone: `0.6.0` / Build `12` / Phase 4B.2C guarded lyrics save

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

Metadata / CORS checkpoints:

- Studio + LaunchPAD/Track Manager: `safety/pre-cors-hotfix-20260808-1540`
- Studio + LaunchPAD/Track Manager: `safety/pre-4b1b-metadata-write-20260808-1612`
- Studio + LaunchPAD/Track Manager: `safety/post-v5.11-pre-build9-20260808-1732`
- Studio + LaunchPAD/Track Manager: `safety/post-metadata-write-proven-20260808-1822`

Lyrics / final-Phase-4 checkpoints:

- Studio + LaunchPAD/Track Manager: `safety/pre-4b2-lyrics-write-20260808-1837`
- Studio + LaunchPAD/Track Manager: `safety/post-v5.12-pre-phase4-complete-20260808-1945`
- Studio: `safety/pre-build12-lyrics-ui-20260808-1948`
- LaunchPAD + Track Manager: `safety/pre-v5.13-phase4-ops-20260808-1948`

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
11. verify the deployed surface before opening the next riskier capability.

## Current production backend

Public LaunchPAD:

- Build `2026.08.08.66`;
- release `studio-metadata-validation-20260808`;
- public Worker `v2.6` unchanged.

Private Track Manager:

- Track Manager `v5.12`;
- Studio bridge `v1.4`;
- merge SHA `98504263dac8a5f284337fe7e26fa6c808ad75e3`;
- deployment workflow run `31270132063`;
- deployment target `admin` only;
- Worker Version ID `3aa3136f-492d-46c5-af0a-fd3b048e8666`;
- Cloudflare Access protection confirmed (`302` unauthenticated);
- public Worker deployment steps skipped.

## Production proof — metadata

Real-browser metadata smoke test on `soft-addiction` completed successfully and was restored cleanly.

Temporary revision: `2026-08-08T16:21:15.503Z`  
Restored revision: `2026-08-08T16:22:10.890Z`

Final state: quality `ready`, publishable `Yes`, errors/warnings `0 / 0`, media untouched.

## Build 12 lyrics boundary

Build 12 activates the dedicated v5.12 lyrics API while keeping it isolated from all other asset writes.

Active Studio write families become:

```text
metadata
lyrics
```

Required invariants:

- canonical source is `lyrics.txt`;
- `.lrc` remains optional and is never required for synchronized state;
- GET returns protected canonical text + R2 ETag;
- validate/save require both `expectedUpdatedAt` and `expectedLyricsEtag`;
- validation is non-mutating;
- save requires explicit user confirmation;
- backend performs lyrics/manifest/catalog verification and compensating rollback;
- Studio performs a second canonical lyrics + track reread;
- no missing-file creation through the v5.12 dedicated lyrics route;
- no audio, cover, thumbnail, video, delete or arbitrary metadata mutation from the lyrics module;
- no autosave or keyboard-shortcut save.

## Remaining Phase 4 write boundary

Phase 4 is not complete after Build 12. The final operational bridge may add only the Track Manager operations named by the roadmap:

- track creation;
- audio/cover/thumbnail/video/lyrics TXT upload or replacement;
- individual asset deletion;
- explicit catalog rebuild;
- upload progress and destructive confirmations in Studio.

The old Track Manager stays available as a fallback until the final Studio surface is deployed.

Whole-track deletion is not required by the roadmap criterion and must not be added merely because the legacy Track Manager has such a route.

## Security safety

- no Cloudflare Access secret in GitHub Pages;
- no permanent browser admin token;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser uses the existing Cloudflare Access session with `credentials: include`;
- guarded JSON control POSTs use CORS-simple `text/plain` transport;
- file upload should use safelisted multipart FormData without custom request headers so Cloudflare Access preflight problems are not reintroduced;
- every operation must verify the deployed bridge capability before calling it;
- no direct browser access to R2 credentials;
- existing Track Manager same-origin write routes remain intact as fallback.

## Real-browser / production gates

CI and Wrangler dry-run are necessary but not sufficient for narrow writes that can be tested reversibly.

For destructive/media operations where a production smoke test would itself risk real catalog assets, contract tests, dry-run assembly and explicit UI confirmation are preferred until the user intentionally supplies a safe test asset/track. Do not invent or delete real media merely to claim a smoke test.

## Rollback principle

If a regression appears:

1. stop the next phase immediately;
2. do not perform unrelated media/catalog edits to compensate;
3. revert the affected Studio PR if the client/UI is at fault;
4. if backend-only, redeploy the private/admin Worker from a known-good commit or safety branch;
5. prefer `safety/post-v5.12-pre-phase4-complete-20260808-1945` for the current pre-final-Phase-4 state;
6. prefer `safety/post-metadata-write-proven-20260808-1822` for the last fully production-smoke-proven write boundary;
7. verify standalone Track Manager, LaunchPAD, LRC Maker and SonicTrace independently before resuming.

## Stop line

When roadmap Phase 4 is complete, **stop before Phase 5**. No SonicTrace/Catalog Intelligence persistence work begins without new user instructions.

The objective is simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
