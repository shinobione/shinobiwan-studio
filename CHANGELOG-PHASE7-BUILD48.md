# SHINOBIWAN Studio v0.16.2 · Build 48

Codename: `phase7-native-release-campaign`  
Date: 2026-08-12

## Product decision

Real-user review of TTM V0.2 / Studio Build 47 concluded that the standalone Track-To-Market surface still added too much intermediary UX for what was primarily provider handoff + import + packaging.

Build 48 moves the useful release-campaign workflow directly into Track Workspace → Release Pack.

Track-To-Market standalone is deliberately kept intact as rollback/reference until the native path passes real-user smoke.

## Visual campaign contract

```text
MASTER FINAL 16:9
    ├── coherent 1:1  ← reference = MASTER 16:9
    └── coherent 9:16 ← reference = MASTER 16:9
```

Both derivatives are siblings anchored to the accepted MASTER. 9:16 does not chain from 1:1.

## Delivered

- native Release Campaign workspace inside the existing Release Pack tab;
- no standalone TTM popup in the primary path;
- canonical Track context remains read-only input;
- premium-provider selector;
- optional SHINOBIWAN logo reference upload;
- editable MASTER 16:9 provider handoff;
- faithful MASTER import with actual pixel-dimension/aspect inspection;
- MASTER replacement invalidates prior derivatives so stale variants cannot appear current;
- explicit 1:1 anchored handoff;
- explicit 9:16 anchored handoff;
- both variant handoffs require the accepted MASTER as the provider reference image;
- independent variant import/replacement;
- three-format campaign review;
- visible format-validity state with 4% ratio tolerance;
- browser-local IndexedDB draft persistence across refreshes;
- deterministic/editable SoundCloud, social and tags pack;
- Release Campaign ZIP export with visuals, logo reference, prompts, copy and provenance manifest;
- `canonicalWrite: false` explicitly included in the export manifest;
- optional 8s MASTER-anchored loop prompt recorded for the next slice.

## Safety boundary

Build 48 adds no canonical write path.

It does not:

- write R2;
- call Track Manager mutation APIs;
- replace the canonical cover;
- publish/unpublish;
- mutate Album membership/order;
- expose provider API keys;
- require Local AI or Cloudflare generation.

Browser-local IndexedDB is a working draft only and is labeled accordingly.

## Regression guard changes

Historical Build 45 and Build 47 guards were generalized only where they had incorrectly required the old popup implementation forever.

Accepted history remains documented in its milestone files. Successors remain guarded against canonical write imports.

New guard:

`scripts/test-phase7-native-release-campaign-build48.mjs`

It locks:

- native Release Pack path;
- MASTER requirement;
- anchored 1:1/9:16 prompts;
- no standalone bridge dependency in the current panel;
- IndexedDB draft persistence isolation;
- three-format review styling;
- ZIP/provenance contract;
- no-write boundary.

## Rollback

`safety/pre-build48-native-release-campaign-20260812-1707`

## Acceptance

CI/build success is necessary but not sufficient.

Real-user smoke must prove:

1. logo reference handoff;
2. premium MASTER 16:9 import;
3. coherent Flow 1:1 generated with MASTER attached;
4. coherent Flow 9:16 generated independently with the same MASTER attached;
5. three-format review;
6. refresh restores browser-local campaign draft;
7. ZIP export contains the expected assets/prompts/copy;
8. canonical cover/R2/Track Manager state remains unchanged.
