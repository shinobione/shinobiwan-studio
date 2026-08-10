import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const app = read('src/App.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const router = read('src/router.ts');
const css = read('src/ux-foundation.css');
const albumCss = read('src/c2-5-d-navigation.css');
const release = read('src/release.ts');

const primaryNav = app.slice(app.indexOf('const NAV:'), app.indexOf('const UTILITY_NAV:'));
for (const required of [
  "route: 'dashboard'",
  "route: 'catalog'",
  "route: 'albums'",
  "route: 'intelligence'",
  "label: 'Dashboard'",
  "label: 'Catalog'",
  "label: 'Albums / Projects'",
  "label: 'Intelligence'",
]) assert.ok(primaryNav.includes(required), `Primary Studio navigation is missing ${required}.`);
for (const forbidden of ["route: 'lyrics'", "route: 'assets'", "route: 'publishing'", "route: 'administration'"]) {
  assert.ok(!primaryNav.includes(forbidden), `Track-local or utility route leaked into primary navigation: ${forbidden}.`);
}

for (const required of [
  "{ id: 'overview', label: 'Overview' }",
  "{ id: 'metadata', label: 'Metadata' }",
  "{ id: 'assets', label: 'Assets' }",
  "{ id: 'lyrics', label: 'Lyrics' }",
  "{ id: 'intelligence', label: 'SonicTrace' }",
  '← Back to Catalog',
]) assert.ok(workspace.includes(required), `Track-local navigation is missing ${required}.`);

for (const legacyRoute of ["'versions'", "'publishing'"]) {
  assert.ok(router.includes(legacyRoute), `PHASE UX must preserve existing deep-link compatibility for ${legacyRoute}.`);
}

for (const token of [
  '--studio-bg:', '--studio-surface:', '--studio-glass:', '--studio-border:', '--studio-text:',
  '--studio-cyan:', '--studio-violet:', '--studio-success:', '--studio-warning:', '--studio-danger:',
  '--studio-focus:', '--studio-control-height: 42px', '--studio-radius-md:', '--studio-shadow-panel:',
  '--studio-transition:', '@media (prefers-reduced-motion: reduce)', ':focus-visible',
]) assert.ok(css.includes(token), `PHASE UX design system is missing ${token}.`);

assert.ok(albumCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'), 'C2.5-D mobile navigation must fit four primary Studio destinations in one row.');
assert.ok(css.includes('.nav-list-utility { display: none; }'), 'Mobile must keep utility navigation secondary.');
assert.ok(app.includes('codename') || release.includes('phase-ux-'));

for (const forbidden of ['phase7', 'phase-7', 'Phase 7 runtime']) {
  assert.ok(!`${app}\n${workspace}\n${css}\n${albumCss}`.toLowerCase().includes(forbidden.toLowerCase()), `Unauthorized Phase 7 runtime marker found: ${forbidden}.`);
}

console.log('PHASE UX foundation guard passed: four focused primary destinations, shared tokens, readable responsive controls, legacy deep links and Phase 7 STOP preserved. Current build identity is owned by the active milestone guard.');
