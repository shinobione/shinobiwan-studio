# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, do **not** reconstruct state from old chat transcripts or the full historical docs tree.

Read:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify the real GitHub state before mutation.

## Current accepted state

```text
Studio                v0.19.21 · Build99 · REAL USER PASS
Codename              studio-focus-slice4-phase9-album-asset-upload-success-verification-truth
Runtime PR            #183
Exact tested head     3cc99aabd18d23ec38ba4df9fd042e03aace8238
Validation            31920824628 · SUCCESS
Runtime merge         dd26df1664fa7de2b2e77b0d2ae3d9d48cb9eefd
Runtime Pages         31920895328 · SUCCESS · exact runtime merge SHA
Candidate docs PR     #184
Candidate docs CI     31920976229 · SUCCESS
Candidate docs merge  f3c1bff90ea8cb02f16e01b5f3f973e10ecdb499
Candidate docs Pages  31921021926 · SUCCESS
Acceptance docs PR     #185
Acceptance docs CI     31944004275 · SUCCESS
Acceptance docs merge  66052e2a16097801916f92c43623739123dd5067
Acceptance docs Pages  31944054855 · SUCCESS
Real-user smoke       BUILD99 SMOKED 💨 · 2026-08-16
Build98               v0.19.20 · REAL USER PASS
Build97               v0.19.19 · REAL USER PASS
Build97 runtime PR    #179
Build97 CI            31914980387 · SUCCESS
Build97 merge         0519d3ad1c364ee34188e17ecb9d10c3f0308c54
Build97 Pages         31915029686 · SUCCESS
Track Manager         v5.24 · REAL USER VERIFIED
Studio bridge         v1.14
TM deploy run         31919397012 · SUCCESS · admin only
TM admin Worker       53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.21 · Build99 is the current accepted runtime.** Build98 is its accepted predecessor. Build97 tightened normal successful Track create verification against the server-normalized manifest and private canonical reread. Its first real-user continuation exposed a pre-existing Track Manager v5.23 generated-bundle scope defect after the canonical draft had already been created correctly.

Track Manager v5.24 / Studio bridge v1.14 corrected that backend asset-write defect. Build98 is the bounded Studio compatibility corrective that accepts the new duration-evidence bridge pair without widening retry or write semantics. The genuine `Pixels & Promises` continuation then successfully committed MP3, cover JPEG, MP4 and TXT assets with no recurrence of `ASSET_SAVE_ROLLBACK · HTTP 500`.

No blind write retry was added. Public Worker v2.7 remained untouched, and the protected TM deployment rebuilt neither `catalog/index.json` nor existing R2 media.

The repository still publishes **no formal GitHub Release objects and no Git tags**. Runtime release identity is carried by code, docs and Pages.

## Product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace summary.
- **Visuals** — cover, thumbnail and Canvas. Cover is required; Canvas is optional.
- **Lyrics** — canonical `lyrics.txt`, embedded LRC Maker and text editing.
- **Release** — final production check + browser-local Release Campaign.
- **Sonic / Details / Advanced** — full SonicTrace analysis and deliberately requested technical depth.

Production and publication remain separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Draft
```

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same `workflow.nextAction` authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1      Build82 · REAL USER PASS
Phase 9 Slice2      Build83 · REAL USER PASS
Phase 9 Slice3      Build84 · REAL USER PASS
Phase 9 Slice4      Build85 · REAL USER PASS
Phase 9 Slice5      Build86 · REAL USER PASS
Phase 9 Slice6      Build87 · REAL USER PASS
Phase 9 Slice7      Build88 · REAL USER PASS
Phase 9 Slice8      Build89 · REAL USER PASS
Phase 9 Slice9      Build90 · REAL USER PASS
Phase 9 Slice10     Build91 · REAL USER PASS
Phase 9 Slice11     Build92 · REAL USER PASS
Phase 9 Slice12     Build93 · REAL USER PASS
Phase 9 Slice13     Build94 · REAL USER PASS
Phase 9 Slice14     Build95 · REAL USER PASS
Phase 9 Slice15     Build96 · REAL USER PASS
Phase 9 Slice16     Build97 · REAL USER PASS
Phase 9 Slice17     Build98 · REAL USER PASS
Phase 9 Slice18     Build99 · REAL USER PASS
Build100            UNALLOCATED · pending fresh read-only post-Build99 audit
Phase 10            FUTURE
```

The immediate next action is a **fresh read-only post-Build99 Phase9 audit**. The already-observed `Singles → first Track into an empty draft Album` membership deadlock is the leading candidate, but Build100 remains unallocated until the audit proves scope and authority boundaries.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener UX.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- public fallback is read-only and never verifies canonical writes.

## Canonical contracts

### Private reads

Build88 core Track reads, Build89 Album reads, Build90 Lyrics reads and Build91 private SonicTrace state/catalog reads all use the same bounded classification within their own domain-specific helpers:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

The contract is GET-only and capped at two total attempts. Build88 applies it to bridge health / Track inventory / Track detail; Build89 to canonical Album collection/detail; Build90 to canonical Lyrics read; Build91 to private SonicTrace canonical latest/history state plus the SonicTrace catalog. None authorizes POST/write retry.

### Track metadata

Build92 protects the existing `metadata-save-v1` write without changing Track Manager authority or validation semantics:

```text
metadata save response unavailable
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

