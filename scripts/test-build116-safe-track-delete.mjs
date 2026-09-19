import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const service = fs.readFileSync('src/services/track-delete-admin-api.ts', 'utf8');
const ui = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');
const contextualUi = fs.readFileSync('src/components/ContinuationReceiptBanner.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const currentVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';

assert.ok(currentBuild >= 116, `Build116 guard requires Build116 or a successor, got Build${currentBuild}.`);
assert.equal(pkg.version, currentVersion);
assert.match(release, /phase:\s*10/);
assert.match(release, /build116AncestryMarker\s*=\s*"version: '0\.19\.38' · build: 116 · codename: 'studio-focus-build116-safe-track-delete'"/);
assert.match(release, /build115AncestryMarker\s*=\s*"version: '0\.19\.37' · build: 115 · codename: 'studio-focus-build115-safe-album-delete'"/);
assert.match(pkg.scripts?.['check:build116'] || '', /test-build116-safe-track-delete\.mjs/);
assert.match(pkg.scripts?.build || '', /npm run check:build116/);

for (const marker of [
  "const DELETE_INTENT = 'track-delete-v1'",
  "includes('track-delete')",
  '/api/studio/tracks/${encodeURIComponent(trackId)}/delete',
  'expectedUpdatedAt',
  'confirmTrackId: trackId',
  "'TRACK_DELETE_NOT_COMMITTED'",
  "'TRACK_DELETE_AMBIGUOUS'",
  "'TRACK_DELETE_UNVERIFIED'",
  "albumOwnershipPolicy: 'canonical-album-trackIds-hard-block-no-implicit-membership-write'",
  "successVerification: 'private-canonical-track-collection-absence'",
  "lostResponsePolicy: 'canonical-reread-no-blind-retry'",
  'maxAutomaticDeleteRetries: 0',
]) assert.ok(service.includes(marker), `Build116 delete service missing ${marker}`);
assert.equal((service.match(/method:\s*'POST'/g) || []).length, 1, 'Whole-Track delete client must have exactly one destructive POST transport.');
assert.ok(!service.includes('setInterval('));
assert.ok(!service.includes('public-'));
assert.ok(!service.includes('retryAdminTrackDelete'));

for (const marker of [
  "import { deleteAdminTrackResilient, TrackDeleteError } from '../services/track-delete-admin-api';",
  "'Delete Track…'",
  'globalThis.prompt(',
  'Type the exact canonical Track ID',
  'tracks.find(track => track.id === trackId)',
  "target.readSource !== 'private' || !target.updatedAt",
  'If a canonical Album still owns this Track, Track Manager will block the deletion',
  'await deleteAdminTrackResilient(target.id, target.updatedAt)',
  "reason.code === 'TRACK_DELETE_ALBUM_OWNED'",
]) assert.ok(ui.includes(marker), `Build116 Track library UI missing ${marker}`);

for (const marker of [
  "import { deleteAdminTrackResilient, TrackDeleteError } from '../services/track-delete-admin-api';",
  'TRACK ACTIONS',
  'Current Track',
  'Permanent deletion is available here on the Track itself.',
  'Delete Track…',
  'Type the exact canonical Track ID to continue',
  'canonical.readSource !== \'private\' || !canonical.updatedAt',
  'await deleteAdminTrackResilient(canonical.id, canonical.updatedAt)',
  "reason.code === 'TRACK_DELETE_ALBUM_OWNED'",
  "globalThis.location.assign(routeHref('catalog'))",
]) assert.ok(contextualUi.includes(marker), `Build116 contextual Track delete corrective missing ${marker}`);

const compiled = ts.transpileModule(service, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const original = { slug: 'delete-me', title: 'Delete Me', status: 'draft', updatedAt: '2026-09-14T17:00:00.000Z' };

class MockAdminReadError extends Error {
  constructor(kind, message, status = null) { super(message); Object.assign(this, { kind, status }); }
}

async function scenario(mode) {
  let posts = 0;
  let reads = 0;
  let collection = [original];
  const context = {
    exports: {}, AbortController, DOMException, Response, Headers, TypeError, setTimeout, clearTimeout,
    require: name => {
      if (name === './admin-api') return {
        AdminReadError: MockAdminReadError,
        getAdminBridgeHealth: async () => ({ capabilities: { manage: ['track-delete'] } }),
        getAdminTracks: async () => { reads++; return { ok: true, tracks: collection }; },
      };
      if (name === './config') return { studioConfig: { trackManagerUrl: 'https://tm.invalid' } };
      throw Error(name);
    },
    fetch: async (url, options = {}) => {
      posts++;
      assert.equal(url, 'https://tm.invalid/api/studio/tracks/delete-me/delete');
      assert.equal(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.deepEqual(body, { intent: 'track-delete-v1', expectedUpdatedAt: original.updatedAt, confirmTrackId: 'delete-me' });
      if (mode === 'transport-committed') { collection = []; throw new TypeError('lost'); }
      if (mode === 'transport-not-committed') throw new TypeError('lost');
      if (mode === 'transport-ambiguous') { collection = [{ ...original, updatedAt: '2026-09-14T17:01:00.000Z' }]; throw new TypeError('lost'); }
      if (mode === 'album-owned') {
        return Response.json({ ok: false, code: 'TRACK_DELETE_ALBUM_OWNED', error: 'owned', albumId: 'owner-album', albumTitle: 'Owner Album', currentUpdatedAt: original.updatedAt }, { status: 409 });
      }
      collection = [];
      return Response.json({ ok: true, deleted: true, trackId: 'delete-me', previousUpdatedAt: original.updatedAt }, { status: 200 });
    },
  };
  vm.runInNewContext(compiled, context);
  let result, error;
  try { result = await context.exports.deleteAdminTrackResilient('delete-me', original.updatedAt); }
  catch (reason) { error = reason; }
  return { result, error, posts, reads };
}

let run = await scenario('normal');
assert.equal(run.posts, 1);
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, false);
assert.equal(run.result.retrySafe, false);
assert.equal(run.reads, 2, 'Normal delete uses one pre-read and one post-success canonical Track collection reread.');

run = await scenario('transport-committed');
assert.equal(run.posts, 1, 'Lost response must never trigger an automatic second delete POST.');
assert.equal(run.result.clientVerified, true);
assert.equal(run.result.recoveredAfterTransportFailure, true);
assert.equal(run.result.retrySafe, false);
assert.equal(run.reads, 2);

run = await scenario('transport-not-committed');
assert.equal(run.posts, 1);
assert.equal(run.error.code, 'TRACK_DELETE_NOT_COMMITTED');
assert.equal(run.error.retrySafe, true);
assert.equal(run.reads, 2);

run = await scenario('transport-ambiguous');
assert.equal(run.posts, 1);
assert.equal(run.error.code, 'TRACK_DELETE_AMBIGUOUS');
assert.equal(run.error.retrySafe, false);
assert.equal(run.reads, 2);

run = await scenario('album-owned');
assert.equal(run.posts, 1);
assert.equal(run.error.code, 'TRACK_DELETE_ALBUM_OWNED');
assert.equal(run.error.albumId, 'owner-album');
assert.equal(run.error.albumTitle, 'Owner Album');
assert.equal(run.reads, 1, 'Explicit backend ownership block is not treated as lost-response recovery.');

console.log(`Build116 Studio ancestry PASS under Build${currentBuild}: exact-ID Track delete works from both the library and current Track context, with canonical Album ownership block, one delete POST, canonical absence verification, lost-response recovery without blind retry, and fail-closed ambiguous state.`);
