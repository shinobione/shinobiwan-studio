import { getAdminAlbums } from './album-admin-api';
import { getCatalogTracks } from './catalog-api';

// Browsing only: share a pending operation (including its bounded GET retries),
// never a settled result. Canonical write verification keeps using the raw clients.
function pendingRead<T>(read: () => Promise<T>) {
  let pending: Promise<T> | null = null;
  return (fresh = false): Promise<T> => {
    if (!fresh && pending) return pending;
    const request = read().finally(() => {
      // A superseded request must not clear a newer forced refresh.
      if (pending === request) pending = null;
    });
    pending = request;
    return request;
  };
}

export const getSharedAlbums = pendingRead(getAdminAlbums);
// Share the whole projection so private Tracks, public fallback/enrichment and
// SonicTrace keep their existing provenance and failure semantics together.
export const getSharedCatalogTracks = pendingRead(getCatalogTracks);
