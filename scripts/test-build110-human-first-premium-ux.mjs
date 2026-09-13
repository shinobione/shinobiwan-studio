import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const app = read('src/App.tsx');
const main = read('src/main.tsx');
const css = read('src/studio-build110-human-first.css');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.ok(build >= 110, `Build110 human-first ancestry requires Build110 or later, got Build ${build}.`);
assert.equal(pkg.version, version);
assert.match(release, /phase:\s*10/);
if (build === 110) {
  assert.equal(version, '0.19.32');
  assert.match(release, /studio-focus-build110-human-first-premium-ux/);
} else {
  assert.match(release, /build110AncestryMarker/);
}
assert.match(release, /build109AncestryMarker/);

for (const required of [
  'className="studio-shell build110-human-first"',
  '<summary>Tools</summary>',
  "{ route: 'intelligence', label: 'Intelligence'",
  "{ route: 'administration', label: 'System'",
  'v{studioRelease.version} · {studioRelease.build}',
]) assert.ok(app.includes(required), `Build110 shell ancestry is missing ${required}.`);

assert.ok(!app.includes("{ route: 'workflow', label: 'Workflow'"), 'Duplicate Workflow must stay out of global navigation.');
assert.ok(!app.includes('className="phase-tag"'), 'Daily sidebar must not expose internal phase bookkeeping.');
assert.ok(!app.includes('{studioRelease.summary}'), 'Daily sidebar must not expose release-summary implementation copy.');

for (const required of [
  '.focus-health',
  '.focus-summary>article:nth-child(4)',
  '.phase7c-guided-action',
  '.workspace-focus-details .workspace-metadata-list',
  '.phase8-album-card-title code',
  ':active',
  ':focus-visible',
  '@media (prefers-reduced-motion:reduce)',
]) assert.ok(css.includes(required), `Build110 human-first CSS ancestry is missing ${required}.`);

assert.ok(main.includes("import './studio-build110-human-first.css';"), 'Build110 UX layer must remain loaded.');

console.log(`Build110 human-first ancestry PASS under Studio ${version} Build${build}: simplified navigation, reduced technical clutter and restrained premium interactions remain inherited.`);
