# Studio v0.19.12 · Build90 — Phase9 Lyrics private-read transient retry truth

Status: **IMPLEMENTATION CANDIDATE · CI PENDING**.

## Fresh audit proof

Build90 was allocated only after Build89 received explicit `BUILD89 PASS MADAFAKA`, its acceptance closeout was merged/deployed, and a fresh read-only post-Build89 audit compared the remaining reliability families.

The audit confirmed:

- canonical Lyrics private read is one bounded Track Manager GET behind `getLyricsJson()`;
- the existing 7s timeout exists, but a non-timeout browser `fetch()` rejection is still mislabeled as a Cloudflare Access/authentication problem and receives no retry;
- Lyrics validation/save POSTs are already isolated behind `postLyrics()` and Build83 lost-response recovery is operation-specific and mature;
- `rereadLyricsTruth()` already uses canonical Lyrics GET + Build88-hardened Track GET, so hardening only the Lyrics GET also strengthens verification/recovery rereads without retrying a write;
- SonicTrace private reads remain a broader family because `adminJson()` serves state/latest/history plus the catalog while the module also owns external health, audio download and save/recovery;
- Album create still lacks a persisted operation identifier/pre-write revision sufficient for exact lost-response causality without backend contract work;
- Album binary upload still lacks a client-side exact digest/ETag contract sufficient to prove the selected bytes after response loss;
- degraded/offline/PWA resilience remains cross-cutting.

## Scope

Build90 changes only the canonical Lyrics private GET:

```text
GET /api/studio/tracks/:trackId/lyrics
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

A second transient failure surfaces immediately. There is no delay/backoff framework and no generic retry service.

## Build83 write boundary preserved

Build90 does **not** alter:

- `lyrics-validate-v1` POST semantics;
- `lyrics-save-v1` POST semantics;
- `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` classification;
- Build83 committed / not-committed / ambiguous / unverified recovery;
- the rule that a lost save response is never blindly retried.

`rereadLyricsTruth()` continues to verify canonical Lyrics plus canonical Track revision. The only difference is that the Lyrics GET may now survive one transient read failure before the existing recovery logic gives up.

## Explicit non-scope

Build90 does **not** change:

- SonicTrace private-read behavior;
- Album private-read behavior from Build89;
- Album create or upload response-loss semantics;
- Track Manager / Worker code;
- R2 schema/data;
- LaunchPAD, LRC Maker or SonicTrace Deep Audio;
- any user-facing layout or workflow.

## Validation target

Build90 adds `scripts/test-phase9-lyrics-private-read-transient-retry-build90.mjs` and converts Build89 to immutable accepted ancestry.

The guard requires:

- exact v0.19.12 / Build90 / codename identity;
- Build89 ancestry marker;
- explicit Lyrics transient HTTP allowlist;
- transport interruption distinct from Access/CORS;
- maximum two total Lyrics GET attempts;
- no retry for Access/CORS or invalid JSON;
- exactly the inherited Lyrics POST transport count;
- Build83 save transport/recovery markers remain intact;
- no automatic Lyrics save/validation retry helper;
- SonicTrace remains untouched as a separate future audit family;
- Build82→Build90 remain in the full Phase9 gate.

Known historical successor guards are widened only through bounded `v0.19.12 / Build90` compatibility while keeping all functional assertions intact.

## Safety

```text
Safety pre              safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
Feature branch          phase9/build90-lyrics-private-read-retry
Worker deploy           NONE planned
Track Manager change    NONE planned
R2 migration/write      NONE caused by deployment
Build91                 UNALLOCATED
```

## Real-user acceptance boundary

After deployment, use a normal browser regression only:

- hard refresh and verify `v0.19.12 · Build90`;
- open a Track that already has canonical `lyrics.txt`;
- open Lyrics and confirm canonical lyrics load normally;
- optionally make **no write at all** — Build90 is a read slice;
- quick Track / Albums / SonicTrace navigation sanity.

Do **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture the retry branch. Automated guards own failure-path classification proof.

## Stop line

- GET-only retry.
- Never turn Build90 into Lyrics save/validation retry.
- Do not broaden Build90 into SonicTrace retry.
- Do not modify Track Manager / Worker / R2 for this slice.
- Do not merge red CI.
- Merge only the exact tested head.
- Do not allocate Build91 before Build90 explicit acceptance plus a fresh audit.
