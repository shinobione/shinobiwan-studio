# A2.4-C / Path A · C1 local encrypted Catalogue architecture and synthetic acceptance contract

Date: 2026-09-28. **CANDIDATE / NO RUNTIME STORAGE OR CRYPTO IMPLEMENTATION.** Owner selected **A — portable encrypted package, explicitly handled on their own device**. This is the next reviewable architecture-and-test slice after the [Build123 bounded view-only owner acceptance](acceptance/BUILD123-REAL-USER-PASS.md), not Build124 and not consent to write a real package. [Decision packet](CATALOGUE-A2-4C-STORAGE-PRIVACY-DECISION-PACKET.md).

## 1. Objective and threat boundary

The current local v2 import remains explicitly chosen, in memory and discarded by existing Build123 reset/navigation/refresh rules. A later, independent implementation may add a user-triggered **Export encrypted package**, **Open encrypted package**, **Preview differences** and **Restore from chosen backup**, without silent persistence, cloud submission, auto-refresh from disk or source disclosure in Pages/CI/public R2/URL/analytics/console. The plaintext workbook/v1/v2 input is **not** itself a secure backup. The local encrypted download belongs to the owner; after Save As it cannot be revoked remotely.

Adversaries in scope for the future package include accidental sharing of the encrypted file, a lost disk/backup, incorrect password, modified/truncated/corrupted bytes, rollback/stale revision, reused operation IDs and attempts to smuggle sensitive metadata outside ciphertext. An unlocked/malicious browser or compromised owner machine cannot be defended by file encryption alone. Owner recovery depends on custody of a sufficiently strong passphrase **and** an independently stored backup; if either is lost, there is no hidden service recovery. No secrets are held by GitHub Pages, JavaScript bundle, public Worker, LaunchPAD, source URLs or browser Storage.

## 2. Proposed separate authority — subject to C2 implementation review

**Source evidence:** the original ten-sheet workbook and explicit owner-local derived snapshots remain historical evidence, not auto-resolved commercial decisions. Each successful import candidate records private source revision/provenance. Full original-byte certification of the workbook is not invented by a JSON claim.

**Portable commercial registry (future):** an explicit owner-promoted encrypted revision may hold independent opaque commercial Recording, Release and Appearance IDs, namespaced versioned source aliases, immutable Evidence/Snapshot records, pending QA, manually approved ReviewDecisions, and per-channel historical Events. Its own commercial state is authoritative only for subsequently approved commercial decisions and events, **not** for creative Track/Album/media authority or current platform live verification. Reviewed source alias migration must preserve duplicates and unbound associations; titles/ISRC/UPC are corroborating metadata, not identity selectors. First promotion from the private workbook/v2 to a registry is not automatic.

**Public publication:** default zero public fields and zero network operations; per-channel Amuse/SoundCloud/Spotify/LaunchPAD dates and statuses remain independent. This slice does not edit Track Manager, Worker, R2 or LaunchPAD.

## 3. Versioned package shape (conceptual, not an implemented cryptosystem)

Outer plaintext header must be minimal: fixed magic, package-format version, algorithm/KDF identifiers plus reviewed numeric KDF parameters, per-package randomized salt/nonce and length-bounded opaque authenticated ciphertext. **Do not place source filename, artist/title, ISRC/UPC, alias, digest, evidence, QA, recording/release/appearance IDs, snapshot time or reviewer in the outer header.** Header fields that affect decryption must be authenticated (e.g. bound as AEAD additional authenticated data); unknown versions/algorithms/extra fields fail closed. Do not trust an unauthenticated header, filename or external checksum to validate the payload.

Encrypted inner payload may include a private versioned registry ID/revision, immutable import snapshots, exact aliases, entity edges, evidence and unresolved findings, review decisions, channel event history and private audit/recovery metadata. No plaintext fallback, compression-based information leakage, automatic storage or silent migration from a v1/v2 source file. Byte/row/count limits and canonical serialization need C2 selection before any real payload is written.

