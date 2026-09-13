import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const service = fs.readFileSync('src/services/album-delete-admin-api.ts', 'utf8');
const ui = fs.readFileSync('src/components/AlbumsWorkspace.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.equal(pkg.version, '0.19.37');
assert.match(release, /version:\s*'0\.19\.37'/);
assert.match(release, /build:\s*115/);
assert.match(release, /phase:\s*10/);
assert.match(release, /studio-focus-build115-safe-album-delete/);
assert.match(release, /build114AncestryMarker/);
assert.match(pkg.scripts?.['check:build115'] || '', /test-build115-safe-album-delete\.mjs/);
assert.match(pkg.scripts?.build || '', /check:build114 && npm run check:build115 && npm run check:focus/);

for (const marker of [
  "const DELETE_INTENT = 'album-delete-v1'",
  "includes('album-delete')",
  '/api/studio/albums/${encodeURIComponent(albumId)}/delete',
  'expectedUpdatedAt',
  'confirmAlbumId: albumId',
  "'ALBUM_DELETE_NOT_COMMITTED'",
  "'ALBUM_DELETE_AMBIGUOUS'",
  "'ALBUM_DELETE_UNVERIFIED'",
  'maxAutomaticDeleteRetries: 0',
  "successVerification: 'private-canonical-album-collection-absence'",
  "lostResponsePolicy: 'canonical-reread-no-blind-retry'",
]) assert.ok(service.includes(marker), `Build115 delete service missing ${marker}`);
assert.equal((service.match(/method:\s*'POST'/g) || []).length, 1, 'Whole-Album delete client must have exactly one destructive POST transport.');
assert.ok(!service.includes('setInterval('));
assert.ok(!service.includes('public-albums'));
assert.ok(!service.includes('retryAdminAlbumDelete'));

for (const marker of [
  "import { deleteAdminAlbumResilient } from '../services/album-delete-admin-api';",
  'globalThis.prompt(',
  'Type the exact canonical ID to confirm',
  'confirmation.trim() !== album.id',
  'Delete canonical Album',
  'Member Tracks are kept and return to Singles',
  'await deleteAdminAlbumResilient(album.id, album.updatedAt)',
  'onDeleted={() => setSelected(null)}',
]) assert.ok(ui.includes(marker), `Build115 Album UI missing ${marker}`);
assert.ok(!ui.includes('Whole-Album deletion remains unavailable.'));

const compiled = ts.transpileModule(service, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const original = { id: 'delete-me', title: 'Delete Me', status: 'draft', updatedAt: '2026-09-13T22:00:00.000Z', trackIds: [] };

class MockAlbumAdminError extends Error {
  constructor(message, status = null, code = null, currentUpdatedAt = null, rollback = null, quality = null, verificationDetail = null, retrySafe = false, technicalDetails = null) {
    super(message); Object.assign(this, { status, code, currentUpdatedAt, rollback, quality, verificationDetail, retrySafe, technicalDetails });
  }
}

async function scenario(mode) {
  let posts = 0;
  let reads = 0;
  let collection = [original];
  const context = {
    exports: {}, AbortController, DOMException, Response, Headers, TypeError, setTimeout, clearTimeout,
    require: name => {
      if (name === './admin-api') return { getAdminBridgeHealth: async () => ({ capabilities: { manage: ['album-delete'] } }) };
      if (name === './album-admin-api') return {
        AlbumAdminError: MockAlbumAdminError,
        getAdminAlbums: async () => { reads++; return { ok: true, albums: collection }; },
      };
      if (name === './config') return { studioConfig: { trackManagerUrl: 'https://tm.invalid' } };
      throw Error(name);
    },
    fetch: async (url, options = {}) => {
      posts++;
      assert.equal(url, 'https://tm.invalid/api/studio/albums/delete-me/delete');
      assert.equal(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.deepEqual(body, { intent: 'album-delete-v1', expectedUpdatedAt: original.updatedAt, confirmAlbumId: 'delete-me' });
      if (mode === 'transport-committed') { collection = []; throw new TypeError('lost'); }
      if (mode === 'transport-not-committed') throw new TypeError('lost');
      if (mode === 'transport-ambiguous') { collection = [{ ...original, updatedAt: '2026-09-13T22:01:00.000Z' }]; throw new TypeError('lost'); }
      collection = [];
      return Response.json({ ok: true, deleted: true, albumId: 'delete-me', previousUpdatedAt: original.updatedAt }, { status: 200 });
    },
  };
  vm.runInNewContext(compiled, context);
  let result, error;
  try { result = await context.exports.deleteAdminAlbumResilient('delete-me', original.updatedAt); }
  catch (reason) { error = reason; }
  return { result, error, posts, reads };
}

let run = await scenario('normal');
assert.equal(run.posts, 1);
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, false);
assert.equal(run.result.retrySafe, false);
assert.equal(run.reads, 2, 'Normal delete uses one pre-read and one post-success canonical collection reread.');

run = await scenario('transport-committed');
assert.equal(run.posts, 1, 'Lost response must never trigger an automatic second delete POST.');
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, true);
assert.equal(run.result.retrySafe, false);
assert.equal(run.reads, 2);

run = await scenario('transport-not-committed');
assert.equal(run.posts, 1);
assert.equal(run.error.code, 'ALBUM_DELETE_NOT_COMMITTED');
assert.equal(run.error.retrySafe, true);
assert.equal(run.reads, 2);

run = await scenario('transport-ambiguous');
assert.equal(run.posts, 1);
assert.equal(run.error.code, 'ALBUM_DELETE_AMBIGUOUS');
assert.equal(run.error.retrySafe, false);
assert.equal(run.reads, 2);

console.log('Build115 Studio PASS: exact-ID destructive confirmation, revision preflight, one delete POST, canonical absence verification, lost-response recovery without blind retry, and fail-closed ambiguous state.');
