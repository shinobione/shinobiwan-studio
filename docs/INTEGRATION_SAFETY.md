# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-15  
Current accepted Studio release: `v0.19.6` / Build `84` / REAL USER PASS

This policy is mandatory for work affecting LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

For short current state, read root `PROJECT_STATE.md` first. This file contains the detailed safety contract.

## Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## Current production overlay

```text
Studio
  v0.19.6 / Build84 / REAL USER PASS
  exact tested head 377de51416d4aea258830e55e894707d9f3f6512
  runtime CI 31858911420 / SUCCESS
  runtime merge b7cf745e11adee1eb77900a32b9b6ca8ea80e000
  runtime Pages 31858977765 / SUCCESS
  browser smoke BUILD84 PASS / 2026-08-15
  Worker deploy NONE
  R2 migration/write NONE caused by deployment

LaunchPAD
  2026.08.12.102 / REAL USER PASS

Track Manager / LaunchPAD backend
  Track Manager v5.23 / Studio bridge v1.13
  deployment run 31842482166 / SUCCESS / target admin
  Worker Version ID 439a1ce4-e458-427d-9fd6-61e888efd269
  public Worker v2.7 unchanged

SonicTrace
  V2-E Build08 / REAL USER PASS
  Deep Audio 2.0.3-alpha

LRC Maker
  6.3.8
```

Historical Phase6/Phase7/Phase8 and earlier Phase9 checkpoints remain immutable history; this overlay states current accepted production truth only.

## Restoration checkpoints

Most relevant current references:

```text
Accepted Build81 runtime/docs:
  safety/post-build81-real-user-pass-20260815-0159
  safety/post-build81-rup-docs-closeout-20260815-0208

Before Phase9 Build82:
  safety/pre-phase9-destructive-ambiguity-build82-20260815-0216

After Build82 deployment candidate:
  safety/post-build82-deployed-candidate-20260815-0248

Before Phase9 Build83:
  safety/pre-phase9-lyrics-response-loss-build83-20260815-0319

After Build83 real-user acceptance:
  safety/post-build83-real-user-pass-20260815-0406
  safety/post-build83-rup-docs-closeout-20260815-0412

Before Phase9 Build84:
  safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413

After Build84 deployment candidate:
  safety/post-build84-deployed-candidate-20260815-0425
  safety/post-build84-candidate-docs-closeout-20260815-0429

After Build84 real-user acceptance:
  safety/post-build84-real-user-pass-20260815-0435
```

Earlier accepted safety branches remain preserved in Git history.

## Mandatory sequence

For every risky integration step:

1. inspect current production branch and version/build rules;
2. create a fresh safety snapshot when crossing a new runtime/write/security boundary;
3. use a dedicated feature branch;
4. make the smallest independently reversible change;
5. update version/build metadata and relevant documentation;
6. add or extend regression guards;
7. open a dedicated PR with dependency and rollback notes;
8. run repository-native CI;
9. never merge red CI;
10. merge only the exact tested head;
11. keep source merge, web deployment, Worker deployment and R2/catalog mutation as distinct states;
12. verify a deployed dependency before enabling its consumer;
13. record REAL USER PASS separately when the roadmap requires browser validation.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Product boundaries

### LaunchPAD

LaunchPAD remains the public listening/PWA product. Public UI maintenance may advance its Build without implying a Worker deployment.

### Track Manager

Track Manager remains the protected production R2 write/admin authority and standalone fallback.

Current private backend:

```text
Track Manager v5.23
Studio bridge v1.13
workflow run 31842482166 / SUCCESS / admin only
Worker Version ID 439a1ce4-e458-427d-9fd6-61e888efd269
public Worker v2.7 unchanged
```

### SHINOBIWAN Studio

Studio remains the private orchestrator, never a second canonical write authority.

Build83 changes only client-side canonical Lyrics save response-loss classification/recovery.

Build84 changes only client-side SonicTrace **save response-loss classification and canonical verification**. It does not alter the Deep Audio analysis computation, the Track Manager route semantics, Workers or R2 schema/data.

### SonicTrace

SonicTrace remains the audio-intelligence compute engine. R2 sidecars hold durable catalog-linked analysis. No duplicate canonical WAV is stored in analysis persistence.

### LRC Maker

LRC Maker remains the lyrics synchronization engine against the canonical TXT authority.

## Canonical lyrics boundary

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

Canonical save uses Track Manager only, with manifest revision + lyrics ETag stale guards and private reread verification.

Build83 accepted bounded lost-response recovery:

```text
Lyrics save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of lyrics + Track manifest
   ├─ new revision + new ETag + exact requested normalized text
   │    → COMMITTED / VERIFIED
   ├─ same revision + same ETag
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ changed but exact postcondition is not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

## SonicTrace persistence boundary

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

The deployed Track Manager already owns this write transaction shape:

```text
write history/<analysisId>.json
→ write latest.json
→ reread BOTH
→ verify exact analysisId
→ return success
→ attempt rollback if verification/write fails
```

Build84 does not change that backend contract. It adds Studio-side truth after a lost HTTP response:

```text
SonicTrace save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of latest + history
   ├─ requested analysisId in BOTH
   │    → COMMITTED / VERIFIED
   ├─ requested analysisId in NEITHER
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ requested analysisId in only one
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Before POST, Studio also rejects an already-canonical `analysisId` and a stale source-audio revision. Normal HTTP success requires exact `analysisId` presence in both sidecars before Studio calls the save verified.

Build84 is **REAL USER PASS** after the explicit 2026-08-15 normal-browser regression verdict.

## Album authority boundary

```text
albums/<album-id>/manifest.json
ordered album.trackIds = sole membership + artistic-order authority
```

Track-side `album` metadata is compatibility cache only. Generic Track metadata writes must never mutate Album membership independently of guarded Album operations.

## Studio write boundary

Studio uses specialized, domain-scoped routes. Never create a generic arbitrary cross-origin `saveTrack()` or generic R2 writer.

Existing families include:

```text
metadata validate/save
canonical lyrics validate/save
track create
per-asset upload/delete
explicit catalog rebuild
SonicTrace sidecar save/read
Album metadata/membership/media guarded operations
```

Whole-track deletion remains outside the Studio bridge.

## Cloudflare Access / CORS safety

- no Cloudflare Access secret in GitHub Pages;
- no R2 credential in GitHub Pages;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser JSON-like control POSTs use established `text/plain;charset=UTF-8` simple-request transport where required;
- multipart uploads use browser-generated `FormData` without forced `Content-Type`;
- every private operation is capability/Access gated;
- public fallback is read-only and never verifies a write;
- no PUT/PATCH/DELETE browser method is introduced merely for convenience.

## Ambiguous-write policy — Phase9 authority

A lost HTTP response does **not** prove whether a write committed.

For any write hardened under Phase9:

```text
write response lost / timeout
→ NEVER automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

A retry may be presented as safe only when canonical reread proves the exact operation-specific pre-write state/postcondition allows it.

A lost-response write may be recovered as success only when the operation-specific canonical postcondition is positively verified.

Public fallback can never perform this verification.

### Build82 accepted scope

Build82 applies this policy to destructive asset deletion:

- Track asset delete;
- Album asset delete.

For both, recovery requires exact private canonical reread and asset absence; ambiguous/unverified states explicitly forbid blind retry. Normal success also requires verified post-write revision plus asset absence.

Build82 is **REAL USER PASS**.

### Build83 accepted scope

Build83 applies the same authority principle, with Lyrics-specific postconditions, to canonical `lyrics.txt` save response loss.

Recovered success requires all of:

- new Track manifest revision;
- new Lyrics ETag;
- exact requested normalized canonical text.

Build83 is **REAL USER PASS** after explicit normal-browser regression acceptance.

### Build84 accepted scope

Build84 applies the same authority principle to SonicTrace analysis persistence using the unique requested `analysisId` across canonical latest + history.

Recovered success requires the requested ID in both sidecars. Explicit retry safety requires the ID to be absent from both. Partial presence is ambiguous and unsafe to retry.

Build84 is **REAL USER PASS** after explicit normal-browser regression acceptance. Do not generalize it into Album-write retry behavior; broader Album writes require their own bounded audit.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video, Album cover or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof:

- source-scope guard;
- typecheck/build;
- stale checks;
- canonical reread logic;
- explicit UI confirmation;
- disposable Draft asset only if a deliberate destructive browser smoke is truly required.

Build84 acceptance did **not** require deliberately cutting network/Access during a production SonicTrace save just to manufacture response loss. A normal analysis/save was sufficient for regression acceptance.

## Version / deployment discipline

Treat separately:

1. code merged;
2. GitHub Pages deployed;
3. Worker deployed;
4. R2/catalog data changed;
5. real-user acceptance recorded.

For private Track Manager-only Worker changes, prefer `target=admin` and `confirm=DEPLOY`.

Build82, Build83 and Build84 required no Worker deployment. Build84 Pages deployment caused no intentional R2 schema/data migration.

Docs-only governance/closeout work does not create a new Studio build.

## Rollback principle

If a regression appears:

1. stop the next integration step;
2. do not compensate with unrelated media/catalog edits;
3. revert the responsible PR first where possible;
4. redeploy only the affected Worker from known-good source if backend-only;
5. use immutable safety branches only when normal revert is insufficient;
6. independently verify LaunchPAD, Track Manager, SonicTrace, LRC Maker and Studio before resuming.

## Stop line

**Build84 is the accepted Studio REAL USER PASS baseline. Phase9 remains active, but Build85 is UNALLOCATED until a fresh bounded audit proves the next smallest reliability scope. Track Manager v5.23 / bridge v1.13 remains the sole deployed protected write authority.**
