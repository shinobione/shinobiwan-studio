# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-16  
Current accepted Studio release: `v0.19.22` / Build `100` / REAL USER PASS

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
  v0.19.22 / Build100 / REAL USER PASS
  exact tested head 9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
  final runtime CI 31944882443 / SUCCESS
  runtime merge 49f5c8e0267a318e2b0900ba5e222bd56d098db8
  runtime Pages 31944932464 / SUCCESS
  candidate docs PR #188 / CI 31945020130 / merge 2ddce2be6abba8324c64054702f0e7654831c83b / Pages 31945131271 SUCCESS
  browser smoke BUILD100 SMOKED 💨 / 2026-08-16
  safety post-deploy safety/post-build100-deployed-candidate-20260816
  safety post-acceptance safety/post-build100-real-user-pass-20260816-2255

Build99 accepted predecessor
  runtime PR #183 / CI 31920824628 / merge dd26df1664fa7de2b2e77b0d2ae3d9d48cb9eefd / Pages 31920895328 SUCCESS
  Album asset normal-success verification accepted; first-track intake gap subsequently closed by Build100

Build97 accepted predecessor
  runtime PR #179 / CI 31914980387 / merge 0519d3ad1c364ee34188e17ecb9d10c3f0308c54 / Pages 31915029686 SUCCESS
  genuine Track create passed; downstream blocker traced separately to TM v5.23 and resolved by TM v5.24 + Build98

LaunchPAD
  2026.08.12.102 / REAL USER PASS

Track Manager / LaunchPAD backend
  Track Manager v5.24 / Studio bridge v1.14 / REAL USER VERIFIED
  corrective PR #238 / source merge aaa28c90c95b6d5dbe76e34a840d95e194e0cc65
  deployment run 31919397012 / SUCCESS / target admin
  Worker Version ID 53abb651-4f3c-46a7-a37a-055f35d340b9
  public Worker v2.7 unchanged / deploy steps skipped
  deploy did not rebuild catalog/index.json or mutate existing R2 media

SonicTrace
  V2-E Build08 / REAL USER PASS
  Deep Audio 2.0.3-alpha

LRC Maker
  6.3.8
```

Historical Phase6/Phase7/Phase8 and earlier Phase9 checkpoints remain immutable history; this overlay states the current accepted production truth.

## Restoration checkpoints

Most relevant current references:

```text

After Build100 deployment candidate:
  safety/post-build100-deployed-candidate-20260816
  safety/post-build100-candidate-docs-closeout-20260816

After Build100 real-user acceptance:
  safety/post-build100-real-user-pass-20260816-2255

After Build99 deployment candidate:
  safety/post-build99-deployed-candidate-20260816
  safety/post-build99-candidate-docs-closeout-20260816

After Build99 real-user acceptance:
  safety/post-build99-real-user-pass-20260816
  safety/post-build99-acceptance-docs-pages-20260816

After Build98 deployment candidate:
  safety/post-build98-deployed-candidate-20260816

After Build98 real-user acceptance:
  safety/post-build98-real-user-pass-20260816

After TM v5.24 real-user acceptance:
  LaunchPAD safety/post-tm524-real-user-pass-20260816

After Build97 deployment candidate:
  safety/post-build97-deployed-candidate-20260816

After Build96 deployment candidate:
  safety/post-build96-deployed-candidate-20260816
  safety/post-build96-candidate-docs-closeout-20260816

After Build96 real-user acceptance:
  safety/post-build96-real-user-pass-20260816
  safety/post-build96-rup-docs-closeout-20260816

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
  safety/post-build84-rup-docs-closeout-20260815-0441

Before Phase9 Build85:
  safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555

After Build85 deployment candidate:
  safety/post-build85-deployed-candidate-20260815-0602
  safety/post-build85-candidate-docs-closeout-20260815-0608

After Build85 real-user acceptance:
  safety/post-build85-real-user-pass-20260815-0748
  safety/post-build85-rup-docs-closeout-20260815-0755

Before Phase9 Build86:
  safety/pre-phase9-album-move-response-loss-build86-20260815-0757

After Build86 deployment candidate:
  safety/post-build86-deployed-candidate-20260815-0808
  safety/post-build86-candidate-docs-closeout-20260815-0818

After Build86 real-user acceptance:
  safety/post-build86-real-user-pass-20260815-0823
  safety/post-build86-rup-docs-closeout-20260815-0828

