# SHINOBIWAN Studio — Phase 4B.2C Guarded Lyrics Save

Date: 2026-08-08  
Studio: `0.6.0` / Build `12` / `guarded-lyrics-save`  
Backend dependency: Track Manager `v5.12` / Studio bridge `v1.4`  
Worker Version ID: `3aa3136f-492d-46c5-af0a-fd3b048e8666`  
Deployment run: `31270132063`

## Scope

Build 12 activates the dedicated Track Manager v5.12 canonical lyrics contract inside the Track Workspace.

Canonical rule remains non-negotiable:

```text
tracks/<slug>/lyrics.txt = source of truth
timestamps inside lyrics.txt = synchronized
.lrc sidecar = optional compatibility/export only
```

No LRC Maker runtime change is required.

## Workflow

```text
PRIVATE READ
  -> GET canonical lyrics.txt + R2 ETag
  -> edit locally
  -> Validate lyrics
  -> review normalized proposal / timestamps / quality
  -> Save lyrics.txt
  -> explicit confirmation
  -> backend manifest+ETag stale recheck
  -> canonical lyrics write
  -> manifest revision update
  -> catalog rebuild
  -> backend reread verification
  -> Studio lyrics + track canonical reread
  -> Workspace refresh
```

## Concurrency

Both validation and save require:

- `expectedUpdatedAt` — canonical manifest revision;
- `expectedLyricsEtag` — canonical R2 lyrics object revision.

A stale manifest or stale lyrics object is rejected instead of overwritten.

## Client transport

Lyrics POSTs use the same proven Cloudflare Access-compatible simple-request pattern as metadata:

```text
Content-Type: text/plain;charset=UTF-8
credentials: include
```

No custom header is used, therefore no CORS preflight is introduced.

## Save boundary

Build 12 can only save an already-existing canonical `lyrics.txt` because Track Manager v5.12 deliberately blocks missing-file creation and noncanonical filenames.

The remaining Phase 4 Assets integration will own initial lyrics TXT upload alongside audio, cover, thumbnail and Canvas/video.

## Verification

Backend v5.12 verifies saved text, changed R2 ETag and manifest revision, and rebuilds `catalog/index.json`.

Studio then performs a second browser-side canonical verification by rereading both the protected lyrics endpoint and the private track projection.

## Rollback

If the backend fails after replacing lyrics, v5.12 attempts to restore:

1. previous lyrics bytes and object metadata;
2. previous manifest;
3. previous catalog projection.

Preferred pre-Build-12 Studio rollback checkpoint:

```text
safety/pre-build12-lyrics-ui-20260808-1948
```

Preferred cross-repository pre-final-Phase-4 checkpoint:

```text
safety/post-v5.12-pre-phase4-complete-20260808-1945
```

## Explicitly outside Build 12

Build 12 does **not** add:

- track creation;
- audio upload/replace/delete;
- cover upload/replace/delete;
- thumbnail upload/replace/delete;
- video/Canvas upload/replace/delete;
- missing lyrics creation/upload;
- explicit catalog rebuild UI;
- track deletion;
- SonicTrace persistence or any Phase 5 feature.

Those remaining Track Manager operations are completed separately before Phase 4 is declared finished.
