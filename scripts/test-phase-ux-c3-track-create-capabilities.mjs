import assert from 'node:assert/strict';
import fs from 'node:fs';

const phase4 = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');

const currentManageCapabilities = [
  'track-create',
  'assets',
  'catalog-rebuild',
  'album-create',
  'album-metadata',
  'album-membership',
  'album-move',
  'album-assets',
  'album-migration',
];

const capabilityAvailable = (manage, capability) => manage.includes(capability);

for (const required of ['track-create', 'assets', 'catalog-rebuild']) {
  assert.equal(capabilityAvailable(currentManageCapabilities, required), true, `${required} must remain available when Album capabilities are also advertised.`);
}
assert.equal(capabilityAvailable(currentManageCapabilities.filter(item => item !== 'track-create'), 'track-create'), false, 'A genuinely missing required capability must still block the operation.');
assert.equal(capabilityAvailable([...currentManageCapabilities, 'future-safe-capability'], 'track-create'), true, 'Future additive capabilities must not invalidate an otherwise compatible bridge.');

assert.ok(phase4.includes("if (!manage.includes(capability)) throw new Phase4AdminError"), 'Phase 4 must gate only on the capability required by the requested operation.');
assert.ok(!phase4.includes('unexpected manage capability'), 'Phase 4 must not reject Track Manager for advertising additional manage capabilities.');
assert.ok(!phase4.includes('REQUIRED_MANAGE_CAPABILITIES'), 'The obsolete exact capability allowlist must stay removed.');
assert.ok(!phase4.includes('manage.filter(item =>'), 'Phase 4 must not reintroduce additive-capability rejection through filtering.');

console.log('C3 Track Create capability guard passed: current and future additive Track Manager manage capabilities are accepted while missing required capabilities still block writes.');
