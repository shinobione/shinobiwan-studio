# Build125 / v0.19.47 — bounded owner browser C6 smoke and privacy observations

Owner observation: 2026-10-08. **Status: FUNCTIONAL OWNER PASS; limited per-operation privacy observation PASS; whole-origin storage non-attribution UNPROVEN.**

## Release chain and fixture-only scope

Merged [PR #262](https://github.com/shinobione/shinobiwan-studio/pull/262) at \`ea52bfcdd02fc24ad8e0eafcb3445a65d652aed5\`. Candidate exact head \`0e221d16050c3337fdee44ee662a364b04aa52ed\`; [Actions #850](https://github.com/shinobione/shinobiwan-studio/actions/runs/37302953440) SUCCESS with C4 25/25, C5 21/21, C5b 15/15, Build125 C6 13/13 Chromium and 144 runtime source/build artifacts scanned. Post-merge Pages success was separately verified in owner conversation. Owner screenshot footer: \`v0.19.47 · 125\`.

The C6 \`#/catalogue/lab\` codec encrypts **only three hardcoded invented canonical fixtures** (full revision-1, revision-0 rollback, foreign registry), not any owner-selected Catalogue, arbitrary registry or true commercial source. A browser download is not proof of independent durable backup.

## User-visible C6 functional evidence

Screenshots/video supplied to ChatGPT showed:

- Invented full registry generated, downloaded as a local file, explicitly re-opened and authenticated. Separate user approval changes **only the in-memory** current state from revision 0 to revision 1.
- Current revision 1 displays exactly 1 Recording, 1 Release, 1 Appearance, 2 evidence rows, of which 1 unlinked, and 2 pending QA findings. These counts are **fictional fixture counts**, not owner commercial counts.
- Re-opening the same authenticated revision produced the idempotent copy: \`Candidate authenticated. Same verified fictional revision; no restore needed.\`
- Reopening authenticated revision 0 while current was revision 1 displayed: \`Blocked fictional rollback: revision 0 is older than current revision 1.\` Current revision remained 1.
- Reopening the invented foreign-registry file displayed: \`Blocked foreign fictional registry.\` Current revision remained 1.
- Reset/reload disposal was covered by the automated browser test; do not overstate the owner screenshot scope.

**FUNCTIONAL OWNER SMOKE PASS** for these explicitly observed actions. This is **not** real-source registry migration, owner commercial persistence, creative Track matching or current DSP publication verification.

## Chrome DevTools privacy observation — exact limits

- Network: owner cleared an initially active path filter, selected **All**, enabled **Keep log**, and re-opened the invented revision-1 file while revision-1 current was active. The network panel showed **no requests during that observed operation**. This supports *no observed upload on that specific re-open*, not general app-wide absence of network requests.
- Application / Session Storage: owner selected the shared \`https://shinobione.github.io\` origin and the table had **zero session keys**.
- Application / Local Storage: nonempty origin-level keys belonging to other applications/projects were visible; **none visibly named the C6 lab**. Some values may be private; **no values, screenshots or names of private records are copied into this repository**.
- IndexedDB: several named origin-level databases were visible for other applications, none clearly C6-specific.
- Cache Storage: several named caches for other applications were visible, none clearly C6-specific.
- Chrome's origin-level storage allocation was nonzero (not attributed to Build125), and there was **no controlled before/after snapshot of storage keys/bytes around C6's operation**. An empty whole-origin storage assertion would be false. No independent Chrome profiler, forensic disk analysis or third-party security audit was run.

**Bounded privacy observation PASS** (no requests in observed reopen; no clearly C6-named storage observed). **Whole-origin C6 no-write proof remains NOT ESTABLISHED** from owner screenshots alone. The isolated automated C6 Chromium tests do assert empty storage in their own clean context, which does not substitute for differential owner-side production testing.

## Remaining gates for future C7

- Owner-private C7a migration preview requires **separate explicit consent** and a reviewed owner-local-only read-only implementation. Build123's accepted real v2 view and this Build125 invented lab do not confer a general migration right.
- Future C7b real encrypted export/restore requires **another distinct approval** plus production cryptographic review, exact mapping authority, actual saved-byte reopen and independently held backup, secret custody, expected-revision conflict gates, and owner-specific network/storage differential before/after.
- No C7a/C7b or Build126 automatically follows from this receipt. No source or screenshots are committed.

This sanitized acceptance note records **the evidence's limit**; it is not an authorization to process user private materials.
