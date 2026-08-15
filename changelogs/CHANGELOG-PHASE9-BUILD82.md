# SHINOBIWAN Studio v0.19.4 · Build 82

Codename: `studio-focus-slice4-phase9-destructive-write-ambiguity-guard`  
Date: 2026-08-15  
Status: **DEPLOYED CANDIDATE — REAL-USER SMOKE PENDING**

## Why Phase9 starts here

A fresh post-Build81 audit found no remaining Phase8 capability gap worth inventing a new dashboard/queue/write authority for.

The previously retained `Magnetic Midnight` palette-fetch issue is historical and already fixed since Build62 by URL-aware media credentials (`include` only for private Track Manager media, `omit` for public cover reads) with a permanent Build62 regression guard. Build82 therefore does not duplicate that fix.

The first real Phase9 reliability gap is lost-response ambiguity on destructive asset deletion.

Before Build82:

- Track asset upload already recovered a timeout/transport-loss response through private canonical reread and classified the outcome;
- Track asset delete did not: a lost response could leave the operator unsure whether the destructive write committed;
- Album asset delete had the same ambiguity and no finite delete-specific timeout;
- blind retry remained forbidden, but Studio could not tell when an explicit retry was actually safe.

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

- preserves the existing Phase4 two-transport topology;
- reuses the established simple JSON POST transport with delete-specific 30-second timeout/transport classification;
- captures the canonical Track revision and asset state before deletion;
- rejects stale or already-missing destructive requests before write;
- classifies transport-loss outcomes through `getAdminTrack()`;
- reports `ASSET_DELETE_NOT_COMMITTED`, `ASSET_DELETE_AMBIGUOUS`, or `ASSET_DELETE_UNVERIFIED` as typed outcomes;
- lost response may be recovered as verified success only when a new revision plus canonical asset absence are both proved;
- even a normal success response is no longer accepted unless the post-write canonical reread verifies exact revision plus absence;
- existing upload ambiguity recovery remains intact.

## Album asset delete

- adds a dedicated 30-second bounded delete request path within the existing Album service;
- canonical Album reads use a bounded 7-second timeout;
- captures exact Album revision + asset state before deletion;
- rejects stale/already-missing destructive requests before write;
- classifies lost delete responses through private `getAdminAlbum()` reread;
- exposes typed not-committed / ambiguous / unverified outcomes;
- normal success also requires exact post-write revision + absence verification;
- public service return type remains `AdminAlbumWriteResponse` so existing Album UI verification semantics remain available.

## CI history

No red head was merged.

```text
31853871778  FAILURE
  inherited private-read guard rejected an accidental third Phase4 POST transport
  corrective: reused the established simple JSON POST transport instead

31854043923  FAILURE
  inherited Build69 exact v0.19.3 pin blocked the bounded v0.19.4 phase successor

31854129202  FAILURE
  new Phase9 guard was too literal about Album retrySafe syntax
  corrective: guard now verifies the typed constructor branch semantically

31854193885  FAILURE
  inherited Build64 exact v0.19.3 pin blocked the v0.19.4 successor

31854313889  FAILURE
  all guards passed; TypeScript exposed an overly narrow inferred Album delete return union
  corrective: deleteAdminAlbumAsset explicitly returns Promise<AdminAlbumWriteResponse>

31854468795  SUCCESS
  private-read + Phase5/6/C3/UX/Phase7/Phase8/Phase9/Focus + typecheck + Vite all green
```

Historical Build64→67 version guards were changed only to accept the bounded `0.19.3 / 0.19.4` successor line; their product invariants remain intact. Build69 similarly accepts only the explicit Build82 successor and requires ancestry markers.

## Exact deployed-candidate receipts

```text
Accepted baseline        v0.19.3 · Build81 · REAL USER PASS
Safety pre               safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
Studio PR                #126
Exact tested head        07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Final validation         31854468795 · SUCCESS
Runtime merge            7a0d52fcc0bf862478c459f0648afc1c6690b34f
Pages                    31854528438 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build82-deployed-candidate-20260815-0248
Real-user smoke          PENDING
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration             NONE
```

## Deliberately out of Build82

The same audit identified non-destructive save paths — canonical Lyrics, SonicTrace analysis and broader Album writes — that can still report transport failure without classifying canonical commit state. They remain Phase9 follow-up candidates and must be re-audited after Build82 acceptance.

No destructive production asset is intentionally mutated by automated validation. Real-user smoke should prioritize normal UI regression checks; if an actual deletion test is desired, use an intentionally disposable Draft cover/thumbnail rather than important production media.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.
