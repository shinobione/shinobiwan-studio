import { useEffect, useMemo, useState } from 'react';
import { routeHref } from '../router';
import { getCatalogTrack } from '../services/catalog-api';
import type { StudioTrackDetail } from '../types/studio';

function displayDate(value: string | null, year: number | null): string {
  if (value) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(parsed);
    }
  }
  return year ? String(year) : 'Unknown';
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '—';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function fullArtwork(track: StudioTrackDetail): string | null {
  return track.assets.cover?.fullUrl || track.assets.cover?.url || track.assets.thumbnail?.url || null;
}

export function TrackReadView({ trackId }: { trackId: string }) {
  const [track, setTrack] = useState<StudioTrackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setTrack(null);
    getCatalogTrack(trackId)
      .then(item => {
        if (!active) return;
        setTrack(item);
        setError(null);
      })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [trackId]);

  const lyricPreview = useMemo(() => {
    if (!track?.lyricsRaw) return [];
    return track.lyricsRaw
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 8);
  }, [track]);

  if (loading) return <div className="catalog-message panel">Loading track…</div>;

  if (error || !track) {
    return (
      <section className="track-read-error panel">
        <span className="eyebrow">TRACK / READ ERROR</span>
        <h2>Track unavailable.</h2>
        <p>{error || 'The public catalog did not return this track.'}</p>
        <a className="ghost-btn" href={routeHref('catalog')}>← Back to catalog</a>
      </section>
    );
  }

  const artwork = fullArtwork(track);

  return (
    <section className="track-read-view">
      <a className="catalog-back" href={routeHref('catalog')}>← Catalog</a>

      <div className="track-read-hero panel">
        <div className="track-read-artwork">
          {artwork
            ? <img src={artwork} alt={`${track.title} cover`} />
            : <span>{track.title.slice(0, 2).toUpperCase()}</span>}
        </div>

        <div className="track-read-copy">
          <span className="eyebrow">TRACK / {track.id}</span>
          <h2>{track.title}</h2>
          <p className="track-album">{track.album.title}</p>
          <div className="catalog-tags track-tags">
            {(track.genres.length ? track.genres : ['Unclassified']).slice(0, 5).map(tag => <span key={tag}>{tag}</span>)}
          </div>

          <div className="track-read-facts">
            <div><span>Release</span><strong>{displayDate(track.releaseDate, track.year)}</strong></div>
            <div><span>BPM</span><strong>{track.bpm ?? '—'}</strong></div>
            <div><span>Key</span><strong>{track.key || '—'}</strong></div>
            <div><span>Duration</span><strong>{formatDuration(track.duration)}</strong></div>
            <div><span>Language</span><strong>{track.languages.join(', ') || '—'}</strong></div>
            <div><span>Status</span><strong>{track.status}</strong></div>
          </div>

          {track.assets.audio && (
            <audio className="track-audio" controls preload="metadata" src={track.assets.audio.url}>
              Your browser does not support audio playback.
            </audio>
          )}
        </div>
      </div>

      <div className="track-read-grid">
        <article className="panel track-read-panel">
          <span className="eyebrow">ASSETS / READ ONLY</span>
          <h3>Canonical assets</h3>
          <div className="asset-read-list">
            <div><span>Audio</span><strong className={track.assets.audio ? 'ok' : 'missing'}>{track.assets.audio ? 'Available' : 'Missing'}</strong></div>
            <div><span>Cover</span><strong className={track.assets.cover ? 'ok' : 'missing'}>{track.assets.cover ? 'Available' : 'Missing'}</strong></div>
            <div><span>Thumbnail</span><strong className={track.assets.thumbnail ? 'ok' : 'missing'}>{track.assets.thumbnail ? 'Available' : 'Missing'}</strong></div>
            <div><span>Lyrics TXT</span><strong className={track.assets.lyricsTxt ? 'ok' : 'missing'}>{track.assets.lyricsTxt ? 'Available' : 'Missing'}</strong></div>
            <div><span>Timestamped</span><strong className={track.timestampsAvailable ? 'ok' : 'missing'}>{track.timestampsAvailable ? 'Detected' : 'No'}</strong></div>
            <div><span>Video / Canvas</span><strong className={track.assets.video ? 'ok' : 'missing'}>{track.assets.video ? 'Available' : 'Missing'}</strong></div>
          </div>
        </article>

        <article className="panel track-read-panel">
          <span className="eyebrow">METADATA / PUBLIC VIEW</span>
          <h3>Track metadata</h3>
          <dl className="metadata-read-list">
            <div><dt>Type</dt><dd>{track.type}</dd></div>
            <div><dt>Moods</dt><dd>{track.moods.join(', ') || '—'}</dd></div>
            <div><dt>Themes</dt><dd>{track.themes.join(', ') || '—'}</dd></div>
            <div><dt>Era</dt><dd>{track.era || '—'}</dd></div>
            <div><dt>Energy</dt><dd>{track.energy || '—'}</dd></div>
            <div><dt>Explicit</dt><dd>{track.explicit == null ? '—' : track.explicit ? 'Yes' : 'No'}</dd></div>
          </dl>
        </article>

        <article className="panel track-read-panel track-lyrics-preview">
          <span className="eyebrow">LYRICS / PREVIEW</span>
          <h3>{track.assets.lyricsTxt ? 'Lyrics available' : 'No lyrics in catalog'}</h3>
          {lyricPreview.length ? (
            <div className="lyrics-preview-lines">
              {lyricPreview.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
            </div>
          ) : (
            <p className="track-read-muted">The detailed public endpoint returned no lyric text.</p>
          )}
        </article>
      </div>
    </section>
  );
}
