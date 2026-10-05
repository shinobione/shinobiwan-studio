# A2.4-C / C5 — reviewed first migration from local source v2 (fictional dry-run only)

Date: 2026-10-04. **STACKED DRAFT / NO RUNTIME IMPLEMENTATION / NO PRIVATE OWNER SOURCE.**

## Integration dependency and status

**C4 prerequisite is PR #255**, still Draft, exact tested C4.3 head \`5c90ac6968d818615332ec3724ffeb0e39c2b6c7\`, CI #829 SUCCESS (25/25 C4 tests). This C5 candidate is deliberately **stacked on the C4 feature branch**, not on \`main\`. Do not merge C5 ahead of C4 or independently widen Build124. The deployed, owner-confirmed runtime remains Build124 / v0.19.46; owner DevTools Network/Storage smoke for its *fictional-only* lab is still pending.

This document is the next **reviewed migration planner**, not the actual migration, an accepted inner registry, an audited cryptographic product, Build125 or a real-source encrypted export. No user JSON, workbook, ISRC, UPC, appearance ID, original evidence, digest, private title or password is used, committed, uploaded or printed by this test.

## Real public code paths under test / explicit source claims

The test-only C5 harness invokes the actual accepted \`src/catalogue/import-v2.ts\` adapter and its inherited v1 parser with a completely independently invented \`catalogue-readonly-seed-v2\` fixture, \`a24b2-local-0.1.0\`. A successful read-only parse is a **structural input gate**, not a human review or authorization to create the commercial registry.

The \`snapshot.source.inputSha256\` is the hash of **the exact selected source JSON bytes**. The separately reported \`sourceSha256\` / \`claimedWorkbookSha256\` is a historical assertion from the exporter and **must remain \`claim-only\`** unless independently corroborated by bytes of the actual original workbook. No private checksum is written to Git or public URLs.

C5 must preserve the exact \`sectionCoverage\` entries, including partial, omitted, contradictory/unverified and differences between normalized counts and original bodies. Ten named sections in an example are not proof that ten original sheet bodies were retained. Evidence data can be independent of, and linked to, an existing Appearance; it cannot increase Recording/Release/Appearance counts.

## Proposed initial migration review packet — not a public schema yet

A future private owner-reviewed transaction needs these independent inputs:

1. **Exact source:** the transient v2 JSON and its *actual read-only parser* result. If the parser rejects or an exact evidence reference is inconsistent, STOP without repairing by title, ISRC, UPC, index or source row order.
2. **Registry base:** an explicitly owner-selected private registry identity, expected revision, expected fingerprint and known source alias mappings, or a separately reviewed new empty registry. No automatically generated identity from the source file or artist title.
3. **Human attestation:** reviewer authorization for an exact mapping \`(sourceNamespace, kind, sourceId) -> owner-reviewed commercial targetId\`; for each Appearance separately attest its exact source Release, documented position or explicit null and Recording ID or explicit null. One reviewed target per source identity; proposed same-target dedup requires a **separate merger decision**, not this slice.
4. **Evidence/coverage acknowledgement:** show every pending QA count, unlinked detail, partial/omitted section and unsupported mapping before the final approval. No hidden \`approve all\`. Channel status starts **unknown** unless a separately classified historical event can be proposed; historical Amuse delivery is not verified live.
5. **Migration proposal:** compute \`unchanged\`, \`source-changed\`, \`proposed-new\`, \`missing-from-current-snapshot\` (never delete), \`unbound\`, \`unlinked-detail\`, and \`conflicting-alias\`. The reviewer may *inspect* proposed immutable source/evidence material and target counts. Only an independent later C5b authorization could mint the reviewed entities and create an encrypted portable package; no write at planning time.

**C4.1 resolution in the stacked base:** the draft C4 schema now explicitly supports immutable \`linkState: unlinked\` distributor detail with no commercial target plus a global pending finding referencing that evidence. C5 may therefore preserve such evidence in the migration proposal **without creating any Recording/Release/Appearance or source alias for it**. It remains unresolved and cannot support a review decision/channel status until a later exact human mapping creates a new reviewed revision. C4.3's exact-head synthetic validation passed 25/25 before this combined C5/C5b rerun; that is a test receipt, not merge approval or production persistence. C4.3 preserves generic \`unattached\` source evidence, source/evidence-scoped pending QA, exact v2 coverage, encrypted evidence payload and normalized entity metadata, allowing C5b to build a complete fictional registry without inventing targets or losing source context.

## Non-destructive transactional contract

- \`previewMigration\` returns an immutable **proposal only**, \`writes = 0\`, \`deletions = 0\`, \`automaticApprovals = 0\`, and has no browser/storage/network/filesystem/crypto runtime side effects. It does not mint commercial IDs itself.
- An accepted same-input replay yields an idempotent result. A modified source at the same alias yields a **changed-source** proposal and a new private snapshot; no overwrite of earlier evidence. Absent aliases are shown as missing-from-current-snapshot, never as deleted.
- Source namespace and entity kind are part of alias identity. Position belongs to the exact Release/Appearance, not an inferred match. Duplicate titles and ISRC are metadata, not proof of identity.
- An invalid or missing review mapping, reused conflicting target, foreign registry, expected-revision/fingerprint mismatch, changed source digest after review or invalid *linked* evidence gives **HOLD** or structural rejection with no partial result and no persistence. A structurally valid unlinked detail is instead preserved as targetless immutable evidence + pending global finding; it never becomes an entity or implicit mapping.
- Snapshot source coverage (including contradictory/unverified) is review material; an incomplete source cannot be silently represented as complete.
- Subsequent eventual real migration must fence async review generations and require explicit final owner confirmation. A source change/Reset/refresh during review invalidates the proposal; downloaded encrypted file is not a verified durable backup until separately saved/reopened and a second independently stored copy is proven.

## Fictional test scope

\`scripts/test-a24c-c5-reviewed-migration.mjs\` is a standalone CI-only Node test of the **actual accepted v2 parser** plus an invented manual-review packet, prior-registry descriptor and a pure proposal planner. It checks exact mapping, v2 linked evidence, retained section coverage, unbound association, pending QA, missing/ambiguous review, title/ISRC non-authority, changed and repeated sources, stale expected revision and digest, immutable prior state, **unlinked evidence preservation without target/entity creation**, and no publication inference.

This suite does **not** imply that an entire C4 registry object has been serialized/validated, encrypted to a recoverable real file, approved as a true source of commercial authority, linked to Studio Tracks or synchronized with LaunchPAD. Any true migration and first commercial Save/Restore requires a new, separately approved build and owner-only privacy/backup smoke; C4/C5 draft merges cannot grant this authority by themselves.

**STOP:** PR #255 remains Draft and unmerged until separately authorized; this stacked C5 PR remains Draft and cannot merge independently. The C4.1/C4.2/C4.3 targetless-evidence, global-QA and source/evidence-fidelity extensions must be accepted as part of C4 before C5/C5b can ever be considered for merge. No Build125/version change, real JSON, actual commercial entity creation, private file write, Pages/Worker/R2/LaunchPAD modification or automated sync.
