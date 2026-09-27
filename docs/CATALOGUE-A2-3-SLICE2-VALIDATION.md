# Build121 / v0.19.43 — Catalogue A2.3 Slice 2 handoff

Date: 2026-09-27. **Candidate only: no merge, deployment or REAL USER PASS.**

## Starting point and authorized boundary

Repository `shinobione/shinobiwan-studio`, production `main`, fetched/verified `72151c00c5a89cae2bf5e73a6fb98f9ba9c5d90a`. Docs-only #245 and [Pages 36322272124](https://github.com/shinobione/shinobiwan-studio/actions/runs/36322272124) SUCCESS. Runtime remains accepted Build120 / v0.19.42; [bounded owner receipt](acceptance/BUILD120-REAL-USER-PASS.md). Previous A2.2, Build120 and CPU branches/worktrees were preserved; the initial checkout was clean.

Dedicated branch `codex/catalogue-a23-slice2-build121-20260927`. Scope follows the latest owner Slice 2 kickoff in [issue #235](https://github.com/shinobione/shinobiwan-studio/issues/235) and narrows the [blueprint](CATALOGUE-A2-3-BLUEPRINT.md) to native Releases gallery/detail. Delivery is commit/push, Draft PR, exact-head CI and this handoff. Stop before merge/Pages deployment.

## Implementation

- Native grid/list cards, search over title/UPC/source/distributor, kind/source/UPC-presence filters, identity/title/reference-date sorts. Separate source identities survive duplicate titles and UPC values. Ties use exact identity ordering. Chronological sorting includes only valid complete YYYY-MM-DD dates; other source reference text stays visible and follows dated entries.
- Deliberate labeled cover placeholders. Source `coverUrl` remains inert text in escaped, on-demand evidence; no artwork retrieval, upload, generation or inferred genre.
- Native modal Release detail, keyed by exact branded release ID in component state. Close/Escape restore the opener; browser section navigation removes detail; refresh never reloads it. Selection is bound to the current snapshot reference and is discarded on replacement/reset/rejection/pagehide/parent unmount. Reset also restores picker focus after removal of an open dialog.
- Metadata includes kind, source/distributor, optional UPC, explicitly historical reference date and source distribution observation. Per-channel availability remains unknown; historical evidence is disclosed separately. No assumption of creative Album membership, Studio binding, pitch or verified platform delivery.
- Exact appearance ordering (known positions first, unknown positions after), linked Recording title/ISRC through exact references, private evidence and related pending findings. Missing release, evidence or Recording references fail closed. No full Recording explorer is introduced.

## Explicit data-model gap resolution

Before Build121, `Snapshot.appearances` contained only bound appearances and `summary.unboundAppearances` was a global count. Unbound raw rows survived only in `evidence`.

After all existing strict/atomic validation succeeds, the parser now emits a separate readonly `unboundAppearances` array. Each entry preserves branded appearance/release identity, nullable position/title, original observed ISRC text, exact evidence ID, `recordingId: null` and unverified status. Existing bound appearances and global summary semantics remain intact. Source and historical distribution observation are additive release projections from the same validated row. Source input schema, unknown-field rejection, referential validation, duplicate-position rejection, size bounds, all original evidence and findings are unchanged.

The read model indexes releases, Recordings, all appearances, evidence, channels and finding evidence IDs. It never joins by sorted array index or title. Tests deliberately shuffle source releases and prove per-release membership/provenance. Contextual findings include only relationships explicitly represented by release/appearance/bound-Recording evidence; the full QA view remains available for other source cases.

## Validation evidence

[Draft PR #246](https://github.com/shinobione/shinobiwan-studio/pull/246), implementation head `2d0eacdf78d21c82353aa6fb557a73723e0c9b45`: [CI 36323849563](https://github.com/shinobione/shinobiwan-studio/actions/runs/36323849563) SUCCESS. Its logs confirm inherited gates, Build120's 12 Chromium scenarios, Build121's nine Chromium scenarios, full build and the 133-file artifact/privacy scan. The PR receipt must also confirm CI on the final documentation head before delivery; neither result authorizes merge or deployment.

| Gate | Local result |
| --- | --- |
| Full `npm run build` | PASS, all inherited gates |
| Release metadata and TypeScript | PASS, Build121 / v0.19.43 |
| Build118 foundation / lean Albums / CPU slice 4 | PASS |
| Build119 | PASS, all 55 synthetic cases |
| Build120 | PASS, all 12 real Chromium scenarios |
| Build121 | PASS, projection/fallback contracts + nine real Chromium scenarios |
| Artifact/privacy guard | PASS, 133 source/build files including maps |
| Diff whitespace check | PASS |

Build121 covers empty/one/multiple releases, duplicate titles/UPC, exact per-release bound/unbound counts and ordering, original provenance, source search/combined filters/stable sorts, missing references/evidence, unknown publication, escaped malicious-looking source text, native modal keyboard containment/Escape/close focus, grid/list at 320/390/1280/2560px, reduced motion, shared Overview/QA navigation/counts, reset/replace/reject/pagehide/refresh/unmount and no source/search/selection in URL, requests, logs or browser storage. Existing Build120 controlled late-Worker scenarios remain in the full build.

Actual App/StrictMode and local parser Worker are exercised in Chromium. External service requests are intercepted before navigation. All fixtures are independently fictional; no private V5 read, fixture, upload or commit. Local screenshots/logs are ignored under `node_modules/.cache/build121/`. Existing development-only Playwright is reused; no new dependency or workflow change. Windows Vite/Chromium execution used the previously required narrowly approved unsandboxed local runner. The inherited Vite large-chunk warning remains; this is not production CPU or owner visual evidence.

## Owner acceptance after separate authorization

1. Review the bounded Draft diff and exact-head CI. Authorize merge and Pages separately; confirm deployed SHA before owner smoke.
2. Select the private source locally and open Releases. Compare distinct source release counts, metadata and reference-date wording. Repeated titles/UPCs must remain separate. Cover placeholders must be truthful even when raw source evidence contains a URL.
3. Exercise grid/list, title/UPC/source/distributor search, kind/source/UPC filters, no-match clearing and all sorts. Compare actual source facts rather than historical fixed totals.
4. Open a release with documented appearances. Compare exact positions, linked Recording titles/ISRC and unbound positions against source evidence. Unbound titles or ISRC observations must never create a Recording link. Review unknown position wording and releases with no appearance rows.
5. Inspect source/distributor, reference date, historical channel evidence, unknown current availability, pending findings and escaped original evidence. Retain the incomplete-workbook caveat; no automated reconciliation or publication proof is established.
6. Use keyboard to open the detail, Tab/Shift+Tab within it, Escape and Close; verify opener focus. Close and reset/unload, replace with valid/rejected JSON, navigate across Catalogue/QA, leave Catalogue, then refresh. Snapshot continuity and discard rules must remain correct; detail must never resurrect.
7. Inspect 320/390px mobile, desktop and ultrawide layout, reduced motion and the owner's target browser/assistive technology. Agent synthetic screenshots are not owner acceptance.
8. Inspect DevTools Network/Storage and URLs during search/detail/evidence/navigation: no private upload, artwork fetch, source identifiers in routes or persistent private snapshot. Confirm inherited creative Tracks/Albums behavior.

No commercial writes, persistence/sync, automatic identity reconciliation, DSP mutations, R2/Cloudflare Worker/backend, LaunchPAD or Blackhole changes. The local bundled parser's additive in-memory projection is the only normalization extension. Recording explorer and artwork mapping remain future slices. If separately deployed and rejected, revert the bounded Build121 PR; do not compensate with private-source or production-data mutations.
