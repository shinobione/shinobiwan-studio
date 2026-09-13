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

const dailyStart = app.indexOf('const DAILY_NAV:');
const toolsStart = app.indexOf('const TOOL_NAV:');
const shellStart = app.indexOf('const shellCopy:');
assert.ok(dailyStart >= 0 && toolsStart > dailyStart && shellStart > toolsStart, 'Build110 navigation declarations must remain explicit and ordered.');
const dailyNav = app.slice(dailyStart, toolsStart);
const toolsNav = app.slice(toolsStart, shellStart);

for (const required of [
  "route: 'dashboard'",
  "route: 'catalog'",
  "route: 'albums'",
  "label: 'Home'",
  "label: 'Tracks'",
  "label: 'Albums'",
]) assert.ok(dailyNav.includes(required), `Studio daily navigation is missing ${required}.`);
for (const forbidden of ["route: 'workflow'", "route: 'intelligence'", "route: 'lyrics'", "route: 'assets'", "route: 'publishing'", "route: 'administration'"]) {
  assert.ok(!dailyNav.includes(forbidden), `Technical/track-local route leaked into daily navigation: ${forbidden}.`);
}
for (const required of ["route: 'intelligence'", "route: 'administration'", "label: 'Intelligence'", "label: 'System'"]) {
  assert.ok(toolsNav.includes(required), `Build110 Tools navigation is missing ${required}.`);
}
assert.ok(!toolsNav.includes("route: 'workflow'"), 'Build110 must keep Workflow out of global navigation; contextual deep links remain available.');
assert.ok(app.includes('<summary>Tools</summary>'), 'Build110 specialist routes must stay progressively disclosed under Tools.');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(version) && codename.startsWith('phase-ux-');
const phase7Line = /^0\.(?:16|17)\./.test(version) && codename.startsWith('phase7-');
const studioFocusLine = /^0\.(?:17|18|19)\./.test(version) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || phase7Line || studioFocusLine, `Studio UX foundation must stay on the validated PHASE UX / Phase 7 lineage or authorized Studio Focus successor, got ${version} / ${codename}.`);

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
  ]) assert.ok(workspace.includes(required), `Track Workshop must preserve artist navigation and legacy detail routes: ${required}.`);
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
  assert.ok(router.includes(legacyRoute), `Studio must preserve deep-link compatibility for ${legacyRoute}.`);
}

for (const token of [
  '--studio-bg:', '--studio-surface:', '--studio-glass:', '--studio-border:', '--studio-text:',
  '--studio-cyan:', '--studio-violet:', '--studio-success:', '--studio-warning:', '--studio-danger:',
  '--studio-focus:', '--studio-control-height: 42px', '--studio-radius-md:', '--studio-shadow-panel:',
  '--studio-transition:', '@media (prefers-reduced-motion: reduce)', ':focus-visible',
]) assert.ok(css.includes(token), `Studio design system is missing ${token}.`);

assert.ok(albumCss.includes('grid-template-columns: repeat(5, minmax(0, 1fr))'), 'Legacy mobile navigation CSS remains available for backward-compatible routes.');
assert.ok(css.includes('.nav-list-utility { display: none; }'), 'Legacy utility navigation rule must remain available.');
assert.ok(focusCss.includes('.focus-advanced-nav'), 'Studio Focus must retain progressive-disclosure styling.');

if (phase7Line || studioFocusLine) {
  assert.ok(router.includes("'workflow'"), 'Authorized successor router must preserve Workflow deep links.');
  assert.ok(app.includes("route === 'workflow' && <WorkflowView />"), 'Workflow engine must remain reachable even when removed from global navigation.');
}

console.log('Studio UX foundation guard passed: Build110 daily navigation is human-first, specialist tools are disclosed, workflow remains contextual, shared tokens and deep links stay intact.');
