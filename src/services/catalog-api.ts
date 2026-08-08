import { studioConfig } from './config';
import { fetchJson } from './http';
import {
  AdminReadError,
  adminMediaUrl,
  getAdminBridgeHealth,
  getAdminTrack,
  getAdminTracks,
  type AdminAssetKind,
  type AdminAssetState,
  type AdminManifest,
  type AdminQuality,
  type AdminTrackSummary,
} from './admin-api';
import type {
  StudioAsset,
  StudioLyricSegment,
  StudioReadSource,
  StudioTrack,
  StudioTrackDetail,
  StudioTrackQuality,
} from '../types/studio';

interface PublicHealth {
  ok?: boolean;
  service?: string;
  version?: string | number;
  canonicalTracks?: number;
}

export interface CatalogHealth extends PublicHealth {
  readSource: StudioReadSource;
  bridgeVersion?: string | null;
  trackManagerVersion?: string | null;
  fallbackReason?: string | null;
}

interface PublicAsset {
  originalName?: string | null;
  filename?: string | null;
  contentType?: string | null;
  size?: number | null;
  uploaded?: string | null;
  url?: string | null;
  fullUrl?: string | null;
  optimized?: boolean;
}

interface PublicTrack {
  slug?: string;
  title?: string;
  status?: string;
  type?: string;
  year?: number | null;
  releaseDate?: string | null;
  album?: { id?: string; title?: string } | null;
  genres?: string[];
  tags?: string[];
  moods?: string[];
  themes?: string[];
  era?: string | null;
  energy?: string | null;
  languages?: string[];
  bpm?: number | null;
  key?: string | null;
  keyConfidence?: number | null;
  explicit?: boolean | null;
  duration?: number | null;
  accent?: string | null;
  accent2?: string | null;
  lyricsAvailable?: boolean;
  timestampsAvailable?: boolean;
  assets?: {
    audio?: PublicAsset | null;
    cover?: PublicAsset | null;
    thumbnail?: PublicAsset | null;
    video?: PublicAsset | null;
    lyrics?: PublicAsset | null;
  };
  urls?: { self?: string };
  lyrics?: {
    raw?: string;
    segments?: Array<{ time?: number; text?: string }>;
  } | null;
}

interface PublicTracksResponse {
  ok?: boolean;
  count?: number;
  tracks?: PublicTrack[];
}

interface PublicTrackResponse {
  ok?: boolean;
  track?: PublicTrack;
}

type Settled<T> = { ok: true; value: T } | { ok: false; error: unknown };

function baseUrl(): string {
  return studioConfig.catalogApi.replace(/\/$/, '');
}

