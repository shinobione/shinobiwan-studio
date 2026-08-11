# PHASE UX / C3-UX — Focused Album workspace

Status: implementation candidate
Release: Studio v0.13.1 · Build 39
Date: 2026-08-11

## Problem observed in real-user review

The normal Albums route still reflected the temporary C2.5 migration architecture after C2.5 had already been completed:

1. the Album library showed initials instead of the existing canonical covers;
2. opening one Album did not create a truly focused Album view;
3. `AlbumMigrationPanel` was always mounted below `AlbumManager` on the same route;
4. the migration panel mapped every migration candidate, so opening Coal to Diamond was followed by Neon Heartbreaks, Coal to Diamond, Love Letters from Saigon and Singles migration diagnostics;
5. stale C2.5 boundary copy remained visible after migration completion.

This was technically explainable but no longer coherent product UX.

## Corrective design

### Albums / Projects

The daily route is now a real canonical release library:

- canonical cover/thumbnail preview;
- title / immutable id;
- status;
- track count;
- release date/year;
- clear `+ New Album / EP` action.

Private Album manifests still come from Track Manager. Artwork previews are read-only and come from the already validated public Worker v2.7 canonical `/albums` projection. Failure to load public artwork never blocks private Album management.

### Focused Album view

Selecting one Album renders only that Album and exposes three sections:

- `Overview` — canonical metadata;
- `Tracklist` — canonical membership/order, reorder/remove/move;
- `Assets` — current canonical artwork plus guarded replacement/deletion.

The current cover stays visible in the identity header so the release remains visually recognizable while editing.

### Migration tooling

The completed C2.5-E migration cockpit is preserved for audit/diagnostics but removed from the daily Albums route. It now lives under `System` inside a collapsed `Album migration archive · C2.5 complete` maintenance disclosure.

No migration behavior is deleted in this corrective.

## Authority boundaries

Unchanged:

- `albums/<album-id>/manifest.json` is Album authority;
- ordered `album.trackIds` is membership/artistic-order authority;
- Track Manager remains the only protected R2 write authority;
- Studio performs no direct R2 mutation;
- public Worker v2.7 `/albums` is used only for canonical visual previews;
- Singles remains virtual;
- LaunchPAD remains untouched.

## Safety

Checkpoint before this corrective:

` safety/pre-c3-ux-albums-20260811-1530 `

C3-A Deep Audio behavior is not modified by this UX corrective. The C3-A real-user scan is intentionally deferred until this page is validated, then resumes from the existing smoke protocol.

Phase 7 remains locked.
