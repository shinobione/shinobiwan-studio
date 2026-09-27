# A2.4-A — Sanitized private-source coverage audit · 2026-09-27

**Status: private structural comparison performed; source-content review / owner sign-off and enriched export contract still pending.** This is a sanitized aggregate audit report, **not** a source package, automatic migration, permanent registry acceptance or new runtime build.

## Exact planning and baseline

- A2.4 [architecture proposal](CATALOGUE-A2-4-LIVING-ARCHITECTURE-PROPOSAL.md) and [private audit checklist](CATALOGUE-A2-4-LOCAL-AUDIT-CHECKLIST.md) were merged in docs-only PR #250 at `7be957b1bcccff4ddb89b5b15afd68b9563b2e71`; automatic [Pages #36348673480](https://github.com/shinobione/shinobiwan-studio/actions/runs/36348673480) completed SUCCESS on the same SHA. This Pages run publishes only documentation, not a new runtime.
- Runtime remains **Build122 / v0.19.44**, with its separate [bounded eight-check owner acceptance](acceptance/BUILD122-REAL-USER-PASS.md). No Build123 allocation.
- User-provided original V5 spreadsheet, an archived matching derived `catalogue-readonly-seed-v1` JSON and its historical local exporter were inspected **only in this private analysis workspace**. This is not a claim of having run on the owner's Windows workstation, having verified external platform state, or having accessed any later evolving version of the workbook. No private workbook/JSON/exporter/row/ID/ISRC/UPC/title/full filename/fingerprint/URL/content-derived sample was transmitted to GitHub, Pages, CI, Workers/R2 or inserted into this report. The original artifacts remain outside the repository. Any hash comparison below is a local Boolean result, not a published digest.

## Sanitized results and proof limits

| Test | Aggregate result | Meaning / limitation |
| --- | --- | --- |
| Workbook structure | **10** worksheets detected | Two non-exported worksheet bodies contain dashboard/method context, not independently represented data bodies. |
| Export inventory | **8 of 10** source worksheet counts represented; all **8/8** agree with the original table-row counts | Agreement of counted rows is not proof that every row's information is preserved. |
| Original vs archived derived source digest claim | **Exact original-byte match** observed privately; no digest disclosed | Establishes which historical file the archived JSON describes, not current DSP truth. |
| Core Recording projection | **168/168** direct source-row identity, title and ISRC comparisons agree | Distinct IDs remain distinct; no reviewed creative Track binding established. |
| Appearance projection | **109/109** source identity, linked Recording reference, position and displayed-title comparisons agree | Historical source associations are not a fresh external publication check. |
| Release source association | **28** distributor plus **53** historical source identity/title associations agree; **3** distribution Release records are grouped from exact appearance rows; total **84** normalized Releases | A grouped Release is not equivalent to an independent sheet row, and legacy identities are not automatically coalesced. |
| Ancillary arrays | **28/28** candidate-position rows, **20/20** recent observations, **35/35** source QA rows agree *row for row* with original tables | Existing broader parser-derived QA findings remain unresolved. |
| Detailed independent distributor evidence | **14** original detailed rows are counted in `sourceSheets`, but **no independent detailed-row array** exists in the derived JSON | **Confirmed material coverage gap:** summary/count retention does not preserve those detailed facts and their position-level proof independently. |
| Additional workbook bodies | Dashboard (24 occupied rows beyond title), source/method context (15 beyond header) are not exported as independent bodies | Review what is authoritative and what should remain only explanatory; never automatically turn dashboard calculations into independent commercial facts. |
| Different aggregate units | **455** occupied rows across the eight counted source tables vs **444** normalized entity/ancillary array records | Not a directly comparable denominator or an 11-row-loss finding: 84 normalized Releases include grouping/derived identities while the detailed sheet rows are counted without being retained. |
| Historical exporter robustness | Its current sheet widths/counts and two source-specific row assertions are literal values | Future exporter must derive bounded table regions, use independent synthetic fixture checks and keep all private source-specific regression literals outside repo/CI. Existing historical local script is not suitable for public commit. |

Row-level field comparisons above are bounded, not a byte-for-byte preservation certification of every original cell. The source and exporter were not mutated, no second exporter was executed, no new private JSON was generated or uploaded, and no current Amuse/Spotify/SoundCloud API was called.

## Gap classification / proposed coverage response

- **Represented:** six normalized entity/ancillary collections (Recording, Release, Appearance, candidate position, recent observation, source QA); exact audited direct relations and per-sheet counts within the checks stated above.
- **Partial:** detailed distributor coverage is only counted or reflected in summary/provenance fields, not retained as independent detailed rows. Channel statuses, reference dates and source evidence are historical observations.
- **Omitted:** independent dashboard body and original source/method body. These need a field-level review, not blind copying into runtime; the 14 detailed distributor rows need an independently versioned evidence representation if required for a future living Catalogue.
- **Pending review:** how detailed positions join to source Release/Appearance without guessing; source-note provenance, contradictions, evidence freshness, ISRC/UPC duplicates and proposed creative Track links; which original worksheet facts are actually authoritative.
- **Not verified:** full cell-to-cell evidentiary equivalence; all ten-sheet semantic coverage; live channel publication; reviewed cover/genre; future durable commercial identity/migration; new private service/storage/free-tier CPU suitability.

The previously owner-reported **355 pending parser findings** have **not** been resolved or certified by this audit. The older `444` normalized record count and original row-count denominator must remain separately labeled.

## Enriched *local-only* exporter contract — draft, not implemented

A separately reviewed next schema version should **retain existing v1 unchanged** and add, after explicit owner approval:

1. Independent detailed-distributor evidence rows with private source namespace/row provenance, exact external Release/position reference where actually documented, source-observed timestamps/status and original evidence. No automatic consolidation with existing 109 appearances or 28 candidate positions; check overlap and duplication explicitly.
2. Source/method provenance and workbook/dashboard coverage metadata classified `represented`, `partial`, `omitted`, `contradictory`, `unverified` with clear separation of source facts versus derived/dashboard formulas; no real private method text in code/tests/CI.
3. Stable **source aliases** for independently namespaced Recording/Release/Appearance; enforce unique expected relationships and explicit null/unbound; no title, ISRC, UPC, creative slug or filename as canonical ID.
4. Source-specific versioned evidence references, optional/null/unknown truth, old-versus-new schema compatibility, bounded record/byte limits, exact validation failure classification and private-only diff output; strict reject before activation on invalid structural references.
5. Bounded independent fake-source regression fixtures for ten-section coverage, 14-style detailed rows as synthetic shape only, duplicate/conflicting identities, missing/late rows and private artifact scan. No production workbook, original IDs/titles/ISRC/UPC or historical local exporter source-specific assertions in GitHub.
6. No current-platform state, reviewed artwork, final commercial-to-creative Track mapping, writer/storage choice, publish/reconcile operation or auto-synchronization inferred merely by enriching export coverage.

## Owner gate / next independently scoped action

The private structural audit is complete within the bounded tests above. **Owner still needs to decide** which omitted/partial sheet bodies and independent detailed evidence fields should become private authoritative source facts, review the local exceptions and confirm whether to commission a synthetic-only schema/exporter contract. Any real richer export remains on the owner's private device/outside checkout until separately approved, with only this sanitized report in Git.

Do **not** merge/deploy this audit report without separate owner approval. Do not create Build123, alter the accepted import/runtime, persist source, open a commercial writer, reconcile original rows automatically, or modify LaunchPAD/Workers/R2. Studio CPU #238 and LaunchPAD #283 remain open without sustained Workers Free telemetry.
