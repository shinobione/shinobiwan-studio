import { isProductionWorkflowReady } from './content-health';
import { buildCatalogWorkflow } from './phase7-workflow';
import type { AdminAlbumSummary } from './services/album-admin-api';
import type { StudioTrack, WorkspaceSection } from './types/studio';

export type AlbumHealthState = 'healthy' | 'attention' | 'unverified';

export interface AlbumHealthTrackAction {
  trackId: string;
  trackTitle: string;
  label: string;
  section: WorkspaceSection;
}

export interface AlbumHealth {
  albumId: string;
  albumTitle: string;
  state: AlbumHealthState;
  issueCount: number;
  canonicalTrackCount: number;
  coverMissing: boolean;
  emptyTracklist: boolean;
  crossModelVerified: boolean;
  missingTrackIds: string[];
  productionGapActions: AlbumHealthTrackAction[];
  cacheDriftTrackIds: string[];
}

export interface CatalogAlbumHealth {
  totalAlbums: number;
  healthyAlbums: number;
  attentionAlbums: number;
  unverifiedAlbums: number;
  crossModelVerified: boolean;
  albums: AlbumHealth[];
}

function albumCoverPresent(album: AdminAlbumSummary): boolean {
  return album.assetState?.cover?.present === true || Boolean(album.assets?.cover);
}

function actionFor(trackId: string, workflowById: Map<string, ReturnType<typeof buildCatalogWorkflow>[number]>): AlbumHealthTrackAction | null {
  const item = workflowById.get(trackId);
  if (!item) return null;
  return {
    trackId,
    trackTitle: item.track.title,
    label: item.nextAction.label,
    section: item.nextAction.section,
  };
}

export function buildCatalogAlbumHealth(albums: AdminAlbumSummary[], tracks: StudioTrack[]): CatalogAlbumHealth {
  // Cross-model Album integrity is only asserted from the protected Track catalog.
  // A public fallback can omit drafts/private state, so it must never manufacture
  // broken references or compatibility-cache drift.
  const crossModelVerified = tracks.length > 0 && tracks.every(track => track.readSource === 'private');
  const trackById = new Map(tracks.map(track => [track.id, track]));
  const workflow = buildCatalogWorkflow(tracks);
  const workflowById = new Map(workflow.map(item => [item.track.id, item]));

  const health = albums.map(album => {
    // Canonical Album membership authority is album.trackIds. track.album is compatibility cache only.
    const canonicalIds = [...album.trackIds];
    const canonicalSet = new Set(canonicalIds);
    const coverMissing = !albumCoverPresent(album);
    const emptyTracklist = canonicalIds.length === 0;
    const missingTrackIds: string[] = [];
    const productionGapActions: AlbumHealthTrackAction[] = [];
    const cacheDrift = new Set<string>();

    if (crossModelVerified) {
      for (const trackId of canonicalIds) {
        const track = trackById.get(trackId);
        if (!track) {
          missingTrackIds.push(trackId);
          continue;
        }

        if (track.album.id !== album.id) cacheDrift.add(trackId);
        const item = workflowById.get(trackId);
        if (item && !isProductionWorkflowReady(item)) {
          const action = actionFor(trackId, workflowById);
          if (action) productionGapActions.push(action);
        }
      }

      // Reverse cache drift: a track claims this Album in its compatibility cache,
      // but canonical album.trackIds does not own it.
      for (const track of tracks) {
        if (track.album.id === album.id && !canonicalSet.has(track.id)) cacheDrift.add(track.id);
      }
    }

    const cacheDriftTrackIds = [...cacheDrift].sort();
    const issueCount = Number(coverMissing)
      + Number(emptyTracklist)
      + missingTrackIds.length
      + productionGapActions.length
      + cacheDriftTrackIds.length;
    const state: AlbumHealthState = issueCount > 0 ? 'attention' : crossModelVerified ? 'healthy' : 'unverified';

    return {
      albumId: album.id,
      albumTitle: album.title,
      state,
      issueCount,
      canonicalTrackCount: canonicalIds.length,
      coverMissing,
      emptyTracklist,
      crossModelVerified,
      missingTrackIds,
      productionGapActions,
      cacheDriftTrackIds,
    } satisfies AlbumHealth;
  });

  return {
    totalAlbums: health.length,
    healthyAlbums: health.filter(album => album.state === 'healthy').length,
    attentionAlbums: health.filter(album => album.state === 'attention').length,
    unverifiedAlbums: health.filter(album => !album.crossModelVerified).length,
    crossModelVerified,
    albums: health,
  };
}
