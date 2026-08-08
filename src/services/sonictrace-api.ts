import { studioConfig } from './config';
import { fetchJson } from './http';

interface SonicTraceHealth {
  status?: string;
  service?: string;
  version?: string;
  node_name?: string;
  gpu_ready?: boolean;
}

export async function getSonicTraceHealth(): Promise<SonicTraceHealth> {
  return fetchJson<SonicTraceHealth>(`${studioConfig.sonicTraceApi.replace(/\/$/, '')}/api/live`, 1800);
}
