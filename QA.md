# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-16 after explicit **Build100 REAL USER PASS**.

This file records what has actually been validated, what automated guards cover, and what remains unproven. It is not a full test-history dump.

## Current accepted Studio runtime

```text
Version                 v0.19.22
Build                   Build100
Status                  REAL USER PASS
Runtime PR              #187
Exact tested head       9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Final CI                31944882443 · SUCCESS
Runtime merge           49f5c8e0267a318e2b0900ba5e222bd56d098db8
Pages                   31944932464 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #188
Candidate docs CI       31945020130 · SUCCESS
Candidate docs merge    2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages    31945131271 · SUCCESS
Safety post-deploy      safety/post-build100-deployed-candidate-20260816
Safety post-acceptance  safety/post-build100-real-user-pass-20260816-2255
Track Manager           v5.24 · unchanged by Build100
Studio bridge           v1.14
Public Worker           v2.7 · unchanged
Real-user verdict       BUILD100 SMOKED 💨 · 2026-08-16
```

## Build100 automated coverage — GREEN

Final validation `31944882443` passed the complete repository-native chain on exact head `9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d`. Canonical ownership is derived from Album `trackIds`, only unowned Tracks are offered for intake, **Add to tracklist** stages locally, and the single write remains `saveAdminAlbumMembershipResilient(...)` from Build87.

Build100 adds no backend endpoint, Track Manager/Worker change, R2 schema migration or automatic write retry. Tracks already owned by another canonical Album continue to use the guarded Move flow.

## Build100 real-user smoke — PASS

The user returned:

```text
BUILD100 SMOKED 💨
```

`Pixels & Promises` was staged from virtual Singles/unassigned into empty draft Album `Anh Yêu Em`, committed once through the guarded membership save, persisted after reload, and reread on the Track side with `Anh Yêu Em` instead of virtual Singles. No network/Access failure was manufactured.

## Build99 automated coverage — GREEN

Final validation run `31920824628` passed the complete repository-native chain on exact head `3cc99aabd18d23ec38ba4df9fd042e03aace8238`. Historical run `31920761317` failed only because the inherited C2.5-D guard required the old literal `return verify(albumId, payload)` form; only that guard was widened to accept the same verifier with Build99's `expectedAsset` postcondition. No runtime behavior changed for that red run.

Build99 proves normal successful Album cover/thumbnail upload only: exact response revision, requested canonical slot/path, private asset presence, and server-returned `size`, `contentType`, and `etag` agreement when supplied. Automatic upload retries remain zero. Exact client-byte digest proof and lost-response causality remain unproven by design.

## Build99 real-user smoke — PASS

The user completed a genuine Album artwork smoke and returned:

```text
BUILD99 SMOKED 💨
```

Acceptance confirms the deployed normal-success Album artwork path completed without canonical-verification error and remained coherent after reload. No network/Access failure was manufactured. The same session separately exposed the empty-draft-Album first-track intake deadlock; that UX/authority gap is recorded for the post-Build99 audit and does not alter the Build99 verdict.

## Build98 automated coverage — GREEN

Final validation run `31917295331` passed the complete repository-native chain on exact head `c393e26caa9a9e7d0b3ad71fccca92b9c1ae234b`, including Build80 duration-evidence compatibility, Build93 metadata validation, Build97 Track-create truth, the new Build98 bridge compatibility guard, all inherited Phase9 / Studio Focus guards, TypeScript and Vite. Historical run `31917263004` failed only because the Build79 guard asserted the old literal TM5.23/bridge1.13 transport label; only that historical guard was widened to the bounded v5.23-v5.24 line.

Track Manager corrective CI also executes the exact fresh-draft regression that had failed in v5.23: create a draft with the observed `album-track` + `Singles` shape, commit first MP3, derive canonical duration, then commit first JPEG. TM v5.24 passes that dynamic regression.

## Build98 / TM v5.24 real-user smoke — PASS

After protected admin-only deployment run `31919397012`, the user resumed the genuine `Pixels & Promises` draft and returned:

```text
MP3 + COVER + MP4 + TXT PASS MADAFAKA
```

Observed real-user result: MP3, cover JPEG, MP4 and TXT writes all committed successfully with no recurrence of `ASSET_SAVE_ROLLBACK · HTTP 500`. Public Worker deployment steps were skipped. The deploy workflow did not rebuild `catalog/index.json` or mutate existing R2 media; the only R2 media changes were the explicit user uploads under test.

Result: `Build98 = REAL USER PASS`, `TM v5.24 = REAL USER VERIFIED`.

## Build97 automated coverage — GREEN

