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

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(releaseVersion, /^0\.(?:11|12|13|14|15)\./, 'D2 ancestry must remain on a validated/successor PHASE UX C2.5/C3 Studio release line until deliberately superseded.');
assert.ok(releaseBuild >= 33, 'C2.5-D2 ancestry must remain at Build 33 or later.');
assert.match(release, /codename:\s*'phase-ux-(?:c2-5|c3)-/, 'Current release must remain explicitly inside validated PHASE UX C2.5/C3 while the D2 contract is inherited.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the active Studio release.');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-d2-intake.mjs'));

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves D2 canonical Album binding: explicit non-Singles requests override the safe Singles default, missing Albums block Review and final creation never invents a phantom Album.`);
