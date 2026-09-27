# Catalogue A2.4 — Living commercial catalogue: architecture decision proposal

Date: 2026-09-27. **PROPOSAL / REVIEW ONLY — no accepted storage or write decision, Build123 allocation, runtime code, import, source upload, sync, Worker/R2 change or deployment.** This is a post-A2.3 planning packet, not a retrospective amendment to the pre-merge [A2.3 blueprint](CATALOGUE-A2-3-BLUEPRINT.md). Tracking: [STUDIO #235](https://github.com/shinobione/shinobiwan-studio/issues/235).

## Verified baseline and what "living" must mean

- Production pre-proposal `shinobione/shinobiwan-studio` main `d745e473ab467d4f406a967c2479331e4b3740ee`, docs acceptance [PR #249](https://github.com/shinobione/shinobiwan-studio/pull/249), [Pages #36343223429](https://github.com/shinobione/shinobiwan-studio/actions/runs/36343223429) SUCCESS on the same commit. Runtime **Build122 / v0.19.44** is owner-accepted within its [bounded eight-check receipt](acceptance/BUILD122-REAL-USER-PASS.md).
- A2.3 read-only slices: Build120 temporary parent-owned Overview, Build121 source-derived Releases gallery/detail and exact unbound appearances, Build122 Recordings explorer and exact-evidence contextual QA. Input remains explicit browser-selected `catalogue-readonly-seed-v1` JSON, temporary and discarded on exit/refresh, no uploads or durable Catalogue. The earlier private-source aggregates (168 Recordings / 84 Releases / 109 total appearances / 120 known + 48 missing ISRC / 355 pending findings) are source-specific *acceptance observations*, never fixtures or runtime constants.
- The private workbook contains ten sheets. The accepted derived JSON preserves eight sheet counts and does not retain every original body or separate detailed Amuse evidence. Source audit supports no reviewed artwork reference, genre authority or actual Studio Track binding. All current DSP availability is `unknown` unless independently and freshly evidenced. Browsing does not resolve review cases.
- Existing creative authority: Track Manager's protected Track/Album canonical data and assets in R2, with `album.trackIds` as creative Album membership. Studio orchestrates; LaunchPAD is the public listener/PWA and public projection, not commercial-source authority. LaunchPAD repository main observed `e1737f0e29d3411c30c34c134ab0d68650b0617a` during planning, *not* an audited new commercial API. Its public `catalog/index.json` is a rebuildable projection, not the private commercial registry. Protected private Worker/Access and public Worker are distinct deployed components. Studio CPU #238 / LaunchPAD #283 remain open; frontend regression passes are not sustained Workers Free compliance.

A genuinely living Catalogue needs **owner-controlled durable commercial state**, verified provenance, incremental updates and conflict/audit/rollback semantics across each release. It must not silently turn the current partial derived import into a canonical private database. Commercial source events and creative/public publishing are independent timelines.

## 1. Proposed domain ownership (not yet approved)

| Domain | Candidate owner | Never infer |
| --- | --- | --- |
| Commercial Recording, Release and exact ReleaseAppearance | Future separately authorized *private commercial registry* | Source ID, UPC, ISRC or title as interchangeable primary IDs |
| Historical workbook / private original evidence | Owner-controlled private source/package; future reviewed importer is an input, not an automatic write | Derived JSON covers all ten sheets |
| Creative Track, Album, `album.trackIds`, canonical media | Existing protected Track Manager/R2 contracts | Commercial Release = creative Album; Recording = creative Track |
| Reviewed Recording-to-creative-Track association | Separate owner-attested relation containing both exact IDs + evidence/revision | Auto-bind on matching title, ISRC, slug, filename or release |
| Artwork mapping | Explicit reviewed exact commercial Release-to-asset association, lifecycle and ownership decided separately | Raw historical `coverUrl`, creative Album cover or matching filename is commercial cover authority |
| Per-channel release lifecycle | Future private, append-only evidence/event ledger, owned by commercial registry | LaunchPAD upload = SoundCloud/Amuse/Spotify live; Amuse submitted = DSP delivered/live |
| LaunchPAD/public site | Existing public projection, only separately approved publishable fields | Expose raw private workbook/evidence/findings/fingerprints in public Worker/R2/catalog |
| Studio | Human UI/orchestrator with bounded authenticated commands | Second generic R2 writer or an automatic background workbook upload |

**Identity model to decide before migration:** mint independent opaque durable `commercialRecordingId`, `commercialReleaseId`, `commercialAppearanceId` only through a reviewed import/creation gate. Preserve all original source identities and evidence as *provenance aliases* with source namespace, source version/digest claim and confidence/owner decision; do not rely on current `recording:<sourceId>` in-memory presentation IDs as timeless primary keys. ISRC and UPC are optional metadata, not uniqueness or link authority. Preserve duplicates and unbound rows; merge/split is explicit, revisioned and reversible. An appearance references one exact Release and zero or one reviewed Recording.

## 2. Storage alternatives requiring an explicit owner choice

| Option | What it delivers | Limits and gate |
| --- | --- | --- |
| A. Explicit encrypted local package on the owner's device, import/export per revision | Durable offline owner-controlled file; preserves current Pages with no new server reader/writer; safe way to prototype revision/audit and evaluate data completeness | Not seamless cross-device sync or automatic release updates; needs independent threat model, versioned encryption/authentication, tested export/backup/recovery and user-managed key/passphrase. No browser Storage by default; persistence only after separate owner approval. |
| B. Dedicated private commercial namespace/API with bounded domain-specific operations, optionally backed by isolated private R2 objects | True multi-session/cross-device living registry and eventual reviewed event imports | Requires independent design/review of Cloudflare Access/JWT, authorized identity, origin/CSRF, least privilege, encryption/key ownership, audit, revision/CAS, operation ID, canonical reread, backup/rollback and no-public-projection proof. Reuse existing protected infrastructure only if *its actual code and permissions are freshly audited*. Do **not** add a generic Track Manager or R2 writer. CPU/free-budget measurement is mandatory before production. |
| C. Git repository, Pages bundle, CI artifact, public `catalog/index.json`, analytics or browser local/session Storage as the private source-of-truth | Convenient-looking shortcut | **Not authorized / not appropriate** for confidential V5 evidence: distribution, retained history, accidental public exposure, weak write authority or stale state. GitHub remains application-code authority, not the user's private commercial database. |

Proposed staged direction **for discussion only**: first run local source-coverage/identity/audit design without any new persistence; decide whether a user-controlled encrypted package can prove a safe minimal durable model; only then approve or reject a private service architecture. **No storage option is selected by the existence of this proposal.** No new repo is needed for the present planning; a future isolated service repository is a separate security/deployment decision, not a prerequisite for a UI or a license to store user source in Git.

## 3. Event model, not one global "released" checkbox

Future append-only `CommercialChannelEvent` proposal:
- `eventId` and operation identity, exact commercial Release/Recording scope, `channel` (STUDIO draft / LaunchPAD public / SoundCloud / Amuse / Spotify pitch / DSP), action, source, observed-vs-verified classification, occurrence/observation timestamps, reference to restricted evidence and owner/reviewer identity if actually attested.
- Separate explicit states/events: `draft`, `planned`, `submitted`, `distributor-accepted`, `delivery-observed`, `verified-live`, `removed`, `pitch-prepared`, `pitch-submitted`, `verification-expired` when their real evidence exists. No fake promotion of historical observation to current verified truth. Unknown is not absent, and delivered is not verified live.
- Publication truth should be computed *per channel* from its relevant evidence and freshness rules, with the audit/event history retained. Use no automatic state jumps from another channel. A Spotify pitch has its own timeline and cannot be inferred from an Amuse submission or LaunchPAD/SoundCloud release.
- A proposed Studio/LaunchPAD release handoff may **suggest** a commercial draft and show current creative Track metadata; the commercial owner reviews the exact association. A LaunchPAD public publication may later produce an independently scoped verified event only after API/evidence and authority audit; it is not automatic DSP delivery or current platform presence.

## 4. Confidentiality and cross-repository invariants

- The actual workbook, derived V5 JSON, detailed Amuse rows, private IDs, fingerprints, raw evidence, and user-specific matching table must never be committed to Git, tests, source maps, public/Pages builds, Worker logs, Pages/CI artifacts, analytics, URL/query/hash, public R2 or `catalog/index.json`. Synthetic fictional fixtures only. The private original and any reviewed local export stay outside the checkout.
- Retain Build119–122 explicit local selection and memory-only lifetime unless a *separately authorized* future persistence slice changes the contract, with visible user consent and tested wipe/backup behavior. Do not silently migrate session data. No automatic remote fetch/export or cover URL loading.
- If a private service is later selected: strict Access-bound authenticated read/write with verified origin/CSRF, narrow endpoint whitelist, object/subject authorization, payload and byte/row bounds, no-store for private responses, data-at-rest/key strategy, least-privilege read/write isolation, independent private and publishable schemas, explicit owner approval for any public projection. Audit metadata may refer to an encrypted restricted evidence object; public outputs must never include source evidence.
- Writes: optimistic expected revision + idempotency/operation identity appropriate to each bounded operation; a lost response requires canonical private reread, not blind automatic retry. Unknown/ambiguous stays blocked. Validate immutable history, backup and independently tested rollback. Avoid destructive tests against real tracks/artwork/media. R2 mutation, Worker deployment, Pages deploy and owner acceptance each require separate receipts.
- Cross-repo contract may be proposed in STUDIO; no mutation of `LaunchPAD-APP`, Track Manager, Workers, R2 or public projections under this architecture-only PR. No user-specific record in GitHub issue/PR bodies. Sustainably verify the open CPU incidents before adding backend load.

## 5. Dependency-first, bounded delivery proposal (no builds allocated)

| Gate | Deliverable | Owner go/no-go proof |
| --- | --- | --- |
| A2.4-A · private source coverage audit | Local-only inventory of all ten sheet bodies and omitted detailed Amuse evidence, field-level provenance/candidate extensions, exact ID continuity, export version/schema plan and discrepancy summary **without leaking source rows/hashes** | Owner approves the *coverage report and explicit remaining gaps*; no data in Git or backend |
| A2.4-B · durable identity + read-only migration simulation | Independently fictional registry schema; import diff dry-run (new/unchanged/changed/conflicted/unbound) and revision/rollback plan; no write path | Owner verifies exact source-entity relationships and expected conflict cases locally, including duplicate identifiers and one Recording on multiple Releases |
| A2.4-C · storage/privacy architecture decision | Explicit A vs B choice (or reject both), keys/access/backup/recovery, threat model, public-private boundary, CPU budget and per-operation authority; ADR approved as decision | No storage built until owner approves vendor/namespace, credential responsibility, rollout and test strategy |
| A2.4-D · scoped durable mutation prototype | Synthetic-only safe prototype, independent PRs/deploy receipts and no private production write by default | Exact revision, duplicate operation, ambiguous response, restore and privacy gates; explicit owner merge/deploy/write approval |
| A2.4-E · owner-reviewed enrichment | Optional exact-ID commercial cover links, Recording ↔ creative Track review, channel event ledger/UX; each slice separately gated | Human attestation + evidence/revision, no automatic title/ISRC/image mapping |
| A2.4-F · STUDIO ↔ LaunchPAD contract | Read-only handoff/audit first, then separate domain-specific cross-repository proposal if justified; SoundCloud/Amuse/Spotify DSP timelines stay independent | Individual Studio, LaunchPAD/Worker, R2 and real-user receipts; no public/private leakage or free-tier CPU regression |

The smallest next **executable** step after accepting the architecture discussion is **A2.4-A source coverage audit in the owner's own local environment**. It needs a separately approved scoped mission; exact private evidence is never transmitted here or committed. Do not create Build123 until an actual runtime slice is independently approved, version/build/guard are paired, and accepted production main is freshly verified.

## 6. Questions requiring the owner's decision (not answered by current source)

1. Is first priority an owner-managed encrypted portable Catalogue file (manual durability) or cross-device hosted living sync? Which threat model/recovery expectations matter, and who holds the key?
2. Is the ten-sheet workbook still the commercial evidence authority until a complete reviewed exporter/migration is accepted, or is there another authoritative source? The current derived JSON alone cannot answer.
3. Who will approve exact commercial Recording/Release IDs, disputed ISRC/UPC, unbound appearance links, creative Track associations and covers? What is the recorded reviewer/rollback process?
4. Which channel-level evidence qualifies as `verified-live` and for how long? How are Amuse delivery, SoundCloud uploads, LaunchPAD publication and Spotify pitching recorded separately?
5. If a remote private registry is selected, what is the dedicated protected API/namespace and security/deployment ownership? Existing Track Manager/LaunchPAD contracts must be audited first; do not assume unused endpoints or quotas.
6. Which minimal public fields may *ever* be exported from this commercial registry and by whose explicit action? Default is **none**.

## Exit criterion for this proposal

The owner has reviewed the options, source coverage audit is separately scoped and the write/privacy authority ADR remains explicitly *pending* until chosen. This document creates no new accepted product decision in `DECISIONS.md`, no new release, and no automatic roadmap promotion or implementation permission. The independently accepted A2.3 receipts and open CPU incidents stay unchanged.
