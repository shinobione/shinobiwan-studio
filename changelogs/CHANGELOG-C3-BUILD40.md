# Studio v0.13.2 · Build 40 — Album palette controls

Date: 2026-08-11
Codename: `phase-ux-c3-album-palette-controls`

## Scope

Focused pre-smoke UX polish before resuming the C3-A Deep Audio real-user smoke.

- replaces the raw `Accent` / `Accent 2` text inputs in Album Overview with a first-class **Album palette** block;
- exposes **Primary color** and **Secondary color** through native color pickers + validated six-digit HEX editing;
- keeps the existing optional native eyedropper support;
- keeps cover-derived palette extraction in Assets and labels it with the same user-facing terminology;
- validates canonical metadata writes so malformed palette values are rejected instead of silently persisted;
- does not alter Album membership, ordering, assets, migration semantics, Track Manager routes, Worker code or R2 authority.

The canonical fields remain `accent` and `accent2`; only their Studio presentation changes.

## LaunchPAD contract

This Studio candidate is paired with LaunchPAD Build 90, which consumes the same canonical `album.accent` / `album.accent2` values as scoped theme variables on the public Album detail page. Missing/invalid colors fall back safely to the existing LaunchPAD visual identity.

## Roadmap status

- C2.5-A → C2.5-F: COMPLETE / real-user validated.
- C3 Album focused workspace: corrective accepted pending this palette polish smoke.
- C3-A Deep Audio: implementation candidate already present; real-user local-GPU smoke still pending.
- Phase 7: LOCKED / NOT AUTHORIZED.
