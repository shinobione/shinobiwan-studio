# CPU corrective slice 2 — lean canonical Albums consumer

Tracking: Studio [#238](https://github.com/shinobione/shinobiwan-studio/issues/238), LaunchPAD [#283](https://github.com/shinobione/LaunchPAD-APP/issues/283). Candidate only: stop after Draft PR and exact-head CI. No merge, Studio/Worker deploy or live R2 access in this mission.

## Reconciled base and dependency

- Repository: `shinobione/shinobiwan-studio`, production branch `main`.
- Fetched/verified base: `b035fb226e8c9a2654306076522faa4da97fb3ea`, Build118 / v0.19.40; dedicated branch `fix/build118-lean-album-consumer` was already clean at that base.
- A2.1 PR #236 merged; validation [36249713796](https://github.com/shinobione/shinobiwan-studio/actions/runs/36249713796) succeeded on `915eec0bfc16def09e8e4483a74aab7fe0e2fe23`. Pages [36249977846](https://github.com/shinobione/shinobiwan-studio/actions/runs/36249977846) build/deploy succeeded on the base above.
- Docs PR #237 remains open and is not in this branch. It reports limited A2.1 shell REAL USER PASS; the latest merged acceptance receipt remains Build117. Issue #238 separately records intermittent private reads. Do not infer causality from A2.1.
- Backend PR [#284](https://github.com/shinobione/LaunchPAD-APP/pull/284) verified merged at `4dd420bd612555cdb972897b080549aacf408fa6`. Mission-supplied deployment: Worker `28bbfd0a-bd4a-4962-8293-938b788e05b3`; authenticated browser GET canonical returned HTTP 200, `ok=true`, 7 Albums, total 7, no migration field. This mission does not repeat live data access or backend deployment.
- Read-only backend source inspection confirms canonical and full use the same manifest/asset-state summary builder and totals; full additionally computes migration. No related repository was changed.

## Implementation and compatibility

The only runtime edit is `getAdminAlbums()` requesting `/api/studio/albums?view=canonical` through the existing private GET helper. Credentials, CORS, no-store, 7000 ms per attempt, two-attempt ceiling, transient status allowlist, response validation and `AdminReadError` classification remain unchanged. No fallback to the full endpoint is introduced.

| Consumer | Preserved evidence |
| --- | --- |
| AlbumHealthWorkspace / album-health | Ordered `trackIds`, title, cover asset state and accents; private Track provenance still required for cross-model completeness |
| AlbumsWorkspace / legacy AlbumManager | Full canonical summary metadata, status, dates, ordered membership, artwork and revision; detail editor remains on private detail GET |
| public-albums-api | Private `assetState` drives protected artwork; public visuals cannot replace a failed private collection or prove Track completeness |
| CatalogIntelligenceView | IDs, metadata and ordered membership; independent failed reads remain visible |
| MetadataValidationPanel / TrackCreatePanel | Canonical owner IDs, membership, status and revision remain available |
| Album delete | Fresh private collection revision before POST and canonical absence afterward, including response-loss recovery; no blind POST retry |
| Other Album mutations | Existing operation-specific private detail/Track rereads remain unchanged; collection summaries do not replace detail verification |
| album-migration-api | Default `/api/studio/albums` retains genuine dry-run, state tokens and current evidence; a canonical-only response is rejected |
| Commercial Catalogue | Empty and read-only; no import, persistence, new network request or authority |

The response is returned intact: no filtering, sorting, metadata normalization or totals reconstruction. Runtime version/build remain Build118 / v0.19.40 for this bounded corrective. No dependency changes.

## Automated validation

- `npm run check:build118`: focused synthetic client/component tests plus the existing commercial route/empty-state/type guards; explicit zero-network assertion for Catalogue mount/navigation/refresh.
- `npm run build`: full inherited regression chain, private-read/release guards, TypeScript, Vite production build and post-build Catalogue artifact/privacy guard.
- Focused cases: exact lean URL and private request options; intact payload/order/totals; full migration state token preservation and rejection of missing dry-run; transient HTTP/transport/timeout retries bounded at two; deterministic Access/HTTP/invalid responses; Health/Management success and visible errors; public/empty/mixed Track provenance never proving completeness; private artwork; actual collection + delete integration for absence, stale, unchanged, ambiguous and unavailable evidence; metadata verification remains on detail with mismatch rejected as unverified.
- Existing inherited guards cover Album create identity, metadata/membership/move recovery, asset upload/delete and no automatic write retries. Two historical URL assertions are updated to the new canonical collection URL while retaining their other checks.

Tests use synthetic data and mocked transport only. Exact commit, Draft PR and CI results are recorded on the PR and in the handoff; these are not production or real-user evidence.

Local results (2026-09-26): `check:build118` PASS; the full `npm run build` regression chain through `typecheck` PASS. The initial Vite step hit Windows sandbox directory access denial while loading its config. Retrying only `vite build` outside that sandbox succeeded (316 modules), followed by `check:catalogue-artifacts` PASS (119 files). Vite reports its large-chunk advisory; bundle splitting is outside this slice. `git diff --check` passed. CI must still verify the exact committed candidate on Linux.

## Proposed real-browser acceptance after separately authorized deployment

1. In the authorized Studio browser, navigate to Albums, refresh and navigate away/back. Confirm collection GETs use `?view=canonical`, return successful JSON without migration, and retain the expected canonical Album count/totals. Do not export raw HAR, cookies or private bodies.
2. Compare Album order, titles, dates, status, membership and private artwork with the existing canonical state. Open an Album detail and verify its private detail route remains separate.
3. With private Tracks available, check Health and Management agree with canonical state. If Track reads degrade naturally to public data, Health must show private truth unavailable/unverified; never accept public completeness.
4. Open historical migration review without applying anything. Confirm its GET has no canonical query and exposes genuine dry-run/state-token evidence. Leave migration writes untouched.
5. Browse Catalogue overview/releases/recordings/QA: honest empty states and no requests attributable to those commercial views. Existing shell requests are not claimed eliminated.
6. Observe any naturally occurring private failure: visible classification, at most one transient retry and no silent public Album substitution. Do not manufacture production failures or destructive writes.
7. Any later legitimate Album write must still display private verification. Synthetic regression tests supply failure-path proof; this mission authorizes no live write smoke.

Overall CPU remediation, frontend deduplication, Track/SonicTrace services and A2.2 commercial import remain outside this slice. No measured CPU gain or incident resolution is claimed.
