# Studio v0.13.3 · Build 41 — Track Create capability hotfix

Date: 2026-08-11
Codename: `phase-ux-c3-track-create-capability-hotfix`

## Real-user failure

During New Track creation for `Stick to You`, Studio reached Review correctly but failed before the create request with:

`Track Manager advertises unexpected manage capability: album-create, album-metadata, album-membership, album-move, album-assets, album-migration.`

The current Track Manager v5.19 / Studio bridge v1.11 legitimately advertises those Album capabilities after C2.5. The Phase 4 client still enforced an obsolete exact allowlist containing only `track-create`, `assets` and `catalog-rebuild`, so every additional capability was treated as an incompatibility.

## Fix

Build 41 changes only the Studio-side capability gate:

- a Track operation requires the capability that operation actually needs;
- `track-create` remains mandatory before canonical draft creation;
- `assets` remains mandatory before asset mutation;
- `catalog-rebuild` remains mandatory before catalog rebuild;
- additional Track Manager capabilities are accepted instead of rejected;
- current Album capabilities and a synthetic future additive capability are covered by a dedicated regression guard;
- a genuinely missing required capability still blocks the write.

## Preserved contracts

- no Track Manager source or deployment change;
- no public Worker change;
- no R2/schema/catalog mutation performed by this release itself;
- no Album authority change;
- no New Track transaction-order change;
- no asset upload transport change;
- no LaunchPAD, SonicTrace or LRC Maker runtime change;
- Phase 7 remains locked.

## Acceptance

**REAL USER PASS — 2026-08-11.**

After Studio `v0.13.3 · Build 41` was deployed, the intended `stick-to-you` state was rechecked before retry. The real New Track flow then completed successfully for **Stick to You**, confirming that the additive Track Manager capability set no longer blocks canonical draft creation while operation-specific required capability checks remain active.

Post-pass rollback anchor:

` safety/post-build41-real-user-pass-20260811-1833 `

C3-A Deep Audio real-user smoke remains the next active validation step.