Immediately before POST, Studio repeats the same non-mutating validation and anchors the write to that exact proposal and revision. Derived `manifest.duration`, when supported by canonical audio evidence, is part of the reviewed proposal but remains non-editable. Normal HTTP success is also canonically reread and verified.

Track Manager rebuilds the derived catalog inside its transaction. Because the private Track reread proves manifest state rather than independently reading `catalog/index.json`, a recovered lost-response result does not fabricate a catalog-rebuilt receipt. Normal HTTP success retains the server's real receipt.

The accepted Build92 browser smoke covered one harmless reversible metadata edit, Validate → one normal Save, `CANONICAL REREAD · VERIFIED`, persistence after reload, and surrounding Track / Albums / Lyrics / SonicTrace navigation. Acceptance did not manufacture a response-loss branch.

Build93 hardens the **non-mutating validation seam only**:

```text
metadata-validate-v1 attempt 1
├─ timeout                            → retry once max
├─ transport interruption             → retry once max
├─ HTTP 408/425/429/500/502/503/504  → retry once max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return proposal

attempt 2 failure → surface immediately
```

Plain and duration-aware validation use the same policy, including the visible Validate action and Build92's fresh pre-save validation. This non-mutating retry does not authorize retrying `metadata-save-v1` or any other write.

Build93 is **REAL USER PASS** after normal-browser validation. Acceptance did not manufacture network/Access failure; automated guards prove the transient classification and retry bound.

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is the sole membership/artistic-order authority. Track-side Album metadata is compatibility/cache data only.

Build85 accepted failure contract for **metadata save only**:

```text
metadata save response lost
→ private canonical Album reread
   ├─ new revision + exact metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / retry may be safe
   ├─ revision changed but exact postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal metadata success also requires exact response revision + requested metadata + stable non-metadata shape. Build85 does not apply this contract to Album create, membership, move or upload.

Build86 accepted failure contract for **Album move only**:

```text
move response unavailable
→ private target + source? + Track reread
   ├─ exact target/source membership + Track cache + stable shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write target/source/Track state unchanged
   │    → NOT COMMITTED / retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Build86 does not generalize this contract to Album bulk membership, create or upload.

Build87 accepted failure contract for **Album bulk membership / ordered tracklist save only**:

```text
membership response unavailable
→ private Album + union(previous, requested) Track reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + exact expected Track caches + stable non-membership shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write Album + Track state unchanged
   │    → NOT COMMITTED / retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Requested Tracks must exist. A historically missing prior Track can still be removed. Removed Tracks whose cache claimed the Album converge to transitional `Singles`; unrelated cache claims remain unchanged. Build87 does not generalize this contract to Album create or binary upload.

Build89 changes only canonical Album GET behavior. It does not alter the Build85/86/87 write contracts. Album create and binary upload remain separate operation-specific audit families requiring stronger causality/digest proof before lost-response recovery can be safely added.

Build95 changes the **daily Albums UI wiring only**: `AlbumsWorkspace` now consumes Build85 metadata, Build86 move and Build87 membership resilient services. Their no-blind-retry/postcondition rules remain unchanged. Album create, binary upload and asset delete are not generalized by Build95.

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

`lyrics.txt` is the unique canonical source. Recognized timestamps define synchronization. `.lrc` is optional export/compatibility only.

Build83 accepted failure contract:

```text
save response lost
→ private canonical reread
   ├─ exact new revision + ETag + requested text → COMMITTED / VERIFIED
   ├─ unchanged revision + ETag                  → NOT COMMITTED / retry may be safe
   ├─ changed but exact postcondition unproven   → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                         → UNVERIFIED / DO NOT RETRY
