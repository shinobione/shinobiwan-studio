# A2.4-B — Enriched local export v2 + identity/delta simulation contract

2026-09-27 · **DESIGN + independently fictional, Node-only contract rehearsal candidate; not a real exporter, accepted runtime schema, private v2 package, persistence or write authority.** Owner authorized progressing from the bounded [A2.4-A sanitized audit](CATALOGUE-A2-4A-SANITIZED-COVERAGE-AUDIT-2026-09-27.md); this document proposes the independently testable contract. Do not retroactively change the historical v1 import or the earlier owner receipt.

## Ground truth and acceptance boundary

- Accepted Studio runtime remains Build122 / v0.19.44, read-only temporary Catalogue. Candidate v2 has **no runtime implementation**, so current `parseCatalogue` must reject it with `UNSUPPORTED_SCHEMA` until a separately allocated, owner-approved build changes that contract.
- Existing `catalogue-readonly-seed-v1` strictly validates a 10 MiB UTF-8 source, at most 50,000 entity/ancillary rows, one atomic Snapshot, and exact source entity/reference identifiers. Existing v1 table arrays are `recordings`, `releases`, `appearances`, `unverifiedAmuseCandidates`, `soundcloudRecent`, and `qa`; it records eight `sourceSheets` counts.
- A2.4-A privately compared ten original sheet bodies, found eight represented count fields (all eight counts agreed), and confirmed exact source Release + position matches for **14/14** independent distributor detail records against **already-existing** appearance rows, with title/ISRC agreement as corroboration. Detailed proof/status/time/source text is currently counted but *not independently represented*. This is a **source-specific audited result**, not a v2 hardcoded number or universal assurance of successful matching.
- No reviewed Track binding, verified live DSP state, cover/genre authority, private durable registry, channel event ledger or ten-sheet exhaustive semantic equivalence results from this audit. Source-specific 355 pending findings remain pending.

## 1. Version, export location and invariants

Name the proposed **separate** version `catalogue-readonly-seed-v2`. Leave v1 input and parser behavior byte-for-byte compatible. A v2 export is generated **locally and explicitly** from an owner-selected workbook outside all repositories. Never upload original workbook, v1/v2 real JSON, local exporter, raw row examples, source IDs/titles/ISRC/UPC, fingerprints, private mapping/evidence, full filename or screenshots to GitHub, Pages, CI, public R2/Worker, logs, analytics or this design record. Public repository may contain only independently invented fictional fixtures and a synthetic-only contract/prototype, after separate review.

A future local exporter must not silently fall back to v1, convert an old v1 package into invented v2 completeness, fetch network data, modify the source workbook, infer missing rows, run in the deployed Pages app at startup or make an automatic save. Explicit selection; strict UTF-8 + schema validation; atomic rejection before any activated view; bounded runtime memory cleared on replace/reset/leave/unload/refresh and protected from late Worker messages. Enforce max bytes and total rows on **all** v2 collections including detail evidence, coverage items and optional original source rows, not only the six inherited tables; recommend retaining current v1 guard ceilings as a starting candidate subject to local profiling.

## 2. Proposed logical v2 envelope (field contract, not private sample JSON)

| Field | Meaning and constraint |
| --- | --- |
| `schemaVersion` | Exact literal `catalogue-readonly-seed-v2`; never silently accepted by v1 parser. |
| `snapshotDate` / `artist` | Current accepted source semantics; do not infer a publication or review timestamp. |
| `source` | Private original-file digest *claim* and exporter contract version/format in the local package. The browser cannot certify the original workbook SHA without independently receiving its actual bytes. No private hash in Git or CI. |
| `sourceSheets` | Preserve v1 eight counts and extend with coverage of all ten original sections using an explicitly approved versioned mapping; counts must independently reconcile source rows, not normalized entity-array totals. |
| `recordings`, `releases`, `appearances`, `unverifiedAmuseCandidates`, `soundcloudRecent`, `qa` | Retain v1 semantics and exact source entity IDs; v2 changes must be additive and explicitly compatible, not a title/ISRC merge or automatic accepted QA. |
| `detailedDistributorEvidence` | Independent **evidence rows** from the original detailed source section. Each row identifies its own source provenance and one exact already-normalized Appearance/Release pair. It is not a new Recording or Appearance. |
| `sectionCoverage` | Independent per-section completeness metadata; one of `represented`, `partial`, `omitted`, `contradictory`, `unverified`; preserve who/what made a claim as private evidence. Counts do not imply full body coverage. |
| `sourceMethodEvidence` | Optional, segregated original-method/provenance text only after field-level owner review; default is coverage descriptor, not blind reproduction of the whole method/dashboard bodies. |
| `warnings` | Private evidence/review state; never auto-resolve v1 pending findings or declare publishability/live status. |

