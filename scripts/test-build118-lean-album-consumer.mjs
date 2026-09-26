import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsx from 'react/jsx-runtime';

// Synthetic fixtures only. Execute the real clients with a closed, queued transport:
// any extra request, public fallback or write retry fails immediately.
const read = file => fs.readFileSync(file, 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
let requests = [], replies = [], timers = [], abortNext = false;
const config = { studioConfig: { trackManagerUrl: 'https://private.invalid', catalogApi: 'https://public.invalid' } };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
function reset(...steps) { requests = []; replies = steps; timers = []; }
function drained() { assert.equal(replies.length, 0, 'All expected requests must execute.'); }
const globals = {
  Error, TypeError, DOMException, AbortController,
  setTimeout: (callback, ms) => { timers.push(ms); if (abortNext) { abortNext = false; queueMicrotask(callback); } return timers.length; },
  clearTimeout: () => {},
  fetch: async (url, options = {}) => {
    requests.push({ url, options });
    assert.ok(replies.length, `Unexpected request: ${url}`);
    return replies.shift()(url, options);
  },
};
function load(file, imports, extra = {}) {
  const exports = {};
  const code = ts.transpileModule(read(file), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, ...globals, ...extra, require: name => {
    assert.ok(name in imports, `Unexpected import ${name} in ${file}`);
    return imports[name];
  } }, { filename: file });
  return exports;
}
const admin = load('src/services/admin-api.ts', { './config': config });
const album = load('src/services/album-admin-api.ts', { './config': config, './admin-api': admin });
const migration = load('src/services/album-migration-api.ts', { './config': config, './admin-api': admin, './album-admin-api': album });
const artwork = load('src/services/public-albums-api.ts', { './config': config, './album-admin-api': album });
const deletion = load('src/services/album-delete-admin-api.ts', { './config': config, './admin-api': admin, './album-admin-api': album });
const workflow = load('src/phase7-workflow.ts', {});
const content = load('src/content-health.ts', { './phase7-workflow': workflow });
const health = load('src/album-health.ts', { './phase7-workflow': workflow, './content-health': content });

const first = {
  schemaVersion: 1, id: 'z-synthetic', title: 'Synthetic Z', type: 'ep', status: 'draft',
  year: null, releaseDate: null, description: 'Synthetic description', heading: 'Synthetic heading',
  trackIds: ['track-z', 'track-a'], accent: '#123456', accent2: '#654321',
  assets: { cover: 'cover.jpg', thumbnail: null }, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z',
  creationOperationId: '11111111-1111-4111-8111-111111111111',
  assetState: { cover: { present: true, path: 'cover.jpg', size: 123, contentType: 'image/jpeg', etag: 'synthetic-etag' }, thumbnail: { present: false } },
};
const second = { ...first, id: 'a-synthetic', title: 'Synthetic A', status: 'published', year: 2026, trackIds: ['track-b'] };
const lean = { ok: true, albums: [first, second], totals: { total: 2, published: 1, draft: 1, archived: 0, trackRefs: 3 } };
const collectionUrl = 'https://private.invalid/api/studio/albums?view=canonical';
function privateGet(url, options, expected = collectionUrl) {
  assert.equal(url, expected);
  assert.equal(options.method || 'GET', 'GET');
  assert.equal(options.credentials, 'include');
  assert.equal(options.mode, 'cors');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.headers.Accept, 'application/json');
}
const collection = (payload = lean) => (url, options) => { privateGet(url, options); return json(payload); };
reset(collection());
const payload = await album.getAdminAlbums();
assert.deepEqual(plain(payload), lean, 'Ordering, metadata, private evidence, asset state and totals must survive without migration.');
assert.equal('migration' in payload, false);
assert.deepEqual(timers, [7000]);
drained();

