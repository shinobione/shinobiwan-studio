import { createElement, useEffect, useRef, useState } from 'react';
import { contextualLrcMakerUrl } from '../services/lrc-maker';
import { studioConfig } from '../services/config';
import type { StudioTrackDetail } from '../types/studio';

const EMBED_TAG = 'shinobiwan-lyrics-studio';
const EMBED_VERSION = '6.3.0';
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

export function EmbeddedLyricsStudio({ track, onSaved }: { track: StudioTrackDetail; onSaved: () => Promise<void> | void }) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const privateRead = track.readSource === 'private';
  const canSynchronize = privateRead && Boolean(track.assets.audio && track.assets.lyricsTxt);

  useEffect(() => {
    if (!canSynchronize) return;
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
  }, [canSynchronize]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const listener = (event: Event) => {
      const detail = (event as LyricsSavedEvent).detail;
      if (detail?.trackId !== track.id) return;
      void onSaved();
    };
    host.addEventListener('lyrics-saved', listener);
    return () => host.removeEventListener('lyrics-saved', listener);
  }, [onSaved, track.id]);

  if (!privateRead) {
    return (
      <article className="panel workspace-lyrics-embed-panel">
        <span className="eyebrow">LYRICS STUDIO / EMBEDDED</span>
        <h3>Synchronization locked</h3>
        <p className="workspace-muted">Authenticate with Track Manager to load canonical audio and lyrics into the embedded LRC Maker engine.</p>
      </article>
    );
  }

  if (!track.assets.audio || !track.assets.lyricsTxt) {
    return (
      <article className="panel workspace-lyrics-embed-panel">
        <span className="eyebrow">LYRICS STUDIO / EMBEDDED</span>
        <h3>Canonical inputs required</h3>
        <p className="workspace-muted">Audio and lyrics.txt must exist before the synchronization engine can start.</p>
      </article>
    );
  }

  return (
    <article className="panel workspace-lyrics-embed-panel">
      <div className="workspace-lyrics-embed-head">
        <div>
          <span className="eyebrow">LYRICS STUDIO / EMBEDDED LRC ENGINE</span>
          <h3>Synchronize inside Studio</h3>
          <p>Canonical audio + lyrics.txt are injected by trackId. Saving still goes through Track Manager v5.15 guards.</p>
        </div>
        <a className="ghost-btn" href={contextualLrcMakerUrl(track.id)} target="_blank" rel="noreferrer">Open standalone fallback ↗</a>
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
        'track-id': track.id,
        class: `workspace-lyrics-embed ${state === 'ready' ? 'ready' : ''}`,
      })}
    </article>
  );
}