Before Phase9 Build87:
  safety/pre-phase9-album-membership-response-loss-build87-20260815-0837

After Build87 implementation before PR:
  safety/post-build87-prepr-20260815-0844

After Build87 deployment candidate:
  safety/post-build87-deployed-candidate-20260815-0853
  safety/post-build87-candidate-docs-closeout-20260815-0901

After Build87 real-user acceptance:
  safety/post-build87-real-user-pass-20260815-0903
  safety/post-build87-rup-docs-closeout-20260815-0912

Before Phase9 Build88:
  safety/pre-phase9-private-read-retry-build88-20260815-0916

After Build88 deployment candidate:
  safety/post-build88-deployed-candidate-20260815-0932
  safety/post-build88-candidate-docs-closeout-20260815-0942

After Build88 real-user acceptance:
  safety/post-build88-real-user-pass-20260815-1253
  safety/post-build88-rup-docs-closeout-20260815-1304

Before Phase9 Build89:
  safety/pre-phase9-album-private-read-retry-build89-20260815-1307

After Build89 implementation before PR:
  safety/post-build89-prepr-20260815-1310

After Build89 deployment candidate:
  safety/post-build89-deployed-candidate-20260815-1319
  safety/post-build89-candidate-docs-closeout-20260815-1336

After Build89 real-user acceptance:
  safety/post-build89-real-user-pass-20260815-1404
  safety/post-build89-rup-docs-closeout-20260815-1416

Before Phase9 Build90:
  safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419

After Build90 implementation before PR:
  safety/post-build90-prepr-20260815-1424

After Build90 deployment candidate:
  safety/post-build90-deployed-candidate-20260815-1429
  safety/post-build90-candidate-docs-closeout-20260815-1440

After Build90 real-user acceptance:
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

After Build91 real-user acceptance:
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

After Build92 real-user acceptance:
  safety/post-build92-real-user-pass-20260815-1819
  safety/post-build92-rup-docs-closeout-20260815-1841
  safety/post-build92-receipts-closeout-20260815-1844

Before Phase9 Build93:
  safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914

After Build93 implementation before PR:
  safety/post-build93-prepr-20260815-1921
  safety/post-build93-prepr-final-20260815-1923

After Build93 green exact-head validation:
  safety/post-build93-green-premerge-20260815-1931

After Build93 deployment candidate:
  safety/post-build93-deployed-candidate-20260815-1936

After Build93 candidate-docs closeout:
  safety/post-build93-candidate-docs-prepr-20260815-1946
  safety/post-build93-candidate-docs-closeout-20260815-1949

After Build93 real-user acceptance:
  safety/post-build93-real-user-pass-20260815-2010
  safety/post-build93-rup-docs-prepr-20260815-2010
  safety/post-build93-rup-docs-closeout-20260815-2010

Build94 deployed-candidate checkpoint:
  safety/post-build94-deployed-candidate-20260815-2338

Build94 explicit real-user acceptance checkpoint:
  safety/post-build94-real-user-pass-20260815-2346

Before Phase9 Build95:
  safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815

After Build95 implementation before PR:
  safety/post-build95-prepr-20260815

After Build95 green exact-head validation:
  safety/post-build95-green-premerge-20260815

After Build95 deployment candidate:
  safety/post-build95-deployed-candidate-20260815
  safety/post-build95-candidate-docs-closeout-20260815

After Build95 explicit real-user acceptance:
  safety/post-build95-real-user-pass-20260816

After Build95 acceptance-docs closeout:
  safety/post-build95-rup-docs-prepr-20260816
  safety/post-build95-rup-docs-green-premerge-20260816
  safety/post-build95-rup-docs-closeout-20260816
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

Build90 changes only canonical Lyrics private **GET** behavior. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `lyrics-validate-v1` or `lyrics-save-v1` POST behavior at Build90, no Build83 lost-response recovery rule, no Track Manager route, no Worker and no R2 data/schema.

Build91 changes only private Track Manager SonicTrace **GET** behavior for canonical latest/history state and the SonicTrace catalog. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `sonictrace-analysis-save-v1` POST behavior, no Build84 lost-response recovery rule, no Deep Audio health/analysis XHR, no canonical audio download behavior, no Track Manager route, no Worker and no R2 data/schema.

