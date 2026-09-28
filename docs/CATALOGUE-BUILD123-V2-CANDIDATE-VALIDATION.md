# Build123 · A2.4-B2 local v2 evidence reader — candidate handoff

**CANDIDATE / NOT MERGED / NOT DEPLOYED / NOT REAL USER PASS.** Studio v0.19.45 / Build123 proposes a bounded native, temporary, read-only browser view for the separately generated owner-local `catalogue-readonly-seed-v2` output. Accepted production predecessor remains **Build122 / v0.19.44** with its independent owner eight-check receipt. The feature branch starts from `e0dd0977fec40080313c676b0606d415b71e70e0` (merged #252, Pages #36355349970 SUCCESS).

## Exact change and authority boundary

- v1 `parseCatalogue` retains its accepted schema/semantics unchanged. A new standalone `parseCatalogueInput` wrapper dispatches by exact v1 or v2 version in the same local Worker. The Worker retains its exact selected-file SHA-256, UTF-8 fatal decode, 10 MiB bound, generation fence and no transport/persistence contract.
- v2 is accepted only as explicit `a24b2-local-0.1.0` owner-local export with strict root and evidence/coverage shapes, the original six v1 arrays, original eight source-sheet counts plus ten-section coverage, consistent normalized/evidence source counters and a 50,000-row aggregate limit. The v1 tables are validated through the unchanged strict v1 parser before enrichment. Neither this application nor the input's claimed workbook SHA independently verifies the original workbook bytes.
- Independent details are **source observations**, not new Recordings, Releases or Appearances. A linked detail must match source namespace + exact distributor Release sourceId + Release ID + Appearance ID + positive position. No title/ISRC/UPC/row-index lookup. Distinct detail evidence may annotate one Appearance; conflicting claimed exact links reject the whole candidate. Unlinked detail (no asserted target; explicit issue code) stays in global QA and cannot manufacture association. Corroboration-only title/ISRC contradictions add pending findings and preserve the already exact association. The original v1 QA findings and channel `unknown` semantics survive.
- The new `Snapshot.enrichment` has only source coverage counts, detail evidence counts and exact/unlinked totals. Actual detail content remains inside transient per-snapshot private `Evidence` text and is disclosed only on demand in a Release/Recording/Appearance modal. Browser text is escaped by React; no raw HTML, external cover requests or automatic source URL opens. No approved creative Track binding, current DSP delivery/live status, cover authority, commercial save or sync.
- The only real source touched during the earlier **separate** private owner-local export/analysis was supplied outside the repository; the public Build123 PR/CI contains independently invented fictional fixtures only. Neither a real workbook, v1/v2 source JSON, fingerprint, private filenames, source titles, real codes, source rows nor private output is included. Do not paste real output into PR/CI logs or GitHub issue.

## Gate and expected independent owner smoke after *separate* merge/Pages approval

Candidate CI needs exact-head Release metadata/TypeScript/build, inherited Build118–122/CPU and A2.4-B fictional tests, new Build123 fictional parser + real Chromium scenarios, and source/compiled artifact privacy scan.

After a separately authorized merge and confirmed Pages build/upload/deploy on its merge SHA, owner privately selects their **own local v2 JSON** in Catalogue and reports only aggregate PASS/FAIL:

1. Distinct source-type selection accepts v1 unchanged and v2 explicitly; unsupported future schema and inconsistent private source fail with no partial view.
2. v2 confirms original Recording/Release/Appearance totals unchanged (including multiple appearances per Recording and unbound exclusions). Independent detail evidence count/link count/unlinked count shown separately, **never inflated as tracks**.
3. Exact historical distributor proof appears under the correct appearance/Release, with on-demand private evidence. Source report accurately says ten sections represented/partial/omitted; current channel status stays unknown.
4. Global/source/contextual QA preserves prior pending findings, with any extra v2 contradictions or unlinked proof additive only; no auto-resolution or auto-binding to creative Track.
5. Search, sort, grid/list, Release ↔ Recording ↔ Appearance/Back/QA context work; keyboard/focus/mobile/desktop regression and honest artwork placeholders remain.
6. On source replacement, invalid JSON, Reset, refresh, leave/re-enter Catalogue and a late Worker response, no old private snapshot/detail/QA context returns.
7. DevTools: no private upload, persistent browser Storage, source IDs in URL/hash, external artwork request, console leak, new Worker/R2/backend write or LaunchPAD mutation.

This acceptance would be **bounded real-user view-only**, not a ten-sheet full semantic/source audit, original-byte workbook verification, storage/backup/rollback ADR, DSP status verification, formal accessibility/security audit or sustained Workers Free CPU proof. Source-specific pending review cases and Studio CPU #238 / LaunchPAD #283 stay open. A2.4-C durable storage remains independently unselected.

**STOP:** Draft PR only. No branch merge/Pages deployment, Worker/R2 mutation, commercial persistence or Build124 without distinct owner consent and exact-head CI. If CI fails, inspect full log and correct the relevant family rather than shipping a red candidate.
