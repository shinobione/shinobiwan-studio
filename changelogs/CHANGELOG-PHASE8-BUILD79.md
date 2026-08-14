# SHINOBIWAN Studio v0.19.3 · Build 79

Codename: `studio-focus-slice4-phase8-album-publish-truth`  
Date: 2026-08-14  
Status: **MERGED + DEPLOYED CANDIDATE · REAL-USER BROWSER SMOKE PENDING**

## Why Build79 exists

A real browser smoke on `Pulse Dominion` exposed a false-positive Album status save:

- the editor requested `Draft → Published`;
- the canonical revision advanced;
- Studio displayed `Album metadata saved and canonically reread.`;
- the canonical Album header still reported `DRAFT`;
- the form later reset to `Draft`;
- no useful publication blocker remained visible.

Two Studio defects were confirmed:

1. Album metadata client verification checked revision/tracklist but did not compare requested metadata fields such as `status` to the canonical reread;
2. mutation error handling set the error and then called `load()`, whose successful reread cleared the error immediately.

The backend already owned the Album publication quality rules. Build79 does not weaken or duplicate them.

## Build79 corrective

### Structured publication blockers

Studio now preserves the Worker `quality` payload and translates failed checks into human feedback, including:

- missing Album title;
- empty canonical tracklist;
- missing Album cover;
- broken Track references;
- member Tracks that are not yet Published, including Track title and current status when available.

### Strict canonical metadata verification

After a successful metadata response, Studio rereads the canonical Album and compares every requested metadata field. A requested `status: published` that rereads as `draft` is now a hard verification failure with an explicit mismatch message.

A status change only receives a green success notice when the requested status survived the canonical reread.

### Errors survive canonical reload

On failure, Studio now reloads the canonical Album first and restores the human error after the reread. The reread can no longer erase `ALBUM_QUALITY_BLOCKED` or verification details.

## Track Manager v5.23 / bridge v1.13 corrective

TM5.23 keeps all existing Album publication rules and adds a second verification layer server-side:

- strict metadata reread comparison after Album metadata save, including `status`;
- a successful write cannot be reported if the canonical reread differs;
- rollback response includes `verificationDetail` when verification fails;
- existing publication quality gate remains unchanged;
- no new Album write route;
- Public Worker remains v2.7.

Exact backend receipts:

```text
TM PR                    LaunchPAD #237
TM tested head           a1fe4c8dd0df78d0dbb2bde418ccaed294290266
TM PR CI                 31841695779 · SUCCESS · LaunchPAD
                          31841695805 · SUCCESS · Workers dry-run
                          31841695814 · SUCCESS · Overflow
TM merge                 bc82fea12edc7cbd1b7b054c697a553694e76322
Admin deploy run         31842482166 · SUCCESS · target=admin
Admin Worker Version ID  439a1ce4-e458-427d-9fd6-61e888efd269
Admin verify             PASS · protected Access response
Public Worker deploy     SKIPPED
Public Worker            v2.7 unchanged
TM safety pre            safety/pre-tm523-album-publish-truth-20260814-2300
```

## Studio Build79 receipts

The first two PR CI attempts were intentionally not merged:

```text
Initial CI        31842069225 · FAILURE
Cause             inherited Build64 literal backend-version guard
Correction        guard updated to the bounded TM5.23 / bridge1.13 successor

Second CI         31842657314 · FAILURE
Cause             TypeScript dynamic-key indexing in strict reread detail
Correction        typed metadata mismatch keys
```

Final exact receipts:

```text
Studio PR               #119
Final tested head        13e29763e2cced348057814c28f0623b5def3444
Final CI                 31842783733 · SUCCESS
Runtime merge            128b5c4397cb6f3b8e9eda7cac035d5b5c40afe5
Pages                    31842865337 · SUCCESS · exact runtime merge SHA
Safety pre               safety/pre-build79-album-publish-truth-20260814-2300
Safety post-deploy       safety/post-build79-deployed-candidate-20260814-2333
Real-user smoke          PENDING
```

## Safety / release truth

```text
Accepted Studio baseline       Build75 REAL USER PASS
Build76                        functional candidate · NOT RUP
Build77                        visual candidate · superseded
Build78                        comprehension candidate · superseded by Build79
Build79                        DEPLOYED CANDIDATE · NOT RUP YET
Track Manager                  v5.23 · DEPLOYED
Studio bridge                  v1.13
TM Worker Version ID           439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker                  v2.7 unchanged
New Album write route          NONE
Album publish rules weakened   NO
R2 migration/manual mutation   NONE
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Browser smoke required

1. hard refresh Studio;
2. open the Album that reproduced the problem (`Pulse Dominion` if still appropriate);
3. request `Draft → Published`;
4. if quality blocks publication, Studio must keep the Album canonical status truthful and show the exact blocker(s) visibly;
5. if all publication checks are satisfied, the canonical Album header and form must reread as `PUBLISHED` and only then show the green success notice;
6. no error may disappear merely because the canonical reread succeeds;
7. Public Worker/public fallback must remain unable to perform or verify the protected write.

Only an explicit browser PASS may promote Build79 to REAL USER PASS.
