export type StudioRoute =
  | 'dashboard'
  | 'catalog'
  | 'intelligence'
  | 'lyrics'
  | 'assets'
  | 'publishing'
  | 'administration';

export type WorkspaceSection =
  | 'overview'
  | 'intelligence'
  | 'lyrics'
  | 'assets'
  | 'versions'
  | 'metadata'
  | 'publishing';

export type ServiceState = 'checking' | 'online' | 'degraded' | 'offline';
export type StudioReadSource = 'private' | 'public';

export interface ServiceStatus {
  state: ServiceState;
  label: string;
  detail: string;
}

export interface StudioAsset {
  originalName?: string | null;
  filename: string;
  contentType?: string | null;
  size?: number | null;
  uploaded?: string | null;
  url: string;
  fullUrl?: string | null;
  optimized?: boolean;
  etag?: string | null;
}

export interface SonicTraceSourceVersion {
  kind: string;
  value: string;
  sizeBytes: number;
  filename?: string | null;
  uploadedAt?: string | null;
}

export interface SonicTraceEmbedding {
  model: string;
  dimension: 512;
  vector: number[];
}

export interface SonicTraceAnalysis {
  schemaVersion: 1;
  analysisId: string;
  trackId: string;
  sourceVersion: SonicTraceSourceVersion;
  analyzedAt: string;
  engineVersion: Record<string, unknown>;
  dsp: Record<string, unknown> | null;
  mastering: Record<string, unknown> | null;
  neural: Record<string, unknown> | null;
  embedding: SonicTraceEmbedding | null;
  structure: Record<string, unknown> | null;
  semanticSummary: Record<string, unknown> | null;
  stemsSummary: Record<string, unknown> | null;
  provenance: Record<string, unknown>;
  warnings: string[];
  privacy: { audioStored: false; temporaryProcessingOnly: true };
}

export interface SonicTraceAnalysisState {
  ok?: boolean;
  trackId: string;
  latest: SonicTraceAnalysis | null;
  history: SonicTraceAnalysis[];
  currentSourceVersion: SonicTraceSourceVersion | null;
  outdated: boolean;
}

export interface SonicTraceCatalogEntry {
  trackId: string;
  title: string;
  analysisId: string;
  analyzedAt: string;
  sourceVersion: SonicTraceSourceVersion;
  currentSourceVersion: SonicTraceSourceVersion | null;
  outdated: boolean;
  embedding: SonicTraceEmbedding | null;
  semanticSummary: Record<string, unknown> | null;
  mastering: Record<string, unknown> | null;
  structure: Record<string, unknown> | null;
}

export interface StudioTrackQuality {
  state: string | null;
  publishable: boolean | null;
  counts: {
    error: number;
    warning: number;
    info: number;
  } | null;
  timestampsAvailable: boolean;
  lyricsStatus: 'missing' | 'invalid' | 'unsynced' | 'synced' | null;
}

export interface StudioTrack {
  id: string;
  title: string;
  status: string;
  type: string;
  year: number | null;
  releaseDate: string | null;
  album: { id: string; title: string };
  genres: string[];
  tags: string[];
  moods: string[];
  themes: string[];
  era: string | null;
  energy: string | null;
  languages: string[];
  bpm: number | null;
  key: string | null;
  keyConfidence: number | null;
  explicit: boolean | null;
  duration: number | null;
  accent: string | null;
  accent2: string | null;
  lyricsAvailable: boolean;
  timestampsAvailable: boolean;
  readSource: StudioReadSource;
  quality: StudioTrackQuality | null;
  assets: {
    audio: StudioAsset | null;
    cover: StudioAsset | null;
    thumbnail: StudioAsset | null;
    video: StudioAsset | null;
    lyricsTxt: StudioAsset | null;
    lyricsLrc: StudioAsset | null;
  };
  audioIntelligence: {
    available: boolean;
    outdated: boolean;
    latestAnalysisId: string | null;
  };
  publishing: {
    catalogVisible: boolean;
    publishable: boolean | null;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export interface StudioLyricSegment {
  time: number;
  text: string;
}

export interface StudioTrackDetail extends StudioTrack {
  lyricsRaw: string | null;
  lyricSegments: StudioLyricSegment[];
}
