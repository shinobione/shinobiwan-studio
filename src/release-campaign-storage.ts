import type { ReleaseCampaignDraft } from './release-campaign';

const DB_NAME = 'shinobiwan-studio-release-campaign';
const STORE_NAME = 'drafts';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB unavailable.'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const request = action(tx.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Local draft operation failed.'));
      tx.onabort = () => reject(tx.error || new Error('Local draft transaction aborted.'));
    });
  } finally {
    db.close();
  }
}

export async function loadReleaseCampaignDraft(trackId: string): Promise<ReleaseCampaignDraft | null> {
  if (!('indexedDB' in globalThis)) return null;
  try {
    return await withStore<ReleaseCampaignDraft | undefined>('readonly', store => store.get(trackId)) || null;
  } catch {
    return null;
  }
}

export async function saveReleaseCampaignDraft(draft: ReleaseCampaignDraft): Promise<void> {
  if (!('indexedDB' in globalThis)) return;
  await withStore<IDBValidKey>('readwrite', store => store.put(draft, draft.trackId));
}

export async function clearReleaseCampaignDraft(trackId: string): Promise<void> {
  if (!('indexedDB' in globalThis)) return;
  await withStore<undefined>('readwrite', store => store.delete(trackId) as IDBRequest<undefined>);
}
