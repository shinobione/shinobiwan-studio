# PHASE UX · C2.5-E — Studio Album migration cockpit

Studio release: `0.12.0` / Build `35`  
Codename: `phase-ux-c2-5-e-album-migration-cockpit`

## Purpose
Expose the controlled historical Album migration in Studio without weakening the C2.5-C write boundary or turning page load into a migration event.

The existing Album Manager remains the normal editor. The C2.5-E cockpit is a separate component mounted beside it so D1/D2 behavior stays isolated.

## Read-only first
The cockpit begins with `GET /api/studio/albums` and renders Track Manager's live `migration` dry-run:
- migration id and pinned source ref;
- generated timestamp;
- explicit `writesPerformed = false` proof;
- candidate track count and current track state;
- proposed order;
- blockers and warnings;
- whether order confirmation is required;
- canonical/done status.

Refreshing the dry-run is safe and performs no R2 write.

## Real apply gate
A real apply is impossible unless all UI/backend gates agree:
1. candidate has no blockers;
2. the user reviews/reorders the proposed tracklist;
3. ambiguous order is explicitly confirmed;
4. the user types exactly `MIGRATE <album-id>`;
5. a browser confirmation is accepted;
6. Track Manager health advertises `album-migration`;
7. Studio posts the exact dry-run state token and ordered track list;
8. Track Manager independently rereads and validates the current canonical state.

There is intentionally no batch migration action.

## Failure behavior
A transport or server failure does not trigger an automatic retry. Studio reloads the dry-run before any manual retry so ambiguous success cannot become a duplicated mutation.

## Singles
Singles remains locked in this cockpit. It is shown only as an informational transitional collection and is not a selectable migration target.

## Deployment order
1. merge the Track Manager E1 tooling;
2. deploy Track Manager v5.18 / bridge v1.10 admin-only;
3. merge/publish Studio Build 35;
4. perform a real production dry-run only;
5. review its exact membership/order/blockers;
6. separately authorize the first Album apply.

Merging or deploying Build 35 does not itself migrate an Album.

C2.5-F, SonicTrace C3 and Phase 7 remain NOT STARTED.
