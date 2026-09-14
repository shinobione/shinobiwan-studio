import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('src/services/album-admin-api.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const operationId = '01234567-89ab-4cde-8f01-23456789abcd';
const otherId = '11234567-89ab-4cde-8f01-23456789abcd';
const base = {
  schemaVersion: 1,
  id: 'test-album',
  title: 'Test Album',
  type: 'album',
  status: 'draft',
  year: null,
  releaseDate: null,
  description: null,
  heading: null,
  trackIds: [],
  accent: null,
  accent2: null,
  assets: { cover: null, thumbnail: null },
  createdAt: '2026-09-13T18:40:00Z',
  updatedAt: '2026-09-13T18:40:00Z',
  creationOperationId: operationId,
};

class MockAdminReadError extends Error {
  constructor(kind, message, status = null) { super(message); this.kind = kind; this.status = status; }
}

async function scenario(mode, canonical = base, responseAlbum = base, echoed = operationId) {
  let posts = 0, reads = 0, uuids = 0;
  const context = {
    exports: {}, AbortController, DOMException, TypeError, SyntaxError, Response, Headers,
    setTimeout, clearTimeout,
    crypto: { randomUUID: () => { uuids++; return mode === 'no-crypto' ? undefined : operationId; } },
    require: name => {
      if (name === './admin-api') return {
        AdminReadError: MockAdminReadError,
        getAdminBridgeHealth: async () => ({ capabilities: { manage: ['album-create'] } }),
        getAdminTrack: async () => ({}),
      };
      if (name === './config') return { studioConfig: { trackManagerUrl: 'https://tm.invalid' } };
      throw Error(name);
    },
    fetch: async (url, options = {}) => {
      if (options.method === 'POST') {
        posts++;
        assert.equal(url, 'https://tm.invalid/api/studio/albums');
        assert.equal(options.credentials, 'include');
        const body = JSON.parse(options.body);
        assert.equal(body.intent, 'album-create-v1');
        assert.equal(body.operationId, operationId);
        assert.equal(body.album.id, 'test-album');
        if (mode === 'transport') throw new TypeError('lost response');
        if (mode === 'timeout') throw new DOMException('timed out', 'AbortError');
        if (mode === 'body-loss') {
          return { ok: true, status: 201, headers: new Headers({ 'content-type': 'application/json' }), json: async () => { throw new TypeError('stream lost'); } };
        }
        if (mode === 'conflict') return Response.json({ ok: false, code: 'ALBUM_EXISTS', error: 'exists' }, { status: 409 });
        if (mode === 'invalid-json') {
          return { ok: true, status: 201, headers: new Headers({ 'content-type': 'application/json' }), json: async () => { throw new SyntaxError('bad json'); } };
        }
        return Response.json({ ok: true, created: true, albumId: 'test-album', album: responseAlbum, operationId: echoed }, { status: 201 });
      }
      reads++;
      assert.equal(url, 'https://tm.invalid/api/studio/albums/test-album');
      if (canonical instanceof Error) throw canonical;
      if (canonical === null) return Response.json({ ok: false, error: 'missing' }, { status: 404 });
      return Response.json({ ok: true, album: { manifest: canonical, assets: {} } });
    },
  };
  vm.runInNewContext(compiled, context);
  let result, error;
  try { result = await context.exports.createAdminAlbum({ id: 'test-album', title: 'Test Album', type: 'album' }); }
  catch (reason) { error = reason; }
  assert.equal(uuids, 1);
  assert.equal(posts, mode === 'no-crypto' ? 0 : 1, 'Exactly one Album create POST per explicit operation, never an automatic retry');
  return { result, error, reads };
}

let run = await scenario('normal');
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, false);
assert.equal(run.result.retrySafe, false);
assert.equal(run.result.operationId, operationId);
assert.equal(run.reads, 1);

