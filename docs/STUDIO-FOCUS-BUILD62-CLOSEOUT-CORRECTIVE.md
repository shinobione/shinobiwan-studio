# Studio Focus — Build 62 closeout corrective

Status: **COMPLETE · REAL USER PASS**  
Studio: **v0.19.2 · Build 62**  
Date: 2026-08-13

## Why Build 62 exists

The representative deployed Build 61 Studio Focus program-closeout smoke was not promoted immediately because it exposed one runtime failure and two artist-facing UX issues.

Observed on `Magnetic Midnight` during the real-user Visuals review:

- canonical cover preview rendered successfully;
- clicking `Extract colors` failed with `Failed to fetch`;
- the failure occurred before any palette save.

The same smoke also identified:

- the artist-facing workflow label `Sound` as ambiguous compared with the actual SonicTrace product boundary;
- the Release Campaign `Premium provider` selector as misleading because the selected provider did not participate in MASTER, 1:1 or 9:16 prompt generation.

## Root cause — cover palette read

A private Studio track may legitimately reuse the public LaunchPAD cover URL when the public asset exists. The palette extractor was fetching every canonical cover with `credentials: include`.

That mode is required for private Track Manager media but is inappropriate for the public cover URL and can trigger a browser CORS failure even while the same image renders normally through `<img>`.

Build 62 chooses fetch credentials from the actual media URL:

- Track Manager private media → `credentials: include`;
- public cover URL → `credentials: omit`;
- local selected cover → no network fetch.

A failed palette read now surfaces as `Palette extraction failed` rather than a generic Studio error.

## Artist wording — Sonic

The artist-facing production workflow now uses `Sonic` / `SonicTrace` rather than the ambiguous `Sound` label. Existing SonicTrace truth states, sidecar reads, routing and full Advanced diagnostics are unchanged.

## Release Campaign provider cleanup

Code inspection confirmed that provider selection was not an input to:

- `buildMasterPrompt`;
- `buildFreshMasterPrompt`;
- `buildVariantPrompt`.

Changing the selector therefore did not change the generated visual prompt. Build 62 removes the misleading selector from the artist-facing UI while preserving historical browser-local metadata compatibility. Prompt generation remains provider-agnostic and the Google Flow shortcut remains available.

## Smoke-2 findings and paired Track Manager correction

The next deployed smoke confirmed palette extraction but exposed two final closeout issues:

- the palette workbench changed geometry when `Save palette` appeared;
- an explicit palette save on a legacy track could be rejected as `STALE_MANIFEST` although the track had not changed concurrently.

The presentation layout was stabilized so the cover and palette keep a consistent two-column composition on desktop and stack cleanly on mobile.

The false stale condition was traced to legacy manifests without a persisted `updatedAt`. Repeated reads could synthesize different current timestamps for the same unchanged object. Track Manager v5.20 now derives a stable legacy read revision from existing manifest/object metadata while preserving a real persisted `manifest.updatedAt` when present. The stale comparison itself remains in place.

The same corrective presents the legacy French artist-facing type `Titre d'Album` as **`Album track`** without silently changing stored metadata.

## Final deployment state

```text
Studio main       b464c0930a5659b208b3a059d443f708b8e55dba
Studio Pages run  31713370595    SUCCESS
Track Manager     v5.20
Studio bridge     v1.11
LaunchPAD main    586c71333c902fc2ebef214c63e9234ece9e1711
Worker run        31714222431    SUCCESS · admin only
Worker Version ID 78609aff-1f4a-4a21-b618-cb97add0c416
Public Worker     v2.7            unchanged
```

## Final real-user acceptance

The user explicitly reported **`SMOKE2 PASSED`** after testing the deployed production stack.

Confirmed:

- `Extract colors` works on `Magnetic Midnight`;
- palette preview renders correctly;
- layout remains stable when the preview/save controls appear;
- explicit `Save palette` succeeds;
- the false `STALE_MANIFEST` rejection is gone;
- `Album track` displays correctly;
- `Sonic` wording displays correctly.

Full program-level evidence: [`STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md).

## Safety anchors

Pre-Build-62 corrective:

```text
safety/pre-studio-focus-build62-closeout-corrective-20260813-1529
```

Pre-final-program-closeout documentation:

```text
safety/pre-studio-focus-final-closeout-20260813-1720
```

## Final boundary

Build 62 is now the accepted Studio baseline and Studio Focus program closeout is complete.

**Phase 7-C remains CLOSED / NOT STARTED.**
