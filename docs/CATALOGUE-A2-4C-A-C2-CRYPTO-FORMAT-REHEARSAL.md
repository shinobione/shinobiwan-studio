# A2.4-C/A · C2 browser-native encryption format — synthetic cryptography rehearsal

Date: 2026-09-28. **DRAFT REFERENCE / FICTIONAL DATA ONLY / NO RUNTIME FILE OR STORAGE WRITER.**
Owner selected Path A (explicit portable owner-held encrypted package) and authorized the next architecture/security-review tranche. This document proposes an interoperable first file envelope and a test-only Web Crypto rehearsal. It is **not** an independent professional security audit, production deployment, private-source migration, backup guarantee or authorization to merge. Build123 / v0.19.45 remains the accepted in-memory reader. [C1 source/identity contract](CATALOGUE-A2-4C-A-LOCAL-PACKAGE-C1-CONTRACT.md).

## Candidate crypto rationale, NOT a blanket security guarantee

Browser-native [Web Crypto PBKDF2 derivation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey) to a **non-extractable AES-256-GCM key** keeps this initial design dependency-free and suitable for HTTPS and a local Worker. Use PBKDF2-HMAC-SHA-256 with a candidate **minimum 600,000 iterations**; this follows the [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) when PBKDF2 is chosen. It is not memory-hard; Argon2id remains preferable in many password-attack models but needs a separately vetted implementation, build integrity and tested browser/device memory. Weak passphrases are vulnerable to offline guessing regardless of an authenticated cipher. The final parameter floor/ceiling and performance on owner's actual device must be reviewed before accepting a real export.

For AES-GCM use a fresh **16-byte CSPRNG salt**, separately fresh **12-byte (96-bit) nonce**, **128-bit authentication tag** and authenticated serialized header as Additional Authenticated Data (AAD). Every explicit encryption must get fresh salt and nonce; never reuse nonce with the same derived key. [MDN AES-GCM documentation](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams) describes nonce uniqueness, recommended 96-bit IV and AAD. The browser cannot guarantee durable disk save simply because it created a Blob.

## Proposed minimal sealed format, candidate v1

One bounded, canonical UTF-8 JSON object, containing exactly two members in this order: `header` and `ciphertext`. The header has only the following fixed-order, exact-typed fields:

| Field | Format / pre-decryption validation |
| --- | --- |
| `magic` | literal `SHINOCAT-PKG` |
| `version` | integer `1`; unknown versions rejected, no silent upgrades |
| `kdf` | literal `PBKDF2-HMAC-SHA256` |
| `iterations` | finite safe integer **600,000–1,200,000**; reject excess before KDF to resist untrusted-input resource exhaustion. Candidate ceiling may change only in new reviewed format |
| `salt` | canonical unpadded Base64URL of exactly 16 random bytes |
| `cipher` | literal `AES-256-GCM` |
| `nonce` | canonical unpadded Base64URL of exactly 12 random bytes |
| `tagBits` | literal `128` |
| `plaintextBytes` | integer 1–10 MiB in this rehearsal (specific production source and package limits to be reviewed) |

`ciphertext` is a canonical unpadded Base64URL encoding of the AEAD ciphertext followed by 16-byte tag, with decoded size **exactly `plaintextBytes + 16`**. The header's exact canonical UTF-8 serialization is passed as AES-GCM AAD, so any permitted header modification triggers authentication failure. Noncanonical JSON, duplicate keys, added fields, unknown algorithm/version, malformed Base64URL, bad length and oversized KDF work are rejected before PBKDF2. The plaintext is never included in the outer header. An unknown or malformed file is never upgraded from a v2 source JSON, converted to plaintext or guessed by extension.

In the future **inner authenticated payload**, separate `registryId`, immutable audit/snapshot history, revision/expected revision, namespaced entity aliases, exact evidence edges, pending QA, reviewed decisions and per-channel event history. Its schema and migration policy are independent C2/C3 gates; *this cryptography rehearsal encrypts only invented UTF-8 test bytes*, not an actual commercial registry or source. No human identity, source filename, titles, IDs, ISRC/UPC, source digest or timestamps are allowed outside ciphertext. Filename is nonauthoritative, no source ID in URL.

## Key/password and recovery behavior before any real implementation

Owner passphrase is entered explicitly on each open/export, kept only for that operation, never saved to browser Storage/URL/logs/analytics or embedded in bundled code. Strong independently generated secret/passphrase and a separate protected recovery copy are required; **no backdoor and no provider-held recovery key**. The Web Crypto key is non-extractable, but a compromised active browser/device can still inspect entered passphrases or plaintext. JS strings cannot be guaranteed to be wiped from memory. Wrong password, modified ciphertext and authenticated-header tamper yield one indistinguishable user-facing **cannot open or verify package** outcome; do not activate a partial restored view.

The future UX requires explicit Save As to **a new** versioned file, an owner-confirmed second recovery copy, independent reopen/verify, and visible `UNVERIFIED` on a cancelled/ambiguous download. A successfully tested fictional encrypt/decrypt does not prove any actual disk write or backup. Reset/refresh discards transient plaintext. Restore must authenticate fully before interpreting inner data, validate schema and original registry identity/revision, display a reviewable revision comparison and require explicit owner confirmation. Failure preserves current in-memory state. Rollback must not silently discard later approved decisions.

## Test-only crypto execution

`scripts/test-a24c-crypto-rehearsal.mjs` uses Node 24 Web Crypto, its standard crypto interoperability primitives and **invented fixture text only**; it has no filesystem, Network, browser Storage, React/Worker integration or exportable runtime module. The CI gate is `check:a24c-crypto`, added after inherited `check:a24c` without allocating Build124 or changing v0.19.45.

Test expectations: WebCrypto round-trip; independently decoded OpenSSL-backed Node PBKDF2/AES-GCM decryption with the same authenticated header; wrong passphrase; modified ciphertext; modified but well-typed header; malformed/extra/reordered/noncanonical header; unsupported algorithm/version; short nonce/salt and noncanonical encoding; ciphertext truncation/declared size mismatch; excessive KDF work/input size rejected pre-derivation; unique new salt/nonce for separate exports; no sensitive metadata in plaintext header; no plaintext fallback or durability claims. Log only fictional PASS labels/counts.

**Limitations:** Tests exercise Node's Web Crypto implementation, not browser File/Save As behavior, Firefox/Safari compatibility, actual Windows restore, recovery against real hardware loss, perfect password entropy, comprehensive side-channel analysis, password reset or independent external security audit. A later *separately authorized* C3 runtime/UI candidate must verify real browsers, full private payload normalization, size/performance and independent re-open/backup on synthetic files before an owner-only real-source trial.

**STOP:** Keep [Draft PR #254](https://github.com/shinobione/shinobiwan-studio/pull/254) unmerged pending independent review/approval. No Build124, STUDIO import/export buttons, real private encrypted file, Worker/R2/LaunchPAD write, cloud service or automatic sync is authorized by passing these tests.
