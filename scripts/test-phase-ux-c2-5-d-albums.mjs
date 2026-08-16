import assert from 'node:assert/strict';
import fs from 'node:fs';

const albumApi = fs.readFileSync('src/services/album-admin-api.ts', 'utf8');
const legacyAlbumUi = fs.readFileSync('src/components/AlbumManager.tsx', 'utf8');
const focusedAlbumUi = fs.readFileSync('src/components/AlbumsWorkspace.tsx', 'utf8');
const healthWrapper = fs.existsSync('src/components/AlbumHealthWorkspace.tsx') ? fs.readFileSync('src/components/AlbumHealthWorkspace.tsx', 'utf8') : '';
const embeddedLyrics = fs.readFileSync('src/components/EmbeddedLyricsStudio.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const router = fs.readFileSync('src/router.ts', 'utf8');
const types = fs.readFileSync('src/types/studio.ts', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const required of ["create: 'album-create-v1'","metadata: 'album-metadata-save-v1'","membership: 'album-membership-save-v1'","move: 'album-track-move-v1'","upload: 'album-asset-upload-v1'","deleteAsset: 'album-asset-delete-v1'","'/api/studio/albums'","credentials: 'include'","'Content-Type': 'text/plain;charset=UTF-8'","requireManage('album-create')","requireManage('album-metadata')","requireManage('album-membership')","requireManage('album-move')","requireManage('album-assets')",'getAdminAlbum(albumId)']) assert.ok(albumApi.includes(required), `C2.5-D Album client missing: ${required}`);
if (pkg.version === '0.19.21') {
  assert.ok(albumApi.includes('return verify(albumId, payload, { expectedAsset: {'), 'Build99 successor must preserve Track Manager authority while strengthening Album asset normal-success verification.');
  assert.ok(albumApi.includes('maxAutomaticAssetUploadRetries: 0'), 'Build99 successor must retain zero automatic Album asset upload retries.');
} else {
  assert.ok(albumApi.includes('return verify(albumId, payload)'), 'Historical C2.5-D Album upload must retain canonical verification.');
}
for (const forbidden of ['MEDIA_BUCKET','wrangler','api/media/albums','deleteStudioAlbum(']) assert.ok(!albumApi.includes(forbidden), `Studio Album client must not bypass Track Manager or expose whole-Album deletion: ${forbidden}`);

for (const required of ['Create canonical draft','album.trackIds','Save tracklist','Move to…','Upload cover + thumbnail','Apply palette to metadata form']) assert.ok(legacyAlbumUi.includes(required), `Historical Album Manager contract missing: ${required}`);
for (const required of ['+ New Album / EP','Create canonical draft','album.trackIds','Save tracklist','Move to…','Upload cover + thumbnail','Apply palette to Overview form']) assert.ok(focusedAlbumUi.includes(required), `Focused Album workspace must preserve D1/D2 write capability: ${required}`);

assert.ok(!focusedAlbumUi.includes('Add an unowned track…'), 'Focused Album UX must not create an unguarded ownership-assignment path.');
assert.ok(!focusedAlbumUi.includes('Delete Album'), 'Focused Album UX must not expose whole-Album deletion.');
assert.ok(focusedAlbumUi.includes('globalThis.confirm'), 'Production Album mutations must retain explicit confirmation.');
assert.ok(app.includes("route: 'albums'"), 'Studio navigation must expose Albums.');
const directAlbumsRoute = app.includes("{route === 'albums' && <AlbumsWorkspace />}");
const wrappedAlbumsRoute = app.includes("{route === 'albums' && <AlbumHealthWorkspace />}")
  && healthWrapper.includes("import { AlbumsWorkspace } from './AlbumsWorkspace';")
  && healthWrapper.includes('<AlbumsWorkspace />');
assert.ok(directAlbumsRoute || wrappedAlbumsRoute, 'Albums route must mount the focused workspace while preserving canonical APIs, directly or through the bounded Phase8 read-only wrapper.');
assert.ok(app.includes('Track Manager v5.19 · bridge v1.11'), 'Studio must retain the validated Track Manager v5.19 / bridge v1.11 diagnostic fallback.');
assert.ok(embeddedLyrics.includes("const EMBED_VERSION = '6.3.8'"), 'Embedded Lyrics Studio must keep the accepted LRC Maker 6.3.8 integration even when Studio Focus hides infrastructure versions from Home.');
assert.ok(router.includes("'albums'"), 'Router must recognize Albums.');
assert.ok(types.includes("| 'albums'"), 'StudioRoute must include Albums.');
assert.ok(main.includes("import './album-management.css';"), 'Historical Album styles must remain loaded during C3 UX correction.');
assert.ok(main.includes("import './c3-albums-ux.css';"), 'Focused C3 Album UX styles must be loaded.');
assert.ok(main.includes("import './c2-5-d-navigation.css';"), 'Legacy mobile navigation override must remain loaded for route compatibility.');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-d-albums.mjs'));

console.log('C2.5-D historical guard passed through Studio Focus: Track Manager remains the sole Album write authority and LRC Maker 6.3.8 remains pinned at the actual embedded integration seam.');