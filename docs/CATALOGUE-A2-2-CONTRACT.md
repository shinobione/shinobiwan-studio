# Catalogue A2.2 — local-private import contract

Candidate scope proven against the private V5 package on 2026-09-27. This is Build119 / v0.19.41 development, not deployed or accepted. Production remains Build118 at `650c8a3cf9a69f95732905562535394fac94a12e`. Documentation reconciliation is independently reviewed in #241; #237 remains open.

## Input and source coverage

Explicitly selected UTF-8 JSON only, schema `catalogue-readonly-seed-v1`. No direct workbook, ZIP or HTML parsing. The existing JSON contains recordings, releases, appearances, Amuse candidate positions, recent SoundCloud observations, source QA, warnings and eight source-sheet counts. The adapter checks exact field names/types, required identity fields, dates, digest syntax and reference integrity. Unknown fields/versions fail closed. Optional facts use null; omitted optional source fields are accepted only where the verified exporter omits them. Max 10 MiB and 50,000 total rows; no multi-file merge.

Local audit found 168 recordings, 120 distinct documented ISRCs / 48 missing, 84 release records (28 Amuse / 3 SoundCloud Distribution / 53 historical), 109 appearances, 28 Amuse candidate slots, 20 recent SoundCloud observations and 35 QA rows. Zero duplicate entity IDs, orphan appearances, appearance/recording ISRC disagreements, artwork references or existing Studio bindings. These are aggregate audit results, never runtime constants.

The workbook has ten sheets. JSON summarizes eight; dashboard and source-method sheet bodies are absent. Fourteen detailed Amuse rows are not independently retained as their own table. The JSON's workbook digest matches the local workbook. This establishes source-package consistency, not exhaustive evidentiary equivalence or external publication truth. The detailed audit, all fingerprints, source terminology and unresolved rows stay outside Git. The original workbook is the source authority; import UI must disclose this coverage limitation.

## Identity and normalization

Recording, commercial Release and Appearance have branded, separately namespaced IDs derived from the explicit source IDs, never titles or ISRC. Source IDs must be bounded nonempty strings with no whitespace/control characters. Order is deterministic by explicit IDs (code-unit order). Repeat import replaces the entire snapshot; identical source yields identical normalized content. No entity coalescing, title matching, Studio binding, creative Album changes or canonical mutations. A recording may have many appearances across releases. Duplicate entity IDs, duplicate release source/sourceId identity and duplicate release/position ownership reject the entire input. Orphan references reject it. Null appearance binding is retained as a pending unbound case, never guessed.

Trim display/metadata text, preserve exact original source rows in private evidence. ISRC normalizes separators/case only; malformed codes stay in evidence with a review warning and no normalized code. UPC/EAN remains optional; malformed evidence requires review. Release date text is source text, not an invented ISO release date. Source date must be a valid ISO date. Imported Track link proposals never activate: they are held for private evidence and human review. All appearances remain unverified by Studio, irrespective of source certification wording.

## Evidence and QA

Each source entity/ancillary row has evidence with a source locator and original row, plus input SHA-256 computed locally. The workbook SHA in the file is a source claim; the browser does not verify workbook bytes. Evidence distinguishes explicit source observations, derived normalization, missing facts and contradictions. No human-confirmed decisions are manufactured. Source QA and Amuse candidates always remain pending-review.

Duplicate ISRC/UPC, title ambiguity, observed ISRC conflicts, release metadata/count contradictions, non-null Track proposals and missing identifiers generate distinguishable warnings/review cases. Structural/identity/reference errors reject atomically with no partially activated snapshot. Errors contain fixed codes and row locators, never payload excerpts. Summary reports source/parsed/rejected rows, entity counts, identifiers and review totals. Rejected structural input may have unavailable counts, shown as unknown rather than zero.

Channel observations remain separate (Spotify, SoundCloud, Amuse/distributor). Imported text/URLs are retained as evidence only. Current availability is unknown for every channel; no remote fetch or URL rendering. Submission, distribution or SoundCloud presence never implies live Spotify/Apple availability. Future pitching is a separate workflow. Uncertain cross-source identity is not reconciled automatically.

## Lifetime, privacy and authority

Selection starts a dedicated bundled Web Worker: size check, local read, hash, parse, validation, normalization. No network parsing/CDN/dependency. Reset, replacement, unmount or read failure terminates the worker and invalidates its generation; late results cannot activate. The current snapshot clears immediately on replacement, including rejected replacements. Worker memory is released after success/failure; UI memory clears on unload/navigation away/refresh. No storage, telemetry, console payloads, server upload or private URL state. The file input value is cleared after capture. Empty Catalogue creates no commercial/backend reads. No remote artwork or links are loaded.

The four Catalogue sections and creative routes remain unchanged. A2.2 exposes a constrained summary and paginated QA only; no A2.3 gallery, filters, release detail views, export, persistence, reconciliation submission or external sync. Future bidirectional work requires an independent authority contract; Track Manager remains the sole protected writer and `album.trackIds` remains creative membership authority.

## Review and rollback

Synthetic committed tests cover malformed/schema/identity/reference/contradiction boundaries, deterministic replacement, lifecycle races, privacy and retained routes. Private compatibility runs use local files and print aggregate results only. Source-dependent evidence is never a CI fixture. Artifact guards inspect tracked/staged names and runtime/public/build/source-map content; a separate local fingerprint scan covers actual private values. No guard claims universal leak detection.

Owner gate after separately authorized deployment: empty refresh; explicit valid selection; correct aggregate counts and pending source cases; malformed/unsupported rejection; same-file repeat; rapid replacement/reset; QA keyboard/pagination and mobile layout; refresh/navigation unload; Network shows no source upload, artwork fetch or extra backend reads. Verify no storage/private URL changes. Candidate REAL USER PASS remains pending. Rollback is the bounded runtime PR; no data migration exists.
