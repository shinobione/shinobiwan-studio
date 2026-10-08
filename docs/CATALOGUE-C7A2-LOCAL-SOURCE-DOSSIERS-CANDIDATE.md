# C7a.2 — source-only human review dossiers (Draft candidate)

2026-10-08. **Feature branch only · never auto-merge · no source migration or commercial export.**

## Baseline and scope

C7a (PR #265) is merged and GitHub Pages #279 succeeded on `ea23398679b7e5f65e9f9ab57c0094fb8ff7cb21`. Owner browser smoke observed a v2 read-only aggregate preview and navigation. Source bytes remain with the owner. Studio runtime remains **v0.19.47 · Build125** pending a separately approved release decision.

This small C7a.2 candidate extends the **existing** private Catalogue Overview. The accepted local v2 parser/session yields:
- source-only dossiers for all Recordings, Releases, bound and unbound Appearances;
- exact normalized source IDs, existing source relationships, evidence references and precisely evidence-linked QA codes;
- a separate queue of independent distributor detail evidence *without* an exact linked Appearance;
- a count of pending findings not exactly linked to those dossiers;
- paginated, keyboard-operable local browsing, expandable evidence notes and explicit HOLD state.

None of these are **registry matching proposals**. In particular, the displayed source IDs are not approved commercial target IDs. Namespace authority is intentionally unassigned. Duplicate titles, ISRCs, UPCs, release positions and source row order never create a match or justify deduplication. The source's historical publication claims do not prove live DSP presence.

## Safety contract

1. Enter only after accepted `catalogue-readonly-seed-v2`, with enrichment and **zero rejected rows**. V1 and invalid v2 remain outside this view.
2. No independent importer/file chooser, network call, upload, storage, crypto, file output, log of source identifiers, new worker or registration of real data. Only the existing in-memory Snapshot is an input.
3. Every dossier says `HUMAN_REVIEW_REQUIRED`; reviewed namespace and commercial target are `null`; `automaticMappings = 0` and `commercialWrites = 0`.
4. Preserve unbound Appearances, independent unlinked distributor evidence, global/unscoped QA and incomplete source coverage. Show exact evidence associations only, never title/ISRC joins.
5. Reset, source replacement and route exit rely on existing Catalogue session lifecycle; this adds no durable or shared app state. Refresh discards it.
6. All CI fixtures are invented; no owner JSON/workbook, names, source hashes, private titles, passwords or credentials enter source control, CI or this document.

## Acceptance checks before any merge

- `npm run check:c7a2` (12 invented-only assertions) and full inherited `npm run build` green.
- Source-only review on actual owner browser, using existing local v2 picker, with no production write. Inspect `Network` and same-origin Storage before/after if claiming confidentiality; screenshots are not a security audit.
- Verify counts, show an unbound source Appearance and unattached distributor detail without any inferred target, browse across pages and reset the source to clear all dossiers.
- Independent owner decision for Ready/merge/deploy. Even successful release does **not** authorize C7b or first real encrypted Save/Restore.

## Remaining work (not part of C7a.2)

A true matching proposal would need owner-reviewed `(sourceNamespace, kind, sourceId) -> commercial targetId`, an independently selected private registry identity/revision/fingerprint, explicit Appearance associations, evidence/coverage acknowledgement, conflict and stale guards, and further human decision gates. No registry has been selected or read by this candidate.

**STOP:** no C7b, commercial encoder, migration, save, registry minting, automatic title/ISRC binding, Studio Track link, Worker/R2/LaunchPAD mutation, publication verification or bidirectional sync.