function settle<T>(promise: Promise<T>): Promise<Settled<T>> {
  return promise.then(value => ({ ok: true, value }), error => ({ ok: false, error }));
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

function mapAsset(value: PublicAsset | null | undefined): StudioAsset | null {
  if (!value?.url) return null;
  const filename = value.filename || value.originalName || value.url.split('/').pop()?.split('?')[0] || 'asset';
  return {
    originalName: value.originalName || null,
    filename,
    contentType: value.contentType || null,
    size: typeof value.size === 'number' ? value.size : null,
    uploaded: value.uploaded || null,
    url: value.url,
    fullUrl: value.fullUrl || null,
    optimized: value.optimized === true,
  };
}

function newestAssetTimestamp(assets: Array<StudioAsset | null>): string | null {
  const values = assets
    .map(asset => asset?.uploaded || null)
    .filter((value): value is string => Boolean(value) && Number.isFinite(Date.parse(value!)))
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return values[0] || null;
}

function mapPublicTrack(item: PublicTrack): StudioTrack {
  if (!item.slug) throw new Error('Catalog track is missing its canonical slug.');

  const audio = mapAsset(item.assets?.audio);
  const cover = mapAsset(item.assets?.cover);
  const thumbnail = mapAsset(item.assets?.thumbnail);
  const video = mapAsset(item.assets?.video);
  const lyricsTxt = mapAsset(item.assets?.lyrics);

  return {
    id: item.slug,
    title: item.title || item.slug,
    status: item.status || 'published',
    type: item.type || 'single',
    year: typeof item.year === 'number' ? item.year : null,
    releaseDate: item.releaseDate || null,
    album: {
      id: item.album?.id || 'singles',
      title: item.album?.title || 'Singles',
    },
    genres: stringList(item.genres),
    tags: stringList(item.tags),
    moods: stringList(item.moods),
    themes: stringList(item.themes),
    era: item.era || null,
    energy: item.energy || null,
    languages: stringList(item.languages),
    bpm: typeof item.bpm === 'number' ? item.bpm : null,
    key: item.key || null,
    keyConfidence: typeof item.keyConfidence === 'number' ? item.keyConfidence : null,
    explicit: typeof item.explicit === 'boolean' ? item.explicit : null,
    duration: typeof item.duration === 'number' ? item.duration : null,
    accent: item.accent || null,
    accent2: item.accent2 || null,
    lyricsAvailable: item.lyricsAvailable === true || Boolean(lyricsTxt),
    timestampsAvailable: item.timestampsAvailable === true,
    readSource: 'public',
    quality: null,
    assets: {
      audio,
      cover,
      thumbnail,
      video,
      lyricsTxt,
      lyricsLrc: null,
    },
    audioIntelligence: {
      available: false,
      outdated: false,
      latestAnalysisId: null,
    },
    publishing: {
      catalogVisible: true,
      publishable: Boolean(audio && cover),
    },
    createdAt: null,
    updatedAt: newestAssetTimestamp([audio, cover, thumbnail, video, lyricsTxt]),
  };
}

function mapQuality(value: AdminQuality | null | undefined): StudioTrackQuality | null {
  if (!value) return null;
  const counts = value.counts ? {
    error: Number(value.counts.error || 0),
    warning: Number(value.counts.warning || 0),
    info: Number(value.counts.info || 0),
  } : null;
  return {
    state: value.state || null,
    publishable: typeof value.publishable === 'boolean' ? value.publishable : null,
    counts,
    timestampsAvailable: value.timestampsAvailable === true,
    lyricsStatus: value.lyricsStatus || null,
  };
}

function mapPrivateAsset(
  trackId: string,
  kind: AdminAssetKind,
  state: AdminAssetState | null | undefined,
  publicAsset: StudioAsset | null,
): StudioAsset | null {
  if (state && state.present === false) return null;
  if (!state?.present && !state?.filename) return publicAsset;
  if (publicAsset) {
    return {
      ...publicAsset,
      filename: state.filename || publicAsset.filename,
      contentType: state.contentType || publicAsset.contentType || null,
      size: typeof state.size === 'number' ? state.size : publicAsset.size || null,
    };
  }
  const filename = state.filename || `${kind}.asset`;
  const url = adminMediaUrl(trackId, kind);
  return {
    originalName: null,
    filename,
    contentType: state.contentType || null,
    size: typeof state.size === 'number' ? state.size : null,
    uploaded: null,
    url,
    fullUrl: url,
    optimized: false,
  };
}

function privateAssets(
  trackId: string,
  states: AdminTrackSummary['assets'] | undefined,
  publicTrack: StudioTrack | null,
): StudioTrack['assets'] {
  return {
    audio: mapPrivateAsset(trackId, 'audio', states?.audio, publicTrack?.assets.audio || null),
    cover: mapPrivateAsset(trackId, 'cover', states?.cover, publicTrack?.assets.cover || null),
    thumbnail: mapPrivateAsset(trackId, 'thumbnail', states?.thumbnail, publicTrack?.assets.thumbnail || null),
    video: mapPrivateAsset(trackId, 'video', states?.video, publicTrack?.assets.video || null),
    lyricsTxt: mapPrivateAsset(trackId, 'lyrics', states?.lyrics, publicTrack?.assets.lyricsTxt || null),
    lyricsLrc: null,
  };
}

function mapPrivateSummary(item: AdminTrackSummary, publicTrack: StudioTrack | null): StudioTrack {
  if (!item.slug) throw new Error('Private catalog track is missing its canonical slug.');
  const quality = mapQuality(item.quality);
  const assets = privateAssets(item.slug, item.assets, publicTrack);
  const timestampsAvailable = quality?.timestampsAvailable === true
    || quality?.lyricsStatus === 'synced'
    || publicTrack?.timestampsAvailable === true;

  return {
    id: item.slug,
    title: item.title || publicTrack?.title || item.slug,
    status: item.status || publicTrack?.status || 'draft',
    type: item.type || publicTrack?.type || 'single',
    year: typeof item.year === 'number' ? item.year : publicTrack?.year || null,
    releaseDate: item.releaseDate || publicTrack?.releaseDate || null,
    album: {
      id: item.album?.id || publicTrack?.album.id || 'singles',
      title: item.album?.title || publicTrack?.album.title || 'Singles',
    },
    genres: stringList(item.genres).length ? stringList(item.genres) : publicTrack?.genres || [],
    tags: publicTrack?.tags || stringList(item.genres),
    moods: stringList(item.moods).length ? stringList(item.moods) : publicTrack?.moods || [],
    themes: stringList(item.themes).length ? stringList(item.themes) : publicTrack?.themes || [],
    era: publicTrack?.era || null,
    energy: publicTrack?.energy || null,
    languages: stringList(item.languages).length ? stringList(item.languages) : publicTrack?.languages || [],
    bpm: publicTrack?.bpm || null,
    key: publicTrack?.key || null,
    keyConfidence: publicTrack?.keyConfidence || null,
    explicit: typeof item.explicit === 'boolean' ? item.explicit : publicTrack?.explicit ?? null,
    duration: publicTrack?.duration || null,
    accent: publicTrack?.accent || null,
    accent2: publicTrack?.accent2 || null,
    lyricsAvailable: Boolean(assets.lyricsTxt),
    timestampsAvailable,
    readSource: 'private',
    quality,
    assets,
    audioIntelligence: publicTrack?.audioIntelligence || {
      available: false,
      outdated: false,
      latestAnalysisId: null,
    },
    publishing: {
      catalogVisible: (item.status || publicTrack?.status) === 'published',
      publishable: quality?.publishable ?? item.complete ?? publicTrack?.publishing.publishable ?? null,
    },
    createdAt: item.createdAt || publicTrack?.createdAt || null,
    updatedAt: item.updatedAt || publicTrack?.updatedAt || null,
  };
}

function privateManifestTrack(
  manifest: AdminManifest,
  states: AdminTrackSummary['assets'] | undefined,
  qualityValue: AdminQuality | null | undefined,
  publicTrack: StudioTrackDetail | null,
): StudioTrackDetail {
  if (!manifest.slug) throw new Error('Private track manifest is missing its canonical slug.');
  const quality = mapQuality(qualityValue);
  const assets = privateAssets(manifest.slug, states, publicTrack);
  const lyricSegments = publicTrack?.lyricSegments || [];
  const timestampsAvailable = quality?.timestampsAvailable === true
    || quality?.lyricsStatus === 'synced'
    || publicTrack?.timestampsAvailable === true
    || lyricSegments.length > 0;

  return {
    id: manifest.slug,
    title: manifest.title || publicTrack?.title || manifest.slug,
    status: manifest.status || publicTrack?.status || 'draft',
    type: manifest.type || publicTrack?.type || 'single',
    year: typeof manifest.year === 'number' ? manifest.year : publicTrack?.year || null,
    releaseDate: manifest.releaseDate || publicTrack?.releaseDate || null,
    album: {
      id: manifest.album?.id || publicTrack?.album.id || 'singles',
      title: manifest.album?.title || publicTrack?.album.title || 'Singles',
    },
    genres: stringList(manifest.genres),
    tags: stringList(manifest.tags),
    moods: stringList(manifest.moods),
    themes: stringList(manifest.themes),
    era: manifest.era || null,
    energy: manifest.energy || null,
    languages: stringList(manifest.languages),
    bpm: typeof manifest.bpm === 'number' ? manifest.bpm : null,
    key: manifest.key || null,
    keyConfidence: typeof manifest.keyConfidence === 'number' ? manifest.keyConfidence : null,
    explicit: typeof manifest.explicit === 'boolean' ? manifest.explicit : null,
    duration: typeof manifest.duration === 'number' ? manifest.duration : null,
    accent: manifest.accent || null,
    accent2: manifest.accent2 || null,
    lyricsAvailable: Boolean(assets.lyricsTxt),
    timestampsAvailable,
    readSource: 'private',
    quality,
    assets,
    audioIntelligence: publicTrack?.audioIntelligence || {
      available: false,
      outdated: false,
      latestAnalysisId: null,
    },
    publishing: {
      catalogVisible: manifest.status === 'published',
      publishable: quality?.publishable ?? publicTrack?.publishing.publishable ?? null,
    },
    createdAt: manifest.createdAt || null,
    updatedAt: manifest.updatedAt || publicTrack?.updatedAt || null,
    lyricsRaw: publicTrack?.lyricsRaw || null,
    lyricSegments,
  };
}

function mapLyricSegments(value: PublicTrack['lyrics']): StudioLyricSegment[] {
  if (!Array.isArray(value?.segments)) return [];
  return value.segments
    .filter(segment => typeof segment.time === 'number' && typeof segment.text === 'string')
    .map(segment => ({ time: segment.time as number, text: segment.text as string }));
}

async function getPublicHealth(): Promise<PublicHealth> {
  return fetchJson<PublicHealth>(`${baseUrl()}/health`);
}

async function getPublicTracks(): Promise<StudioTrack[]> {
  const payload = await fetchJson<PublicTracksResponse>(`${baseUrl()}/tracks`, 6000);
  if (payload.ok === false || !Array.isArray(payload.tracks)) throw new Error('LaunchPAD returned an invalid catalog response.');
  return payload.tracks.map(mapPublicTrack);
}

async function getPublicTrack(trackId: string): Promise<StudioTrackDetail> {
  const payload = await fetchJson<PublicTrackResponse>(`${baseUrl()}/tracks/${encodeURIComponent(trackId)}`, 6000);
  if (payload.ok === false || !payload.track) throw new Error('LaunchPAD returned an invalid track response.');
  const track = mapPublicTrack(payload.track);
  const lyricSegments = mapLyricSegments(payload.track.lyrics);
  return {
    ...track,
    timestampsAvailable: track.timestampsAvailable || lyricSegments.length > 0,
    lyricsRaw: typeof payload.track.lyrics?.raw === 'string' ? payload.track.lyrics.raw : null,
    lyricSegments,
  };
}

function failureMessage(error: unknown): string {
  if (error instanceof AdminReadError) return error.message;
  return error instanceof Error ? error.message : String(error);
}

export async function getCatalogHealth(): Promise<CatalogHealth> {
  const publicHealth = settle(getPublicHealth());
  try {
    const bridge = await getAdminBridgeHealth();
    const publicResult = await publicHealth;
    const publicValue = publicResult.ok ? publicResult.value : {};
    return {
      ...publicValue,
      ok: true,
      service: bridge.service || 'Track Manager Studio bridge',
      version: bridge.trackManagerVersion || publicValue.version,
      readSource: 'private',
      bridgeVersion: bridge.version || null,
      trackManagerVersion: bridge.trackManagerVersion || null,
      fallbackReason: null,
    };
  } catch (adminError) {
    const publicResult = await publicHealth;
    if (!publicResult.ok) throw publicResult.error;
    return {
      ...publicResult.value,
      readSource: 'public',
      bridgeVersion: null,
      trackManagerVersion: null,
      fallbackReason: failureMessage(adminError),
    };
  }
}

export async function getCatalogTracks(): Promise<StudioTrack[]> {
  const publicResultPromise = settle(getPublicTracks());
  try {
    const privatePayload = await getAdminTracks();
    const publicResult = await publicResultPromise;
    const publicTracks = publicResult.ok ? publicResult.value : [];
    const publicById = new Map(publicTracks.map(track => [track.id, track]));
    return (privatePayload.tracks || []).map(item => mapPrivateSummary(item, item.slug ? publicById.get(item.slug) || null : null));
  } catch (adminError) {
    const publicResult = await publicResultPromise;
    if (publicResult.ok) return publicResult.value;
    throw new Error(`Private and public catalog reads failed. Private: ${failureMessage(adminError)} Public: ${failureMessage(publicResult.error)}`);
  }
}

export async function getCatalogTrack(trackId: string): Promise<StudioTrackDetail> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId)) throw new Error('Invalid trackId.');
  const publicResultPromise = settle(getPublicTrack(trackId));
  try {
    const privatePayload = await getAdminTrack(trackId);
    const publicResult = await publicResultPromise;
    const publicTrack = publicResult.ok ? publicResult.value : null;
    const privateTrack = privatePayload.track;
    if (!privateTrack?.manifest) throw new Error('Private Track Manager response is missing its manifest.');
    return privateManifestTrack(privateTrack.manifest, privateTrack.assets, privateTrack.quality, publicTrack);
  } catch (adminError) {
    const publicResult = await publicResultPromise;
    if (publicResult.ok) return publicResult.value;
    throw new Error(`Private and public track reads failed. Private: ${failureMessage(adminError)} Public: ${failureMessage(publicResult.error)}`);
  }
}
