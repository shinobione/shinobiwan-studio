# SHINOBIWAN STUDIO — Canonical Decisions

Updated: 2026-10-04. D-024 accepts the transient v2 viewer; D-025 records owner-selected Path A (portable encrypted file). Build124 has since merged as an invented-only file lab. C4 inner registry/restore is a proposal, not an approved durable data-authority model.

This file records durable product, architecture and safety decisions. It is not a changelog. Add an entry only when a decision is introduced, changed or explicitly superseded.

## D-001 — Authority model

**Status:** active / frozen

- GitHub is the application-code authority.
- Cloudflare R2 is the canonical catalog/media/data authority.
- Track Manager is the protected canonical Track/Album write authority.
- SHINOBIWAN Studio is the private artist cockpit/orchestrator.
- LaunchPAD is the public listener/PWA experience.
- SonicTrace is the audio-intelligence engine.
- LRC Maker is the lyrics synchronization engine.
- Public fallback paths are read-only and never verify a canonical write.

**Consequence:** Studio must not become a generic arbitrary R2 writer and related apps must not invent competing sources of truth.

## D-002 — Canonical Track identity

**Status:** active / frozen

The canonical `trackId` is the R2 slug and remains the same across Studio, Track Manager, LaunchPAD, SonicTrace, LRC Maker, manifests and catalog projections.

## D-003 — Canonical Album model

**Status:** active / frozen

Canonical Album authority:

```text
albums/<album-id>/manifest.json
```

- Album ID is stable after creation.
- Ordered `album.trackIds` is the sole Album membership + artistic-order authority.
- Track-side `album` metadata is compatibility/cache data only.
- Generic Track metadata writes must not independently change Album membership.
- Album publication uses Track Manager guarded quality rules.

## D-004 — Canonical lyrics model

**Status:** active / frozen

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = export / compatibility only
```

A `.lrc` file is not an alternative authority and its presence does not define synchronization.

## D-005 — Audio duration truth

**Status:** active / frozen

`manifest.duration` is a derived canonical fact from the current master audio, not a free-form metadata field. Duration evidence is accepted only through explicitly compatible guarded Track Manager bridge pairs.

## D-006 — Specialized writes only

**Status:** active / frozen

Studio uses bounded domain-specific operations such as metadata, lyrics, assets, SonicTrace sidecars and Albums. Do not create a generic cross-origin `saveTrack()` / arbitrary payload writer merely for convenience.

Whole-track deletion remains outside the Studio bridge unless a future explicit design changes that boundary.

## D-007 — Cloudflare Access / browser transport

**Status:** active / frozen

- No Cloudflare Access secret or R2 credential in GitHub Pages.
- Exact Studio origin remains credential-aware; credentialed CORS never uses `*`.
- Existing simple-request control POST transport is preserved where required by Access/CORS.
- Multipart upload uses browser-generated `FormData`; do not force its `Content-Type` boundary.
- Do not introduce browser PUT/PATCH/DELETE methods just for REST aesthetics if they break the established protected transport model.

## D-008 — Lost-response write policy

**Status:** active / frozen Phase9 authority

A lost HTTP response does not prove whether a write committed.

For any write hardened under Phase9 or a later bounded reliability slice:

```text
response lost / timeout
→ no blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

An explicit retry may be presented as safe only when canonical reread proves the pre-write revision/state is unchanged or the operation has a stronger durable idempotency/identity contract that makes the retry safe.

A lost-response operation may be recovered as success only when its exact canonical postcondition is positively verified.

Build82 first applied this to Track asset delete and Album asset delete; later Phase9 slices extended the same decision only with operation-specific postconditions. Build108 later added an operation-specific generation identity for explicit catalog rebuild without creating a generic retry framework.

## D-009 — Acceptance states remain separate

**Status:** active / frozen

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Also distinguish:

```text
code merged
Pages deployed
Worker deployed
R2/catalog mutated
```

A docs-only merge does not create a runtime build.

## D-010 — Production readiness and publication are different axes

**Status:** active

```text
Production:  Needs attention / Production complete
Publication: Draft / Published
```

A production-ready Track may remain Draft. A Published Track may still expose production-health gaps. Publication remains an explicit guarded decision.

## D-011 — One workflow authority

**Status:** active / frozen

Accepted workflow:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse `workflow.nextAction`. Do not create a second queue or priority engine.

## D-012 — Release Campaign is provider-agnostic

**Status:** active

- Track stage wording is `Sonic`, not `Sound`.
- Release Campaign does not expose a fake `Premium provider` selector when provider choice does not change prompt semantics.
- Google Flow is a convenience shortcut only.
- MASTER 16:9 anchors independent 1:1 and 9:16 derivatives; 9:16 is not derived from 1:1.
- Campaign draft state remains browser-local and export remains review-only (`canonicalWrite: false`).

