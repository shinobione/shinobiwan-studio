# A2.4-C / C5b — end-to-end fictional registry materialization, encrypted disk save and restore

Date: 2026-10-05. **STACKED DRAFT / SYNTHETIC FILES ONLY / NO BUILD125 / NO OWNER SOURCE.**

## Dependency and objective

This branch starts from the current C4 test-contract head and carries the reviewed C5 source-v2 migration planner. C5b closes the next **synthetic** gap only: take an independently invented accepted v2 source, require the C5 human-review packet, materialize a complete C4 \`shinocat-commercial-registry-v1\`, validate it with the exact C4 schema, encrypt it with the exact C4 test-only package helper, write the encrypted bytes to **disposable CI disk files**, independently reopen/decrypt/validate those files, and exercise restore comparison against an empty same-registry revision.

This is the first test slice to join source-v2 → reviewed plan → full private-registry object → authenticated ciphertext → actual temporary file bytes → authenticated reopen/restore preview. It is **not** a production encoder, owner backup, browser feature, private migration, disaster-recovery proof or permission to handle the user's real Catalogue.

## Exact authority boundaries

- **Actual accepted parser:** C5b calls the same \`src/catalogue/import-v2.ts\` adapter through the C5 test-contract helper. The input fixture is independently invented; no copied private title, ID, ISRC/UPC, evidence, path or digest appears.
- **Actual draft C4 contract:** C5b imports C4's exported test-only \`validateC4Registry\`, \`sealC4Registry\`, \`openC4Registry\`, \`fingerprintC4Registry\` and \`previewC4Comparison\` under the explicit library-only environment guard. No \`src/\` runtime imports these helpers.
- **Reviewed aliases only:** Recording, Release and Appearance IDs in the materialized registry come solely from the C5 review packet. Titles, ISRC/UPC and row order remain descriptive metadata, never identity.
- **Source snapshots:** one selected v2 file may expose several source namespaces. C5b creates a private immutable source-snapshot record for each reviewed namespace plus one file-level source namespace for parser-wide evidence/findings. They share the exact selected-input digest while retaining the original claimed workbook digest as \`claim-only\`; no original workbook-byte verification is invented.
- **Evidence:** ordinary parser evidence is preserved as linked or unattached private evidence. v2 distributor-detail evidence uses its exact source row alias, source locator, source Release/position and original evidence payload. A C4.1 unlinked detail remains targetless and receives/retains a pending evidence-scoped finding. No entity/source alias/channel/review is created from that row.
- **QA:** every accepted parser finding remains pending. A finding with linked evidence may target the reviewed entity; an unattached/unlinked finding is evidence-scoped; parser-wide findings are source-scoped. C5b does not auto-resolve QA.
- **Channels:** C5b creates **zero channelEvents** from source distribution strings. Historical distribution wording remains private Release metadata; “submitted/delivered” is not converted into a platform verified-live assertion.
- **Review/audit:** the initial synthetic materialization carries the reviewed source aliases and a private audit receipt for the fictional migration operation. It does not fabricate per-entity review evidence when the current C4 decision schema cannot prove one.

## End-to-end temporary file rehearsal

The test uses a disposable OS temp directory. It produces **two independently encrypted copies** of the same invented registry with fresh salt/nonce, writes each with \`fs.writeFileSync\`, closes that write path, then reads the actual bytes back from disk and passes them through C4 authenticated open/validation. Expected properties:

1. both disk files are ciphertext envelopes and contain no invented plaintext title/source/evidence payload;
2. ciphertext, salt and nonce differ while authenticated inner registry fingerprint is identical;
3. exact source snapshot/coverage, reviewed aliases, Recording/Release/Appearance counts, linked detail, targetless detail and pending QA survive byte-for-byte semantic reopen;
4. wrong secret, ciphertext/header corruption and truncated disk bytes fail without returning registry state;
5. an empty revision-0 registry with the same private registry ID sees the authenticated revision-1 file as **requires explicit owner review**, never auto-activation;
6. exact revision-1 replay is idempotent, a foreign registry is rejected and an authentic older revision is blocked as rollback;
7. deleting or modifying one temp copy does not mutate the other; the test cleanup always removes the disposable directory.

**Two CI temp files are not two independent owner backups.** They share one CI machine/lifetime and are destroyed at the end. A production recovery gate still requires owner-chosen storage locations, actual durable close/reopen, an independently stored second copy, passphrase/recovery policy and failure drills.

## No hidden promotion

The materializer is a standalone test function in \`scripts/test-a24c-c5b-e2e-registry-file.mjs\`. It cannot be called from Studio. There is no button, browser download, File System Access, IndexedDB/localStorage, Worker/R2, LaunchPAD, public API or background sync. Package/release remains **v0.19.46 · Build124**.

Before any future C6/Build125 proposal, still required: merge/accept C4 and C5 architecture in order; explicit approval of the exact inner registry/source migration semantics; finish the pending Build124 owner DevTools Network/Storage smoke; owner passphrase/backup policy; real-browser synthetic full-registry UX; and a separately authorized owner-only private-source dry-run that never sends source data to Git/CI.

**STOP:** C5b CI success is evidence for the fictional end-to-end contract only. No merge, deploy, Build125 allocation, real commercial minting, real encrypted export, user file handling or cross-system mutation is authorized automatically.
