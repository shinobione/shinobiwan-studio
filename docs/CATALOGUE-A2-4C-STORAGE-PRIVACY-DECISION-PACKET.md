# A2.4-C — Commercial Catalogue durability and privacy ADR · owner decision packet

Date: 2026-09-28. **PROPOSED / OWNER CHOICE PENDING.** This is documentation and architecture review, not an accepted storage ADR, Build124 allocation, frontend persistence implementation, Worker/R2/LaunchPAD write, encrypted export, sync, migration or production authorization. Baseline: [bounded Build123 owner view acceptance](acceptance/BUILD123-REAL-USER-PASS.md).

## Decision to make

Build123 intentionally discards a locally selected private v2 snapshot after Reset/leave/refresh. To turn this into a *living commercial registry*, choose a separately owned persistence authority, with revisions and recoverability. A Studio commercial Recording/Release/Appearance is independent from creative Track/Album and public LaunchPAD. Original local workbook and explicit v2 export remain private source evidence until a separate source authority/migration gate is accepted. The v2 file is not already a reviewed durable registry.

| Path | Capabilities | Responsibilities / limitation |
| --- | --- | --- |
| **A — user-held encrypted portable package** | Explicit Save As/Open of versioned private registry and audit package; offline, reversible initial durability, no private API/Worker dependency; simple independently exportable recovery | User holds passphrase and backup copies. Must specify interoperable cryptographic format, key derivation, authenticated encryption and authenticated metadata; test tamper rejection, wrong password, backup and restore; no silent browser Storage. No automatic cross-device sync. |
| **B — isolated private commercial service** | Authenticated multi-session/cross-device registry, revisioned narrow operations and eventual reviewed release/channel event imports | Dedicated private namespace/authorization, Access/session/CSRF/origin review, key custody and recovery, least-privilege service, isolated private storage, per-operation revision/CAS/idempotency, immutable audit, verified restore, no-public-projection proof, Worker CPU/quota budget. Audit actual existing infrastructure; never presume Track Manager has an appropriate commercial API. |
| **A then B (staged)** | Validate revisions/import-diff/recovery on encrypted owner-managed package, independently gate a future private service; retain portable recovery rather than silently moving source | Requires two separately accepted migration gates and explicit reconciliation when packages and service diverge. |
| Public repository/Pages/CI, public catalog index, URLs/logs/analytics, or silent Local/Session Storage as private database | Not eligible for confidential commercial authority. | Public leak, unreviewed retention or competing authority. |

A brand-new repository is **not needed for this decision or a local package prototype**. If B is later chosen, the service/repo/namespace decision follows a specific security and operations review, not a guessed copy of current Track Manager.

## Independent canonical records and revisions (proposed contract, not implemented)

- \`CommercialSourceSnapshot\`: immutable private ingest identity, exact selected bytes digest *held privately*, exporter schema, coverage/omissions, parse findings, source provenance and import timestamp. No default overwrite of workbook-derived observations.
- \`CommercialRecording\`, \`CommercialRelease\`, \`CommercialAppearance\`: opaque durable IDs minted only through a separately reviewed migration transaction. Distinct namespaced source aliases with snapshot version; optional ISRC/UPC are metadata, never automatic identity keys. One Appearance belongs to one exact Release; recording link may be explicit null. Duplicate codes/titles can coexist.
- \`CommercialEvidence\`: immutable independently identified source observation; 14 source-specific v2 detail records enrich existing appearances only through exact source Release + position references, not new entity rows.
- \`CommercialReviewDecision\`: owner/reviewer, exact target, prior/new decision, rationale, evidence refs, operation identity and revision; human decisions never rewrite historical evidence or silently resolve all pending QA.
- \`CommercialChannelEvent\`: independent event histories for Studio draft, LaunchPAD publication, SoundCloud, Amuse and Spotify pitch/delivery/verified-live. Unknown != absent; distributor delivered != verified live. Include evidence class/freshness and separate occurrence vs observation time.

Any durable operation is explicit, scoped, owner-authorized, protected by expected revision, private audit and backup/restore. Duplicate exact import is idempotent; changed/new snapshots produce a dry-run with unchanged/proposed-new/source-changed/missing/conflict/unbound, never automatic deletion or title/ISRC merge. Ambiguous/lost write response requires authoritative reread, not a blind retry. No public field, cover URL or creative Track mapping is automatically published/saved.

## Privacy and key/recovery gate

No private workbook, v1/v2 JSON, source IDs/titles/ISRC/UPC, hashes, evidence, user-specific match list or actual exporter in public Git/CI/Pages/assets/logs/analytics/public R2. Only fully invented synthetic fixtures may test implementation. No credential embedded in Pages. For A, explicitly choose passphrase custody, KDF/work factor, AEAD scheme/version, metadata authenticity, export/recovery policy and independent off-device copy. For B, document authenticating principal, service-side authorization, data-encryption/key ownership, Access/JWT/origin/CSRF measures, object namespace/read-write boundaries, no-store, narrow operations, audit/restore and failure behavior. Neither option can claim secure implementation merely from this plan.

## Gates after owner's choice

1. **C0 — ADR choice:** owner chooses A / B / staged, primary/backup key custody, device expectations and source authority; record decision in DECISIONS.md only after choice. No storage code in this gate.
2. **C1 — threat and identity audit:** independently fictional schema, source alias continuity, incremental diff, backup/recovery and confidentiality review; if B, audit real Access/Worker/storage permissions and CPU #238 / LaunchPAD #283 impact.
3. **C2 — prototype:** dedicated reversible PR and separately allocated build *if* runtime changes. Synthetic-only fixtures: wrong key, tampering, duplicate import, stale revision, lost response, missing source, contradictory evidence, rollback, stale asynchronous work and zero public leakage. Private source remains off-repo.
4. **C3 — owner-only trial:** explicit consent for local export or a separately scoped private write; verify exact re-open/canonical read, migration/backup/restore, revision and no publication/cross-repository mutation. CI GREEN, merge, Pages, Worker deployment, R2 mutation and real-user PASS are separate receipts.
5. **Later E/F:** reviewed covers, commercial↔creative associations, per-channel ledger and Studio↔LaunchPAD narrow read-only handoff first, then independent reviewed write contract. No generic bidirectional sync.

## Owner choice required before authorizing C1/C2

- Preferred path: **A** portable offline encrypted file, **B** authenticated multi-device service, or **A → B** staged?
- Is the original ten-sheet workbook still private historical source authority for imports, with commercial registry holding reviewed decisions/events from then onward?
- Who holds the recovery secret/backups (owner-only passphrase vs explicitly reviewed private service keys)? How many devices need live access?
- Initial public export whitelist: proposed **none** until each field and publish action is reviewed.
- Human reviewer for disputed identities, covers and links: owner by default until delegated with explicit authority.

**STOP:** A docs-only candidate may be reviewed without answering the above, but no approved persistent storage, encrypted package product, remote service, writes/rollout, Build124, R2/Worker/LaunchPAD mutation or automated synchronization follows from its merge.
