import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const app = read('src/App.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const router = read('src/router.ts');
const css = read('src/ux-foundation.css');
const focusCss = read('src/studio-focus.css');
const albumCss = read('src/c2-5-d-navigation.css');
const release = read('src/release.ts');

const dailyNav = app.slice(app.indexOf('const DAILY_NAV:'), app.indexOf('const ADVANCED_NAV:'));
const advancedNav = app.slice(app.indexOf('const ADVANCED_NAV:'), app.indexOf('const shellCopy:'));
for (const required of [
  "route: 'dashboard'",
  "route: 'catalog'",
  "route: 'albums'",
  "label: 'Home'",
  "label: 'Tracks'",
  "label: 'Albums'",
]) assert.ok(dailyNav.includes(required), `Studio Focus daily navigation is missing ${required}.`);
for (const forbidden of ["route: 'workflow'", "route: 'intelligence'", "route: 'lyrics'", "route: 'assets'", "route: 'publishing'", "route: 'administration'"]) {
  assert.ok(!dailyNav.includes(forbidden), `Technical/track-local route leaked into the Studio Focus daily navigation: ${forbidden}.`);
}
for (const required of ["route: 'workflow'", "route: 'intelligence'", "route: 'administration'", "label: 'Workflow'", "label: 'Intelligence'", "label: 'System'"]) {
  assert.ok(advancedNav.includes(required), `Studio Focus Advanced navigation is missing ${required}.`);
}

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(version) && codename.startsWith('phase-ux-');
const phase7Line = /^0\.(?:16|17)\./.test(version) && codename.startsWith('phase7-');
const studioFocusLine = /^0\.(?:17|18)\./.test(version) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || phase7Line || studioFocusLine, `Studio UX foundation must stay on the validated PHASE UX / Phase 7 lineage or the explicitly authorized Studio Focus successor, got ${version} / ${codename}.`);

if (studioFocusLine && build >= 57) {
  for (const required of [
    "{ label: 'Track', href: 'overview'",
    "{ label: 'Visuals', href: 'assets'",
    "{ label: 'Lyrics', href: 'lyrics'",
    "{ label: 'Release', href: 'market'",
    '← Back to Tracks',
    "section === 'metadata'",
    "section === 'intelligence'",
    "section === 'versions'",
    "section === 'publishing'",
  ]) assert.ok(workspace.includes(required), `Build 57 Track Workshop must preserve artist navigation and legacy workspace detail routes: ${required}.`);
} else {
  for (const required of [
    "{ id: 'overview', label: 'Overview' }",
    "{ id: 'metadata', label: 'Metadata' }",
    "{ id: 'assets', label: 'Assets' }",
    "{ id: 'lyrics', label: 'Lyrics' }",
    "{ id: 'intelligence', label: 'SonicTrace' }",
    '← Back to Catalog',
  ]) assert.ok(workspace.includes(required), `Pre-Slice-3 Track Workspace ancestry missing ${required}.`);
}

for (const legacyRoute of ["'workflow'", "'intelligence'", "'versions'", "'publishing'", "'metadata'", "'assets'", "'lyrics'", "'market'"]) {
  assert.ok(router.includes(legacyRoute), `Studio Focus must preserve existing deep-link compatibility for ${legacyRoute}.`);
}

for (const token of [
  '--studio-bg:', '--studio-surface:', '--studio-glass:', '--studio-border:', '--studio-text:',
  '--studio-cyan:', '--studio-violet:', '--studio-success:', '--studio-warning:', '--studio-danger:',
  '--studio-focus:', '--studio-control-height: 42px', '--studio-radius-md:', '--studio-shadow-panel:',
  '--studio-transition:', '@media (prefers-reduced-motion: reduce)', ':focus-visible',
]) assert.ok(css.includes(token), `Studio design system is missing ${token}.`);

assert.ok(albumCss.includes('grid-template-columns: repeat(5, minmax(0, 1fr))'), 'Legacy mobile navigation CSS remains available for backward-compatible routes.');
assert.ok(css.includes('.nav-list-utility { display: none; }'), 'Legacy utility navigation rule must remain available.');
assert.ok(focusCss.includes('.focus-advanced-nav'), 'Studio Focus must implement progressive disclosure for Advanced routes.');

if (phase7Line || studioFocusLine) {
  assert.ok(router.includes("'workflow'"), 'Authorized successor router must preserve Workflow.');
  assert.ok(app.includes('PHASE 7-A') || app.includes('PHASE 7-B'), 'Authorized successor must preserve its validated Phase 7 ancestry in the shell.');
}

console.log('Studio UX foundation guard passed: Studio Focus daily navigation is artist-first, Track Workshop may regroup local tabs, Advanced keeps specialist routes, shared tokens and legacy deep links remain intact.');
