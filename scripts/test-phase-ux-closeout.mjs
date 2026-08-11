import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const intelligence = read('src/components/CatalogIntelligenceView.tsx');
const intelligenceMath = read('src/catalog-intelligence.ts');
const sonicCss = read('src/sonictrace.css');
const c3bCss = read('src/c3-b-v2e-parity.css');
const foundationCss = read('src/ux-foundation.css');
const app = read('src/App.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');

for (const engineContract of [
  'getSonicTraceCatalog()',
  'getAdminAlbums()',
  'nearestTracks(selected, entries)',
  'analyzeCatalog(entries)',
  'analyzeProject(selectedAlbum.trackIds, entries, tracks)',
  'validEmbedding(entry.embedding)',
  "trackHref(selected.trackId, 'intelligence')",
]) assert.ok(intelligence.includes(engineContract), `Catalog Intelligence engine contract is missing ${engineContract}.`);
for (const mathContract of [
  'projectTracks', 'clusterAcousticZones', 'analyzeStyleFamilies', 'catalogInsights', 'analyzeProject', 'vector.length === 512',
]) assert.ok(intelligenceMath.includes(mathContract), `C3-B intelligence math contract is missing ${mathContract}.`);

for (const presentation of [
  'See the shape of your catalog.',
  'Choose a track',
  'Tracks near ${selected.title}',
  'Redundancy, outliers and bridges',
  'How this view works',
  'Search analyses',
  '512D READY',
  'ACOUSTIC ZONES',
  'SONIC FAMILIES',
  'ALBUM / PROJECT INTELLIGENCE',
  'READ ONLY · canonical order unchanged',
  'Update needed',
]) assert.ok(intelligence.includes(presentation), `Catalog Intelligence UX is missing ${presentation}.`);

for (const accessibility of [
  'role="status"',
  'aria-live="polite"',
  'role="alert"',
  'type="search"',
  'aria-pressed={entry.trackId === selectedId}',
  'aria-label="Analyzed tracks"',
  'aria-label="Deterministic 2D sonic catalog map"',
]) assert.ok(intelligence.includes(accessibility), `Catalog Intelligence accessibility is missing ${accessibility}.`);

for (const responsive of [
  '.intelligence-view { min-width: 0;',
  'min-height: var(--studio-control-height)',
  '@media (max-width: 1100px)',
  '@media (max-width: 850px)',
  '@media (max-width: 590px)',
  '@media (max-width: 390px)',
  'overflow-wrap: anywhere',
]) assert.ok(sonicCss.includes(responsive), `Catalog Intelligence base responsive guard is missing ${responsive}.`);
for (const responsive of [
  '.c3b-map-stage { position: relative;',
  '.c3b-project-stats { display: grid;',
  '@media (max-width: 1180px)',
  '@media (max-width: 900px)',
  '@media (max-width: 700px)',
  '@media (max-width: 470px)',
]) assert.ok(c3bCss.includes(responsive), `C3-B responsive guard is missing ${responsive}.`);

for (const globalAccessibility of [
  'button:focus-visible',
  'input:focus-visible',
  'summary:focus-visible',
  '@media (prefers-reduced-motion: reduce)',
  '--studio-control-height: 42px',
]) assert.ok(foundationCss.includes(globalAccessibility), `Global accessibility contract is missing ${globalAccessibility}.`);

for (const source of [app, workspace, intelligence, intelligenceMath]) {
  for (const forbidden of ['phase7', 'phase-7']) assert.ok(!source.toLowerCase().includes(forbidden), `Unauthorized Phase 7 runtime marker found: ${forbidden}.`);
}
for (const forbidden of ['indexedDB', 'saveAdminAlbumMetadata', 'saveAdminAlbumMembership', 'moveAdminAlbumTrack']) {
  assert.ok(!intelligence.includes(forbidden), `C3-B must remain canonical-read/read-only; found ${forbidden}.`);
}

console.log('PHASE UX UX-5/C3-B guard passed: canonical V2-E map/project intelligence, responsive reflow, accessible selection/status semantics, read-only Album authority and Phase 7 STOP protected.');