# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-15 after explicit **Build93 REAL USER PASS** and published acceptance-docs closeout.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.15
Build                   Build93
Status                  REAL USER PASS
Runtime PR              #162
Exact tested head       fcbe4c59a3a364d9665eba2ed432f37475116364
Final CI                31898542379 · SUCCESS
Historical CI #457      31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458      31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Runtime merge           6c1ceb7d59971ec6c7e251532054392f02c08157
Pages                   31898639778 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #163
Candidate docs CI       31899284370 · SUCCESS
Candidate docs merge    6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages    31899342536 · SUCCESS
Acceptance docs PR      #164
Acceptance docs CI      31901050237 · SUCCESS
Acceptance docs merge   8df0417ee4d96de1e1b386c0fb15af60dcdbc661
Acceptance docs Pages   31901109789 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user verdict       BUILD93 PASS MADAFAKA · 2026-08-15
```

## Build93 automated coverage — GREEN

Final validation run `31898542379` passed the complete repository-native chain on exact head `fcbe4c59a3a364d9665eba2ed432f37475116364`, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics save response-loss guard;
- inherited Phase9 Build84 SonicTrace save response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- inherited Phase9 Build89 Album private-read transient retry guard;
- inherited Phase9 Build90 Lyrics private-read transient retry guard;
- inherited Phase9 Build91 SonicTrace private-read transient retry guard;
- inherited Phase9 Build92 Track metadata response-loss guard;
- new Phase9 Build93 Track metadata validation transient retry guard;
- Studio Focus inherited regression guards through bounded Build93 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical run `31898251689` was red only because the inherited Phase7-C Build69 successor allowlist stopped at `0.19.14 / Build92`. No Build93 runtime behavior was changed to repair that run and the red head was never merged.

Historical run `31898329621` then passed Phase7-C, Phase8 and the complete Phase9 Build82→Build93 chain — including the new Build93 guard — and failed only because inherited Studio Focus Build64 still stopped at `0.19.14 / Build92`. Focus Build64–67 were widened only to recognize `v0.19.15 / Build93` and preserve Build92 ancestry; their functional assertions remain intact. That red head was never merged.

Build93 specifically guards the non-mutating Track metadata validation path:

```text
metadata-validate-v1 attempt 1
├─ timeout                            → one retry max
├─ transport/fetch interruption       → one retry max
├─ HTTP 408/425/429/500/502/503/504  → one retry max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return reviewed proposal

attempt 2 failure → surface immediately
```

Additional Build93 guarantees:

- maximum attempts are exactly two total;
- the existing finite 7-second timeout remains per validation attempt;
- visible **Validate** uses the hardened wrapper;
- Build92's fresh validation immediately before explicit Save uses the same hardened wrapper;
- plain and duration-aware `metadata-validate-v1` converge on the same bounded policy;
- duration remains derived canonical evidence and is not made editable;
- browser transport interruption is typed separately from Access in the duration-aware path;
- Access/session gating does not enter transient retry;
- invalid JSON/proposal shape does not enter transient retry;
- no generic retry/backoff framework is introduced;
- Build92 `metadata-save-v1` remains at zero automatic write retries;
- Build92 committed / not-committed / ambiguous / unverified response-loss recovery remains unchanged;
- no Track Manager, Worker or R2 schema/data mutation was required.

## Build93 real-user smoke — PASS

The acceptance smoke was intentionally a **normal-browser metadata validation regression**, not a manufactured transient-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD93 PASS MADAFAKA
```

The accepted smoke boundary covered the deployed `v0.19.15 · Build93` Track metadata validation path and surrounding normal product sanity. The user did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches merely to trigger the new retry. Automated guards own retry classification and attempt-bound proof.

Result:

```text
Build93 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build92 automated coverage — GREEN

Final validation run `31893496536` passed the complete repository-native chain on exact head `2b859d831f5fc46eea9853f31c4b86057041128b`, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics save response-loss guard;
- inherited Phase9 Build84 SonicTrace save response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- inherited Phase9 Build89 Album private-read transient retry guard;
- inherited Phase9 Build90 Lyrics private-read transient retry guard;
- inherited Phase9 Build91 SonicTrace private-read transient retry guard;
- new Phase9 Build92 Track metadata response-loss guard;
- Studio Focus inherited regression guards through bounded Build92 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical run `31893447100` was red only because the inherited Build80 duration-evidence guard still expected validation and save bridge checks in the same source file. Build92 intentionally moved the save seam into the resilient Track metadata service. The guard was updated to protect the same bounded `5.22/1.12` + `5.23/1.13` contract across both seams; no runtime product change was made to repair that red run. The red head was never merged.

Build92 specifically guards canonical Track metadata save:

```text
metadata save response unavailable
→ NEVER automatic retry
→ private canonical Track reread
   ├─ new revision + exact reviewed normalized proposal
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry safe after reconnect
   ├─ changed revision but exact reviewed proposal unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build92 guarantees:

