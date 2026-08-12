# PHASE 7-B — Build 50 Contextual Continuation Receipts

Studio: **v0.17.0 · Build 50**

Codename: `phase7-b-contextual-continuation-receipts`

State in this document: **candidate implementation; REAL USER PASS not claimed**.

## Goal

Phase 7-B connects specialist completion back to the canonical Track Workspace without making specialist/local success messages authoritative.

The invariant is:

```text
specialist completes an operation
        ↓
contextual receipt
        ↓
exact canonical trackId + allowlisted source/operation
        ↓
canonical write?
   ├── no  → review-only state
   └── yes → private Track Manager reread
                  ↓
             canonical evidence
                  ↓
               VERIFIED
```

A child tool cannot promote its own optimistic state into canonical Studio truth.

## Typed receipt allowlist

| Source | Operation | Effect | Verification |
|---|---|---|---|
| `lrc-maker` | `lyrics-saved` | `canonical-write` | private Track reread + canonical `lyrics.txt` evidence |
| `sonictrace` | `analysis-saved` | `canonical-write` | private Track reread + persisted Audio Intelligence evidence |
| `release-campaign` | `campaign-exported` | `review-only` | no canonical write expected |

Unsupported combinations are invalid.

## Exact Track isolation

Receipts are scoped to the Track Workspace currently open.

If:

`receipt.trackId !== currentWorkspace.trackId`

Studio ignores the receipt.

This prevents a completion from a previous/other Track context from updating the visible Workspace.

## Private canonical reread

Canonical-write receipts are not trusted directly.

Studio calls the existing `getCatalogTrack(trackId)` read layer and requires:

- returned Track ID equals the current canonical trackId;
- `readSource === 'private'`;
- operation-specific evidence exists.

A LaunchPAD/public fallback may keep Studio readable when private access is unavailable, but **it can never verify a canonical write**.

## Stale async protection

Each canonical verification increments a local verification epoch.

A slow reread is discarded when a newer receipt/Track context has superseded it. Therefore a stale async result cannot overwrite a more recent completion state.

## LRC Maker

### Embedded

The existing LRC Maker 6.3.8 engine keeps its guarded save authority/path. Its `lyrics-saved` completion is converted to the typed Phase 7-B receipt.

### Standalone fallback

The existing `shinobiwan:lyrics-saved:v1` message remains supported, but the message is accepted only when its browser origin equals the configured LRC Maker origin. It is then converted to the same typed receipt and still requires private canonical reread.

### Canonical Lyrics authority remains frozen

```text
tracks/<slug>/lyrics.txt = UNIQUE source canonique
timestamps in lyrics.txt = synchronized lyrics
.lrc                      = export / compatibility only
```

Phase 7-B does not introduce any second Lyrics source.

## SonicTrace

A successful existing SonicTrace save emits `sonictrace / analysis-saved / canonical-write`.

Studio no longer treats the child panel callback itself as authoritative. The receipt triggers private reread and checks that canonical Audio Intelligence is exposed before `VERIFIED`.

The existing SonicTrace sidecar/history/freshness authority is unchanged.

## Native Release Campaign

Build 50 preserves the current Build 48/49 native workflow:

```text
MASTER FINAL 16:9
  ├── anchored 1:1
  └── anchored 9:16
```

The Release Campaign draft and imported outputs remain browser-local/non-canonical.

Export emits only:

`release-campaign / campaign-exported / review-only`

The ZIP manifest continues to record `canonicalWrite: false`.

No visual FINAL is implicitly written to R2 or promoted to canonical cover/media.

## Receipt UI

Track Workspace displays a compact contextual banner with four truthful states:

- **Verifying canonical state…** — private reread in progress;
- **Canonical reread verified** — canonical write evidence reread successfully;
- **Review receipt received** — review-only result, no canonical write expected;
- **Receipt not canonically verified** — private reread/evidence failed.

The banner is dismissible and respects `prefers-reduced-motion`.

## Preserved authorities

- GitHub = code authority.
- R2 = canonical data/media authority.
- Track Manager = protected canonical write authority.
- Studio = orchestrator.
- LaunchPAD = public experience/read fallback.
- SonicTrace = Audio Intelligence engine.
- LRC Maker = Lyrics engine.

Phase 7-B adds orchestration signals only. It does not centralize writes.

## Safety / rollback

Implementation base:

`ef9eaa3e73fa704e8777a904d923e78648bb3001`

Pre-change checkpoint:

`safety/pre-phase7-b-build50-20260812-1826`

Old receipt PRs #60 and #62 remain closed/superseded and were not merged/cherry-picked in bulk.

No Cloudflare Worker deployment, public Worker modification, production R2 mutation, schema migration or Phase 7-C work is part of Build 50.

## CI policy

Build 50 adds `scripts/test-phase7-b-contextual-receipts-build50.mjs` and keeps the inherited regression chain:

- private-read contract;
- Phase 5 algorithms;
- Phase 6 Lyrics;
- C3 / Catalog Intelligence / premium feel;
- historical PHASE UX and C2.5 guards;
- Phase 7-A Workflow;
- Build 47 staged-review no-write history;
- Build 48 native Release Campaign;
- Build 49 concept-reroll/Flow handoff;
- Build 50 receipt contract;
- TypeScript;
- Vite production build.

Historical tests were changed only where their phase/version STOP assumptions had become obsolete. Their functional safety assertions remain.

## Real-user smoke boundary

CI GREEN is not REAL USER PASS.

After Build 50 is merged and Pages is verified, stop for user validation.

Minimum smoke:

1. confirm `v0.17.0 · Build 50` / Phase 7-B candidate is live;
2. in Release Pack, export a browser-local campaign ZIP and confirm the receipt is **review-only**, never canonical VERIFIED;
3. on a Track with private canonical access, complete one existing protected specialist write (Lyrics or SonicTrace) and confirm:
   - receipt appears in verifying state;
   - private canonical reread succeeds;
   - only then `Canonical reread verified` appears;
4. verify the result remains scoped to the correct canonical trackId;
5. quick non-regression on Workflow 7-A and the native Release Campaign.

Only the user can convert this candidate into REAL USER PASS.

## Phase 7-C

**NOT STARTED.**

Phase 7-C remains behind the explicit post-7-B validation boundary.
