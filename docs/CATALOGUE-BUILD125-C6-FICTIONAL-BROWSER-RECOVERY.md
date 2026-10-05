# Build125 / v0.19.47 — C6 full fictional commercial-registry browser recovery candidate

Date: 2026-10-05. Status: **DRAFT / NOT MERGED / SYNTHETIC ONLY / NO OWNER SOURCE**.

## Baseline and authorization boundary

Merged `main` is `1979f1d0b8252de768a3485b90e9af568a0e88bb`: Build124 / v0.19.46 plus the merged C4/C4.1 and C5/C5b **test contracts**. The owner explicitly authorized proceeding to C6 after those merges. C6 allocates **candidate Build125 / v0.19.47** for a real browser UX using only a hardcoded fictional full commercial registry. This does **not** authorize use of the owner's private Catalogue JSON, a general commercial encoder, durable production persistence, backend writes, LaunchPAD sync or merge/deploy.

## Runtime isolation

The existing `#/catalogue/lab` remains the only lab route. Entering it already unloads any selected private Catalogue source. C6 is mounted *inside* that isolated lab beneath the Build124 simple package rehearsal.

New `src/catalogue/fictionalRegistryLab.ts` can seal/open **only three hardcoded synthetic fixtures**:

1. `full`: invented registry `invented-registry-browser-c6`, revision 1, with 1 Recording, 1 Release, 1 Appearance, linked evidence, targetless unlinked historical evidence and two pending QA findings.
2. `rollback`: the same invented registry ID at revision 0 with empty commercial state.
3. `foreign`: the full invented fixture under a different invented registry ID.

The sealing API accepts only `(passphrase, variant)`; it has **no payload/source/registry argument**. Opening decrypts with WebCrypto and then accepts plaintext only when it is byte-for-byte equal to one of those three canonical fixture JSON strings. Therefore the runtime cannot encode or restore a user-selected Catalogue or arbitrary registry. No `fetch`, XMLHttpRequest, beacon, browser Storage, Worker/R2 or LaunchPAD path exists in this codec/component.

## Browser flow

`FictionalRegistryRecoveryLab` starts at transient revision 0, shows current synthetic counts, and offers:

- explicit passphrase entry;
- local generation of the full fictional revision-1 encrypted package;
- browser download with an invented filename;
- explicit file picker reopen using a re-entered passphrase;
- authenticated candidate summary **without activation**;
- separate `Approve fictional restore to revision 1` action;
- in-memory revision-1 state only after that explicit confirmation;
- same-revision idempotency;
- synthetic rollback and foreign-registry downloadable fixtures under an adversarial-test disclosure;
- Reset and refresh returning to revision 0.

Wrong secret, modified ciphertext/header, foreign/oversized input, rollback and foreign registry fail closed. The component never receives a Catalogue Snapshot prop and cannot reach the read-only private import session. Build124's simple fictional package flow remains present and must continue to pass unchanged.

## Security/privacy limitations

This is still a **fictional lab**, not a production cryptographic product. PBKDF2/AES-GCM choices are inherited from the synthetic C2–C5b rehearsal and are not represented as an external security audit. The current in-browser “restore” changes only React memory and is discarded on Reset/refresh. A downloaded synthetic file is not a real owner backup. No recovery service/backdoor exists.

The owner Build124 DevTools Network/Storage visual smoke remains separately pending. C6 automated browser tests re-check no local/session/IndexedDB/Cache persistence and no upload/private fixture content in requests, URLs or console, but that is not a substitute for the owner's live-browser privacy observation.

## Build125 exact CI gate

`scripts/test-build125-fictional-registry-browser.mjs` must run in actual Playwright Chromium against the Vite-mounted application and verify:

1. isolated C6 UI and revision-0 state;
2. explicit generation and actual browser download of full revision 1;
3. encrypted disk file has no fixture plaintext;
4. actual downloaded file picker reopen authenticates a candidate without changing current revision;
5. separate explicit restore changes only transient current state to revision 1;
6. exact replay is idempotent;
7. wrong passphrase and tampered ciphertext fail without state change;
8. real downloaded rollback fixture is blocked after revision 1;
9. real downloaded foreign fixture is rejected;
10. unrelated JSON and oversized file reject;
11. Reset revokes all C6 download URLs and returns revision 0;
12. refresh drops transient state and browser Storage stays empty;
13. no synthetic registry/plaintext upload, URL or console leak.

Full CI must also keep all inherited Build124, C4 25/25, C5 21/21, C5b 15/15, TypeScript/build and Catalogue artifact privacy guards green. `src/release.ts` and `package.json` allocate candidate **v0.19.47 / Build125**; Build124 is frozen via an ancestry marker.

## STOP

No automatic merge or deployment. No real source/workbook/title/ISRC/UPC/evidence/secret in Git or CI. No general commercial package codec, persistent browser registry, File System Access writer, Worker/R2/LaunchPAD mutation, current DSP verification or automatic sync. Any later C7 owner-private dry-run requires a new explicit approval after exact-head CI, deployed Build125 owner smoke and the still-pending DevTools privacy check.
