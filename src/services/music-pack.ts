import Ajv2020, { type ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import schema from '../schemas/SHINOBIWAN-track-pack.schema.v1.json';

export type MusicPackStatus = 'draft' | 'validated';

export interface MusicPackPromptBlock {
  prompt: string;
}

export interface MusicPackV1 {
  schemaVersion: '1.0';
  artist: 'SHINOBIWAN';
  pack: {
    status: MusicPackStatus;
    revision: number;
  };
  track: {
    title: string;
    slug: string;
    version: string;
    status: string;
    positioning: string;
    genre: string[];
    mood: string[];
    bpm: number | null;
    key: string;
    explicit: boolean | null;
  };
  production?: {
    stylePrompt: string;
    hook: string;
    structure: string[];
    lyrics: string;
    notes: string[];
  };
  soundcloud: {
    title: string;
    description: string;
    tags: string[];
    highlight: {
      start: string;
      end: string;
      durationSeconds: number | null;
    };
  };
  social: {
    shortCaption: string;
    longCaption: string;
    hashtags: string[];
  };
  visuals: {
    master16x9: MusicPackPromptBlock;
    square1x1: MusicPackPromptBlock;
    vertical9x16: MusicPackPromptBlock;
    canvas: {
      durationSeconds: number;
      prompt: string;
      loopRequirement: string;
    };
  };
  release: {
    hook: string;
    oneLiner: string;
    recommendedExcerpt: {
      start: string;
      end: string;
      durationSeconds: number | null;
      reason: string;
    };
    notes: string[];
  };
  source: {
    generatedBy: 'ChatGPT MUSIC project';
    packType: 'PACK COMPLET';
    generatedAt: string;
  };
}

export interface StoredMusicPackV1 {
  trackId: string;
  importedAt: string;
  payload: MusicPackV1;
}

export interface MusicPackIdentityMismatch {
  field: 'title' | 'slug';
  selected: string;
  incoming: string;
}

export type MusicPackParseResult =
  | { ok: true; pack: MusicPackV1 }
  | {
      ok: false;
      code: 'INVALID_JSON' | 'UNSUPPORTED_SCHEMA' | 'INVALID_SCHEMA';
      message: string;
      errors: string[];
    };

const STORAGE_PREFIX = 'shinobiwan-studio:music-pack:v1:';
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateV1 = ajv.compile<MusicPackV1>(schema);

function schemaErrorText(error: ErrorObject): string {
  const path = error.instancePath || '/';
  return `${path} ${error.message || 'is invalid'}`.trim();
}

function storageKey(trackId: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(trackId)}`;
}

export function parseMusicPackJson(text: string): MusicPackParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      ok: false,
      code: 'INVALID_JSON',
      message: 'This file is not valid JSON.',
      errors: ['JSON.parse failed'],
    };
  }

  const version = typeof parsed === 'object' && parsed !== null && 'schemaVersion' in parsed
    ? (parsed as { schemaVersion?: unknown }).schemaVersion
    : undefined;

  if (version !== '1.0') {
    return {
      ok: false,
      code: 'UNSUPPORTED_SCHEMA',
      message: 'Unsupported MUSIC Pack schema version.',
      errors: [`Expected schemaVersion 1.0, received ${String(version ?? 'missing')}`],
    };
  }

  if (!validateV1(parsed)) {
    const errors = (validateV1.errors || []).map(schemaErrorText);
    return {
      ok: false,
      code: 'INVALID_SCHEMA',
      message: 'MUSIC Pack V1 validation failed.',
      errors,
    };
  }

  return { ok: true, pack: parsed };
}

export function compareMusicPackIdentity(
  pack: MusicPackV1,
  selectedTrack: { id: string; title: string },
): MusicPackIdentityMismatch[] {
  const mismatches: MusicPackIdentityMismatch[] = [];
  if (pack.track.title.trim() !== selectedTrack.title.trim()) {
    mismatches.push({ field: 'title', selected: selectedTrack.title, incoming: pack.track.title });
  }
  if (pack.track.slug.trim() !== selectedTrack.id.trim()) {
    mismatches.push({ field: 'slug', selected: selectedTrack.id, incoming: pack.track.slug });
  }
  return mismatches;
}

export function saveLocalMusicPack(trackId: string, pack: MusicPackV1): StoredMusicPackV1 {
  const stored: StoredMusicPackV1 = {
    trackId,
    importedAt: new Date().toISOString(),
    payload: pack,
  };
  window.localStorage.setItem(storageKey(trackId), JSON.stringify(stored));
  return stored;
}

export function loadLocalMusicPack(trackId: string): StoredMusicPackV1 | null {
  const raw = window.localStorage.getItem(storageKey(trackId));
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw) as Partial<StoredMusicPackV1>;
    if (stored.trackId !== trackId || typeof stored.importedAt !== 'string' || !stored.payload) return null;
    if (!validateV1(stored.payload)) return null;
    return { trackId, importedAt: stored.importedAt, payload: stored.payload };
  } catch {
    return null;
  }
}

export function removeLocalMusicPack(trackId: string): void {
  window.localStorage.removeItem(storageKey(trackId));
}

export const musicPackImportPolicy = {
  schemaVersion: '1.0',
  persistence: 'browser-local-per-track',
  canonicalWrites: false,
  trackIdentityUse: 'warning-only-never-authority',
  mismatchPolicy: 'explicit-confirmation-before-attach',
  regenerationPolicy: 'never-regenerate-imported-pack-content',
} as const;
