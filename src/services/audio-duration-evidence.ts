export interface AdminAudioEvidence {
  audio: {
    duration: number;
    readable: true;
  };
}

const MAX_AUDIO_DURATION_SECONDS = 12 * 60 * 60;
const METADATA_TIMEOUT_MS = 10000;

function normalizeDuration(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_AUDIO_DURATION_SECONDS) return null;
  return Number(value.toFixed(3));
}

function measureAudioElement(audio: HTMLAudioElement, cleanup: () => void): Promise<AdminAudioEvidence | null> {
  return new Promise(resolve => {
    let settled = false;
    const finish = (value: AdminAudioEvidence | null) => {
      if (settled) return;
      settled = true;
      globalThis.clearTimeout(timeout);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
      cleanup();
      resolve(value);
    };
    const onLoaded = () => {
      const duration = normalizeDuration(audio.duration);
      finish(duration == null ? null : { audio: { duration, readable: true } });
    };
    const onError = () => finish(null);
    const timeout = globalThis.setTimeout(() => finish(null), METADATA_TIMEOUT_MS);
    audio.addEventListener('loadedmetadata', onLoaded, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.preload = 'metadata';
    audio.load();
  });
}

export async function measureAudioFileEvidence(file: File): Promise<AdminAudioEvidence | null> {
  if (!(file instanceof File) || file.size <= 0) return null;
  const objectUrl = URL.createObjectURL(file);
  const audio = new Audio();
  audio.src = objectUrl;
  return measureAudioElement(audio, () => {
    audio.removeAttribute('src');
    URL.revokeObjectURL(objectUrl);
  });
}

export async function measureCanonicalAudioEvidence(url: string): Promise<AdminAudioEvidence | null> {
  const source = String(url || '').trim();
  if (!source) return null;
  const audio = new Audio();
  // Track Manager protected media explicitly supports credentialed CORS reads.
  // Set crossOrigin before src so the metadata request carries the Access session.
  audio.crossOrigin = 'use-credentials';
  audio.src = source;
  return measureAudioElement(audio, () => audio.removeAttribute('src'));
}