No field in the envelope grants storage, commercial edit, creative Track mapping, asset publication, release delivery or external DSP verification.

## 3. Exact detailed evidence row relationship

A proposed `detailedDistributorEvidence` row must have an **independent stable-in-snapshot evidence identity** plus `sourceNamespace`, `sourceRecordAlias` (where truly supplied), `sourceLocator`, `sourceReleaseId`, `releaseId`, `appearanceId`, exact positive integer `position`, private original row evidence, and optional historical `statusText`, `observedAt`, `displayTitle` and `isrcObserved`. Missing fields are explicit `null`; no invented timestamp or coerced verified-live enum. Do not mistake a worksheet row number for timeless source identity; if no intrinsic row key exists, classify the alias as **snapshot-scoped** and retain its source digest/revision privately. `sourceLocator` alone is provenance, not matching authority.

Validate *before activation*:
1. The evidence source namespace and source Release ID must resolve to exactly one commercial Release through its explicit source/sourceId identity, and that Release must equal the referenced `releaseId`. No UPC/title lookup.
2. The explicit Appearance ID must exist, reference that exact Release ID, and have the same positive documented `position`. If the exporter maps an original source row to an Appearance from source Release + position, require **exactly one** candidate and reject zero/multiple, null-position, source namespace mismatch or stale association. Title and normalized ISRC may **corroborate** or raise a contradiction review case, but must never select an Appearance or auto-bind a Recording.
3. Evidence source identity must be unique; duplicate source record identity or incompatible payload/reference is an atomic error. Several genuinely distinct evidence sources may refer to one Appearance if independently evidenced, but are never counted as extra appearances.
4. Preserve original evidence as private escaped text with bounded size/length. A validated evidence link is **not** a reviewer approval, current platform verification or proof of Studio creative Track equivalence.
5. Recount Release/Recording/Appearance totals from the existing normalized arrays only. Maintain distinct counters: `sourceTableRows`, `normalizedEntities`, `detailedEvidenceRows`, `coveredSections` and `pendingFindings`. Do not add evidence rows to `appearances`, `recordings` or the existing source-specific 444 normalized v1-array count.
6. Keep the original unresolved candidate-position rows separate. Never resolve the 28 prior-source candidate observations because a detailed row happens to have a similar title/ISRC.

If actual worksheet conventions cannot provide or reliably derive the explicit Release/Appearance link from exact source keys, v2 must preserve that detailed row as **unlinked private evidence pending review**, never silently discard it or guess a target. If v2 is required to provide a complete detailed link under the chosen export policy, fail the proposed migration gate with an explicit reason rather than fabricating all-linked coverage. Choose/link-failure policy explicitly before implementation; no silent partial-success classification.

## 4. Independent commercial identity and forward migration

Existing in-session namespaced source IDs remain source aliases, not a promised immutable global registry key. A *future* durable registry may mint opaque, independent CommercialRecording/Release/Appearance IDs in an explicit owner-reviewed creation/migration transaction. A proposed alias table must retain namespace, exact original source ID, source snapshot provenance/revision and target identity; reused aliases with conflicting target IDs block migration. Commercial Recording and creative Track IDs, commercial Release and creative Album IDs, and ISRC/UPC metadata have different authorities. Duplicate title/ISRC/UPC may generate findings; no coalescing.