**Cryptography gate still pending:** review an interoperable, well-maintained authenticated-encryption implementation with a unique nonce per encryption and authenticated header, a password-based KDF (memory-hard Argon2id if independently vetted in the actual browser environment, or calibrated browser-native PBKDF2 with its documented offline-attack trade-off), per-package random salt and format/version agility. Define and test parameter floor, resource ceiling, nonce randomness, wrong password/tamper/partial/truncated-file behavior, constant-shape failure (without disclosing source), zero hardcoded secrets and new salt/nonce on every explicit export. A future C2 implementation must run independent real crypto round-trip/interoperability tests; the synthetic C1 suite deliberately **does not test encryption** or claim cryptographic security.

## 4. Revision, import, save and recovery transactions (proposal-only at C1)

- **Explicit local selection:** parse/validate a v2 source using the accepted Build123 contract. Keep it transient; no Save occurs because a read-only view succeeded.
- **Preview incremental import:** compare exact `(sourceNamespace, entityKind, sourceId)` aliases against the selected registry revision. Display `unchanged`, `source-changed`, `proposed-new`, `missing-in-new-snapshot`, `conflicting-alias`, and `unbound`. No automatic delete, new global ID, merge by matching title/ISRC, approval or creative Track mapping.
- **Explicit approval:** require source revision, expected registry revision and uniquely identified operation/decision. Only a separately approved implementation may mint registry IDs or append audited decisions; the C1 rehearsal always returns proposals with **zero writes**.
- **Save encrypted file:** user action, validated candidate, authenticated encryption, write into a *new* versioned filename through browser download/Save As; do not overwrite the only known-good copy. Success of Blob/download or a browser prompt is **not proof** of durable disk write; re-open independently for verification. No browser Storage as private authority and no automatic File System Access API write.
- **Restore:** select a separate previously saved file, authenticate/decrypt completely before activating anything, validate schema and immutable history/revision, show registry ID/revision/difference and require an explicit choice. Wrong password, corruption, stale/foreign snapshot or unsupported version must preserve the current in-memory state. Backups remain owner-held and no rollback silently discards newer decisions.
- **Ambiguity:** if Save As is cancelled or its outcome cannot be proven, show *unverified*; never claim persisted nor blindly overwrite. All asynchronous work has the existing generation fence semantics; Reset/leave/refresh discard plaintext and sensitive view, while downloaded files are outside Studio's control.

## 5. C1 independently fictional, pure Node contract rehearsal

`scripts/test-a24c-local-package-contract.mjs` is a test-only draft migration planner, **not imported by Studio**, not a package encoder, encryption utility, filesystem writer, real v2 converter or commercial data importer. Its `check:a24c` gate joins inherited build checks without a runtime build/version change.

Required cases (all with invented fixtures, aggregate PASS labels only):
1. Exact snapshot replay is idempotent and proposes zero creation/deletion/approval.
2. Same alias, newer source revision is `sourceChanged`; new alias is `proposedNew`; absent old alias is `missingInNewSnapshot`, never deletion.
3. Order changes do not affect the proposal.
4. Same title/code cannot create identity; source aliases are namespaced by entity kind and source, and duplicate or conflicting alias claims reject atomically.
5. Expected revision mismatch blocks preview/restore; reused decision operation identity with incompatible payload blocks, exact replay is non-mutating.
6. An unbound Appearance stays unbound; several independently attested details for one Appearance cannot increment entity counts; exact cross-release position cannot be inferred.
7. Restore planning never mutates the current registry and rejects mismatched registry identity; this does *not* stand in for real authentication/decryption.
8. Test fixture and public script contain no user source examples, secrets, real source fingerprint/filename or network/storage calls. Source/build artifact privacy scanner and all inherited Build118–123 tests remain required.

Future **C2 crypto/security acceptance**, not covered by these tests: independently reviewed real AES-GCM/approved AEAD and KDF vectors, wrong password, byte/header tamper, truncation, nonce/salt uniqueness, wrong algorithm/version, over-budget KDF/size, disk-file re-open and recovery copy, no public metadata leakage, browser Network/Storage/URL/log checks and restoration after refresh. Owner-only private-data trial requires a distinct approval.

## 6. Independent stop line

C1 may be reviewed through synthetic-only CI and a **Draft PR**. No Build124 allocation, Pages/runtime UI change, private download, persistent local/browser store, automatic migration, commercial Save/Restore, key material, service/API/Worker/R2/LaunchPAD change, merge or publication without a further explicitly scoped owner authorization. Studio CPU #238 and LaunchPAD #283 remain open, not resolved by offline planning.
