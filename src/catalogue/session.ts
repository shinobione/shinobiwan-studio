import { MAX_BYTES, reject, type ImportResult } from './import';

export interface LocalWorker {
  onmessage: ((event: MessageEvent<ImportResult>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(file: File): void;
  terminate(): void;
}
export type SessionState = { phase: 'empty' | 'reading' } | { phase: 'complete'; result: ImportResult };
// The session owns only the live job. Private results belong exclusively to the mounted UI.
export function createImportSession(factory: () => LocalWorker, publish: (state: SessionState) => void) {
  let generation = 0; let worker: LocalWorker | null = null; let disposed = false;
  const cancel = () => { generation++; worker?.terminate(); worker = null; };
  return {
    select(file: File) {
      if (disposed) return;
      cancel(); publish({ phase: 'reading' }); const current = generation;
      if (!file.name.toLowerCase().endsWith('.json') || file.size > MAX_BYTES) { publish({ phase: 'complete', result: reject(file.size > MAX_BYTES ? 'FILE_TOO_LARGE' : 'JSON_ONLY') }); return; }
      try {
        const job = factory(); worker = job;
        const finish = (result: ImportResult) => { if (disposed || current !== generation) return; cancel(); publish({ phase: 'complete', result }); };
        job.onmessage = event => finish(event.data);
        job.onerror = event => { event.preventDefault(); finish(reject('LOCAL_PARSER_FAILED')); };
        job.postMessage(file);
      } catch { cancel(); publish({ phase: 'complete', result: reject('LOCAL_PARSER_FAILED') }); }
    },
    reset() { if (!disposed) { cancel(); publish({ phase: 'empty' }); } },
    dispose() { cancel(); disposed = true; },
  };
}