- the same non-mutating metadata validation is repeated immediately before POST;
- reviewed proposal is anchored to exact Track ID + `expectedUpdatedAt`;
- private pre-write Track reread rejects stale canonical revision;
- optional audio evidence uses only the bounded Track Manager/bridge pairs already accepted by the duration-evidence contract;
- derived `duration` remains non-editable but is included in the exact reviewed proposal when evidence exists;
- timeout and transport loss are typed separately as `TRACK_METADATA_SAVE_TIMEOUT` / `TRACK_METADATA_SAVE_TRANSPORT`;
- response-loss recovery starts only for those typed timeout/transport failures;
- Access gating, invalid JSON and ordinary server rejection do not enter lost-response recovery;
- exact proposal comparison ignores only top-level runtime `updatedAt` and `updatedBy`;
- normal `saved:true` requires canonical reread revision === server `updatedAt` plus exact reviewed proposal;
- normal `noChange:true` requires original revision plus exact reviewed proposal;
- mismatch is ambiguous; unreadable reread is unverified;
- no `retryTrackMetadataSave` helper and no write retry loop exist;
- recovered-after-lost-response verifies canonical Track metadata/duration but does not fabricate an independently unobservable `catalogRebuilt:true` receipt;
- no Track Manager, Worker or R2 schema/data mutation was required.

## Build92 real-user smoke — PASS

The acceptance smoke was intentionally a **normal-browser metadata regression**, not a manufactured response-loss test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD92 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.14 · Build92`;
- opening one safe existing private canonical Track;
- one harmless reversible metadata edit;
- **Validate** and review of the normalized proposal;
- one normal explicit **Save**;
- canonical reread verification (`CANONICAL REREAD · VERIFIED`);
- persistence of the metadata edit after canonical reload;
- surrounding Track / Albums / Lyrics / SonicTrace navigation sanity.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/ambiguous-write branches. Those failure paths remain protected by automated Build92 classification guards.

Result:

```text
Build92 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build91 automated coverage — GREEN

Final validation run `31888303536` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics save response-loss guard;
- inherited Phase9 Build84 SonicTrace save response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- inherited Phase9 Build89 Album private-read transient retry guard;
- inherited Phase9 Build90 Lyrics private-read transient retry guard;
- new Phase9 Build91 SonicTrace private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build91 successor compatibility;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build91 validation run was required or merged.

Build91 specifically guards private Track Manager SonicTrace GETs:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build91 guarantees:

- non-timeout SonicTrace browser `fetch()` rejection is typed `SONICTRACE_READ_TRANSPORT`, not falsely presented as Cloudflare Access;
- existing 12-second state and 20-second catalog per-attempt timeouts remain finite;
- maximum attempts are exactly two total;
- a second transient failure surfaces immediately rather than starting a loop/backoff framework;
- canonical latest/history state uses the bounded helper;
- SonicTrace catalog uses the same bounded helper;
- the helper is GET-only and no longer accepts arbitrary `RequestInit` / methods;
- exactly the inherited Track Manager SonicTrace save POST transport remains;
- `SONICTRACE_SAVE_TIMEOUT` and `SONICTRACE_SAVE_TRANSPORT` remain unchanged;
- Build84 lost-response recovery still classifies committed / not-committed / ambiguous / unverified and never blindly retries a save;
- no automatic SonicTrace save/analysis retry helper exists;
- Deep Audio health/analysis XHR and canonical audio download remain separate and unchanged;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build91 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser read regression**, not a manufactured transient-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD91 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.13 · Build91`;
- opening a Track that already has canonical SonicTrace analysis;
- opening SonicTrace and confirming canonical latest/history state loads normally;
- opening a normal Studio surface that consumes the SonicTrace catalog / Intelligence data;
- surrounding Track / Albums / Lyrics / SonicTrace navigation sanity;
- no canonical write required because Build91 changes read behavior only.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches. Those failure paths remain protected by automated classification and attempt-bound guards.

Result:

```text
Build91 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build90 automated coverage — GREEN

