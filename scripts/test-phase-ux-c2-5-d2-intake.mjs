import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const resolverSource = fs.readFileSync('src/album-intake.ts', 'utf8');
const intakeUi = fs.readFileSync('src/components/TrackCreatePanel.tsx', 'utf8');
const albumApi = fs.readFileSync('src/services/album-admin-api.ts', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const compiled = ts.transpileModule(resolverSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const resolver = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const albums = [
  { id: 'ghost-signal', title: 'Ghost Signal', type: 'album', status: 'draft', trackIds: ['intro'] },
  { id: 'released-album', title: 'Released Album', type: 'album', status: 'published', trackIds: ['live-track'] },
  { id: 'old-project', title: 'Old Project', type: 'ep', status: 'archived', trackIds: [] },
];

const singles = resolver.resolveIntakeAlbum('singles', 'Singles', albums);
assert.equal(singles.kind, 'singles');
assert.equal(singles.ready, true);
assert.deepEqual(resolver.safeInitialTrackAlbum(), { id: 'singles', title: 'Singles' });

const existing = resolver.resolveIntakeAlbum('ghost-signal', 'Ghost Signal', albums);
assert.equal(existing.kind, 'existing');
assert.equal(existing.ready, true);
assert.equal(existing.album.id, 'ghost-signal');

const byTitle = resolver.resolveIntakeAlbum('', 'Ghost Signal', albums);
assert.equal(byTitle.kind, 'existing');
assert.equal(byTitle.album.id, 'ghost-signal');

const existingOverStaleSingles = resolver.resolveIntakeAlbum('singles', 'Ghost Signal', albums);
assert.equal(existingOverStaleSingles.kind, 'existing');
assert.equal(existingOverStaleSingles.album.id, 'ghost-signal');

const missing = resolver.resolveIntakeAlbum('', 'Never Existing Project', albums);
assert.equal(missing.kind, 'missing');
assert.equal(missing.ready, false);
assert.equal(missing.requestedId, 'never-existing-project');

const missingOverStaleSingles = resolver.resolveIntakeAlbum('singles', 'ALBUM TEST QUI N\'EXISTE PAS', albums);
assert.equal(missingOverStaleSingles.kind, 'missing');
assert.equal(missingOverStaleSingles.ready, false);
assert.equal(missingOverStaleSingles.requestedId, 'album-test-qui-n-existe-pas');

for (const id of ['released-album', 'old-project']) {
  const blocked = resolver.resolveIntakeAlbum(id, '', albums);
  assert.equal(blocked.kind, 'blocked');
  assert.equal(blocked.ready, false);
}

for (const required of [
  'getAdminAlbums',
  'resolveIntakeAlbum(values.albumId, values.albumTitle, albums)',
  'Create canonical ${newAlbumType} draft',
  'createRequestedAlbumDraft()',
  "sourceAlbumId: null",
  'expectedTargetUpdatedAt: target.updatedAt',
  'targetIndex: target.trackIds.length',
  'Draft created in recoverable Singles state',
  'Canonical Album membership + track cache verified',
  'ALBUM_BIND_AMBIGUOUS',
  'Do not retry blindly',
  'never creates a phantom albumId',
  "albumResolution.kind === 'existing' ? 'album-track'",
  'Create & Publish',
  'validateAdminTrackMetadata',
  'saveAdminTrackMetadata',
]) assert.ok(intakeUi.includes(required), `C2.5-D2 intake missing: ${required}`);

assert.ok(!intakeUi.includes('safeInitialTrackAlbum'), 'New Track must not send the Album compatibility cache through generic metadata under TM v5.21.');
const metadataPatchFunction = intakeUi.slice(intakeUi.indexOf('function metadataPatch('), intakeUi.indexOf('async function bindNewTrackToCanonicalAlbum'));
assert.ok(!metadataPatchFunction.includes('album:'), 'New Track metadataPatch must omit Album cache; Album binding owns it.');
assert.ok(metadataPatchFunction.includes("type: targetsCanonicalAlbum ? 'album-track'"), 'Canonical Album target must derive album-track type.');

const createFunction = intakeUi.slice(intakeUi.indexOf('async function create(mode: CreateMode)'), intakeUi.indexOf('const provenanceEntries'));
assert.ok(createFunction.includes("createAdminTrack(effectiveSlug, metadataPatch(resolution, 'draft'))"));
assert.ok(createFunction.indexOf('uploadAdminTrackAsset') < createFunction.indexOf('bindNewTrackToCanonicalAlbum'), 'Album binding must happen after verified asset writes.');
assert.ok(createFunction.indexOf('bindNewTrackToCanonicalAlbum') < createFunction.indexOf('publishCreatedTrack'), 'Optional publication must happen only after Album binding.');
assert.ok(!createFunction.includes('createAdminAlbum('), 'Final track creation must never silently create an Album.');
assert.ok(!createFunction.includes('saveTrack('), 'D2 intake must never introduce a generic saveTrack surface.');
assert.ok(intakeUi.includes("disabled={busy || albumCreating || (step === 1 && Boolean(problems.length)) || (step === 2 && (!basicsValid || !albumReady))}"), 'Unknown/blocked Album references must prevent Review.');
assert.ok(albumApi.includes("'ALBUM_WRITE_TRANSPORT'"), 'Ambiguous Album transport must be distinguishable for canonical reread recovery.');
assert.ok(main.includes("import './c2-5-d2-intake.css';"), 'D2 intake styles must load after D1 styles.');

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(releaseVersion) && /^phase-ux-(?:c2-5|c3)-/.test(codename);
const phase7Line = /^0\.(?:16|17)\./.test(releaseVersion) && codename.startsWith('phase7-');
const studioFocusLine = /^0\.(?:17|18|19)\./.test(releaseVersion) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || phase7Line || studioFocusLine, 'D2 ancestry must remain on the validated PHASE UX C2.5/C3 line or its explicitly authorized Phase 7 / Studio Focus successor.');
assert.ok(releaseBuild >= 33, 'C2.5-D2 ancestry must remain at Build 33 or later.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the active Studio release.');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-d2-intake.mjs'));

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves D2 canonical Album binding through Studio Focus: generic Track metadata never owns Album cache, explicit non-Singles requests bind through Album authority, missing Albums block Review and final creation never invents a phantom Album.`);
