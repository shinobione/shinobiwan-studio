import type { StudioRoute } from './types/studio';

const ROUTES = new Set<StudioRoute>([
  'dashboard',
  'catalog',
  'intelligence',
  'lyrics',
  'assets',
  'publishing',
  'administration',
]);

export function readRoute(): StudioRoute {
  const value = globalThis.location.hash.replace(/^#\/?/, '').split('/')[0] as StudioRoute;
  return ROUTES.has(value) ? value : 'dashboard';
}

export function routeHref(route: StudioRoute): string {
  return `#/${route}`;
}
