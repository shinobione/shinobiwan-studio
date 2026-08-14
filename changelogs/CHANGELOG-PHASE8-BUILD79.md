# SHINOBIWAN Studio v0.19.3 · Build 79

Codename: `studio-focus-slice4-phase8-album-publish-truth`  
Date: 2026-08-14  
Status: **CANDIDATE — TM5.23 DEPLOY + BROWSER SMOKE REQUIRED**

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

The backend already owns the Album publication quality rules. Build79 does not weaken or duplicate them.

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

## Cross-stack dependency

Build79 targets:

```text
Track Manager   v5.23
Studio bridge   v1.13
```

TM5.23 keeps all existing Album publication rules, adds strict server-side metadata reread verification, and includes `verificationDetail` on rollback.

TM5.23 PR: LaunchPAD #237  
TM5.23 tested head: `a1fe4c8dd0df78d0dbb2bde418ccaed294290266`  
TM5.23 merge: `bc82fea12edc7cbd1b7b054c697a553694e76322`  
Admin Worker deployment: **PENDING manual workflow_dispatch**

## Safety

```text
Accepted Studio baseline       Build75 REAL USER PASS
Build76                        functional candidate · NOT RUP
Build77                        visual candidate · superseded
Build78                        comprehension candidate · superseded by Build79
Studio safety                  safety/pre-build79-album-publish-truth-20260814-2300
TM safety                      safety/pre-tm523-album-publish-truth-20260814-2300
Public Worker                  v2.7 unchanged
New Album write route          NONE
Album publish rules weakened   NO
R2 migration/manual mutation   NONE
```

`CI GREEN != TM DEPLOYED != STUDIO DEPLOYED CANDIDATE != REAL USER PASS`.
