import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const workspace = read('src/components/TrackWorkspace.tsx');
const summaryComponent = read('src/components/SonicTraceArtistSummary.tsx');
const summaryModel = read('src/sonictrace-artist-summary.ts');
const home = read('src/components/FocusHome.tsx');
const catalog = read('src/components/CatalogView.tsx');
const main = read('src/main.tsx');
const css = read('src/studio-focus-sonictrace-summary.css');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.19\.\d+$/);
assert.ok(build >= 60, `Slice 4 successor must remain Build 60 or later, got ${build}.`);
assert.ok(codename.startsWith('studio-focus-slice4-'), `Slice 4 successor codename must remain explicit, got ${codename}.`);
assert.equal(pkg.version, version);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build60.mjs'), 'Build 60 guard must run in the Studio Focus chain.');
assert.ok(main.indexOf("import './studio-focus-sonictrace-summary.css';") > main.indexOf("import './studio-focus-workshop.css';"), 'Slice 4 presentation must layer after the accepted Track Workshop styles.');

assert.ok(workspace.includes("import { SonicTraceArtistSummary } from './SonicTraceArtistSummary';"), 'Track Workspace must import the compact artist SonicTrace surface.');
assert.ok(workspace.includes('<SonicTraceArtistSummary track={track} />'), 'Artist SonicTrace summary must live directly in the Track overview.');
assert.ok(workspace.includes("section === 'intelligence'"), 'Full SonicTrace diagnostics must remain available behind the Advanced/deep-link surface.');
assert.ok(workspace.includes('<SonicTracePanel track={track}'), 'Existing full SonicTrace panel must remain intact.');

for (const marker of [
  'getSonicTraceAnalysisState(track.id)',
  "track.readSource !== 'private'",
  'Sonic insight stays private',
  'Details / Advanced →',
  'Analyze with SonicTrace →',
  'protected canonical SonicTrace sidecar',
]) assert.ok(summaryComponent.includes(marker), `Slice 4 SonicTrace artist surface is missing ${marker}.`);

for (const marker of [
  'sonicTraceProfileState',
  'sonicTraceProfileLabel',
  'topGenres',
  'topMoods',
  'topInstruments',
  'traits',
  'section_count',
  'hookCount',
  'integrated_lufs',
  'true_peak_dbtp',
  "profileState === 'outdated'",
  "profileState === 'unavailable'",
  "profileState === 'full'",
  'Useful sound profile, with limits',
]) assert.ok(summaryModel.includes(marker), `Slice 4 truthful summary model is missing ${marker}.`);

for (const forbidden of [
  'embedding.vector',
  '.vector.map',
  'saveSonicTraceAnalysis',
  'uploadAdminTrackAsset',
  'saveAdminTrackMetadata',
  'deleteAdminTrackAsset',
  '/api/studio/write',
]) {
  assert.ok(!summaryModel.includes(forbidden), `Artist summary model must not expose engine/write plumbing: ${forbidden}`);
  assert.ok(!summaryComponent.includes(forbidden), `Artist summary component must remain read-only: ${forbidden}`);
}

assert.ok(summaryModel.includes('scores are not') === false, 'Routine Track summary must not surface engine calibration jargon.');
assert.ok(summaryModel.includes("detail: 'Top relative SonicTrace matches'"), 'Neural labels must be framed as relative matches, not absolute probabilities.');
assert.ok(summaryModel.includes('Studio hides the old conclusions until SonicTrace analyzes the current audio.'), 'OUTDATED profiles must not expose stale artist conclusions as current.');
assert.ok(summaryModel.includes('Studio does not pretend that genre, mood, mastering or structure were analyzed.'), 'UNAVAILABLE profiles must remain explicit and limited.');

for (const marker of [
  'NEEDS ATTENTION',
  'PRODUCTION COMPLETE',
  'PUBLISHED',
  'DRAFTS',
  'What needs attention',
  'Production workflow has a next action',
]) assert.ok(home.includes(marker), `Build 60 Home terminology clarification is missing ${marker}.`);

for (const marker of [
  '>Needs attention</span>',
  '>Production complete</span>',
  '>Published</span>',
  "if (filter === 'ready') return workflow.ready;",
  "if (filter === 'to-finish') return !workflow.ready;",
  "track.status === 'published' && track.publishing.catalogVisible",
]) assert.ok(catalog.includes(marker), `Build 60 Tracks axis clarification is missing ${marker}.`);
assert.ok(!catalog.includes("if (filter === 'ready') return track.status !== 'published'"), 'Production-complete filter must not exclude published tracks: production and publication are separate axes.');
assert.ok(!catalog.includes("if (filter === 'to-finish') return track.status !== 'published'"), 'Needs-attention filter must include published tracks that still have production actions.');

for (const marker of [
  '.sonic-artist-summary',
  '.sonic-artist-profile.full',
  '.sonic-artist-profile.partial',
  '.sonic-artist-profile.unavailable',
  '@media(max-width:760px)',
  '.focus-summary{grid-template-columns:repeat(4,minmax(0,1fr))}',
]) assert.ok(css.includes(marker), `Build 60 compact/responsive presentation is missing ${marker}.`);

console.log(`Studio Focus Build 60 ancestry passed under ${version} Build ${build}: compact truthful SonicTrace conclusions, Advanced diagnostics and production/publication semantics remain intact.`);
