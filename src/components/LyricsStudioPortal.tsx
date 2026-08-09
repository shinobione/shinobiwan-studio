import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { readTrackId, readTrackSection } from '../router';
import { EmbeddedLyricsStudio } from './EmbeddedLyricsStudio';

interface PortalTarget {
  element: HTMLElement;
  trackId: string;
}

export function LyricsStudioPortal() {
  const [target, setTarget] = useState<PortalTarget | null>(null);

  useEffect(() => {
    let current: HTMLElement | null = null;

    const syncTarget = () => {
      const trackId = readTrackId();
      const section = readTrackSection();
      const next = trackId && section === 'lyrics'
        ? document.querySelector<HTMLElement>('.workspace-lyrics-panel')
        : null;

      if (current && current !== next) current.classList.remove('workspace-lyrics-panel--embedded');
      if (!next || !trackId) {
        current = null;
        setTarget(previous => previous === null ? previous : null);
        return;
      }

      next.classList.add('workspace-lyrics-panel--embedded');
      current = next;
      setTarget(previous => previous?.element === next && previous.trackId === trackId
        ? previous
        : { element: next, trackId });
    };

    syncTarget();
    globalThis.addEventListener('hashchange', syncTarget);
    const root = document.getElementById('root');
    const observer = new MutationObserver(syncTarget);
    if (root) observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      globalThis.removeEventListener('hashchange', syncTarget);
      current?.classList.remove('workspace-lyrics-panel--embedded');
    };
  }, []);

  return target ? createPortal(<EmbeddedLyricsStudio trackId={target.trackId} />, target.element) : null;
}
