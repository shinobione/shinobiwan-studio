import { studioConfig } from './config';

export interface PublicAlbumVisual {
  id: string;
  cover: string | null;
  fullCover: string | null;
  thumbnail: string | null;
}

interface PublicAlbumsResponse {
  ok?: boolean;
  albumAuthority?: string;
  albums?: Array<{
    id?: string;
    cover?: string | null;
    fullCover?: string | null;
    thumbnail?: string | null;
  }>;
}

export async function getPublicAlbumVisuals(): Promise<Map<string, PublicAlbumVisual>> {
  const base = studioConfig.catalogApi.replace(/\/$/, '');
  const response = await fetch(`${base}/albums`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    mode: 'cors',
  });
  if (!response.ok) throw new Error(`Public Album projection returned HTTP ${response.status}.`);
  const payload = await response.json() as PublicAlbumsResponse;
  if (payload.ok === false || payload.albumAuthority !== 'canonical-r2' || !Array.isArray(payload.albums)) {
    throw new Error('Public Album projection did not advertise canonical-r2 authority.');
  }
  return new Map(payload.albums.flatMap(album => {
    const id = String(album.id || '').trim();
    if (!id) return [];
    return [[id, {
      id,
      cover: album.cover || null,
      fullCover: album.fullCover || null,
      thumbnail: album.thumbnail || null,
    } satisfies PublicAlbumVisual] as const];
  }));
}
