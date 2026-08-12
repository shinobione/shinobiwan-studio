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
  "Track Manager v5.19 / bridge v1.11 only",
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
assert.ok(app.includes("import { AlbumMigrationPanel } from './components/AlbumMigrationPanel';"), 'Completed migration cockpit must remain available for maintenance/audit.');
assert.ok(app.includes("{route === 'albums' && <AlbumsWorkspace />}"), 'Daily Albums route must keep canonical management separate from the completed migration cockpit.');
assert.ok(app.includes('Album migration archive · C2.5 complete'), 'C2.5-E cockpit must live under the collapsed System maintenance archive after migration completion.');
assert.ok(app.includes('className="panel c3-album-maintenance"'), 'Migration archive must be collapsed maintenance UI, not daily Album content.');
assert.ok(app.includes('Track Manager v5.19 · bridge v1.11'), 'Studio must retain the current validated migration/backend diagnostic fallback.');
assert.ok(main.includes("import './c2-5-e-migration.css';"), 'C2.5-E styles must remain loaded for the preserved maintenance cockpit.');
assert.ok(css.includes('.album-migration-stack') && css.includes('@media(max-width:560px)'), 'Migration cockpit must retain desktop and mobile styling when maintenance is opened.');

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:12|13|14|15)\./.test(releaseVersion) && /^phase-ux-(?:c2-5-e|c3)-/.test(codename);
const phase7Line = /^0\.(?:16|17)\./.test(releaseVersion) && codename.startsWith('phase7-');
const studioFocusLine = /^0\.17\./.test(releaseVersion) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || phase7Line || studioFocusLine, 'C2.5-E ancestry must remain on the validated PHASE UX line or explicitly authorized Phase 7 / Studio Focus successor.');
assert.ok(releaseBuild >= 35, 'C2.5-E ancestry must remain at Build 35 or later.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the active Studio release.');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-e-migration.mjs'));

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves the guarded one-Album-at-a-time C2.5-E cockpit as collapsed maintenance while Studio Focus remains presentation-only.`);