Final validation run `31884568681` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics save response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- inherited Phase9 Build89 Album private-read transient retry guard;
- new Phase9 Build90 Lyrics private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build90 successor compatibility;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build90 validation run was required or merged.

Build90 specifically guards canonical Lyrics private GET:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build90 guarantees:

- non-timeout canonical Lyrics browser `fetch()` rejection is typed `LYRICS_READ_TRANSPORT`, not falsely presented as Cloudflare Access;
- the existing 7-second per-attempt timeout remains finite;
- maximum attempts are exactly two total;
- a second transient failure surfaces immediately rather than starting a loop/backoff framework;
- normal `getAdminTrackLyrics()` uses the bounded helper;
- Build83 `rereadLyricsTruth()` continues to combine canonical Lyrics reread with canonical Track reread;
- exactly the inherited Lyrics validate/save POST transport remains;
- `LYRICS_SAVE_TIMEOUT` and `LYRICS_SAVE_TRANSPORT` remain unchanged;
- Build83 lost-response recovery still classifies committed / not-committed / ambiguous / unverified and never blindly retries a save;
- no automatic Lyrics validation/save retry helper exists;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build90 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser read regression**, not a manufactured transient-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD90 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.12 · Build90`;
- opening a Track that already has canonical `lyrics.txt`;
- opening Lyrics and confirming canonical lyrics load normally;
- surrounding Track / Albums / SonicTrace / Lyrics navigation sanity;
- no canonical write required because Build90 changes read behavior only.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches. Those failure paths remain protected by automated classification and attempt-bound guards.

Result:

```text
Build90 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build89 automated coverage — GREEN

Final validation run `31881635973` passed the complete repository-native chain on the exact runtime head, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- inherited Phase9 Build88 core private-read transient retry guard;
- new Phase9 Build89 Album private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build89 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical runs `31881467538` and `31881538488` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at `0.19.10 / Build88`. Those heads were never merged. The final exact head `8b73d19d8fced35642ee243cff0ac19d983fd0de` passed the full chain.

Build89 specifically guards canonical Album collection/detail private GETs:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build89 guarantees:

- non-timeout Album browser `fetch()` rejection is typed as `transport`, not falsely presented as `access-or-cors`;
- maximum attempts are exactly two total;
- a second failure surfaces immediately rather than starting a loop/backoff framework;
- `getAdminAlbums()` and `getAdminAlbum()` both use the bounded helper;
- private Album visual discovery inherits `getAdminAlbums()`;
- existing canonical Album rereads used by guarded verification/recovery inherit the same GET helper;
- every Album POST/write transport remains unchanged;
- no automatic Album write retry exists;
- Album create/upload response-loss semantics remain unchanged;
- Lyrics private-read transport was a separate audit family at Build89;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build89 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured network-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD89 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.11 · Build89`;
- Albums loading the normal private canonical Album inventory;
- opening at least one canonical Album detail;
- private artwork / metadata loading normally;
- surrounding Track / Lyrics / SonicTrace navigation sanity.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches. Those failure paths remain protected by automated classification and attempt-bound guards.

Result:

```text
Build89 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build88 automated coverage — GREEN

Final validation run `31871980725` passed the complete repository-native chain on the exact runtime head, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- inherited Phase9 Build87 Album membership response-loss guard;
- new Phase9 Build88 private-read transient retry guard;
- Studio Focus inherited regression guards through bounded Build88 successor compatibility;
- TypeScript typecheck;
- Vite production build.

Historical runs `31871834515` and `31871883072` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at `0.19.9 / Build87`. Those heads were never merged. The final exact head `808b0c63fc22f17a04a9c544b934d97c791d3a73` passed the full chain.

Build88 specifically guards the common core private GET path:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Additional Build88 guarantees:

- non-timeout browser `fetch()` rejection is typed as `transport`, not falsely presented as `access-or-cors`;
- maximum attempts are exactly two total;
- a second failure surfaces immediately rather than starting a loop/backoff framework;
- public catalog fallback remains unchanged and is reached only after the private helper ultimately fails;
- the bounded retry applies only to private bridge health, Track inventory and Track detail GETs;
- metadata validation/save POST transports remain unchanged;
- no automatic write retry exists;
- no Album create/upload behavior changed;
- no Worker, Track Manager or R2 schema/data mutation was required.

