# Studio v0.13.1 · Build 39 — C3 UX Albums corrective

Date: 2026-08-11
Codename: `phase-ux-c3-albums-focused-workspace`

## Why

After C2.5 completion, the daily Albums route still stacked the historical C2.5-E migration cockpit below Album Management. Opening one Album therefore produced an excessively long page containing migration cards for every canonical Album plus Singles. Canonical covers also existed in R2 but were not shown on the normal Album library cards.

## Changes

- replace the daily `#albums` surface with a focused `AlbumsWorkspace`;
- render canonical Album cover/thumbnail previews from public Worker v2.7 `/albums` read authority;
- opening an Album now shows only that Album;
- focused editor is split into `Overview`, `Tracklist`, and `Assets` tabs;
- current canonical cover is visible in the Album identity header and Assets tab;
- ordered `album.trackIds` remains the only membership/order authority;
- metadata, membership, move and asset writes continue through existing Track Manager guarded APIs;
- completed C2.5-E migration tooling is moved to `System` as a collapsed maintenance/archive disclosure;
- stale C2.5-D/C2.5-E boundary copy is removed from daily Album UX;
- Track Manager shell label updated to validated v5.19 / bridge v1.11;
- mobile layout receives a dedicated focused-workspace guard without changing LaunchPAD/mobile runtime.

## Frozen contracts

- no R2 object mutation from this release itself;
- no Track Manager / Worker change;
- no LaunchPAD change;
- no SonicTrace backend change;
- no Album schema change;
- no whole-Album deletion;
- no direct Studio R2 write path;
- Phase 7 remains locked.

## C3-A status

C3-A Deep Audio Build 38 code remains included and unchanged functionally. Its real-user local-GPU smoke is still pending and resumes immediately after Build 39 Album UX validation.
