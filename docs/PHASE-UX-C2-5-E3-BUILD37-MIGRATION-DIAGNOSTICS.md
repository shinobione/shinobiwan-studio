# PHASE UX · C2.5-E3 — Migration failure diagnostics

## Why this patch exists
The first authorized real-user Neon Heartbreaks migration attempt did not produce a canonical Album. The subsequent dry-run remained ready and reported zero canonical Albums.

The previous Studio UI made that failure opaque: the apply catch set an error and then refreshed the dry-run through `load()`, which cleared the same error before the user could read it. In addition, the migration client ignored the Worker response `details` field used by rollback failures.

## Build 37 behavior
Studio v0.12.2 / Build 37 keeps the same guarded migration transport but makes failures durable and actionable.

After a failed migration attempt Studio now:
1. renders the Worker failure message;
2. keeps the server error code;
3. shows the HTTP status when available;
4. includes Worker `details` when available;
5. prints the rollback object when supplied;
6. refreshes the dry-run without clearing that diagnostic;
7. warns not to retry until the diagnostic has been reviewed.

## Unchanged write contract
Build 37 deliberately does not alter:
- `album-migration-apply-v1`;
- the exact state-token stale guard;
- the user-confirmed track order;
- the typed `MIGRATE <album-id>` phrase;
- the one-Album-at-a-time boundary;
- Track Manager v5.18 / bridge v1.10;
- the Worker migration implementation.

No Worker deployment is required for this Studio-only diagnostic patch.

## Current production decision
Do not migrate Coal to Diamond or Love Letters from Saigon. Do not retry Neon Heartbreaks until Build 37 is live and the next attempt either succeeds or leaves a persistent diagnostic that can be reviewed before any further write.

Singles remains excluded from C2.5-E canonical migration.
