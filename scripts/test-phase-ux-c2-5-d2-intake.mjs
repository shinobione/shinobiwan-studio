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

const missing = resolver.resolveIntakeAlbum('', 'Never Existing Project', albums);
assert.equal(missing.kind, 'missing');
assert.equal(missing.ready, false);
assert.equal(missing.requestedId, 'never-existing-project');

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
  'safeInitialTrackAlbum()',
  "sourceAlbumId: null",
  'expectedTargetUpdatedAt: target.updatedAt',
  'targetIndex: target.trackIds.length',
  'Draft created in recoverable Singles state',
  'Canonical Album membership + track cache verified',
  'ALBUM_BIND_AMBIGUOUS',
  'Do not retry blindly',
  'never creates a phantom albumId',
  "albumResolution.kind === 'existing' ? 'album-track'",
]) assert.ok(intakeUi.includes(required), `C2.5-D2 intake missing: ${required}`);

const createFunction = intakeUi.slice(intakeUi.indexOf('async function create()'), intakeUi.indexOf('const provenanceEntries'));
assert.ok(createFunction.includes('createAdminTrack(effectiveSlug, metadataPatch(resolution))'));
assert.ok(createFunction.indexOf('uploadAdminTrackAsset') < createFunction.indexOf('bindNewTrackToCanonicalAlbum'), 'Album binding must happen after verified track asset writes.');
assert.ok(!createFunction.includes('createAdminAlbum('), 'Final track creation must never silently create an Album.');
assert.ok(intakeUi.includes("disabled={busy || albumCreating || (step === 1 && Boolean(problems.length)) || (step === 2 && (!basicsValid || !albumReady))}"), 'Unknown/blocked Album references must prevent Review.');
assert.ok(albumApi.includes("'ALBUM_WRITE_TRANSPORT'"), 'Ambiguous Album transport must be distinguishable for canonical reread recovery.');
assert.ok(main.includes("import './c2-5-d2-intake.css';"), 'D2 intake styles must load after D1 styles.');
assert.ok(release.includes("version: '0.11.1'") && release.includes('build: 33'), 'C2.5-D2 release must be v0.11.1 Build 33.');
assert.ok(release.includes("codename: 'phase-ux-c2-5-d2-new-track-album-binding'"));
assert.equal(pkg.version, '0.11.1');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-d2-intake.mjs'));

console.log('Studio 0.11.1 Build 33 resolves New Track Album references canonically, blocks phantom IDs, stages recoverably in Singles and binds only newly-created tracks through guarded Track Manager writes.');
