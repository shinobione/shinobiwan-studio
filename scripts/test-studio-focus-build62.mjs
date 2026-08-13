import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const home = read('src/components/FocusHome.tsx');
const summary = read('src/components/SonicTraceArtistSummary.tsx');
const assets = read('src/components/AssetsManager.tsx');
const campaign = read('src/components/TrackToMarketPanel.tsx');
const main = read('src/main.tsx');
const correctiveCss = read('src/studio-focus-build62-closeout-corrective.css');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';

assert.match(version, /^0\.19\.\d+$/, 'Build 62 successors must remain on the accepted Studio Focus 0.19.x release line.');
assert.ok(build >= 62, `Build 62 closeout corrective must remain inherited by Build 62 or later, got Build ${build}.`);
assert.ok(codename.startsWith('studio-focus-slice4-'), `Build 62 successor codename must preserve Studio Focus Slice 4 lineage, got ${codename}.`);
assert.equal(pkg.version, version);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build62.mjs'), 'Build 62 corrective guard must run in the inherited Studio Focus chain.');

assert.ok(home.includes("type FocusStep = 'track' | 'visuals' | 'lyrics' | 'sonic' | 'release';"), 'Home workflow must use Sonic as the artist-facing intelligence step.');
assert.ok(home.includes("if (step === 'sonic') return"), 'Sonic readiness must preserve the existing audio-intelligence truth state.');
assert.ok(home.includes("if (step === 'sonic') return 'Sonic';"), 'Home must visibly label the workflow step Sonic.');
assert.ok(home.includes("'Refresh SonicTrace'"));
assert.ok(home.includes("'Analyze with SonicTrace'"));
assert.ok(!home.includes("return 'Sound';"), 'Legacy Sound step label must not return to Home.');

for (const marker of ['SONICTRACE', 'Sonic insight stays private', 'Reading the current Sonic profile', 'Analyze with SonicTrace →']) {
  assert.ok(summary.includes(marker), `Compact SonicTrace surface is missing Build 62 wording: ${marker}`);
}

assert.ok(assets.includes('function paletteFetchCredentials(url: string): RequestCredentials'), 'Palette extraction must choose credentials according to the actual media authority URL.');
assert.ok(assets.includes("? 'include' : 'omit'"), 'Private Track Manager media may include credentials while public cover reads must omit them.');
assert.ok(assets.includes("mode: 'cors'"), 'Palette cover fetch keeps an explicit CORS read boundary.');
assert.ok(assets.includes("title: 'Palette extraction failed'"), 'Palette fetch failures must be presented as palette failures, not generic Studio errors.');
assert.ok(assets.includes('uploadAdminTrackAsset'), 'Existing guarded asset upload remains intact.');
assert.ok(assets.includes('deleteAdminTrackAsset'), 'Existing guarded asset deletion remains intact.');

assert.ok(correctiveCss.includes('.rc-provider-field{display:none!important}'), 'Misleading premium-provider selector must be removed from the artist-facing UI.');
assert.ok(correctiveCss.includes("content:'Sonic'"), 'Track Workshop legacy Sound stage must render as Sonic in the Build 62 corrective layer.');
assert.ok(correctiveCss.includes("content:'TRACK / SONIC'"), 'Full SonicTrace subpage must render TRACK / SONIC in the Build 62 corrective layer.');
assert.ok(main.indexOf("import './studio-focus-build62-closeout-corrective.css';") > main.indexOf("import './studio-focus-build61-polish.css';"), 'Build 62 corrective styles must layer after Build 61.');
assert.ok(campaign.includes("const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/'"), 'Google Flow direct handoff must remain available.');
assert.ok(campaign.includes('Open Google Flow ↗'), 'Google Flow shortcut must remain visible after provider-selector cleanup.');
assert.ok(campaign.includes('buildMasterPrompt(track, false)'), 'MASTER prompt generation remains provider-independent.');
assert.ok(campaign.includes("buildVariantPrompt(track, '1:1')"));
assert.ok(campaign.includes("buildVariantPrompt(track, '9:16')"));

for (const forbidden of ['/api/studio/write', 'generic-r2-write', 'canonicalWrite: true']) {
  assert.ok(!home.includes(forbidden));
  assert.ok(!summary.includes(forbidden));
  assert.ok(!correctiveCss.includes(forbidden));
}

console.log(`Studio Focus Build 62 ancestry passed under ${version} Build ${build}: Sonic wording, public/private palette fetch credentials and provider-choice cleanup remain inherited while successor repairs preserve existing authority boundaries.`);