## Build88 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured network-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD88 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.10 · Build88` runtime;
- Home / Tracks loading the normal private inventory, including Draft Tracks when present;
- opening a Track and loading normal private canonical detail;
- surrounding Albums / Track / Lyrics / SonicTrace navigation regression sanity.

Acceptance intentionally did **not** require cutting network, expiring Cloudflare Access or manufacturing timeout/transport/HTTP transient branches. Those branches remain protected by the automated Build88 retry-classification and attempt-bound guards.

Result:

```text
Build88 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build87 automated coverage — GREEN

Final validation run `31870328730` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- inherited Phase9 Build86 Album move response-loss guard;
- new Phase9 Build87 Album membership response-loss guard;
- missing-prior-Track cleanup behavior;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build87 CI run was merged or required.

Build87 specifically guards:

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track-cache reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + stable Album non-membership shape
   │  + every Track cache equals its expected postcondition
   │  + only Tracks requiring cache mutation changed revision
   │  + Track non-album shapes remain stable
   │    → COMMITTED / VERIFIED
   ├─ exact Album + Track pre-write state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed/changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build87 guarantees:

- exact Album revision is checked before POST;
- the snapshot/reread covers the union of previous and requested Track IDs;
- requested Tracks must exist;
- a historically missing prior Track can still be removed safely;
- requested Track cache must converge to the Album;
- removed Track whose cache claimed the Album must converge to transitional `Singles`;
- removed Track whose cache did not claim the Album must remain cache-stable;
- Album non-membership and Track non-Album shapes must remain stable;
- Tracks that require no cache mutation remain revision-stable;
- normal HTTP success verifies exact returned Album revision/order, every affected Track cache and server `trackCachesUpdated` when supplied;
- recovered success explicitly states that Studio did not retry the write.

The deployed Track Manager backend was audited read-only and already owns stale guards, ownership-conflict validation, deterministic membership/cache updates, catalog rebuild and rollback. No backend mutation was needed for Build87.

## Build87 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD87 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.9 · Build87` runtime;
- opening a safe canonical Album with at least two existing Tracks;
- harmless reordering of existing Tracks using the Album tracklist controls;
- one normal **Save tracklist**;
- verified receipt **`Album tracklist saved and canonically verified across Album + Track caches.`**;
- ordered tracklist persistence after canonical reload;
- reordered Tracks retaining the same Album compatibility-cache ownership;
- surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation regression sanity.

Acceptance intentionally did **not** require cutting network, invalidating Access or sabotaging a production membership save merely to force timeout/partial-write branches. Those failure paths remain protected by typed classification, stale guards and private canonical Album + Track-cache reread logic.

Result:

```text
Build87 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build86 automated coverage — GREEN

Final validation run `31868536718` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- inherited Phase9 Build85 Album metadata response-loss guard;
- new Phase9 Build86 Album move response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build86 CI run was merged or required.

Build86 specifically guards:

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ exact new target revision/order
   │  + exact source revision/removal when source exists
   │  + Track cache points to target
   │  + stable non-membership Album/Track shapes
   │    → COMMITTED / VERIFIED
   ├─ exact target/source/Track pre-write state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build86 guarantees:

- exact target revision is checked before POST;
- exact source revision is checked when a source Album exists;
- exact expected target artistic order and source removal are computed before POST;
- target/source non-membership shapes and Track non-Album shape must remain stable;
- normal HTTP success verifies exact returned target/source revisions and exact returned target/source tracklists;
- Album Manager cross-release move and Metadata `sourceAlbumId:null` authority repair use the same resilient service;
- recovered success explicitly states that Studio did not retry the write.

The deployed Track Manager backend was audited read-only and already owns stale guards, deterministic target/source membership, Track compatibility-cache update, catalog rebuild, canonical target/source/Track reread and rollback. No backend mutation was needed for Build86.

## Build86 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD86 PASS
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.8 · Build86` runtime;
- one genuine safe canonical Album → Album move;
- normal verified receipt **`Track moved and canonically verified across target, source and Track cache.`**;
- canonical source removal;
- expected target insertion/order;
- persistence after source/target reload;
- moved Track compatibility cache pointing to the target Album;
- surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation regression sanity.

Acceptance intentionally did **not** require cutting network, invalidating Access or sabotaging a production move merely to force timeout/partial-write branches. Those failure paths remain protected by typed classification, stale guards and private canonical target/source/Track reread logic.

Result:

