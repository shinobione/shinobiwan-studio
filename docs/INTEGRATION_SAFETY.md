# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-15  
Current accepted Studio release: `v0.19.14` / Build `92` / REAL USER PASS

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
  v0.19.14 / Build92 / REAL USER PASS
  exact tested head 2b859d831f5fc46eea9853f31c4b86057041128b
  final runtime CI 31893496536 / SUCCESS
  historical guard CI 31893447100 / FAILURE / Build80 seam assertion only / never merged
  runtime merge d0ca8b3aa4481c3217f79790e347000bfd22823a
  runtime Pages 31893652679 / SUCCESS
  candidate docs PR #159
  candidate docs CI 31894353160 / SUCCESS
  candidate docs merge f46b846841e6ef9ce705b2fa3817baecd0aecefa
  candidate docs Pages 31894411652 / SUCCESS
  acceptance docs PR PENDING
  acceptance docs merge PENDING
  acceptance docs Pages PENDING
  browser smoke BUILD92 PASS MADAFAKA / 2026-08-15
  Worker deploy NONE
  Track Manager change NONE
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
After Build83 acceptance:
  safety/post-build83-real-user-pass-20260815-0406
  safety/post-build83-rup-docs-closeout-20260815-0412

Before Phase9 Build84:
  safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
After Build84 deployment candidate:
  safety/post-build84-deployed-candidate-20260815-0425
  safety/post-build84-candidate-docs-closeout-20260815-0429
After Build84 acceptance:
  safety/post-build84-real-user-pass-20260815-0435
  safety/post-build84-rup-docs-closeout-20260815-0441

Before Phase9 Build85:
  safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
After Build85 deployment candidate:
  safety/post-build85-deployed-candidate-20260815-0602
  safety/post-build85-candidate-docs-closeout-20260815-0608
After Build85 acceptance:
  safety/post-build85-real-user-pass-20260815-0748
  safety/post-build85-rup-docs-closeout-20260815-0755

Before Phase9 Build86:
  safety/pre-phase9-album-move-response-loss-build86-20260815-0757
After Build86 deployment candidate:
  safety/post-build86-deployed-candidate-20260815-0808
  safety/post-build86-candidate-docs-closeout-20260815-0818
After Build86 acceptance:
  safety/post-build86-real-user-pass-20260815-0823
  safety/post-build86-rup-docs-closeout-20260815-0828

Before Phase9 Build87:
  safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
After Build87 implementation before PR:
  safety/post-build87-prepr-20260815-0844
After Build87 deployment candidate:
  safety/post-build87-deployed-candidate-20260815-0853
  safety/post-build87-candidate-docs-closeout-20260815-0901
After Build87 acceptance:
  safety/post-build87-real-user-pass-20260815-0903
  safety/post-build87-rup-docs-closeout-20260815-0912

Before Phase9 Build88:
  safety/pre-phase9-private-read-retry-build88-20260815-0916
After Build88 deployment candidate:
  safety/post-build88-deployed-candidate-20260815-0932
  safety/post-build88-candidate-docs-closeout-20260815-0942
After Build88 acceptance:
  safety/post-build88-real-user-pass-20260815-1253
  safety/post-build88-rup-docs-closeout-20260815-1304

Before Phase9 Build89:
  safety/pre-phase9-album-private-read-retry-build89-20260815-1307
After Build89 implementation before PR:
  safety/post-build89-prepr-20260815-1310
After Build89 deployment candidate:
  safety/post-build89-deployed-candidate-20260815-1319
  safety/post-build89-candidate-docs-closeout-20260815-1336
After Build89 acceptance:
  safety/post-build89-real-user-pass-20260815-1404
  safety/post-build89-rup-docs-closeout-20260815-1416

Before Phase9 Build90:
  safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
After Build90 implementation before PR:
  safety/post-build90-prepr-20260815-1424
After Build90 deployment candidate:
  safety/post-build90-deployed-candidate-20260815-1429
  safety/post-build90-candidate-docs-closeout-20260815-1440
After Build90 acceptance:
  safety/post-build90-real-user-pass-20260815-1512
  safety/post-build90-rup-docs-closeout-20260815-1524
  safety/post-build90-receipts-closeout-20260815-1528

Before Phase9 Build91:
  safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
After Build91 implementation before PR:
  safety/post-build91-prepr-20260815-1555
After Build91 deployment candidate:
  safety/post-build91-deployed-candidate-20260815-1559
  safety/post-build91-candidate-docs-closeout-20260815-1608
After Build91 acceptance:
  safety/post-build91-real-user-pass-20260815-1700
  safety/post-build91-rup-docs-closeout-20260815-1716
  safety/post-build91-receipts-closeout-20260815-1720

Before Phase9 Build92:
  safety/pre-phase9-track-metadata-response-loss-build92-20260815-1722
After Build92 implementation before PR:
  safety/post-build92-prepr-20260815-1740
