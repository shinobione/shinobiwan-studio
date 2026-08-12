import { useEffect, useMemo, useRef, useState } from 'react';
import { studioConfig } from '../services/config';
import type { StudioTrackDetail } from '../types/studio';

const TTME_ORIGIN = 'https://shinobione.github.io';
const READY_MESSAGE = 'shinobiwan:track-to-market:ready';
const INPUT_MESSAGE = 'shinobiwan:track-to-market:input';
const PACK_MESSAGE = 'shinobiwan:track-to-market:pack';
const MAX_PREVIEW_DATA_URL = 2_500_000;

interface ReturnedFinalPack {
  version?: string;
  trackId: string;
  releaseStatus: 'final';
  artworkProvider?: string;
  artworkModel?: string;
  mode?: string;
  artworkStrategy?: 'integrated' | 'clean';
  brandingMode?: 'preserve' | 'logo-only' | 'editorial';
  previewDataUrl?: string;
  pack?: {
    coverPrompt?: string;
    soundcloudDescription?: string;
    tags?: string[];
    caption?: string;
  };
}

type BridgeState = 'idle' | 'waiting' | 'ready' | 'final-received' | 'error';

function compactAudioStyle(track: StudioTrackDetail) {
  return [
    track.genres.length ? `Genres: ${track.genres.join(', ')}` : '',
    track.bpm ? `Tempo: ${track.bpm} BPM` : '',
    track.key ? `Key: ${track.key}` : '',
    track.energy ? `Energy: ${track.energy}` : '',
    track.moods.length ? `Mood: ${track.moods.join(', ')}` : '',
  ].filter(Boolean).join('\n');
}

function compactVisualDirection(track: StudioTrackDetail) {
  return [
    track.moods.length ? `Mood: ${track.moods.join(', ')}` : '',
    track.themes.length ? `Themes: ${track.themes.join(', ')}` : '',
    track.era ? `Era: ${track.era}` : '',
    track.accent ? `Primary color: ${track.accent}` : '',
    track.accent2 ? `Secondary color: ${track.accent2}` : '',
  ].filter(Boolean).join('\n');
}

function validatedPreview(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('data:image/')) return undefined;
  if (value.length > MAX_PREVIEW_DATA_URL) return undefined;
  return value;
}

