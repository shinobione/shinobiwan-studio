const LEGACY_ALBUM_TRACK_TYPES = new Set(["titre d'album", 'titre d’album']);

function artistFacingTrackType(value: string): string {
  const normalized = value.trim().toLocaleLowerCase('fr-FR');
  return LEGACY_ALBUM_TRACK_TYPES.has(normalized) ? 'Album track' : value;
}

function normalizeVisibleTrackType(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.workspace-focus-facts > div').forEach(fact => {
    const label = fact.querySelector<HTMLElement>('span');
    const value = fact.querySelector<HTMLElement>('strong');
    if (!label || !value || label.textContent?.trim().toLowerCase() !== 'type') return;
    const current = value.textContent?.trim() || '';
    const display = artistFacingTrackType(current);
    if (display !== current) value.textContent = display;
  });
}

export function installLegacyTrackTypeDisplay(): () => void {
  const apply = () => normalizeVisibleTrackType(document);
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export { artistFacingTrackType };