```text
Build86 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build85 automated coverage — GREEN

Final validation run `31863267911` passed the complete repository-native chain on the exact runtime head **on the first run**, including:

- private-read contract;
- Phase5 algorithms;
- Phase6 Lyrics contract;
- C3 / Deep Audio / Album / parity guards;
- PHASE UX guards;
- Phase7 and Phase8 guards;
- inherited Phase9 Build82 destructive-write ambiguity guard;
- inherited Phase9 Build83 canonical Lyrics response-loss guard;
- inherited Phase9 Build84 SonicTrace response-loss guard;
- new Phase9 Build85 Album metadata response-loss guard;
- Studio Focus inherited regression guards;
- TypeScript typecheck;
- Vite production build.

No red intermediary Build85 CI run was merged or required.

Build85 specifically guards:

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Additional Build85 guarantees:

- before POST, Studio privately rereads the canonical Album;
- exact `expectedUpdatedAt` is required and stale pre-write state is rejected;
- only timeout/transport-loss failures enter recovery;
- stable non-metadata shape checks canonical identity, ordered `trackIds`, assets and `createdAt`;
- normal HTTP success is not called verified unless the reread has the exact server-returned revision, requested metadata and stable non-metadata shape;
- recovered success explicitly states that Studio did not retry the write;
- existing Album mutation UI reloads canonical state after errors before another operator decision.

The deployed Track Manager backend was audited read-only and already stale-guards, writes the proposed Album manifest, updates title-dependent Track compatibility caches when needed, rebuilds catalog, rereads/verifies and rolls back touched state on failure. No backend mutation was needed for Build85.

## Build85 real-user smoke — PASS

The required acceptance smoke was intentionally a **normal-browser regression**, not a manufactured failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD85 PASS
```

The accepted smoke boundary covered:

- hard refresh to the deployed `v0.19.7 · Build85` runtime;
- opening an existing safe canonical Album;
- editing one harmless metadata field;
- one normal **Save metadata**;
- verified receipt **`Album metadata saved and canonically verified.`**;
- canonical revision advance;
- saved metadata persistence after canonical reload;
- surrounding Albums / Track / Lyrics / SonicTrace navigation regression sanity.

Acceptance intentionally did **not** require cutting network, invalidating Access or sabotaging a production save merely to force timeout/partial-write branches. Those failure paths remain protected by typed classification, stale guards and private canonical reread logic.

Result:

```text
Build85 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build84 real-user smoke — PASS

Accepted predecessor:

```text
Version                 v0.19.6
Build                   Build84
Status                  REAL USER PASS
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final CI                31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Pages                   31858977765 · SUCCESS
Real-user verdict       BUILD84 PASS · 2026-08-15
```

The accepted smoke covered normal SonicTrace latest/history loading, normal scan/save with canonical verification and surrounding Track / Visuals / Lyrics / Albums navigation. Acceptance did not require manufactured network failure.

## Build83 real-user smoke — PASS

```text
Version                 v0.19.5
Build                   Build83
Status                  REAL USER PASS
Final CI                31856653579 · SUCCESS
Runtime merge           b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Pages                   31856698097 · SUCCESS
Real-user verdict       BUILD83 PASS · 2026-08-15
```

Build83 protects canonical `lyrics.txt` response-loss truth through private Lyrics + Track reread and exact revision + ETag + normalized-text postconditions.

## Build82 real-user smoke — PASS

```text
Version                 v0.19.4
Build                   Build82
Status                  REAL USER PASS
Final CI                31854468795 · SUCCESS
Runtime merge           7a0d52fcc0bf862478c459f0648afc1c6690b34f
Pages                   31854528438 · SUCCESS
Real-user verdict       BUILD82 PASS · 2026-08-15
```

Build82 protects Track/Album asset deletion response-loss truth without requiring destructive production smoke.

## Current ecosystem validation baseline

```text
LaunchPAD public        2026.08.12.102 · REAL USER PASS
Track Manager           v5.23 · deployed protected authority
Studio bridge           v1.13
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker           v2.7 · unchanged
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build93 does not supersede those products' independent validation histories.

## Core contracts that must remain guarded

### Private reads

- bridge health, Track inventory and Track detail remain private-first with Build88 bounded retry;
- canonical Album collection/detail remain private-first with Build89 bounded retry;
- canonical Lyrics read uses Build90 bounded retry;
- private SonicTrace canonical latest/history state and catalog use Build91 bounded retry;
- timeout/transport/selected transient HTTP failures may receive one retry only in those bounded helpers;
- Access/CORS, deterministic ordinary 4xx and invalid-response failures receive no retry;
- maximum attempts are two total;
- public fallback remains read-only and happens only where explicitly designed after private reads ultimately fail;
- private GET retry must never become automatic POST/write retry.

