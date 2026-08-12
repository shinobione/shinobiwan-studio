import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.17\.2'/);
assert.match(release, /build:\s*52/);
assert.match(release, /phase7-b-postpass-tracks-nav-polish/);
assert.equal(pkg.version, '0.17.2');

assert.ok(app.includes("{ route: 'catalog', label: 'Tracks', glyph: '♫' }"), 'Daily navigation must present the catalog route as Tracks.');
assert.ok(!app.includes("{ route: 'catalog', label: 'Catalog', glyph: '♫' }"), 'Legacy Catalog sidebar label must not return.');
assert.ok(app.includes("route === 'catalog'"), 'Build 52 is a label-only polish: the existing catalog route must remain unchanged.');
assert.ok(app.includes('<CatalogView />'), 'Build 52 must preserve the existing Tracks/Catalog view implementation.');
assert.ok(app.includes('<TrackWorkspace trackId={trackId} section={trackSection} />'), 'Build 52 must preserve Track Workspace routing.');

console.log('Build 52 Tracks navigation polish passed: visible Catalog label renamed to Tracks without changing routes, data contracts, or workspace behavior.');
