import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

// Execute real services and page effects with synthetic deferred HTTP responses.
// No live data, browser session, production write or additional test dependency.
const modules = new Map();
let requests = [], waiting = [], currentHooks;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const album = { id: 'synthetic-album', title: 'Synthetic album', type: 'ep', status: 'draft', year: null, trackIds: ['synthetic-track'], assets: {}, assetState: {}, updatedAt: 'old-revision' };
const albumBody = { ok: true, albums: [album], totals: { total: 1 } };
const trackBody = { ok: true, tracks: [{ slug: 'synthetic-track', title: 'Synthetic track', status: 'draft', album: { id: album.id, title: album.title }, assets: {} }] };
const endpoints = {
  albums: 'https://private.invalid/api/studio/albums?view=canonical',
  tracks: 'https://private.invalid/api/studio/tracks',
  sonic: 'https://private.invalid/api/studio/analysis/sonictrace',
  publicTracks: 'https://public.invalid/tracks',
  visuals: 'https://public.invalid/albums',
};
const hooks = {
  useState: initial => {
    const state = currentHooks, index = state.cursor++;
    if (!(index in state.slots)) state.slots[index] = typeof initial === 'function' ? initial() : initial;
    return [state.slots[index], value => { state.writes++; state.slots[index] = typeof value === 'function' ? value(state.slots[index]) : value; }];
  },
  useRef: initial => {
    const state = currentHooks, index = state.cursor++;
    if (!(index in state.slots)) state.slots[index] = { current: initial };
    return state.slots[index];
  },
  useEffect: callback => { const state = currentHooks; if (state.mounting) state.effects.push(callback); },
  useMemo: callback => callback(),
};
function load(file) {
  file = path.resolve(file);
  if (modules.has(file)) return modules.get(file);
  const exports = {};
  modules.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, {
    exports, Error, TypeError, DOMException, AbortController, URL, console,
    setTimeout: () => 1, clearTimeout: () => {},
    fetch: (url, options = {}) => {
      requests.push({ url, options });
      return new Promise((resolve, reject) => waiting.push({ url, resolve, reject }));
    },
    require: name => {
      if (name === 'react') return hooks;
      if (name === 'react/jsx-runtime') return jsx;
      if (name.endsWith('.css')) return {};
      if (name.endsWith('/config') || name === './config') return { studioConfig: { trackManagerUrl: 'https://private.invalid', catalogApi: 'https://public.invalid' } };
      const base = path.resolve(path.dirname(file), name);
      const resolved = [base + '.ts', base + '.tsx'].find(candidate => fs.existsSync(candidate));
      assert.ok(resolved, `Unknown dependency ${name}`);
      return load(resolved);
    },
  }, { filename: file });
  return exports;
}
const shared = load('src/services/shared-private-reads.ts');
const rawAlbums = load('src/services/album-admin-api.ts');
const rawTracks = load('src/services/admin-api.ts');
const migration = load('src/services/album-migration-api.ts');
const catalogUi = load('src/components/CatalogView.tsx');
const managementUi = load('src/components/AlbumsWorkspace.tsx');
const healthUi = load('src/components/AlbumHealthWorkspace.tsx');
assert.equal(requests.length, 0, 'Importing the shell/Tracks must issue zero requests.');
const flush = () => new Promise(resolve => setImmediate(resolve));
const count = key => requests.filter(request => request.url === endpoints[key]).length;
function reply(url, response) {
  const index = waiting.findIndex(request => request.url === url);
  assert.notEqual(index, -1, `Expected pending request ${url}`);
  waiting.splice(index, 1)[0].resolve(response);
}
function findElement(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
}
function reset() { assert.equal(waiting.length, 0, 'Every fixture request must be consumed.'); requests = []; }
async function completeTracks({ privateStatus = 200, sonicStatus = 200 } = {}) {
  reply(endpoints.tracks, json(trackBody, privateStatus));
  reply(endpoints.sonic, json({ entries: [{ trackId: 'synthetic-track', analysisId: 'synthetic-analysis', outdated: true }] }, sonicStatus));
  reply(endpoints.publicTracks, json({ ok: true, tracks: [{ slug: 'synthetic-track', title: 'Public synthetic', status: 'published' }] }));
  await flush();
}
function instance(component) {
  const state = { slots: [], cursor: 0, effects: [], mounting: true, writes: 0 };
  const render = () => { currentHooks = state; state.cursor = 0; return component(); };
  const tree = render();
  state.mounting = false;
  const cleanups = state.effects.map(effect => effect());
  return { state, tree, render, unmount: () => cleanups.forEach(cleanup => cleanup?.()) };
}