const dryRun = {
  schemaVersion: 1, migrationId: 'synthetic-migration', sourceRef: 'synthetic-source', mode: 'dry-run',
  generatedAt: '2026-01-03T00:00:00Z', writesPerformed: false,
  albums: [{ id: first.id, stateToken: 'synthetic-current-state', canonicalUpdatedAt: first.updatedAt, proposedTrackIds: [...first.trackIds], blockers: [], warnings: [] }],
  singles: { id: 'singles', tracks: [], candidateCount: 0, migrateAsCanonicalAlbum: false },
};
reset((url, options) => { privateGet(url, options, 'https://private.invalid/api/studio/albums'); return json({ ...lean, migration: dryRun }); });
assert.deepEqual(plain(await migration.getAdminAlbumMigrationDryRun()), dryRun, 'Use genuine migration evidence and state tokens unchanged.');
drained();
reset(() => json(lean));
await assert.rejects(migration.getAdminAlbumMigrationDryRun(), error => error instanceof album.AlbumAdminError && error.code === 'ALBUM_MIGRATION_INVALID_DRY_RUN');
drained();

// Classification, timeout and the two-attempt ceiling apply to the new URL.
const transport = () => { throw new TypeError('synthetic interruption'); };
const timeout = (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('synthetic timeout', 'AbortError')), { once: true }));
for (const [failure, kind, status, attempts] of [
  [transport, 'transport', null, 2],
  [() => json({}, 401), 'access-or-cors', 401, 1],
  [() => json({}, 403), 'access-or-cors', 403, 1],
  [() => json({}, 404), 'http', 404, 1],
  [() => new Response('<html>Access</html>', { headers: { 'Content-Type': 'text/html' } }), 'access-or-cors', 200, 1],
  [() => new Response('{', { headers: { 'Content-Type': 'application/json' } }), 'invalid-response', 200, 1],
  [() => json({ ok: false, albums: [] }), 'invalid-response', null, 1],
  [() => json({ ok: true, albums: {} }), 'invalid-response', null, 1],
]) {
  reset(...Array(attempts).fill(failure));
  await assert.rejects(album.getAdminAlbums(), error => error instanceof admin.AdminReadError && error.kind === kind && error.status === status && (attempts === 1 || /one bounded transient retry/.test(error.message)));
  assert.equal(requests.length, attempts);
  requests.forEach(({ url, options }) => privateGet(url, options));
  drained();
}
for (const status of [408, 425, 429, 500, 502, 503, 504]) {
  reset(() => json({}, status), collection());
  assert.deepEqual(plain(await album.getAdminAlbums()), lean);
  assert.equal(requests.length, 2);
  drained();
  reset(() => json({}, status), () => json({}, status));
  await assert.rejects(album.getAdminAlbums(), error => error.kind === 'http' && error.status === status);
  assert.equal(requests.length, 2);
  drained();
}
reset(timeout, collection()); abortNext = true;
assert.deepEqual(plain(await album.getAdminAlbums()), lean);
assert.deepEqual(timers, [7000, 7000]);
drained();
reset(timeout, () => { throw new DOMException('synthetic timeout', 'AbortError'); }); abortNext = true;
await assert.rejects(album.getAdminAlbums(), error => error.kind === 'timeout');
assert.equal(requests.length, 2);
drained();

reset(collection(), () => json({ ok: true, albumAuthority: 'canonical-r2', albums: [{ id: first.id, cover: 'https://public.invalid/wrong.jpg' }] }));
const visuals = await artwork.getPublicAlbumVisuals();
assert.equal(visuals.get(first.id).cover, `https://private.invalid/api/studio/albums/${first.id}/media/cover`);
drained();
reset(transport, transport);
await assert.rejects(artwork.getPublicAlbumVisuals(), error => error.kind === 'transport');
assert.equal(requests.length, 2, 'Private failure must surface before public artwork discovery.');
requests.forEach(({ url, options }) => privateGet(url, options));
drained();