## D-013 — Destructive smoke policy

**Status:** active / frozen

Do not delete or replace important production WAV, cover, video, Album cover or lyrics merely to prove mutation code works.

Prefer source guards, typecheck/build, stale protection, canonical reread verification and explicit confirmations. A destructive browser smoke should use an intentionally disposable Draft asset only when genuinely necessary.

## D-014 — Version/build discipline

**Status:** active / frozen

- A runtime build is allocated only for a proven runtime scope.
- Docs-only governance/closeout work does not bump Studio version/build.
- A candidate does not become accepted retroactively because a later candidate passes.
- Historical failed/superseded builds retain their real status.
- Closing a phase does not consume the next build number merely for bookkeeping.
- Allocate candidate version/build and its matching gate at implementation start after scope is proven (current release discipline, reaffirmed for Build118). Accepted production identity remains separate until real-user acceptance. This supersedes the older temporary-candidate-identity rule.

## D-015 — Repository memory is canonical and bounded

**Status:** active

Current project reconstruction starts from:

```text
AGENTS.md
PROJECT_STATE.md
ROADMAP.md
DECISIONS.md
QA.md
```

Historical `docs/` and `changelogs/` are evidence, not mandatory startup context. Significant accepted closeouts must update the canonical checkpoint files so a new session can resume from repository truth without a copied chat transcript.

## D-016 — Client-side reliability must stop where backend evidence stops

**Status:** active / frozen · introduced by Phase9 closeout

Studio may classify or recover a lost-response operation only when available canonical evidence positively proves the operation-specific postcondition. It must **not** infer causality merely because current state looks plausible after a transport failure.

Examples still requiring stronger backend evidence before further hardening:

- Track create response-loss causality without durable operation identity;
- Album create response-loss causality without durable operation identity;
- exact-byte binary upload causality without trustworthy digest/equivalent exact-object proof;
- expensive Deep Audio compute completion without coordinator operation identity/status/idempotency.

Catalog rebuild is no longer in this unresolved list for the explicit Studio rebuild path because Build108 introduced and real-user-validated a canonical generation identity.

```text
backend exposes enough authoritative evidence
→ a future bounded slice may use it

backend does not expose enough authoritative evidence
→ Studio reports ambiguity/unverified truthfully
→ no blind retry
→ no fake client-side certainty
```

**Consequence:** stronger backend contracts are allowed only as independently scoped operations. Build108 does not authorize a generic idempotency service or automatic write retry.

## D-017 — Explicit catalog rebuild uses canonical generation identity

**Status:** active / accepted by Build108

For `POST /api/studio/catalog/rebuild` only:

```text
browser generates UUID operationId
→ Track Manager rebuilds canonical catalog
→ catalog/index.json stores generationId = operationId
→ Track Manager verifies the identity before success response
→ Studio performs private canonical reread
→ exact generationId match proves this rebuild committed
```

If the POST response is unavailable:

```text
canonical generationId matches operationId
→ recover as committed

canonical generationId differs / missing / unreadable
→ ambiguous or unverified
→ no automatic write retry
```

The generation identity is optional at the lower-level catalog writer so existing internal catalog rebuilds remain compatible. Build108 does not change Track, Album, media, Lyrics, SonicTrace, public-catalog or Deep Audio authorities.

Real-user acceptance evidence on 2026-09-13:

```text
45 tracks
generated               2026-09-13T10:57:36.269Z
generation              c4072021-707b-4d03-be8e-d21324a348b4
canonical reread        verified
```

**Consequence:** catalog rebuild operation identity/generation evidence is no longer backlog for this explicit Studio path. Any other write family requires its own proof contract.

## D-018 — Commercial Catalogue is independent and initially read-only

Introduced for A2.1 / Build118, now accepted within its seven-check scope. `#/catalogue` is commercial discography; `#/catalog` remains creative Tracks. Recordings and commercial releases have independent identities. ISRC/UPC are optional metadata; appearances allow a recording on multiple releases. A Studio Track binding requires private proof and human review, never title similarity. Creative Album membership remains `album.trackIds`.

A2.1 contained no commercial data or import. A2.2 local-private import/dry-run is accepted within Build119 under D-020, in memory only. Channel publication evidence remains channel-specific. No commercial persistence or canonical write authority is introduced.

## D-019 — Browsing may share pending reads; verification stays fresh

