# SHINOBIWAN STUDIO — Canonical Roadmap

Updated: 2026-08-15 after explicit **Build92 REAL USER PASS**.

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

- Track + Album asset delete lost-response classification;
- no blind automatic retry;
- private canonical reread required;
- normal success also canonically verified;
- no Worker/backend/R2 migration.

### Phase 9 Slice2 — canonical Lyrics save response-loss truth

**Build83 · v0.19.5 · REAL USER PASS**

- runtime PR #129;
- CI `31856653579` SUCCESS;
- merge `b168d8cda805e5c50480a3e26c5d52e490fb7ac6`;
- Pages `31856698097` SUCCESS;
- explicit verdict `BUILD83 PASS`;
- exact revision + ETag + normalized text classify lost-response truth.

### Phase 9 Slice3 — SonicTrace save response-loss truth

**Build84 · v0.19.6 · REAL USER PASS**

- runtime PR #132;
- CI `31858911420` SUCCESS;
- merge `b7cf745e11adee1eb77900a32b9b6ca8ea80e000`;
- Pages `31858977765` SUCCESS;
- explicit verdict `BUILD84 PASS`;
- exact `analysisId` across canonical latest + history classifies response-loss truth.

### Phase 9 Slice4 — Album metadata save response-loss truth

**Build85 · v0.19.7 · REAL USER PASS**

- CI `31863267911` SUCCESS on first run;
- runtime PR #135;
- merge `1199f6a0e26da88e54f64a369985c2a72267e5a5`;
- Pages `31863313848` SUCCESS;
- explicit verdict `BUILD85 PASS`;
- exact pre-write revision;
- timeout/transport never blindly retried;
- exact new revision + requested metadata + stable non-metadata Album shape → committed/verified;
- unchanged revision → not committed / explicit retry may be safe;
- changed but unproven → ambiguous / do not retry;
- unreadable canonical state → unverified.

Build85 intentionally does **not** bundle Album create, membership, move or upload.

### Phase 9 Slice5 — Album move response-loss truth

**Build86 · v0.19.8 · REAL USER PASS**

- CI `31868536718` SUCCESS on first run;
- runtime PR #138;
- merge `866ebf9c2a501d11102ed994717b50f6d8189b0d`;
- Pages `31868570112` SUCCESS;
- explicit verdict `BUILD86 PASS`;
- covers Album→Album move plus `sourceAlbumId:null` authority repair;
- target/source/Track exact postconditions;
- no blind retry after response loss;
- no Track Manager, Worker or R2 migration.

Build86 intentionally does **not** bundle Album bulk membership, create or upload.

### Phase 9 Slice6 — Album bulk membership response-loss truth

**Build87 · v0.19.9 · REAL USER PASS**

- CI `31870328730` SUCCESS on first run;
- runtime PR #141;
- merge `b9e1f121c7dc111ee6db06fd4d00227426d96ce7`;
- Pages `31870370403` SUCCESS;
- candidate docs PR #142 / Pages `31870838391` SUCCESS;
- explicit verdict `BUILD87 PASS MADAFAKA`;
- exact Album revision + union of previous/requested Tracks;
- exact expected compatibility-cache semantics;
- exact requested order + Track caches + stable shapes → committed/verified;
- exact unchanged pre-write state → not committed;
- partial/mixed state → ambiguous;
- reread unavailable → unverified.

Build87 intentionally does **not** bundle Album create or binary upload.

### Phase 9 Slice7 — core private-read transient retry truth

**Build88 · v0.19.10 · REAL USER PASS**

- runtime PR #144;
- exact head `808b0c63fc22f17a04a9c544b934d97c791d3a73`;
- CI `31871980725` SUCCESS;
- merge `9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633`;
- Pages `31872073050` SUCCESS;
- explicit verdict `BUILD88 PASS MADAFAKA`;
- timeout / transport / transient HTTP allowlist may receive one retry;
- Access/CORS, deterministic ordinary 4xx, non-JSON gating and invalid JSON receive no retry;
- maximum two attempts;
- GET-only; no write retry behavior changed.

Build88 intentionally does **not** bundle Album create/upload or PWA/service-worker work.

### Phase 9 Slice8 — Album private-read transient retry truth

**Build89 · v0.19.11 · REAL USER PASS**