// Public/empty Track data cannot prove private completeness, even with canonical Albums.
const publicTrack = { id: 'track-z', readSource: 'public', title: 'Synthetic track', type: 'song', status: 'draft', album: { id: first.id, title: first.title }, assets: {}, audioIntelligence: {}, publishing: {}, quality: { errors: [] } };
for (const tracks of [[], [publicTrack], [publicTrack, { ...publicTrack, id: 'track-a', readSource: 'private' }]]) {
  const result = health.buildCatalogAlbumHealth(payload.albums, tracks);
  assert.equal(result.totalAlbums, 2);
  assert.equal(result.crossModelVerified, false);
  assert.equal(result.unverifiedAlbums, 2);
  assert.deepEqual(plain(result.albums.map(item => item.albumId)), [first.id, second.id]);
  for (const item of result.albums) {
    assert.equal(item.state, 'unverified');
    assert.deepEqual(plain(item.missingTrackIds), []);
    assert.deepEqual(plain(item.cacheDriftTrackIds), []);
  }
}
const privateHealth = health.buildCatalogAlbumHealth(payload.albums, [{ ...publicTrack, readSource: 'private' }]);
assert.equal(privateHealth.crossModelVerified, true);
assert.deepEqual(plain(privateHealth.albums[0].missingTrackIds), ['track-a']);

// Render the actual management list after its mount effect settles.
let slots = [], cursor = 0, effects = [];
const hooks = {
  useState: initial => { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = value; }]; },
  useMemo: calculate => calculate(), useEffect: callback => effects.push(callback),
};
const ui = load('src/components/AlbumsWorkspace.tsx', {
  react: hooks, 'react/jsx-runtime': jsx,
  '../cover-palette': {}, '../services/catalog-api': { getCatalogTracks: async () => [] },
  '../services/album-admin-api': album, '../services/album-delete-admin-api': deletion,
  '../services/album-membership-admin-api': {}, '../services/album-metadata-admin-api': {}, '../services/album-move-admin-api': {},
  '../services/public-albums-api': artwork, './CoverImagePreview': {}, './CoverPalettePreview': {},
});
const render = () => { cursor = 0; return renderToStaticMarkup(React.createElement(ui.AlbumsWorkspace)); };
reset(collection(), collection(), () => json({ ok: true, albumAuthority: 'canonical-r2', albums: [] }));
render(); effects.shift()();
await new Promise(resolve => setImmediate(resolve));
const markup = render();
assert.ok(markup.indexOf('Synthetic Z') < markup.indexOf('Synthetic A'), 'Management list retains canonical order.');
assert.match(markup, /2 tracks/); assert.match(markup, /Date TBD/); assert.match(markup, /2026/);
assert.doesNotMatch(markup, /Album Management unavailable/);
drained();
slots = []; effects = [];
reset(transport, transport);
render(); effects.shift()();
await new Promise(resolve => setImmediate(resolve));
assert.match(render(), /Album Management unavailable.*one bounded transient retry/);
drained();

const healthUi = load('src/components/AlbumHealthWorkspace.tsx', {
  react: hooks, 'react/jsx-runtime': jsx, '../album-health': health,
  '../router': { trackHref: id => `#/catalog/${id}` },
  '../services/album-admin-api': album, '../services/catalog-api': { getCatalogTracks: async () => [] },
  '../services/public-albums-api': artwork, '../phase8-album-health.css': {},
  './AlbumsWorkspace': { AlbumsWorkspace: () => null },
});
const renderHealth = () => { cursor = 0; return renderToStaticMarkup(React.createElement(healthUi.AlbumHealthWorkspace)); };
slots = []; effects = [];
reset(collection(), collection(), () => json({ ok: true, albumAuthority: 'canonical-r2', albums: [] }));
renderHealth(); effects.shift()();
await new Promise(resolve => setImmediate(resolve));
const healthMarkup = renderHealth();
assert.match(healthMarkup, /Synthetic Z/); assert.match(healthMarkup, /Synthetic A/);
assert.match(healthMarkup, /Private Track truth unavailable/);
assert.doesNotMatch(healthMarkup, /Album Health unavailable/);
drained();
slots = []; effects = [];
reset(transport, transport, transport, transport);
renderHealth(); effects.shift()();
await new Promise(resolve => setImmediate(resolve));
assert.match(renderHealth(), /Album Health unavailable.*one bounded transient retry/);
drained();