CPU slice 4 merged/deployed with bounded owner acceptance, retaining the existing Build118 incident-corrective identity. Albums Health, Management and Tracks may share an in-flight Album collection or complete Track projection operation. Settlement (success, public fallback or failure) clears the shared slot; no TTL, persistent storage or settled-result cache is introduced. Explicit retry and post-mutation UI reload bypass pending work. Superseded requests cannot clear newer slots or overwrite newer component state.

Raw canonical clients used for capability checks, stale guards, write verification/recovery, detail reads and the full migration endpoint remain independent. Sharing does not broaden timeouts, retries, provenance, SonicTrace semantics or write authority. Existing Tracks import-time prefetch and indefinite settled caching are superseded; route re-entry after settlement performs a fresh read with the existing loading skeleton.

## D-020 — A2.2 explicit local-private dry-run

Build119 / v0.19.41 was merged in #242, Pages deployed and accepted by the owner for bounded local-private import/dry-run only. A bundled Web Worker parses the derived JSON schema after explicit selection, without new dependencies, remote IO or storage. Complete validation precedes activation; replacement/reset/unmount cancels stale work and discards the snapshot. Source omissions stay explicit. All imported channel availability remains unknown; Amuse candidates and Studio link proposals require human review. No automatic identity merge, canonical write authority or A2.3 browsing is introduced. [Formal contract](docs/CATALOGUE-A2-2-CONTRACT.md) · [owner receipt](docs/acceptance/BUILD119-REAL-USER-PASS.md). A2.3 Slice 1 session ownership and Overview are independently accepted under D-021; later commercial views and any persistence/synchronization retain independent scope and authority review.

## D-021 — Catalogue session ownership and snapshot-only Overview

Build120 / v0.19.42, merged in #244 and Pages deployed, received the owner's bounded five-check REAL USER PASS for A2.3 Slice 1. The mounted `CommercialCatalogue` owns one import session; its child views consume that state. Normal and invalid Catalogue subroutes retain the session; leaving Catalogue, explicit reset, replacement/rejection, document pagehide or refresh discard it. The existing Worker generation fence prevents late results from restoring discarded data. No global snapshot, storage, remote IO or commercial authority is introduced.

Overview derives counts and code/severity groups solely from the accepted Snapshot; source appearances include unbound rows. QA group selection remains component state, with only the fixed QA route in the URL. Source audit and complete private evidence remain available. This refines the owner location in D-020 without changing its parser, identities or review/publication boundaries. New Playwright dependency is development-only; no runtime dependency is added. [Owner receipt](docs/acceptance/BUILD120-REAL-USER-PASS.md). The Releases gallery is separately accepted under D-022 and the Recording explorer/contextual QA under D-023; neither expands D-021 into commercial persistence or synchronization authority.

## D-022 — Source-only release browsing with explicit unbound appearances

Build121 / v0.19.43 merged in #246, Pages deployed and received the owner's bounded seven-check REAL USER PASS for A2.3 Slice 2. A readonly `unboundAppearances` projection is produced only after existing strict atomic source validation succeeds. It retains exact branded release/appearance identities, position, title, observed ISRC text and evidence with `recordingId: null`. Existing bound appearances, global counts, provenance, findings and channel-unknown rules retain their semantics. Explicit release source and historical distribution observation are projected from the same validated row; original evidence remains intact.

Release detail joins exact identity/evidence maps; no sorted-index or title association. Query/view/selection state is transient, and selection is tied to its snapshot reference. Native modal close/Escape restores the opener; discard/unmount removes detail. Source cover URLs remain inert text inside on-demand evidence; all covers are labeled placeholders. Reference dates remain source text; only valid complete YYYY-MM-DD values sort chronologically, with other text after dated entries. No new commercial/creative authority or publication inference. [Owner receipt](docs/acceptance/BUILD121-REAL-USER-PASS.md). Recordings explorer/contextual QA is independently accepted under D-023; reviewed artwork, commercial persistence and cross-repository synchronization still require later gates.

## D-023 — Exact evidence context and transient cross-detail browsing

Build122 / v0.19.44 merged in #248, Pages deployed and received the owner's bounded eight-check REAL USER PASS for A2.3 Slice 3. The read model uses accepted normalized evidence memberships only. Recording context includes its own and explicitly bound appearance rows; Release context includes its own and exact bound/unbound appearance rows; appearance context includes only its row. Source-note-only cases stay global. No raw-note/index/title/ISRC inference, resolution or Track binding is introduced. Global QA preserves every source finding. One controlled code/context filter retains inherited Overview code behavior and clears entity context on exit or source discard.

