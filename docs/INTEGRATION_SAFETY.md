# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Current release candidate: `0.7.0` / Build `13` / roadmap Phase 4 complete

This policy is mandatory for work affecting LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

## Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## Restoration checkpoints

Most relevant current references:

```text
Studio:    safety/pre-phase4-final-ui-20260808-2025
LaunchPAD: safety/pre-v5.13-phase4-ops-20260808-1948
Both:      safety/post-v5.12-pre-phase4-complete-20260808-1945
Both:      safety/post-metadata-write-proven-20260808-1822
```

Earlier baseline/CORS/write snapshots remain preserved in Git history. Safety branches are rollback references only and must never be developed on.

## Mandatory sequence

For every risky integration step:

1. inspect current production branch and version/build rules;
2. create a fresh safety snapshot when crossing a new write/security boundary;
3. use a dedicated feature branch;
4. make the smallest independently reversible change;
5. update version/build metadata and documentation;
6. add or extend regression guards;
7. open a dedicated PR with dependency and rollback notes;
8. run repository-native CI;
9. never merge red CI;
10. keep source merge, web deployment, Worker deployment and R2/catalog mutation as distinct states;
11. verify the deployed dependency before enabling its consumer.

## Public LaunchPAD boundary

Public LaunchPAD remains intentionally unchanged by final Phase 4 integration:

```text
Build 2026.08.08.66
release studio-metadata-validation-20260808
public Worker v2.6
```

No Audio Lab renderer, public player/media behavior, PWA cache contract, SonicTrace shortcut or LRC Maker shortcut is modified by Build 13/v5.13.

## Track Manager backend dependency

Final Phase 4 requires:

```text
Track Manager v5.13
Studio bridge v1.5
source merge df75509d89b1ed1477d4b249fab63a6bd41db311
```

The final Studio Build 13 must not merge until the protected admin-only v5.13 deployment has succeeded and its actual workflow run + Worker Version ID have been recorded.

Last proven deployed backend before v5.13:

```text
Track Manager v5.12
bridge v1.4
Worker Version ID 3aa3136f-492d-46c5-af0a-fd3b048e8666
workflow run 31270132063
```

## Production proof — metadata

Real-browser metadata smoke test on `soft-addiction` completed successfully and was restored cleanly.

```text
temporary revision 2026-08-08T16:21:15.503Z
restored revision  2026-08-08T16:22:10.890Z
final quality      ready
publishable        yes
errors/warnings    0 / 0
media              untouched
```

## Canonical lyrics boundary

- `lyrics.txt` is the canonical source;
- timestamps inside TXT define synchronized state;
- `.lrc` remains optional compatibility/export only;
- existing lyrics save requires manifest revision + R2 ETag;
- missing lyrics creation is handled only through the scoped Assets Manager TXT upload;
- LRC Maker remains separate and unchanged.

## Final Phase 4 management boundary

Build 13 may consume only bridge v1.5 `manage` capabilities:

```text
track-create
assets
catalog-rebuild
```

The asset family is limited to:

```text
audio
cover
thumbnail
lyrics
video
```

Required invariants:

- new tracks are draft-only;
- duplicate trackId is rejected;
- asset operations process one kind at a time;
- asset operations require canonical `expectedUpdatedAt`;
- uploads use existing Track Manager validation;
- multipart uploads use no custom request headers;
- XHR is used only to expose upload progress while retaining Access credentials;
- replace/delete keeps temporary R2 rollback material outside the track prefix;
- published-track quality guards remain authoritative;
- destructive asset delete requires explicit confirmation;
- explicit catalog rebuild requires explicit confirmation;
- backend verification is followed by Studio canonical reread;
- whole-track deletion is not exposed;
- generic legacy `saveTrack()` is not opened cross-origin;
- legacy Track Manager remains fallback.

## Security safety

- no Cloudflare Access secret in GitHub Pages;
- no R2 credential in GitHub Pages;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser uses the existing Access session with credentials;
- JSON control POSTs use CORS-simple `text/plain;charset=UTF-8`;
- uploads use browser multipart FormData without custom headers;
- every management operation checks the deployed capability first;
- unrelated legacy writes retain same-origin enforcement;
- no PUT/PATCH/DELETE client is added to Studio.

## Destructive/media verification policy

Do not mutate a real production WAV, cover or other catalog asset merely to prove that destructive/media code can mutate it.

For final Phase 4 management paths, acceptable pre-release proof is:

- source-scope guard;
- Worker assembly and syntax validation;
- generated bundle verification;
- Wrangler dry-run;
- LaunchPAD regression CI;
- Studio TypeScript/Vite build;
- capability gating;
- stale checks;
- transaction compensation;
- explicit UI confirmation.

If a disposable draft is intentionally supplied later, it can be used for deeper media smoke testing without risking canonical release assets.

## Rollback principle

If a regression appears:

1. stop immediately;
2. do not compensate with unrelated media/catalog edits;
3. revert the Studio PR if the consumer is at fault;
4. redeploy the private Worker from a known-good source/checkpoint if backend-only;
5. prefer `safety/pre-phase4-final-ui-20260808-2025` for the Studio pre-final state;
6. prefer `safety/pre-v5.13-phase4-ops-20260808-1948` for the backend pre-v5.13 state;
7. verify Track Manager, LaunchPAD, LRC Maker and SonicTrace independently before resuming.

## Stop line

After roadmap Phase 4 is complete, **STOP before Phase 5**.

No SonicTrace result persistence, embeddings, fingerprints, Catalog Intelligence, similarity, duplicate detection or outdated-analysis work begins without new user instructions.

The objective remains simple: Studio integration may fail, but it must not take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
