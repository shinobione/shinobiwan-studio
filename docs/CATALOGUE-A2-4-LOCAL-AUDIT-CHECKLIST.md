# A2.4-A — Local-only source coverage / identity audit checklist

Date: 2026-09-27. **Planning checklist only. No private package has been opened or exported in this GitHub task. No approval to implement a new exporter, persist, upload, or modify private sources.** Follow the broader [living Catalogue architecture proposal](CATALUE-A2-4-LIVING-ARCHITECTURE-PROPOSAL.md).

## Scope and local-only execution boundary

The original ten-sheet private workbook is the historical evidence package. The accepted `catalogue-readonly-seed-v1` derived JSON represents eight source-sheet counts but not all original sheet bodies and separately detailed Amuse evidence. Work with the owner in an explicitly authorized *local environment outside the repository*. No private workbook or derived V5 package, hashes/fingerprints, original sheet rows, ISRC/UPC values, cover asset, ID mapping, screenshot, source-specific path or raw review log may be copied into GitHub code, Issues, PRs, CI, Pages, Worker/R2, analytics or this chat as audit proof.

Do not change the accepted Build119 parser schema or A2.3 session lifecycle to compensate for missing source coverage. Audit source completeness first; treat unknown as unknown and contradictory evidence as pending owner review.

## Private check matrix (fill locally; only a sanitized disposition goes into a later PR)

| Audit question | Local verification requirement | Permissible public summary |
| --- | --- | --- |
| Original package | Enumerate ten actual sheets, relevant data regions, provenance/version and source ownership. Confirm the exporter maps all required sections. | Total expected/covered/omitted sections, not private sheet content |
| Existing derived schema | Compare eight represented source-sheet counts and actual array membership, optional/null fields, strict version, dates, row/reference integrity and source fingerprint claim against original bytes locally. | Covered/missing/ambiguous counts and schema limitations; no fingerprint itself |
| Missing detailed Amuse | Determine whether separate detailed rows, their exact release/position association, status evidence and timestamps are independent data needed by a richer export. Avoid double-counting overlap with existing candidate/appearance data. | Count/category of additional evidence and remaining ambiguities, not rows |
| Identity preservation | Compare exact Recording, Release and Appearance source IDs; duplicates, reused source IDs across namespaces, position ownership and orphan references; independent commercial vs creative identities. | Counts by conflict class; no original identifiers |
| ISRC/UPC and provenance | Known/missing/invalid/duplicate codes, contradictory occurrence vs Recording values, evidence source and historical/verified dates; no code-based automatic merger. | Aggregate QA classes only; no actual codes |
| Channels and milestones | Separate SoundCloud, LaunchPAD public publishing, Amuse submission/acceptance, DSP delivery/verified live and Spotify pitch. Identify what is *observed* vs *freshly verified*. | Coverage by channel/event evidence type, no user links or URL bodies |
| Artwork | Assess if any reviewed exact commercial Release cover source exists; distinguish creative Album assets, raw source URL and local owner-selected cover files. | Present/missing/review-needed counts only |
| Creative Track binding | Identify proposed vs human-reviewed exact mapping evidence and possible conflict; review creative data only through an authorized independent private method. | Pending/reviewed/conflicting counts, no mapping pairs |
| Pending QA | Prove every existing finding survives independently of filtered views and source changes. Count categories needing owner decision. | Counts by broad category only; never imply resolved |
| Future lifecycle | Identify true revisions, timestamp sources, incremental reimport/delta strategy, partial failure and rollback expectations; do not assume historical workbook is an event ledger. | Risks, required new fields and owner decisions |

## Required local-only outcome

1. A coverage matrix with each original section classified `represented`, `partial`, `omitted`, `contradictory` or `unverified`, and one source/evidence explanation retained privately.
2. Proposed **versioned** richer local exporter contract with documented record fields, source provenance, stable source aliases, no automatic name/code matching, null/unknown handling, and export/validation limits; input schema transition is **not** authorized here.
3. An identity/migration dry-run plan returning new, unchanged, changed, orphaned, unbound, conflicting and needs-owner-review categories; original snapshot remains immutable. Commercial durable IDs are not silently minted/merged by source title/ISRC.
4. An explicit list of facts that cannot currently be certified: missing evidence, unresolved channel availability, artwork/genre/creative links and real release/pitch dates. Never fill by guess.
5. A **sanitized owner decision note**: categories + aggregate counts, proposed extra field names, unresolved questions, a yes/no permission for a later synthetic-only contract prototype. Keep all actual rows, names, titles, codes, URLs, fingerprints, reviewer identifiers and detailed logs only in the user's protected local files.

## Audit sign-off / blockers

Owner checks source-package coverage and accepts a *bounded completeness statement*, not an automatic import into a future database. Open issues and previous 355 source-specific pending findings are not resolved by the audit. No snapshot is pushed to GitHub or passed to public CI. No persistent storage/secret/Worker/write path, Build123/version, creative Track mutation, cover publication, LaunchPAD sync or DSP action may be introduced until separate explicit scope, security/authority design and real-user gates are approved. CPU issues [STUDIO #238](https://github.com/shinobione/shinobiwan-studio/issues/238) and LaunchPAD #283 remain open without sustained telemetry.
