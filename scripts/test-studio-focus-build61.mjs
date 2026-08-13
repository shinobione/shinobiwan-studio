import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const main = read('src/main.tsx');
const css = read('src/studio-focus-build61-polish.css');
const app = read('src/App.tsx');
const summary = read('src/components/SonicTraceArtistSummary.tsx');

assert.match(release, /version:\s*'0\.19\.1'/);
assert.match(release, /build:\s*61/);
assert.match(release, /studio-focus-slice4-polish/);
assert.equal(pkg.version, '0.19.1');
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build61.mjs'), 'Build 61 polish guard must run in the Studio Focus chain.');
assert.ok(main.indexOf("import './studio-focus-build61-polish.css';") > main.indexOf("import './studio-focus-sonictrace-summary.css';"), 'Build 61 corrective styles must layer last after the accepted Slice 4 summary styles.');

assert.ok(app.includes('<div className="sidebar-foot">'), 'Existing release/status footer must remain in the desktop sidebar.');
assert.match(css, /\.sidebar-foot\{[\s\S]*margin-top:auto;/, 'Release/status card must be anchored at the bottom of the desktop sidebar.');
assert.match(css, /\.sidebar-foot\{[\s\S]*border:1px solid rgba\(84,232,224,\.12\)/, 'Bottom release/status card must have a restrained premium boundary.');
assert.match(css, /@media\(max-width:1080px\)\{[\s\S]*\.sidebar-foot\{display:none\}/, 'Accepted compact/mobile sidebar behavior must remain unchanged.');

assert.ok(summary.includes('sonic-artist-summary'), 'Compact SonicTrace summary component must remain unchanged in ownership and data flow.');
assert.match(css, /\.sonic-artist-summary\{[\s\S]*padding:20px 22px 18px;/, 'Compact SonicTrace surface must gain deliberate card spacing.');
assert.match(css, /\.sonic-artist-insights\{[\s\S]*grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/, 'Desktop artist summary must use a balanced six-column composition grid.');
assert.ok(css.includes('.sonic-artist-insights>div:nth-child(1)'), 'First row SonicTrace insights must be deliberately composed rather than five equal admin boxes.');
assert.ok(css.includes('.sonic-artist-insights>div:nth-child(4)'), 'Second row SonicTrace insights must be deliberately composed rather than five equal admin boxes.');
assert.match(css, /\.sonic-artist-palette\{[\s\S]*border-top:1px solid/, 'Instrument palette must read as a coherent footer strip inside the SonicTrace card.');
assert.ok(css.includes('.sonic-artist-summary--outdated'), 'Truthful OUTDATED styling must remain supported.');
assert.ok(css.includes('.sonic-artist-summary--unavailable'), 'Truthful UNAVAILABLE styling must remain supported.');
assert.ok(css.includes('@media(max-width:760px)'), 'SonicTrace polish must keep a single-column mobile fallback.');

for (const forbidden of ['fetch(', 'saveSonicTraceAnalysis', 'uploadAdminTrackAsset', 'saveAdminTrackMetadata', '/api/studio/write']) {
  assert.ok(!css.includes(forbidden), `Presentation-only Build 61 CSS must not acquire write/network behavior: ${forbidden}`);
}

console.log('Studio Focus Build 61 guard passed: sidebar release status is bottom-anchored, compact and premium; SonicTrace artist summary has intentional hierarchy without changing truth, routing or authority.');