- runtime PR #147;
- exact head `8b73d19d8fced35642ee243cff0ac19d983fd0de`;
- CI `31881635973` SUCCESS;
- merge `b7ae769c66e9adccef79c80467cc8fd0a8534820`;
- Pages `31881682269` SUCCESS;
- explicit verdict `BUILD89 PASS MADAFAKA`;
- Album collection/detail/private visual reads inherit bounded GET retry truth;
- every Album write remains unchanged.

### Phase 9 Slice9 — Lyrics private-read transient retry truth

**Build90 · v0.19.12 · REAL USER PASS**

- runtime PR #150;
- exact head `48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01`;
- CI `31884568681` SUCCESS on first run;
- merge `8a851a7d53d3b4f45359c7036011684441bb25bb`;
- Pages `31884614863` SUCCESS;
- explicit verdict `BUILD90 PASS MADAFAKA`;
- canonical Lyrics GET gains one bounded transient retry;
- Build83 save truth remains unchanged and never auto-retries writes.

### Phase 9 Slice10 — SonicTrace private-read transient retry truth

**Build91 · v0.19.13 · REAL USER PASS**

- runtime PR #154;
- exact head `b8ee223b2d077e5d14936530be219f78ed7910ac`;
- CI `31888303536` SUCCESS on first run;
- merge `591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6`;
- Pages `31888346988` SUCCESS;
- acceptance docs PR #156 / Pages `31892156760` SUCCESS;
- explicit verdict `BUILD91 PASS MADAFAKA`;
- canonical latest/history + SonicTrace catalog gain one bounded transient GET retry;
- Build84 save truth remains unchanged;
- Deep Audio health/analysis XHR and canonical audio download remain out of scope.

### Phase 9 Slice11 — Track metadata response-loss truth

**Build92 · v0.19.14 · REAL USER PASS**

The fresh post-Build91 audit compared Album upload, Album create, degraded/offline/PWA and smaller unprotected reliability gaps. Track metadata save was the smallest coherent gap because Track Manager already owns stale guarding, deterministic proposal application, manifest write, catalog rebuild, canonical reread and rollback while Studio lacked lost-response truth.

Accepted evidence and behavior:

- runtime PR #158;
- exact tested head `2b859d831f5fc46eea9853f31c4b86057041128b`;
- final runtime CI `31893496536` SUCCESS;
- historical CI `31893447100` was red only because the inherited Build80 duration-evidence guard still expected validation and save checks in one file; no runtime change was needed for the guard fix and that head was never merged;
- runtime merge `d0ca8b3aa4481c3217f79790e347000bfd22823a`;
- Pages `31893652679` SUCCESS on that exact merge;
- candidate docs PR #159;
- candidate docs CI `31894353160` SUCCESS;
- candidate docs merge `f46b846841e6ef9ce705b2fa3817baecd0aecefa`;
- candidate docs Pages `31894411652` SUCCESS;
- safety post-acceptance `safety/post-build92-real-user-pass-20260815-1819`;
- explicit real-user verdict `BUILD92 PASS MADAFAKA` on 2026-08-15;
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
- accepted browser smoke confirmed one harmless reversible metadata edit through Validate → one normal Save, `CANONICAL REREAD · VERIFIED`, persistence after reload and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity;
- acceptance did not manufacture a network/Access/response-loss branch;
- no Track create, asset upload/delete, Album create/upload, Lyrics/SonicTrace write, PWA/offline, Track Manager/Worker or R2 schema/data change.

## In progress

### Phase 9 — fresh post-Build92 reliability audit

Build92 is accepted. **Build93 is not allocated.**

The next task is a fresh read-only audit to identify the smallest remaining reliability gap without duplicating existing recovery logic or turning Phase9 into a generic refactor bucket.

## Next

Audit remaining candidates by proven risk / bounded scope, without assuming a build number:

1. Album asset upload response-loss truth;
2. Album create response-loss truth;
3. degraded/offline/PWA resilience;
4. any newly proven smaller bounded reliability gap found by the fresh audit.

Pick **one** coherent slice only after the audit proves the gap and confirms it does not duplicate existing recovery logic.

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
- Do not allocate Build93 before a fresh bounded post-Build92 audit selects its scope.

## Current acceptance pointer

See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build92 REAL USER PASS boundary.