Build97 final validation `31914980387` passed on exact head `31facc9eb124d3068f4f870dcfa78e38284e2f6a`; runtime merge `0519d3ad1c364ee34188e17ecb9d10c3f0308c54` and Pages `31915029686` were green. Build97 requires exact equality between Track Manager's normalized successful create response and Studio's private canonical reread before `clientVerified=true`; Track-create automatic retries remain zero.

## Build97 real-user smoke — PASS after cross-stack corrective

The genuine `Pixels & Promises` New Track create succeeded and produced a canonical draft. The first continuation attempt then exposed a separate pre-existing TM v5.23 Track-asset generated-bundle bug. That blocker did not invalidate Build97 create truth; it blocked downstream continuation. After TM v5.24 + Build98 were deployed, the same genuine Track accepted MP3/JPEG/MP4/TXT assets and remained usable. Build97 is therefore accepted with the blocker/corrective chain preserved explicitly rather than hidden.

## Build96 automated coverage — GREEN

Final validation run `31912951430` passed the complete repository-native chain on exact head `8ee5711d57f3a3986bf1e054b637f8ee3d5f7efe`, including the new Build96 Album create success-verification guard plus all inherited Phase9 and Studio Focus guards, TypeScript typecheck and Vite production build.

Historical run `31912907163` failed only inside the newly-added Build96 guard because it assumed both create surfaces used the local variable name `result`; the legacy surface uses `r`. The guard alone was corrected to require semantic `if (!<variable>.clientVerified)` behavior. No runtime/product code changed for that red run.

Build96 specifically proves:

- normal `album-create-v1` success retains the existing Track Manager write transport;
- canonical reread must match the exact returned revision;
- every metadata key supplied to create must match canonical state;
- both existing create surfaces reject an unverified create result;
- create response-loss recovery remains explicitly out of scope;
- maximum automatic create retries is zero;
- Album binary upload verification semantics remain unchanged.

## Build96 real-user smoke — PASS

The user performed the intended real create-path verification and returned the explicit verdict:

```text
Build 96 SMOKED 💨
```

Acceptance used a real Album / EP / collection the artist actually intended to create, avoiding a throwaway immutable canonical ID. The successful path verified deployed `v0.19.18 · Build96` and canonical persistence of the requested create metadata. No network cut, Cloudflare invalidation or lost-response branch was manufactured.

Result:

```text
Build96 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required.

## Build95 automated coverage — GREEN

Final validation run `31911514334` passed the complete repository-native chain on exact head `f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b`, including private-read, Phase5/6, C3, UX, Phase7, Phase8, Phase9 Build82→Build95, Studio Focus successor guards, TypeScript typecheck and Vite production build.

Two historical red Build95 runs remain explicit and were never merged:

```text
31911328839  FAILURE · inherited Phase7-C Build69 successor cap only
31911459367  FAILURE · inherited Build93 successor cap only
```

Only stale successor allowlists/ancestry assertions were widened. No Build95 product semantics were changed to repair those red runs.

Build95 specifically guards the **real daily Albums route**:

```text
App → AlbumHealthWorkspace → AlbumsWorkspace
  metadata save   → saveAdminAlbumMetadataResilient()   / Build85
  Album move      → moveAdminAlbumTrackResilient()      / Build86
  tracklist save  → saveAdminAlbumMembershipResilient() / Build87
```

Additional Build95 guarantees:

- older generic metadata/membership/move mutations are absent from the daily workspace;
- recovered-after-lost-response UI truth explicitly states Studio did not retry the write;
- Build85/86/87 operation-specific postconditions and no-blind-retry policies remain inherited unchanged;
- `createAdminAlbum`, Album binary upload and Album asset delete remain outside Build95 scope;
- no Track Manager, Worker or R2 schema/data mutation was required.

## Build95 real-user smoke — PASS

The user completed the bounded normal-browser smoke and returned the explicit verdict:

```text
BUILD95 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.17 · Build95`;
- opening an existing safe Album from the normal Albums surface;
- one harmless/reversible metadata save and persistence after reload;
- one ordered tracklist save and persistence after reload;
- coherent `Move to…` control presence without forcing an unnecessary destructive move merely to manufacture evidence;
- surrounding `Albums → Track → Lyrics → SonicTrace → Albums` navigation sanity.

Acceptance intentionally did **not** cut network, invalidate Cloudflare Access or manufacture lost-response branches. Automated guards own the failure-path classification and daily-route wiring proof.

Result:

```text
Build95 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build94 automated coverage — GREEN

Final validation run `31907745153` passed the complete repository-native chain on exact head `81298582163505a11378fe1094f800f1f3d437b5`, including:

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
- inherited Phase9 Build93 Track metadata validation transient retry guard;
- new Phase9 Build94 Lyrics validation transient retry guard;
- inherited private-read / Phase7-C Build69 / Build90 / Studio Focus Build64–67 successor compatibility aligned through Build94;
- TypeScript typecheck;
- Vite production build.

