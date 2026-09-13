import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const app = read('src/App.tsx');
const main = read('src/main.tsx');
const css = read('src/studio-build110-human-first.css');

assert.equal(pkg.version, '0.19.32', 'Build110 must publish Studio v0.19.32.');
assert.match(release, /version:\s*'0\.19\.32'/);
assert.match(release, /build:\s*110/);
assert.match(release, /phase:\s*10/);
assert.match(release, /studio-focus-build110-human-first-premium-ux/);
assert.match(release, /build109AncestryMarker/);

for (const required of [
  'className="studio-shell build110-human-first"',
  '<summary>Tools</summary>',
  "{ route: 'intelligence', label: 'Intelligence'",
  "{ route: 'administration', label: 'System'",
  'v{studioRelease.version} · {studioRelease.build}',
]) assert.ok(app.includes(required), `Build110 shell is missing ${required}.`);

assert.ok(!app.includes("{ route: 'workflow', label: 'Workflow'"), 'Build110 must remove duplicate Workflow from global navigation.');
assert.ok(!app.includes('className="phase-tag"'), 'Build110 daily sidebar must not expose internal phase bookkeeping.');
assert.ok(!app.includes('{studioRelease.summary}'), 'Build110 daily sidebar must not expose release-summary implementation copy.');

for (const required of [
  '.focus-health',
  '.focus-summary>article:nth-child(4)',
  '.phase7c-guided-action',
  '.workspace-focus-details .workspace-metadata-list',
  '.phase8-album-card-title code',
  ':active',
  ':focus-visible',
  '@media (prefers-reduced-motion:reduce)',
]) assert.ok(css.includes(required), `Build110 human-first CSS is missing ${required}.`);

assert.ok(main.includes("import './studio-build110-human-first.css';"), 'Build110 UX layer must load last from main.tsx.');

console.log('Build110 UX PASS: v0.19.32 / Build110 keeps daily navigation human-first, hides duplicate machine-facing clutter, and adds restrained premium interaction feedback.');