A pure **synthetic-only migration simulation** takes an immutable fictional baseline and fictional incoming v2 projection, computes `unchanged`, `proposed-new`, `source-changed`, `missing-in-new-snapshot`, `orphaned`, `unbound`, `conflicting-alias`, `contradictory-evidence`, and `needs-owner-review`. It does not commit, assign reviewed links or delete anything. A missing row on a later snapshot is not a verified deletion. Reimport of exactly the same source yields the same deterministic proposal; changed/reordered spreadsheet rows must not map by row offset. The report is local/private; Git tests assert only fictional data and invariant counts.

## 5. v1, v2 and incomplete sources

- The accepted Build119–122 v1 local import stays unchanged. It continues to accept v1 and reject unknown versions; no disguised extension fields inside its strict root validator.
- A future v2 consumer accepts only a complete, explicitly validated v2 contract in a **separate** carefully gated adapter. A v1 package is not auto-upgraded from its eight counts: missing original detailed row bodies and method/dashboard evidence remain absent, even if v1 counts historically agreed.
- V2 may include coverage states saying some explanatory bodies are intentionally not exported; mark the distinction between intentionally omitted and presumed complete. A dashboard formula or method note must not become an independent commercial Recording/Release fact without human determination.
- Source provenance and timestamp observations remain historical; current channel status stays unknown until independently verified according to a future event ledger decision.

## 6. Candidate synthetic-only test and privacy gate

Independent fictional fixtures, without source-derived examples or fixed source row counts, must cover: duplicate title/ISRC but distinct IDs; one Recording on many Releases; a genuinely unbound Appearance; exact source Release/position reference, accidental same-position across different Releases, source namespace collision, nonunique source Release identity, missing/null/ambiguous target, duplicate evidence alias, contradictory corroboration-only title/ISRC, several evidence rows for one Appearance, arbitrary reordered input, missing source section, v1/v2 fail-closed, digest syntax/coverage count contradiction, row/byte/string bounds and HTML-like evidence escaping.

Assertions: old v1 selection and Build119–122 tests continue to pass; v1 rejects v2 until separately shipped; **evidence count never inflates appearance count**; every pending global QA finding is preserved or new v2 findings are additive; no source/title/ISRC/row content in public assets/routes/logs/network/storage. This Draft includes a **standalone fictional Node-only rehearsal** in `scripts/test-a24b-synthetic-contract.mjs`, run by `check:a24b` before the unchanged Build122 production build. It proves a narrow core relation/delta model, **not** the full envelope, a real workbook exporter, security review or a deployable v2 adapter. It uses no private source or external service. Its only outputs are static case labels and synthetic aggregate counts. End-to-end browser acceptance and actual private v2 package selection need an independent later runtime build and owner approval.

## 7. Proposed gates to exit design

1. Owner approves which detailed original fields, source namespace keys, provenance and original-sheet body coverage should be carried into a privately generated v2 package. Confirm whether unlinked detail is a blocking export error or a pending-review evidence row.
2. Review the exact evidence/Appearance relation and source alias semantics on local actual source, without uploading private data. The historical **14/14** mapping is comparison evidence only, not a mandated fixed count.
3. Review the included synthetic-only evidence relation and alias/delta rehearsal and CI independently; approve/refine the complete schema and importer/exporter contract before any real private export or production registry.
4. Later decide **local encrypted package vs protected private commercial service**, including key custody, backup, revision/operation ID, conflict policy and sustained backend CPU budget. No automatic Cloudflare/R2/Track Manager writer.
5. Only after independent source/review/storage decisions may an actual Build123-sized runtime slice be allocated with version/build guard, Draft PR, exact-head CI, separate merge/Pages and owner private-source smoke.

**Stop:** This design approval does not authorize Git upload of the original workbook, archived exporter, private v1/v2 package or fingerprints; nor any new runtime, persistence/sync, Worker/R2/LaunchPAD mutation or DSP action. Studio CPU #238 and LaunchPAD #283 remain open.
