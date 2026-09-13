import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const panel = read('src/components/TrackToMarketPanel.tsx');
const service = read('src/services/music-pack.ts');
const css = read('src/release-campaign.css');
const schema = JSON.parse(read('src/schemas/SHINOBIWAN-track-pack.schema.v1.json'));

assert.equal(pkg.version, '0.19.34', 'Build112 must publish Studio v0.19.34.');
assert.match(release, /version:\s*'0\.19\.34'/);
assert.match(release, /build:\s*112/);
assert.match(release, /phase:\s*10/);
assert.match(release, /studio-focus-build112-music-pack-import/);
assert.match(release, /build111AncestryMarker/);
assert.match(pkg.scripts['check:build112'], /test-build112-music-pack-import\.mjs/);
assert.match(pkg.scripts.build, /check:build111 && npm run check:build112 && npm run check:focus/);
assert.equal(pkg.dependencies?.ajv, '8.17.1');
assert.equal(pkg.dependencies?.['ajv-formats'], '3.0.1');

const fixture = {
  schemaVersion: '1.0', artist: 'SHINOBIWAN', pack: { status: 'draft', revision: 1 },
  track: { title: 'Shoulder Check', slug: 'shoulder-check', version: '', status: '', positioning: '', genre: [], mood: [], bpm: null, key: '', explicit: null },
  soundcloud: { title: '', description: '', tags: [], highlight: { start: '', end: '', durationSeconds: null } },
  social: { shortCaption: '', longCaption: '', hashtags: [] },
  visuals: {
    master16x9: { prompt: 'MASTER' }, square1x1: { prompt: 'SQUARE' }, vertical9x16: { prompt: 'VERTICAL' },
    canvas: { durationSeconds: 8, prompt: 'CANVAS', loopRequirement: 'same visual state at beginning and end' },
  },
  release: { hook: '', oneLiner: '', recommendedExcerpt: { start: '', end: '', durationSeconds: null, reason: '' }, notes: [] },
  source: { generatedBy: 'ChatGPT MUSIC project', packType: 'PACK COMPLET', generatedAt: '2026-09-13T17:41:27.291342Z' },
};
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
assert.equal(validate(fixture), true, `MUSIC Pack V1 fixture must validate: ${ajv.errorsText(validate.errors)}`);
assert.equal(validate({ ...fixture, schemaVersion: '2.0' }), false, 'Unknown schema versions must fail V1 validation.');
assert.equal(validate({ ...fixture, source: { ...fixture.source, generatedAt: 'not-a-date' } }), false, 'generatedAt must be a real JSON Schema date-time.');
assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(schema.properties.schemaVersion.const, '1.0');
assert.equal(schema.properties.artist.const, 'SHINOBIWAN');
assert.equal(schema.properties.source.properties.generatedAt.format, 'date-time');
assert.equal(schema.properties.visuals.properties.canvas.properties.durationSeconds.maximum, 8);

for (const required of [
  "import Ajv2020, { type ErrorObject } from 'ajv/dist/2020'",
  "import addFormats from 'ajv-formats'",
  "schemaVersion: '1.0'",
  "const STORAGE_PREFIX = 'shinobiwan-studio:music-pack:v1:'",
  "message: 'Unsupported MUSIC Pack schema version.'",
  'compareMusicPackIdentity',
  "field: 'slug'",
  'pack.track.slug.trim() !== selectedTrack.id.trim()',
  'window.localStorage.setItem',
  'window.localStorage.getItem',
  'window.localStorage.removeItem',
  "canonicalWrites: false",
  "mismatchPolicy: 'explicit-confirmation-before-attach'",
  "regenerationPolicy: 'never-regenerate-imported-pack-content'",
]) assert.ok(service.includes(required), `Build112 MUSIC Pack service missing ${required}.`);

for (const forbidden of ['fetch(', 'getAdmin', 'saveAdmin', 'uploadAdmin', 'deleteAdmin', 'studioConfig', 'trackManagerUrl', 'r2']) {
  assert.ok(!service.includes(forbidden), `Build112 MUSIC Pack service must remain browser-local/non-canonical: ${forbidden}`);
}

for (const required of [
  'MUSIC PACK',
  'Import PACK COMPLET JSON',
  'Import MUSIC Pack JSON',
  'TRACK MISMATCH',
  'Nothing has been attached yet',
  'Attach pack to this Track anyway',
  'Remove local pack',
  'PACK COMPLET · copy-ready release info',
  'The prompts below come directly from the imported MUSIC Pack. Studio does not regenerate or rewrite them.',
  'importedPack?.visuals.master16x9.prompt ?? masterPrompt',
  "importedPack?.visuals.square1x1.prompt ?? squarePrompt",
  "importedPack?.visuals.vertical9x16.prompt ?? verticalPrompt",
  'importedPack?.visuals.canvas.prompt ?? generatedMotionPrompt',
  'readOnly={Boolean(importedPack)}',
]) assert.ok(panel.includes(required), `Build112 UI missing ${required}.`);

for (const forbidden of ['saveAdmin', 'uploadAdmin', 'deleteAdmin', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build112 import UI must not reach canonical writes: ${forbidden}`);
}

for (const required of ['.rc-music-pack-import', '.rc-pack-mismatch', '.rc-music-pack-details', '.rc-pack-detail-grid', '.rc-import-btn']) {
  assert.ok(css.includes(required), `Build112 MUSIC Pack UI styling missing ${required}.`);
}
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'Build112 must keep reduced-motion support.');

console.log('Build112 MUSIC Pack import PASS: Draft 2020-12 schema validation, exact Track identity warning, explicit mismatch attach, browser-local per-Track persistence, copy-ready PACK COMPLET data, imported Flow prompts, zero canonical writes.');
