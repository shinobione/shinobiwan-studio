# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-15  
Current accepted Studio release: `v0.19.4` / Build `82` / REAL USER PASS  
Current deployed Studio candidate: `v0.19.5` / Build `83` / REAL USER SMOKE PENDING

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
Studio accepted
  v0.19.4 / Build82 / REAL USER PASS
  runtime merge 7a0d52fcc0bf862478c459f0648afc1c6690b34f
  runtime Pages 31854528438 / SUCCESS
  browser smoke BUILD82 PASS / 2026-08-15

Studio deployed candidate
  v0.19.5 / Build83 / REAL USER SMOKE PENDING
  exact tested head beff9fc58c58e36ce2c2082f7bd5c041641a5e12
  runtime CI 31856653579 / SUCCESS
  runtime merge b168d8cda805e5c50480a3e26c5d52e490fb7ac6
  runtime Pages 31856698097 / SUCCESS
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

Historical Phase6/Phase7/Phase8 checkpoints remain immutable history; this overlay states current production/deployed-candidate truth only.

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

After Build83 deployment candidate:
  safety/post-build83-deployed-candidate
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

Studio remains the private orchestrator. Build83 changes only client-side Lyrics write ambiguity classification/recovery; it does not add a backend write authority, Worker deployment or R2 migration.

Build83 failure rule:

```text
lost Lyrics save response
→ no blind retry
→ private canonical reread
→ exact operation-specific commit-state classification
```

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

A Studio Lyrics save remains protected by Track Manager stale/revision/ETag semantics and private canonical reread. If the HTTP response is lost, Build83 may call the operation committed only when private reread proves the exact requested normalized text at a new manifest revision and new Lyrics ETag. Unchanged revision + ETag may be retry-safe; changed-but-unproven or unreadable state must not be retried blindly.

## Album authority boundary

```text
albums/<album-id>/manifest.json = canonical Album object
album.trackIds                  = sole membership / artistic-order authority
track.album                     = compatibility/cache only
```

Generic Track metadata must not independently create, move or reorder Album membership.

## Ambiguous write rule

For any write where the request may have reached the protected authority but the response is lost:

- do not infer failure from transport failure;
- do not infer success from intent;
- do not automatically retry unless canonical reread proves the exact operation did not commit and retry is safe;
- use operation-specific canonical postconditions;
- if causality remains unclear, expose `AMBIGUOUS / DO NOT RETRY`;
- if canonical reread is unavailable, expose `UNVERIFIED / DO NOT RETRY`.

## Current acceptance boundary

Build82 is accepted. Build83 is deployed but pending normal browser regression smoke. A lost-response production fault injection is **not** required for Build83 acceptance; do not manufacture destructive or ambiguous conditions against important production Lyrics merely to demonstrate the guard.
