import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const app = read('src/App.tsx');
const workspace = read('src/components/AlbumsWorkspace.tsx');
const publicAlbums = read('src/services/public-albums-api.ts');
const styles = read('src/c3-albums-ux.css');

assert.ok(app.includes("import { AlbumsWorkspace } from './components/AlbumsWorkspace';"), 'Albums route must use the focused C3 workspace.');
assert.ok(app.includes("{route === 'albums' && <AlbumsWorkspace />}"), 'Albums route must render only AlbumsWorkspace.');
assert.ok(!app.includes("{route === 'albums' && <><AlbumManager /><AlbumMigrationPanel /></>}"), 'Daily Albums route must not stack the migration cockpit.');
assert.ok(app.includes('Album migration archive · C2.5 complete'), 'Completed migration tooling must remain archived under System.');
assert.ok(app.includes('className="panel c3-album-maintenance"'), 'Migration archive must be collapsed maintenance UI.');

for (const marker of [
  'c3-album-library-card',
  '<AlbumCover album={album} visual={visuals.get(album.id)} />',
  "type AlbumTab = 'overview' | 'tracklist' | 'assets'",
  '← Albums / Projects',
  'Current canonical artwork',
  '<code>album.trackIds</code> is the canonical membership and artistic order.',
  'getPublicAlbumVisuals',
]) assert.ok(workspace.includes(marker), `Focused Album workspace missing ${marker}.`);

assert.ok(!workspace.includes('C2.5-D boundary'), 'Closed C2.5 boundary copy must not remain in the daily Album workspace.');
assert.ok(!workspace.includes('Legacy assignment locked until C2.5-E'), 'Closed migration-boundary copy must not remain inside the focused Album editor.');
assert.ok(publicAlbums.includes("payload.albumAuthority !== 'canonical-r2'"), 'Cover previews must require canonical-r2 public authority.');
assert.ok(publicAlbums.includes("fetch(`${base}/albums`"), 'Cover previews must use the public canonical Album projection.');
assert.ok(styles.includes('.c3-album-library'), 'C3 Album library styles are missing.');
assert.ok(styles.includes('.c3-album-tabs'), 'Focused Album tabs styles are missing.');
assert.ok(styles.includes('@media(max-width:760px)'), 'Focused Album workspace must include a mobile layout guard.');

console.log('C3 UX focused Album library/editor and migration-archive guards passed.');
