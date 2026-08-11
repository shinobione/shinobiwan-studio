# PHASE UX · C2.5-E2 — Migration review pack

Studio release: `0.12.1` / Build `36`  
Codename: `phase-ux-c2-5-e2-migration-review-pack`

## Goal
Make the live production dry-run easy to review and archive locally before the first C2.5-E Album write.

Build 36 does not change the migration transaction. It adds only read-only review/export affordances around the E1 cockpit.

## Review surface
After the existing `GET /api/studio/albums` dry-run succeeds, Studio shows:
- count of Albums ready to review;
- count of blocked Albums;
- count already canonical;
- current transitional Singles count;
- a shortened state fingerprint for each Album;
- the exact proposed artistic order;
- blocker and warning codes.

## Download dry-run JSON
`Download dry-run JSON` serializes the exact in-memory `AlbumMigrationDryRun` returned by Track Manager and downloads it locally in the browser.

It does not call Track Manager again and does not perform any network write.

The JSON contains private catalog metadata and the state tokens used by the stale guard. It must be treated as a private review artifact and should not be committed to the public repository.

## Copy review summary
`Copy review summary` creates a human-readable text summary containing:
- migration id / source ref / generated timestamp;
- zero-write proof;
- Album readiness state;
- candidate membership and proposed order;
- blocker codes;
- warning codes;
- Singles count.

The copied summary deliberately omits state tokens.

## Apply boundary unchanged
Build 36 does not alter the real write path. An apply still requires:
1. Track Manager capability `album-migration`;
2. exact Album id from the immutable plan;
3. exact current state token;
4. exact candidate set;
5. explicit artistic-order confirmation when required;
6. exact typed `MIGRATE <album-id>` phrase;
7. browser confirmation;
8. Track Manager v5.18 reread / transaction / rollback / quality verification.

There is still no batch migration operation.

## Wake-up procedure
1. open Studio Albums / Projects;
2. verify `v0.12.1 · Build 36`;
3. refresh the dry-run;
4. download the JSON;
5. review/export it before typing any `MIGRATE ...` phrase;
6. authorize one Album only after membership/order/blockers have been reviewed.

C2.5-F, C3 and Phase 7 remain locked.
