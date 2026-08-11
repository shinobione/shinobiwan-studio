import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const panel = read('src/components/AlbumMigrationPanel.tsx');
const service = read('src/services/album-migration-api.ts');
const main = read('src/main.tsx');
const release = read('src/release.ts');
const css = read('src/c2-5-e2-review.css');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  'Download dry-run JSON',
  'Copy review summary',
  'State fingerprint',
  'JSON.stringify(plan, null, 2)',
  'URL.createObjectURL',
  'navigator.clipboard.writeText',
  'contains state tokens and private catalog metadata',
  'READY TO REVIEW',
  'BLOCKED',
  'ALREADY CANONICAL',
]) assert.ok(panel.includes(required), `C2.5-E2 review pack missing ${required}`);

const summarySection = panel.slice(panel.indexOf('function reviewSummary'), panel.indexOf('function downloadDryRun'));
assert.ok(summarySection.includes('candidate.proposedTrackIds'), 'Review summary must preserve the proposed artistic order.');
assert.ok(summarySection.includes('candidate.blockers'), 'Review summary must preserve blocker codes.');
assert.ok(summarySection.includes('candidate.warnings'), 'Review summary must preserve warning codes.');
assert.ok(!summarySection.includes('candidate.stateToken'), 'Copyable review summary must not expose migration state tokens.');

assert.ok(panel.includes('shortStateToken(candidate.stateToken)'), 'Candidate cards must expose only a shortened state fingerprint.');
assert.ok(!panel.toLowerCase().includes('migrate all'), 'E2 must not introduce any batch migration action.');
assert.ok(service.includes("const MIGRATION_INTENT = 'album-migration-apply-v1'"), 'E2 must preserve the same guarded Track Manager write intent.');
assert.ok(service.includes('expectedStateToken'), 'E2 must preserve backend stale-state enforcement.');
assert.ok(main.includes("import './c2-5-e2-review.css';"), 'E2 review styles must be loaded after the E1 cockpit styles.');
assert.ok(css.includes('.album-migration-review') && css.includes('@media(max-width:560px)'), 'E2 review pack must retain desktop and mobile-responsive styling.');

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(releaseVersion, /^0\.(?:12|13|14)\./, 'C2.5-E2 ancestry must remain on a validated/successor PHASE UX C2.5/C3 Studio release line until deliberately superseded.');
assert.ok(releaseBuild >= 36, 'C2.5-E2 review-pack ancestry must remain at Build 36 or later.');
assert.match(release, /codename:\s*'phase-ux-(?:c2-5-e|c3)-/, 'Current release must remain explicitly inside validated PHASE UX C2.5-E/C3 while E2 is inherited.');
assert.equal(pkg.version, releaseVersion);
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-e2-review-pack.mjs'));

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves the C2.5-E2 read-only migration review/export pack while C3 advances separately.`);