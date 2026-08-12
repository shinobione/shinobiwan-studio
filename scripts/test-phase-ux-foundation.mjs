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
  "route: 'dashboard'", "route: 'workflow'", "route: 'catalog'", "route: 'albums'", "route: 'intelligence'",
  "label: 'Dashboard'", "label: 'Workflow'", "label: 'Catalog'", "label: 'Albums / Projects'", "label: 'Intelligence'",
]) assert.ok(primaryNav.includes(required), `Primary Studio navigation is missing ${required}.`);
for (const forbidden of ["route: 'lyrics'", "route: 'assets'", "route: 'publishing'", "route: 'administration'"]) {
  assert.ok(!primaryNav.includes(forbidden), `Track-local or utility route leaked into primary navigation: ${forbidden}.`);
}

for (const required of [
  "{ id: 'overview', label: 'Overview' }", "{ id: 'metadata', label: 'Metadata' }", "{ id: 'assets', label: 'Assets' }",
  "{ id: 'lyrics', label: 'Lyrics' }", "{ id: 'intelligence', label: 'SonicTrace' }", '← Back to Catalog',
]) assert.ok(workspace.includes(required), `Track-local navigation is missing ${required}.`);

for (const legacyRoute of ["'versions'", "'publishing'"]) assert.ok(router.includes(legacyRoute), `Phase 7 must preserve existing deep-link compatibility for ${legacyRoute}.`);
for (const token of [
  '--studio-bg:', '--studio-surface:', '--studio-glass:', '--studio-border:', '--studio-text:', '--studio-cyan:', '--studio-violet:', '--studio-success:',
  '--studio-warning:', '--studio-danger:', '--studio-focus:', '--studio-control-height: 42px', '--studio-radius-md:', '--studio-shadow-panel:', '--studio-transition:',
  '@media (prefers-reduced-motion: reduce)', ':focus-visible',
]) assert.ok(css.includes(token), `Studio design system is missing ${token}.`);

assert.ok(albumCss.includes('grid-template-columns: repeat(5, minmax(0, 1fr))'), 'Authorized Phase 7 mobile navigation must fit five primary Studio destinations in one row.');
assert.ok(css.includes('.nav-list-utility { display: none; }'), 'Mobile must keep utility navigation secondary.');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(version) && codename.startsWith('phase-ux-');
const phase7Line = /^0\.(?:16|17)\./.test(version) && codename.startsWith('phase7-');
assert.ok(phaseUxLine || phase7Line, `Studio UX foundation must stay on the validated PHASE UX lineage or explicitly authorized Phase 7 successor, got ${version} / ${codename}.`);

if (phase7Line) {
  assert.ok(primaryNav.includes("route: 'workflow'"), 'Authorized Phase 7 successor must expose Workflow as a focused primary destination.');
  assert.ok(router.includes("'workflow'"), 'Authorized Phase 7 successor router must recognize Workflow.');
  assert.ok(app.includes('PHASE 7-'), 'Authorized Phase 7 successor must identify its current milestone in the shell.');
}

console.log(`Studio UX foundation guard passed through ${version}: focused primary destinations, shared tokens, responsive controls and legacy deep links remain intact.`);