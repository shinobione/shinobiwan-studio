# SHINOBIWAN Studio — Build92

Date: 2026-08-15  
Version: `v0.19.14`  
Build: `92`  
Codename: `studio-focus-slice4-phase9-track-metadata-response-loss-truth`  
Status: **REAL USER PASS · ACCEPTED**

## Fresh-audit decision

The fresh post-Build91 read-only audit compared:

1. Album asset upload response-loss truth;
2. Album create response-loss truth;
3. degraded/offline/PWA resilience;
4. smaller still-unprotected Studio reliability gaps.

Album binary upload remains causality-heavy because the browser does not provide a persisted request digest/operation identifier that can prove the exact selected bytes after a lost response. Album create remains causality-weak because absent→present does not uniquely attribute a created Album to the lost POST without a persisted operation identifier. PWA/offline remains cross-cutting.

The smaller proven gap was canonical **Track metadata save**: Track Manager already stale-guards, builds a deterministic proposal, writes the manifest, rebuilds the catalog, rereads the exact revision and attempts rollback on transaction failure, but Studio did not classify a lost metadata-save response as committed / not committed / ambiguous / unverified.

## Build92 scope

Build92 is Studio-only and operation-specific.

It covers the existing `metadata-save-v1` Track metadata save used by the guided Metadata panel, including the already-established optional canonical audio-duration evidence repair.

It does **not** change:

- metadata validation semantics;
- Track create;
- Track asset upload/delete;
- Album create/upload or any Album write contract;
- Lyrics or SonicTrace writes;
- Track Manager / Worker code;
- R2 schema/data;
- PWA/offline behavior.

## Pre-write truth

Immediately before the write, the callable save path repeats the same non-mutating metadata validation against the exact expected Track revision. The resulting normalized `proposed` manifest becomes the operation-specific postcondition.

That reviewed proposal includes the already-supported derived `duration` repair when canonical audio evidence exists. `duration` remains derived evidence and is not added to the generic editable metadata patch.

Studio then privately rereads the Track and refuses the POST if the canonical revision no longer equals `expectedUpdatedAt`.

## Lost-response classification

Only typed timeout/transport loss enters response-loss recovery. Studio never automatically retries the write.

