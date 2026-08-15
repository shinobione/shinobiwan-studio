# Studio v0.19.7 · Build85 — Phase9 Album metadata save response-loss truth

Status: **IMPLEMENTATION CANDIDATE · CI PENDING**.

## Fresh audit proof

Build85 was allocated only after the accepted Build84 closeout and a new read-only Phase9 audit.

The audit compared the remaining reliability candidates and found the smallest coherent unprotected write family in canonical Album management: **metadata save only**.

Studio's existing generic Album POST transport could already verify a normal metadata success with a canonical Album reread. However, if the metadata POST timed out or the browser lost the response after the request began, Studio could not determine whether the canonical Album manifest had actually advanced.

A read-only audit of the deployed Track Manager v5.23 / Studio bridge v1.13 source confirmed that metadata save already performs:

```text
expectedUpdatedAt stale guard
→ write proposed Album manifest
→ update title-dependent Track compatibility caches if required
→ rebuild catalog
→ reread canonical Album manifest
→ verify proposed revision / id / title
→ rollback Album + touched Track caches on failure
```

No Track Manager or Worker change is required for the Studio client to classify a lost metadata response from canonical state.

Broader Album writes remain separate audit families:

- create has absence/presence and catalog semantics without a pre-write revision;
- membership mutates ordered `album.trackIds` plus multiple Track compatibility caches;
- move mutates source Album + target Album + Track cache;
- upload mutates binary asset state + manifest revision.

They are intentionally **not** bundled into Build85.

## Scope

Build85 changes only Studio's canonical **Album metadata save** path.

It does not change:

- Album create;
- Album membership/order save;
- Album cross-release move;
- Album asset upload or deletion;
- Track Manager source or deployment;
- Studio bridge or Cloudflare Workers;
- R2 schema/data migration;
- LaunchPAD;
- SonicTrace Deep Audio;
- LRC Maker.

## Lost-response contract

Before POST, Studio performs a private canonical Album reread and requires the exact `expectedUpdatedAt` revision.

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision
   │  + exact requested metadata
   │  + unchanged non-metadata Album shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

The stable non-metadata shape checked by Studio includes canonical identity, ordered `trackIds`, assets and `createdAt`. This prevents a membership/asset change from being mistaken for a metadata-only save recovery.

Normal HTTP success is also canonically reread and is only called verified when:

- the reread revision equals the exact server-returned `updatedAt`;
- requested metadata matches canonical values;
- non-metadata Album shape remains stable.

## UX truth

Album Management now distinguishes:

- normal metadata save canonically verified;
- **RECOVERED AFTER LOST RESPONSE** with an explicit statement that Studio did not retry the write;
- **RETRY SAFE AFTER RECONNECT** only when the original revision is still canonical;
- **DO NOT RETRY** for ambiguous or unverified outcomes.

After any error, the existing Album mutation wrapper reloads canonical state before the next operator decision.

## Validation target

Build85 adds `scripts/test-phase9-album-metadata-response-loss-build85.mjs` and extends `check:phase9` while keeping Build82, Build83 and Build84 guards inherited.

Expected candidate validation:

```text
Safety pre              safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Runtime PR              PENDING
Exact tested head       PENDING
Final CI                PENDING
Runtime merge           PENDING
Runtime Pages           PENDING
Worker deploy           NONE planned
R2 migration/write      NONE caused by deployment
Real-user smoke         PENDING after deployment
```

## Safety / rollback

Runtime rollback is Studio-only. No backend or R2 migration rollback is expected because Build85 adds no Worker deployment and no schema/data migration.

A deliberately interrupted production metadata save is **not** required merely to prove the lost-response branches. Guarded source validation plus a normal browser metadata-save regression is the intended acceptance path.

## Stop line

- Do not generalize Build85 logic into Album membership/move/upload without a fresh operation-specific audit.
- Do not merge red CI.
- Merge only the exact tested runtime head.
- Keep runtime merge, Pages deployment and real-user acceptance as separate states.
