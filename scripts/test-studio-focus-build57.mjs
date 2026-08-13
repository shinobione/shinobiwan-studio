import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const workspace = read('src/components/TrackWorkspace.tsx');
const assets = read('src/components/AssetsManager.tsx');
const css = read('src/studio-focus-workshop.css');
const main = read('src/main.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const build57 = version === '0.18.0' && build === 57 && codename === 'studio-focus-track-workshop';
const slice3Successor = /^0\.18\.\d+$/.test(version) && build > 57 && codename.startsWith('studio-focus-');
assert.ok(build57 || slice3Successor, `Build 57 Track Workshop ancestry must survive authorized Slice 3 successors, got ${version} Build ${build} / ${codename}.`);
assert.equal(pkg.version, version);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build57.mjs'), 'Build 57 Track Workshop guard must run in the Studio Focus chain.');
assert.ok(main.indexOf("import './studio-focus-workshop.css';") > main.indexOf("import './studio-focus-status-labels.css';"), 'Track Workshop styles must layer after the accepted Slice 2 presentation.');

for (const marker of [
  "const ARTIST_TABS",
  "{ label: 'Track', href: 'overview'",
  "{ label: 'Visuals', href: 'assets'",
  "{ label: 'Lyrics', href: 'lyrics'",
  "{ label: 'Release', href: 'market'",
  'TRACK WORKSHOP',
  'Your track, at a glance',
  'What matters next',
  'Master audio',
  'Cover and Canvas',
  'Final production check',
  'View full SonicTrace analysis',
  '<ContinuationReceiptBanner',
  '<EmbeddedLyricsStudio',
  '<MetadataValidationPanel',
  '<SonicTracePanel',
  '<TrackToMarketPanel',
]) assert.ok(workspace.includes(marker), `Build 57 Track Workshop ancestry is missing ${marker}.`);

assert.ok(workspace.includes("kinds={['audio']}"), 'Track must scope canonical asset management to master audio.');
assert.ok(workspace.includes("kinds={['cover', 'thumbnail', 'video']}"), 'Visuals must scope canonical asset management to cover/thumbnail/video.');
assert.ok(workspace.includes("if (id === 'cover' || id === 'video') return 'assets';"), 'Cover and video next actions must route to Visuals.');
assert.ok(workspace.includes("if (id === 'publication') return 'market';"), 'Publication next actions must route to Release.');
assert.ok(workspace.includes("if (id === 'sonicTrace') return 'intelligence';"), 'SonicTrace deep links must remain available behind Track details.');

for (const legacySection of ["section === 'metadata'", "section === 'intelligence'", "section === 'versions'", "section === 'publishing'"]) {
  assert.ok(workspace.includes(legacySection), `Legacy deep-link section must remain compatible: ${legacySection}.`);
}

assert.ok(assets.includes('kinds?: AdminAssetKind[]'), 'AssetsManager must support task-scoped canonical asset controls.');
assert.ok(assets.includes('const visibleAssets = useMemo'), 'AssetsManager must filter visible controls without changing mutation ownership.');
assert.ok(assets.includes('uploadAdminTrackAsset'), 'Track Manager upload authority must remain unchanged.');
assert.ok(assets.includes('deleteAdminTrackAsset'), 'Track Manager delete authority must remain unchanged.');
assert.ok(assets.includes('saveAdminTrackMetadata'), 'Canonical palette save authority must remain unchanged.');

for (const marker of [
  '.workspace-artist-tabs',
  '.workspace-focus-stage-grid',
  '.workspace-focus-visual-grid',
  '.workspace-focus-release-grid',
  '@media(max-width:820px)',
  '@media(max-width:620px)',
]) assert.ok(css.includes(marker), `Build 57 responsive Track Workshop styling is missing ${marker}.`);

assert.ok(!workspace.includes("label: 'Overview'"), 'Overview must not return as an artist-facing Track tab.');
assert.ok(!workspace.includes("label: 'Metadata'"), 'Metadata must not return as an artist-facing Track tab.');
assert.ok(!workspace.includes("label: 'Assets'"), 'Assets must not return as an artist-facing Track tab.');
assert.ok(!workspace.includes("label: 'SonicTrace'"), 'SonicTrace must not remain a daily top-level Track tab.');
assert.ok(!workspace.includes("label: 'Release Pack'"), 'Release Pack must not remain a daily top-level Track tab.');

console.log(`Studio Focus Build 57 ancestry passed under ${version} Build ${build}: Track / Visuals / Lyrics / Release still regroup the guarded workspace without changing canonical ownership or removing legacy deep links.`);
