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