Build94 specifically guards the non-mutating Lyrics validation path:

```text
lyrics-validate-v1 attempt 1
├─ timeout                            → one retry max
├─ transport/fetch interruption       → one retry max
├─ HTTP 408/425/429/500/502/503/504  → one retry max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return validation result

attempt 2 failure → surface immediately
```

Additional Build94 guarantees:

- maximum attempts are exactly two total;
- finite 9-second timeout remains per validation attempt;
- visible Lyrics **Validate** uses the hardened wrapper;
- `lyrics-validate-v1` remains explicitly non-mutating;
- browser transport interruption is typed separately from Access/session gating;
- Access/session gating does not enter transient retry;
- invalid JSON/proposal shape does not enter transient retry;
- no generic retry/backoff framework is introduced;
- `lyrics-save-v1` remains at zero automatic retries;
- Build83 `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` and committed / not-committed / ambiguous / unverified response-loss recovery remain unchanged;
- no Track Manager, Worker or R2 schema/data mutation was required.

Historical first attempt remains explicit safety evidence rather than being relabelled green:

```text
Original runtime PR     #166
Original head           5f453868cc8cd2878e6964e3e747f841a5dde4c0
Original merge          5bcb2f4fd3b4fd3bbc4442d7cd9705211c733d35
Pages                   31902471804 · FAILURE · inherited private-read Lyrics POST guard
Rollback main           6c9c677b2f6299d13949642b712f2bf39b48b676 · byte-identical accepted Build93 tree
Rollback Pages          31907580912 · SUCCESS
Superseded hotfix PR    #167 · CLOSED / SUPERSEDED
```

Build94 v2 was reconstructed cleanly from restored accepted Build93 with all discovered inherited guard compatibility included before merge.

## Build94 real-user smoke — PASS

The acceptance smoke was intentionally a **normal-browser Lyrics validation regression**, not a manufactured transient-failure test.

The user completed the bounded smoke and returned the explicit verdict:

```text
BUILD94 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.16 · Build94`;
- opening one existing Track with canonical `lyrics.txt`;
- canonical Lyrics loading normally;
- visible **Validate** completing normally through the non-mutating validation path;
- no Lyrics Save required for this validation-only slice;
- canonical lyrics unchanged after reload;
- surrounding Track / Albums / SonicTrace / Lyrics navigation sanity.

Acceptance intentionally did **not** cut network, expire Cloudflare Access or manufacture timeout/transport/transient-HTTP branches. Those failure paths remain protected by automated classification and attempt-bound guards.

Result:

```text
Build94 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

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

Build94 does not supersede those products' independent validation histories.

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
- Build90 changes only the GET side of normal reads and recovery/verification rereads;
- Build94 allows one bounded retry only for non-mutating `lyrics-validate-v1` timeout / transport / HTTP `408/425/429/500/502/503/504`;
- Build94 validation is capped at two total attempts with a finite 9-second timeout per attempt;
- Access/session gating, deterministic ordinary 4xx and invalid JSON/proposal do not retry;
- `lyrics-save-v1` remains at zero automatic retries;
- Build83 save response-loss truth remains unchanged.

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
- Build93 and Build94 add bounded retry only to explicitly non-mutating validation operations and must not be generalized into write retry.

### Release Campaign

- provider-agnostic prompt semantics;
- MASTER anchors independent 1:1 and 9:16 derivatives;
- campaign export is review-only and does not write canonical data.

## Known non-bug / resolved reports

### Magnetic Midnight palette `Failed to fetch`

Status: **resolved historical issue, not active Phase9 work**.

Git history shows the public-cover credential/fetch path was corrected in Build62 and remains protected by the inherited Build62 guard. Do not create a duplicate fix without fresh reproduction proving a different bug.

## Known open QA gaps / next audits

No Build94 runtime acceptance blocker remains. Runtime PR #169 passed exact-head CI `31907745153`, merged at `fe636560de9ca5f3f33aae76dddc5474ba990f17`, and Pages `31907784289` deployed that exact merge successfully. Explicit user acceptance is `BUILD94 PASS MADAFAKA` on 2026-08-15.

The current QA boundary is acceptance-docs exact-head CI / merge / Pages closeout, followed by a fresh bounded post-Build94 Phase9 audit before any successor allocation. Album asset upload and Album create remain known heavier candidates; degraded/offline/PWA remains cross-cutting; Deep Audio compute retry remains causality/cost-sensitive. A smaller gap may win only if fresh evidence proves it.

**Build95 is unallocated** until Build94 docs closeout is complete and the fresh post-Build94 audit proves a concrete scope.

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

Do not replace the native full validation chain with a smaller ad-hoc test when preparing a runtime merge or acceptance-docs merge.

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