```

Build90 changes only the canonical Lyrics GET used by normal reading and by the Lyrics side of Build83 verification/recovery.

Build94 hardens the **non-mutating Lyrics validation seam only**:

```text
lyrics-validate-v1 attempt 1
├─ timeout                            → retry once max
├─ transport interruption             → retry once max
├─ HTTP 408/425/429/500/502/503/504  → retry once max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return validation result

attempt 2 failure → surface immediately
```

The timeout remains finite at 9 seconds per attempt and maximum attempts are two total. `lyrics-save-v1` stays at zero automatic retries; Build83 response-loss truth is unchanged.

The bounded normal-browser Build94 smoke confirmed deployed `v0.19.16 · Build94`, normal canonical `lyrics.txt` loading, normal visible Lyrics **Validate**, canonical lyrics unchanged after reload, and surrounding Track / Albums / SonicTrace / Lyrics navigation. Acceptance did not manufacture a network or Access failure branch.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio, never a free-form metadata field. Build92 includes that derived value in the exact reviewed proposal when duration evidence is present; it does not make duration editable. Build93 only makes the non-mutating duration-aware proposal validation resilient to one bounded transient retry.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in analysis sidecars.

Build84 accepted failure contract:

```text
save response lost
→ private canonical reread of latest + history
   ├─ requested analysisId in both    → COMMITTED / VERIFIED
   ├─ requested analysisId in neither → NOT COMMITTED / retry may be safe
   ├─ requested analysisId in one     → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable              → UNVERIFIED / DO NOT RETRY
