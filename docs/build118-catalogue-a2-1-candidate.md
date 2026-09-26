# Build118 — Catalogue A2.1 candidate

Date: 2026-09-26. Status: CODED candidate; not merged, deployed or real-user accepted.

## Preflight

- Repository: `shinobione/shinobiwan-studio`; production branch `main`.
- Verified main: `6a71a17bba3513472f007f641ca03a3df0739461`.
- Initial local branch: `feature/catalogue-a2-native-readonly`, clean at stale `c44b1e6920435e71896dfce3ca8c9f27d98aabd1`; no work overwritten.
- No open PRs; latest runtime PR #234 merged. Its exact candidate `b843acf030195b726725af2d0f7e148607b8b9bb` passed CI `35435903134`.
- Latest main Pages run `35441980808`: build and deploy SUCCESS, exact main above.
- Accepted runtime: v0.19.39 / Build117, [existing real-user receipt](acceptance/BUILD117-REAL-USER-PASS.md).
- Candidate branch: `codex/catalogue-a2-1-native-foundation`; local safety ref: `safety/pre-catalogue-a2-1-build118-20260926`.
- Original private workbook hash verified against the external master brief. Reference material remains outside Git; no source rows are needed by this slice.

## Bounded implementation

Build118 / v0.19.40 adds the Catalogue daily navigation entry after Albums, a separate commercial route/parser and native React shell. Overview, Releases, Recordings and QA show explicit empty states. Valid-but-unloaded IDs and malformed routes show not-found; hash changes update the component even when the parent route stays Catalogue. Existing Track and tool routes retain their semantics.

Commercial Recording, CommercialRelease, ReleaseAppearance, Evidence, ReconciliationCase and channel publication types are independent of canonical Track/Album types. Branded commercial IDs cannot be interchanged; optional codes and evidence remain explicit. No artwork, KPIs or historical facts are simulated.

Importer is intentionally deferred to A2.2: no file control, persistence, network service or commercial data. No new dependencies. Scoped CSS uses the Studio dark/cyan palette, wrapping navigation, visible keyboard focus and reduced-motion handling.

## Validation and review gate

Local result: **PASS** for targeted checks, standalone typecheck, full `npm run build` and artifact scan (119 runtime source/build files), plus `git diff --check`. Vite reports its existing large-chunk advisory; no code-splitting refactor is included.

The stale local pnpm-linked installation lacked the already-declared AJV packages. After npm failed on that linked installation, `pnpm install --lockfile=false` restored the declared dependencies without a manifest dependency change. The sandbox blocked esbuild ancestor-directory reads; the full build passed with the normal permission escalation.

Agent browser checks passed for section navigation, back/forward, refresh, keyboard Enter, malformed deep-link not-found and return to overview. Layout inspected at desktop 1440×1000, mobile 390×844 and ultrawide 2560×1440; measured no horizontal overflow at mobile/ultrawide. This is agent QA, not REAL USER PASS or proof of a production Access session.

A local scan compared 377 private reference identifiers/source fingerprints against all compiled files and the build log: zero matches. The scan printed only counts. No original private inputs or source values are committed.

- `npm run check:build118`: route compatibility, strict URL parsing, actual component hash subscription/rendering/cleanup/refresh, empty/not-found states, commercial identity type checks and source boundaries.
- `npm run typecheck` and `npm run build`: complete inherited validation chain plus the new gate and post-build artifact scan.
- `npm run check:catalogue-artifacts`: scans tracked/staged filenames plus runtime source, public assets, compiled JS and source maps for private pack/seed signatures; failures never print matched data.
- `git diff --check`, changed-file review and local private-source fingerprint comparison before push.

Build117's historical identity is preserved in its ancestry marker. Its guard now accepts a successor identity matching package metadata and allows subsequent gates in the chain; every existing SHA-256/bridge/upload assertion is retained. No historical accepted receipt is rewritten.

The Build79 guard now normalizes CRLF when reading source, as its peer guards already do. Its exact canonical-reload/error-order assertions are unchanged; the first Windows run exposed this pre-existing line-ending sensitivity. No Album runtime change was made.

The Draft PR and its exact-head Actions run are the remote CI receipt. CI is not real-user acceptance. No candidate Pages/Worker deployment or R2 mutation is authorized.

## Limitations / next step

Review this Draft PR first. A2.2 import validation, populated galleries/details/search, actual historical data, source reconciliation and user-reviewed Studio binding remain future work. No claim of complete Catalogue delivery or REAL USER PASS. Desktop/mobile/ultrawide real-user acceptance remains pending. Revert this bounded PR to roll back the foundation; no backend or data migration exists.
