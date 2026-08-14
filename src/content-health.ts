import { buildCatalogWorkflow, type TrackWorkflowState } from './phase7-workflow';
import type { StudioTrack, WorkspaceSection } from './types/studio';

export type HealthState = 'complete' | 'partial' | 'missing';

export interface ContentHealthItem {
  id: 'audio' | 'cover' | 'metadata' | 'lyricsTxt' | 'syncedLyrics' | 'sonicTrace';
  label: string;
  score: number;
  max: number;
  state: HealthState;
  detail: string;
}

export interface ContentHealth {
  total: number;
  max: 100;
  items: ContentHealthItem[];
}

export type CatalogHealthSignalId =
  | 'audio'
  | 'cover'
  | 'lyricsTxt'
  | 'syncedLyrics'
  | 'sonicTrace'
  | 'releaseQuality';

export type CatalogHealthDrilldownId =
  | CatalogHealthSignalId
  | 'publishedProductionGaps'
  | 'productionReadyDrafts';

export interface CatalogHealthAction {
  trackId: string;
  trackTitle: string;
  label: string;
  section: WorkspaceSection;
}

export interface CatalogHealthSignal {
  id: CatalogHealthSignalId;
  label: string;
  count: number;
  detail: string;
  action: CatalogHealthAction | null;
}

export interface CatalogContentHealth {
  totalTracks: number;
  productionReady: number;
  productionAttention: number;
  published: number;
  drafts: number;
  publishedProductionGaps: number;
  productionReadyDrafts: number;
  signals: CatalogHealthSignal[];
}

function item(
  id: ContentHealthItem['id'],
  label: string,
  score: number,
  max: number,
  detail: string,
): ContentHealthItem {
  return {
    id,
    label,
    score,
    max,
    state: score >= max ? 'complete' : score > 0 ? 'partial' : 'missing',
    detail,
  };
}

function identityChecks(track: StudioTrack): boolean[] {
  return [
    Boolean(track.title.trim()),
    Boolean(track.type.trim()),
    Boolean(track.status.trim()),
    Boolean(track.album?.id && track.album?.title),
    track.year == null || (track.year >= 1900 && track.year <= 2200),
  ];
}

export function computeContentHealth(track: StudioTrack): ContentHealth {
  const metadataChecks = identityChecks(track);
  const metadataScore = metadataChecks.filter(Boolean).length * 4;
  const syncedLyrics = track.timestampsAvailable;
  const syncedLyricsDetail = syncedLyrics
    ? 'Timestamped lyrics detected in the canonical lyrics source'
    : 'No synchronized timestamp data detected in canonical lyrics.txt';
  const sonicTraceScore = track.audioIntelligence.available ? track.audioIntelligence.outdated ? 10 : 20 : 0;
  const sonicTraceDetail = track.audioIntelligence.available
    ? track.audioIntelligence.outdated ? 'Saved analysis is outdated because canonical audio changed' : 'Catalog-linked analysis is current'
    : 'Catalog-linked analysis not saved yet';

  // Build 70 contract preserved: production readiness deliberately excludes publication state.
  // Phase 8 / Build 74: production readiness follows the accepted Build73 truth.
  // Canvas is optional and therefore contributes no score and no attention item.
  // The 100-point production score is intentionally independent from publication:
  // Identity 20 + Core media 40 + Lyrics 20 + Intelligence 20.
  const items: ContentHealthItem[] = [
    item('audio', 'Audio', track.assets.audio ? 20 : 0, 20, track.assets.audio ? 'Canonical audio available' : 'Canonical audio missing'),
    item('cover', 'Cover', track.assets.cover ? 20 : 0, 20, track.assets.cover ? 'Required cover available' : 'Required cover missing'),
    item('metadata', 'Identity', metadataScore, 20, `${metadataChecks.filter(Boolean).length}/5 workflow identity checks complete`),
    item('lyricsTxt', 'Lyrics TXT', track.assets.lyricsTxt ? 10 : 0, 10, track.assets.lyricsTxt ? 'Canonical lyrics source available' : 'Canonical lyrics source missing'),
    item('syncedLyrics', 'Synced Lyrics', syncedLyrics ? 10 : 0, 10, syncedLyricsDetail),
    item('sonicTrace', 'SonicTrace', sonicTraceScore, 20, sonicTraceDetail),
  ];

  return {
    total: items.reduce((sum, current) => sum + current.score, 0),
    max: 100,
    items,
  };
}