```

Build91 changes only the private Track Manager GET helper used by normal canonical latest/history reads, the SonicTrace catalog and Build84 verification/recovery rereads. It does **not** retry the save POST, Deep Audio analysis or canonical audio download.

The bounded normal-browser Build91 smoke confirmed deployed version, normal canonical latest/history loading on an existing Track, a normal SonicTrace catalog/Intelligence read and surrounding Track / Albums / Lyrics / SonicTrace navigation. Acceptance did not manufacture a network or Access failure branch.

### Release Campaign

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

Release Campaign is provider-agnostic. Google Flow is a convenience shortcut. Campaign drafts remain browser-local and ZIP export remains review-only.

## Build95 acceptance receipts

```text
Safety pre               safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815
Safety pre-PR            safety/post-build95-prepr-20260815
Safety green pre-merge   safety/post-build95-green-premerge-20260815
Runtime PR               #171
Exact tested head        f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Historical CI #477       31911328839 · FAILURE · inherited Phase7-C Build69 successor cap only · never merged
Historical CI #482       31911459367 · FAILURE · inherited Build93 successor cap only · never merged
Validation               31911514334 · SUCCESS
Runtime merge            0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages            31911568069 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build95-deployed-candidate-20260815
Candidate docs PR        #172
Candidate docs CI        31911702567 · SUCCESS
Candidate docs merge     1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages     31911746874 · SUCCESS
Acceptance docs PR       #173
Acceptance docs CI       31912389047 · SUCCESS
Acceptance docs merge    f6738d56eddcadc2810c7d5413700e14b20f71a3
Acceptance docs Pages    31912432617 · SUCCESS
Safety candidate docs    safety/post-build95-candidate-docs-closeout-20260815
Safety post-acceptance   safety/post-build95-real-user-pass-20260816
Safety docs pre-PR       safety/post-build95-rup-docs-prepr-20260816
Safety docs green        safety/post-build95-rup-docs-green-premerge-20260816
Safety docs closeout     safety/post-build95-rup-docs-closeout-20260816
Worker deploy            NONE
Track Manager change     NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD95 PASS MADAFAKA · 2026-08-16
Build96                  UNALLOCATED pending fresh audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD95.md`](changelogs/CHANGELOG-BUILD95.md).

## Build94 acceptance receipts

```text
Original runtime PR      #166 · rolled back after red Pages inherited guard
Original merge           5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Original Pages           31902471804 · FAILURE
Rollback main            6c9c677b2f6299d13949642b712f2bf39b48b676 · byte-identical accepted Build93 tree
Rollback Pages           31907580912 · SUCCESS
Superseded hotfix PR     #167 · CLOSED / SUPERSEDED
Clean feature branch     phase9/build94-lyrics-validation-retry-v2
Runtime PR               #169
Exact tested head        81298582163505a11378fe1094f800f1f3d437b5
Validation               31907745153 · SUCCESS
Runtime merge            fe636560de9ca5f3f33aae76dddc5474ba990f17
Runtime Pages            31907784289 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build94-deployed-candidate-20260815-2338
Safety post-acceptance   safety/post-build94-real-user-pass-20260815-2346
Worker deploy            NONE
Track Manager change     NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD94 PASS MADAFAKA · 2026-08-15
Build95                  UNALLOCATED pending fresh audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD94.md`](changelogs/CHANGELOG-BUILD94.md).

## Build93 acceptance receipts

```text
Safety pre              safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914
Safety pre-PR           safety/post-build93-prepr-20260815-1921
Safety pre-PR final     safety/post-build93-prepr-final-20260815-1923
Safety green pre-merge  safety/post-build93-green-premerge-20260815-1931
Runtime PR              #162
Exact tested head       fcbe4c59a3a364d9665eba2ed432f37475116364
Historical CI #457      31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458      31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Validation              31898542379 · SUCCESS
Runtime merge           6c1ceb7d59971ec6c7e251532054392f02c08157
Runtime Pages           31898639778 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build93-deployed-candidate-20260815-1936
Candidate docs PR       #163
Candidate docs CI       31899284370 · SUCCESS
Candidate docs merge    6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages    31899342536 · SUCCESS
Safety post-acceptance  safety/post-build93-real-user-pass-20260815-2010
Acceptance docs PR      #164
Acceptance docs CI      31901050237 · SUCCESS
Acceptance docs merge   8df0417ee4d96de1e1b386c0fb15af60dcdbc661
Acceptance docs Pages   31901109789 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD93 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD93.md`](changelogs/CHANGELOG-BUILD93.md).

## Build92 acceptance receipts

```text
Safety pre              safety/pre-phase9-track-metadata-response-loss-build92-20260815-1722
Safety pre-PR           safety/post-build92-prepr-20260815-1740
Runtime PR              #158
Exact tested head       2b859d831f5fc46eea9853f31c4b86057041128b
Validation              31893496536 · SUCCESS
Historical guard CI     31893447100 · FAILURE · Build80 seam assertion only · never merged
Runtime merge           d0ca8b3aa4481c3217f79790e347000bfd22823a
Runtime Pages           31893652679 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build92-deployed-candidate-20260815-1748
Candidate docs PR       #159
Candidate docs CI       31894353160 · SUCCESS
Candidate docs merge    f46b846841e6ef9ce705b2fa3817baecd0aecefa
Candidate docs Pages    31894411652 · SUCCESS
Safety post-acceptance  safety/post-build92-real-user-pass-20260815-1819
Acceptance docs PR      #160
Acceptance docs CI      31896013803 · SUCCESS
Acceptance docs merge   a26c8c0540607c99147c0b6d30b5d3c7ccf6efc9
Acceptance docs Pages   31896073093 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD92 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD92.md`](changelogs/CHANGELOG-BUILD92.md).

## Build91 acceptance receipts

```text
Safety pre              safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
Safety pre-PR           safety/post-build91-prepr-20260815-1555
Runtime PR              #154
Exact tested head       b8ee223b2d077e5d14936530be219f78ed7910ac
Validation              31888303536 · SUCCESS · first run
Runtime merge           591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6
Runtime Pages           31888346988 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build91-deployed-candidate-20260815-1559
Candidate docs PR       #155
Candidate docs merge    32a57f50c90f3f7677e3a45ad46eace8bd988b3d
Candidate docs Pages    31889030115 · SUCCESS
Safety post-acceptance  safety/post-build91-real-user-pass-20260815-1700
Acceptance docs PR      #156
Acceptance docs merge   80b6c34f2bd8937cbbc4ef5e24899d13a6949731
Acceptance docs Pages   31892156760 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD91 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD91.md`](changelogs/CHANGELOG-BUILD91.md).

## Build90 acceptance receipts

```text
Safety pre              safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
Safety pre-PR           safety/post-build90-prepr-20260815-1424
Runtime PR              #150
Exact tested head       48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01
Validation              31884568681 · SUCCESS · first run
Runtime merge           8a851a7d53d3b4f45359c7036011684441bb25bb
Runtime Pages           31884614863 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build90-deployed-candidate-20260815-1429
Candidate docs PR       #151
Candidate docs merge    442b488511d77da15592a37d6e8d2dca0ed30fb8
Candidate docs Pages    31885123431 · SUCCESS
Safety post-acceptance  safety/post-build90-real-user-pass-20260815-1512
Acceptance docs PR      #152
Acceptance docs merge   ebc501df90b8a8bf9229da4a61d7784beba13b78
Acceptance docs Pages   31887090784 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD90 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD90.md`](changelogs/CHANGELOG-BUILD90.md).

## Build89 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-private-read-retry-build89-20260815-1307
Safety pre-PR           safety/post-build89-prepr-20260815-1310
Runtime PR              #147
Exact tested head       8b73d19d8fced35642ee243cff0ac19d983fd0de
Validation              31881635973 · SUCCESS
Runtime merge           b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages           31881682269 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build89-deployed-candidate-20260815-1319
Candidate docs PR       #148
Candidate docs merge    a7894dad8f4b4015ca1cba47b12781bab417fdcf
Candidate docs Pages    31882384329 · SUCCESS
Safety post-acceptance  safety/post-build89-real-user-pass-20260815-1404
Acceptance docs PR      #149
Acceptance docs merge   07bfd3c6b4fa19ccea0656b9ce194f239b7f7c65
Acceptance docs Pages   31884092117 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD89 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

## Build88 acceptance receipts

```text
Safety pre              safety/pre-phase9-private-read-retry-build88-20260815-0916
Runtime PR              #144
Exact tested head       808b0c63fc22f17a04a9c544b934d97c791d3a73
Validation              31871980725 · SUCCESS
Runtime merge           9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages           31872073050 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build88-deployed-candidate-20260815-0932
Candidate docs PR       #145
Candidate docs merge    316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages    31872540118 · SUCCESS
Safety post-acceptance  safety/post-build88-real-user-pass-20260815-1253
Acceptance docs PR      #146
Acceptance docs merge   aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages   31881075352 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD88 PASS MADAFAKA · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

