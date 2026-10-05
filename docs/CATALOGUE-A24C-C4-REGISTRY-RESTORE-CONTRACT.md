# A2.4-C/A — C4 private commercial registry and encrypted recovery contract

Date: 2026-10-04. Status: **DRAFT — contract and fictional-only CI; NOT IMPLEMENTED AS A STUDIO REGISTRY**.
Baseline: Build124 / v0.19.46 merged [PR #254](https://github.com/shinobione/shinobiwan-studio/pull/254), GitHub main at \`705df3a15fd6ea8076615d1d523564501e6b2362\`. Owner confirmed the production build/version and visually demonstrated the fictional package generate/download/open/Reset success. **The distinct DevTools Network/Storage owner smoke for Build124 has not been visually furnished; it remains pending.** Current Studio lab can encrypt **only its invented fixture**. This C4 candidate does not change that behavior.

## Scope, authority and what is *not* authorized

The owner selected A: explicitly saved, owner-held, portable encrypted registry. C4 plans the **inner private registry model** and fail-closed recovery, and rehearses it in CI using an unrelated invented example. Existing v1/v2 source input is historical evidence. No private source, actual artist/track/ISRC/UPC/title, workbook, local file path, screenshot, digest, password or genuine commercial row enters Git, Pages or CI.

A commercial Recording is neither a creative Studio Track nor a new recording every time the same source provides an Appearance. A Release owns ordered Appearance identities; an Appearance's Recording association may stay null. Distinct reviewed mappings are necessary to link commercial entities to creative entities. Original historical source details, human review, channel observations and current live verification are **different authorities**. Unknown availability is not absent or verified live.

**No C4 production code, Build125/version increment, real private encrypted export, private registry promotion, Worker/R2/LaunchPAD write, public projection, automatic sync, merge or deployment is approved by this review-only slice.** In particular, C4 must not reuse the Build124 hardcoded-fixture codec as an actual commercial encoder.

## Inner, encrypted-only schema proposal

Outer envelope remains the separately reviewed C2 candidate: minimal \`SHINOCAT-PKG\` v1 header, bounded PBKDF2-HMAC-SHA256, per-export fresh salt/nonce, AES-256-GCM authentication of both header and ciphertext. This document does not certify the primitives as an audited production system. **Every field below belongs exclusively inside authenticated ciphertext**, not a filename, plaintext header, URL, public record, log or analytics event.

\`schema: shinocat-commercial-registry-v1\` has exact top-level fields in this proposed ordering:

| Field | Purpose / validation |
| --- | --- |
| \`schema\`, \`registryId\`, \`revision\` | Exact supported schema, private opaque registry identity and nonnegative safe-integer revision; no fallback to a v1/v2 source |
| \`parentRevision\` | Explicit prior revision (null only for revision zero; otherwise revision minus one); never an inferred fresh registry |
| \`sourceSnapshots[]\` | Immutable source observations: opaque snapshot ID, source namespace/revision, privately held original-byte digest **only if independently computed**, exporter schema, capture/observation time, section coverage including partial/omitted distinctions; exporter-provided workbook digest remains an **unverified claim** without actual original workbook bytes |
| \`recordings[]\` | Independent opaque commercial IDs, optional ISRC and metadata; duplicate title/code allowed; no Studio Track link without reviewed decision |
| \`releases[]\` | Independent opaque release IDs, optional UPC, descriptive metadata and artwork provenance; no implicit Track/Album or platform status |
| \`appearances[]\` | Stable opaque ID, exact \`releaseId\`, positive documented position or explicit null if undocumented, \`recordingId\` or null; one exact release/position placement cannot silently identify two appearance IDs |
| \`sourceAliases[]\` | Versioned, namespaced \`(sourceNamespace, entityKind, sourceId)\` mapped to a **reviewed** commercial target and an existing source snapshot; no merge based on title/ISRC/UPC |
| \`evidence[]\` | Immutable evidence ID, snapshot ID, evidence class and source-row alias. \`linkState: linked\` carries an exact commercial target; distributor-detail \`unlinked\` preserves a source Release/position + issue code with **no target**; generic source evidence may be \`unattached\` with no target or inferred entity. Linked distributor detail must resolve to the already-existing exact Appearance. |
| \`findings[]\` | Source-derived QA finding with exact \`scope\` (\`target\`, \`evidence\`, or \`source\`), machine-readable code, locator and pending/reviewed state. Target scope references a proven commercial entity; evidence scope references immutable evidence; source scope references a source snapshot even when no row evidence exists. Global QA is preserved without inventing a target. |
| \`reviewDecisions[]\` | Append-only human decision ID, reviewer, exact target, evidence refs, rationale, operation identity, expected revision and disposition; review does not erase underlying immutable evidence |
| \`channelEvents[]\` | Independent historical event, channel/subject, occurrence and observation times, source evidence, assertion strength and verification class. Distributor “delivered” and platform “verified live” are not synonyms |
| \`audit[]\` | Append-only per-revision/operation receipt **inside ciphertext**. Authenticated encryption protects package bytes; a self-reported inner hash alone is not an external anti-rollback authority |

IDs are opaque and stable inside this private commercial registry. Schema and list size limits, exact types, duplicate keys, referential integrity, bounded strings and all relationship checks must run **after successful AEAD authentication but before activating state**. Any invalid edge rejects the entire candidate atomically.

### C4.1 — immutable unattached evidence

Historical evidence is allowed to exist **without a commercial target** when the source itself cannot prove the target. Such a row must remain immutable and explicitly `linkState: unlinked`; both `targetKind` and `targetId` are null, while its source snapshot, source-row alias, original source Release/position (when present) and machine-readable `linkIssueCode` are retained inside ciphertext. The registry must also retain a pending **global finding** that references that evidence ID. This combination is the only accepted targetless form.

No review decision, channel event, entity count, source alias or creative binding may be created from unattached evidence. Titles, ISRC/UPC, source row order and similar metadata cannot repair it. A future human decision that establishes an exact target must append a reviewed mapping/new evidence state under a new revision; it must never mutate the old unattached observation into looking as though it had always been linked.
### C4.2 — global source evidence and QA without commercial identity

The accepted v1/v2 parser can emit source evidence and findings that are deliberately **not commercial-entity claims**: unverified distributor candidates, channel observations pending verification, source QA rows, and source-wide coverage warnings such as \`DERIVED_SOURCE_COVERAGE_INCOMPLETE\`. C4.2 preserves them explicitly rather than forcing them onto a Recording/Release/Appearance.

- Generic immutable source evidence uses \`linkState: unattached\`, has no target, no source Release/position and no implicit identity. Its source snapshot and source-row alias remain private provenance.
- \`finding.scope: evidence\` may reference linked, \`unlinked\`, or \`unattached\` evidence and must identify the same source snapshot; target fields remain null.
- \`finding.scope: source\` references a source snapshot directly, carries no evidence/target and preserves source-wide warnings.
- \`finding.scope: target\` is the only finding form allowed to name a commercial entity; optional linked evidence must match that exact target.
- Every finding preserves its machine-readable code and source locator. Imported pending QA never becomes human-reviewed merely because a registry is built or restored.

Evidence/source-scoped findings cannot support a review decision, a verified channel event, creative Track link or entity creation. A later human decision must append new reviewed state under a later revision; the original QA/evidence remains immutable.

### Source-to-registry is not an import-side effect

The accepted Build123 v2 parser may yield a transient, historically incomplete snapshot. **C4 does not promote it automatically.** A later separate human-reviewed migration must show an exact diff: unchanged, proposed-new, changed-source, missing-from-current-snapshot (never delete), conflicting aliases, unbound and partial/omitted sections. First commercial identity creation requires explicit authority and a recorded review decision. The 14 linked historical detail observations seen in the previous private test illustrate evidence enrichment of existing Appearances, not extra commercial entity counts; those actual observations must never become public test fixtures. Existing unresolved QA remains unresolved.

## Revision/restore transaction — proposal only

A future app flow has independent stages:

1. **Select file explicitly.** Enforce outer byte/KDF/format limits before derivation. Decrypt and authenticate whole envelope into transient memory; password failure and tampering must not leak the underlying plaintext or replace active state.
2. **Validate exact inner schema and all relations** before any state change. A JSON claim about original workbook bytes is not magically verified by decrypting it. Reject foreign \`registryId\`, unsupported future schema, duplicate IDs, invalid evidence or unsupported history; no repair-by-title.
3. **Compute private candidate digest locally** over the canonical inner candidate after validation. Display *inside an authenticated transient view*: current registry identity/revision vs candidate, source coverage/omissions, entity counts, pending review, channel-event status and meaningful diffs. Never put the digest in URL, title, exported filename or public logs.
4. **Require a separate explicit confirmation** for Restore, including the authenticated candidate identity and the *observed* current revision/digest. Newer-than-current is a proposed restore, not automatic. Same revision + same digest is idempotent; same revision with different digest is a conflict. Foreign registry is always rejected. Older revision is blocked by default; an owner-selected recovery rollback requires separately reviewed high-friction confirmation, independent backup, audited intent and careful handling of later approved decisions — **not implemented here**.
5. **Activate atomically only after verified candidate + unchanged in-memory generation/revision/digest + human confirmation.** If a new source/import/reset/route-exit occurs during authentication, the stale async result is discarded. Failure leaves the old in-memory view untouched. No browser Storage as the registry authority; refresh/discard obeys the current privacy model until a separately shipped, explicitly owner-requested restoration.
6. **Save/backup is independent:** create a *new* encrypted versioned file by explicit download/Save As; do not overwrite the sole good file. Do not claim durable success from \`Blob\`, a download event or a copied pathname. Independently select/reopen the actual saved file, confirm authenticated inner identity/revision/digest and verify **a second independently stored copy**. The owner controls passphrase and backups. No developer/service backdoor; loss of secret or all files has no guaranteed recovery.

Crucial limitation: a package cannot alone prove it is the newest historical revision after all local state/backup manifests have been lost. AEAD prevents tampering, **not replay of an authentic older package**. An external trusted owner-maintained revision/recovery record or independently retained later backup is required to detect such rollback, and conflicts must be shown rather than concealed.

### Channel authority

\`status: delivered\` with historic Amuse evidence means an observed distributor delivery statement. Only a separate, sufficiently fresh platform-specific \`verified-live\` observation may justify an explicit “verified live at observedAt” statement; it cannot prove permanent/current availability. Missing channel history stays unknown. The schema supports future Studio draft, LaunchPAD, SoundCloud, Amuse, Spotify pitch/delivery/live histories without any automatic cross-system read/write.

## C4 synthetic gate and decisions still required

\`scripts/test-a24c-c4-registry-recovery.mjs\` is a **test-only module**, never imported by \`src/\`. It uses independently invented source/identity/QA objects and a fictional passphrase. It verifies schema/referential integrity, duplicate metadata vs real identities, exact linked evidence, targetless distributor evidence, generic unattached source evidence, source/evidence/target-scoped pending QA, review separation, channel-status truth, explicit revision/CAS/operation identity, rollback conflict/foreign registry, byte-authenticated encrypted restore rehearsal, corrupt/wrong-key rejection preserving current state, and package privacy. No real file is saved, uploaded or recovered. **A green CI is not a backup/audit certification.**

Before future C5 real-source opt-in the owner must separately approve the complete inner schema/migration and identity review process, actual crypto/password policy on their hardware, first save and two independently re-opened backup copies, explicit restore UX with rollback governance, private-browser DevTools Network/Storage checks and a source authority decision. Real file material stays entirely owner-local and out of CI/Git. No Build125 is allocated by C4.
