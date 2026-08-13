# Studio Focus Slice 4 — Build 61 polish

Release candidate: **Studio v0.19.1 · Build 61**  
Codename: `studio-focus-slice4-polish`  
Date: 2026-08-13  
Status: **IMPLEMENTED CANDIDATE — REAL USER PASS PENDING**

## Trigger

Build 60 deployed successfully and the real-user smoke confirmed that Home/Tracks terminology and the compact SonicTrace surface were present. Two presentation issues were reported before acceptance:

1. the `PHASE 7-B · FOCUS` release/status block was visually stranded high in the desktop sidebar instead of sitting at the bottom;
2. the compact SonicTrace artist summary was functionally correct but visually under-composed.

Build 60 is therefore **not** promoted to REAL USER PASS. Build 61 is a presentation corrective on top of the exact Build 60 merge.

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

Feature branch:

```text
studio-focus/build61-slice4-polish
```

## Acceptance boundary

Required sequence:

```text
exact-head CI GREEN
→ main collision recheck
→ merge exact tested head
→ exact merge-SHA Pages GREEN
→ real-user browser smoke
→ only then REAL USER PASS
```

The smoke should visually confirm only:

1. desktop release/status card is truly anchored at the bottom of the sidebar;
2. SonicTrace compact card is cleaner and easier to scan;
3. `Details / Advanced` still reaches full SonicTrace;
4. no truth/authority regression is visible.
