# Studio Focus — Build 62 closeout corrective

Status: **CANDIDATE · REAL USER PENDING**  
Studio: **v0.19.2 · Build 62**  
Date: 2026-08-13

## Why Build 62 exists

The representative deployed Build 61 Studio Focus program-closeout smoke was not promoted to a program-level REAL USER PASS because it exposed one runtime failure and two artist-facing UX issues.

Observed on `Magnetic Midnight` during the real-user Visuals review:

- canonical cover preview rendered successfully;
- clicking `Extract colors` failed with `Failed to fetch`;
- the failure occurred before any palette save or canonical write.

The same smoke also identified:

- the artist-facing workflow label `Sound` as ambiguous compared with the actual SonicTrace product boundary;
- the Release Campaign `Premium provider` selector as misleading because the selected provider did not participate in MASTER, 1:1 or 9:16 prompt generation.

## Root cause — cover palette read

A private Studio track may legitimately reuse the public LaunchPAD cover URL when the public asset exists. The palette extractor was fetching every canonical cover with `credentials: include`.

That credential mode is required for Track Manager private `/api/media/...` reads but is inappropriate for the public cover URL and can trigger a browser CORS failure even while the same image renders normally through `<img>`.

Build 62 chooses fetch credentials from the actual media URL:

- Track Manager private media → `credentials: include`;
- public cover URL → `credentials: omit`;
- local selected cover → no network fetch.

A failed palette read now surfaces as `Palette extraction failed` rather than a generic Studio error.

This changes no asset upload/delete contract and performs no canonical mutation by itself.

## Artist wording — Sonic

The Home production readiness step now uses `Sonic` rather than `Sound` and intelligence next-actions use `Analyze with SonicTrace` / `Refresh SonicTrace`.

The compact SonicTrace card also uses explicit Sonic/SonicTrace wording. Existing truth states, sidecar reads, routing and full Advanced diagnostics are unchanged.

## Release Campaign provider cleanup

Code inspection confirmed that provider selection was not an input to:

- `buildMasterPrompt`;
- `buildFreshMasterPrompt`;
- `buildVariantPrompt`.

Changing the selector therefore did not change the generated visual prompt. It only changed provider metadata/button copy while the direct external shortcut remained Google Flow.

Build 62 removes this misleading selector from the artist-facing UI while preserving the historical browser-local draft/ZIP field for compatibility. Prompt generation remains provider-agnostic and the Google Flow shortcut remains available.

## Safety

Pre-corrective anchor:

```text
safety/pre-studio-focus-build62-closeout-corrective-20260813-1529
```

Exact pre-corrective `main`:

```text
70c491b3c5a1f965145e642c0384c25cc7edf1dc
```

Build 62 does **not** authorize or perform:

- Worker deployment/change;
- R2/catalog/media mutation for smoke evidence;
- generic Studio write authority;
- automatic campaign promotion;
- Phase 7-C.

**Phase 7-C remains CLOSED / NOT STARTED.**

## Acceptance gate

Build 62 may become accepted only after:

1. full inherited CI on the exact candidate head;
2. merge of only that tested head after re-reading `main`;
3. GitHub Pages deployment verified on the exact merge SHA;
4. real-user smoke confirming:
   - Home says `Sonic` / SonicTrace actions are understandable;
   - `Magnetic Midnight → Visuals → Extract colors` no longer raises `Failed to fetch`;
   - palette preview still does not write until explicit `Save palette`;
   - the misleading Premium provider selector is absent;
   - Google Flow handoff remains usable;
   - no regression in Track / Visuals / Lyrics / Release.

Until those observations exist, **Build 61 remains the accepted baseline and Build 62 remains only a candidate**.
