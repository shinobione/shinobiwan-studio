# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build92 deployed candidate** publication. Build91 remains REAL USER PASS.

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

The fresh post-Build84 audit proved **Album metadata save only** as the smallest coherent remaining write-truth gap.

Accepted evidence and behavior:

- exact-head CI `31863267911` SUCCESS on first run;
- runtime PR #135 merged at `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS on that exact merge;
- explicit real-user verdict `BUILD85 PASS` on 2026-08-15;
- canonical pre-read requiring exact `expectedUpdatedAt`;
- dedicated 30s metadata save transport classification;
- no blind automatic retry after lost response;
- new revision + exact requested metadata + stable non-metadata Album shape → committed/verified;
- original revision unchanged → not committed / explicit retry may be safe;
- changed revision without exact metadata-only postcondition → ambiguous / do not retry;
- unreadable canonical state → unverified / do not retry;
- normal HTTP success also requires exact response revision + requested metadata + stable non-metadata shape;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build85 intentionally does **not** bundle Album create, membership, move or upload. Each has distinct canonical postconditions and remains a separate audit candidate.

### Phase 9 Slice5 — Album move response-loss truth

**Build86 · v0.19.8 · REAL USER PASS**

The fresh post-Build85 audit selected Album move as the smallest coherent remaining gap.

Accepted evidence and behavior:

- exact-head CI `31868536718` SUCCESS on first run;
- runtime PR #138 merged at `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS on that exact merge;
- candidate docs PR #139 merged at `9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7`;
- candidate docs Pages `31869026213` SUCCESS;
- explicit real-user verdict `BUILD86 PASS` on 2026-08-15;
- covers Album→Album move plus `sourceAlbumId:null` authority repair;
- exact target/source pre-write revisions and exact expected target order/source removal;
- response-unavailable moves are never blindly retried;
- exact target/source membership + Track cache + stable non-membership shapes → committed/verified;
- exact unchanged target/source/Track state → not committed / explicit retry may be safe after fresh reload;
- partial/mixed state → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- normal HTTP success also requires exact response revisions + exact target/source tracklists + Track cache verification;
- normal-browser acceptance confirmed source removal, target persistence/order, Track compatibility-cache convergence and surrounding navigation sanity;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build86 intentionally does **not** bundle Album bulk membership, create or upload.

### Phase 9 Slice6 — Album bulk membership response-loss truth

**Build87 · v0.19.9 · REAL USER PASS**

The fresh post-Build86 audit selected Album bulk membership / ordered tracklist save as the smallest coherent remaining gap.

Accepted evidence and behavior:

- exact-head CI `31870328730` SUCCESS on first run;
- runtime PR #141 merged at `b9e1f121c7dc11102ed994717b50f6d8189b0d`;
- Pages `31870370403` SUCCESS on that exact merge;
- candidate docs PR #142 merged at `453be9e9d72c9d90cd97ad5f57be02821efec12a`;
- candidate docs Pages `31870838391` SUCCESS;
- explicit real-user verdict `BUILD87 PASS MADAFAKA` on 2026-08-15;
- private pre-read covers the exact Album revision plus the union of previous/requested Track manifests;
- requested Track → compatibility cache points to the Album;
- removed Track whose cache claimed the Album → transitional `Singles` cache;
- removed Track whose cache did not claim the Album → cache remains unchanged;
- historically missing prior Track may be removed, but a missing Track may not be newly requested;
- response-unavailable membership saves are never blindly retried;
- exact requested Album order + every expected Track cache + stable non-membership shapes → committed/verified;
- exact unchanged pre-write Album + Track state → not committed / explicit retry may be safe after fresh reload;
- partial/mixed state → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- normal success also verifies exact response revision/order, every affected Track cache and `trackCachesUpdated` when provided;
- normal-browser acceptance confirmed save success, ordered tracklist persistence, preserved Album cache ownership and surrounding navigation sanity;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build87 intentionally does **not** bundle Album create or binary upload.

### Phase 9 Slice7 — core private-read transient retry truth

**Build88 · v0.19.10 · REAL USER PASS**

The fresh post-Build87 audit selected the core private Track Manager GET path as the smallest coherent reliability gap.

Accepted evidence and behavior:

