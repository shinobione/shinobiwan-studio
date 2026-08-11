# PHASE UX / C3 — Track Create additive-capability hotfix

Studio release: `v0.13.3 · Build 41`
Date: 2026-08-11
Safety checkpoint: `safety/pre-build41-track-create-capability-20260811-1801`
Post-pass checkpoint: `safety/post-build41-real-user-pass-20260811-1833`

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

## Real-user acceptance

**PASSED — 2026-08-11.**

After deployment, canonical state was checked before the retry. The real New Track flow for **Stick to You** then completed successfully under Studio `v0.13.3 · Build 41` with Track Manager v5.19 / bridge v1.11 advertising the full additive Album capability set.

This closes the Build 41 operational hotfix. The successful retry validates the compatibility correction only; it does not by itself accept C3-A Deep Audio semantics.

C3-A Deep Audio smoke is now the next active validation step. C3-B and C3-C remain later PHASE UX work. Phase 7 stays locked.
