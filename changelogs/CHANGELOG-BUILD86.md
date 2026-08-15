# Studio v0.19.8 · Build86 — Phase9 Album move response-loss truth

Status: **REAL USER PASS · ACCEPTED**.

## Fresh audit proof

Build86 was allocated only after Build85 received explicit REAL USER PASS and its docs closeout was merged/deployed.

The fresh read-only Phase9 audit compared the remaining candidate families:

- Album membership save;
- Album move;
- Album asset upload;
- Album create;
- Access/CORS hardening;
- bounded read retries/timeouts;
- degraded/offline/PWA resilience.

**Album move** was the smallest coherent remaining gap.

Why:

- the deployed Track Manager already owns exact target/source stale guards;
- it computes deterministic ordered target membership and source removal;
- it updates the single Track compatibility cache;
- it rebuilds the catalog;
- it rereads target Album + optional source Album + Track cache before success;
- it rolls back touched Albums/Track cache/catalog on transaction failure;
- Studio's previous normal-success path already reread the same target/source/Track triplet;
- only timeout/transport/invalid-response commit truth remained generic and ambiguous.

Other candidates were deliberately deferred:

- membership may update an arbitrary number of Track caches and needs broader cache verification;
- upload mutates binary R2 object state plus manifest/catalog and exact binary causality is harder to prove after a lost response without server-returned ETag/digest evidence;
- create has no pre-write Album revision and no client operation identifier;
- read retry / Access / PWA changes are cross-cutting rather than one small operation-specific write gap.

## Scope

Build86 changes Studio-side **Album move** response-loss handling for both existing uses of `album-track-move-v1`:

1. canonical Album → Album move;
2. `sourceAlbumId:null` authority repair used when a Track compatibility cache claims an Album but canonical `album.trackIds` is missing the Track.

No Track Manager / Worker / R2 schema/data change was required.

## Lost-response contract

Before POST, Studio privately rereads:

- target Album;
- optional source Album;
- Track manifest / compatibility cache.

It requires exact expected target/source revisions and computes the exact ordered target/source postconditions using the same insert/remove semantics as Track Manager.

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ target new revision + exact target order
   │  + source? new revision + exact source removal
   │  + Track cache points to target
   │  + non-membership Album/Track shapes remain stable
   │    → COMMITTED / VERIFIED
   ├─ exact target/source/Track pre-write state remains unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ any partial/mixed/changed state that does not prove exact commit
   │    → AMBIGUOUS / DO NOT RETRY
   └─ canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Timeout, fetch interruption and JSON response corruption are treated as response-unavailable cases. A Cloudflare Access HTML/non-JSON gate remains a distinct Access failure rather than being guessed as a committed write.

## Normal success verification

Normal Track Manager success is not accepted merely because the response says `moved:true`.

Studio rereads target/source/Track and requires:

- exact server-returned target revision;
- exact server-returned source revision when source exists;
- exact expected ordered target `trackIds`;
- exact expected source `trackIds` when source exists;
- target/source stable non-membership shape;
- Track compatibility cache pointing to target;
- stable non-Album Track shape.

Mismatch becomes `ALBUM_MOVE_AMBIGUOUS / DO NOT RETRY`; reread failure becomes `ALBUM_MOVE_UNVERIFIED / DO NOT RETRY`.

## UX truth

Both Album Manager cross-release moves and Metadata authority repair use the same resilient service.

Verified lost-response recovery shows:

```text
RECOVERED AFTER LOST RESPONSE
Studio did not retry the write.
```

The service exposes:

- `RETRY SAFE AFTER RECONNECT` only for the exact unchanged pre-write state;
- `DO NOT RETRY` for ambiguous/unverified outcomes.

Existing mutation wrappers reload canonical state after error before another operator decision.

## Validation

Build86 adds:

- `src/services/album-move-admin-api.ts`;
- `scripts/test-phase9-album-move-response-loss-build86.mjs`;
- Phase9 gate inheritance Build82 → Build83 → Build84 → Build85 → Build86;
- bounded historical successor compatibility through `v0.19.8 / Build86` without weakening functional assertions.

Exact acceptance evidence:

```text
Safety pre              safety/pre-phase9-album-move-response-loss-build86-20260815-0757
Runtime PR              #138
Exact tested head       0d99d17631e3f72a360f404a1269cc05cda33dd8
Final CI                31868536718 · SUCCESS · first run
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

The exact Build86 feature head passed the complete repository-native validation chain including inherited Phase9 guards, Studio Focus guards, TypeScript and Vite production build **on the first CI run**.

## Real-user acceptance — PASS

The acceptance smoke remained a normal safe browser regression; no manufactured response-loss failure was required.

The user performed one genuine safe canonical Album move and returned explicit:

```text
BUILD86 PASS
```

Acceptance covered:

- deployed `v0.19.8 · Build86` identity;
- normal Album move receipt `Track moved and canonically verified across target, source and Track cache.`;
- source Album removal;
- target Album insertion/order;
- persistence after canonical source/target reload;
- moved Track compatibility cache converging to the target Album;
- quick surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation sanity.

No network/Access sabotage was used to manufacture a lost response.

## Safety / rollback

Runtime rollback is Studio-only. Build86 introduces no backend deployment and no R2 schema/data migration.

## Stop line

- Do not generalize Build86 to Album membership/create/upload.
- Do not merge red CI.
- Merge only the exact tested head.
- Runtime merge, Pages deployment and real-user acceptance remain separate states.
- Build87 remains unallocated until a fresh bounded post-Build86 audit selects its scope.
