# Build124 / v0.19.46 — A2.4-C Path A C3b fictional-only Save As/Open candidate

Date: 2026-09-28. **DRAFT / NOT MERGED / NOT DEPLOYED / NOT REAL USER PASS.** Owner authorized a bounded next *fictional only* browser file download and re-open slice after C3a. Parent Draft [PR #254](https://github.com/shinobione/shinobiwan-studio/pull/254) includes preceding Build123 owner receipt, C1/C2/C3a design and tests. Accepted real production remains **Build123 / v0.19.45** on main at `bfcad4b2c75b72bf02c316b9f1096141dab05957`. No real source may be tested in this lab.

## Candidate code and isolation

- `src/release.ts` plus `package.json` allocate *candidate* v0.19.46 / Build124 with `check:build124`, preserving the Build123 historical ancestry test. CI must verify exact final head.
- Strict new `#/catalogue/lab` subroute with visible **Fictional package lab** navigation, explicitly disconnected from CatalogueImport and its Snapshot; entering it immediately resets any previously selected real source. Existing v1/v2 read-only import is unchanged.
- `fictionalPackageLab.ts` has one immutable invented payload hardcoded internally. `sealFictionalPackage(passphrase)` **does not accept a Snapshot/file/contents argument**. `openFictionalPackage(raw,passphrase)` returns only success or a generic error and authenticates/decrypts only to check equality with the exact invented fixture. It never yields a commercial entity, payload, Track or registry. No fetch, Worker, R2, LaunchPAD, Storage, source hash or sync.
- The candidate v1 synthetic-only envelope has the C2 strict format and browser-native PBKDF2-HMAC-SHA-256 (600,000 iterations), AES-256-GCM (fresh 16-byte salt + 12-byte nonce), authenticated header, 128-bit tag, strict canonical JSON and a 64 KiB lab file ceiling. This is **not** a production security-audited general-purpose Catalogue codec.
- The user explicitly enters a test passphrase to generate the invented sealed content; a temporary Blob URL enables an explicit browser `download` with a conspicuously fictitious name. No automatic file writes. Download-ready does **not** claim saved/verified; after downloading the user re-enters the passphrase and selects the file through an independent file picker. Successful authentication returns only `Verified fictional package. No commercial Catalogue data changed.` Wrong key, corrupted content, unsupported version, unknown source and unauthenticated header fail closed. Reset/unmount revokes Blob URL and discards input, transient state and verification.
- The fully public UI is labeled fictional-only and warns not to select actual Catalogue sources. Real owner source must still be used exclusively with the accepted Build123 memory-only reader.

## Exact CI gate and requested owner smoke (only if subsequently merged and Pages verified)

`scripts/test-build124-fictional-package-lab.mjs` uses invented v1 source fixture, real Vite-mounted Studio and Playwright Chromium, a real browser download saved in disposable CI directory, independent Node PBKDF2/AES-GCM cross-decryption of the downloaded file and `setInputFiles` of that **exact disk file**, not a fabricated in-memory File. Cases:

1. Direct lab route presents only invented package controls, no private importer.
2. Explicit generate enables download and clears entered passphrase; does not claim persistent backup.
3. Browser emits a real download; CI can save the fictional encrypted bytes to disposable disk.
4. Independent Node cryptography decodes exact downloaded content and checks invented fixture.
5. Re-entered passphrase plus disk file selection verifies via real UI and clears the passphrase/picker.
6. Wrong passphrase clears previous success, no sensitive data exposure.
7. Tampered ciphertext and authenticated header fail closed.
8. Foreign file and excessive KDF cost fail with no source promotion.
9. Reset revokes temporary download link and clears transient state.
10. Refresh and leave/re-enter clear lab state.
11. Separate invented v1 Catalogue import is discarded on entry to the lab and not restored on return.
12. No commercial POST/upload, Storage/IndexedDB/Cache use or fictional plaintext in URL/console/request; inherited tests and source/build privacy scan remain mandatory.

If Pages ever deploys this candidate after separate merge approval, owner smoke must use **only the independent fictional generated file**, ideally verify a disk copy and reopening under their browser. Password strength/owner recovery and real-source integration are **not** part of Build124 acceptance.

## Limits and next decision

This candidate tests a downloadable fictional file and practical UI isolation; it does not accept the actual private v2 exporter, migrate original ten-sheet data, make a durable commercial registry, approve 355 QA findings, link real creative Tracks, verify DSP availability, prove two independent physical backups, implement password recovery or deliver a secure audited production package. Further C4 needs a separately approved private payload/identity model, encryption/key-custody and backup/recovery threat audit, synthetic restore/conflict tests and explicit owner-source trial. Studio CPU #238 and LaunchPAD #283 remain open.

**STOP:** no automatic PR merge, Pages/Worker/R2 deployment, actual user-data file creation, backend write, LaunchPAD changes, or public projection. `check:build124` and exact tested head must be green before even proposing a merge.
