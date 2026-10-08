# C7a — first owner-local v2 migration readiness preview candidate

Updated 2026-10-08. **Explicit implementation authorization granted for C7a only**; no owner-private execution, first commercial encrypted export, or C7b authorized.

## Scope

This candidate adds a **pure, read-only aggregate readiness view** to the existing private v2 importer in the Catalogue Overview. It uses the exact already-accepted local file selection, worker parser and transient Catalogue session. It introduces no independent file picker or external data path. The view appears only when an accepted `catalogue-readonly-seed-v2` snapshot carries v2 enrichment and zero rejected rows. v1/unsupported/rejected sources cannot enter the C7a panel.

The aggregate panel displays existing source Recording/Release/Appearance counts, unbound appearances, independent evidence, linked/unlinked historical details, pending QA, partial/omitted source sections, and explicit **0 automatic mappings / 0 commercial writes**. Every mapping still needs an independently reviewed source namespace/kind/ID packet. Titles/ISRC/UPC and release order do not establish identity; historical distribution does not establish current DSP availability.

This is a **preflight only**, not a full reviewed mapping proposal. It does not allocate opaque commercial IDs, compare source aliases to an owner-held commercial registry, approve pending findings, validate the original workbook bytes, encrypt/save any commercial source or promise recovery. All of those remain separate future gates. The existing read-only reader behavior/Reset/navigation lifecycle is retained.

## Test boundary

`scripts/test-c7a-v2-readonly-preview.mjs` uses an **invented in-memory source-shaped object**, never the owner's source. It checks the v2-only entry, preserved counts, unlinked evidence/pending QA, source coverage, zero commercial writes/mappings, blocked v1 and rejected input, nonmutating repeats, and no network/storage/crypto/file-write API in the new pure adapter. Full inherited CI must remain green.

**No Build126 allocated**: runtime still reports `Build125 · v0.19.47` while this is an unmerged candidate. The user must approve future candidate merge/deployment separately. Actual testing with a private v2 file requires another explicit owner instruction and an appropriate before/after privacy smoke on the shared GitHub Pages origin.

## STOP

No actual owner file processed in development or CI, no commercial registry minting, durable encryption/export, Studio Track auto-binding, publication verification, Worker/R2/LaunchPAD mutation, public projection or bidirectional sync. C7b remains unauthorized.
