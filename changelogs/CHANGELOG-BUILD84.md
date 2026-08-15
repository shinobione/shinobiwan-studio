# Studio v0.19.6 · Build84 — Phase9 SonicTrace save response-loss truth

Status at implementation PR: **candidate / CI + deployment + real-user acceptance pending**.

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

## Validation contract

`check:phase9` keeps:

1. Build82 destructive asset-delete ambiguity guard;
2. Build83 canonical Lyrics save response-loss guard as inherited ancestry;
3. new `test-phase9-sonictrace-response-loss-build84.mjs`.

Historical Studio Focus / Phase7-C guards are widened only for the bounded v0.19.6 successor while preserving their functional assertions and Build81→82→83 ancestry requirements.

## Safety / rollback

Runtime rollback is a Studio-only revert of the Build84 PR. No Worker or R2 migration rollback is required because this slice introduces no backend deployment or schema/data migration.

A deliberately interrupted production SonicTrace save is not required merely to prove the ambiguity branches. Normal browser regression plus guarded source/type/build validation remains the preferred acceptance path unless an intentionally disposable analysis scenario is chosen.

## Stop line

- Build84 must not be promoted to REAL USER PASS until exact-head CI, exact merge-SHA Pages deployment and required normal browser regression smoke are separately recorded.
- No automatic retry policy is generalized to Album or other write families.
- Remaining Album writes stay a later Phase9 audit candidate.
