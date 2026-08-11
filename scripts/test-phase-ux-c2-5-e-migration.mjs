import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const service = read('src/services/album-migration-api.ts');
const panel = read('src/components/AlbumMigrationPanel.tsx');
const app = read('src/App.tsx');
const main = read('src/main.tsx');
const release = read('src/release.ts');
const css = read('src/c2-5-e-migration.css');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "const MIGRATION_INTENT = 'album-migration-apply-v1'",
  "includes('album-migration')",
  "credentials: 'include'",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  "getAdminAlbumMigrationDryRun",
  "applyAdminAlbumMigration",
  "payload.migration.writesPerformed !== false",
  "input.confirm !== `MIGRATE ${input.albumId}`",
  "input.albumId === 'singles'",
  "Track Manager v5.18 / bridge v1.10 only",
]) assert.ok(service.includes(required), `C2.5-E migration client missing ${required}`);

for (const required of [
  'Legacy Albums → canonical R2',
  'Refresh dry-run',
  'MIGRATE ${candidate.id}',
  'I reviewed and confirm this artistic track order.',
  'There is no batch migration',
  'Singles stays transitional in C2.5-E',
  'FUTURE VIRTUAL COLLECTION',
  'globalThis.confirm',
  'expectedStateToken:candidate.stateToken',
  'orderConfirmed:',
]) assert.ok(panel.includes(required), `C2.5-E migration cockpit missing ${required}`);
assert.ok(!panel.toLowerCase().includes('migrate all'), 'C2.5-E Studio must not expose a migrate-all operation.');
assert.ok(app.includes("import { AlbumMigrationPanel } from './components/AlbumMigrationPanel';"), 'Albums route must mount the migration cockpit.');
assert.ok(app.includes("<><AlbumManager /><AlbumMigrationPanel /></>"), 'AlbumManager D1/D2 must remain mounted next to, not replaced by, C2.5-E.');
assert.ok(app.includes('Track Manager v5.18 · bridge v1.10'), 'Studio Build 35 must identify the E1 backend contract.');
assert.ok(main.includes("import './c2-5-e-migration.css';"), 'C2.5-E styles must be loaded after prior Album/D2 styles.');
assert.ok(css.includes('.album-migration-stack') && css.includes('@media(max-width:560px)'), 'Migration cockpit must retain desktop and mobile styling.');
assert.ok(release.includes("version: '0.12.0'"));
assert.ok(release.includes('build: 35'));
assert.ok(release.includes("codename: 'phase-ux-c2-5-e-album-migration-cockpit'"));
assert.equal(pkg.version, '0.12.0');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-e-migration.mjs'));

console.log('Studio v0.12.0 Build 35 exposes a guarded one-Album-at-a-time C2.5-E dry-run/apply cockpit without starting C2.5-F, C3 or Phase 7.');
