import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.16\.3'/);
assert.match(release, /build:\s*49/);
assert.match(release, /phase7-native-release-campaign-concept-reroll/);
assert.equal(pkg.version, '0.16.3');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-native-release-campaign-build49.mjs'));

assert.ok(engine.includes('MASTER_CONCEPT_DIRECTIONS'), 'Build 49 must expose multiple distinct visual directions.');
assert.ok(engine.includes('CREATIVE RESET: start a genuinely new visual concept from scratch'), 'Rerolls must explicitly discard the previous visual concept.');
assert.ok(engine.includes('buildFreshMasterPrompt'), 'Fresh MASTER prompt builder must be first-class.');
assert.ok(engine.includes('masterConceptIndex?: number'), 'Concept index must persist in the browser-local draft.');

assert.ok(panel.includes('New MASTER concept'), 'Build 49 must expose an explicit MASTER concept reroll action.');
assert.ok(panel.includes('const newMasterConcept = () =>'), 'Reroll behavior must be isolated and inspectable.');
assert.ok(panel.includes('setMasterPrompt(buildFreshMasterPrompt(track, Boolean(logo), nextConceptIndex))'), 'Reroll must rebuild from canonical track context and current logo state.');
assert.ok(panel.includes('Existing imported MASTER and derivatives were preserved'), 'UI must state that reroll is non-destructive.');

const rerollStart = panel.indexOf('const newMasterConcept = () =>');
const rerollEnd = panel.indexOf('const resetDraft = async () =>', rerollStart);
assert.ok(rerollStart >= 0 && rerollEnd > rerollStart, 'Reroll function boundaries must remain inspectable.');
const rerollBody = panel.slice(rerollStart, rerollEnd);
assert.ok(!rerollBody.includes('setMaster(null)'), 'Reroll must not delete an accepted MASTER.');
assert.ok(!rerollBody.includes('setSquare(null)'), 'Reroll must not delete the existing 1:1.');
assert.ok(!rerollBody.includes('setVertical(null)'), 'Reroll must not delete the existing 9:16.');

for (const forbidden of ['fetch(', 'uploadTrackAsset', 'replaceTrackAsset', 'saveTrackMetadata', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build 49 concept exploration must remain browser-local/non-canonical: ${forbidden}`);
}

console.log('Build 49 MASTER concept reroll guard passed: from-scratch creative reset, multiple directions, persisted index and non-destructive accepted visuals.');
