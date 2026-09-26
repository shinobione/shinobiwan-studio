export type CatalogueSection = 'overview' | 'releases' | 'recordings' | 'qa';
export type CatalogueRoute =
  | { section: CatalogueSection; id?: never }
  | { section: 'releases' | 'recordings'; id: string }
  | { section: 'not-found'; id?: never };

// Commercial IDs are opaque, case-sensitive identifiers, never titles or ISRCs.
// Decode exactly once; reject separators, control characters and malformed escapes.
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;

export function readCatalogueRoute(hash = globalThis.location.hash): CatalogueRoute {
  const parts = hash.replace(/^#\//, '').split('/');
  if (parts[0] !== 'catalogue') return { section: 'not-found' };
  if (parts.length === 1) return { section: 'overview' };
  const section = parts[1];
  if (parts.length === 2 && (section === 'releases' || section === 'recordings' || section === 'qa')) {
    return { section };
  }
  if (parts.length === 3 && (section === 'releases' || section === 'recordings')) {
    try {
      const id = decodeURIComponent(parts[2]);
      if (ID_PATTERN.test(id)) return { section, id };
    } catch { /* Invalid URL encoding is a not-found route, never another record. */ }
  }
  return { section: 'not-found' };
}

export function catalogueHref(route: Exclude<CatalogueRoute, { section: 'not-found' }>): string {
  if (route.id !== undefined) {
    if (!ID_PATTERN.test(route.id)) throw new Error('Invalid commercial Catalogue ID.');
    return `#/catalogue/${route.section}/${encodeURIComponent(route.id)}`;
  }
  return route.section === 'overview' ? '#/catalogue' : `#/catalogue/${route.section}`;
}
