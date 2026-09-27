import { useEffect, useRef, useState } from 'react';
import { createImportSession, type SessionState } from './session';

// One owner for the entire mounted Catalogue, including invalid subroutes.
// No module-level snapshot, persistence, or session resurrection.
export function useCatalogueSession() {
  const [state, setState] = useState<SessionState>({ phase: 'empty' });
  const session = useRef<ReturnType<typeof createImportSession> | null>(null);
  useEffect(() => {
    const current = createImportSession(() => new Worker(new URL('./import.worker.ts', import.meta.url), { type: 'module' }), setState);
    session.current = current;
    // Also discard before a document enters the back/forward cache.
    const clear = () => current.reset();
    globalThis.addEventListener('pagehide', clear);
    return () => {
      globalThis.removeEventListener('pagehide', clear);
      current.dispose();
      session.current = null;
    };
  }, []);
  return { state, onSelect: (file: File) => session.current?.select(file), onReset: () => session.current?.reset() };
}
