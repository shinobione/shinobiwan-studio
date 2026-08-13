# Studio Focus Slice 4 — Build 61 polish

Release: **Studio v0.19.1 · Build 61**  
Codename: `studio-focus-slice4-polish`  
Date: 2026-08-13  
Status: **COMPLETE — REAL USER PASS**

## Trigger

Build 60 deployed successfully and the real-user smoke confirmed that Home/Tracks terminology and the compact SonicTrace surface were present. Two presentation issues were reported before acceptance:

1. the `PHASE 7-B · FOCUS` release/status block was visually stranded high in the desktop sidebar instead of sitting at the bottom;
2. the compact SonicTrace artist summary was functionally correct but visually under-composed.

Build 60 was therefore not promoted to REAL USER PASS. Build 61 is the accepted presentation corrective on top of the exact Build 60 merge.

## Sidebar corrective

Root cause: the original shell defined `.sidebar-foot { margin-top: auto; }`, but the later UX foundation layer overrode it with `.sidebar-foot { margin-top: 14px; }`.

Build 61 restores the intended desktop behavior with a final-layer corrective:

- `margin-top: auto` anchors the release/status card at the bottom of the full-height sidebar;
- compact padding / line-height;
- restrained cyan/violet release-card treatment;
- no relocation under Advanced;
- accepted compact/mobile behavior remains unchanged: the desktop footer stays hidden below 1080px.

## SonicTrace artist-card polish

No data contract, routing or authority changes.

The existing compact SonicTrace card keeps the exact Build 60 read-only logic and truthful profile states, but receives a stronger visual hierarchy:

- deliberate card padding and premium background treatment;
- title/profile/CTA hierarchy tightened;
- desktop insight layout becomes a balanced composition instead of five equal admin-like boxes;
- Style / Mood / Character occupy the first row;
- Arrangement / Master occupy the second row when present;
- instrument Palette becomes a coherent footer strip;
- freshness remains secondary;
- responsive two-column / single-column fallbacks remain available;
- OUTDATED / UNAVAILABLE truth states remain explicit.

## Safety

Presentation only. Build 61 does not add or alter:

- R2 writes;
- Track Manager authority;
- SonicTrace analysis/persistence;
- Worker deployment;
- Lyrics authority;
- Album authority;
- Release Campaign persistence (`canonicalWrite: false` remains unchanged);
- Phase 7-C.

Pre-corrective safety anchor:

```text
safety/pre-build61-slice4-polish-20260813-1317
```

Accepted runtime checkpoint:

```text
safety/post-studio-focus-build61-real-user-pass-20260813-1347
```

Feature branch:

```text
studio-focus/build61-slice4-polish
```

## Validation evidence

Exact candidate head:

```text
bf00ca0aa1a0a070199f3cf94fd920f342d644a9
```

Validation CI:

```text
Validate SHINOBIWAN Studio · run 31695460411 · SUCCESS
```

Exact merge SHA:

```text
9e362cce54522f5cd703363db4b92066c8909565
```

Pages deployment:

```text
Deploy SHINOBIWAN Studio · run 31695599704 · SUCCESS
```

## Real-user acceptance — 2026-08-13

Deployed browser smoke at approximately 13:46–13:47 Europe/Paris confirmed:

1. the `PHASE 7-B · FOCUS` release/status card is visibly anchored at the bottom of the desktop sidebar;
2. the release card is compact and visually integrated with the sidebar rather than stranded beneath Advanced;
3. the compact SonicTrace card is clearly readable with Style / Mood / Character on the primary row;
4. Arrangement / Master are grouped beneath as secondary production facts;
5. Palette is visually separated as a coherent footer strip;
6. FULL profile state remains visible and truthful;
7. `Details / Advanced →` remains available for deeper SonicTrace diagnostics;
8. no visible authority, Lyrics, Album, Track Manager, Release Campaign or canonical-data regression was observed in this smoke.

This evidence closes **Studio Focus Slice 4 as REAL USER PASS on Build 61**.

## Roadmap consequence

- Studio Focus Slice 4: **COMPLETE — REAL USER PASS**.
- Build 60 remains historical deployed candidate evidence, superseded by Build 61 for acceptance.
- Build 61 becomes the accepted Studio Focus baseline.
- Phase 7-C remains **CLOSED / NOT STARTED** until fresh explicit authorization.
