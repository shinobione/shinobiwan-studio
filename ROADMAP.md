# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build94 REAL USER PASS**; acceptance-docs closeout is in progress.

This file is the durable roadmap summary. Historical implementation detail belongs in `docs/` and `changelogs/`; do not copy it here unless it changes what is done, active, next or backlogged.

## Done

### Foundation / integration

- Phases 0–6 — complete.
- Phase 7-A — complete / REAL USER PASS.
- Phase 7-B — complete / REAL USER PASS.
- Phase 7-C — complete / program closeout.

Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

### Phase 8 — Content Health / truth

Accepted lineage:

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health drill-down                            REAL USER PASS
Build76  Album Health truth                           historical candidate
Build77  Album Health visual polish                   historical candidate
Build78  Track-side Album mismatch human UX           historical candidate
Build79  Album publication truth                      historical candidate
Build80  cumulative Album Health/publication runtime  REAL USER PASS
Build81  Sonic/provider semantic truth cleanup        REAL USER PASS / Phase8 closeout
```

### Phase 9 Slice1 — destructive-write ambiguity

**Build82 · v0.19.4 · REAL USER PASS**

- Track asset delete lost-response classification;
- Album asset delete lost-response classification;
- no blind automatic retry;
- private canonical reread required;
- normal success also canonically verified;
- no Worker/backend/R2 migration.

### Phase 9 Slice2 — canonical Lyrics save response-loss truth

**Build83 · v0.19.5 · REAL USER PASS**

- exact-head CI `31856653579` SUCCESS;
- runtime PR #129 merged at `b168d8cda805e5c50480a3e26c5d52e490fb7ac6`;
- Pages `31856698097` SUCCESS;
- explicit real-user verdict `BUILD83 PASS` on 2026-08-15;
- lost response classified through private canonical Lyrics + Track reread;
- no Worker/backend/R2 migration.

### Phase 9 Slice3 — SonicTrace save response-loss truth

**Build84 · v0.19.6 · REAL USER PASS**

- exact-head CI `31858911420` SUCCESS;
- runtime PR #132 merged at `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS;
- explicit real-user verdict `BUILD84 PASS` on 2026-08-15;
- exact requested `analysisId` across canonical latest + history classifies response-loss truth;
- no Track Manager / Worker / R2 schema migration.

### Phase 9 Slice4 — Album metadata save response-loss truth

**Build85 · v0.19.7 · REAL USER PASS**

The fresh post-Build84 audit proved **Album metadata save only** as the smallest coherent remaining Album write-truth gap.

Accepted evidence and behavior:

- exact-head CI `31863267911` SUCCESS on first run;
- runtime PR #135 merged at `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS on that exact merge;
- explicit real-user verdict `BUILD85 PASS` on 2026-08-15;
- canonical pre-read requiring exact `expectedUpdatedAt`;
- no blind automatic retry after lost response;
- new revision + exact requested metadata + stable non-metadata Album shape → committed/verified;
- original revision unchanged → not committed / explicit retry may be safe;
- changed revision without exact metadata-only postcondition → ambiguous / do not retry;
- unreadable canonical state → unverified / do not retry;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build85 intentionally does **not** bundle Album create, membership, move or upload.

### Phase 9 Slice5 — Album move response-loss truth

**Build86 · v0.19.8 · REAL USER PASS**

Accepted evidence and behavior:

- exact-head CI `31868536718` SUCCESS on first run;
- runtime PR #138 merged at `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS on that exact merge;
- candidate docs PR #139 merged at `9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7`;
- candidate docs Pages `31869026213` SUCCESS;
- explicit real-user verdict `BUILD86 PASS` on 2026-08-15;
- covers Album→Album move plus `sourceAlbumId:null` authority repair;
- response-unavailable moves are never blindly retried;
- exact target/source membership + Track cache + stable non-membership shapes → committed/verified;
- partial/mixed state → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build86 intentionally does **not** bundle Album bulk membership, create or upload.

### Phase 9 Slice6 — Album bulk membership response-loss truth

**Build87 · v0.19.9 · REAL USER PASS**

Accepted evidence and behavior:

- exact-head CI `31870328730` SUCCESS on first run;
- runtime PR #141 merged at `b9e1f121c7dc111ee6db06fd4d00227426d96ce7`;
- Pages `31870370403` SUCCESS on that exact merge;
- candidate docs PR #142 merged at `453be9e9d72c9d90cd97ad5f57be02821efec12a`;
- candidate docs Pages `31870838391` SUCCESS;
- explicit real-user verdict `BUILD87 PASS MADAFAKA` on 2026-08-15;
- private pre-read covers the exact Album revision plus the union of previous/requested Track manifests;
- response-unavailable membership saves are never blindly retried;
- exact requested Album order + every expected Track cache + stable non-membership shapes → committed/verified;
- partial/mixed state → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build87 intentionally does **not** bundle Album create or binary upload.

### Phase 9 Slice7 — core private-read transient retry truth

**Build88 · v0.19.10 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #144;
- exact tested head `808b0c63fc22f17a04a9c544b934d97c791d3a73`;
- final runtime CI `31871980725` SUCCESS;
- runtime merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS;
- explicit real-user verdict `BUILD88 PASS MADAFAKA`;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum two total attempts;
- public fallback remains unchanged;
- no POST/write retry behavior changed.

### Phase 9 Slice8 — Album private-read transient retry truth

**Build89 · v0.19.11 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #147;
- exact tested head `8b73d19d8fced35642ee243cff0ac19d983fd0de`;
- final runtime CI `31881635973` SUCCESS;
- runtime merge `b7ae769c66e9adccef79c80467cc8fd0a8534820`;
- Pages `31881682269` SUCCESS;
- explicit real-user verdict `BUILD89 PASS MADAFAKA`;
- Album inventory/detail/private visual discovery and existing canonical Album rereads inherit the bounded GET helper;
- every Album POST/write path remains unchanged.

### Phase 9 Slice9 — Lyrics private-read transient retry truth

**Build90 · v0.19.12 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #150;
- exact tested head `48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01`;
- runtime CI `31884568681` SUCCESS on first run;
- runtime merge `8a851a7d53d3b4f45359c7036011684441bb25bb`;
- Pages `31884614863` SUCCESS;
- explicit real-user verdict `BUILD90 PASS MADAFAKA`;
- normal Lyrics loading and Build83 recovery/verification rereads inherit the bounded GET helper;
- Lyrics validate/save POST semantics were unchanged at Build90.

### Phase 9 Slice10 — SonicTrace private-read transient retry truth

**Build91 · v0.19.13 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #154;
- exact tested head `b8ee223b2d077e5d14936530be219f78ed7910ac`;
- runtime CI `31888303536` SUCCESS on first run;
- runtime merge `591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6`;
- Pages `31888346988` SUCCESS;
- explicit real-user verdict `BUILD91 PASS MADAFAKA`;
- canonical SonicTrace latest/history state and catalog GETs inherit bounded transient retry;
- `sonictrace-analysis-save-v1` remains unchanged and never automatically retried;
- Deep Audio health/analysis XHR and canonical audio download remain out of scope.

### Phase 9 Slice11 — Track metadata response-loss truth

**Build92 · v0.19.14 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #158;
- exact tested head `2b859d831f5fc46eea9853f31c4b86057041128b`;
- final runtime CI `31893496536` SUCCESS;
- runtime merge `d0ca8b3aa4481c3217f79790e347000bfd22823a`;
- Pages `31893652679` SUCCESS;
- explicit real-user verdict `BUILD92 PASS MADAFAKA`;
- second non-mutating validation immediately before POST supplies exact normalized reviewed proposal;
- timeout/transport response loss is never blindly retried;
- new revision + exact reviewed proposal → committed/verified;
- original revision unchanged → not committed;
- changed non-matching revision → ambiguous;
- reread unavailable → unverified;
- no Track Manager/Worker or R2 schema/data change.

### Phase 9 Slice12 — Track metadata validation transient retry truth

**Build93 · v0.19.15 · REAL USER PASS**

Accepted evidence and behavior:

- runtime PR #162;
- exact tested head `fcbe4c59a3a364d9665eba2ed432f37475116364`;
- final runtime CI `31898542379` SUCCESS;
- runtime merge `6c1ceb7d59971ec6c7e251532054392f02c08157`;
- Pages `31898639778` SUCCESS;
- candidate docs PR #163 passed CI `31899284370`, merged at `6464659428e34a679c8acfeb481bfaca78e05bc7`, Pages `31899342536` SUCCESS;
- acceptance docs PR #164 passed CI `31901050237`, merged at `8df0417ee4d96de1e1b386c0fb15af60dcdbc661`, Pages `31901109789` SUCCESS;
- visible Track metadata **Validate** and Build92 fresh pre-save validation share one bounded transient retry policy;
- Build92 `metadata-save-v1` stays zero automatic write retries;
- explicit real-user verdict **`BUILD93 PASS MADAFAKA`**;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

### Phase 9 Slice13 — Lyrics validation transient retry truth

**Build94 · v0.19.16 · REAL USER PASS**

The fresh post-Build93 audit selected canonical Lyrics validation as the smallest coherent remaining reliability gap. Album upload/create still require stronger causality contracts; degraded/offline/PWA remains cross-cutting; retrying Deep Audio compute can duplicate expensive work.

Accepted runtime evidence and behavior:

- original PR #166 / merge `5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35` exposed inherited guard incompatibility in Pages `31902471804` and was rolled back;
- rollback main `6c9c677b2f6299d13949642b712f2bf39b48b676` restored byte-identical accepted Build93 content;
- rollback Pages `31907580912` SUCCESS;
- hotfix PR #167 closed as superseded;
- clean runtime PR #169 rebuilt Build94 from accepted Build93 with inherited guard alignment included before merge;
- exact tested head `81298582163505a11378fe1094f800f1f3d437b5`;
- full runtime CI `31907745153` SUCCESS;
- runtime merge `fe636560de9ca5f3f33aae76dddc5474ba990f17`;
- Pages `31907784289` SUCCESS build + deploy on that exact merge;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may retry `lyrics-validate-v1` once;
- Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal never retry;
- maximum two attempts with finite 9-second timeout per attempt;
- `lyrics-save-v1` remains zero automatic retries;
- Build83 lost-response recovery remains unchanged;
- explicit real-user verdict **`BUILD94 PASS MADAFAKA`** on 2026-08-15;
- normal-browser acceptance confirmed canonical Lyrics load, visible Validate, unchanged canonical lyrics after reload and surrounding navigation;
- acceptance did not manufacture network/Access failure branches;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

## In progress

### Build94 acceptance-docs closeout

Runtime CI, runtime merge, Pages and explicit real-user acceptance are complete. The isolated acceptance-docs branch must still pass its own exact-head CI, merge and Pages before its administrative receipts are final.

**Build95 remains UNALLOCATED.**

## Next

After acceptance-docs closeout, run a fresh read-only post-Build94 Phase9 audit. Audit remaining candidates by proven risk / bounded scope without assuming a build number:

1. Album asset upload response-loss truth;
2. Album create response-loss truth;
3. degraded/offline/PWA resilience;
4. Deep Audio transport/compute behavior, with duplicate-compute causality explicitly considered;
5. any newly proven smaller bounded reliability gap found by the fresh audit.

Pick **one** coherent slice only after the audit proves the gap and confirms it does not duplicate existing recovery logic.

**Build95 remains UNALLOCATED until that audit.**

## Backlog

### Premium interaction polish

Rolling, non-blocking product polish:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

### Phase 10 — progressive extraction

Potential future extraction of mature LRC / SonicTrace / catalog engines while Studio remains orchestrator.

There is currently **no official Phase 11**.

## Frozen roadmap constraints

- Do not create a second queue, workflow-priority engine, Album authority or generic write service.
- Do not reopen completed phases merely because their historical docs are verbose or old.
- Do not use a new phase/build as a bucket for opportunistic refactors.
- Do not treat a candidate as accepted until real-user validation exists where required.
- Do not deliberately damage or interrupt production merely to prove a retry/ambiguity guard.
- Do not generalize GET retry into write retry.
- Do not generalize non-mutating validation retry into write retry.
- Do not generalize one write family's recovery postcondition into another operation family.
- Do not allocate Build95 before Build94 acceptance-docs closeout and a fresh bounded post-Build94 audit select its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact runtime receipts, `QA.md` for the Build94 REAL USER PASS boundary and `changelogs/CHANGELOG-BUILD94.md` for the detailed Build94 rollback/reconstruction record.