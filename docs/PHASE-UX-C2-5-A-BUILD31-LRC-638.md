# PHASE UX C2.5-A — Studio v0.10.9 / Build 31

## Purpose

Real-user smoke of Studio Build 30 showed that the embedded Lyrics row borders had adopted the intended teal/cyan treatment, but the selected/current row fill itself was still purple.

The Studio host was correctly consuming LRC Maker 6.3.7. The remaining visual mismatch was inside the LRC Maker Shadow DOM: its historical standalone `launchpad-skin.css` uses `!important` purple backgrounds for `.line.select` and `.line.highlight`, while the 6.3.7 Studio-only overrides did not use equivalent priority for the background declarations.

## Corrective integration

LRC Maker 6.3.8 fixes that cascade **inside the Studio embed only** by making the dark teal/cyan neutral, hover, selected and current row backgrounds authoritative. The standalone LRC Maker skin remains unchanged.

Studio Build 31 therefore does only one runtime integration change:

- cache-bust and consume `embed/lyrics-studio.js?v=6.3.8`.

All existing Build 30 improvements remain in place:

- Intelligence hover no longer creates horizontal overflow;
- Catalog warm/shared request + in-memory route snapshot remain active;
- Catalog first-load skeleton/status remains active;
- embedded confirmation messages remain in-flow rather than overlaying Lyrics controls/content.

## Release identity

```text
Studio version  0.10.9
Build           31
Codename        phase-ux-c2-5-a-lrc-638
LRC embed       6.3.8
```

## Dependency / promotion order

Studio Build 31 must not be promoted until:

1. LRC Maker 6.3.8 PR is green;
2. LRC Maker 6.3.8 is merged to `master`;
3. the LRC Maker GitHub Pages deployment for that merge succeeds.

This prevents Studio from pinning an embed version that has not yet been published.

## Frozen boundaries

Build 31 changes no Track Manager route, Cloudflare Worker source/deployment, R2 object, canonical Album schema, catalog projection contract, SonicTrace engine/persistence, lyrics canonical source, `.lrc` policy or Phase 7 scope.

`tracks/<slug>/lyrics.txt` remains the only canonical lyrics source. Recognized timestamps inside that file define synchronization; `.lrc` remains optional export/compatibility only.

Safety ref before the Studio change: `safety/pre-build31-lrc-638-20260809-2128`.