// Real concurrent mount: Health + Management + Tracks share one full logical read.
const overview = healthUi.AlbumHealthWorkspace().props.children[0].type;
const health = instance(overview), management = instance(managementUi.AlbumsWorkspace), catalog = instance(catalogUi.CatalogView);
for (const key of ['albums', 'tracks', 'sonic', 'publicTracks']) assert.equal(count(key), 1, `${key}: one overlapping GET`);
reply(endpoints.albums, json(albumBody));
await completeTracks();
while (waiting.some(request => request.url === endpoints.visuals)) reply(endpoints.visuals, json({ ok: true, albumAuthority: 'canonical-r2', albums: [] }));
await flush();
assert.equal(count('albums'), 1, 'Artwork must reuse the already-read Album payload even after Track reads settle.');
assert.match(renderToStaticMarkup(health.render()), /Synthetic album/);
assert.match(renderToStaticMarkup(management.render()), /Synthetic album/);
assert.match(renderToStaticMarkup(catalog.render()), /Synthetic track/);
assert.doesNotMatch(renderToStaticMarkup(health.render()), /Private Track truth unavailable/);
for (const { url, options } of requests) {
  assert.equal(options.method || 'GET', 'GET');
  assert.equal(options.cache, 'no-store');
  if (url.startsWith('https://private.invalid')) {
    assert.equal(options.credentials, 'include'); assert.equal(options.mode, 'cors');
  }
}

// The editor's real onChanged callback forces post-write refreshes. Complete the
// newer refresh first, then the old one: stale success must not replace new data.
findElement(management.render(), element => element.props?.className === 'panel c3-album-library-card').props.onClick();
const editor = management.render().props.children;
const olderRefresh = editor.props.onChanged();
const newerRefresh = editor.props.onChanged();
const newerRequests = waiting.splice(4); // each refresh starts Album + public Tracks + SonicTrace + private Tracks
assert.equal(newerRequests.length, 4);
for (const request of newerRequests) {
  const body = request.url === endpoints.albums ? { ...albumBody, albums: [{ ...album, title: 'Fresh after write' }] }
    : request.url === endpoints.sonic ? { entries: [] }
    : request.url === endpoints.tracks ? trackBody : { ok: true, tracks: [] };
  request.resolve(json(body));
}
await flush();
reply(endpoints.visuals, json({ ok: true, albumAuthority: 'canonical-r2', albums: [] }));
await newerRefresh;
assert.equal(management.render().props.children.props.albums[0].title, 'Fresh after write');
reply(endpoints.albums, json(albumBody));
await completeTracks(); await olderRefresh;
assert.equal(management.render().props.children.props.albums[0].title, 'Fresh after write');
assert.equal(waiting.length, 0, 'Superseded refresh must not start artwork discovery.');
health.unmount(); management.unmount(); catalog.unmount();
reset();

// No settled success cache; navigation/re-entry gets current canonical truth.
const next = shared.getSharedAlbums();
reply(endpoints.albums, json({ ...albumBody, albums: [{ ...album, title: 'New revision' }] }));
assert.equal((await next).albums[0].title, 'New revision');
assert.equal(count('albums'), 1);
reset();

