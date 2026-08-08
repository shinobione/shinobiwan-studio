import { studioConfig } from './config';
import { fetchJson } from './http';
import type { StudioAsset, StudioLyricSegment, StudioTrack, StudioTrackDetail } from '../types/studio';

interface PublicHealth {
  ok?: boolean;
  service?: string;
  version?: string | number;
  canonicalTracks?: number;
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

function baseUrl(): string {
  return studioConfig.catalogApi.replace(/\/$/, '');
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

function mapTrack(item: PublicTrack): StudioTrack {
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

function mapLyricSegments(value: PublicTrack['lyrics']): StudioLyricSegment[] {
  if (!Array.isArray(value?.segments)) return [];
  return value.segments
    .filter(segment => typeof segment.time === 'number' && typeof segment.text === 'string')
    .map(segment => ({ time: segment.time as number, text: segment.text as string }));
}

export async function getCatalogHealth(): Promise<PublicHealth> {
  return fetchJson<PublicHealth>(`${baseUrl()}/health`);
}

export async function getCatalogTracks(): Promise<StudioTrack[]> {
  const payload = await fetchJson<PublicTracksResponse>(`${baseUrl()}/tracks`, 6000);
  if (payload.ok === false || !Array.isArray(payload.tracks)) throw new Error('LaunchPAD returned an invalid catalog response.');
  return payload.tracks.map(mapTrack);
}

export async function getCatalogTrack(trackId: string): Promise<StudioTrackDetail> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId)) throw new Error('Invalid trackId.');
  const payload = await fetchJson<PublicTrackResponse>(`${baseUrl()}/tracks/${encodeURIComponent(trackId)}`, 6000);
  if (payload.ok === false || !payload.track) throw new Error('LaunchPAD returned an invalid track response.');
  const track = mapTrack(payload.track);
  const lyricSegments = mapLyricSegments(payload.track.lyrics);
  return {
    ...track,
    timestampsAvailable: track.timestampsAvailable || lyricSegments.length > 0,
    lyricsRaw: typeof payload.track.lyrics?.raw === 'string' ? payload.track.lyrics.raw : null,
    lyricSegments,
  };
}
