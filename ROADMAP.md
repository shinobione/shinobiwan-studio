# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after **Build88 deployed candidate** publication.

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
- runtime PR #141 merged at `b9e1f121c7dc111ee6db06fd4d00227426d96ce7`;
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

## In progress

### Phase 9 Slice7 — core private-read transient retry truth

**Build88 · v0.19.10 · DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**

The fresh post-Build87 audit selected the core private Track Manager GET path as the smallest coherent reliability gap.

Candidate evidence and behavior:

- runtime PR #144;
- exact tested head `808b0c63fc22f17a04a9c544b934d97c791d3a73`;
- final runtime CI `31871980725` SUCCESS;
- runtime merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS on that exact merge;
- non-timeout fetch interruption is now `transport`, not fake `access-or-cors`;
- timeout / transport / HTTP `408/425/429/500/502/503/504` may receive one bounded retry;
- 401/403, deterministic ordinary 4xx, non-JSON Access/gating responses and invalid JSON are never retried;
- maximum two total attempts;
- public fallback remains unchanged and occurs only after the private helper ultimately fails;
- no POST/write retry behavior changed;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

Historical validation runs `31871834515` and `31871883072` were red only because inherited successor allowlists capped the runtime at Build87. They were never merge candidates. The final exact head passed the complete chain.

Build88 intentionally does **not** bundle Album create/upload or PWA/service-worker work.

## Next

Complete the **Build88 normal-browser private-read regression smoke**:

1. hard refresh and verify `v0.19.10 · Build88`;
2. Home / Tracks should load the normal private inventory, including Draft Tracks when present;
3. open a Track and verify normal private canonical detail;
4. quick Albums / Lyrics / SonicTrace navigation sanity;
5. do not deliberately cut network or invalidate Access merely to manufacture the retry path.

**Build89 is unallocated.** Only after explicit Build88 PASS should another fresh read-only audit compare remaining candidates such as Album asset upload, Album create, broader read resilience and degraded/offline/PWA behavior.

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
- Do not allocate Build89 while Build88 acceptance remains pending.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build88 smoke boundary.
