const ADMIN_KEY = 'shinobiStudioAdmin';

export function resolveAdminMode(): boolean {
  const params = new URLSearchParams(globalThis.location.search);
  const explicit = params.get('admin');
  try {
    if (explicit === '1') localStorage.setItem(ADMIN_KEY, '1');
    if (explicit === '0') localStorage.removeItem(ADMIN_KEY);
    return explicit !== '0' && (explicit === '1' || localStorage.getItem(ADMIN_KEY) === '1');
  } catch {
    return explicit === '1';
  }
}
