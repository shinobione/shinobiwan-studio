import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const workspace = read('src/components/TrackWorkspace.tsx');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const assets = read('src/components/AssetsManager.tsx');
const sonic = read('src/components/SonicTracePanel.tsx');
const metadataCss = read('src/metadata-validation.css');
const workspaceCss = read('src/workspace.css');
const assetsCss = read('src/phase4-operations.css');
const sonicCss = read('src/sonictrace.css');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');

for (const group of ['Identity', 'Release', 'Discovery', 'Music details', 'LaunchPAD theme']) {
  assert.ok(metadata.includes(`title="${group}"`), `Metadata form is missing the ${group} group.`);
}
for (const protectedBehavior of ['validateAdminTrackMetadata', 'saveAdminTrackMetadata', 'STALE_MANIFEST', 'QUALITY_BLOCKED', 'SAVE_ROLLBACK', 'globalThis.confirm']) {
  assert.ok(metadata.includes(protectedBehavior), `Metadata protected behavior is missing ${protectedBehavior}.`);
}
assert.ok(metadata.includes('Validate metadata'));
assert.ok(metadata.includes('Save metadata'));
assert.ok(metadata.includes('metadata-color-field'));
assert.ok(!metadata.includes('validate against Track Manager v5.11'), 'Normal metadata copy must not expose backend version jargon.');
for (const marker of ['.metadata-form-groups', '.metadata-group-wide', '.metadata-color-field', '@media (max-width: 590px)']) assert.ok(metadataCss.includes(marker));

for (const marker of ['Manage production media', 'EDITING ENABLED', 'Safety details', 'uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'globalThis.confirm']) {
  assert.ok(assets.includes(marker), `Assets media-management surface is missing ${marker}.`);
}
assert.ok(!workspace.includes('<AssetRow'), 'The Assets tab must not duplicate the media state above the manager.');
assert.equal((workspace.match(/<AssetsManager track=\{track\}/g) || []).length, 1, 'Assets must render exactly one media-management surface.');
const assetsSection = workspace.slice(workspace.indexOf("section === 'assets'"), workspace.indexOf("section === 'versions'"));
assert.ok(assetsSection.includes('<AssetsManager track={track}'), 'The single media manager must live in the Assets section.');
for (const marker of ['grid-template-columns:repeat(2,minmax(0,1fr))', ':has(.assets-cover-palette)', '.phase4-assets-diagnostics']) assert.ok(assetsCss.includes(marker));

for (const marker of ['workspace-lyrics-shell', 'workspace-lyrics-status', 'LYRICS / STUDIO', '<EmbeddedLyricsStudio', '<details className="workspace-lyrics-plain">', 'Open standalone fallback']) {
  assert.ok(workspace.includes(marker), `Lyrics visual shell is missing ${marker}.`);
}
assert.ok(workspace.indexOf('<EmbeddedLyricsStudio') < workspace.indexOf('<LyricsEditorPanel'), 'Embedded LRC Maker must remain the primary lyrics surface.');
for (const contract of ['lyrics.txt</strong> is the only canonical source', 'Timestamps inside it define synchronization', 'LRC export remains optional']) assert.ok(workspace.includes(contract));
for (const marker of ['.workspace-lyrics-status', '.workspace-lyrics-plain', '@media(max-width:590px)']) assert.ok(workspaceCss.includes(marker));

for (const marker of ['Understand this track', 'Analysis ready', 'Analyze with SonicTrace', 'Re-scan with SonicTrace', 'sonic-progress', '<details className="sonic-diagnostics">', 'Save analysis']) {
  assert.ok(sonic.includes(marker), `SonicTrace action hierarchy is missing ${marker}.`);
}
for (const protectedBehavior of ['fetchCanonicalAudio', 'analyzeBrowserDsp', 'runSonicTraceAnalysis', 'browserOnlyAnalysis', 'saveSonicTraceAnalysis']) assert.ok(sonic.includes(protectedBehavior));
for (const marker of ['.sonic-progress', '.sonic-diagnostics', '.sonic-intro p']) assert.ok(sonicCss.includes(marker));

assert.equal(pkg.version, '0.10.4');
assert.ok(release.includes("version: '0.10.4'"));
assert.ok(release.includes('build: 26'));
assert.ok(release.includes("codename: 'phase-ux-responsive-closeout'"));
for (const source of [workspace, metadata, assets, sonic]) for (const forbidden of ['phase7', 'phase-7']) assert.ok(!source.toLowerCase().includes(forbidden));

console.log('PHASE UX UX-4 guard passed: grouped metadata, single media manager, embedded-first Lyrics and action-led SonicTrace preserve all guarded engines.');