### Track metadata

- `metadata-validate-v1` remains non-mutating;
- Build93 allows that non-mutating validation one bounded retry only for timeout, transport interruption and HTTP `408/425/429/500/502/503/504`;
- Build93 validation maximum is two total attempts;
- Access/deterministic ordinary 4xx and invalid JSON/proposal do not retry;
- visible Validate and Build92 fresh pre-save validation use the same bounded validation wrapper;
- `metadata-save-v1` remains guarded by exact `expectedUpdatedAt`;
- Build92 repeats validation immediately before save to obtain the exact normalized proposal;
- derived `duration` may be included from canonical audio evidence but remains non-editable;
- a lost metadata-save response is never blindly retried;
- new revision + exact reviewed proposal is the only recovered committed proof;
- unchanged revision proves not committed / explicit retry safe after reconnect;
- changed but non-matching revision is ambiguous;
- reread unavailable is unverified;
- recovered canonical Track truth does not fabricate an independently unobservable catalog rebuild receipt;
- Build93 does not authorize any automatic write retry.

### Lyrics

- `tracks/<slug>/lyrics.txt` is the unique canonical source;
- recognized timestamps define synchronized lyrics;
- `.lrc` is optional export/compatibility only;
- canonical saves use protected Track Manager paths and private reread/stale verification;
- lost save responses are never blindly retried;
- Build90 changes only the GET side of normal reads and recovery/verification rereads.

### SonicTrace

- `latest.json` + append-only `history/<analysisId>.json` are durable canonical analysis sidecars;
- source audio is not persisted in the analysis directory;
- one save is identified by exact `analysisId`;
- partial latest/history presence after response loss is ambiguous;
- Build91 changes private Track Manager reads only;
- Build84 save POST/lost-response recovery remains unchanged and is never automatically retried;
- public fallback never verifies SonicTrace writes.

### Albums

- `albums/<album-id>/manifest.json` is canonical;
- ordered `album.trackIds` is sole membership/artistic-order authority;
- Track-side Album metadata is compatibility/cache data;
- generic Track metadata writes do not independently mutate Album membership;
- Build85 response-loss recovery applies to **Album metadata save only**;
- Build86 response-loss recovery applies to **`album-track-move-v1` only**;
- Build87 response-loss recovery applies to **bulk membership / ordered tracklist save only**;
- Build89 changes **GET reads only** and does not alter those write contracts;
- create and binary upload require their own operation-specific backend/causality audits before similar recovery can be added.

### Writes / ambiguity

- public fallback never verifies a canonical write;
- a lost response is never automatic failure or automatic success;
- no blind retry after response loss;
- canonical reread must prove exact operation-specific postconditions;
- Build88, Build89, Build90 and Build91 do not alter any write retry rule;
- Build92 adds operation-specific Track metadata recovery only and must not be generalized to create/upload or another write family;
- Build93 adds bounded retry only to a non-mutating validation operation and must not be generalized into write retry.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

No Build93 acceptance blocker remains. Acceptance docs PR #164 passed CI `31901050237`, merged at `8df0417ee4d96de1e1b386c0fb15af60dcdbc661`, and Pages `31901109789` deployed that exact merge successfully.

The current QA boundary is a fresh bounded post-Build93 Phase9 audit before any successor allocation. Album asset upload and Album create remain known heavier candidates; degraded/offline/PWA remains cross-cutting. A smaller gap may win only if fresh evidence proves it.

**Build94 is unallocated** until the fresh post-Build93 audit proves a concrete scope.

## Standard validation commands

Repository-native full validation:

```text
npm run build
```

Focused Phase9 guard:

```text
npm run check:phase9
```

TypeScript only:

```text
npm run typecheck
```

Do not replace the native full validation chain with a smaller ad-hoc test when preparing a runtime merge.

## Acceptance recording rule

For each future runtime candidate, record separately:

```text
scope / version / build
feature PR + exact tested head
CI run + result
runtime merge SHA
Pages deployment + exact SHA
Worker deployment, if any
R2/catalog mutation, if any
real-user smoke scenario + verdict
known residual issues
```

Only explicit real-user validation may promote a deployed candidate to **REAL USER PASS** when the roadmap requires it.