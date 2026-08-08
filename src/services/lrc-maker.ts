import { trackHref } from '../router';
import { studioConfig } from './config';

const TRACK_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,119}$/;

export function contextualLrcMakerUrl(trackId: string): string {
  if (!TRACK_ID_PATTERN.test(trackId)) throw new Error('Invalid canonical trackId.');
  const url = new URL(studioConfig.lrcMakerUrl);
  const returnPath = `${globalThis.location.pathname}${globalThis.location.search}${trackHref(trackId, 'lyrics')}`;
  url.searchParams.set('studio', 'lyrics-v1');
  url.searchParams.set('trackId', trackId);
  url.searchParams.set('returnPath', returnPath);
  url.hash = '#/synchronizer/';
  return url.toString();
}

export function openContextualLrcMaker(trackId: string): Window | null {
  return globalThis.open(contextualLrcMakerUrl(trackId), `shinobiwan-lyrics-${trackId}`);
}

export const lrcMakerIntegration = Object.freeze({
  contextVersion: 'lyrics-v1',
  queryFields: ['studio', 'trackId', 'returnPath'] as const,
  carriesAudioOrLyricsInUrl: false,
  canonicalFilename: 'lyrics.txt',
  separateLrcRequired: false,
});
