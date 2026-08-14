import { useEffect, useMemo, useState } from 'react';
import { catalogHealthDrilldownLabel, catalogHealthDrilldownMatches, type CatalogHealthDrilldownId } from '../content-health';
import { buildCatalogWorkflow, type TrackWorkflowState, type WorkflowStageState } from '../phase7-workflow';
import { readWorkflowHealthDrilldown, trackHref, workflowHref } from '../router';
import { getCatalogTracks } from '../services/catalog-api';
import type { StudioTrack } from '../types/studio';

type WorkflowFilter = 'attention' | 'all' | 'ready' | 'blocked' | 'drafts';

function artwork(track: StudioTrack): string | null {
  return track.assets.thumbnail?.url || track.assets.cover?.url || null;
}

function stageSymbol(state: WorkflowStageState): string {
  if (state === 'ready') return '✓';
  if (state === 'blocked') return '!';
  return '•';
}

function workflowMatches(item: TrackWorkflowState, filter: WorkflowFilter): boolean {
  if (filter === 'ready') return item.ready;
  if (filter === 'blocked') return item.blocked;
  if (filter === 'drafts') return item.track.status !== 'published';
  if (filter === 'attention') return !item.ready;
  return true;
}

export function WorkflowView() {
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [healthDrilldown, setHealthDrilldown] = useState<CatalogHealthDrilldownId | null>(() => readWorkflowHealthDrilldown());
  const [filter, setFilter] = useState<WorkflowFilter>(() => readWorkflowHealthDrilldown() ? 'all' : 'attention');

  useEffect(() => {
    const syncHealthDrilldown = () => {
      const next = readWorkflowHealthDrilldown();
      setHealthDrilldown(next);
      setFilter(next ? 'all' : 'attention');
    };
    globalThis.addEventListener('hashchange', syncHealthDrilldown);
    return () => globalThis.removeEventListener('hashchange', syncHealthDrilldown);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCatalogTracks()
      .then(items => {
        if (!active) return;
        setTracks(items);
        setError(null);
      })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const workflow = useMemo(() => buildCatalogWorkflow(tracks), [tracks]);
  const privateRead = tracks.some(track => track.readSource === 'private');
  const readyCount = workflow.filter(item => item.ready).length;
  const blockedCount = workflow.filter(item => item.blocked).length;
  const attentionCount = workflow.filter(item => !item.ready).length;
  const missingAnalysis = workflow.filter(item => item.track.audioIntelligence.available === false || item.track.audioIntelligence.outdated).length;
  const healthDrilldownCount = healthDrilldown
    ? workflow.filter(item => catalogHealthDrilldownMatches(item, healthDrilldown)).length
    : 0;

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return workflow
      .filter(item => !healthDrilldown || catalogHealthDrilldownMatches(item, healthDrilldown))
      .filter(item => workflowMatches(item, filter))
      .filter(item => {
        if (!normalized) return true;
        const track = item.track;
        return [track.title, track.album.title, track.status, ...track.genres, ...track.moods]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      });
  }, [filter, healthDrilldown, query, workflow]);

  return (
    <section className="phase7-workflow">
      <header className="phase7-workflow-heading">
        <div>
          <span className="eyebrow">PHASE 7 / END-TO-END WORKFLOW</span>
          <h2>One production queue. Clear next actions.</h2>
          <p>This first Phase 7 slice is read-only: every action deep-links to the existing guarded workspace that already owns that operation. Phase8 health drill-downs only filter this accepted queue; they never create another priority engine or write path.</p>
        </div>
        <div className="phase7-readonly-badge"><strong>READ ONLY</strong><span>{privateRead ? 'Private canonical read' : 'Public fallback read'}</span></div>
      </header>

      <div className="phase7-kpis" aria-label="Workflow summary">
        <article className="panel"><span>TRACKS</span><strong>{tracks.length}</strong><small>Canonical production items</small></article>
        <article className="panel is-ready"><span>WORKFLOW READY</span><strong>{readyCount}</strong><small>All current stages green</small></article>
        <article className="panel is-attention"><span>NEEDS ATTENTION</span><strong>{attentionCount}</strong><small>At least one incomplete stage</small></article>
        <article className="panel is-blocked"><span>BLOCKED</span><strong>{blockedCount}</strong><small>Core/release blocker</small></article>
        <article className="panel"><span>SONICTRACE GAP</span><strong>{missingAnalysis}</strong><small>Missing or outdated analysis</small></article>
      </div>

      {healthDrilldown && (
        <div className="phase8-health-drilldown panel" role="status">
          <div><span className="eyebrow">PHASE 8 / HEALTH DRILL-DOWN</span><strong>{catalogHealthDrilldownLabel(healthDrilldown)}</strong><small>{healthDrilldownCount} affected track{healthDrilldownCount === 1 ? '' : 's'} · same Workflow stages and accepted Next Actions</small></div>
          <a className="ghost-btn" href={workflowHref()}>Clear health filter ×</a>
        </div>
      )}

      <div className="phase7-workflow-toolbar panel">
        <label className="phase7-search"><span>Search</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Track, album, genre, mood…" /></label>
        <label><span>Queue</span><select value={filter} onChange={event => setFilter(event.target.value as WorkflowFilter)}><option value="attention">Needs attention</option><option value="blocked">Blocked</option><option value="drafts">Draft / unpublished</option><option value="ready">Workflow ready</option><option value="all">All tracks</option></select></label>
        <div className="phase7-policy"><span>Policy</span><strong>Identity → Media → Lyrics → Intelligence → Release</strong></div>
      </div>

      {loading && <div className="phase7-workflow-message panel" role="status">Reading canonical production state…</div>}
      {!loading && error && <div className="phase7-workflow-message phase7-error panel"><strong>Workflow read unavailable</strong><span>{error}</span></div>}

      {!loading && !error && (
        <>
          <div className="phase7-resultline"><span>{visible.length} of {workflow.length} tracks · {healthDrilldown ? `${catalogHealthDrilldownLabel(healthDrilldown)} · ` : ''}{privateRead ? 'private canonical' : 'public fallback'} · no writes</span></div>
          {visible.length === 0 ? <div className="phase7-workflow-message panel">No track matches this health drill-down and queue filter.</div> : (
            <div className="phase7-workflow-list">
              {visible.map(item => {
                const track = item.track;
                const image = artwork(track);
                return (
                  <article className={`phase7-track panel ${item.ready ? 'is-ready' : ''} ${item.blocked ? 'is-blocked' : ''}`} key={track.id}>
                    <div className="phase7-track-identity">
                      <div className="phase7-track-artwork">{image ? <img src={image} alt="" loading="lazy" /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}</div>
                      <div><span className="phase7-track-status">{track.status}</span><h3>{track.title}</h3><p>{track.album.title}</p></div>
                    </div>

                    <div className="phase7-stage-rail" aria-label={`${track.title} workflow stages`}>
                      {item.stages.map(stage => (
                        <a className={`phase7-stage state-${stage.state}`} key={stage.id} href={trackHref(track.id, stage.section)} title={stage.detail}>
                          <i aria-hidden="true">{stageSymbol(stage.state)}</i>
                          <span><strong>{stage.label}</strong><small>{stage.detail}</small></span>
                        </a>
                      ))}
                    </div>

                    <div className="phase7-next-action">
                      <span>NEXT ACTION</span>
                      <strong>{item.nextAction.label}</strong>
                      <small>{item.nextAction.detail}</small>
                      <a className={item.blocked ? 'primary-btn' : 'ghost-btn'} href={trackHref(track.id, item.nextAction.section)}>Open in workspace <span>→</span></a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <footer className="phase7-boundary panel">
        <span className="eyebrow">PHASE 7-A BOUNDARY</span>
        <strong>Orchestration without a second authority.</strong>
        <p>This page performs no Track Manager mutation, no R2 write, no Album reorder and no automatic publishing. It only reads existing canonical state and routes the user to the already-validated specialist surface for the next operation.</p>
      </footer>
    </section>
  );
}
