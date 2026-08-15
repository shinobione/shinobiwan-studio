# SHINOBIWAN Studio v0.19.4 · Build 82

Codename: `studio-focus-slice4-phase9-destructive-write-ambiguity-guard`  
Date: 2026-08-15  
Status: **CANDIDATE — CI + DEPLOY + REAL-USER SMOKE REQUIRED**

## Why Phase9 starts here

A fresh post-Build81 audit found no remaining Phase8 capability gap worth inventing a new dashboard/queue/write authority for.

The previously retained `Magnetic Midnight` palette-fetch issue is historical and already fixed since Build62 by URL-aware media credentials (`include` only for private Track Manager media, `omit` for public cover reads) with a permanent Build62 regression guard. Build82 therefore does not duplicate that fix.

The first real Phase9 reliability gap is lost-response ambiguity on destructive asset deletion.

Before Build82:

- Track asset upload already recovered a timeout/transport-loss response through private canonical reread and classified the outcome;
- Track asset delete did not: a lost response could leave the operator unsure whether the destructive write committed;
- Album asset delete had the same ambiguity and no finite delete-specific timeout;
- blind retry remained forbidden, but Studio could not tell the user when retry was actually safe.

## Build82 contract

For Track asset delete and Album asset delete:

```text
capture exact canonical pre-write revision + asset presence
→ issue existing guarded delete operation
→ response received
   → private canonical reread
   → success only on exact new revision + asset absent

→ response lost / timeout
   → NO automatic retry
   → private canonical reread
      ├─ revision changed + asset absent
      │    → COMMITTED / recovered / verified
      ├─ revision unchanged + asset still present
      │    → NOT COMMITTED / explicit retry may be safe
      ├─ state changed but causality cannot be proved
      │    → AMBIGUOUS / DO NOT RETRY
      └─ reread unavailable
           → UNVERIFIED / DO NOT RETRY
```

## Track asset delete

- adds dedicated 30-second bounded delete transport;
- captures the canonical Track revision and asset state before deletion;
- rejects stale or already-missing destructive requests before write;
- classifies transport-loss outcomes through `getAdminTrack()`;
- reports `ASSET_DELETE_NOT_COMMITTED`, `ASSET_DELETE_AMBIGUOUS`, or `ASSET_DELETE_UNVERIFIED` as typed outcomes;
- lost response may be recovered as verified success only when a new revision plus canonical asset absence are both proved;
- even a normal success response is no longer accepted unless the post-write canonical reread verifies exact revision plus absence.

## Album asset delete

- adds a dedicated 30-second bounded delete transport;
- canonical Album reads now use a bounded 7-second timeout;
- captures exact Album revision + asset state before deletion;
- rejects stale/already-missing destructive requests before write;
- classifies lost delete responses through private `getAdminAlbum()` reread;
- exposes typed not-committed / ambiguous / unverified outcomes;
- normal success also requires exact post-write revision + absence verification.

## Deliberately out of Build82

The same general response-loss audit identified non-destructive save paths (Lyrics, SonicTrace and broader Album writes) that can still report transport failure without classifying canonical commit state. They remain Phase9 follow-up candidates.

Build82 intentionally starts with destructive deletes rather than attempting a cross-stack reliability refactor in one step.

## Safety

```text
Accepted baseline        v0.19.3 · Build81 · REAL USER PASS
Safety pre               safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration             NONE
```

No destructive production asset is intentionally mutated as part of automated validation. The Build82 regression guard proves source contracts and the real-user smoke should use normal existing UI state; a disposable Draft is preferred if a destructive test is needed.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.
