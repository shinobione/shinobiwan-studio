# A2.4-C/A · C3a actual Chromium fictional Web Crypto / File API rehearsal

Date: 2026-09-28. **CANDIDATE / TEST HARNESS ONLY / NOT A STUDIO FEATURE.** The owner permitted progressing beyond the C2 invented-byte Node Web Crypto rehearsal to an actual browser-only check. This does **not** approve Build124, private commercial source upload/write/encryption, local real Catalogue file generation, a browser download feature, Pages deploy or GitHub merge. See [C1](CATALOGUE-A2-4C-A-LOCAL-PACKAGE-C1-CONTRACT.md) and [C2](CATALOGUE-A2-4C-A-C2-CRYPTO-FORMAT-REHEARSAL.md).

## Exactly what is tested

The CI-only `scripts/test-a24c-browser-rehearsal.mjs` starts the existing Vite app server on ephemeral localhost and Playwright Chromium in a secure context. It executes independently invented package-format routines *inside an isolated `page.evaluate` closure*, **not** imported by `src/`, rendered by Studio, loaded into the Catalogue Worker, integrated with source import or published as a real export/open button.

The test creates an **in-memory fictional `File` object** from an encrypted invented payload, reads the bytes via browser `File.text()`, rederives a non-extractable AES-256-GCM key from an invented passphrase (PBKDF2 SHA-256, 600,000 iterations), authenticates the minimal canonical header as AAD, and opens it. The reverse cross-implementation proof decrypts the browser-produced invented ciphertext with Node/OpenSSL-backed PBKDF2 and AES-GCM. The independent C2 Node suite already runs the corresponding implementation-side checks.

Checks: secure browser Web Crypto; fictional `File` read and roundtrip; wrong invented passphrase; modified ciphertext and authenticated header fail; separate salt/nonce per explicit encryption; unknown/extra/duplicate JSON fields rejected; size/KDF ceiling and truncation rejected before expensive decryption; no plaintext source metadata in public header; independent Node decryption; refresh clears browser state; no browser local/session/IndexedDB/Cache retention, external requests, upload, URL/console leakage or page error for the tested fictional flow. All log labels and payload data are invented.

## What is NOT proved / future C3b gate

A `new File([...])` in a browser test is **not** an actual user-chosen file, Save As, disk persistence, second backup or recoverable download. The browser-only closure is not the Studio runtime importer/exporter, nor a production cipher implementation or security audit. CI currently installs Chromium only; Firefox/Safari, mobile and actual user Windows CPU/memory for PBKDF2 remain untested. No first real commercial `Registry` migration/identity approval occurs. No source workbook, v1/v2 JSON or owner secret enters CI or Git.

**C3b, separately authorized later:** scope a production-only-after-review package codec + real but fictional-file Save As/open UI with independent file reread and recovery-copy tests; preserve v1/v2 session-only lifetime and source privacy by default. Specify key custody, passphrase strength/recovery instructions, inner authenticated versioned registry schema, real-device benchmark, fail-closed loss/cancel/foreign-registry/rollback behavior, and explicit owner private-data smoke. Allocate Build124 and its release/test guard only at the start of that separately approved runtime slice. No generic Worker/R2/LaunchPAD commercial writer or auto-sync.

**STOP:** The PR containing C1/C2/C3a remains Draft and unmerged. Runtime Build123 / v0.19.45 remains exactly unchanged.
