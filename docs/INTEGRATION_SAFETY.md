# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-15  
Current accepted Studio release: `v0.19.4` / Build `82` / REAL USER PASS

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
  v0.19.4 / Build82 / REAL USER PASS
  runtime merge 7a0d52fcc0bf862478c459f0648afc1c6690b34f
  runtime Pages 31854528438 / SUCCESS
  browser smoke BUILD82 PASS / 2026-08-15

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

Historical Phase6/Phase7/Phase8 checkpoints remain immutable history; this overlay states current production truth only.

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

A retry may be presented as safe only when canonical reread proves the pre-write revision/state is unchanged.

A lost-response write may be recovered as success only when the operation-specific canonical postcondition is positively verified.

Public fallback can never perform this verification.

### Build82 accepted scope

Build82 applies this policy only to destructive asset deletion:

- Track asset delete;
- Album asset delete.

For both, recovery requires exact private canonical reread and asset absence; ambiguous/unverified states explicitly forbid blind retry. Normal success also requires verified post-write revision plus asset absence.

Build82 is **REAL USER PASS** after the 2026-08-15 browser regression smoke.

Do not silently generalize Build82 into retries for metadata, lyrics, SonicTrace or other Album writes. Those require separate bounded audits.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video, Album cover or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof:

- source-scope guard;
- typecheck/build;
- stale checks;
- canonical reread logic;
- explicit UI confirmation;
- disposable Draft asset only if a deliberate destructive browser smoke is truly required.

## Version / deployment discipline

Treat separately:

1. code merged;
2. GitHub Pages deployed;
3. Worker deployed;
4. R2/catalog data changed;
5. real-user acceptance recorded.

For private Track Manager-only Worker changes, prefer `target=admin` and `confirm=DEPLOY`. Build82 required no Worker deployment.

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

**Build82 is the accepted Studio REAL USER PASS baseline. Phase9 is active. Build83 remains UNUSED until a fresh bounded audit proves the smallest next reliability scope. Track Manager v5.23 / bridge1.13 remains the sole deployed protected write authority.**