export function isProductionWorkflowReady(item: TrackWorkflowState): boolean {
  return item.stages
    .filter(stage => stage.id !== 'release')
    .every(stage => stage.state === 'ready');
}

export function catalogHealthDrilldownMatches(item: TrackWorkflowState, drilldown: CatalogHealthDrilldownId): boolean {
  if (drilldown === 'audio') return !item.track.assets.audio;
  if (drilldown === 'cover') return !item.track.assets.cover;
  if (drilldown === 'lyricsTxt') return !item.track.assets.lyricsTxt;
  if (drilldown === 'syncedLyrics') return Boolean(item.track.assets.lyricsTxt) && !item.track.timestampsAvailable;
  if (drilldown === 'sonicTrace') return !item.track.audioIntelligence.available || item.track.audioIntelligence.outdated;
  if (drilldown === 'releaseQuality') return (item.track.quality?.counts?.error || 0) > 0 || item.track.publishing.publishable === false;
  if (drilldown === 'publishedProductionGaps') {
    return item.track.status === 'published' && item.track.publishing.catalogVisible && !isProductionWorkflowReady(item);
  }
  return item.track.status !== 'published' && isProductionWorkflowReady(item);
}

export function catalogHealthDrilldownLabel(drilldown: CatalogHealthDrilldownId): string {
  if (drilldown === 'audio') return 'Master audio missing';
  if (drilldown === 'cover') return 'Cover missing';
  if (drilldown === 'lyricsTxt') return 'Lyrics source missing';
  if (drilldown === 'syncedLyrics') return 'Lyrics timing needed';
  if (drilldown === 'sonicTrace') return 'SonicTrace gap';
  if (drilldown === 'releaseQuality') return 'Release blockers';
  if (drilldown === 'publishedProductionGaps') return 'Published with production gaps';
  return 'Production-ready drafts';
}

function actionFor(item: TrackWorkflowState | undefined): CatalogHealthAction | null {
  if (!item) return null;
  return {
    trackId: item.track.id,
    trackTitle: item.track.title,
    label: item.nextAction.label,
    section: item.nextAction.section,
  };
}

function signal(
  id: CatalogHealthSignalId,
  label: string,
  detail: string,
  items: TrackWorkflowState[],
): CatalogHealthSignal {
  const affected = items.filter(item => catalogHealthDrilldownMatches(item, id));
  return {
    id,
    label,
    count: affected.length,
    detail,
    action: actionFor(affected[0]),
  };
}

export function buildCatalogContentHealth(tracks: StudioTrack[]): CatalogContentHealth {
  const workflow = buildCatalogWorkflow(tracks);
  const productionReadyItems = workflow.filter(isProductionWorkflowReady);
  const productionAttentionItems = workflow.filter(item => !isProductionWorkflowReady(item));
  const publishedItems = workflow.filter(item => item.track.status === 'published' && item.track.publishing.catalogVisible);
  const draftItems = workflow.filter(item => item.track.status !== 'published');

  return {
    totalTracks: workflow.length,
    productionReady: productionReadyItems.length,
    productionAttention: productionAttentionItems.length,
    published: publishedItems.length,
    drafts: draftItems.length,
    publishedProductionGaps: publishedItems.filter(item => catalogHealthDrilldownMatches(item, 'publishedProductionGaps')).length,
    productionReadyDrafts: draftItems.filter(item => catalogHealthDrilldownMatches(item, 'productionReadyDrafts')).length,
    signals: [
      signal('audio', 'Master audio missing', 'Canonical master audio is required.', workflow),
      signal('cover', 'Cover missing', 'Canonical Cover is required; Canvas remains optional.', workflow),
      signal('lyricsTxt', 'Lyrics source missing', 'Canonical lyrics.txt has not been added yet.', workflow),
      signal('syncedLyrics', 'Lyrics timing needed', 'lyrics.txt exists but recognized timestamps are missing.', workflow),
      signal('sonicTrace', 'SonicTrace gap', 'Analysis is missing or outdated against the current canonical audio.', workflow),
      signal('releaseQuality', 'Release blockers', 'Track Manager quality currently blocks the Release stage.', workflow),
    ],
  };
}
