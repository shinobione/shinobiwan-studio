# Studio v0.19.6 · Build84 — Phase9 SonicTrace save response-loss truth

Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**.

## Audit proof

Build84 was allocated only after the post-Build83 fresh Phase9 audit proved SonicTrace analysis persistence as the smallest remaining bounded write-truth gap.

Studio previously sent the guarded SonicTrace save through a generic admin JSON transport. If the HTTP response timed out or disappeared after the request began, Studio surfaced a network failure but did not determine whether the canonical analysis had actually persisted.

A read-only audit of the deployed Track Manager source confirmed that one SonicTrace save owns two deterministic R2 sidecars for the same unique `analysisId`:

```text
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
tracks/<slug>/analysis/sonictrace/latest.json
```

The backend writes history first, then latest, rereads both, and attempts rollback if verification fails. This gives Studio operation-specific canonical postconditions without any Track Manager change.

Broader Album writes were not selected because the remaining family spans create, metadata, membership, move and upload with different postconditions; that would not be the smallest coherent Phase9 slice.

## Scope

Build84 changes only Studio client behavior around **saving an already-produced SonicTrace analysis**.

It does not change:

- SonicTrace Deep Audio computation;
- Track Manager source or deployment;
- the Studio bridge;
- Cloudflare Workers;
- R2 schema/data;
- LaunchPAD;
- LRC Maker.

## Lost-response contract

```text
SonicTrace save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of latest + history
   ├─ requested analysisId present in BOTH latest + history
   │    → COMMITTED / VERIFIED
   ├─ requested analysisId absent from BOTH latest + history
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ requested analysisId present in only one canonical sidecar
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Before the POST, Studio also rereads canonical SonicTrace state to reject an already-persisted `analysisId` and reject a stale canonical audio source revision.

Normal HTTP success now also requires canonical reread proving the requested `analysisId` in both latest and history before Studio calls the save verified.

## UX truth

The SonicTrace panel distinguishes:

- normal save canonically verified in latest + history;
- recovered verified success after a lost response;
- the narrow retry-safe `NOT COMMITTED` state;
- `AMBIGUOUS` / `UNVERIFIED` states with explicit **DO NOT RETRY** guidance.

Recovered success explicitly states that Studio did **not** retry the write.

## Validation

Final runtime evidence:

```text
Safety pre              safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final CI                31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build84-deployed-candidate-20260815-0425
Worker deploy           NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         PENDING
```

`check:phase9` keeps:

1. Build82 destructive asset-delete ambiguity guard;
2. Build83 canonical Lyrics save response-loss guard as inherited ancestry;
3. new `test-phase9-sonictrace-response-loss-build84.mjs`.

Historical Studio Focus / Phase7-C guards were widened only for the bounded v0.19.6 successor while preserving their functional assertions and Build81→82→83 ancestry requirements.

The exact Build84 feature head passed the complete repository-native chain including Phase9, Studio Focus, TypeScript and Vite production build.

## Safety / rollback

Runtime rollback is a Studio-only revert of PR #132. No Worker or R2 migration rollback is required because this slice introduced no backend deployment or schema/data migration.

A deliberately interrupted production SonicTrace save is not required merely to prove the ambiguity branches. Normal browser regression plus guarded source/type/build validation remains the preferred acceptance path.

## Real-user acceptance boundary

Pending normal-browser smoke:

1. verify `v0.19.6 · Build84` after hard refresh;
2. load a private Track with canonical master audio;
3. confirm SonicTrace latest/history reads normally;
4. perform a normal scan;
5. save one intentional analysis if the new history entry is acceptable;
6. confirm the receipt **`Analysis saved and canonically verified in latest + history.`**;
7. confirm latest/history and surrounding Studio navigation remain healthy.

Do not deliberately cut network/Access merely to manufacture response loss.

## Stop line

- Build84 must not be promoted to REAL USER PASS until explicit browser acceptance is recorded.
- No successor build is allocated while Build84 acceptance is pending.
- No automatic retry policy is generalized to Album or other write families.
- Remaining Album writes stay a later Phase9 audit candidate.
