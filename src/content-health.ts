import type { StudioTrack } from './types/studio';

export type HealthState = 'complete' | 'partial' | 'missing';

export interface ContentHealthItem {
  id: 'audio' | 'cover' | 'metadata' | 'lyricsTxt' | 'syncedLyrics' | 'sonicTrace' | 'video' | 'publication';
  label: string;
  score: number;
  max: number;
  state: HealthState;
  detail: string;
}

export interface ContentHealth {
  total: number;
  max: 100;
  items: ContentHealthItem[];
}

function item(
  id: ContentHealthItem['id'],
  label: string,
  score: number,
  max: number,
  detail: string,
): ContentHealthItem {
  return {
    id,
    label,
    score,
    max,
    state: score >= max ? 'complete' : score > 0 ? 'partial' : 'missing',
    detail,
  };
}

export function computeContentHealth(track: StudioTrack): ContentHealth {
  const metadataChecks = [
    Boolean(track.title.trim()),
    Boolean(track.album.title.trim()),
    track.genres.length > 0,
    track.languages.length > 0,
    Boolean(track.releaseDate || track.year),
  ];
  const metadataScore = metadataChecks.filter(Boolean).length * 3;
  const syncedLyrics = track.timestampsAvailable || Boolean(track.assets.lyricsLrc);
  const syncedLyricsDetail = track.timestampsAvailable
    ? 'Timestamped lyrics detected in the canonical lyrics source'
    : track.assets.lyricsLrc
      ? 'Synchronized lyrics available via optional LRC sidecar'
      : 'No synchronized timestamp data detected';
  const sonicTraceScore = track.audioIntelligence.available ? track.audioIntelligence.outdated ? 10 : 20 : 0;
  const sonicTraceDetail = track.audioIntelligence.available
    ? track.audioIntelligence.outdated ? 'Saved analysis is outdated because canonical audio changed' : 'Catalog-linked analysis is current'
    : 'Catalog-linked analysis not saved yet';

  const items: ContentHealthItem[] = [
    item('audio', 'Audio', track.assets.audio ? 15 : 0, 15, track.assets.audio ? 'Canonical audio available' : 'Canonical audio missing'),
    item('cover', 'Cover', track.assets.cover ? 10 : 0, 10, track.assets.cover ? 'Cover available' : 'Cover missing'),
    item('metadata', 'Metadata', metadataScore, 15, `${metadataChecks.filter(Boolean).length}/5 core metadata fields complete`),
    item('lyricsTxt', 'Lyrics TXT', track.assets.lyricsTxt ? 10 : 0, 10, track.assets.lyricsTxt ? 'Canonical lyrics source available' : 'Canonical lyrics source missing'),
    item('syncedLyrics', 'Synced Lyrics', syncedLyrics ? 10 : 0, 10, syncedLyricsDetail),
    item('sonicTrace', 'SonicTrace', sonicTraceScore, 20, sonicTraceDetail),
    item('video', 'Canvas / Video', track.assets.video ? 10 : 0, 10, track.assets.video ? 'Video asset available' : 'Video asset missing'),
    item('publication', 'Publication', track.publishing.catalogVisible ? 10 : 0, 10, track.publishing.catalogVisible ? 'Visible in public catalog' : 'Not visible in public catalog'),
  ];

  return {
    total: items.reduce((sum, current) => sum + current.score, 0),
    max: 100,
    items,
  };
}
