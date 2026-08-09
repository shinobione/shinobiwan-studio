# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current Studio release: `0.10.7` / Build `29` / codename `phase-ux-integration-parity-c1`

This policy is mandatory for work affecting LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

## Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## Frozen Phase 6 baseline

Phase 6 was production-validated before this hardening milestone.

```text
Studio
  0.9.5 / Build 20
  closeout SHA 00b4504779ec6220d97564965309ef7a9ef20887

LRC Maker
  6.3.4 validated baseline
  SHA 8bd3f3fd52acc1217a65216541c0b7e40fcab5ba

Track Manager / LaunchPAD backend
  Track Manager v5.15 / Studio bridge v1.7
  Phase 6 backend SHA 23a7b494b89d4958f573f0889057b53a44aa23b6
  deployment run 31288949405
  target admin

Final Phase 6 checkpoint
  safety/phase6-complete-20260809-0513
```

Post-Phase-6 hardening may advance documentation/tests/public UI versions, but it must not rewrite what constituted the validated Phase 6 checkpoint.

## Current public LaunchPAD maintenance baseline

The Track DNA release-date maintenance hotfix was delivered separately before hardening:

```text
LaunchPAD Build 2026.08.09.67
release post-phase6-track-dna-release-date-20260809
merge 20674c774e172b85c1468e480621391057d70754
GitHub Pages run 31311437062
public media Worker remains v2.6
```

This public hotfix did not deploy either Worker and did not mutate R2.

## Current PHASE UX C2 production overlay

The frozen Phase 6 baseline above remains an immutable historical checkpoint. The current production integration has advanced through a separate PHASE UX C2 lot:

```text
Studio
  0.10.7 / Build 29

LRC Maker
  6.3.6
  source 32345063353ab251690bf1fd728deb97b21c5ddf

Track Manager / LaunchPAD backend
  Track Manager v5.16 / Studio bridge v1.8
  source 1bbe0293e4e17968bb7e191f58e7ae1cdd95dadf
  deployment run 31324447727
  Worker Version ID 5a83c6dd-cfb4-4be6-ab8d-16b5c34bdc2b
  target admin
  public Worker unchanged v2.6
```

C2 real-user Lyrics smoke passed canonical playback, timestamp navigation, synchronized canonical `lyrics.txt` save and reread. Observed canonical-audio duration is request-scoped validation evidence only and never a second persisted duration authority. The final PHASE UX checkpoint remains uncreated; C3 is suspended pending C2.5; Phase 7 is not started.

## Restoration checkpoints

Rollback references are immutable snapshots and never development branches.

Most relevant current references:

```text
Final Phase 6:
  safety/phase6-complete-20260809-0513

Before Build 67 / hardening LaunchPAD work:
  safety/pre-post-phase6-hardening-20260809-1331
  safety/pre-post-phase6-hardening-build67-20260809-1342

Before Studio/LRC hardening:
  safety/pre-post-phase6-hardening-20260809-1342
```

Earlier Phase 4/5 snapshots remain preserved in Git history for historical rollback only.

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
12. verify a deployed dependency before enabling its consumer.

## Product boundaries

### LaunchPAD

LaunchPAD remains the public listening/PWA product. Public UI maintenance may advance its Build without implying a Worker deployment.

### Track Manager

Track Manager remains the protected production R2 write/admin authority and standalone fallback.

Current deployed private backend:

```text
Track Manager v5.16
Studio bridge v1.8
source SHA 1bbe0293e4e17968bb7e191f58e7ae1cdd95dadf
workflow run 31324447727
Worker Version ID 5a83c6dd-cfb4-4be6-ab8d-16b5c34bdc2b
deployment target admin
public Worker unchanged v2.6
```

### SonicTrace

SonicTrace remains the audio-intelligence compute engine. R2 sidecars hold durable catalog-linked analysis. No duplicate canonical WAV is stored in analysis persistence.

### LRC Maker

LRC Maker `6.3.6` is integrated as the real Lyrics engine and remains available standalone. It supplies observed canonical-audio duration evidence on the existing guarded C2 Lyrics routes while preserving the validated native interaction.

## Canonical lyrics boundary

This rule is non-negotiable:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                      = optional export/compatibility only
```

Consequences:

- a missing `.lrc` does not mean lyrics are unsynchronized;
- `.lrc` never contributes to Content Health;
- canonical save writes `lyrics.txt` through Track Manager only;
- synchronization save uses manifest revision + lyrics ETag stale guards;
- post-save canonical reread remains mandatory;
- client/backend text normalization is limited to optional BOM removal and line endings `CRLF`/`CR` → `LF`;
- real lyric differences remain blocking.

Final LRC interaction:

- simple click = selection only;
- double-click = explicit seek to existing timestamp;
- Space = timestamp selected line then select next line.

## Studio write boundary

Studio uses specialized, domain-scoped routes. Do not create a generic arbitrary cross-origin `saveTrack()` replacement.

Existing families include:

```text
metadata validate/save
canonical lyrics validate/save
track create
per-asset upload/delete
explicit catalog rebuild
SonicTrace sidecar save/read
Lyrics context + synchronization validate/save
```

Whole-track deletion remains outside the Studio bridge.

## Cloudflare Access / CORS safety

- no Cloudflare Access secret in GitHub Pages;
- no R2 credential in GitHub Pages;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser JSON-like control POSTs use the established simple-request `text/plain;charset=UTF-8` transport where required;
- multipart uploads use browser-generated `FormData` without custom headers;
- every private operation is gated behind the deployed capability/Access boundary;
- unrelated legacy Track Manager writes retain same-origin enforcement;
- no PUT/PATCH/DELETE client is added to Studio merely for convenience.

## Protected media safety

Private canonical media reads used by Studio retain Cloudflare Access and exact-origin CORS while supporting single byte ranges (`206` / `416`) for reliable HTML media seeking.

Range support is a transport capability. It must not reintroduce the retired LRC Maker simple-click seek behavior.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof before any deliberate production mutation:

- source-scope guard;
- Worker assembly/syntax validation;
- generated bundle verification;
- Wrangler dry-run;
- Cloudflare Access verification;
- LaunchPAD regression CI;
- Studio/LRC builds and behavioral guards;
- stale checks;
- transaction compensation;
- explicit UI confirmation.

Use an intentionally disposable draft if deeper destructive media smoke testing is required later.

## Version / deployment discipline

Treat as separate facts:

1. code merged;
2. GitHub Pages/static host deployed;
3. Worker deployed;
4. R2/catalog data changed.

For private Track Manager-only Worker changes, prefer:

```text
target = admin
confirm = DEPLOY
```

Never use `both` without an explicit reason that both Worker surfaces changed.

A public LaunchPAD UI build does not imply Worker redeployment. A private Worker version does not require an artificial public LaunchPAD build bump.

## Rollback principle

If a regression appears:

1. stop the next integration step;
2. do not compensate with unrelated media/catalog edits;
3. revert the responsible PR first where possible;
4. redeploy only the affected Worker from a known-good source if backend-only;
5. use the relevant immutable safety branch only when a normal revert is insufficient;
6. independently verify LaunchPAD, Track Manager, SonicTrace, LRC Maker and Studio before resuming.

## Stop line

**Phase 6 is complete. Post-Phase-6 hardening is maintenance, not Phase 7.**

Phase 7 must not be implemented, scaffolded, partially prepared, branched or deployed without a new explicit user authorization.

The objective remains simple: integration may fail locally or in CI, but a maintenance change must never take LaunchPAD, Track Manager, SonicTrace or LRC Maker down with it.
