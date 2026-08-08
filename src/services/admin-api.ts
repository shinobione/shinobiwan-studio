import { studioConfig } from './config';

// Phase 1 intentionally exposes no browser write methods. The current private
// Track Manager Worker has a strict same-origin write contract; Phase 4 will
// introduce the reviewed authenticated Studio write path.
export const adminService = Object.freeze({
  fallbackUrl: studioConfig.trackManagerUrl,
  writesEnabled: false,
});
