# CPU corrective slice 4 — shared private browsing reads

Candidate on `fix/studio-shared-private-reads`, based on `9306ab4b6dafcce87c1bc68411719d01102612c0`. Build118 / v0.19.40 retained for this bounded incident corrective. Stop at Draft PR and exact-head CI. No merge, production deployment, related-repository edits or live R2 operations.

## Reconciled baseline

Studio [PR #239](https://github.com/shinobione/shinobiwan-studio/pull/239) merged CPU slice 2 at the base above. Candidate `a910b70856e344bc6c6896cc59a9f9107f9539a1` passed [validation 36258542918](https://github.com/shinobione/shinobiwan-studio/actions/runs/36258542918); [Pages 36258902897](https://github.com/shinobione/shinobiwan-studio/actions/runs/36258902897) succeeded at the merged SHA.

[Issue #238 owner evidence](https://github.com/shinobione/shinobiwan-studio/issues/238#issuecomment-5849807422) records functional recovery after the separately deployed LaunchPAD Tracks slice 3: 7 Albums, 4 Healthy / 3 Attention / 0 Unverified; two sampled loads with all captured GET invocations `Ok`, including SonicTrace. The same sample exposes repeated frontend requests. Invocation outcome is not a measured CPU duration or sustained Workers Free compliance. #238 / LaunchPAD #283 remain open; Catalogue A2.2 remains held. Open docs PR #237 is not incorporated and needs reconciliation.

## Request graph and change

Before: importing CatalogView starts a Track projection read even on other routes. Album Health and Management each start Album + Track reads; each Track projection also reads private SonicTrace and public Tracks. Both artwork consumers independently read the private Album collection, with Management doing so after Tracks settle.

After: the three browsing consumers share only pending operations through `shared-private-reads.ts`. Both Album views supply their existing canonical Album response to artwork discovery. CatalogView starts work on mount, with no import-time prefetch or indefinite settled cache.

In the deterministic simultaneous Health + Management + Tracks mount fixture, successful reads make **one** GET each to:

- `/api/studio/albums?view=canonical`;
- `/api/studio/tracks`;
- `/api/studio/analysis/sonictrace`;
- the existing public Tracks projection.

Private artwork discovery adds zero Album GETs. Each artwork consumer still reads the public Album projection for optional fallback; media requests themselves are unchanged. Counts describe successful overlapping reads, not retries or requests accumulated over navigation. Sequential route visits after settlement intentionally fetch again.

## Freshness and safety

| Boundary | Behavior |
| --- | --- |
| Pending browse operation | Shared only until settlement, including its existing retry loop |
| Success, fallback or error | Slot cleared; no sticky result, timer, TTL or persistence |
| Explicit retry / post-mutation UI refresh | Starts a fresh operation; older completion cannot clear the replacement |
| Component unmount / newer load | Late results ignored without cancelling another consumer's request |
| Write guard / canonical verification / recovery | Existing raw clients stay independent, including Album-delete collection rereads |
| Album migration | Full endpoint and real dry-run/state-token contract unchanged |
| Track / Album detail, capability and validation | Unchanged |
| Private/public provenance and SonicTrace | Existing complete Track projection shared without changing mapping, optional intelligence failure or fallback semantics |
| Transport / writes | Credentials, CORS, no-store, finite timeouts, at most two transient GET attempts and zero automatic write retries unchanged |

No generic request interceptor or mutation deduplicator is added. Home, Workflow and Intelligence retain their existing consumers; removing import-time Tracks work also removes the extra startup projection formerly triggered alongside those routes. Backend per-invocation CPU optimization is outside this slice.

## Automated validation

- `npm run check:build118`: PASS, including existing commercial empty/read-only guards, lean/full Album compatibility, private delete recovery and detail-write verification.
- New `test-cpu-slice4-shared-private-reads.mjs`: real service modules and component effects against deferred synthetic HTTP. Covers concurrent request counts, artwork reuse, no import-time fetch, fresh route entry, forced replacement, out-of-order post-mutation refresh completion, unmount/surviving subscriber, raw canonical/migration isolation, transient retry ceiling, access/deterministic errors, public fallback and SonicTrace optional failure/success.
- Full `npm run build`: all regression gates and TypeScript passed locally; Vite encountered a Windows sandbox ancestor-directory denial. `npm exec vite build` rerun outside the sandbox passed (317 modules); subsequent `npm run check:catalogue-artifacts` passed (120 runtime/build files). Existing large-chunk advisory remains.
- Two historical source guards were updated for the deliberate removal of eager settled caching and for reuse of an already-read canonical Album payload. Their remaining UX, authority and retry assertions are retained.
- Exact-head GitHub CI is reported on the Draft PR. No candidate browser or production CPU validation is claimed.

## Proposed browser gate after separately authorized deployment

1. On one normal Albums navigation, confirm canonical cards/artwork and private Health provenance; count requests within that navigation, excluding media and separating bounded retries.
2. Navigate to Tracks, a Track detail, Home and back to Albums. Confirm current data and loading behavior, without repeated refresh storms.
3. If private reads fail naturally, verify truthful errors/public fallback and an explicit retry that starts fresh. Do not manufacture an Access outage or production mutation.
4. During an ordinary separately authorized edit, confirm post-write UI reload uses new canonical truth. Automated tests own forced response loss and stale-response races.
5. Use a bounded read-only tail sample if authorized; report invocation outcome separately from measured CPU duration. Keep acceptance, Pages deployment and Worker deployment distinct.

Rollback is this Studio PR only; no backend, schema, catalog or media migration is involved.
