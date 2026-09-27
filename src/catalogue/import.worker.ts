import { MAX_BYTES, parseCatalogue, reject } from './import';

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    const file = event.data;
    if (!(file instanceof File) || file.size > MAX_BYTES) { self.postMessage(reject('FILE_TOO_LARGE')); return; }
    const bytes = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const sha = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
    const input = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    self.postMessage(parseCatalogue(input, sha));
  } catch { self.postMessage(reject('UNREADABLE_SOURCE')); }
};
