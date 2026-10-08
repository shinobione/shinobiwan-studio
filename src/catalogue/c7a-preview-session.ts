// C7a session: independent from the accepted private Catalogue viewer and C6 fictional lab.
// Every selection terminates its predecessor and every result is generation-fenced.
import { MAX_BYTES } from './import';
import { rejectC7a, type C7aReport } from './c7a-preview';

export interface C7aWorker {
  onmessage: ((event: MessageEvent<C7aReport>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(file: File): void;
  terminate(): void;
}
export type C7aState =
  | { phase: 'empty' | 'reading' }
  | { phase: 'complete'; report: C7aReport };

export function createC7aSession(factory: () => C7aWorker, publish: (state: C7aState) => void) {
  let generation = 0;
  let worker: C7aWorker | null = null;
  let disposed = false;
  const cancel = () => { generation++; worker?.terminate(); worker = null; };
  return {
    select(file: File) {
      if (disposed) return;
      cancel();
      const current = generation;
      publish({ phase: 'reading' });
      const code = file.size === 0 ? 'FILE_EMPTY' : file.size > MAX_BYTES ? 'FILE_TOO_LARGE' :
        !file.name.toLowerCase().endsWith('.json') ? 'JSON_ONLY' : null;
      if (code) { publish({ phase: 'complete', report: rejectC7a(code) }); return; }
      try {
        const job = factory();
        worker = job;
        const finish = (report: C7aReport) => {
          if (disposed || generation !== current) return;
          cancel();
          publish({ phase: 'complete', report });
        };
        job.onmessage = event => finish(event.data);
        job.onerror = event => { event.preventDefault(); finish(rejectC7a('LOCAL_PREVIEW_FAILED')); };
        job.postMessage(file);
      } catch {
        cancel();
        publish({ phase: 'complete', report: rejectC7a('LOCAL_PREVIEW_FAILED') });
      }
    },
    reset() { if (!disposed) { cancel(); publish({ phase: 'empty' }); } },
    dispose() { cancel(); disposed = true; },
  };
}
