# A2.4-C / C5b — synthetic complete registry → encrypted disk copies → restore

Date: 2026-10-05. **STACKED DRAFT / TEST-ONLY / NO OWNER SOURCE / NO RUNTIME FEATURE.**

## Dependency and purpose

This slice is stacked on the C4.3 head from Draft PR #255 and includes the C5 reviewed-migration dry-run. C4.3 is the first draft schema in this sequence that can preserve: exact selected-source digest vs claimed workbook digest, exact v2 section coverage, normalized Recording/Release/Appearance metadata, linked/unlinked/unattached evidence with private observation payload, source/evidence/target-scoped QA, review decisions/audit, channel truth, and authenticated restore semantics.

C5b asks a narrower end-to-end question using **independently invented input only**: can an explicitly reviewed fictional v2 source become a complete C4.3 registry revision, be validated by the exact C4 contract, encrypted, written as two separate local files, independently reopened, and proposed for atomic restore without losing source coverage, evidence, QA, identity or channel truth?

This is **not** Build125, not a Studio export button, not an owner-data migration and not a claim that two CI temp files are independent physical disaster-recovery backups.

## Exact synthetic migration transaction

The test-only C5b harness uses the actual accepted `src/catalogue/import-v2.ts` parser. Its invented v2 source contains one reviewed Recording, one reviewed Release, one reviewed Appearance, one exact linked distributor-detail observation, one deliberately unlinked distributor-detail observation, the inherited unverified distributor candidate, channel observation, source QA row and source-wide coverage warning.

Before a registry is created, a fictional human review packet explicitly attests three identity edges: exact source Recording namespace + source ID → opaque commercial Recording ID; exact source Release namespace + source ID → opaque commercial Release ID; and exact source Appearance ID + exact source Release + documented position + source Recording ID → opaque commercial Appearance ID. No title, ISRC, UPC, row order or similarity is identity authority.

### Source snapshots

A single selected v2 export can contain aliases from several source namespaces. C5b creates namespace-scoped source-snapshot rows that all reference the same exact selected-input SHA-256 plus one export-level snapshot for global source evidence/QA. This does not pretend several source files exist. Each snapshot retains source schema, exporter contract, snapshot date, private source filename, claimed workbook digest with `claim-only` authority, and exact v2 `sectionCoverage` entries (`sourceRows`, original status, body-preservation mode and archived-v1-count agreement).

No section is silently promoted from `partial`, `omitted`, `contradictory` or `unverified` to complete.

### Evidence and QA

Every accepted parser Evidence row is preserved in the encrypted registry. Entity evidence becomes `linked` only where reviewed identity is exact; exact distributor detail stays linked to the existing Appearance; v2 detail with no proven target stays `unlinked`, targetless and creates no entity; generic source rows with no commercial target stay `unattached`; source locator, observed date, classification and note/payload remain encrypted registry content.

Every parser finding is also preserved with the same code, locator and pending state. Evidence-backed findings use `scope:evidence`; source-wide findings without evidence use `scope:source`; C5b does not turn imported QA into `human-reviewed`.

The initial migration decisions record only the three explicitly reviewed commercial identity mappings and exact linked evidence. Matching private audit receipts are appended at revision 1. The migration does not synthesize Studio Track links.

### Channel truth

The parser's channel observations are carried forward as `unknown` channel events tied to the reviewed Release and their linked evidence. No historical distribution string or URL becomes `verified-live`. A live assertion still requires a separate current-channel verification event.

## Encrypted file and recovery rehearsal

The candidate registry is checked with the **exact C4.3 test-library validator**, then sealed with the exact C4 candidate envelope (PBKDF2-HMAC-SHA256 → AES-256-GCM, fresh salt/nonce and authenticated header) using an invented passphrase.

C5b writes two independently encrypted ciphertexts into two separate files in a disposable CI directory. It then:

1. confirms the files have different salt, nonce and ciphertext despite identical authenticated registry fingerprint;
2. independently reads both files back from disk and authenticates/decrypts them through the exact C4 contract;
3. cross-decrypts one package with Node's independent PBKDF2/OpenSSL-backed AES-GCM primitives;
4. proves the outer files contain none of the invented title, QA code, evidence payload, source filename or registry identity in plaintext;
5. corrupts one disk copy and verifies it fails closed while the other copy still opens;
6. verifies wrong passphrase and modified authenticated header fail without replacing current state;
7. proposes restore from a valid empty revision-0 registry and requires explicit owner confirmation;
8. after confirmation, exact replay is idempotent, stale-current restore is blocked and an authentic older revision is blocked as rollback;
9. removes the disposable directory.

A successful `writeFile`/readback in CI proves only **two separate readable test files on one ephemeral machine**. It is not evidence of two physically independent owner backups, media durability, Windows/browser Save As behavior, password recoverability or disaster recovery.

## Stop line

C5b remains test-only. No `src/` runtime source is added or changed by this slice, package version remains **v0.19.46 / Build124**, and the real Catalogue reader remains temporary/read-only. No private owner JSON/workbook/title/ISRC/UPC/digest/password enters Git or CI.

C4, C5 and C5b require separate review/merge authority. Even a green C5b does **not** authorize Build125, a real private encoder, first commercial registry mint, owner source migration, automatic browser persistence, Worker/R2/LaunchPAD mutation, public projection or synchronization. The Build124 owner DevTools Network/Storage privacy check remains separately pending.