import { createElement, useEffect, useRef, useState } from 'react';
import { contextualLrcMakerUrl } from '../services/lrc-maker';
import { studioConfig } from '../services/config';

const EMBED_TAG = 'shinobiwan-lyrics-studio';
const EMBED_VERSION = '6.3.5';
let embedLoader: Promise<void> | null = null;

function embedScriptUrl(): string {
  const base = new URL(studioConfig.lrcMakerUrl);
  base.pathname = `${base.pathname.replace(/\/?$/, '/')}embed/lyrics-studio.js`;
  base.searchParams.set('v', EMBED_VERSION);
  return base.toString();
}

function loadEmbedBundle(): Promise<void> {
  if (customElements.get(EMBED_TAG)) return Promise.resolve();
  if (embedLoader) return embedLoader;

  embedLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-shinobiwan-lyrics-embed]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Embedded LRC Maker bundle failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = embedScriptUrl();
    script.async = true;
    script.dataset.shinobiwanLyricsEmbed = EMBED_VERSION;
    script.addEventListener('load', () => {
      if (!customElements.get(EMBED_TAG)) {
        reject(new Error('LRC Maker loaded without registering the embedded Lyrics Studio element.'));
        return;
      }
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error('Embedded LRC Maker bundle failed to load.')), { once: true });
    document.head.append(script);
  }).catch(error => {
    embedLoader = null;
    throw error;
  });

  return embedLoader;
}

interface LyricsSavedEvent extends CustomEvent<{ trackId: string; updatedAt: string }> {}

export function EmbeddedLyricsStudio({ trackId, onSaved }: { trackId: string; onSaved: () => Promise<void> | void }) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setState('loading');
    setError(null);
    void loadEmbedBundle()
      .then(() => active && setState('ready'))
      .catch(reason => {
        if (!active) return;
        setState('error');
        setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const listener = (event: Event) => {
      const detail = (event as LyricsSavedEvent).detail;
      if (detail?.trackId !== trackId) return;
      void onSaved();
    };
    host.addEventListener('lyrics-saved', listener);
    return () => host.removeEventListener('lyrics-saved', listener);
  }, [onSaved, trackId]);

  return (
    <div className="workspace-lyrics-portal-card">
      <div className="workspace-lyrics-embed-head">
        <div>
          <span className="eyebrow">LYRICS STUDIO / EMBEDDED LRC ENGINE</span>
          <h3>Synchronize inside Studio</h3>
          <p>Canonical audio + lyrics.txt are injected by trackId. Saving still goes through the protected Track Manager Lyrics route.</p>
        </div>
        <a className="ghost-btn" href={contextualLrcMakerUrl(trackId)} target="_blank" rel="noreferrer">Open standalone fallback ↗</a>
      </div>

      {state === 'loading' && <div className="workspace-lyrics-embed-message">Loading LRC Maker engine…</div>}
      {state === 'error' && (
        <div className="lyrics-editor-error">
          <strong>EMBED LOAD ERROR</strong>
          <span>{error || 'LRC Maker embed is unavailable.'}</span>
        </div>
      )}

      {createElement(EMBED_TAG, {
        ref: (node: HTMLElement | null) => { hostRef.current = node; },
        'track-id': trackId,
        class: `workspace-lyrics-embed ${state === 'ready' ? 'ready' : ''}`,
      })}
    </div>
  );
}
