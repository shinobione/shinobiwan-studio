import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const versionParts = String(pkg.version || '').split('.').map(Number);
const successorVersion = versionParts.length === 3 && versionParts.every(Number.isFinite)
  && (versionParts[0] > 0 || versionParts[1] > 16 || (versionParts[1] === 16 && versionParts[2] >= 3));

assert.ok(releaseBuild >= 49, 'Build 49 Flow handoff guard must remain valid for successor Studio builds.');
assert.ok(successorVersion, `Studio version ${pkg.version} must remain at or beyond the Build 49 baseline 0.16.3.`);
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-native-release-campaign-build49.mjs'));

assert.ok(engine.includes('MASTER_CONCEPT_DIRECTIONS'), 'Release handoff must preserve multiple distinct visual directions.');
assert.ok(engine.includes('CREATIVE RESET: start a genuinely new visual concept from scratch'), 'Rerolls must explicitly discard the previous visual concept.');
assert.ok(engine.includes('buildFreshMasterPrompt'), 'Fresh MASTER prompt builder must remain first-class.');
assert.ok(engine.includes('SHINOBIWAN_LOGO_RULE'), 'Build111 must centralize the permanent SHINOBIWAN branding rule.');

assert.ok(panel.includes('New MASTER concept'), 'Release handoff must expose an explicit MASTER concept reroll action.');
assert.ok(panel.includes('const newMasterConcept = () =>'), 'Reroll behavior must remain isolated and inspectable.');
assert.ok(panel.includes('setMasterPrompt(buildFreshMasterPrompt(track, true, nextConceptIndex))'), 'Reroll must rebuild from canonical track context with the permanent logo rule enabled.');
assert.ok(panel.includes("const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/'"), 'Google Flow shortcut must remain explicit.');
assert.ok(panel.includes('Open Google Flow ↗'), 'Release handoff must expose Flow beside prompt actions.');
assert.ok(panel.includes('target="_blank"'), 'Flow must open separately so Studio remains available.');
assert.ok(panel.includes('rel="noopener noreferrer"'), 'External Flow shortcut must use safe new-tab rel attributes.');

for (const obsolete of [
  'setMaster(',
  'setSquare(',
  'setVertical(',
  'Existing imported MASTER and derivatives were preserved',
  'release-campaign-storage',
  'saveReleaseCampaignDraft',
  'loadReleaseCampaignDraft',
  'exportCampaign',
]) assert.ok(!panel.includes(obsolete), `Build111 must retire obsolete browser-local campaign machinery: ${obsolete}`);

for (const forbidden of ['fetch(', 'uploadTrackAsset', 'replaceTrackAsset', 'saveTrackMetadata', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build111 Flow handoff must remain non-canonical: ${forbidden}`);
}

console.log(`Build 49 creative-reset / Flow ancestry passed under successor Studio Build ${releaseBuild}: prompt rerolls remain, while browser-local visual persistence and packaging are intentionally retired by Build111.`);
