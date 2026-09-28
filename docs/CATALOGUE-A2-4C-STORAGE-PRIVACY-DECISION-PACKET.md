# A2.4-C — Commercial Catalogue durability and privacy ADR · owner decision packet

Date: 2026-09-28. **OWNER DECISION: PATH A SELECTED / IMPLEMENTATION NOT AUTHORIZED.** The owner selected a user-held encrypted portable package as the intended first durability path. This selects a product/storage direction, **not** a working cryptosystem, runtime implementation, Build124 allocation, production private export/write, Worker/R2/LaunchPAD change, synchronization, migration or merge authorization. Baseline: [bounded Build123 owner view acceptance](acceptance/BUILD123-REAL-USER-PASS.md).

## Recorded owner choice and remaining gates

Build123 intentionally discards a locally selected private v2 snapshot after Reset/leave/refresh. To turn this into a *living commercial registry*, choose a separately owned persistence authority, with revisions and recoverability. A Studio commercial Recording/Release/Appearance is independent from creative Track/Album and public LaunchPAD. Original local workbook and explicit v2 export remain private source evidence until a separate source authority/migration gate is accepted. The v2 file is not already a reviewed durable registry.

| Path | Capabilities | Responsibilities / limitation |
| --- | --- | --- |
| **A — user-held encrypted portable package** | Explicit Save As/Open of versioned private registry and audit package; offline, reversible initial durability, no private API/Worker dependency; simple independently exportable recovery | User holds passphrase and backup copies. Must specify interoperable cryptographic format, key derivation, authenticated encryption and authenticated metadata; test tamper rejection, wrong password, backup and restore; no silent browser Storage. No automatic cross-device sync. |
| **B — isolated private commercial service** | Authenticated multi-session/cross-device registry, revisioned narrow operations and eventual reviewed release/channel event imports | Dedicated private namespace/authorization, Access/session/CSRF/origin review, key custody and recovery, least-privilege service, isolated private storage, per-operation revision/CAS/idempotency, immutable audit, verified restore, no-public-projection proof, Worker CPU/quota budget. Audit actual existing infrastructure; never presume Track Manager has an appropriate commercial API. |
| **A then B (staged)** | Validate revisions/import-diff/recovery on encrypted owner-managed package, independently gate a future private service; retain portable recovery rather than silently moving source | Requires two separately accepted migration gates and explicit reconciliation when packages and service diverge. |
| Public repository/Pages/CI, public catalog index, URLs/logs/analytics, or silent Local/Session Storage as private database | Not eligible for confidential commercial authority. | Public leak, unreviewed retention or competing authority. |

**Chosen path: A only.** B and staged A→B are not in the current scope; neither may be activated silently. The user's local ten-sheet original remains historical source evidence and Build123's selected v2 stays a derived temporary view; promotion of a reviewed portable commercial registry remains a separate explicit gate. The owner retains custody of the encrypted package, its passphrase/recovery and off-device backups. Actual encryption/KDF parameters must be independently reviewed and tested before any genuine export.

A brand-new repository is **not needed for this decision or a local package prototype**. If B is later chosen, the service/repo/namespace decision follows a specific security and operations review, not a guessed copy of current Track Manager.

## Independent canonical records and revisions (proposed contract, not implemented)

- `CommercialSourceSnapshot`: immutable private ingest identity, exact selected bytes digest *held privately*, exporter schema, coverage/omissions, parse findings, source provenance and import timestamp. No default overwrite of workbook-derived observations.
- `CommercialRecording`, `CommercialRelease`, `CommercialAppearance`: opaque durable IDs minted only through a separately reviewed migration transaction. Distinct namespaced source aliases with snapshot version; optional ISRC/UPC are metadata, never automatic identity keys. One Appearance belongs to one exact Release; recording link may be explicit null. Duplicate codes/titles can coexist.
- `CommercialEvidence`: immutable independently identified source observation; 14 source-specific v2 detail records enrich existing appearances only through exact source Release + position references, not new entity rows.
- `CommercialReviewDecision`: owner/reviewer, exact target, prior/new decision, rationale, evidence refs, operation identity and revision; human decisions never rewrite historical evidence or silently resolve all pending QA.
- `CommercialChannelEvent`: independent event histories for Studio draft, LaunchPAD publication, SoundCloud, Amuse and Spotify pitch/delivery/verified-live. Unknown != absent; distributor delivered != verified live. Include evidence class/freshness and separate occurrence vs observation time.

