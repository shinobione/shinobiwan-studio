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
assert.ok(applySection.includes('applyAdminAlbumMigration'), 'Inherited E3 contract must retain the existing migration call.');
assert.ok(applySection.includes('expectedStateToken:candidate.stateToken'), 'Inherited E3 contract must retain the exact state-token guard.');
assert.ok(applySection.includes('globalThis.confirm'), 'Inherited E3 contract must retain explicit browser confirmation.');
assert.ok(!service.includes("const MIGRATION_INTENT = 'album-migration-apply-v2'"), 'Inherited E3 contract must not change the backend migration intent.');
assert.ok(!panel.toLowerCase().includes('migrate all'), 'Inherited E3 contract must not introduce batch migration.');

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:12|13|14|15)\./.test(releaseVersion) && /^phase-ux-(?:c2-5-e|c3)-/.test(codename);
const phase7Line = /^0\.(?:16|17)\./.test(releaseVersion) && codename.startsWith('phase7-');
const studioFocusLine = /^0\.17\./.test(releaseVersion) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || phase7Line || studioFocusLine, 'C2.5-E3 ancestry must remain on the validated PHASE UX line or explicitly authorized Phase 7 / Studio Focus successor.');
assert.ok(releaseBuild >= 37, 'C2.5-E3 ancestry must remain at Build 37 or later.');
assert.equal(pkg.version, releaseVersion);
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-e3-diagnostics.mjs'));

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves C2.5-E migration writes and persistent failure diagnostics through Studio Focus.`);
