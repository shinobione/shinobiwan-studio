import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const buildMatch = release.match(/build:\s*(\d+)/);
const versionMatch = release.match(/version:\s*'([^']+)'/);
assert.ok(buildMatch && Number(buildMatch[1]) >= 52, 'Build 52 Tracks label must survive every successor build.');
assert.ok(versionMatch && /^0\.17\./.test(versionMatch[1]), 'Build 52 successor remains on the 0.17.x release line for this Studio Focus pre-phase.');
assert.equal(pkg.version, versionMatch[1]);

assert.ok(app.includes("{ route: 'catalog', label: 'Tracks', glyph: '♫' }"), 'Daily navigation must present the catalog route as Tracks.');
assert.ok(!app.includes("{ route: 'catalog', label: 'Catalog', glyph: '♫' }"), 'Legacy Catalog sidebar label must not return.');
assert.ok(app.includes("route === 'catalog'"), 'The existing catalog route must remain unchanged.');
assert.ok(app.includes('<CatalogView />'), 'The existing Tracks/Catalog view implementation must remain mounted.');
assert.ok(app.includes('<TrackWorkspace trackId={trackId} section={trackSection} />'), 'Track Workspace routing must remain intact.');

console.log('Build 52 Tracks navigation ancestry passed: visible Catalog label remains Tracks across the Studio Focus successor without changing route authority.');
