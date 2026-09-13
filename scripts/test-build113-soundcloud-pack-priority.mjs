import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const panel = read('src/components/TrackToMarketPanel.tsx');
const css = read('src/release-campaign.css');
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const currentVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';

assert.ok(currentBuild >= 113, `Build113 guard requires Build113 or a successor, got Build${currentBuild}.`);
assert.equal(pkg.version, currentVersion, 'package.json must match the active Studio release version.');
if (currentBuild === 113) {
  assert.equal(pkg.version, '0.19.35', 'Build113 must publish Studio v0.19.35.');
  assert.match(release, /version:\s*'0\.19\.35'/);
  assert.match(release, /build:\s*113/);
  assert.match(release, /phase:\s*10/);
  assert.match(release, /studio-focus-build113-soundcloud-pack-priority/);
  assert.match(release, /build112AncestryMarker/);
} else {
  assert.match(release, /build113AncestryMarker/, `Build${currentBuild} must preserve accepted Build113 ancestry.`);
  assert.match(release, /phase:\s*10/, `Build${currentBuild} must stay on the active Phase10 program while inheriting Build113.`);
}
assert.match(pkg.scripts['check:build113'], /test-build113-soundcloud-pack-priority\.mjs/);
assert.match(pkg.scripts.build, /npm run check:build113/, 'Successor production builds must keep the Build113 guard in the full gate.');

for (const required of [
  'SOUNDCLOUD · FROM MUSIC PACK',
  'Ready to publish',
  'Description, tags and the selected highlight come directly from the approved MUSIC Pack. Studio does not regenerate them.',
  'label="Description" value={pack.soundcloud.description}',
  'label="Tags" value={pack.soundcloud.tags}',
  'label="Highlight · 20s target" value={highlightText}',
  'More from PACK COMPLET · Social / Release / Production',
  'soundcloud-priority-build113',
]) assert.ok(panel.includes(required), `Build113 primary SoundCloud handoff missing ${required}.`);

const priorityStart = panel.indexOf('<article className="panel rc-soundcloud-priority">');
const detailsStart = panel.indexOf('<details className="panel rc-music-pack-details">');
assert.ok(priorityStart >= 0 && detailsStart > priorityStart, 'SoundCloud handoff must be visible before the secondary collapsed PACK COMPLET details.');

for (const forbidden of [
  'SoundCloud description input',
  'SoundCloud tags input',
  'Select 20s audio',
  'type="range"',
  'type="time"',
]) assert.ok(!panel.includes(forbidden), `Build113 must not reintroduce manual SoundCloud authoring UI: ${forbidden}`);

for (const required of ['.rc-soundcloud-priority', '.rc-soundcloud-grid', '.rc-soundcloud-head', '.rc-pack-revision']) {
  assert.ok(css.includes(required), `Build113 SoundCloud priority styling missing ${required}.`);
}

for (const forbidden of ['saveAdmin', 'uploadAdmin', 'deleteAdmin', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build113 Release UI must remain non-canonical/read-only: ${forbidden}`);
}

console.log(`Build113 SoundCloud Pack priority ancestry PASS under Studio ${currentVersion} Build${currentBuild}: imported description, tags and highlight remain visible immediately, secondary PACK COMPLET data stays collapsed, and no manual/canonical authoring path is restored.`);