for (const mode of ['transport', 'timeout', 'body-loss']) {
  run = await scenario(mode);
  assert.equal(run.result.created, true);
  assert.equal(run.result.operationId, operationId);
  assert.equal(run.result.album.creationOperationId, operationId);
  assert.equal(run.result.clientVerified, true);
  assert.equal(run.result.recoveredAfterTransportFailure, true);
  assert.equal(run.result.retrySafe, false);
  assert.equal(run.reads, 1);

  for (const id of [otherId, undefined, operationId.toUpperCase()]) {
    run = await scenario(mode, { ...base, creationOperationId: id });
    assert.equal(run.result, undefined);
    assert.equal(run.error.code, 'ALBUM_CREATE_AMBIGUOUS');
    assert.equal(run.error.retrySafe, false);
  }

  for (const unreadable of [null, {}, new Error('private read unavailable'), { ...base, id: 'wrong-album' }]) {
    run = await scenario(mode, unreadable);
    assert.equal(run.result, undefined);
    assert.equal(run.error.code, 'ALBUM_CREATE_UNVERIFIED');
    assert.equal(run.error.retrySafe, false);
  }
}

for (const altered of [
  { ...base, title: 'Concurrent title' },
  { ...base, updatedAt: '2026-09-13T18:41:00Z' },
  { ...base, creationOperationId: otherId },
]) {
  run = await scenario('normal', altered);
  assert.equal(run.result.clientVerified, false, 'Normal Album create must preserve Build96 revision + exact requested metadata proof and add exact operation identity');
}

run = await scenario('normal', base, base, otherId);
assert.equal(run.result.clientVerified, false, 'Wrong response echo cannot verify the operation');
run = await scenario('normal', { ...base, creationOperationId: undefined }, { ...base, creationOperationId: undefined }, undefined);
assert.equal(run.result.clientVerified, false, 'New Studio client must not accept an old backend as creation identity proof');

for (const mode of ['conflict', 'invalid-json', 'no-crypto']) {
  run = await scenario(mode);
  assert.ok(run.error);
  assert.equal(run.reads, 0, `${mode} must not trigger causal recovery without a lost create response`);
}

assert.match(source, /createLostResponsePolicy: 'private-creation-operation-id-exact-match-no-blind-retry'/);
assert.match(source, /maxAutomaticCreateRetries: 0/);
assert.match(source, /expectedCreationOperationId: operationId/);
assert.match(source, /body: JSON\.stringify\(\{ intent: INTENT\.create, operationId, album \}\)/);
assert.ok(!source.includes('retryAdminAlbumCreate'));

const release = fs.readFileSync('src/release.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const currentVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
assert.ok(currentBuild >= 114, `Build114 guard requires Build114 or a successor, got Build${currentBuild}.`);
assert.equal(pkg.version, currentVersion, 'package.json must match the active Studio release version.');
if (currentBuild === 114) {
  assert.equal(pkg.version, '0.19.36');
  assert.match(release, /version:\s*'0\.19\.36'/);
  assert.match(release, /build:\s*114/);
  assert.match(release, /studio-focus-build114-album-create-operation-identity/);
  assert.match(release, /build113AncestryMarker/);
} else {
  assert.match(release, /build114AncestryMarker/, `Build${currentBuild} must preserve accepted Build114 ancestry.`);
  assert.match(release, /phase:\s*10/, `Build${currentBuild} must stay on the active Phase10 program while inheriting Build114.`);
}
assert.match(pkg.scripts?.['check:build114'] || '', /test-build114-album-create-identity\.mjs/);
assert.match(pkg.scripts?.build || '', /npm run check:build114/, 'Successor production builds must keep the Build114 guard in the full gate.');

console.log(`Build114 Album-create identity ancestry PASS under Studio ${currentVersion} Build${currentBuild}: one UUID/POST, normal revision+metadata+identity proof, timeout/transport/body-loss recovery by exact private Album creation evidence, fail-closed old backend, and zero automatic create retry.`);
