# SHINOBIWAN Catalogue A2.3 — functional blueprint / review candidate

Date: 2026-09-27. **Specification only: no runtime implementation, new build number, persistence, platform synchronization or deployment is authorized by this document.** Tracking: [STUDIO #235](https://github.com/shinobione/shinobiwan-studio/issues/235).

## 1. Grounded starting point

- Accepted production: Build119 / v0.19.41, merged [#242](https://github.com/shinobione/shinobiwan-studio/pull/242), main `20a0adf15271a0f9bff0cbd2a318c441685ec2bc`, Pages [#36316493317](https://github.com/shinobione/shinobiwan-studio/actions/runs/36316493317) SUCCESS. [Bounded owner receipt](acceptance/BUILD119-REAL-USER-PASS.md).
- A2.2 `src/catalogue/import.ts` accepts explicit local JSON (`catalogue-readonly-seed-v1`) and creates a temporary `Snapshot` of separately branded `recordings`, `releases`, `appearances`, `evidence`, `channels` and `findings`; no background import, server upload or durable state. `CatalogueImport` currently shows a summary plus paginated QA, not a release/recording gallery.
- Owner-confirmed aggregates for the particular private snapshot are 444 source rows, 168 recordings, 84 source releases, 109 source appearances, 120 known/48 missing ISRC, 0 rejects and 355 pending findings. They are acceptance evidence, **not** runtime constants, not a source fixture, and not evidence of publication.
- The private workbook contains ten sheets; the derived JSON does not retain every sheet/body or the separate detailed Amuse evidence. The source audit reports no artwork references or reviewed Studio Track links. No normalized genre metadata is established by the accepted derived import contract.
- `#/catalog` means creative Tracks; `#/albums` means canonical creative Albums; `#/catalogue` means commercial discography. Commercial `recordingId`, `releaseId` and `appearanceId` never become a Track slug or ISRC. Creative `album.trackIds` remains membership authority.
- The commercial schema exposes `ChannelPublication` states, but imported current availability stays `unknown`. A historical URL/Amuse listing/SoundCloud observation does not verify current Spotify, Apple Music or any other channel.

## 2. Product objective and non-goals

Make the temporary, explicitly selected commercial snapshot **pleasant to inspect and reconcile** inside the native STUDIO Catalogue: overview, release gallery, recording explorer, detail drilldown and contextual QA. A recording may occur on multiple releases without automatic merging. Show evidence, missing facts, open decisions and distinct channel states visibly and truthfully.

A2.3 is a **session-only read/view layer**. No new generic writer, R2/Worker change, external availability probe, browser storage, commercial save, automatic title-based Track binding, distributor API, pitch submission, DSP publication, data export or silent import. Do not promise a living persisted catalogue until the later authority/storage architecture is approved.

## 3. Intended information architecture

`#/catalogue` — Overview:
- Quiet, premium artist dashboard: source-loaded/snapshot date/privacy strip, aggregate Recordings / Releases / Appearances / missing ISRC / pending findings; figures generated from the current snapshot, never hardcoded.
- A clear local-source picker and Reset / unload always remain discoverable.
- Concise review highlights grouped by explicit finding code/severity; deep-link to the contextual in-session QA panel, **not** a new independent priority engine.
- Empty state on fresh entry or refresh honestly requests local file selection.

`#/catalogue/releases` — Release gallery:
- Responsive artwork-oriented cards with title, source identity, kind, documented reference date (do not silently label it official release date), optional UPC and a clear `Publication unverified` treatment.
- No invented covers: deliberate attractive placeholder until owner explicitly supplies reviewed local artwork. The audited A2.2 JSON has no cover reference. No loading remote source `coverUrl` automatically.
- Grid/list switch, free-text search over already-loaded explicit fields and limited factual filters: kind, distributor/source, known/unknown UPC, pending QA. Preserve distinct releases even with similar titles or repeated UPC.
- Click opens an in-memory detail panel with appearance order, linked recordings, source evidence and per-channel historical observations. Missing references remain explicit.

`#/catalogue/recordings` — Recording explorer:
- Comfortable searchable table/cards showing title, optional ISRC, appearances count and provenance/review status.
- A Recording detail exposes all distinct Release appearances, related source evidence, discrepancies and any proposed Studio binding as **unreviewed**; no automatic link by title or ISRC.
- Missing ISRC is shown as `Unknown / not documented`, not fabricated or displayed as a zero. Do not deduplicate distinct source recordings merely because titles or ISRC match.
- Genres, version, duration and artwork appear only when supported by the imported schema and reviewed evidence; otherwise `Not documented`. Do not add empty decorative filter facets that imply verified metadata.

`#/catalogue/qa` — Contextual evidence:
- Keep existing paginated, escaped evidence and full pending review count; add filter by source finding code/severity/entity/locator where a relationship is proved.
- Contextual `View recording` / `View release` is only shown when the actual normalized evidence relationship is known; an unresolved appearance remains explicitly unbound.
- Display provenance and original evidence privately on demand; no automatic resolution, acceptance, publish button or durable reviewer-signature claim.

Detail navigation and URL/privacy:
- Existing `src/catalogue-router.ts` accepts safe opaque `id` routes, whereas normalized IDs include namespaced private source identifiers. Never put private titles, ISRC, original source IDs or raw evidence in the URL/hash.
- **Default A2.3 approach:** transient component-level detail panel/drawer with session-only selection; back/escape/focus restoration are required. Assess an optional per-session, non-reversible, non-source-derived route token separately if truly needed. Direct refresh/deep link with no imported snapshot must fail closed into a helpful empty/not-found view, not auto-load private data.

## 4. UX direction

Design language: coherent with current STUDIO, warm charcoal/graphite surfaces, restrained bronze/gold highlights, existing cyan only for useful states, comfortable whitespace, premium typography, crisp covers/placeholders and responsive cards; not a flat spreadsheet or a generic streaming player. An artwork card should not imply artwork availability when there is none. Small-screen list mode, keyboard navigation, clear focus, reduced motion, honest empty and loading states are mandatory. No unexpected media playback, third-party artwork loading or auto-launching AI generation.

The snapshot/session owner must be lifted above the four Catalogue sections so changing tabs does not reset it. Leaving Catalogue, explicit unload or browser refresh must clear it. Changing/rejecting a selected file discards the old snapshot immediately; stale Web Worker replies never reactivate it. Do not copy full evidence notes repeatedly into every list card; derive view indexes on current snapshot and discard them with the session.

## 5. Data/projection contract

Inputs are solely the A2.2 accepted `Snapshot`, never embedded historical records or fresh private API calls. Provide pure selectors indexed by branded IDs:
- `recordingById`, `releaseById`, `appearanceByReleaseId`, `appearancesByRecordingId`, `evidenceById`, and `findingsByLocator`.
- Preserve source appearance count separately from projected bound appearances when they differ; no silent loss of unbound rows.
- Display channel historical evidence separately from `ChannelPublication.status = unknown`. Refrain from normalizing ambiguous fields into invented DSP dates.
- Stable sorting by explicit source IDs and safe user-selected title/date views; search does not rewrite identities or review truth.
- Rendering of source evidence remains escaped text, never unsafe HTML or script. Do not put private strings in analytics, console, network, external links or URLs.
- If a field cannot be inferred from existing normalized schema, surface it as not documented or keep it in private evidence. An optional richer V5 export is an **independent source-coverage review**, not a hidden A2.3 schema assumption.

## 6. Artwork and release lifecycle — decisions deferred

Current source has no artwork references. For a future local artwork mapping, a separately reviewed session-only owner action may select files and bind to an exact commercial release ID after explicit confirmation. Validate image type/size, use local object URLs with revocation on replacement/unload, never publish by default, never auto-match by title, filename or creative Album ID. Until such functionality is scoped, show intentional placeholders.

Represent commercial workflow per explicit channel rather than one global `Released` Boolean. In a **future** review/editing slice, separate intention, distributor submission, distributor delivery, verified-live evidence, removal, date and evidence source. SoundCloud upload, LaunchPAD publication, Amuse acceptance and Spotify pitching are distinct events. A2.3 reads imported historical observations; no external writes or status transitions.

## 7. Proposed bounded delivery order (not yet authorized implementation)

1. **A2.3 Slice 1 — Session-aware overview + indexed read model.** Lift A2.2 snapshot lifecycle safely above tabs, prove empty/refresh/reset/cancel/privacy and selective memoized read projections. No gallery before this foundation is stable.
2. **A2.3 Slice 2 — Releases gallery + detail.** Real titles/kinds/source dates; truthful cover placeholders; appearances and unknown channel statuses. Search/filter from source-derived facts only.
3. **A2.3 Slice 3 — Recordings + evidence-linked QA.** Appearances in multiple releases, missing ISRC, contextual findings, keyboard/detail navigation, no synthetic identity resolution.
4. **Owner acceptance.** Actual private selection and aggregate count continuity; tabs and drilldown; missing field truth; mobile/ultrawide/keyboard; DevTools Network/Storage/URLs; reload/unload; no private artifact or media exposure; inherited Build118/Build119/CPU tests. Distinguish exact CI SHA, merge, Pages and owner browser result.
5. **Separate architecture decision for persistence/sync (after read-only A2.3 acceptance).** Do not bolt storage into this read/view slice.

Each runtime slice gets its own preflight, version/build allocation and guard at implementation time, Draft PR, exact-head CI and owner approval before merge/deploy. No new repo is needed.

## 8. Future living Catalogue / STUDIO ↔ LaunchPAD (architecture proposal, not a commitment)

A future reviewed domain authority map should define:
- Commercial Recording/Release/Appearance registry and revision ownership; where confidential catalogue data may actually reside and who can write it.
- Canonical creative Track/Album authority stays in Track Manager/R2; a commercial Recording ↔ Studio Track mapping is explicit, reviewable and proof-backed, not a second identity.
- Per-channel release event ledger with source, observed/verified time, evidence, operation identity and conflict policy; Spotify pitch, SoundCloud posting, Amuse delivery and DSP verification are independent timelines.
- Draft release workflow handoff from STUDIO/LaunchPAD without treating any one upload as proof of another platform.
- Exact ownership for artwork/genre/date/ISRC enrichment, audit trail, rollback, safe private transport and no title-only automated reconciliation.
- A concrete and separate decision on whether the private ten-sheet workbook needs a richer local exporter before adopting any long-lived commercial source-of-truth.

No bidirectional sync, commercial database, cloud credentials or production writes are authorized by this blueprint. A local ephemeral A2.3 UI can be delivered first without pretending to solve persistence.
