# Studio v0.19.11 · Build89 — Phase9 Album private-read transient retry truth

Status: **IMPLEMENTATION CANDIDATE · CI PENDING**.

## Fresh audit proof

Build89 was allocated only after Build88 received explicit `BUILD88 PASS MADAFAKA`, its acceptance docs closeout was merged/deployed, and a fresh read-only post-Build88 audit compared the remaining reliability families.

The audit confirmed:

- Album create still lacks a persisted operation identifier / pre-write revision able to prove exact causality after a lost create response without a backend contract change;
- Album binary upload still lacks a client-side exact digest/ETag contract able to prove the selected bytes after a lost response without backend/API work;
- degraded/offline/PWA resilience remains cross-cutting rather than a bounded Phase9 fix;
- Lyrics and SonicTrace private reads still have separate historical transports and remain separate future audit families;
- the **Album collection/detail private GET helper** remains a bounded Studio-only gap: non-timeout browser fetch rejection is currently mislabeled `access-or-cors` and receives no retry.

Album reads are a coherent family because the same helper owns:

- canonical Album collection reads;
- canonical Album detail reads;
- private Album visual discovery;
- canonical Album rereads used by existing guarded Album verification/recovery.

## Scope

Build89 changes only `src/services/album-admin-api.ts` private GET behavior used by:

```text
GET /api/studio/albums
GET /api/studio/albums/:albumId
```

Retry classification:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Maximum attempts: **2 total**.

The second failure surfaces immediately. There is no backoff framework or generic retry service.

## Explicit non-scope

Build89 does **not** change:

- any Album POST/write transport;
- Album create response-loss semantics;
- Album binary upload response-loss semantics;
- Album metadata/membership/move/delete write contracts;
- core Track GET retry from Build88;
- Lyrics private-read behavior;
- SonicTrace private-read behavior;
- Track Manager / Worker code;
- R2 schema/data;
- LaunchPAD, LRC Maker or SonicTrace Deep Audio.

## Validation target

Build89 adds `scripts/test-phase9-album-private-read-transient-retry-build89.mjs` and keeps Build88 as immutable accepted ancestry.

The guard requires:

- exact v0.19.11 / Build89 / codename identity;
- exact Build88 ancestry marker;
- explicit transient HTTP allowlist;
- transport ≠ Access/CORS;
- maximum two total Album GET attempts;
- no retry for Access/CORS or invalid JSON;
- exactly the inherited Album POST count;
- no retry helper for Album writes;
- Lyrics and SonicTrace remain untouched separate audit families;
- Build82→Build89 remain in the full Phase9 gate.

## Safety

```text
Safety pre              safety/pre-phase9-album-private-read-retry-build89-20260815-1307
Feature branch          phase9/build89-album-private-read-retry
Worker deploy           NONE planned
Track Manager change    NONE planned
R2 migration/write      NONE caused by deployment
Build90                 UNALLOCATED
```

## Real-user acceptance boundary

After deployment, use a normal browser regression only:

- hard refresh and verify `v0.19.11 · Build89`;
- open Albums and verify the normal private Album inventory;
- open at least one canonical Album detail;
- verify private artwork/metadata load normally;
- quick Track / Lyrics / SonicTrace navigation sanity.

Do **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture the retry branch. Automated guards own the failure-path classification proof.

## Stop line

- GET-only retry.
- Never turn Build89 into Album write retry.
- Do not broaden Build89 into Lyrics/SonicTrace retry.
- Do not modify Track Manager / Worker / R2 for this slice.
- Do not merge red CI.
- Merge only the exact tested head.
- Do not allocate Build90 before Build89 explicit acceptance plus a fresh audit.
