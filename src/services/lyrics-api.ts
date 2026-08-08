import { studioConfig } from './config';

export const lyricsService = Object.freeze({
  appUrl: studioConfig.lrcMakerUrl,
  mode: 'external-engine' as const,
});
