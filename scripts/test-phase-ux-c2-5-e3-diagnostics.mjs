import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const panel = read('src/components/AlbumMigrationPanel.tsx');
const service = read('src/services/album-migration-api.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  'details?: string;',
  'function failureMessage',
  'Details: ${details}',
  'payload.rollback || null',
]) assert.ok(service.includes(required), `C2.5-E3 service diagnostics missing ${required}`);

for (const required of [
  'preserveError = false',
  'if (!preserveError) setError(null)',
  'load({ preserveError: true })',
  'Migration diagnostic',
  'Do not retry until the diagnostic is reviewed.',
  'rollback ${JSON.stringify(reason.rollback)}',
  'HTTP ${reason.status}',
]) assert.ok(panel.includes(required), `C2.5-E3 panel diagnostics missing ${required}`);

const applySection = panel.slice(panel.indexOf('async function apply(candidate'), panel.indexOf('return <section'));
assert.ok(applySection.includes('applyAdminAlbumMigration'), 'Build 37 must retain the existing migration call.');
assert.ok(applySection.includes('expectedStateToken:candidate.stateToken'), 'Build 37 must retain the exact state-token guard.');
assert.ok(applySection.includes('globalThis.confirm'), 'Build 37 must retain explicit browser confirmation.');
assert.ok(!service.includes("const MIGRATION_INTENT = 'album-migration-apply-v2'"), 'Build 37 must not change the backend migration intent.');
assert.ok(!panel.toLowerCase().includes('migrate all'), 'Build 37 must not introduce batch migration.');

assert.ok(release.includes("version: '0.12.2'"));
assert.ok(release.includes('build: 37'));
assert.ok(release.includes("codename: 'phase-ux-c2-5-e3-migration-diagnostics'"));
assert.equal(pkg.version, '0.12.2');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-e3-diagnostics.mjs'));

console.log('Studio v0.12.2 Build 37 preserves C2.5-E writes while making failed migration diagnostics persistent and actionable.');
