# Build120 / v0.19.42 — A2.3 Slice 1 implementation and acceptance handoff

Date: 2026-09-27. Candidate only; **no merge, deployment or REAL USER PASS**.

## Verified starting point and stop line

- Repository `shinobione/shinobiwan-studio`, production branch `main`.
- Fetched baseline `cba3fb35fec57edd307500f1a76474e48089efa4`; docs-only #243 and [Pages 36317610337](https://github.com/shinobione/shinobiwan-studio/actions/runs/36317610337) SUCCESS.
- Accepted runtime remains Build119 / v0.19.41, [bounded owner receipt](acceptance/BUILD119-REAL-USER-PASS.md). CPU incidents remain open and independent.
- New branch `codex/catalogue-a23-slice1-build120-20260927`; prior clean A2.2 branch and CPU worktree preserved. No other repository changed.
- Scope: latest implementation comment in [issue #235](https://github.com/shinobione/shinobiwan-studio/issues/235), narrowing the [blueprint](CATALOGUE-A2-3-BLUEPRINT.md) to session ownership + Overview. Deliver Draft PR and exact-head CI only.

Candidate delivery: [Draft PR #244](https://github.com/shinobione/shinobiwan-studio/pull/244). Its head SHA and checks are the exact CI authority; the PR body records the final result after completion. No merge/deployment is authorized.

## Lifecycle audit and implementation

Before: App holds the coarse `catalogue` route; CommercialCatalogue subscribes to subroute hash changes. CatalogueImport held its own session. Ordinary four-section navigation reused the same child, but invalid/detail routes removed that child and disposed its snapshot. Inherited tests used hook harnesses rather than the mounted App.

After: CommercialCatalogue calls `useCatalogueSession` once for its mounted lifetime. CatalogueImport is a controlled consumer. Normal and invalid Catalogue subroutes retain the accepted snapshot and pending import; leaving Catalogue disposes the session. Browser refresh creates an empty owner; pagehide also resets before back/forward caching. Reset restores keyboard focus to file selection. Replacement immediately drops the previous snapshot, including when validation rejects. The original parser, Worker and generation-fenced session engine are unchanged.

Overview memoizes a pure projection from the current accepted Snapshot. Counts cover Recordings, Commercial Releases, source appearances (bound plus unbound), known/missing-invalid ISRC and pending findings. Source date is historical, with explicit private/temporary status. Every code/severity group is counted; review buttons open QA with a component-only code filter and focus the QA heading. URLs contain only the fixed section route. QA retains pagination, escaped private evidence and an all-findings action. Source audit/provenance and channel-unknown caveats remain available in a disclosure. Releases/Recordings truthfully say their browsing/detail features are not available in this slice.

Charcoal/bronze metric cards, responsive grids, restrained accents, visible keyboard focus and inherited reduced-motion behavior use native Studio styles. The file input's minimum sizing was corrected after the 320px browser gate found overflow.

## Automated evidence

| Gate | Local result |
| --- | --- |
| Full `npm run build` | PASS, including all inherited gates |
| `check:release`, TypeScript | PASS; Build120 / v0.19.42 pairing |
| Build118 foundation, lean Album consumer, CPU slice 4 | PASS |
| Build119 | PASS, all 55 synthetic cases retained |
| Build120 | PASS, 12 actual Chromium scenarios plus pure projection/all-code grouping |
| Runtime/artifact/privacy guard | PASS, 130 source/build files including maps; no embedded source signatures |
| `git diff --check` | PASS |

Build120 runs the actual App/React StrictMode and router under local Vite. External services are intercepted before navigation; synthetic file selection exercises the actual bundled parser Worker. A separate controlled Worker harness delivers results after termination through real mounted components to prove race handling. There is no private dataset in the test or fixture tree. Screenshots are local ignored artifacts in `node_modules/.cache/build120/`.

Coverage: zero startup Worker; dynamic 3/2/3 counts including an unbound appearance; all four sections, history and invalid routes without reimport; each actual finding group and QA keyboard focus; pagination and escaped evidence; 320/390/768/2560px overflow checks; reduced motion; replacement, malformed rejection, valid zero-entry snapshot, reset, parent unmount, refresh and pagehide; late success/error after concurrent selects/reset/rejection/unmount; no source content in network requests, storage, URL or console.

Inherited test harnesses were adapted only for the moved owner/controlled props and Build119 ancestry marker; original parser, provenance and CPU assertions remain. Playwright 1.63.0 is pinned as a development dependency; both build workflows install Chromium because the full build now includes this gate. No workflow was dispatched for deployment.

Local environment: existing dependencies use pnpm links, so the attempted npm install reported unsupported `link:` protocol; `pnpm install --lockfile=false` succeeded. Windows sandbox blocked Vite/esbuild parent-directory access, so the local browser/full-build runs used a narrowly approved unsandboxed execution. The production bundle retains the existing large-chunk warning. None of these are production CPU measurements.

## Review and owner acceptance after separate authorization

1. Review the bounded diff and successful exact-head PR CI. Production remains Build119 until a separately authorized merge and Pages deployment.
2. Explicitly select the private JSON locally. Compare Overview counts/date with that selected source; no historical aggregate is a runtime constant. Inspect unbound appearance and ISRC findings without inferring identity or publication.
3. Navigate Overview → Releases → Recordings → QA and browser back/forward. Confirm one unchanged snapshot, no duplicate import, and clear future-slice wording in Releases/Recordings.
4. Open finding groups with keyboard, inspect/paginate source evidence, show all findings; inspect source audit, source omissions and unknown channel status.
5. Reset/unload and confirm picker focus. Replace with valid and rejected JSON, leave Catalogue and return, then refresh: discarded data must not reappear.
6. Check actual target browser/mobile/ultrawide visuals, keyboard and assistive technology. Synthetic browser checks do not establish owner visual or accessibility acceptance.
7. Inspect Network, Storage and URLs during import/navigation/reset: no private upload, source identifiers in routes or durable snapshot storage. Preserve inherited creative Tracks/Albums behavior.

No commercial persistence, gallery/detail engine, external artwork/genre fabrication, automatic binding, platform publication assumption, Worker/R2/LaunchPAD/Blackhole change or private V5 read/upload was performed. Rollback is the bounded Build120 PR revert if a separately deployed candidate later fails; do not compensate by changing private source or production data.
