# Phase 4B.2A — Lyrics Write Capability Preparation

Studio release: `0.5.2` / Build `11`  
Codename: `lyrics-write-capability-awareness`  
Date: 2026-08-08

## Purpose

Phase 4B.2A is a compatibility-only release placed before any Track Manager lyrics-write backend.

Its job is to let Studio safely consume a future bridge health response containing:

```json
{
  "write": ["metadata", "lyrics"]
}
```

without classifying `lyrics` as an unexpected capability and falling back to the public catalog.

## What Build 11 does

Build 11 expands only the health capability allowlist:

```text
recognizedWriteCapabilities = metadata, lyrics
```

The active client write surface remains:

```text
writeCapabilities = metadata
lyricsWriteEnabled = false
```

No lyrics HTTP client is introduced.

## Hard invariants

The production build guard requires:

- exactly two explicit POST clients total;
- those two are still metadata validate + metadata save;
- `/lyrics/validate` absent;
- `/lyrics/save` absent;
- no PUT/PATCH/DELETE;
- no audio/cover/thumbnail/video mutation path;
- no delete;
- no publish shortcut;
- no standalone catalog rebuild route;
- metadata save behavior unchanged.

## Existing production dependency

At Build 11 deployment time the backend remains:

- Track Manager `v5.11`;
- Studio bridge `v1.3`;
- private Worker Version ID `8bd802ec-0c2b-47ce-aebb-83f6190d5b73`;
- public LaunchPAD Build `2026.08.08.66`;
- public media Worker `v2.6`.

No Worker deployment is required for Build 11.

## Frozen lyrics semantics

The cross-repository read-only audit established:

```text
canonical source = tracks/<slug>/lyrics.txt
timestamps in lyrics.txt = synchronized
.lrc sidecar = optional compatibility/export only
```

Track Manager already accepts `.txt` only for its canonical lyrics upload kind and calculates synchronization from the text contents.

LRC Maker already imports `.txt`/`.lrc`, preserves timestamp text and exports a text blob. It therefore does not require a runtime change merely to support the first guarded Studio lyrics write.

## Next backend phase

After Build 11 is live and verified as `PRIVATE READ`, the backend may be developed separately.

Target design from the audit:

```text
Track Manager v5.12
Studio bridge v1.4
```

with dedicated lyrics validation/update contracts, strong concurrency (`expectedUpdatedAt` plus lyrics object revision/ETag), update-in-place of an existing canonical `lyrics.txt` only, catalog refresh and compensating rollback.

Build 11 does not assume those routes exist yet.

## Safety checkpoints

Last production-proven boundary:

```text
safety/post-metadata-write-proven-20260808-1822
```

Immediate pre-Phase-4B.2 runtime boundary:

```text
safety/pre-4b2-lyrics-write-20260808-1837
```

Both checkpoints exist in Studio and LaunchPAD/Track Manager.

## Deployment gate

Before beginning the v5.12 backend:

1. merge Build 11 only after CI passes;
2. wait for GitHub Pages to deploy Build 11;
3. verify Studio still reports `PRIVATE READ` against current v5.11/v1.3;
4. confirm metadata validation/save remains functional;
5. only then open the backend lyrics capability branch.

No R2 mutation is part of Phase 4B.2A.
