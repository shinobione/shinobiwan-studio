import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const intelligence = read('src/components/CatalogIntelligenceView.tsx');
const sonicCss = read('src/sonictrace.css');
const foundationCss = read('src/ux-foundation.css');
const app = read('src/App.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');

for (const engineContract of [
  'getSonicTraceCatalog()',
  'nearestTracks(selected, entries)',
  'clusterTracks(entries)',
  'entry.embedding?.dimension === 512',
  "trackHref(selected.trackId, 'intelligence')",
]) assert.ok(intelligence.includes(engineContract), `Catalog Intelligence engine contract is missing ${engineContract}.`);

for (const presentation of [
  'Understand your catalog',
  'Choose a track',
  'Tracks near ${selected.title}',
  'Recurring relationships',
  'How this view works',
  'Search analyses',
  'Ready for similarity',
  'Update needed',
]) assert.ok(intelligence.includes(presentation), `Catalog Intelligence UX is missing ${presentation}.`);

for (const accessibility of [
  'role="status"',
  'aria-live="polite"',
  'role="alert"',
  'type="search"',
  'aria-pressed={entry.trackId === selectedId}',
  'aria-label="Analyzed tracks"',
]) assert.ok(intelligence.includes(accessibility), `Catalog Intelligence accessibility is missing ${accessibility}.`);

for (const responsive of [
  '.intelligence-view { min-width: 0;',
  'min-height: var(--studio-control-height)',
  '@media (max-width: 1100px)',
  '@media (max-width: 850px)',
  '@media (max-width: 590px)',
  '@media (max-width: 390px)',
  'overflow-wrap: anywhere',
]) assert.ok(sonicCss.includes(responsive), `Catalog Intelligence responsive guard is missing ${responsive}.`);

for (const globalAccessibility of [
  'button:focus-visible',
  'input:focus-visible',
  'summary:focus-visible',
  '@media (prefers-reduced-motion: reduce)',
  '--studio-control-height: 42px',
]) assert.ok(foundationCss.includes(globalAccessibility), `Global accessibility contract is missing ${globalAccessibility}.`);

for (const source of [app, workspace, intelligence]) {
  for (const forbidden of ['phase7', 'phase-7']) assert.ok(!source.toLowerCase().includes(forbidden), `Unauthorized Phase 7 runtime marker found: ${forbidden}.`);
}

assert.equal(pkg.version, '0.10.7');
assert.ok(release.includes("version: '0.10.7'"));
assert.ok(release.includes('build: 29'));
assert.ok(release.includes("codename: 'phase-ux-integration-parity-c1'"));

console.log('PHASE UX UX-5 guard passed: purposeful Catalog Intelligence, responsive reflow, accessible selection/status semantics and Phase 7 STOP protected.');
