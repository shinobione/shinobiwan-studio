export type IntakeAlbumStatus = 'draft' | 'published' | 'archived';
export type IntakeAlbumCandidate = {
  id: string;
  title: string;
  type: 'album' | 'ep' | 'collection';
  status: IntakeAlbumStatus;
  trackIds: string[];
};

export type IntakeAlbumResolution =
  | { kind: 'singles'; requestedId: 'singles'; requestedTitle: 'Singles'; album: null; ready: true; reason: string }
  | { kind: 'existing'; requestedId: string; requestedTitle: string; album: IntakeAlbumCandidate; ready: true; reason: string }
  | { kind: 'missing'; requestedId: string; requestedTitle: string; album: null; ready: false; reason: string }
  | { kind: 'blocked'; requestedId: string; requestedTitle: string; album: IntakeAlbumCandidate; ready: false; reason: string };

export function canonicalAlbumId(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function resolveIntakeAlbum(
  requestedAlbumId: string,
  requestedAlbumTitle: string,
  albums: IntakeAlbumCandidate[],
): IntakeAlbumResolution {
  const rawTitle = String(requestedAlbumTitle || '').trim();
  const requestedTitle = rawTitle || 'Singles';
  const requestedId = canonicalAlbumId(String(requestedAlbumId || '').trim() || requestedTitle) || 'singles';

  if (requestedId === 'singles' || requestedTitle.toLowerCase() === 'singles') {
    return {
      kind: 'singles',
      requestedId: 'singles',
      requestedTitle: 'Singles',
      album: null,
      ready: true,
      reason: 'Track stays in the transitional Singles collection until a canonical Album binding is explicitly requested.',
    };
  }

  const exactId = albums.find(album => album.id === requestedId) || null;
  const titleMatches = albums.filter(album => canonicalAlbumId(album.title) === canonicalAlbumId(requestedTitle));
  const album = exactId || (titleMatches.length === 1 ? titleMatches[0] : null);

  if (!album) {
    return {
      kind: 'missing',
      requestedId,
      requestedTitle,
      album: null,
      ready: false,
      reason: 'No canonical Album matches this TXT/manual Album reference. Studio will not create a phantom albumId.',
    };
  }

  if (album.status !== 'draft') {
    return {
      kind: 'blocked',
      requestedId: album.id,
      requestedTitle: album.title,
      album,
      ready: false,
      reason: `Canonical Album “${album.title}” is ${album.status}. New draft tracks can only bind to a draft Album so published release quality cannot be silently degraded.`,
    };
  }

  return {
    kind: 'existing',
    requestedId: album.id,
    requestedTitle: album.title,
    album,
    ready: true,
    reason: `Canonical draft “${album.title}” is ready. Binding happens only after the new track and selected assets are canonically verified.`,
  };
}

export function safeInitialTrackAlbum(): { id: 'singles'; title: 'Singles' } {
  return { id: 'singles', title: 'Singles' };
}