After Build92 deployment candidate:
  safety/post-build92-deployed-candidate-20260815-1748
  safety/post-build92-candidate-docs-closeout-20260815-1803
After Build92 acceptance:
  safety/post-build92-real-user-pass-20260815-1819
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

Build85 changes only client-side canonical **Album metadata save** response-loss classification and verification. It does not alter Album create, membership/order, move, upload, asset-delete semantics, Track Manager, Workers or R2 schema/data.

Build86 changes only client-side canonical **Album move** response-loss classification and verification for Album→Album movement plus `sourceAlbumId:null` authority repair. It does not alter bulk membership save, create, upload/delete, Track Manager, Workers or R2 schema/data.

Build87 changes only client-side canonical **Album bulk membership / ordered tracklist save** response-loss classification and complete Album + affected Track-cache verification. It does not alter Album create, binary upload/delete, Track Manager, Workers or R2 schema/data.

Build88 changes only the core private Track Manager **GET** transport for bridge health, Track inventory and Track detail. It adds one bounded retry for timeout/transport/selected transient HTTP failures and changes no POST/write retry behavior, Track Manager route, Worker or R2 data/schema.

Build89 changes only canonical Album collection/detail private **GET** behavior. The same helper also serves private Album visual discovery and existing canonical Album rereads. Build89 changes no Album POST/write transport, no Track Manager route, no Worker and no R2 data/schema.

Build90 changes only canonical Lyrics private **GET** behavior. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `lyrics-validate-v1` or `lyrics-save-v1` POST behavior, no Build83 lost-response recovery rule, no Track Manager route, no Worker and no R2 data/schema.

Build91 changes only private Track Manager SonicTrace **GET** behavior for canonical latest/history state and the SonicTrace catalog. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `sonictrace-analysis-save-v1` POST behavior, no Build84 lost-response recovery rule, no Deep Audio health/analysis XHR, no canonical audio download behavior, no Track Manager route, no Worker and no R2 data/schema.

Build92 changes only Studio-side canonical Track **metadata save response-loss truth**. It repeats non-mutating validation immediately before the write, anchors the save to the exact reviewed proposal + revision, and classifies a lost timeout/transport response through private canonical Track reread. It changes no Track Manager route, Worker, R2 schema/data, Track create/assets, Album writes, Lyrics/SonicTrace writes or PWA/offline behavior.

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

### Build90 Lyrics private-read boundary — ACCEPTED

Build90 does not change the save transaction above. It changes only the canonical Lyrics GET used by normal loading and by the Lyrics side of Build83 verification/recovery rereads. Maximum attempts are two total; timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one retry; Access/CORS, ordinary deterministic 4xx, non-JSON gating and invalid JSON do not. Build90 is **REAL USER PASS**.

## Track metadata write boundary

Track Manager owns canonical Track metadata stale guarding, proposal application, manifest write, derived catalog rebuild, canonical reread and rollback attempts. Build92 adds Studio-side response-loss truth without changing that server transaction.

### Build92 Track metadata response-loss boundary — ACCEPTED

Immediately before the explicit write, Studio repeats the same non-mutating metadata validation against the exact expected Track revision. The exact normalized proposal becomes the operation-specific postcondition. If canonical audio evidence exists, already-supported derived `duration` is part of that proposal while remaining non-editable.

