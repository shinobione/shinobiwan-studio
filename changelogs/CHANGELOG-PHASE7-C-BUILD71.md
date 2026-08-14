# SHINOBIWAN Studio v0.19.3 · Build 71

Codename: `studio-focus-slice4-phase7c-duration-evidence-corrective`
Date: 2026-08-14
Status: **CANDIDATE — CI GREEN / NOT MERGED / NOT DEPLOYED / REAL USER PASS PENDING**

## Trigger

Build70 real-user smoke on `uNTouCHaBLe` proved a canonical contradiction:

- canonical master audio is readable in-browser at about 3:55;
- final canonical lyrics timestamp is 03:48.593;
- Track Manager quality still reports duration <= 0 and final timestamp beyond audio end.

The root cause is Track Manager v5.21 persisting the audio asset/revision without deriving `manifest.duration`, while metadata quality validation receives no browser duration evidence.

## Dependency

Track Manager v5.22 / Studio bridge v1.12 is the backend corrective.

LaunchPAD / TM PR: `#232`
Exact backend candidate head: `888d29e9b7064346311ed3c959669a327505204d`
Backend merge: `be7d970f6577e0e54eade04a5ef764a733baed42`

Successful backend CI before merge:

- `31757006174` — Validate Cloudflare Workers — SUCCESS
- `31757006198` — Validate Launchpad — SUCCESS
- `31757006309` — Validate Horizontal Overflow — SUCCESS

Admin Worker deployment remains a hard gate before Build71 can be merged/deployed. Public Worker v2.7 must remain untouched.

## Build71 behavior

### Existing tracks with broken duration

`Validate metadata` now measures the currently protected canonical master in-browser using credentialed metadata loading.

The measured duration is sent separately as evidence to TM v5.22; it is **not** added to the generic editable metadata allowlist.

When the manifest duration differs, the normalized proposal reports `duration` as a derived repair. The exact reviewed evidence is retained for the subsequent explicit Save/Publish against the same `expectedUpdatedAt` revision.

After save, Studio privately rereads the exact current track and verifies both the expected revision and persisted duration before reporting `CANONICAL REREAD · VERIFIED`.

### Future audio uploads / New Track

The existing `asset-upload-v1` multipart path measures a selected audio File before upload and adds:

- `audioDuration`
- `audioReadable=true`

No custom request header is added, so the existing CORS-simple multipart transport remains intact.

TM v5.22 derives `manifest.duration` at the same guarded audio-upload revision. This makes Build70 `Create & Publish` capable of passing duration quality without an extra manual metadata repair step.

If browser metadata cannot be measured, Studio does not invent a duration; quality remains truthful and the user sees the blocker.

## Preserved contracts

- no generic Studio/R2 writer;
- no manual editable duration field;
- exact current trackId;
- private canonical read required for write verification;
- expectedUpdatedAt stale guard;
- explicit human confirmation before save/publish;
- Build69 Phase7-C guided metadata retained;
- Build70 production-readiness/publication separation retained;
- Album membership/order remains owned by `album.trackIds`;
- Lyrics authority remains canonical `lyrics.txt`;
- SonicTrace, Release Campaign and Phase7-B receipt authorities unchanged;
- public fallback remains read-only.

## Safety

Pre-Build71 checkpoint:

`safety/pre-build71-duration-evidence-fix-20260814-0216`

Feature branch:

`agent/build71-duration-evidence-fix`

PR:

`#101 — Build 71 — canonical audio duration evidence corrective`

## Candidate evidence

Exact tested head before this documentation commit:

`0f527db550a9095acaa6b96c26ee549d64e74007`

Validation:

`31757608331 — Validate SHINOBIWAN Studio — SUCCESS`

This documentation commit requires a fresh exact-head CI before any merge.

## Deployment / acceptance gate

1. deploy TM v5.22 / bridge v1.12 through the **admin-only** Cloudflare workflow;
2. verify deployed admin Worker/version; public Worker unchanged;
3. rerun exact-head Studio CI after documentation;
4. anti-drift check Studio `main`;
5. merge exact tested Build71 head;
6. verify Pages deploys the exact merge SHA;
7. real-user smoke `uNTouCHaBLe`:
   - canonical master measurement appears around 3:55;
   - derived duration repair appears in proposal;
   - false duration and lyrics-end errors disappear;
   - only genuine warnings remain;
   - explicit Publish succeeds;
   - private reread reports VERIFIED;
   - hard refresh preserves published status and repaired duration;
8. smoke New Track `Create & Publish` once.

`CI GREEN != DEPLOYED != REAL USER PASS`.
