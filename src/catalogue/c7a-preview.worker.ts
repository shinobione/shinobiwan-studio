// C7a owner-local worker. The only cross-thread result is an aggregate summary or fixed rejection code.
// No source text, row object, ID, filename, digest, commercial item, or secrets are posted back.
import { MAX_BYTES } from './import';
import { parseCatalogueInput } from './import-v2';
import { rejectC7a, summarizeC7aV2 } from './c7a-preview';

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    const file = event.data;
    if (!(file instanceof File)) { self.postMessage(rejectC7a('UNREADABLE_SOURCE')); return; }
    if (file.size === 0) { self.postMessage(rejectC7a('FILE_EMPTY')); return; }
    if (file.size > MAX_BYTES) { self.postMessage(rejectC7a('FILE_TOO_LARGE')); return; }
    if (!file.name.toLowerCase().endsWith('.json')) { self.postMessage(rejectC7a('JSON_ONLY')); return; }
    const raw = await file.arrayBuffer();
    const input = new TextDecoder('utf-8', { fatal: true }).decode(raw);
    let source: unknown;
    try { source = JSON.parse(input); }
    catch { self.postMessage(rejectC7a('SOURCE_NOT_ACCEPTED')); return; }
    if (!source || typeof source !== 'object' || Array.isArray(source) ||
        (source as { schemaVersion?: unknown }).schemaVersion !== 'catalogue-readonly-seed-v2') {
      self.postMessage(rejectC7a('V2_ONLY')); return;
    }
    const digest = await crypto.subtle.digest('SHA-256', raw);
    const sha = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    const result = parseCatalogueInput(input, sha);
    // Never transmit parser results; they may contain complete private evidence bodies.
    self.postMessage(summarizeC7aV2(input, result));
  } catch {
    self.postMessage(rejectC7a('LOCAL_PREVIEW_FAILED'));
  }
};
