# SHINOBIWAN Studio v0.18.0 · Build 57 — Studio Focus / Track Workshop

Date: 2026-08-13

Status: **CANDIDATE — CI + deployed real-user smoke required**

## Goal

Replace the implementation-oriented Track Workspace tab row with the artist mental model validated in Studio Focus:

```text
Track · Visuals · Lyrics · Release
```

The underlying routes, Track Manager ownership, R2 authority, LRC Maker receipt flow, SonicTrace persistence and native Release Campaign boundaries remain unchanged.

## Runtime changes

### Track

- default daily workspace remains the existing `overview` route but is presented as **Track**;
- show Album/project, release date, type and useful genres at a glance;
- keep canonical audio playback directly on Track;
- expose a compact five-state production summary: Audio / Visuals / Lyrics / Sound / Release;
- scope the protected AssetsManager to **Audio only** on this page;
- move full metadata editing behind `Edit track details` while retaining the existing protected validation/save route;
- move full SonicTrace behind `View full SonicTrace analysis` rather than a daily top-level tab;
- keep BPM/key/duration/language + source diagnostics under `More track details`.

### Visuals

- existing `assets` route is presented as **Visuals**;
- show Cover and Canvas previews together;
- scope canonical asset management to **Cover / Thumbnail / Video-Canvas**;
- Audio stays under Track; lyrics stay under Lyrics;
- link directly to Release for final 16:9 / 1:1 / 9:16 campaign packaging.

### Lyrics

- existing embedded LRC Maker workflow remains intact;
- `lyrics.txt` stays the only canonical lyrics source;
- timestamps inside `lyrics.txt` stay the synchronization authority;
- standalone LRC Maker remains fallback only;
- Phase 7-B save receipt/private canonical reread remains untouched.

### Release

- existing `market` route is presented as **Release**;
- add a compact final checklist for Audio / Cover / Lyrics / Canvas / Metadata;
- keep Canvas optional when absent because no accepted rule currently makes it universally release-blocking;
- render the existing native Release Campaign directly below the checklist;
- preserve MASTER 16:9 + independently anchored 1:1 and 9:16 derivatives;
- preserve browser-local draft state, provider handoff, ZIP export and `canonicalWrite: false`.

## Deep-link compatibility

No old Workspace route token is deleted. Existing links to:

- `overview`;
- `metadata`;
- `assets`;
- `lyrics`;
- `intelligence`;
- `market`;
- `versions`;
- `publishing`;

remain valid. Metadata, SonicTrace, versions and publishing become progressive-detail routes rather than permanent artist-facing tabs.

## AssetsManager refactor

`AssetsManager` now accepts an optional task scope (`kinds`) plus artist-facing heading copy. This changes **which controls are shown**, not where mutations go.

Unchanged authority:

- upload → existing Track Manager asset API;
- delete → existing Track Manager asset API;
- cover palette save → existing protected metadata API;
- stale revision / confirmation / rollback behavior unchanged.

## Safety boundaries

Build 57 does **not**:

- create a new write endpoint;
- change canonical `trackId`;
- change Track Manager/R2 ownership;
- weaken private rereads or continuation receipts;
- change SonicTrace FULL/PARTIAL semantics or sidecar persistence;
- write Release Campaign visuals to R2;
- make public fallback authoritative;
- change Album membership/order;
- start Phase 7-C.

## Checkpoints

Accepted Slice 2 checkpoint:

`safety/post-studio-focus-build56-real-user-pass-20260813-0143`

Pre-Build57 checkpoint:

`safety/pre-build57-track-workshop-20260813-0143`

## Acceptance target

Deployed browser smoke must confirm:

1. only **Track / Visuals / Lyrics / Release** appear as normal Track tabs;
2. Track shows useful identity + master audio without the old six-panel information wall;
3. metadata editing remains reachable and save semantics are unchanged;
4. Visuals shows Cover/Canvas and only visual asset controls;
5. Lyrics still synchronizes/saves/privately verifies correctly;
6. Release shows the compact checklist and the intact native Release Campaign;
7. full SonicTrace remains reachable from Track details;
8. legacy deep links do not break;
9. no canonical write/regression is introduced by the regrouping.

CI green alone does not grant REAL USER PASS.
