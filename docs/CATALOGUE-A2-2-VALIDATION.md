# Build119 / Catalogue A2.2 — candidate validation

Base: Studio main `650c8a3cf9a69f95732905562535394fac94a12e`. Candidate v0.19.41 / Build119. Documentation closeout is independent Draft #241; A2.2 has no merge, deployment or REAL USER PASS. [Contract and mapping](CATALOGUE-A2-2-CONTRACT.md).

## Local evidence

- `npm run check:build119`: 55 synthetic cases PASS. Parser, unsupported/malformed input, field types, optional/malformed/duplicate codes, independent identities, multiple releases per recording, duplicate release metadata and position ownership, orphans, channel contradictions, pending Amuse review, no title binding, source provenance, deterministic repeat, atomic rejection, worker lifetime/replacement/reset/unmount races, actual React controls/summary/escaped QA evidence and privacy boundaries.
- `npm run check:build118`: PASS, retaining route/type/empty-state tests plus lean Album and CPU slice-4 request/freshness/provenance/retry/verification coverage. The old empty shell test now stubs the independently tested import child; all route, empty/not-found and commercial identity assertions remain. Historical metadata assertions now accept the exact Build118 ancestry marker and successor release metadata.
- `npm run typecheck`: PASS.
- Full `npm run build`: PASS, including every inherited phase/build/focus/UX/reliability script, TypeScript, Vite and `check:catalogue-artifacts`. The Windows sandbox prevents esbuild ancestor-directory access; the full build was run outside that sandbox. Existing >500 kB bundle advisory remains.
- No dependency or lockfile added. Bundled worker is approximately 10 kB. Parser is local and worker cancellation releases pending work; no Track/Album service files changed.
- Agent browser: explicit synthetic JSON file selection completed through the real bundled-worker boundary; expected counts rendered; QA retained the snapshot; keyboard Enter reset cleared it and returned focus; malformed JSON rejected with no active snapshot; refresh returned to empty. DOM width checks: 1265px at 1280px viewport, 375px at 390px viewport, no horizontal overflow in the inspected empty states. Owner mobile/assistive-technology and production Network acceptance remain pending. Browser automation's read-only scope does not expose Resource Timing, so no measured browser request trace is claimed. Source/runtime dependency guards and inherited concurrency tests provide automated network-boundary evidence.

## Private compatibility and audit

The actual local derived JSON passes: 444 total parsed rows, 0 rejected, 168 recordings, 84 source releases, 109 appearances, 120 known / 48 missing ISRCs, 28 Amuse candidate slots, 20 recent observations and 35 QA rows. Workbook SHA claim equals actual workbook bytes. 3,024 recording-field comparisons across 18 fields have zero mismatches. All eight summarized sheet counts reconcile. These checks do not establish complete export equivalence: ten workbook sheets exist, two sheet bodies and a separately retained detailed Amuse table are omitted from the JSON.

Audit: 3 known release UPCs; 114 recordings request review; 25 groups of repeated release titles remain separate, without inferred common identity. Zero duplicate entity IDs, orphan appearances or appearance/recording ISRC disagreements in the actual source. No artwork references or reviewed Studio links. Detailed source provenance, fingerprints, taxonomy and unresolved rows remain exclusively in the private workspace audit directory. No private fixture is committed or sent to CI.

## Privacy inspection

Artifact guard scans Git tracked/staged filenames and source/public/dist content including source maps. A2.2 must ship schema vocabulary, so the old key-name blacklist is replaced by embedded-snapshot detection, literal identifier checks and executable positive/negative probes; private pack names remain forbidden. Schema strings alone are not private source rows. This is defense in depth, not universal leak detection.

Local fingerprint check compares 611 actual private values against runtime sources, tests, generated bundle/maps, build logs and diffs without printing matched content or hashes. It found **zero new matches**. Three literal overlaps exist in two unchanged historical files, verified byte-equivalent to main after newline normalization; they are recorded privately, not removed or misrepresented as a new leak. No private values matched generated assets. Repeat the local scan after staging and inspect the exact staged diff before push.

## Synthetic performance

Representative single-run Node wall-clock samples after the final parser changes: 168 recordings / 120,179 bytes: 6.4ms; 1,000 / 707,575 bytes: 39.3ms; 5,000 / 3,543,575 bytes: 197.6ms. Samples include parsing, normalization and test hashing/serialization overhead; results vary by run. These are not browser interaction latency, memory profiling, or Cloudflare CPU durations. Parsing/hashing occurs off the browser main thread; structured-clone/render cost remains bounded by the 10 MiB / 50,000-row limits. Long-duration browser heap profiling is not claimed. Synthetic tests verify termination after completion, error, reset, replacement and unmount.

## Owner gate / rollback

After independent review and separately authorized deployment: select the private JSON; verify aggregate counts and evidence provenance; inspect Amuse, missing-code and overlapping-release cases; confirm no automatic Track binding or platform publication; replace with invalid input; repeat/reset/refresh/navigate away; check mobile/keyboard and Network/storage/URL behavior. The intended state is private, temporary, read-only preview. No R2 writes, Worker changes, export, commercial persistence, automatic decisions or A2.3 gallery.

Rollback is the bounded Build119 PR. No backend or data rollback exists. A2.3 may be scoped separately after owner A2.2 acceptance, including a decision on richer workbook evidence coverage.