// A forced read bypasses pending work; old settlement cannot clear its replacement.
const old = shared.getSharedAlbums();
const fresh = shared.getSharedAlbums(true);
assert.notEqual(old, fresh);
reply(endpoints.albums, json(albumBody)); await old;
assert.equal(shared.getSharedAlbums(), fresh);
reply(endpoints.albums, json({ ok: true, albums: [] })); await fresh;
assert.equal(count('albums'), 2);
reset();

// Canonical verification/guards and full migration cannot join browsing requests.
const browsing = shared.getSharedAlbums();
const canonical = rawAlbums.getAdminAlbums();
const full = migration.getAdminAlbumMigrationDryRun();
const fullRejected = assert.rejects(full, error => error.code === 'ALBUM_MIGRATION_INVALID_DRY_RUN');
assert.equal(count('albums'), 2);
reply(endpoints.albums, json(albumBody));
reply(endpoints.albums, json({ ok: true, albums: [] }));
reply('https://private.invalid/api/studio/albums', json(albumBody));
assert.equal((await browsing).albums.length, 1);
assert.equal((await canonical).albums.length, 0);
await fullRejected;
reset();

// Failures are shared only while pending: one retry budget, no sticky rejection.
for (const [status, attempts, kind] of [[503, 2, 'http'], [401, 1, 'access-or-cors'], [403, 1, 'access-or-cors'], [404, 1, 'http']]) {
  const a = shared.getSharedAlbums(), b = shared.getSharedAlbums();
  assert.equal(a, b);
  const rejected = assert.rejects(a, error => error.kind === kind && error.status === status);
  for (let i = 0; i < attempts; i++) { reply(endpoints.albums, json({}, status)); await flush(); }
  await rejected;
  assert.equal(count('albums'), attempts);
  const retry = shared.getSharedAlbums();
  reply(endpoints.albums, json(albumBody)); await retry;
  assert.equal(count('albums'), attempts + 1);
  reset();
}

// Public fallback stays public, SonicTrace failures stay optional, and neither
// outcome can persist into the next private read. Raw Track reads remain fresh.
for (const privateStatus of [403, 200]) {
  const first = shared.getSharedCatalogTracks(), second = shared.getSharedCatalogTracks();
  assert.equal(first, second);
  const raw = rawTracks.getAdminTracks();
  assert.equal(count('tracks'), 2);
  await completeTracks({ privateStatus, sonicStatus: 403 });
  reply(endpoints.tracks, json(trackBody)); await raw;
  const tracks = await first;
  assert.equal(tracks[0].readSource, privateStatus === 200 ? 'private' : 'public');
  assert.equal(tracks[0].audioIntelligence.available, false);
  assert.equal(count('sonic'), 1);
  reset();
}
const sonicSuccess = shared.getSharedCatalogTracks();
await completeTracks();
assert.equal((await sonicSuccess)[0].audioIntelligence.latestAnalysisId, 'synthetic-analysis');
assert.equal((await sonicSuccess)[0].audioIntelligence.outdated, true);
reset();

// Unmounted consumers ignore late replies without aborting another subscriber.
const departed = instance(catalogUi.CatalogView);
departed.unmount();
const writesBefore = departed.state.writes;
const survivor = instance(catalogUi.CatalogView);
assert.equal(count('tracks'), 1);
await completeTracks();
assert.equal(departed.state.writes, writesBefore);
assert.match(renderToStaticMarkup(survivor.render()), /Synthetic track/);
survivor.unmount(); reset();

// Guard the sharing boundary: write/recovery and migration clients never import it.
for (const file of fs.readdirSync('src/services').filter(file => file.endsWith('.ts') && file !== 'shared-private-reads.ts')) {
  assert.doesNotMatch(fs.readFileSync(`src/services/${file}`, 'utf8'), /from ['"].*shared-private-reads/, `${file}: canonical clients must remain independent`);
}
console.log('CPU slice 4 PASS: concurrent real page effects, request counts, artwork reuse, fresh navigation, forced refresh races, raw canonical isolation, bounded retries, provenance, SonicTrace semantics and unmount safety.');
