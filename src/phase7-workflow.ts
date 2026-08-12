import type { StudioTrack, WorkspaceSection } from './types/studio';

export type WorkflowStageId = 'identity' | 'media' | 'lyrics' | 'intelligence' | 'release';
export type WorkflowStageState = 'ready' | 'attention' | 'blocked';

export interface WorkflowStage {
  id: WorkflowStageId;
  label: string;
  state: WorkflowStageState;
  detail: string;
  section: WorkspaceSection;
}

export interface WorkflowNextAction {
  label: string;
  detail: string;
  section: WorkspaceSection;
}

export interface TrackWorkflowState {
  track: StudioTrack;
  stages: WorkflowStage[];
  ready: boolean;
  blocked: boolean;
  attentionCount: number;
  nextAction: WorkflowNextAction;
}

function qualityErrorCount(track: StudioTrack): number {
  return track.quality?.counts?.error || 0;
}

function identityStage(track: StudioTrack): WorkflowStage {
  const missing: string[] = [];
  if (!track.title.trim()) missing.push('title');
  if (!track.type.trim()) missing.push('type');
  if (!track.status.trim()) missing.push('status');
  if (!track.album?.id || !track.album?.title) missing.push('release binding');

  if (missing.length) {
    return {
      id: 'identity',
      label: 'Identity',
      state: 'blocked',
      detail: `Missing ${missing.join(', ')}`,
      section: 'metadata',
    };
  }

  const errors = qualityErrorCount(track);
  if (errors > 0) {
    return {
      id: 'identity',
      label: 'Identity',
      state: 'attention',
      detail: `${errors} canonical quality error${errors === 1 ? '' : 's'}`,
      section: 'metadata',
    };
  }

  return {
    id: 'identity',
    label: 'Identity',
    state: 'ready',
    detail: `${track.album.title} · ${track.status}`,
    section: 'metadata',
  };
}

function mediaStage(track: StudioTrack): WorkflowStage {
  const missing: string[] = [];
  if (!track.assets.audio) missing.push('audio');
  if (!track.assets.cover) missing.push('cover');

  if (missing.includes('audio')) {
    return {
      id: 'media',
      label: 'Core media',
      state: 'blocked',
      detail: `Missing ${missing.join(' + ')}`,
      section: 'assets',
    };
  }

  if (missing.length) {
    return {
      id: 'media',
      label: 'Core media',
      state: 'attention',
      detail: `Missing ${missing.join(' + ')}`,
      section: 'assets',
    };
  }

  return {
    id: 'media',
    label: 'Core media',
    state: 'ready',
    detail: track.assets.video ? 'Audio · cover · Canvas' : 'Audio · cover',
    section: 'assets',
  };
}

function lyricsStage(track: StudioTrack): WorkflowStage {
  if (!track.assets.lyricsTxt) {
    return {
      id: 'lyrics',
      label: 'Lyrics',
      state: 'attention',
      detail: 'lyrics.txt missing',
      section: 'lyrics',
    };
  }

  if (!track.timestampsAvailable) {
    return {
      id: 'lyrics',
      label: 'Lyrics',
      state: 'attention',
      detail: 'TXT ready · timing missing',
      section: 'lyrics',
    };
  }

  return {
    id: 'lyrics',
    label: 'Lyrics',
    state: 'ready',
    detail: 'Canonical TXT · synchronized',
    section: 'lyrics',
  };
}

function intelligenceStage(track: StudioTrack): WorkflowStage {
  if (!track.audioIntelligence.available) {
    return {
      id: 'intelligence',
      label: 'Intelligence',
      state: 'attention',
      detail: 'SonicTrace analysis missing',
      section: 'intelligence',
    };
  }

  if (track.audioIntelligence.outdated) {
    return {
      id: 'intelligence',
      label: 'Intelligence',
      state: 'attention',
      detail: 'Analysis outdated',
      section: 'intelligence',
    };
  }

  return {
    id: 'intelligence',
    label: 'Intelligence',
    state: 'ready',
    detail: 'Current SonicTrace profile',
    section: 'intelligence',
  };
}

function releaseStage(track: StudioTrack): WorkflowStage {
  const errors = qualityErrorCount(track);
  if (errors > 0 || track.publishing.publishable === false) {
    return {
      id: 'release',
      label: 'Release',
      state: 'blocked',
      detail: errors > 0
        ? `${errors} quality error${errors === 1 ? '' : 's'} block release`
        : 'Canonical quality gate blocks release',
      section: 'publishing',
    };
  }

  if (track.status === 'published') {
    if (!track.publishing.catalogVisible) {
      return {
        id: 'release',
        label: 'Release',
        state: 'blocked',
        detail: 'Published status · missing public projection',
        section: 'publishing',
      };
    }
    return {
      id: 'release',
      label: 'Release',
      state: 'ready',
      detail: 'Published · catalog visible',
      section: 'publishing',
    };
  }

  if (track.publishing.publishable === true) {
    return {
      id: 'release',
      label: 'Release',
      state: 'ready',
      detail: `${track.status || 'draft'} · quality gate ready`,
      section: 'publishing',
    };
  }

  return {
    id: 'release',
    label: 'Release',
    state: 'attention',
    detail: `${track.status || 'draft'} · readiness not confirmed`,
    section: 'publishing',
  };
}

function actionFor(stages: WorkflowStage[], track: StudioTrack): WorkflowNextAction {
  const priority: WorkflowStageId[] = ['identity', 'media', 'lyrics', 'intelligence', 'release'];
  const target = priority
    .map(id => stages.find(stage => stage.id === id))
    .find(stage => stage && stage.state !== 'ready');

  if (target) {
    return {
      label: target.state === 'blocked' ? `Fix ${target.label}` : `Continue ${target.label}`,
      detail: target.detail,
      section: target.section,
    };
  }

  if (track.status !== 'published') {
    return {
      label: 'Review release',
      detail: 'Production workflow is complete; review publishing state.',
      section: 'publishing',
    };
  }

  return {
    label: 'Open workspace',
    detail: 'All current workflow stages are ready.',
    section: 'overview',
  };
}

export function buildTrackWorkflow(track: StudioTrack): TrackWorkflowState {
  const stages = [
    identityStage(track),
    mediaStage(track),
    lyricsStage(track),
    intelligenceStage(track),
    releaseStage(track),
  ];
  const blocked = stages.some(stage => stage.state === 'blocked');
  const attentionCount = stages.filter(stage => stage.state !== 'ready').length;
  return {
    track,
    stages,
    ready: attentionCount === 0,
    blocked,
    attentionCount,
    nextAction: actionFor(stages, track),
  };
}

export function buildCatalogWorkflow(tracks: StudioTrack[]): TrackWorkflowState[] {
  return tracks
    .map(buildTrackWorkflow)
    .sort((left, right) => {
      if (left.blocked !== right.blocked) return left.blocked ? -1 : 1;
      if (left.ready !== right.ready) return left.ready ? 1 : -1;
      if (left.attentionCount !== right.attentionCount) return right.attentionCount - left.attentionCount;
      return left.track.title.localeCompare(right.track.title, 'en', { sensitivity: 'base' });
    });
}
