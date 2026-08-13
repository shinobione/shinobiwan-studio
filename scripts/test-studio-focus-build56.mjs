import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const catalog = read('src/components/CatalogView.tsx');
const main = read('src/main.tsx');
const statusCss = read('src/studio-focus-status-labels.css');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.(?:17|18)\.\d+$/);
assert.ok(build >= 56, `Build 56 status-label ancestry requires Build 56 or later, got ${build}.`);
assert.ok(codename.startsWith('studio-focus-'), `Build 56 status-label ancestry must remain under Studio Focus, got ${codename}.`);
assert.equal(pkg.version, version);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build56.mjs'), 'Build 56 status-label guard must run in the Studio Focus chain.');

const focusIndex = main.indexOf("import './studio-focus.css';");
const readabilityIndex = main.indexOf("import './studio-focus-readability.css';");
const statusIndex = main.indexOf("import './studio-focus-status-labels.css';");
assert.ok(focusIndex >= 0 && readabilityIndex > focusIndex && statusIndex > readabilityIndex, 'Build 56 status labels must layer after Build 54 and Build 55 styles.');

assert.match(statusCss, /\.catalog-production-state\{[\s\S]*display:flex;[\s\S]*flex-wrap:wrap;/);
assert.match(statusCss, /\.catalog-production-state span\{[\s\S]*flex:0 0 auto;[\s\S]*overflow:visible;[\s\S]*text-overflow:clip;[\s\S]*white-space:nowrap;/);
assert.ok(!statusCss.includes('text-overflow:ellipsis'), 'Build 56 production-state labels must never truncate with ellipsis.');
assert.ok(!statusCss.includes('overflow:hidden'), 'Build 56 production-state labels must not hide label text.');
assert.ok(!statusCss.includes('display:none'), 'Build 56 must not hide production state information.');

for (const label of ['Audio', 'Cover', 'Lyrics', 'Canvas', 'Release']) {
  assert.ok(catalog.includes(`>${label}</span>`), `Build 56 must keep the full ${label} label in Tracks.`);
}

console.log(`Studio Focus Build 56 ancestry passed under ${version} Build ${build}: Audio / Cover / Lyrics / Canvas / Release remain fully readable while later Studio Focus slices evolve the Track workspace.`);
