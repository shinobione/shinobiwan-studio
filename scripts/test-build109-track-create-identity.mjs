import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const operationId = '01234567-89ab-4cde-8f01-23456789abcd';
const otherId = '11234567-89ab-4cde-8f01-23456789abcd';
const base = { slug: 'test-track', status: 'draft', title: 'Server normalized', updatedAt: '2026-09-13T00:00:00Z', creationOperationId: operationId };
async function scenario(mode, canonical = base, response = base, echoed = operationId) {
  let posts = 0, reads = 0, uuids = 0;
  const context = {
    exports: {}, AbortController, DOMException, TypeError, Response,
    setTimeout, clearTimeout,
    crypto: { randomUUID: () => { uuids++; return mode === 'no-crypto' ? undefined : operationId; } },
    require: name => {
      if (name === './admin-api') return {
        getAdminBridgeHealth: async () => ({ capabilities: { manage: ['track-create'] } }),
        getAdminTrack: async slug => { assert.equal(slug, 'test-track'); reads++; if (canonical instanceof Error) throw canonical; return { track: { manifest: canonical } }; },
      };
      if (name === './config') return { studioConfig: { trackManagerUrl: 'https://tm.invalid' } };
      if (name === './audio-duration-evidence') return {};
      throw Error(name);
    },
    fetch: async (url, options) => {
      posts++;
      assert.equal(options.method, 'POST');
      assert.equal(options.credentials, 'include');
      const body = JSON.parse(options.body);
      assert.equal(body.intent, 'track-create-v1');
      assert.equal(body.operationId, operationId);
      if (mode === 'transport') throw new TypeError('lost response');
      if (mode === 'timeout') throw new DOMException('timed out', 'AbortError');
      if (mode === 'body-loss') return { ok: true, status: 201, headers: new Headers({ 'content-type': 'application/json' }), json: async () => { throw new TypeError('stream lost'); } };
      if (mode === 'conflict') return Response.json({ ok: false, code: 'TRACK_EXISTS' }, { status: 409 });
      if (mode === 'invalid-json') return new Response('{', { headers: { 'content-type': 'application/json' } });
      return Response.json({ ok: true, created: true, trackId: 'test-track', track: response, operationId: echoed, catalogRebuilt: true });
    },
  };
  vm.runInNewContext(compiled, context);
  let result, error;
  try { result = await context.exports.createAdminTrack('test-track', { title: 'Test' }); } catch (reason) { error = reason; }
  assert.equal(uuids, 1);
  assert.equal(posts, mode === 'no-crypto' ? 0 : 1, 'Exactly one create POST per explicit operation, never an automatic retry');
  return { result, error, reads };
}
let run = await scenario('normal');
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, false);
assert.equal(run.result.retrySafe, false);
assert.equal(run.reads, 1);
for (const mode of ['transport', 'timeout', 'body-loss']) {
  run = await scenario(mode);
  assert.equal(run.result.created, true);
  assert.equal(run.result.operationId, operationId);
  assert.equal(run.result.clientVerified, true);
  assert.equal(run.result.recoveredAfterTransportFailure, true);
  assert.equal(run.result.retrySafe, false);
  assert.equal(run.result.catalogRebuilt, undefined, 'Lost response cannot prove catalog publication');
  assert.equal(run.reads, 1);
  for (const id of [otherId, undefined, operationId.toUpperCase()]) {
    run = await scenario(mode, { ...base, creationOperationId: id });
    assert.equal(run.result, undefined);
    assert.equal(run.error.code, 'TRACK_CREATE_AMBIGUOUS');
    assert.equal(run.error.retrySafe, false);
  }
  for (const unreadable of [undefined, null, {}, new Error('private read unavailable'), { ...base, slug: 'wrong' }]) {
    run = await scenario(mode, unreadable === undefined ? {} : unreadable);
    assert.equal(run.error.code, 'TRACK_CREATE_UNVERIFIED');
    assert.equal(run.error.retrySafe, false);
  }
}
for (const altered of [{ ...base, title: 'Concurrent edit' }, { ...base, updatedAt: 'later' }, { ...base, creationOperationId: otherId }]) {
  run = await scenario('normal', altered);
  assert.equal(run.result.clientVerified, false, 'Build97 exact whole-manifest/revision proof stays enforced');
}
run = await scenario('normal', base, base, otherId);
assert.equal(run.result.clientVerified, false);
run = await scenario('normal', { ...base, creationOperationId: undefined }, { ...base, creationOperationId: undefined }, null);
assert.equal(run.result.clientVerified, false, 'New client must not accept an old backend as identity proof');
for (const mode of ['conflict', 'invalid-json', 'no-crypto']) {
  run = await scenario(mode);
  assert.ok(run.error);
  assert.equal(run.reads, 0);
}
assert.match(source, /maxAutomaticTrackCreateRetries: 0/);
assert.match(source, /stableCreateManifestJson\(canonicalManifest\) === stableCreateManifestJson\(responseManifest\)/);
console.log('Build109 Studio PASS: one UUID/POST, normal exact-manifest proof, timeout/transport/body-loss recovery, conflicting/legacy/unreadable evidence, fail-closed old backend, no automatic retry.');

