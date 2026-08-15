# Studio v0.19.9 · Build87 — Phase9 Album membership response-loss truth

Status: **REAL USER PASS · ACCEPTED**.

## Fresh audit proof

Build87 was allocated only after Build86 received explicit REAL USER PASS and its acceptance closeout was merged and deployed.

The fresh read-only Phase9 audit compared the remaining candidate families:

- Album bulk membership save;
- Album asset upload;
- Album create;
- Access/CORS hardening;
- bounded read retries/timeouts;
- degraded/offline/PWA resilience.

**Album bulk membership save** is the smallest coherent remaining gap.

Why:

- Studio still used the generic Album `writeJson()` wrapper for `album-membership-save-v1`;
- a timeout / interrupted fetch / unreadable JSON response could not determine whether the ordered tracklist committed;
- normal Studio success reread only the Album manifest and did not prove every Track compatibility-cache update;
- the deployed Track Manager already stale-guards the Album, rejects cross-Album ownership conflicts, computes deterministic membership/cache changes, writes Album + affected Track caches, rebuilds catalog and rolls back touched state on failure;
- the complete client-side postcondition is deterministic from the pre-write Album plus the union of previous and requested Track IDs.

Upload remains deferred because a lost binary upload response does not currently give Studio a precomputable server ETag/digest with which to prove the exact uploaded bytes.

Create remains deferred because there is no pre-write Album revision or client operation identifier; an absent→present Album alone is weaker causal evidence than revision-guarded membership.

Access/read/PWA candidates remain cross-cutting rather than one bounded write operation.

## Scope

Build87 hardens Studio-side canonical **Album bulk membership / ordered tracklist save only**.

It does not change:

- Album move (Build86 remains inherited);
- Album metadata save (Build85 remains inherited);
- Album create;
- Album cover/thumbnail upload;
- Album asset delete;
- Track Manager source or Worker deployment;
- R2 schema/data model;
- LaunchPAD, SonicTrace Deep Audio or LRC Maker.

## Canonical pre-write snapshot

Before POST, Studio privately rereads:

- the canonical Album manifest;
- every Track in the union of the previous and requested `album.trackIds`.

The exact expected Album revision must still match the UI revision.

For each Track, Studio computes the same cache postcondition as Track Manager:

```text
Track requested in Album
→ cache should be { id: album.id, title: album.title }

Track removed from Album AND its cache currently claims that Album
→ cache should become { id: 'singles', title: 'Singles' }

Track removed but its cache does not claim this Album
→ cache must remain unchanged

Historically missing prior Track being removed
→ remains absent; no fake cache write is created
```

A missing Track may never be introduced into the requested tracklist. The ordered requested `album.trackIds` remain the sole canonical membership/artistic-order authority.

## Lost-response contract

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track cache reread
   ├─ Album has a new revision + exact requested ordered trackIds
   │  + Album non-membership shape is stable
   │  + every Track cache equals its exact expected postcondition
   │  + only Tracks that required a cache write changed revision
   │  + Track non-album shapes remain stable
   │    → COMMITTED / VERIFIED
   ├─ Album revision/trackIds/shape exactly match pre-write state
   │  + every affected Track revision/cache/non-album shape exactly matches pre-write state
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ any partial/mixed/changed state that does not prove either exact state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Timeout, fetch interruption and unreadable JSON response are the only lost-response classes allowed into recovery. Cloudflare Access HTML/non-JSON gating remains a distinct Access failure and is not guessed as a committed write.

## Normal success verification

A normal Track Manager `saved:true` response is not enough.

Studio additionally requires:

- exact server-returned Album revision;
- exact server-returned ordered `trackIds`;
- exact canonical ordered `trackIds` after reread;
- stable Album non-membership shape;
- exact expected cache state for every previous/requested Track;
- stable non-album Track shape;
- changed Track revision only when a cache mutation was required;
- server `trackCachesUpdated` count to match the client-computed expected count when the field is provided.

Mismatch becomes `ALBUM_MEMBERSHIP_AMBIGUOUS / DO NOT RETRY`.

## UX truth

Normal verified save:

```text
Album tracklist saved and canonically verified across Album + Track caches.
```

Recovered verified save after lost response:

```text
RECOVERED AFTER LOST RESPONSE · Album tracklist is canonically verified across Album + Track caches.
Studio did not retry the write.
```

The service exposes `RETRY SAFE AFTER RECONNECT` only when the exact pre-write Album + Track cache state remains canonical, and `DO NOT RETRY` for ambiguous/unverified outcomes.

The existing mutation wrapper reloads canonical state after any error before another operator decision.

## Validation evidence

Build87 adds:

- `src/services/album-membership-admin-api.ts`;
- `scripts/test-phase9-album-membership-response-loss-build87.mjs`;
- Phase9 gate inheritance Build82 → Build83 → Build84 → Build85 → Build86 → Build87;
- bounded historical successor compatibility through `v0.19.9 / Build87` without weakening functional assertions.

Exact acceptance evidence:

```text
Safety pre              safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
Safety pre-PR           safety/post-build87-prepr-20260815-0844
Runtime PR              #141
Exact tested head       5f155d312b0af7227325a78480bfd424a96e7859
Final CI                31870328730 · SUCCESS · first run
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

The exact Build87 runtime head passed the complete repository-native validation chain including inherited Phase9 guards, Studio Focus guards, TypeScript and Vite production build **on the first CI run**.

## Real-user acceptance — PASS

Acceptance used a normal safe browser regression rather than a manufactured network failure.

The user returned the explicit verdict:

```text
BUILD87 PASS MADAFAKA
```

The accepted boundary covered normal Album tracklist reorder/save, the expected full canonical verification receipt, persistence after reload, preserved Album compatibility-cache ownership on reordered Tracks and surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation sanity.

No deliberate network/Access interruption was required.

## Safety / rollback

Runtime rollback is Studio-only. Build87 introduces no backend deployment and no R2 schema/data migration.

## Stop line

- Do not generalize Build87 to Album create or upload.
- Do not merge red CI.
- Merge only the exact tested head.
- Runtime merge, Pages deployment and real-user acceptance remain separate states.
- Do not allocate Build88 until a fresh bounded audit proves the next scope.