- runtime PR #144;
- exact tested head `808b0c63fc22f17a04a9c544b934d97c791d3a73`;
- final runtime CI `31871980725` SUCCESS;
- runtime merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS on that exact merge;
- candidate docs PR #145 merged at `316ad1b0784d72fb7d29d92c5deaedb56d262e49`;
- candidate docs Pages `31872540118` SUCCESS;
- acceptance docs PR #146 merged at `aebb168883c1f291b97e1d309b4028bb1d78861c`;
- acceptance docs Pages `31881075352` SUCCESS;
- explicit real-user verdict `BUILD88 PASS MADAFAKA` on 2026-08-15;
- non-timeout fetch interruption is now `transport`, not fake `access-or-cors`;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum two total attempts;
- public fallback remains unchanged and occurs only after the private helper ultimately fails;
- no POST/write retry behavior changed;
- normal-browser acceptance confirmed private inventory, normal private Track detail and surrounding navigation sanity;
- acceptance did not manufacture a network/Access failure branch;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Historical validation runs `31871834515` and `31871883072` were red only because inherited successor allowlists capped the runtime at Build87. They were never merge candidates. The final exact head passed the complete chain.

Build88 intentionally does **not** bundle Album create/upload or PWA/service-worker work.

### Phase 9 Slice8 — Album private-read transient retry truth

**Build89 · v0.19.11 · REAL USER PASS**

The fresh post-Build88 audit selected canonical Album collection/detail private GETs as the smallest coherent remaining reliability gap.

Accepted evidence and behavior:

- runtime PR #147;
- exact tested head `8b73d19d8fced35642ee243cff0ac19d983fd0de`;
- final runtime CI `31881635973` SUCCESS;
- runtime merge `b7ae769c66e9adccef79c80467cc8fd0a8534820`;
- Pages `31881682269` SUCCESS on that exact merge;
- candidate docs PR #148 merged at `a7894dad8f4b4015ca1cba47b12781bab417fdcf`;
- candidate docs Pages `31882384329` SUCCESS;
- acceptance docs PR #149 merged at `07bfd3c6b4fa19ccea0656b9ce194f239b7f7c65`;
- acceptance docs Pages `31884092117` SUCCESS;
- explicit real-user verdict `BUILD89 PASS MADAFAKA` on 2026-08-15;
- Album `fetch()` transport interruption is now typed `transport`, not fake Access/CORS;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- Access/CORS, deterministic ordinary 4xx and invalid JSON are never retried;
- maximum two total attempts;
- Album inventory/detail, private visual discovery and existing canonical Album rereads inherit the helper;
- every Album POST/write path remains unchanged;
- Lyrics and SonicTrace private reads remain out of scope;
- normal-browser acceptance confirmed Album inventory, canonical Album detail, artwork/metadata and surrounding Track / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a network/Access failure branch;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Historical runs `31881467538` and `31881538488` were red only because inherited successor allowlists stopped at Build88; neither head was merged. Final exact-head CI passed Phase7, Phase8, Phase9 Build82→89, Focus, TypeScript and Vite.

### Phase 9 Slice9 — Lyrics private-read transient retry truth

**Build90 · v0.19.12 · REAL USER PASS**

The fresh post-Build89 audit selected the single canonical Lyrics private GET as the smallest coherent remaining reliability gap.

Accepted evidence and behavior:

- runtime PR #150;
- exact tested head `48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01`;
- runtime CI `31884568681` SUCCESS **on first run**;
- runtime merge `8a851a7d53d3b4f45359c7036011684441bb25bb`;
- Pages `31884614863` SUCCESS on that exact merge;
- candidate docs PR #151 merged at `442b488511d77da15592a37d6e8d2dca0ed30fb8`;
- candidate docs Pages `31885123431` SUCCESS;
- acceptance docs PR #152 merged at `ebc501df90b8a8bf9229da4a61d7784beba13b78`;
- acceptance docs Pages `31887090784` SUCCESS;
- explicit real-user verdict `BUILD90 PASS MADAFAKA` on 2026-08-15;
- canonical Lyrics GET transport interruption is typed separately from Access/CORS;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- Access/CORS, deterministic ordinary 4xx and invalid JSON are never retried;
- maximum two total attempts;
- normal Lyrics loading and Build83 `rereadLyricsTruth()` inherit the GET helper;
- Lyrics validate/save POSTs remain unchanged and are never automatically retried;
- Build83 response-loss truth remains committed / not-committed / ambiguous / unverified with no blind write retry;
- normal-browser acceptance confirmed deployed Build90, canonical `lyrics.txt` loading on an existing Track and surrounding Track / Albums / SonicTrace / Lyrics navigation sanity;
- acceptance did not manufacture a network/Access failure branch;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build90 intentionally does **not** bundle SonicTrace read retry, Album create/upload or PWA/offline work.