## Build87 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
Safety pre-PR           safety/post-build87-prepr-20260815-0844
Runtime PR              #141
Exact tested head       5f155d312b0af7227325a78480bfd424a96e7859
Validation              31870328730 · SUCCESS · first run
Runtime merge           b9e1f121c7dc111ee6db06fd4d00227426d96ce7
Runtime Pages           31870370403 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build87-deployed-candidate-20260815-0853
Candidate docs PR       #142
Candidate docs merge    453be9e9d72c9d90cd97ad5f57be02821efec12a
Candidate docs Pages    31870838391 · SUCCESS
Safety post-acceptance  safety/post-build87-real-user-pass-20260815-0903
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD87 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

## Build86 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-move-response-loss-build86-20260815-0757
Runtime PR              #138
Exact tested head       0d99d17631e3f72a360f404a1269cc05cda33dd8
Validation              31868536718 · SUCCESS · first run
Runtime merge           866ebf9c2a501d11102ed994717b50f6d8189b0d
Runtime Pages           31868570112 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build86-deployed-candidate-20260815-0808
Candidate docs PR       #139
Candidate docs merge    9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7
Candidate docs Pages    31869026213 · SUCCESS
Safety post-acceptance  safety/post-build86-real-user-pass-20260815-0823
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD86 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD86.md`](changelogs/CHANGELOG-BUILD86.md).

## Build85 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Validation              31863267911 · SUCCESS · first run
Runtime merge           1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages           31863313848 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #136
Candidate docs merge    40917edc6a341ca7d19907d8afe59123f44c8d03
Candidate docs Pages    31863566190 · SUCCESS
Safety post-deploy      safety/post-build85-deployed-candidate-20260815-0602
Safety post-acceptance  safety/post-build85-real-user-pass-20260815-0748
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD85 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

## Accepted predecessors

Build84 remains the accepted Phase9 Slice3 predecessor:

```text
Studio                  v0.19.6 · Build84 · REAL USER PASS
Runtime PR              #132
Validation              31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS
Real-user smoke         BUILD84 PASS · 2026-08-15
```

Build83 and Build82 remain accepted Phase9 predecessors. See `CHANGELOG.md` and detailed per-build records for historical receipts.

## Documentation

### Canonical current truth

- [Agent startup contract](AGENTS.md)
- [Project state](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Decisions](DECISIONS.md)
- [QA / acceptance](QA.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Concise changelog](CHANGELOG.md)

### Historical evidence

- [Documentation map](docs/README.md)
- [Detailed changelog archive](changelogs/README.md)

Old `docs/ROADMAP-CURRENT.md` and `docs/NEXT-SESSION-HANDOFF.md` paths are retained as compatibility pointers only.

## Acceptance policy

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

A runtime is accepted only after exact-head CI, exact merge-SHA deployment and explicit real-user validation where required. Merge, Pages deployment, Worker deployment and R2 mutation remain separate states.