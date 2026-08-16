# SHINOBIWAN Studio — Build97

Date: 2026-08-16  
Version: `v0.19.19`  
Build: `97`  
Codename: `studio-focus-slice4-phase9-track-create-success-verification-truth`  
Status: **REAL USER PASS · ACCEPTED**

## Fresh-audit decision

The post-Build96 read-only audit compared remaining reliability seams after Build96 final acceptance closeout.

- Track asset upload normal success already verifies response revision + manifest asset pointer + canonical asset presence, plus returned duration when applicable.
- Album binary upload still lacks digest/operation identity for exact-byte or lost-response claims.
- Full Track/Album create lost-response causality still lacks a persisted operation identifier and remains unsafe for blind retry.
- Deep Audio automatic retry remains unsafe while duplicate expensive compute cannot be excluded.

The smallest proven gap is **normal successful Track create verification**. Track Manager already normalizes requested metadata, writes the draft, rebuilds catalog, rereads the manifest server-side and returns that normalized reread as `payload.track`. Studio then performs a second private canonical reread, but before Build97 it accepted success when only `slug` and `draft` matched.

## Build97 scope

```text
track-create-v1 HTTP success
→ require server response trackId + draft + canonical revision
→ private canonical Track reread
→ require exact response/canonical updatedAt
→ require deterministic whole normalized manifest equality
   ├─ exact → clientVerified=true
   └─ mismatch → clientVerified=false; intake stops before asset writes
```

The comparison deliberately anchors to Track Manager's **normalized response manifest**, not raw UI input. This preserves legitimate server normalization such as list deduplication, tag fallback, color normalization and canonical defaults.

## Explicit non-goals

Build97 does **not** add:

- Track create response-loss recovery;
- any automatic Track create retry;
- operation IDs;
- Track Manager / Worker changes;
- R2 schema/data changes;
- Track asset upload algorithm changes;
- Album create/upload changes;
- metadata/Lyrics/SonicTrace/Deep Audio behavior changes;
- LaunchPAD or LRC Maker changes.

Create lost-response policy remains explicit: `not-covered-no-operation-id-no-blind-retry`, with `maxAutomaticTrackCreateRetries: 0`.

## Runtime receipts

```text
Accepted base main      b4cc1cbc0ca73cfe8da9f839dd41447b9b9f28cb
Safety pre              safety/pre-phase9-track-create-success-verification-build97-20260816
Safety pre-PR           safety/post-build97-prepr-20260816
Safety green pre-merge  safety/post-build97-green-premerge-20260816
Runtime PR              #179
Exact tested head       31facc9eb124d3068f4f870dcfa78e38284e2f6a
Full CI                 31914980387 · SUCCESS · run #493
Runtime merge           0519d3ad1c364ee34188e17ecb9d10c3f0308c54
Runtime Pages           31915029686 · SUCCESS · build + deploy · run #186
Safety post-deploy      safety/post-build97-deployed-candidate-20260816
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
```

Historical tooling note: the first temporary Build97 one-shot definition was invalid YAML and failed before any job/product mutation. The corrected bounded one-shot later succeeded and self-removed. No temporary workflow is present in the runtime diff.

## Human acceptance — PASS

The genuine `Pixels & Promises` New Track create path succeeded and produced the canonical draft under Build97. The first asset continuation then exposed a separate pre-existing Track Manager v5.23 generated-bundle defect (`uploadEvidence` out of scope), which was corrected by TM v5.24 / Studio bridge v1.14 and Studio Build98 compatibility.

After both corrective sides were deployed, the same genuine Track successfully accepted MP3, cover JPEG, MP4 and TXT assets. The final explicit user verdict on 2026-08-16 was:

```text
MP3 + COVER + MP4 + TXT PASS MADAFAKA
```

Build97 create truth is therefore accepted; the downstream blocker/corrective chain remains preserved as part of the evidence rather than being hidden. Track-create lost-response recovery remains out of scope and automatic create retries remain zero.

```text
Build97 = REAL USER PASS · ACCEPTED
Build98 = REAL USER PASS · ACCEPTED corrective successor
```
```text
Build97 = DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Build98 = UNALLOCATED
```
