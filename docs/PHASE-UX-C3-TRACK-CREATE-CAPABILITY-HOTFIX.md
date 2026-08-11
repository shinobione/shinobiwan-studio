# PHASE UX / C3 — Track Create additive-capability hotfix

Studio release: `v0.13.3 · Build 41`
Date: 2026-08-11
Safety checkpoint: `safety/pre-build41-track-create-capability-20260811-1801`

## Context

The post-C2.5 Track Manager contract is intentionally additive. Track Manager v5.19 / Studio bridge v1.11 still exposes the Phase 4 capabilities used by New Track (`track-create`, `assets`, `catalog-rebuild`) and now also exposes canonical Album management and migration capabilities introduced later in C2.5.

The Phase 4 Studio client had kept an exact-capability allowlist from an earlier bridge generation. That meant a healthy newer backend was rejected merely because it advertised more features than the original Phase 4 client knew about.

## Observed real-user case

`Stick to You` reached the New Track Review step with three classified media files and resolved Singles metadata. Pressing `Create canonical draft` failed at the pre-write capability gate with the Album capability list reported as "unexpected".

This failure occurs before `POST /api/studio/tracks/create` because `createAdminTrack()` calls the capability guard first.

## Correct compatibility model

Capability advertisement is additive:

- the requested operation must see its own required capability;
- unrelated additional capabilities do not invalidate compatibility;
- missing required capability still blocks the operation;
- security boundaries remain enforced by Track Manager itself and by the operation-specific Studio clients.

Build 41 therefore removes only the obsolete rejection of extra `manage` entries. It does not relax the requirement for `track-create`, `assets` or `catalog-rebuild` when those operations are requested.

## Regression coverage

`scripts/test-phase-ux-c3-track-create-capabilities.mjs` protects the exact current manage set:

- `track-create`
- `assets`
- `catalog-rebuild`
- `album-create`
- `album-metadata`
- `album-membership`
- `album-move`
- `album-assets`
- `album-migration`

It also checks a synthetic future additive capability and confirms that removing `track-create` still blocks Track Create semantics.

## Frozen boundaries

No Track Manager/Worker/R2/schema/Album membership/player/Lyrics/SonicTrace behavior changes are part of Build 41. New Track still uses the established recoverable Singles-first transaction and canonical reread rules.

## Real-user retry rule

After Build 41 is deployed, do not blind-retry an ambiguous `trackId`. First reload canonical Studio state and confirm whether the intended track already exists. Only if it is absent should the New Track creation be repeated.

C3-A Deep Audio smoke remains pending after this corrective. C3-B and C3-C remain later PHASE UX work. Phase 7 stays locked.
