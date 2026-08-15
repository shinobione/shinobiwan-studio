import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const album = read('src/services/album-admin-api.ts');
const lyrics = read('src/services/lyrics-admin-api.ts');
const sonic = read('src/services/sonictrace-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.11'/);
assert.match(release, /build:\s*89/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-private-read-transient-retry-truth'"));
assert.ok(release.includes('build88AncestryMarker'), 'Build89 must preserve accepted Build88 ancestry.');
assert.ok(release.includes("version: 0.19.10 · build: 88 · codename: 'studio-focus-slice4-phase9-private-read-transient-retry-truth'"));
assert.equal(pkg.version, '0.19.11', 'package version must match Build89 runtime version.');

assert.ok(album.includes('const TRANSIENT_ALBUM_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'Album transient HTTP allowlist must remain explicit and bounded.');
assert.ok(album.includes('async function readJsonOnce<T>(path: string, timeoutMs: number): Promise<T>'), 'Build89 must isolate one Album private-read attempt.');
assert.ok(album.includes("throw new AdminReadError('transport', 'Canonical Album read transport was interrupted.');"), 'Album transport failures must not be mislabeled Access/CORS.');
assert.ok(album.includes("reason.kind === 'timeout'"));
assert.ok(album.includes("reason.kind === 'transport'"));
assert.ok(album.includes("reason.kind === 'http' && reason.status !== null && TRANSIENT_ALBUM_READ_STATUSES.has(reason.status)"));
assert.ok(album.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'Album private reads must make at most two total attempts.');
assert.ok(album.includes('if (attempt === 0 && isTransientAlbumReadError(reason))'), 'Only the first transient Album GET failure may be retried.');
assert.ok(album.includes('Canonical Album read failed after one bounded transient retry.'), 'A second Album read failure must surface instead of looping.');
assert.ok(album.includes("privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry'"));
assert.ok(album.includes('privateReadMaxAttempts: 2'));

assert.ok(album.includes("response.status === 401 || response.status === 403 ? 'access-or-cors' : 'http'"), 'Album 401/403 must remain deterministic Access failures.');
assert.ok(album.includes("'Cloudflare Access session is not available to Studio Album Management.'"), 'Non-JSON Album Access gating must remain explicit.');
assert.ok(album.includes("throw new AdminReadError('invalid-response', 'Track Manager Album read returned invalid JSON.'"), 'Invalid Album JSON must remain deterministic and non-retry.');
assert.ok(!album.includes("reason.kind === 'access-or-cors'\n    ||"), 'Access/CORS must never enter the Album retry predicate.');
assert.ok(!album.includes("reason.kind === 'invalid-response'\n    ||"), 'Invalid responses must never enter the Album retry predicate.');

assert.ok(album.includes("getAdminAlbums(): Promise<AdminAlbumsResponse> { const payload = await readJson<AdminAlbumsResponse>('/api/studio/albums')"), 'Album collection must use the bounded private-read helper.');
assert.ok(album.includes('getAdminAlbum(albumId: string): Promise<AdminAlbumResponse>'), 'Canonical Album detail read must remain present.');
assert.ok(album.includes('const reread = await getAdminAlbum(albumId);'), 'Existing Album write verification must keep using canonical Album reread.');
assert.equal((album.match(/method:\s*'POST'/g) || []).length, 3, 'Build89 must not add or duplicate Album write POST paths.');
assert.ok(album.includes("create: 'album-create-v1'"));
assert.ok(album.includes("upload: 'album-asset-upload-v1'"));
assert.ok(album.includes("deleteAsset: 'album-asset-delete-v1'"));
assert.ok(!album.includes('retryAlbumWrite'), 'Build89 must never introduce automatic Album write retry.');
assert.ok(!album.includes('retryAdminAlbumAsset'), 'Build89 must never introduce automatic Album asset write retry.');

assert.ok(lyrics.includes('async function getLyricsJson(trackId: string)'), 'Lyrics private reads remain a separate future audit family.');
assert.ok(!lyrics.includes('TRANSIENT_ALBUM_READ_STATUSES'), 'Build89 must not silently broaden Album policy into Lyrics.');
assert.ok(sonic.includes('async function adminJson<T>(path: string, init?: RequestInit, timeoutMs = 12000)'), 'SonicTrace private reads remain a separate future audit family.');
assert.ok(!sonic.includes('TRANSIENT_ALBUM_READ_STATUSES'), 'Build89 must not silently broaden Album policy into SonicTrace.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
  'test-phase9-private-read-transient-retry-build88.mjs',
  'test-phase9-album-private-read-transient-retry-build89.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build89 Album private-read retry guard passed: Album collection/detail GETs retry once only for transient timeout/transport/HTTP failures while Access/CORS, deterministic 4xx and invalid JSON remain non-retry; Lyrics, SonicTrace and all Album writes stay out of scope.');