Build92 changes only Studio-side canonical Track **metadata save response-loss truth**. It repeats non-mutating validation immediately before the write, anchors the save to the exact reviewed proposal + revision, and classifies a lost timeout/transport response through private canonical Track reread. It changes no Track Manager route, Worker, R2 schema/data, Track create/assets, Album writes, Lyrics/SonicTrace writes or PWA/offline behavior.

Build93 changes only Studio-side non-mutating Track **metadata validation transient retry truth**. It permits at most one retry for timeout/transport/selected transient HTTP failures in `metadata-validate-v1`, including visible Validate and Build92 fresh pre-save validation. It does not change `metadata-save-v1`, Track Manager, Workers, R2 schema/data or any other operation family. Build93 is **REAL USER PASS** after explicit normal-browser acceptance.

Build94 changes only Studio-side non-mutating canonical Lyrics **validation transient retry truth**. It permits at most one retry for timeout/transport/selected transient HTTP failures in `lyrics-validate-v1`, with maximum two total attempts and finite 9-second timeout per attempt. It does **not** change `lyrics-save-v1`, Build83 save response-loss recovery, Track Manager, Workers, R2 schema/data or any other operation family. Build94 is **REAL USER PASS** after explicit normal-browser acceptance.

Build95 changes only the **daily Albums UI wiring**. The normal `AlbumsWorkspace` now consumes the already accepted Build85 metadata, Build86 move and Build87 membership resilient services. Their recovery algorithms, Track Manager authority and no-blind-retry boundaries remain unchanged. Album create, binary upload and asset delete remain outside Build95 scope. Build95 is **REAL USER PASS** after explicit normal-browser acceptance.

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

Build90 does not change the save transaction above. It changes only the canonical Lyrics GET used by normal loading and by the Lyrics side of Build83 verification/recovery rereads:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- the existing finite 7-second per-attempt timeout remains;
- a transport blip must not be mislabeled as Access;
- Access/CORS and invalid responses must not be hammered with automatic retries;
- `rereadLyricsTruth()` may survive one transient Lyrics GET failure but still never retries the save POST.

Build90 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Lyrics-read regression acceptance. The browser smoke did not deliberately break network or Access; automated guards own the transient failure-path proof.

### Build94 Lyrics validation retry boundary — ACCEPTED

Build94 changes only non-mutating `lyrics-validate-v1` and does not change the canonical save transaction above.

```text
lyrics-validate-v1 attempt 1
├─ timeout                            → one retry max
├─ transport/fetch interruption       → one retry max
├─ HTTP 408/425/429/500/502/503/504  → one retry max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return validation result

attempt 2 failure → surface immediately
```

Rules:

- maximum two total attempts;
- finite 9-second timeout remains per attempt;
- visible Lyrics Validate uses the hardened wrapper;
- Access/session gating and invalid response must not be hammered with automatic retries;
- this is safe only because validation is non-mutating;
- `lyrics-save-v1` remains at zero automatic retries;
- Build83 lost-response classification/recovery remains unchanged;
- this policy must not be generalized to Lyrics save, Track/Album mutations, SonicTrace save/compute or any other write.

Build94 is **REAL USER PASS** after explicit **`BUILD94 PASS MADAFAKA`** on 2026-08-15. Browser acceptance was a normal Lyrics validation regression; it did **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture retry behavior. Automated guards own the transient failure-path proof.

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

### Build93 Track metadata validation retry boundary — ACCEPTED

Build93 changes the non-mutating `metadata-validate-v1` seam only. It does not change the Build92 save transaction above.

```text
metadata-validate-v1 attempt 1
├─ timeout                            → one retry max
├─ transport/fetch interruption       → one retry max
├─ HTTP 408/425/429/500/502/503/504  → one retry max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return reviewed proposal

attempt 2 failure → surface immediately
```

Rules:

- maximum two total attempts;
- finite 7-second timeout remains per attempt;
- visible Validate and Build92 fresh pre-save validation use the same bounded wrapper;
- plain and duration-aware validation use the same policy;
- Access/session gating and invalid response must not be hammered with automatic retries;
- this is safe only because validation is non-mutating;
- Build92 `metadata-save-v1` remains at zero automatic write retries;
- this policy must not be generalized to Track create/assets, Album operations, Lyrics/SonicTrace writes or any other mutation.

Build93 is **REAL USER PASS** after explicit **`BUILD93 PASS MADAFAKA`** on 2026-08-15. Browser acceptance was a normal metadata validation regression; it did **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture retry behavior. Automated guards own the transient failure-path proof.

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

