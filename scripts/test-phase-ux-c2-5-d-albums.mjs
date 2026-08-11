import assert from 'node:assert/strict';
import fs from 'node:fs';

const albumApi = fs.readFileSync('src/services/album-admin-api.ts', 'utf8');
const legacyAlbumUi = fs.readFileSync('src/components/AlbumManager.tsx', 'utf8');
const focusedAlbumUi = fs.readFileSync('src/components/AlbumsWorkspace.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const router = fs.readFileSync('src/router.ts', 'utf8');
const types = fs.readFileSync('src/types/studio.ts', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const required of ["create: 'album-create-v1'","metadata: 'album-metadata-save-v1'","membership: 'album-membership-save-v1'","move: 'album-track-move-v1'","upload: 'album-asset-upload-v1'","deleteAsset: 'album-asset-delete-v1'","'/api/studio/albums'","credentials: 'include'","'Content-Type': 'text/plain;charset=UTF-8'","requireManage('album-create')","requireManage('album-metadata')","requireManage('album-membership')","requireManage('album-move')","requireManage('album-assets')",'getAdminAlbum(albumId)','return verify(albumId, payload)']) assert.ok(albumApi.includes(required), `C2.5-D Album client missing: ${required}`);
for (const forbidden of ['MEDIA_BUCKET','wrangler','api/media/albums','deleteStudioAlbum(']) assert.ok(!albumApi.includes(forbidden), `Studio Album client must not bypass Track Manager or expose whole-Album deletion: ${forbidden}`);

for (const required of ['Create canonical draft','album.trackIds','Save tracklist','Move to…','Upload cover + thumbnail','Apply palette to metadata form']) assert.ok(legacyAlbumUi.includes(required), `Historical Album Manager contract missing: ${required}`);
for (const required of ['+ New Album / EP','Create canonical draft','album.trackIds','Save tracklist','Move to…','Upload cover + thumbnail','Apply palette to Overview form']) assert.ok(focusedAlbumUi.includes(required), `Focused Album workspace must preserve D1/D2 write capability: ${required}`);

assert.ok(!focusedAlbumUi.includes('Add an unowned track…'), 'Focused Album UX must not create an unguarded ownership-assignment path.');
assert.ok(!focusedAlbumUi.includes('Delete Album'), 'Focused Album UX must not expose whole-Album deletion.');
assert.ok(focusedAlbumUi.includes('globalThis.confirm'), 'Production Album mutations must retain explicit confirmation.');
assert.ok(app.includes("route: 'albums'"), 'Studio navigation must expose Albums / Projects.');
assert.ok(app.includes("{route === 'albums' && <AlbumsWorkspace />}"), 'Albums route must mount the focused workspace while preserving canonical APIs.');
assert.ok(app.includes('Track Manager v5.19 · bridge v1.11'), 'Studio shell must report the validated Track Manager v5.19 / bridge v1.11 backend.');
assert.ok(app.includes('<strong>6.3.8</strong>'), 'Studio shell must keep current LRC Maker version.');
assert.ok(router.includes("'albums'"), 'Router must recognize Albums.');
assert.ok(types.includes("| 'albums'"), 'StudioRoute must include Albums.');
assert.ok(main.includes("import './album-management.css';"), 'Historical Album styles must remain loaded during C3 UX correction.');
assert.ok(main.includes("import './c3-albums-ux.css';"), 'Focused C3 Album UX styles must be loaded.');
assert.ok(main.includes("import './c2-5-d-navigation.css';"), 'Four-destination mobile navigation override must remain loaded.');
assert.ok(String(pkg.scripts?.['check:ux'] || '').includes('test-phase-ux-c2-5-d-albums.mjs'));

console.log('C2.5-D historical guard passed through the C3 focused Album workspace: Track Manager remains the sole write authority with guarded membership/assets and no whole-Album deletion.');
