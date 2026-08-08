export const studioConfig = Object.freeze({
  catalogApi: import.meta.env.VITE_CATALOG_API || 'https://launchpad-media.jerryquinet.workers.dev',
  sonicTraceApi: import.meta.env.VITE_SONICTRACE_API || 'http://127.0.0.1:8000',
  trackManagerUrl: import.meta.env.VITE_TRACK_MANAGER_URL || 'https://launchpad-r2-api.jerryquinet.workers.dev/',
  lrcMakerUrl: import.meta.env.VITE_LRC_MAKER_URL || 'https://shinobione.github.io/lrc-maker/',
  sonicTraceUrl: import.meta.env.VITE_SONICTRACE_URL || 'https://shinobione.github.io/LM-IA-Analayse/',
  launchpadUrl: import.meta.env.VITE_LAUNCHPAD_URL || 'https://shinobione.github.io/LaunchPAD-APP/',
});