Build91 does not change the save transaction above. It changes only private Track Manager SonicTrace GETs used by normal canonical latest/history state loading, the SonicTrace catalog and Build84 verification/recovery rereads:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- finite 12-second state and 20-second catalog per-attempt timeouts remain;
- a transport blip must not be mislabeled as Access;
- Access/CORS and invalid responses must not be hammered with automatic retries;
- the helper is GET-only and cannot accept arbitrary methods;
- Build84 verification/recovery may survive one transient SonicTrace GET failure but still never retries the save POST;
- Deep Audio health/analysis XHR and canonical audio download remain out of scope.

Build91 is **REAL USER PASS** after explicit 2026-08-15 normal-browser SonicTrace private-read regression acceptance. The browser smoke did not deliberately break network or Access; automated guards own the transient failure-path proof.

## Album authority boundary

```text
albums/<album-id>/manifest.json
ordered album.trackIds = sole membership + artistic-order authority
```

Track-side `album` metadata is compatibility cache only. Generic Track metadata writes must never mutate Album membership independently of guarded Album operations.

### Build85 metadata-save boundary

The deployed Track Manager metadata route already owns:

```text
expectedUpdatedAt stale guard
→ write proposed Album manifest
→ update title-dependent Track caches when required
→ rebuild catalog
→ canonical Album reread / verification
→ rollback touched Album + Track state on failure
```

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

Stable non-metadata shape includes canonical identity, ordered `trackIds`, assets and `createdAt`. This is deliberately metadata-specific and must not be copied into membership/move/create/upload recovery without an operation-specific audit.

Build85 is **REAL USER PASS** after the explicit 2026-08-15 normal-browser Album metadata regression verdict.

### Build86 Album-move boundary — ACCEPTED

The deployed Track Manager move route already owns:

```text
target/source stale guards
→ deterministic target insert/source removal
→ write target/source Albums
→ update one Track compatibility cache when required
→ rebuild catalog
→ reread target + source? + Track
→ verify membership/cache
→ rollback touched state on failure
```

Build86 changes no backend transaction. It adds Studio-side truth if the HTTP response becomes unavailable:

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ exact new target revision/order
   │  + exact source revision/removal when source exists
   │  + Track cache points to target
   │  + stable non-membership shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write target/source/Track state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal success also requires exact response revisions, exact target/source tracklists and Track cache verification. Build86 covers **only** `album-track-move-v1`; bulk membership save, create and upload remain separate operation-specific audit families.

Build86 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album move regression acceptance.

### Build87 Album-membership boundary — ACCEPTED

The deployed Track Manager membership route already owns:

```text
Album stale guard
→ ownership-conflict validation
→ deterministic ordered membership
→ deterministic affected Track-cache updates
→ write Album + affected Track caches
→ rebuild catalog
→ Album reread / verification
→ rollback touched Album + Track caches + catalog on failure
```

Build87 changes no backend transaction. It adds Studio-side pre-write and post-write truth across the Album plus every Track in the union of previous/requested `album.trackIds`:

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track-cache reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + stable Album non-membership shape
   │  + every Track cache equals its exact expected postcondition
   │  + stable Track non-album shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write Album + Track state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Operation-specific compatibility-cache semantics:

- requested Track → cache points to the canonical Album;
- removed Track whose cache claimed that Album → transitional `Singles` cache;
- removed Track whose cache did not claim that Album → cache remains unchanged;
- historically missing prior Track may be removed and remains absent;
- missing Track may never be newly requested.

Normal success also requires exact response revision/order, exact canonical Album order, every affected Track cache and `trackCachesUpdated` agreement when the server supplies it. Build87 is deliberately limited to **bulk membership / ordered tracklist save**; Album create and binary upload remain separate audit families.

Build87 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album tracklist regression acceptance.

### Build89 Album private-read boundary — ACCEPTED

Build89 changes no Album backend transaction. It changes only canonical Album GET classification:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- canonical Album collection/detail use the bounded helper;
- private Album visual discovery inherits the collection read;
- existing guarded Album write verification/recovery rereads inherit the canonical detail GET;
- no Album POST/write is retried by Build89;
- Album create and binary upload remain unchanged future audit families.

Build89 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album private-read regression acceptance. The browser smoke did not deliberately break network or Access; automated guards own the transient failure-path proof.

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

