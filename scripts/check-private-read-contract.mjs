import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const admin = read('src/services/admin-api.ts');
const catalog = read('src/services/catalog-api.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "credentials: 'include'",
  "mode: 'cors'",
  "cache: 'no-store'",
  "'/api/studio/health'",
  "'/api/studio/tracks'",
  '/api/studio/tracks/${encodeURIComponent(trackId)}',
  'writesEnabled: false',
  "capabilities?.write?.length",
]) {
  assert.ok(admin.includes(required), `Private Track Manager client is missing ${required}.`);
}

assert.ok(!/\bmethod\s*:/.test(admin), 'Phase 4A admin client must not set an HTTP method; fetch therefore remains GET-only.');
assert.ok(!/\b(FormData|request\.json|JSON\.stringify)\b/.test(admin), 'Phase 4A admin client must not contain write-payload plumbing.');

for (const required of [
  'getAdminBridgeHealth()',
  'getAdminTracks()',
  'getAdminTrack(trackId)',
  "readSource: 'private'",
  "readSource: 'public'",
  'if (publicResult.ok) return publicResult.value',
  'Private and public catalog reads failed.',
  'Private and public track reads failed.',
]) {
  assert.ok(catalog.includes(required), `Catalog fallback contract is missing ${required}.`);
}

assert.ok(release.includes("version: '0.4.0'"), 'Studio release version must be 0.4.0.');
assert.ok(release.includes('build: 5'), 'Studio release build must be 5.');
assert.ok(release.includes("codename: 'private-read-bridge'"), 'Studio release codename must be private-read-bridge.');
assert.equal(pkg.version, '0.4.0', 'package.json must match Studio 0.4.0.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'The production build must run the private-read regression guard.');

console.log('Studio 0.4.0 Build 5 private-read contract is GET-only, credentialed, fallback-safe and write-locked.');
