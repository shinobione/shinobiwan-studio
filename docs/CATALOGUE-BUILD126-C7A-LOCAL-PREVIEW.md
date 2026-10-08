# Build126 / v0.19.48 — C7a owner-local v2 commercial migration PREFLIGHT (candidate)

Updated: 2026-10-08. **DRAFT / NOT MERGED OR DEPLOYED / NO REAL SOURCE EXECUTED IN DEVELOPMENT.**

## Explicit permission and boundary

The owner explicitly authorized **development of a separate local read-only C7a private-v2 migration preview**, and explicitly did **not** authorize running an owner-source trial as part of development. C7b general-purpose real encrypted commercial export/restore remains unauthorized. Build125 / v0.19.47, merged at \`ea52bfcdd02fc24ad8e0eafcb3445a65d652aed5\`, is the production baseline. The docs/test C7 preparatory gates merged in #263, \`ca2994926e00291ca681853ab86b41395402e032\`.

No original workbook, owner-private JSON, title, ISRC/UPC, source alias/ID, evidence body, hash, passphrase or private browser screenshot is checked into Git or used in CI. All tests use independently invented fixtures. This candidate allocates **Build126 v0.19.48** for review only, with a new exact route \`#/catalogue/migration-preview\`. It does not authorize merge/deployment or owner-source execution.

## UX and isolation

The new nav link **Local migration preflight** routes to a separately mounted \`CatalogueMigrationPreview\` component. Entering that route resets the existing imported Catalogue session, just like entering the fictional lab. The C7a component creates and destroys its **own worker** on mount/unmount. No existing Catalogue Snapshot, C6 fixture package, private registry, creative Track, stored source or Worker/R2/LaunchPAD state is passed into it.

The owner-local file picker accepts \`.json\` **v2-only** files, at most 10 MiB. \`c7a-preview.worker.ts\` rejects empty/wrong extension/oversized/unreadable/non-v2 files, hashes the exact selected local bytes within the worker, then calls the **existing accepted \`parseCatalogueInput\`** from \`src/catalogue/import-v2.ts\`. On a rejected parse, the UI gets a **fixed error code only**, never a source row/ID/filename/hash/locator. On success the worker converts the snapshot to one **aggregate-only** report, then the session **terminates the worker**, abandoning the detailed parser state and input.

No payload returns to the React component except numeric counts and a static accepted/rejected status. There is no source-data display, raw evidence viewer, source digest, title list, ID list, source filename preview, manual target-ID editor or Save/Restore/Export button. The source's own \`sectionCoverage\` is counted by status (represented/partial/omitted/contradictory/unverified) *after* the exact v2 parser accepts the source. The workbook digest remains **claim-only**.

## What a structurally accepted preflight actually shows

- Recordings, Releases, bound+unbound source Appearances, source evidence, linked and unlinked detailed distributor observations.
- Pending QA findings and the total number of source identities that would require explicit **human mapping review**. This number is not an automatically mapped commercial identity count.
- Original v2 coverage count by state, without silently completing partial/omitted sections.
- A prominent **Migration status: HOLD — human mappings required**. Inferred commercial IDs, new commercial entities, writes and uploads remain hardcoded **zero**.
- Historical distribution does not become current DSP live status; no ISRC/title/UPC/row-order matching creates a new commercial or creative identity.

This is an **aggregate structural readiness view**, *not* a C5 human-reviewed mapping or approved migration proposal. Until an independently owner-chosen commercial registry ID/revision, exact alias/mapping packet and QA/coverage acknowledgement exist, all entity mapping remains HOLD. The C4/C5b CI-only registry materializer is not imported into runtime.

## Lifecycle and security

Each selection cancels and terminates the previous worker. Async results are protected by an exact generation token; Reset, route exit/unmount and \`pagehide\` discard session state. Refresh starts empty. File picker value is immediately cleared after selection. No File System Access writes, Blob download, localStorage/sessionStorage/IndexedDB/Cache writing, network fetch/XHR/beacon, analytics/logging of source values, GitHub/Worker/R2/LaunchPAD mutation or auto import/promotion. Existing shared-origin browser storage belongs to other applications and is never cleared by C7a.

This is an owner-triggered local processing feature in a web browser, **not** an isolation boundary against a malicious browser extension or compromised device. Static JS/worker asset GET requests can occur normally. Real owner privacy smoke must inspect Network for uploads and compare storage **before/after** rather than assuming a shared origin has no existing data.

## Exact candidate CI and owner gates

\`scripts/test-build126-c7a-migration-preview.mjs\` exercises actual Vite+Chromium/worker on **invented v2** and asserts:

1. isolated route empty before selection, no inherited source;
2. exact accepted v2, linked/unlinked detail, pending QA and zero commercial creation;
3. exact 10-section status coverage and claim-only workbook digest;
4. invalid v2 replacement clears previous accepted report;
5. v1-only rejected, even though old read-only viewer can separately accept it;
6. malformed/wrong-extension/empty/oversized files reject with fixed non-sensitive copy;
7. Reset purges aggregates;
8. leaving for fictional lab and returning does not retain source;
9. refresh purges preview;
10. clean isolated-browser Storage empty and no private fixture upload/URL/console leaks.

The additional `scripts/test-build126-c7a-session-fences.mjs` runs 7 deterministic mocked-worker cases: replacement cancels old callbacks, Reset/dispose fence late results, wrong-size/extension files never start workers, and parser error returns only a fixed rejection. Inherited Build125 C6 real browser, C4/C5/C5b, C7 preflight 16/16, typecheck, build and private-runtime artifact scan must remain green. Candidate **Build126 / v0.19.48** follows release policy; Build125 frozen ancestry ensures its old tests stay meaningful.

Before any owner-private input to this candidate: **separate authorization to execute the actual C7a private-source trial**, deployed build/version confirmation, exact-head CI, review of this PR, and planned privacy differential. **Do not submit owner JSON in chat, Git, CI or support artifacts.** The owner keeps the file on their own computer and shares only sanitized counts and test PASS/FAIL.

## STOP

Draft only. No PR auto-merge, Build126 deploy, actual user-source test, reviewed commercial identity creation, real encrypted export/backup, crypto production approval, persistent registry, browser storage or sync. C7b requires a completely separate explicit owner permission and future implementation review.