Rules:

- maximum two total attempts;
- only bridge health, Track inventory and Track detail private GETs use this helper;
- a transport blip must not be mislabeled as an Access failure;
- Access/CORS must not be hammered with automatic retries;
- public fallback remains read-only and is reached only after the private helper ultimately fails;
- this GET retry policy does **not** authorize retrying any POST, write, upload, delete, catalog rebuild or validation operation.

Build88 changes no Track Manager/backend transaction and requires no Worker or R2 migration. Build88 is **REAL USER PASS** after explicit normal-browser private-read regression acceptance.

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

Track + Album asset delete. Recovery requires exact private canonical reread and operation-specific asset absence/revision truth. Build82 is **REAL USER PASS**.

### Build83 accepted scope

Canonical `lyrics.txt` save. Recovered success requires new manifest revision + new Lyrics ETag + exact requested normalized text. Build83 is **REAL USER PASS**.

### Build84 accepted scope

SonicTrace analysis save. Recovered success requires the requested `analysisId` in canonical latest + history. Build84 is **REAL USER PASS**.

### Build85 accepted scope

Album **metadata save only**. Recovered success requires a new Album revision + exact requested metadata + unchanged non-metadata Album shape. Explicit retry safety requires the original revision to remain canonical.

Build85 is **REAL USER PASS**. Do not generalize this into Album membership/move/create/upload behavior.

### Build86 accepted scope

Album **move only** (`album-track-move-v1`). Recovered success requires exact target/source membership/order, Track cache target and stable non-membership shapes. Explicit retry safety requires the exact pre-write target/source/Track state to remain canonical.

Build86 is **REAL USER PASS**. Do not generalize it into bulk membership/create/upload behavior.

### Build87 accepted scope

Album **bulk membership / ordered tracklist save only**. Recovered success requires exact new Album revision/order, exact expected compatibility cache for every affected Track and stable non-membership shapes. Explicit retry safety requires the exact pre-write Album + Track state to remain canonical.

Build87 is **REAL USER PASS**. Do not generalize it into Album create/upload behavior.

### Build88 accepted scope

Core private **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP status allowlist. This is not an ambiguous-write recovery contract and must never be used as justification for automatically retrying writes.

Build88 is **REAL USER PASS** after explicit normal-browser private-read regression acceptance. Acceptance did not manufacture a failure branch.

### Build89 accepted scope

Canonical Album collection/detail **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. It changes no Album write retry rule.

Build89 is **REAL USER PASS** after explicit normal-browser Album private-read regression acceptance. Acceptance did not manufacture a failure branch.

### Build90 accepted scope

Canonical Lyrics **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. Build90 itself did not authorize retrying `lyrics-validate-v1`, `lyrics-save-v1`, or any other write.

Build90 is **REAL USER PASS** after explicit normal-browser canonical Lyrics-read regression acceptance. Acceptance did not manufacture a failure branch.

### Build91 accepted scope

Private Track Manager SonicTrace **GET retry only** for canonical latest/history state plus the SonicTrace catalog. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. This is not authorization to retry `sonictrace-analysis-save-v1`, Deep Audio analysis, canonical audio download or any other write.

Build91 is **REAL USER PASS** after explicit normal-browser canonical SonicTrace-read regression acceptance. Acceptance did not manufacture a failure branch.

### Build92 accepted scope

Canonical Track **metadata save response-loss truth only**. Recovery is entered only after typed timeout/transport response loss and never automatically retries the POST. Recovered committed truth requires a new canonical Track revision plus the exact normalized proposal reviewed immediately before the write. An unchanged original revision is not committed / explicit retry safe after reconnect; changed-but-nonmatching is ambiguous; unavailable reread is unverified.

Build92 must not be generalized into Track create, asset upload/delete, Album create/upload or any other write family. A recovered Track manifest does not independently prove the derived catalog rebuild receipt, so Build92 does not fabricate one.

Build92 is **REAL USER PASS** after explicit normal-browser Track metadata validation/save acceptance. Acceptance did not manufacture a response-loss branch.

### Build93 accepted scope

Canonical Track **metadata validation transient retry only**. `metadata-validate-v1` is non-mutating, so timeout, transport interruption or the explicit transient HTTP allowlist may receive one retry. Access/deterministic ordinary 4xx and invalid JSON/proposal do not retry. Maximum attempts are two total.