// Real collection client + real delete client: preserve revision checks, one POST,
// canonical absence proof, and unverified/ambiguous outcomes on unreadable/present state.
const capability = (url, options) => { privateGet(url, options, 'https://private.invalid/api/studio/health'); return json({ ok: true, capabilities: { manage: ['album-delete', 'album-metadata'] } }); };
const deletePost = (url, options) => {
  assert.equal(url, `https://private.invalid/api/studio/albums/${first.id}/delete`);
  assert.equal(options.method, 'POST');
  assert.deepEqual(JSON.parse(options.body), { intent: 'album-delete-v1', expectedUpdatedAt: first.updatedAt, confirmAlbumId: first.id });
};
for (const lost of [false, true]) {
  reset(capability, collection(), (url, options) => { deletePost(url, options); if (lost) throw new TypeError('synthetic lost response'); return json({ ok: true, deleted: true, albumId: first.id }); }, collection({ ok: true, albums: [second], totals: { total: 1 } }));
  const result = await deletion.deleteAdminAlbumResilient(first.id, first.updatedAt);
  assert.equal(result.clientVerified, true); assert.equal(result.retrySafe, false);
  assert.equal(result.recoveredAfterTransportFailure, lost);
  assert.equal(requests.filter(item => item.options.method === 'POST').length, 1);
  drained();
}
for (const [rereads, code] of [
  [[collection()], 'ALBUM_DELETE_NOT_COMMITTED'],
  [[collection({ ...lean, albums: [{ ...first, updatedAt: 'changed-revision' }] })], 'ALBUM_DELETE_AMBIGUOUS'],
  [[transport, transport], 'ALBUM_DELETE_UNVERIFIED'],
]) {
  reset(capability, collection(), (url, options) => { deletePost(url, options); throw new TypeError('synthetic lost response'); }, ...rereads);
  await assert.rejects(deletion.deleteAdminAlbumResilient(first.id, first.updatedAt), error => error.code === code && error.retrySafe === (code === 'ALBUM_DELETE_NOT_COMMITTED'));
  assert.equal(requests.filter(item => item.options.method === 'POST').length, 1);
  drained();
}
reset(capability, collection());
await assert.rejects(deletion.deleteAdminAlbumResilient(first.id, 'stale-revision'), error => error.code === 'ALBUM_DELETE_STALE');
assert.equal(requests.filter(item => item.options.method === 'POST').length, 0);
drained();

// Metadata post-write verification must still use detail, never collection/public proof.
for (const matches of [true, false]) {
  reset(capability, (url, options) => {
    assert.equal(url, `https://private.invalid/api/studio/albums/${first.id}/metadata/save`);
    assert.equal(options.method, 'POST');
    return json({ ok: true, saved: true, album: { ...first, title: 'Edited' }, updatedAt: 'new-revision' });
  }, (url, options) => {
    privateGet(url, options, `https://private.invalid/api/studio/albums/${first.id}`);
    return json({ ok: true, album: { manifest: { ...first, title: matches ? 'Edited' : 'Wrong title', updatedAt: 'new-revision' } } });
  });
  const result = await album.saveAdminAlbumMetadata(first.id, first.updatedAt, { title: 'Edited' });
  assert.equal(result.clientVerified, matches);
  drained();
}

console.log('Build118 lean Albums PASS: canonical transport/payload, full migration evidence, bounded failures/retries, management rendering, health provenance, artwork, private delete and detail-write verification.');