### Phase 9 Slice10 — SonicTrace private-read transient retry truth

**Build91 · v0.19.13 · REAL USER PASS**

The fresh post-Build90 audit selected the private Track Manager SonicTrace GET helper as the smallest coherent remaining reliability gap.

Accepted evidence and behavior:

- runtime PR #154;
- exact tested head `b8ee223b2d077e5d14936530be219f78ed7910ac`;
- runtime CI `31888303536` SUCCESS **on first run**;
- runtime merge `591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6`;
- Pages `31888346988` SUCCESS on that exact merge;
- candidate docs PR #155 merged at `32a57f50c90f3f7677e3a45ad46eace8bd988b3d`;
- candidate docs Pages `31889030115` SUCCESS;
- acceptance docs PR #156 merged at `80b6c34f2bd8937cbbc4ef5e24899d13a6949731`;
- acceptance docs Pages `31892156760` SUCCESS;
- explicit real-user verdict `BUILD91 PASS MADAFAKA` on 2026-08-15;
- canonical SonicTrace latest/history state and catalog GET transport interruptions are typed separately from Access/CORS;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- Access/CORS, deterministic ordinary 4xx, non-JSON gating and invalid JSON are never retried;
- maximum two total attempts;
- the helper is GET-only and no longer accepts arbitrary RequestInit/methods;
- normal canonical SonicTrace state, catalog reads and Build84 verification/recovery rereads inherit the bounded GET helper;
- `sonictrace-analysis-save-v1` POST remains unchanged and is never automatically retried;
- Build84 response-loss truth remains committed / not-committed / ambiguous / unverified with no blind write retry;
- Deep Audio health/analysis XHR and canonical audio download remain out of scope;
- normal-browser acceptance confirmed deployed Build91, canonical SonicTrace latest/history loading on an existing Track, a normal catalog/Intelligence read and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a network/Access failure branch;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Build91 intentionally does **not** bundle Album create/upload or PWA/offline work.

## In progress

### Phase 9 Slice11 — Track metadata response-loss truth

**Build92 · v0.19.14 · DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**

The fresh post-Build91 audit compared Album upload, Album create, degraded/offline/PWA and smaller unprotected reliability gaps. Track metadata save was the smallest coherent gap because Track Manager already owns stale guarding, deterministic proposal application, manifest write, catalog rebuild, canonical reread and rollback while Studio lacked lost-response truth.

Candidate evidence and behavior:

- runtime PR #158;
- exact tested head `2b859d831f5fc46eea9853f31c4b86057041128b`;
- final runtime CI `31893496536` SUCCESS;
- historical CI `31893447100` was red only because the inherited Build80 duration-evidence guard still expected validation and save checks in one file; no runtime change was needed for the guard fix;
- runtime merge `d0ca8b3aa4481c3217f79790e347000bfd22823a`;
- Pages `31893652679` SUCCESS on that exact merge;
- a second non-mutating validation immediately before POST supplies the exact normalized reviewed proposal;
- canonical pre-read requires exact `expectedUpdatedAt`;
- derived audio duration remains non-editable and is included in the reviewed proposal when evidence exists;
- timeout/transport response loss is never blindly retried;
- new revision + exact reviewed proposal → committed/verified;
- original revision unchanged → not committed / explicit retry safe after reconnect;
- changed revision without exact proposal → ambiguous / do not retry;
- reread unavailable → unverified / do not retry;
- normal `saved`/`noChange` HTTP responses are also canonically reread and exactly verified;
- recovered-after-lost-response does not fabricate an independently unobservable derived catalog rebuild receipt;
- no Track create, asset upload/delete, Album create/upload, Lyrics/SonicTrace write, PWA/offline, Track Manager/Worker or R2 schema/data change.

## Next

Run the bounded normal-browser Build92 Track metadata regression smoke. Do not deliberately cut network/Access to manufacture a lost response. If accepted, run a fresh read-only post-Build92 audit before allocating any successor.

**Build93 remains UNALLOCATED.**

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
- Do not generalize one write family's recovery postcondition into another operation family.
- Do not allocate Build93 before Build92 acceptance plus a fresh bounded post-Build92 audit.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build92 candidate smoke boundary.