```text
Track metadata save response unavailable
→ NEVER blind automatic retry
→ private canonical Track reread
   ├─ new revision + exact reviewed normalized proposal
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry safe after reconnect
   ├─ changed revision but exact reviewed proposal unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Rules:

- only typed `TRACK_METADATA_SAVE_TIMEOUT` / `TRACK_METADATA_SAVE_TRANSPORT` enter response-loss recovery;
- Access gating, invalid response and ordinary server rejection do not enter that recovery path;
- no automatic write retry exists;
- exact proposal comparison ignores only runtime `updatedAt` and `updatedBy`;
- normal `saved:true` requires canonical reread revision === server `updatedAt` + exact reviewed proposal;
- normal `noChange:true` requires the original revision + exact reviewed proposal;
- mismatch is ambiguous; unreadable reread is unverified;
- recovered canonical Track metadata/duration truth does not imply an independently observed `catalog/index.json` rebuild receipt.

Track Manager rebuilds the catalog inside its server transaction, but the private Track reread reconstructs Track state from manifests rather than independently reading the derived catalog index. Therefore Build92 **must not fabricate `catalogRebuilt:true` after a lost response**. Normal HTTP responses retain the server's real catalog receipt.

Build92 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Track metadata acceptance: one harmless reversible metadata edit, Validate → one normal Save, `CANONICAL REREAD · VERIFIED`, persistence after reload and surrounding Track / Albums / Lyrics / SonicTrace navigation. The browser smoke did not deliberately break network or Access; automated guards own response-loss failure-path proof.

## SonicTrace persistence boundary

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

The deployed Track Manager owns history → latest → reread/verification and rollback attempts. Build84 adds Studio-side truth after a lost HTTP response:

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

Build84 is **REAL USER PASS** after explicit normal-browser regression acceptance.

### Build91 SonicTrace private-read boundary — ACCEPTED

Build91 changes only private Track Manager SonicTrace GETs used by canonical latest/history state, the SonicTrace catalog and Build84 verification/recovery rereads. Maximum attempts are two total; one retry only for transient timeout/transport/explicit transient HTTP. Build91 never retries the save POST and is **REAL USER PASS**.

## Album authority boundary

```text
albums/<album-id>/manifest.json
ordered album.trackIds = sole membership + artistic-order authority
```

Track-side `album` metadata is compatibility cache only. Generic Track metadata writes must never mutate Album membership independently of guarded Album operations.

### Build85 metadata-save boundary — ACCEPTED

Build85 changes no backend transaction. It adds client truth if the HTTP response disappears:

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ changed revision but exact metadata-only postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Build85 is **REAL USER PASS**. Its metadata-specific postcondition must not be copied into membership/move/create/upload recovery without an operation-specific audit.

### Build86 Album-move boundary — ACCEPTED

Build86 adds Studio-side truth across target + optional source + Track cache and changes no backend transaction. Exact postcondition means committed; exact unchanged pre-write state means not committed; partial/mixed state is ambiguous; reread failure is unverified. Build86 covers **only** `album-track-move-v1` and is **REAL USER PASS**.

### Build87 Album-membership boundary — ACCEPTED

Build87 adds Studio-side truth across the Album plus every Track in the union of previous/requested `album.trackIds`. Requested Tracks must exist; removed Tracks cached to the Album converge to transitional `Singles`; unrelated cache claims remain stable. Exact order + expected Track caches + stable shapes means committed. Build87 is **REAL USER PASS**.

### Build89 Album private-read boundary — ACCEPTED

Build89 changes no Album write transaction. It changes only canonical Album collection/detail GET classification with one bounded transient retry and maximum two attempts. Album create and binary upload remain separate future audit families. Build89 is **REAL USER PASS**.

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

### Build88 private-read retry boundary — ACCEPTED

The core private read transport is deliberately narrow:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Maximum two total attempts. Only bridge health, Track inventory and Track detail use this helper. Public fallback remains read-only. This policy does **not** authorize retrying any POST/write/upload/delete/catalog rebuild/validation operation. Build88 is **REAL USER PASS**.

## Ambiguous-write policy — Phase9 authority

A lost HTTP response does **not** prove whether a write committed.

For any write hardened under Phase9:

```text
write response lost / timeout
→ NEVER automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

A retry may be presented as safe only when canonical reread proves the exact operation-specific pre-write state/postcondition allows it. A lost-response write may be recovered as success only when the operation-specific canonical postcondition is positively verified. Public fallback can never perform this verification.

### Accepted scopes

- **Build82** — Track + Album asset delete; exact asset absence/revision truth.
- **Build83** — canonical `lyrics.txt` save; new revision + ETag + exact normalized text.
- **Build84** — SonicTrace analysis save; exact `analysisId` in latest + history.
- **Build85** — Album metadata save only; exact metadata + stable non-metadata shape.
- **Build86** — Album move only; exact target/source membership/order + Track cache.
- **Build87** — Album bulk membership/order; exact Album order + expected affected Track caches.
- **Build88** — core private GET retry only; not a write-recovery contract.
- **Build89** — Album private GET retry only; no Album write retry.
- **Build90** — Lyrics private GET retry only; no Lyrics write retry.
- **Build91** — SonicTrace private GET retry only; no SonicTrace write retry.
- **Build92** — Track metadata save response-loss truth only; exact reviewed proposal + revision.

Build92 must not be generalized into Track create, asset upload/delete, Album create/upload or any other write family. A recovered Track manifest does not independently prove the derived catalog rebuild receipt, so Build92 does not fabricate one.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video, Album cover or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof:

- source-scope guard;
- typecheck/build;
- stale checks;
- canonical reread logic;
- explicit UI confirmation;
- disposable Draft asset only if a deliberate destructive browser smoke is truly required.

Build85 acceptance used a normal harmless metadata save rather than manufactured response loss. Build86 used a normal safe move. Build87 used a harmless reorder. Build88/89/90/91 used normal private-read regressions. Build92 used one normal harmless Track metadata validate/save regression. **None** required deliberately cutting network/Access merely to force a failure branch; automated guards own those failure-path proofs.

## Version / deployment discipline

Treat separately:

1. code merged;
2. GitHub Pages deployed;
3. Worker deployed;
4. R2/catalog data changed;
5. real-user acceptance recorded.

For private Track Manager-only Worker changes, prefer `target=admin` and `confirm=DEPLOY`.

Build82 through Build92 required no Worker deployment. Build92 Pages deployment caused no intentional R2 schema/data migration.

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

**Build92 is the accepted Studio REAL USER PASS baseline. Build93 is UNALLOCATED pending a fresh bounded post-Build92 audit. Track Manager v5.23 / bridge v1.13 remains the sole deployed protected write authority.**