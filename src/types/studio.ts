export type StudioRoute =
  | 'dashboard'
  | 'catalog'
  | 'intelligence'
  | 'lyrics'
  | 'assets'
  | 'publishing'
  | 'administration';

export type ServiceState = 'checking' | 'online' | 'degraded' | 'offline';

export interface ServiceStatus {
  state: ServiceState;
  label: string;
  detail: string;
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
  languages: string[];
  bpm: number | null;
  key: string | null;
  keyConfidence: number | null;
  explicit: boolean | null;
  duration: number | null;
  accent: string | null;
  accent2: string | null;
  assets: {
    audio: unknown | null;
    cover: unknown | null;
    thumbnail: unknown | null;
    video: unknown | null;
    lyricsTxt: unknown | null;
    lyricsLrc: unknown | null;
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