Build93 must not be used as justification for retrying `metadata-save-v1` or another write. Build92 save response-loss truth remains unchanged and still has zero automatic write retries.

Build93 is **REAL USER PASS** after explicit normal-browser acceptance. The user did not deliberately cut network or invalidate Access to manufacture a failure branch.

### Build94 accepted scope

Canonical Lyrics **validation transient retry only**. `lyrics-validate-v1` is non-mutating, so timeout, transport interruption or the explicit transient HTTP allowlist may receive one retry. Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal do not retry. Maximum attempts are two total with finite 9-second timeout per attempt.

Build94 must not be used as justification for retrying `lyrics-save-v1` or another write. Build83 save response-loss truth remains unchanged and `lyrics-save-v1` remains at zero automatic retries.

Build94 is **REAL USER PASS** after explicit normal-browser acceptance. The user did not deliberately cut network or invalidate Access to manufacture a failure branch.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video, Album cover or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof:

- source-scope guard;
- typecheck/build;
- stale checks;
- canonical reread logic;
- explicit UI confirmation;
- disposable Draft asset only if a deliberate destructive browser smoke is truly required.

Build85 acceptance did **not** require deliberately cutting network/Access during a production metadata save just to manufacture response loss. A normal harmless metadata edit/save was sufficient for regression acceptance.

Build86 acceptance likewise did **not** require deliberately cutting network/Access during a production move. A normal legitimate safe move was sufficient for regression acceptance.

Build87 acceptance likewise did **not** require deliberately cutting network/Access. A harmless reorder of existing Tracks in one safe Album was sufficient.

Build88 acceptance likewise did **not** require deliberately cutting network or invalidating Access merely to prove the transient GET retry branch. Automated guards own that failure-path proof; browser acceptance was a normal private-read regression.

Build89 acceptance likewise did **not** require deliberately cutting network or invalidating Access. Automated guards own the transient failure-path proof; browser acceptance was a normal Album private-read regression.

Build90 acceptance likewise did **not** require deliberately cutting network or invalidating Access. Automated guards own the transient failure-path proof; browser acceptance was a normal canonical Lyrics-read regression.

Build91 acceptance likewise did **not** require deliberately cutting network or invalidating Access. Automated guards own that failure-path proof; browser acceptance was a normal canonical SonicTrace-read regression.

Build92 acceptance likewise did **not** deliberately cut network or invalidate Access merely to prove response-loss classification. Automated guards own committed/not-committed/ambiguous/unverified failure-path proof; browser acceptance was one normal harmless Track metadata validate/save regression.

Build93 acceptance likewise did **not** deliberately cut network or invalidate Access merely to prove transient validation retry. Automated guards own timeout/transport/transient-HTTP classification and attempt-bound proof; browser acceptance was a normal harmless Track metadata validation regression.

Build94 acceptance likewise did **not** deliberately cut network or invalidate Access merely to prove transient Lyrics validation retry. Automated guards own timeout/transport/transient-HTTP classification and attempt-bound proof; browser acceptance was a normal Lyrics validation regression with no save required.

## Version / deployment discipline

Treat separately:

1. code merged;
2. GitHub Pages deployed;
3. Worker deployed;
4. R2/catalog data changed;
5. real-user acceptance recorded.

For private Track Manager-only Worker changes, prefer `target=admin` and `confirm=DEPLOY`.

Build82 through Build94 required no Worker deployment. Build94 Pages deployment caused no intentional R2 schema/data migration.

Docs-only governance/closeout work does not create a new Studio build.

## Rollback principle

If a regression appears:

1. stop the next integration step;
2. do not compensate with unrelated media/catalog edits;
3. revert the responsible PR first where possible;
4. redeploy only the affected Worker from known-good source if backend-only;
5. use immutable safety branches only when normal revert is insufficient;
6. independently verify LaunchPAD, Track Manager, SonicTrace, LRC Maker and Studio before resuming.

Build94 itself demonstrates this rule: the first red Pages merge was rolled back to byte-identical accepted Build93 content before the clean v2 candidate was reconstructed and revalidated.

## Stop line

**Build94 is the accepted Studio REAL USER PASS baseline. Build95 is UNALLOCATED until Build94 acceptance-docs closeout is green and a fresh bounded post-Build94 audit proves the next smallest coherent scope. Track Manager v5.23 / bridge v1.13 remains the sole deployed protected write authority.**