Any durable operation is explicit, scoped, owner-authorized, protected by expected revision, private audit and backup/restore. Duplicate exact import is idempotent; changed/new snapshots produce a dry-run with unchanged/proposed-new/source-changed/missing/conflict/unbound, never automatic deletion or title/ISRC merge. Ambiguous/lost write response requires authoritative reread, not a blind retry. No public field, cover URL or creative Track mapping is automatically published/saved.

## Privacy and key/recovery gate

No private workbook, v1/v2 JSON, source IDs/titles/ISRC/UPC, hashes, evidence, user-specific match list or actual exporter in public Git/CI/Pages/assets/logs/analytics/public R2. Only fully invented synthetic fixtures may test implementation. No credential embedded in Pages. For A, explicitly choose passphrase custody, KDF/work factor, AEAD scheme/version, metadata authenticity, export/recovery policy and independent off-device copy. For B, document authenticating principal, service-side authorization, data-encryption/key ownership, Access/JWT/origin/CSRF measures, object namespace/read-write boundaries, no-store, narrow operations, audit/restore and failure behavior. Neither option can claim secure implementation merely from this plan.

## Gates after owner's choice

1. **C0 — ADR choice:** **A selected by owner.** User-managed encrypted file, explicit Save/Open/Restore, no automatic sync; no storage code in this gate. Passphrase/recovery policy and source/migration authority remain independent approval points.
2. **C1 — Path A architecture + synthetic rehearsal:** separately proposed [local encrypted package contract and tests](CATALOGUE-A2-4C-A-LOCAL-PACKAGE-C1-CONTRACT.md) covers draft envelope, threat model, exact alias continuity, incremental diff, revision/restore/no-write safeguards and prospective cryptographic tests. This does **not** implement encryption in the application. A separate [C2 invented-only Web Crypto format rehearsal](CATALOGUE-A2-4C-A-C2-CRYPTO-FORMAT-REHEARSAL.md) exercises PBKDF2/AES-GCM test primitives without an actual private file, runtime or durable Save/Restore.
3. **C2 — prototype:** dedicated reversible PR and separately allocated build *if* runtime changes. Synthetic-only fixtures: wrong key, tampering, duplicate import, stale revision, lost response, missing source, contradictory evidence, rollback, stale asynchronous work and zero public leakage. Private source remains off-repo.
4. **C3 — owner-only trial:** explicit consent for local export or a separately scoped private write; verify exact re-open/canonical read, migration/backup/restore, revision and no publication/cross-repository mutation. CI GREEN, merge, Pages, Worker deployment, R2 mutation and real-user PASS are separate receipts.
5. **Later E/F:** reviewed covers, commercial↔creative associations, per-channel ledger and Studio↔LaunchPAD narrow read-only handoff first, then independent reviewed write contract. No generic bidirectional sync.

## Remaining decisions before any C2 persistence implementation

- Path A is accepted; B and staged service are deferred, not an implied follow-up.
- Is the original ten-sheet workbook still private historical source authority for imports, with commercial registry holding reviewed decisions/events from then onward?
- Who holds the recovery secret/backups (owner-only passphrase vs explicitly reviewed private service keys)? How many devices need live access?
- Initial public export whitelist: proposed **none** until each field and publish action is reviewed.
- Human reviewer for disputed identities, covers and links: owner by default until delegated with explicit authority.

**STOP:** Direction A is accepted, not its crypto implementation. A synthetic-only contract/CI may be reviewed, but no persistent browser or file writes in Studio, real encrypted export, owner-data migration, Build124, merge, R2/Worker/LaunchPAD mutation or automated sync follows without independently scoped approval.
