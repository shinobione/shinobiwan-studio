# Studio v0.19.7 · Build85 — Phase9 Album metadata save response-loss truth

Status: **REAL USER PASS · ACCEPTED**.

## Fresh audit proof

Build85 was allocated only after the accepted Build84 closeout and a new read-only Phase9 audit.

The audit compared the remaining reliability candidates and found the smallest coherent unprotected write family in canonical Album management: **metadata save only**.

Studio's existing generic Album POST transport could already verify a normal metadata success with a canonical Album reread. However, if the metadata POST timed out or the browser lost the response after the request began, Studio could not determine whether the canonical Album manifest had actually advanced.

A read-only audit of the deployed Track Manager v5.23 / Studio bridge v1.13 source confirmed that metadata save already performs:

```text
expectedUpdatedAt stale guard
→ write proposed Album manifest
→ update title-dependent Track compatibility caches if required
→ rebuild catalog
→ reread canonical Album manifest
→ verify proposed revision / id / title
→ rollback Album + touched Track caches on failure
```

No Track Manager or Worker change was required for the Studio client to classify a lost metadata response from canonical state.

Broader Album writes remain separate audit families:

- create has absence/presence and catalog semantics without a pre-write revision;
- membership mutates ordered `album.trackIds` plus multiple Track compatibility caches;
- move mutates source Album + target Album + Track cache;
- upload mutates binary asset state + manifest revision.

They are intentionally **not** bundled into Build85.

## Scope

Build85 changes only Studio's canonical **Album metadata save** path.

It does not change:

- Album create;
- Album membership/order save;
- Album cross-release move;
- Album asset upload or deletion;
- Track Manager source or deployment;
- the Studio bridge;
- Cloudflare Workers;
- R2 schema/data;
- LaunchPAD;
- SonicTrace Deep Audio computation;
- LRC Maker.

## Lost-response contract

Before POST, Studio performs a private canonical Album reread and requires the exact `expectedUpdatedAt` revision.

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision
   │  + exact requested metadata
   │  + unchanged non-metadata Album shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

The stable non-metadata shape checked by Studio includes canonical identity, ordered `trackIds`, assets and `createdAt`. This prevents a membership/asset change from being mistaken for a metadata-only save recovery.

Normal HTTP success is also canonically reread and is only called verified when:

- the reread revision equals the exact server-returned `updatedAt`;
- requested metadata matches canonical values;
- non-metadata Album shape remains stable.

## UX truth

Album Management distinguishes:

- normal metadata save canonically verified;
- **RECOVERED AFTER LOST RESPONSE** with an explicit statement that Studio did not retry the write;
- **RETRY SAFE AFTER RECONNECT** only when the original revision is still canonical;
- **DO NOT RETRY** for ambiguous or unverified outcomes.

After any error, the existing Album mutation wrapper reloads canonical state before the next operator decision.

## Validation / deployment

Build85 adds `scripts/test-phase9-album-metadata-response-loss-build85.mjs` and extends `check:phase9` while keeping Build82, Build83 and Build84 guards inherited.

Final runtime evidence:

```text
Safety pre              safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Final CI                31863267911 · SUCCESS · first run
Runtime merge           1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages           31863313848 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build85-deployed-candidate-20260815-0602
Candidate docs PR       #136
Candidate docs merge    40917edc6a341ca7d19907d8afe59123f44c8d03
Candidate docs Pages    31863566190 · SUCCESS
Safety post-acceptance  safety/post-build85-real-user-pass-20260815-0748
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD85 PASS · 2026-08-15
```

Historical Studio Focus / Phase7-C guards were widened only for the bounded `v0.19.7 / Build85` successor while preserving their functional assertions and accepted Build81→82→83→84 ancestry requirements.

The exact Build85 feature head passed the complete repository-native chain including Phase9 guards, Studio Focus guards, TypeScript and Vite production build **on the first CI run**.

## Real-user acceptance

The required acceptance smoke was intentionally a normal-browser regression rather than a manufactured response-loss failure.

The user returned the explicit verdict:

```text
BUILD85 PASS
```

The accepted browser boundary covered:

1. deployed `v0.19.7 · Build85` after hard refresh;
2. an existing safe canonical Album;
3. one harmless metadata edit;
4. one normal **Save metadata**;
5. verified receipt **`Album metadata saved and canonically verified.`**;
6. canonical revision advance;
7. saved value persistence after canonical reload;
8. surrounding Albums / Track / Lyrics / SonicTrace navigation sanity.

The smoke did **not** deliberately cut network or Cloudflare Access. The lost-response branches remain protected by automated guards and private canonical reread logic.

## Safety / rollback

Runtime rollback remains a Studio-only revert of PR #135. No Worker or R2 migration rollback is required because this slice introduced no backend deployment or schema/data migration.

## Stop line

- Build85 is accepted **REAL USER PASS**.
- Build86 remains unallocated until a fresh post-acceptance audit proves the next smallest reliability scope.
- Do not generalize Build85 logic into Album membership/move/upload/create without a fresh operation-specific audit.
