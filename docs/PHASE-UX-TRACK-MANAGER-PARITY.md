# PHASE UX — Track Manager functional parity

Audit date: `2026-08-09`

Corrective branch: `codex/phase-ux-live-smoke-corrections`

Baseline:

- Studio `0.10.4` / Build `26` / production `2a1f74f2b3487501fbeffe94d53f6c5015955ba1`;
- Track Manager `v5.15` / bridge `v1.7` / LaunchPAD repository `0e508c893c038059da4a563365dbdba7094b638d`;
- checkpoint `safety/pre-phase-ux-live-smoke-corrections-20260809-1608`.

Both repositories were clean and synchronized before the audit. This corrective pass is Studio-only unless a separately proven backend blocker is reported and explicitly authorized.

## Current-code comparison

| Capability | Current Track Manager | Studio before correction | Corrective decision |
|---|---|---|---|
| New track intake | Single editor plus mature grouped import | Three-step single-file intake | Keep three steps; add one multi-file/drop entry for one track |
| Multiple files / drop | `09-batch-import.inject.part` groups files and folders | Separate one-file pickers only | Port role classification and review behavior, not the bulk PUT route |
| File classification | Audio/image/TXT/LRC/video extension maps; role correction on conflicts | Picker determines role | Classify supported audio, cover, TXT and video; preserve unambiguous files and expose ambiguous resolution |
| TXT metadata parsing | `08-ui-e.part`, Feature 10.2 and album extension parse canonical headers before `LYRICS:` | TXT is uploaded without parsing | Port current field map, normalization, release-date and album inference |
| TXT autofill | Empty/default fields are filled; existing user values are kept | None | Track field provenance and never silently replace a manual value |
| Smart genres | Feature 10.2 normalizes parent genres from TXT/style/lyrics/file/form signals | Manual genres only | Port current genre rules and six-value limit |
| Smart moods | Feature 10.2 multi-source inference, eight-value limit | None | Port current mood rules |
| Smart themes | Feature 10.2 multi-source inference, eight-value limit | None | Port current theme rules |
| Release date | ISO parser plus `DD/MM/YYYY`-style Feature 10 parser | Not in New Track form | Detect and expose editable release date |
| Slug | Filename/group inference and title conflict warning | Title-derived slug | Preserve title generation; allow TXT title/filename suggestion without overwriting a manual slug |
| Audio / cover / lyrics upload | Same-origin combined PUT for standalone UI | Existing specialized Studio bridge routes | Keep specialized routes and sequential canonical rereads |
| Sequential revisions | Standalone combined PUT is one transaction | Already one asset per request with returned revision | Preserve and make batch progress explicit; reread after every mutation |
| Cover preview | Group import creates/revokes object URLs; catalog/editor show saved cover | Palette only, no image | Add compact local preview with cleanup and saved canonical cover preview |
| Palette extraction | Feature 10.3 canonical `accent` / `accent2`, explicit existing-track extraction | Canonical extraction already ported | Preserve exact fields and existing-track no-silent-overwrite rule |
| Manual palette | Native color inputs for both fields | Read-only swatches/value | Add swatch, color input, HEX input and native EyeDropper when available |
| Upload progress | Operation-level progress/notices | XHR byte progress | Replace unsafe preflight-causing byte transport with safe stage progress |
| Operation validation | Browser quality checks plus server reread | Server response plus canonical reread | Preserve Studio canonical verification and improve messages |
| Content Health | Completeness/quality evidence | Operational completeness | No math change |
| Stale writes | Existing protected routes | `expectedUpdatedAt` required | Preserve; update revision after every verified upload |
| Lost response | Standalone reloads after failures | Generic network error; no verification path | Canonical reread after transport failure; never blind retry |
| Sticky track navigation | Standalone modal/editor navigation | Large sticky header can overlap sticky tabs | Make large header scroll normally and keep compact identity with sticky local nav |
| Catalog rebuild | Explicit standalone admin action | Explicit System action | Remains admin-only and never triggered as an intake side effect |

## Canonical TXT behavior to reuse

The current Track Manager parser recognizes title, type, year, genres/tags, moods, themes, era, energy, languages, status, release date, album title/id, BPM, key, duration, explicit, `accent` and `accent2`. It stops metadata scanning at `LYRICS:`, accepts BOM/CRLF input, recognizes timestamp lines, derives album-track context from a non-Singles album, and accepts `STYLE PROMPT`, `SUNO STYLE` or `STYLE` as inference signals.

Feature 10.2 combines explicit metadata, style prompt, lyrics, filenames and current form signals. Its genre, mood and theme rules are the authoritative behavior for this Studio port. Explicit TXT values remain detected values; rule matches are labeled inferred values. Existing manual form values remain authoritative.

## Upload blocker diagnosis

Track Manager standalone sends multipart with same-origin `fetch` and lets the browser generate the boundary. Studio instead sends cross-origin multipart through `XMLHttpRequest` and registers `xhr.upload.onprogress`. Registering an upload listener sets the CORS-preflight flag even when the multipart request would otherwise be a CORS-safelisted request. Cloudflare Access is in front of the Worker, so this transport can fail before the Worker returns the JSON response, producing the observed status-zero message:

`Asset upload failed before Track Manager returned a response.`

The existing Worker route, multipart fields and guarded persistence are valid and must not change. The corrective client will use credentialed `fetch` + browser-generated multipart boundary, expose stage progress instead of unsafe byte progress, and perform a canonical reread after any network-level failure before an explicit retry is offered.

No Worker, CORS policy, route, schema or R2 change is authorized or currently required.

## Intentional Track Manager-only capabilities

- multi-track folder import and transactional deletion rollback remain standalone admin capabilities; Studio intake handles one track at a time;
- whole-track deletion remains unavailable in Studio;
- manual catalog rebuild remains in Studio System/Administration, not New Track;
- LRC import conversion remains standalone Track Manager compatibility behavior; Studio accepts canonical TXT only so `.lrc` cannot become a second source of truth.

## Corrective acceptance target

Studio must classify one track's selected files, parse and infer metadata before Create, show provenance and cover/palette previews, allow manual canonical palette editing, execute specialized uploads sequentially with fresh revisions, verify uncertain outcomes by reread, and keep local track navigation accessible while scrolling.

Real production asset mutation remains reserved for the user's final manual smoke after the corrective Studio release is merged and deployed.

Implementation status: corrective runtime delivered. The specialized Studio bridge routes were retained; upload transport, canonical lost-response recovery, multi-file intake review, TXT parsing/provenance, cover preview, manual canonical palette controls and compact sticky context are protected by `scripts/test-phase-ux-live-smoke-corrections.mjs`. PR `#29`, CI `31319128176`, merge `80c59e61a35db59d82a80af362ba2de3cb522fa0` and Pages `31319156206` are green. The real user production mutation smoke remains pending, so PHASE UX is not yet closed and no final completion checkpoint exists.

Acceptance-path follow-up: Studio `0.10.6` / Build `28` makes the sequence `Files → Metadata → Review`, allowing immediate MP3/cover/TXT classification and TXT-driven autofill. Commit `6c0ad04`, PR `#31`, CI `31319624749`, merge `38286ba59ded0d3c02fd896054a27ecc70d19286` and Pages `31319657102` are green. Real user production mutation smoke is still pending.

Phase 7 remains not authorized and not started.
