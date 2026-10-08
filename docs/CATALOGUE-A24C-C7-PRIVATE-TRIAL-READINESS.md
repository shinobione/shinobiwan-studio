# Catalogue A2.4-C / C7 — private-source trial readiness and owner decision gates

Updated: 2026-10-08. **PREPARATION ONLY · NO BUILD126 · NO ACTUAL PRIVATE-SOURCE EXECUTION OR EXPORT.**

## 1. Established baseline and bounded owner evidence

Production/merged baseline: **Build125 · v0.19.47**, [PR #262](https://github.com/shinobione/shinobiwan-studio/pull/262), merge \`ea52bfcdd02fc24ad8e0eafcb3445a65d652aed5\`. C4/C4.1, C5 and C5b synthetic architecture/tests were merged earlier. Build125's \`#/catalogue/lab\` remains **invented-only**: the encoder accepts only a hardcoded fixture variant, not an arbitrary registry or the owner's Catalogue source. Build125 is not a durable commercial system.

**Bounded owner C6 observation (screenshots/screen recordings in ChatGPT, not committed to Git):**

- Owner footer visually shows \`v0.19.47 · 125\`. The actual browser generate/download/open/review/approve flow shows 0→1 **only in memory**; exact re-open gives idempotent message.
- Observed invented counts: 1 Recording, 1 Release, 1 Appearance, 2 evidence (1 unlinked), 2 pending QA; no real entity creation.
- With current revision 1: reopening the invented revision-0 file yields \`Blocked fictional rollback\`; reopening the invented foreign-registry file yields \`Blocked foreign fictional registry\`, with current still at revision 1.
- Chrome DevTools **Network** after clearing its filter with **All** selected and **Keep log** checked: during observed local reopen, request list was empty. This is a **single-operation observation**, not a blanket zero-network guarantee for the whole application.
- **Session Storage** for the shared \`https://shinobione.github.io\` origin was empty in the screenshot. Local Storage held pre-existing-looking other application/project keys, with **no visibly identifiable C6 key**. IndexedDB and Cache Storage showed named stores belonging to other applications under the same GitHub Pages origin, with **no visibly C6-named database/cache**.
- **Critical limitation:** Chrome's origin-level allocation was nonzero. These screenshots are **not a measured clean before/after differential**. It is incorrect to say the whole origin's IndexedDB/Cache/localStorage is empty, or to attribute existing origin data to C6. Values in earlier Local Storage images could include private material and must **not be copied into this document**. Owner screenshots are not a cryptographic/security audit.

Therefore: **Build125 bounded owner UX/Network-observed smoke PASS; no identifiable C6 persistence in owner screenshots; independent storage-write attribution and production cryptographic review remain OPEN.** This acceptance never authorizes handling commercial source bytes.

## 2. Choose the next actual authority slice (two distinct gates)

### C7a — future private-source LOCAL PREVIEW ONLY

This is the appropriate **first real-source trial**, if separately authorized: the owner explicitly selects their already-local v2 JSON in their own browser. Only the accepted read-only source adapter is permitted; proposals and QA/coverage preview are transient memory. Display aggregate counts and exact unresolved-source classes locally without creating commercial IDs, writing an encrypted package or binding Studio creative Tracks.

- This requires an explicit owner authorization **naming the v2-only local preview** and an independently reviewed implementation plan. The historical Build123 read-only private viewer precedent is **not** consent to a new C7 source migration workflow.
- Use the original v2 source retained under owner's custody, not a repo, issue attachment, PR comment, cloud upload or CI artifact; never ask owner to paste/upload private source into this chat.
- Source snapshot data must remain inert until valid exact v2 contract + schema/coverage checks succeed. Only a privately reviewed alias map may be proposed; a match by title, ISRC/UPC, row position or similar is not authority.
- Preserve unbound Appearances, unlinked distributor evidence, global source evidence and all pending QA; show partial, omitted, contradictory and unverified section coverage. Historical distribution claims never become live DSP verification.
- Stop on invalid source, stale work generation, wrong registry identity, conflicting reviewed aliases, unexplained source/evidence count mismatch or unknown schema. No silent rewrite of source or existing registry.
- Any test observations sent back to the chat must be **aggregate counts and sanitized PASS/FAIL**, not source identifiers, titles, private hashes, screenshots of record bodies or secrets.
- Close/reset/refresh must discard source and proposed state. Network and Storage must be inspected using **before/after comparisons of C7 activity on the same origin** rather than mistakenly demanding a completely empty origin.

### C7b — future FIRST REAL ENCRYPTED EXPORT / RESTORE

**NOT AUTHORIZED BY C7a OR THIS DOCUMENT.** A separate explicit owner decision will be required *after* reviewing C7a evidence and unresolved QA/identity decisions. Before implementing any general production commercial encoder and executing the first real export, independently satisfy:

1. **Cryptographic design/security review** of the actual runtime implementation and parameters (including offline password-guessing exposure, KDF work bounds, random salt/nonce, authenticated minimal header, size limits, interoperability, tamper/failure behavior, and dependency/runtime threat model). Synthetic C2–C6 green tests are useful but not production security certification.
2. **Source authority and mapping approval:** exact provenance/coverage; owner-confirmed identity of the new registry; reviewed namespace/kind/source alias mapping, position and nullable Recording edge; nonlinked evidence and pending QA retained. No silent wholesale approval or canonical overwrite.
3. **Secret custody:** a **new**, strong owner-held passphrase not used as a test password; no stored password or recovery key in app/CI/cloud/logs, no promise of service password recovery. User understands loss of both passphrase and backup makes recovery impossible.
4. **Backups:** save encrypted output with an explicit owner file action (never overwrite the only original); reselect/reopen the **actual saved bytes** in a fresh state; produce and independently store another verified encrypted copy. Two ephemeral files in one CI runner do not count as off-device backup.
5. **State/revision safety:** authenticated registry/schema/alias/finding validation, explicit review before activation, expected-revision and current-fingerprint fencing, foreign/stale/rollback/conflict handling; cancellation, wrong password, incomplete download, interrupted crypto and refresh must preserve existing state.
6. **Confidentiality differential:** preserve pre-existing origin data; compare Local Storage, Session Storage, IndexedDB and Cache Storage **before vs after**, examine Network for new uploads or private identifiers and ensure no source/passphrase/metadata appears in URL, public Pages assets, console, analytics, Worker/R2, LaunchPAD or test logs.
7. **Independent owner acceptance:** scope-limited real-device browser smoke and demonstrated recovery from independently stored copy; no QA automatic adjudication, current DSP inference, creative Track binding, publication or bidirectional sync.

C7b requires its **own** candidate/version, implementation PR, explicit merge/deploy decision and explicit real-source trial authorization. No production persistence/write now exists.

## 3. C7 preflight gate output and hard stop

\`scripts/test-a24c-c7-private-trial-preflight.mjs\` is a **purely invented, test-only policy rehearsal**. It deliberately has no file picker, real JSON parser, crypto encoder, filesystem write or Cloudflare/LaunchPAD access. It checks that permissions are narrow, separate and fail closed. Passing its CI means only **the proposed decision model** is internally consistent.

- **C7a readiness** is denied unless the explicitly scoped future private preview permission, local-only source handling, accepted v2 parser contract, zero writes, human mapping authority, QA/coverage preservation and before/after origin privacy checks are all positively reviewed. An incomplete or unspecified value is STOP.
- **C7b readiness** also requires separately scoped permission for real encrypted export, independently reviewed production crypto, passphrase/recovery acceptance, verified actual saved-file reopen, independent backup custody and human-controlled revision activation. C7a alone never implies C7b.
- A result of \`READY_FOR_REVIEW\` from the **invented policy fixture** is still **not** approval or proof of actual user data handling; it permits a subsequent human review of a proposed implementation only.
- There is **no merge/deploy, Build126, runtime source change, owner source upload, actual private export, persistent registry, Worker/R2/LaunchPAD mutation or automatic Studio↔LaunchPAD sync** in C7 preflight.

## 4. Owner decision required later

Before moving beyond this preflight, ask the owner a **separate explicit permission question** for narrowly scoped C7a only:

> Do you authorize us to implement a local, read-only private v2 migration PREVIEW in a separately reviewed future candidate, with zero commercial writes/export and no cloud transmission? This does not authorize C7b encrypted export.

Do not infer this approval from a generic “go” to preparation, from Build123's previous view-only smoke, or from Build125's synthetic acceptance.

**Open external work:** Studio CPU #238 sustained performance still unproven; LaunchPAD #283 separately unresolved. Neither is altered by C7.