export function TrackToMarketPanel({ track }: { track: StudioTrackDetail }) {
  const childRef = useRef<Window | null>(null);
  const [bridgeState, setBridgeState] = useState<BridgeState>('idle');
  const [bridgeDetail, setBridgeDetail] = useState('Not opened yet.');
  const [lastFinal, setLastFinal] = useState<ReturnedFinalPack | null>(null);

  const input = useMemo(() => ({
    source: 'studio',
    trackId: track.id,
    title: track.title,
    genres: track.genres,
    audioStyle: compactAudioStyle(track),
    style: compactVisualDirection(track),
    lyrics: track.lyricsRaw || '',
    artworkStrategy: 'integrated' as const,
  }), [track]);

  const launchUrl = useMemo(() => {
    const url = new URL(studioConfig.trackToMarketUrl);
    url.searchParams.set('source', 'studio');
    url.searchParams.set('trackId', track.id);
    url.searchParams.set('title', track.title);
    if (track.genres.length) url.searchParams.set('genres', track.genres.join(','));
    return url.toString();
  }, [track]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== TTME_ORIGIN) return;
      const child = childRef.current;
      if (!child || event.source !== child) return;
      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data.type !== 'string') return;

      if (data.type === READY_MESSAGE) {
        child.postMessage({ type: INPUT_MESSAGE, version: '0.2.0', input }, TTME_ORIGIN);
        setBridgeState('ready');
        setBridgeDetail(`Bridge ${typeof data.version === 'string' ? data.version : 'ready'} · full track context sent.`);
        return;
      }

      if (data.type === PACK_MESSAGE) {
        if (data.trackId !== track.id) return;
        if (data.releaseStatus !== 'final') {
          setBridgeState('error');
          setBridgeDetail('Rejected non-FINAL Track-To-Market return. No canonical action taken.');
          return;
        }

        const artworkStrategy = data.artworkStrategy === 'integrated' || data.artworkStrategy === 'clean' ? data.artworkStrategy : undefined;
        const brandingMode = data.brandingMode === 'preserve' || data.brandingMode === 'logo-only' || data.brandingMode === 'editorial' ? data.brandingMode : undefined;
        setLastFinal({
          version: typeof data.version === 'string' ? data.version : undefined,
          trackId: track.id,
          releaseStatus: 'final',
          artworkProvider: typeof data.artworkProvider === 'string' ? data.artworkProvider : undefined,
          artworkModel: typeof data.artworkModel === 'string' ? data.artworkModel : undefined,
          mode: typeof data.mode === 'string' ? data.mode : undefined,
          artworkStrategy,
          brandingMode,
          previewDataUrl: validatedPreview(data.previewDataUrl),
          pack: data.pack && typeof data.pack === 'object' ? data.pack as ReturnedFinalPack['pack'] : undefined,
        });
        setBridgeState('final-received');
        setBridgeDetail('FINAL artwork + release pack returned for review. Build 47 still performs no R2 or Track Manager write.');
      }
    };

    globalThis.addEventListener('message', onMessage);
    return () => globalThis.removeEventListener('message', onMessage);
  }, [input, track.id]);

  const openTrackToMarket = () => {
    const child = globalThis.open(launchUrl, 'shinobiwan-track-to-market');
    if (!child) {
      setBridgeState('error');
      setBridgeDetail('Popup blocked. Allow popups for Studio, then retry.');
      return;
    }
    childRef.current = child;
    setBridgeState('waiting');
    setBridgeDetail('Track-To-Market opened. Waiting for Bridge V3 ready handshake…');
  };

  return <section className="ttm-workspace">
    <article className="panel ttm-hero">
      <div>
        <span className="eyebrow">RELEASE PACK / V0.2 ORCHESTRATOR</span>
        <h3>Track-To-Market</h3>
        <p>Open the standalone orchestrator with this canonical track context. TTM prepares the premium provider handoff, references, faithful FINAL import and release assets, then stages the actual selected artwork back here for review.</p>
      </div>
      <button className="primary-btn" type="button" onClick={openTrackToMarket}>Open Track-To-Market <span>↗</span></button>
    </article>

    <div className="ttm-grid">
      <article className="panel ttm-status-card">
        <span className="eyebrow">BRIDGE / STATUS</span>
        <div className={`ttm-state ttm-state-${bridgeState}`}><i /><strong>{bridgeState.replace('-', ' ')}</strong></div>
        <p>{bridgeDetail}</p>
        <dl>
          <div><dt>trackId</dt><dd>{track.id}</dd></div>
          <div><dt>Lyrics payload</dt><dd>{track.lyricsRaw ? `${track.lyricsRaw.length.toLocaleString()} chars via postMessage` : 'No canonical lyrics'}</dd></div>
          <div><dt>Target</dt><dd>Track-To-Market v0.2.0+</dd></div>
        </dl>
      </article>

      <article className="panel ttm-safety-card">
        <span className="eyebrow">BUILD 47 / SAFETY</span>
        <h3>Stage + review only</h3>
        <ul>
          <li>No R2 write from this panel.</li>
          <li>No Track Manager mutation API imported.</li>
          <li>DRAFT returns are rejected.</li>
          <li>Only matching FINAL trackId returns are accepted.</li>
          <li>Artwork preview is transient browser memory only.</li>
        </ul>
      </article>
    </div>

    <article className="panel ttm-context-card">
      <span className="eyebrow">CONTEXT / SENT TO ENGINE</span>
      <div className="ttm-context-grid">
        <div><span>Title</span><strong>{track.title}</strong></div>
        <div><span>Genres</span><strong>{track.genres.join(', ') || 'Unclassified'}</strong></div>
        <div><span>Mood</span><strong>{track.moods.join(', ') || '—'}</strong></div>
        <div><span>Theme</span><strong>{track.themes.join(', ') || '—'}</strong></div>
      </div>
    </article>

    {lastFinal && <article className="panel ttm-final-card">
      <div className="ttm-final-head"><div><span className="eyebrow">FINAL / STAGED FROM TTM</span><h3>Release pack received</h3></div><span className="ttm-final-badge">FINAL</span></div>
      <div className={`ttm-final-stage ${lastFinal.previewDataUrl ? 'has-preview' : ''}`}>
        {lastFinal.previewDataUrl && <div className="ttm-final-preview"><img src={lastFinal.previewDataUrl} alt={`${track.title} FINAL artwork staged from Track-To-Market`} /></div>}
        <div className="ttm-final-details">
          <div className="ttm-context-grid">
            <div><span>Provider</span><strong>{lastFinal.artworkProvider || 'external-ai'}</strong></div>
            <div><span>Source/model</span><strong>{lastFinal.artworkModel || 'Premium external import'}</strong></div>
            <div><span>Artwork</span><strong>{lastFinal.artworkStrategy || 'integrated'}</strong></div>
            <div><span>Brand treatment</span><strong>{lastFinal.brandingMode || 'preserve'}</strong></div>
          </div>
          <div className="ttm-context-grid ttm-context-grid-compact">
            <div><span>Mode</span><strong>{lastFinal.mode || 'quality-import'}</strong></div>
            <div><span>Bridge</span><strong>{lastFinal.version || '0.2.0'}</strong></div>
          </div>
          {lastFinal.pack?.soundcloudDescription && <div className="ttm-return-copy"><span>SoundCloud</span><p>{lastFinal.pack.soundcloudDescription}</p></div>}
          {lastFinal.pack?.caption && <div className="ttm-return-copy"><span>Social</span><p>{lastFinal.pack.caption}</p></div>}
        </div>
      </div>
      <p className="ttm-review-note">Staged preview only. The canonical cover, R2 objects and Track Manager manifest remain untouched until a later explicit guarded persistence action is designed and authorized.</p>
    </article>}
  </section>;
}