One in-memory modal visit supports exact Recording/Release/appearance navigation and Back without source IDs in routes. Close/Escape restores the original opener; route/source discard removes the visit. The parser, Worker generation fence and Build120 session ownership are unchanged. No new persistence, publication or commercial authority. [Owner acceptance](docs/acceptance/BUILD122-REAL-USER-PASS.md); the [candidate handoff](docs/CATALOGUE-A2-3-SLICE3-VALIDATION.md) remains historical pre-merge evidence. All three session-only A2.3 views are independently accepted, but a living commercial registry requires a separate source-of-truth and write-authority architecture decision.

## D-024 — Explicit private v2 reader enriches existing Appearance evidence only

Build123 / v0.19.45, merged [PR #253](https://github.com/shinobione/shinobiwan-studio/pull/253) and bounded [owner acceptance](docs/acceptance/BUILD123-REAL-USER-PASS.md), allows an explicitly selected owner-local `catalogue-readonly-seed-v2` through a separate strict v2 adapter while retaining the accepted v1 parser. Independent detailed distributor observations attach to an existing Appearance by exact source namespace + source Release identity + Release/Appearance IDs + positive position; they never become extra Recordings, Releases or Appearances, current DSP delivery or verified Track bindings. Inconsistent exact links reject atomically; unlinked evidence remains global pending QA; historical status/QA remain unapproved. The snapshot and detail text are private, escaped, memory-only and removed by the accepted discard lifecycle.

This decision does **not** select commercial storage, encryption/key holder, an owner-managed package, a remote commercial service, a new generic writer, approved creative bindings, per-channel event authority or Studio↔LaunchPAD sync. [A2.4-C decision packet](docs/CATALOGUE-A2-4C-STORAGE-PRIVACY-DECISION-PACKET.md) remains a proposal pending distinct owner approval.

## D-025 — A2.4-C path A selected: explicit owner-held encrypted commercial package

On 2026-09-28 the owner chose **A** (portable encrypted local file), expressly **not** B (private hosted service) or staged A→B. The existing temporary Build123 v2 reader remains unchanged until a separate implementation gate. Commercial private data will not be silently stored in browser Storage, Git/Pages, Worker/R2/public projection or LaunchPAD. A future owner-triggered local encrypted export/open/restore must have distinct cryptographic review, secret/recovery custody, authenticated format, explicit revisions/backup, fail-closed import/restore and owner-only trial. The original workbook remains private historical source evidence; registry promotion and human-reviewed commercial decisions need independent approval. No automatic Creative Track/Album identity, title/ISRC match or current DSP status may be inferred.

[Owner choice and gate packet](docs/CATALOGUE-A2-4C-STORAGE-PRIVACY-DECISION-PACKET.md) · [C1 fictional architecture/tests](docs/CATALOGUE-A2-4C-A-LOCAL-PACKAGE-C1-CONTRACT.md). **Path A choice alone authorizes no actual private data save, general crypto codec, registry migration, sync or future merge.** The separate, subsequently authorized and merged [Build124 invented-only lab](docs/acceptance/BUILD124-BOUNDED-OWNER-UI-SMOKE.md) does not change that real-data prohibition. The [C4 schema/recovery draft](docs/CATALOGUE-A24C-C4-REGISTRY-RESTORE-CONTRACT.md) has not become an approved production canonical model; no D-026 is declared before independent review.

## Pending owner decision — C7a vs C7b are separate (NOT D-026)

After Build125/v0.19.47's [bounded owner fictional C6 smoke](docs/acceptance/BUILD125-BOUNDED-OWNER-SMOKE.md), C7 is a **preparatory readiness review only**. The [C7 packet](docs/CATALOGUE-A24C-C7-PRIVATE-TRIAL-READINESS.md) proposes a future **C7a owner-local read-only private v2 migration preview** (no export or commercial writes), followed only after separate approval by **C7b first real encrypted export/restore** with reviewed production cryptography, owner-held backups and recovery proof. **Neither is authorized now** by the generic approval to prepare C7. The owner must make separate explicit scope-specific decisions, and a new numbered D-026 should be recorded only when a real scope is approved.

Synthetic C4–C6 tests and observed no-upload-on-reopen do not approve a general commercial registry encoder, arbitrary-source decryption, public/private backend access, source-identity autofill or Studio↔LaunchPAD sync. Shared GitHub Pages origin already contains other app storage; future storage privacy must be measured as a controlled **before/after differential**, not assumed empty.

## Changing a decision

When a durable decision changes:

1. add or update the relevant entry here;
2. state what it supersedes and why;
3. update `PROJECT_STATE.md` / `ROADMAP.md` if the change affects current scope;
4. add QA evidence if the decision changes runtime behavior;
5. preserve old milestone evidence rather than rewriting history.
