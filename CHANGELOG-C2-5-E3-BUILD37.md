# PHASE UX · C2.5-E3 — Studio v0.12.2 / Build 37

Status: **diagnostic hotfix after first real-user migration attempt did not create a canonical Album.**

## Observed real-user behavior
- Neon Heartbreaks dry-run was reviewed with the approved order:
  1. Before the Noise
  2. Low Bitrate Love
  3. Real Love Doesn’t Rush
- the user typed the exact migration phrase and confirmed the browser dialog;
- the cockpit refreshed, but Neon Heartbreaks remained `DRY-RUN READY`;
- `ALREADY CANONICAL` remained `0`;
- therefore the migration did not complete.

## Diagnostic bug fixed
Build 36 could hide the actual failure because the apply catch stored an error and immediately called `load()`, whose first action cleared that error. The migration client also discarded the Worker response `details` field.

Build 37:
- preserves a migration error across the automatic dry-run refresh;
- surfaces Worker `details` when present;
- includes HTTP status, error code and rollback state in the visible diagnostic;
- keeps the dry-run reread after a failed attempt;
- explicitly tells the operator not to retry before the diagnostic is reviewed.

## Safety
This build does **not**:
- change `album-migration-apply-v1`;
- change the request payload or state-token guard;
- change Track Manager v5.18 / bridge v1.10;
- deploy a Worker;
- perform an Album migration by itself;
- add batch migration;
- touch Singles;
- start C2.5-F, C3 or Phase 7.