```text
metadata save response unavailable
→ NEVER blind automatic retry
→ private canonical Track reread
   ├─ new Track revision
   │  + exact reviewed normalized proposal
   │    → COMMITTED / VERIFIED
   ├─ original Track revision unchanged
   │    → NOT COMMITTED / explicit retry safe after reconnect
   ├─ changed revision but exact reviewed postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

The exact proposal comparison ignores only top-level `updatedAt` and `updatedBy`, which are expected runtime write fields. All other manifest content represented by the validated proposal — metadata, derived duration, assets, identity and other stable manifest state — must match.

## Normal-success verification

Normal HTTP success is not trusted blindly either:

- `saved:true` requires canonical reread revision === server `updatedAt` **and** exact reviewed proposal;
- `noChange:true` requires the original revision to remain canonical **and** exact reviewed proposal;
- mismatch → `TRACK_METADATA_SAVE_AMBIGUOUS / DO NOT RETRY`;
- unreadable reread → `TRACK_METADATA_SAVE_UNVERIFIED / DO NOT RETRY`.

## Derived catalog receipt boundary

Track Manager metadata save rebuilds `catalog/index.json` as part of its transaction. However the private Track reread endpoint reconstructs Track state from canonical manifests rather than reading the catalog index.

Therefore a **recovered-after-lost-response** result does not fabricate an independent `catalogRebuilt:true` receipt. It reports canonical Track metadata/duration as verified while explicitly stating that the derived catalog rebuild receipt is not independently observable after response loss.

Normal HTTP responses retain the server's real `catalogRebuilt` receipt.

## Typed client codes

```text
TRACK_METADATA_SAVE_TIMEOUT
TRACK_METADATA_SAVE_TRANSPORT
TRACK_METADATA_ACCESS_SESSION_REQUIRED
TRACK_METADATA_SAVE_INVALID_RESPONSE
TRACK_METADATA_SAVE_NOT_COMMITTED
TRACK_METADATA_SAVE_AMBIGUOUS
TRACK_METADATA_SAVE_UNVERIFIED
TRACK_METADATA_SAVE_REJECTED
TRACK_METADATA_PROPOSAL_STALE
```

## Guard

`scripts/test-phase9-track-metadata-response-loss-build92.mjs` protects:

- release identity + Build91 ancestry;
- exact `metadata-save-v1` intent;
- one 12-second POST transport in the resilient service;
- timeout/transport-only response-loss recovery;
- fresh non-mutating validation immediately before save;
- exact Track + revision anchoring of the reviewed proposal;
- canonical pre-write reread/stale guard;
- committed / not-committed / ambiguous / unverified classification;
- no automatic write retry loop/helper;
- derived duration remaining part of the validated proposal rather than editable metadata;
- normal success canonical revision + exact proposal verification;
- no fabricated derived catalog receipt after response loss;
- inherited Phase9 Build82→Build91 gate.

## Validation / deployment receipts

Runtime PR #158 was tested on exact head `2b859d831f5fc46eea9853f31c4b86057041128b`.

Historical CI `31893447100` was red only because the inherited Build80 duration-evidence successor guard still expected validation and save bridge-compatibility checks in the same source file. Build92 intentionally moved the save seam into the resilient service. The guard was updated to follow the same bounded bridge contract across both seams. **No runtime product change was made to repair that red run, and the red head was never merged.**

Final full validation `31893496536` passed the complete repository-native chain on the exact merged runtime head.

Runtime merge `d0ca8b3aa4481c3217f79790e347000bfd22823a` deployed successfully through Pages run `31893652679`.

Candidate docs PR #159 passed full validation `31894353160`, merged at `f46b846841e6ef9ce705b2fa3817baecd0aecefa`, and deployed successfully through Pages run `31894411652`.

Acceptance docs PR #160 passed full validation `31896013803`, merged at `a26c8c0540607c99147c0b6d30b5d3c7ccf6efc9`, and deployed successfully through Pages run `31896073093`.

## Real-user acceptance — PASS

The bounded acceptance was intentionally a **normal-browser metadata regression**, not a manufactured response-loss test.

The user returned the explicit verdict on 2026-08-15:

```text
BUILD92 PASS MADAFAKA
```

Accepted smoke boundary:

- deployed `v0.19.14 · Build92` verified in the browser;
- one safe existing private canonical Track opened;
- one harmless reversible metadata change reviewed through the normal **Validate** flow;
- one normal explicit **Save** performed;
- canonical reread verification succeeded (`CANONICAL REREAD · VERIFIED`);
- the metadata change persisted after canonical reload;
- surrounding Track / Albums / Lyrics / SonicTrace navigation remained sane.

Acceptance intentionally did **not** cut network, invalidate Cloudflare Access, or manufacture timeout/transport/ambiguous-write branches. Those failure paths remain protected by automated Build92 classification guards.

## Safety

```text
Safety pre              safety/pre-phase9-track-metadata-response-loss-build92-20260815-1722
Safety pre-PR           safety/post-build92-prepr-20260815-1740
Runtime PR              #158
Exact tested head       2b859d831f5fc46eea9853f31c4b86057041128b
Validation              31893496536 · SUCCESS
Historical guard CI     31893447100 · FAILURE · Build80 seam assertion only · never merged
Runtime merge           d0ca8b3aa4481c3217f79790e347000bfd22823a
Runtime Pages           31893652679 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build92-deployed-candidate-20260815-1748
Candidate docs PR       #159
Candidate docs CI       31894353160 · SUCCESS
Candidate docs merge    f46b846841e6ef9ce705b2fa3817baecd0aecefa
Candidate docs Pages    31894411652 · SUCCESS · exact candidate-docs merge SHA
Safety post-acceptance  safety/post-build92-real-user-pass-20260815-1819
Acceptance docs PR      #160
Acceptance docs CI      31896013803 · SUCCESS
Acceptance docs merge   a26c8c0540607c99147c0b6d30b5d3c7ccf6efc9
Acceptance docs Pages   31896073093 · SUCCESS · exact acceptance-docs merge SHA
Safety RUP docs         safety/post-build92-rup-docs-closeout-20260815-1841
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
Real-user smoke         BUILD92 PASS MADAFAKA · 2026-08-15
Build93                 UNALLOCATED
```

Build92 is **REAL USER PASS / ACCEPTED**. Build93 remains unallocated until a fresh bounded post-Build92 audit selects a concrete next scope.