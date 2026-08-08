import type { StudioRoute, WorkspaceSection } from './types/studio';

const ROUTES = new Set<StudioRoute>([
  'dashboard',
  'catalog',
  'intelligence',
  'lyrics',
  'assets',
  'publishing',
  'administration',
]);

const WORKSPACE_SECTIONS = new Set<WorkspaceSection>([
  'overview',
  'intelligence',
  'lyrics',
  'assets',
  'versions',
  'metadata',
  'publishing',
]);

function hashParts(): string[] {
  return globalThis.location.hash
    .replace(/^#\/?/, '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean);
}

export function readRoute(): StudioRoute {
  const [first] = hashParts();
  if (first === 'track') return 'catalog';
  const value = first as StudioRoute;
  return ROUTES.has(value) ? value : 'dashboard';
}

export function readTrackId(): string | null {
  const [first, second] = hashParts();
  if (first !== 'track' || !second || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(second)) return null;
  return second;
}

export function readTrackSection(): WorkspaceSection {
  const [first, , third] = hashParts();
  if (first !== 'track') return 'overview';
  const section = third as WorkspaceSection;
  return WORKSPACE_SECTIONS.has(section) ? section : 'overview';
}

export function routeHref(route: StudioRoute): string {
  return `#/${route}`;
}

export function trackHref(trackId: string, section: WorkspaceSection = 'overview'): string {
  return `#/track/${encodeURIComponent(trackId)}/${section}`;
}
