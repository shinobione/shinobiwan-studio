import { studioConfig } from './config';
import { fetchJson } from './http';

interface PublicHealth {
  ok?: boolean;
  service?: string;
  version?: string | number;
  canonicalTracks?: number;
}

export async function getCatalogHealth(): Promise<PublicHealth> {
  return fetchJson<PublicHealth>(`${studioConfig.catalogApi.replace(/\/$/, '')}/health`);
}

// Phase 2 deliberately owns catalog loading. Keeping the service boundary here
// prevents views from coupling directly to LaunchPAD's public Worker contract.
