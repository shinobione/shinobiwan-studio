# Build119 / v0.19.41 — Catalogue A2.2 REAL USER PASS (bounded)

Date: 2026-09-27. **Owner-reported acceptance of the deployed local-private import/dry-run only.** This is a historical receipt, not an A2.3 or persistence acceptance.

## Exact code and deployment evidence

- Repository: \`shinobione/shinobiwan-studio\`; production branch \`main\`.
- Runtime: Build119 / v0.19.41, \`studio-focus-build119-catalogue-private-import\`.
- Implementation: [PR #242](https://github.com/shinobione/shinobiwan-studio/pull/242); reconciled exact candidate \`e2b4adc70da6952713c3e74f1987e92bd40e0348\`.
- Exact candidate validation: [Actions #36312536104](https://github.com/shinobione/shinobiwan-studio/actions/runs/36312536104) — SUCCESS; inherited regression gates, TypeScript, build and artifact/privacy check.
- Merge commit: \`20a0adf15271a0f9bff0cbd2a318c441685ec2bc\`.
- Automatic Pages: [Deploy #36316493317](https://github.com/shinobione/shinobiwan-studio/actions/runs/36316493317) — build and deploy SUCCESS on that exact merge SHA.
- This slice made no independent Cloudflare Worker deployment or R2/catalog mutation. Docs-only closeout does not allocate another runtime build.

## Actual owner-reported browser acceptance

After Pages publication, Shino explicitly confirmed that the imported private V5-derived JSON produced all expected aggregate results:

| Check | Reported result |
| --- | ---: |
| Source/accepted rows | 444 |
| Recording entries | 168 |
| Commercial release records | 84 |
| Source appearances | 109 |
| Known ISRC / missing ISRC | 120 / 48 |
| Rejected rows | 0 |
| Pending findings | 355 |

The owner also explicitly confirmed:
- QA section works after import.
- Reset / unload works.
- Browser refresh restores the empty/no-source-loaded state.
- In DevTools, the local source was not sent over the network or stored in browser storage.

These are owner statements about a bounded browser smoke, not an independently recorded browser trace or a formal security audit. Earlier [candidate validation](../CATALOGUE-A2-2-VALIDATION.md) separately reports synthetic selection, malformed rejection, keyboard reset and agent browser inspection. Do not recast agent evidence as an owner mobile/assistive-technology PASS.

## Accepted boundary and outstanding truth

**Build119 A2.2 is accepted for explicit, read-only, temporary, in-memory local-private JSON preview, structural validation, summary, provenance and paginated pending QA.** This acceptance does not resolve any of the 355 pending findings or certify a Studio Track match, ISRC, distributor delivery or current DSP publication. Current platform availability remains unknown unless separately evidenced.

The derived JSON does not preserve all the ten-sheet workbook evidence: dashboard/source-method bodies and a separate detailed Amuse table remain unavailable in the imported representation. Workbook fingerprint agreement and private local field comparisons are prior local audit evidence, not proof of full workbook equivalence. The full workbook remains the private reference.

Nothing has been persisted between reloads; the import must be explicitly repeated on a new session. No embedded commercial dataset, private source, new canonical authority, backend write, R2 mutation, platform synchronization, gallery or release publication is accepted here.

Original [Build118 A2.1 acceptance](BUILD118-REAL-USER-PASS.md) and later [bounded CPU recovery](BUILD118-CPU-RECOVERY.md) remain independent. CPU issues Studio #238 / LaunchPAD #283 remain open: a healthy sample is not sustained Workers Free CPU compliance. Superseded docs PR #237 remains open pending separate housekeeping, not part of this receipt.

## Next independent scope

[Catalogue A2.3 functional blueprint](../CATALOGUE-A2-3-BLUEPRINT.md): populated session-only native Overview, Releases, Recordings, details and evidence-linked QA. Artwork and genres must not be invented: the A2.2 audited derived source reports no artwork references and does not prove normalized commercial genre fields. Commercial persistence, explicit reviewed Track mappings and STUDIO ↔ LaunchPAD bidirectional changes require their own architecture/authority decision and authorization. A2.3 is **not implemented, merged, deployed or accepted** by this closeout.
