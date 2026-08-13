import { adminAlbumMediaUrl, getAdminAlbums } from './album-admin-api';
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
  // Studio Album Management is private. A draft Album can legitimately have
  // canonical R2 artwork that is absent from the public LaunchPAD projection.
  // Prefer the protected Track Manager media route whenever private asset state
  // proves the object exists, then use the public projection only as fallback.
  const privatePayload = await getAdminAlbums();
  const visuals = new Map<string, PublicAlbumVisual>();
  for (const album of privatePayload.albums || []) {
    const cover = album.assetState?.cover?.present ? adminAlbumMediaUrl(album.id, 'cover') : null;
    const thumbnail = album.assetState?.thumbnail?.present ? adminAlbumMediaUrl(album.id, 'thumbnail') : null;
    if (cover || thumbnail) {
      visuals.set(album.id, {
        id: album.id,
        cover: cover || thumbnail,
        fullCover: cover || thumbnail,
        thumbnail: thumbnail || cover,
      });
    }
  }

  const base = studioConfig.catalogApi.replace(/\/$/, '');
  try {
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
    for (const album of payload.albums) {
      const id = String(album.id || '').trim();
      if (!id || visuals.has(id)) continue;
      visuals.set(id, {
        id,
        cover: album.cover || null,
        fullCover: album.fullCover || null,
        thumbnail: album.thumbnail || null,
      });
    }
  } catch {
    // Private canonical artwork remains truthful and sufficient for Studio.
    // Albums with no private artwork simply keep their initials fallback.
  }

  return visuals;
}
