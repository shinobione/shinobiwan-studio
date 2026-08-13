import { useEffect, useMemo, useState } from 'react';
import { buildCatalogWorkflow, type TrackWorkflowState } from '../phase7-workflow';
import { routeHref, trackHref } from '../router';
import { getCatalogTracks } from '../services/catalog-api';
import type { StudioTrack, WorkspaceSection } from '../types/studio';
import { TrackCreatePanel } from './TrackCreatePanel';

const LAST_TRACK_KEY = 'shinobiwan-studio:last-track-id';

type FocusStep = 'track' | 'visuals' | 'lyrics' | 'sonic' | 'release';

function artwork(track: StudioTrack): string | null {
  return track.assets.thumbnail?.url || track.assets.cover?.url || null;
}

function artistSection(section: WorkspaceSection): WorkspaceSection {
  if (section === 'versions') return 'overview';
  if (section === 'assets') return 'assets';
  if (section === 'intelligence') return 'intelligence';
  if (section === 'publishing') return 'market';
  return section;
}

function actionLabel(item: TrackWorkflowState): string {
  const section = artistSection(item.nextAction.section);
  if (section === 'assets') return item.track.assets.cover ? 'Continue visuals' : 'Add cover';
  if (section === 'lyrics') return item.track.assets.lyricsTxt ? 'Synchronize lyrics' : 'Add lyrics';
  if (section === 'intelligence') return item.track.audioIntelligence.available ? 'Refresh SonicTrace' : 'Analyze with SonicTrace';
  if (section === 'market') return 'Prepare release';
  return item.blocked ? 'Fix track details' : 'Continue track';
}

function productionStep(track: StudioTrack, step: FocusStep): boolean {
  if (step === 'track') return Boolean(track.assets.audio && track.title.trim() && track.album?.id);
  if (step === 'visuals') return Boolean(track.assets.cover && track.assets.video);
  if (step === 'lyrics') return Boolean(track.assets.lyricsTxt && track.timestampsAvailable);
  if (step === 'sonic') return Boolean(track.audioIntelligence.available && !track.audioIntelligence.outdated);
  return track.status === 'published' ? track.publishing.catalogVisible : track.publishing.publishable === true;
}

function stepLabel(step: FocusStep): string {
  if (step === 'track') return 'Track';
  if (step === 'visuals') return 'Visuals';
  if (step === 'lyrics') return 'Lyrics';
  if (step === 'sonic') return 'Sonic';
  return 'Release';
}

function selectHomeLead(workflow: TrackWorkflowState[], lastTrackId: string | null): TrackWorkflowState | null {
  const unfinishedLast = lastTrackId
    ? workflow.find(item => item.track.id === lastTrackId && !item.ready) || null
    : null;
  return unfinishedLast || workflow.find(item => !item.ready) || null;
}

export function FocusHome() {
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const items = await getCatalogTracks();
      setTracks(items);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const workflow = useMemo(() => buildCatalogWorkflow(tracks), [tracks]);
  const privateRead = tracks.some(track => track.readSource === 'private');
  const attention = workflow.filter(item => !item.ready);
  const readyCount = workflow.length - attention.length;
  const publishedCount = tracks.filter(track => track.status === 'published' && track.publishing.catalogVisible).length;
  const draftCount = tracks.filter(track => track.status !== 'published').length;
  const lastTrackId = (() => {
    try { return globalThis.localStorage?.getItem(LAST_TRACK_KEY) || null; } catch { return null; }
  })();
  const lead = selectHomeLead(workflow, lastTrackId);
  const lastItem = lastTrackId && lead?.track.id === lastTrackId ? lead : null;
  const queue = attention.filter(item => item.track.id !== lead?.track.id).slice(0, 5);
  const steps: FocusStep[] = ['track', 'visuals', 'lyrics', 'sonic', 'release'];

  return (
    <section className="focus-home">
      <header className="focus-home-heading">
        <div>
          <span className="eyebrow">STUDIO FOCUS</span>
          <h2>Make the track. Finish the release.</h2>
          <p>Studio keeps the machinery underneath and shows the work that actually matters: track, visuals, lyrics and release.</p>
        </div>
        <div className="focus-home-actions">
          <button className="primary-btn" type="button" onClick={() => setShowCreate(true)} disabled={loading || !privateRead}>+ New Track</button>
          <a className="ghost-btn" href={routeHref('catalog')}>All tracks →</a>
        </div>
      </header>

      {showCreate && <TrackCreatePanel privateRead={privateRead} onCancel={() => setShowCreate(false)} onCreated={async () => { await load(); setShowCreate(false); }} />}

      {loading && <div className="focus-home-message panel" role="status">Loading your production queue…</div>}
      {!loading && error && <div className="focus-home-message panel"><strong>Studio cannot read the production catalog.</strong><span>{error}</span></div>}

      {!loading && !error && lead && (
        <>
          <section className="focus-continue panel">
            <div className="focus-continue-copy">
              <span className="eyebrow">{lastItem ? 'CONTINUE WHERE YOU LEFT OFF' : 'NEXT UP'}</span>
              <div className="focus-continue-title">
                <div className="focus-continue-artwork">{artwork(lead.track) ? <img src={artwork(lead.track)!} alt="" /> : <span>{lead.track.title.slice(0, 2).toUpperCase()}</span>}</div>
                <div><h3>{lead.track.title}</h3><p>{lead.track.album.title} · {lead.track.status}</p></div>
              </div>
              <div className="focus-step-row" aria-label={`${lead.track.title} production readiness`}>
                {steps.map(step => <span className={productionStep(lead.track, step) ? 'ready' : 'todo'} key={step}><i>{productionStep(lead.track, step) ? '✓' : '•'}</i>{stepLabel(step)}</span>)}
              </div>
            </div>
            <div className="focus-continue-action">
              <span>NEXT</span>
              <strong>{actionLabel(lead)}</strong>
              <small>{lead.nextAction.detail}</small>
              <a className="primary-btn" href={trackHref(lead.track.id, artistSection(lead.nextAction.section))}>{actionLabel(lead)} <span>→</span></a>
            </div>
          </section>

          <section className="focus-summary" aria-label="Production and catalog summary">
            <article className="panel"><span>NEEDS ATTENTION</span><strong>{attention.length}</strong><small>Production workflow has a next action</small></article>
            <article className="panel"><span>PRODUCTION COMPLETE</span><strong>{readyCount}</strong><small>Current production checklist complete</small></article>
            <article className="panel"><span>PUBLISHED</span><strong>{publishedCount}</strong><small>Visible in the public catalog</small></article>
            <article className="panel"><span>DRAFTS</span><strong>{draftCount}</strong><small>Not published yet</small></article>
          </section>

          <section className="focus-queue">
            <div className="focus-section-heading"><div><span className="eyebrow">CONTINUE</span><h3>What needs attention</h3></div><a href={routeHref('workflow')}>Detailed queue ↗</a></div>
            {queue.length ? <div className="focus-queue-list">{queue.map(item => {
              const image = artwork(item.track);
              return <article className="focus-queue-item panel" key={item.track.id}>
                <a className="focus-queue-identity" href={trackHref(item.track.id, 'overview')}>
                  <span className="focus-queue-art">{image ? <img src={image} alt="" loading="lazy" /> : item.track.title.slice(0, 2).toUpperCase()}</span>
                  <span><strong>{item.track.title}</strong><small>{item.track.album.title}</small></span>
                </a>
                <div className="focus-queue-needs">
                  {steps.filter(step => !productionStep(item.track, step)).slice(0, 3).map(step => <span key={step}>{stepLabel(step)}</span>)}
                </div>
                <a className="ghost-btn" href={trackHref(item.track.id, artistSection(item.nextAction.section))}>{actionLabel(item)} →</a>
              </article>;
            })}</div> : <div className="focus-home-message panel"><strong>Nothing else is waiting on you.</strong><span>This is the only track with a current next action.</span></div>}
          </section>
        </>
      )}

      {!loading && !error && !lead && tracks.length > 0 && (
        <>
          <section className="focus-continue panel">
            <div className="focus-continue-copy">
              <span className="eyebrow">PRODUCTION QUEUE CLEAR</span>
              <div className="focus-continue-title">
                <div><h3>Nothing needs attention</h3><p>All current production workflows are complete.</p></div>
              </div>
            </div>
            <div className="focus-continue-action">
              <span>STATUS</span>
              <strong>Everything current is ready</strong>
              <small>No track has a workflow next action right now.</small>
              <a className="ghost-btn" href={routeHref('catalog')}>Open all tracks →</a>
            </div>
          </section>

          <section className="focus-summary" aria-label="Production and catalog summary">
            <article className="panel"><span>NEEDS ATTENTION</span><strong>0</strong><small>Production workflow has a next action</small></article>
            <article className="panel"><span>PRODUCTION COMPLETE</span><strong>{readyCount}</strong><small>Current production checklist complete</small></article>
            <article className="panel"><span>PUBLISHED</span><strong>{publishedCount}</strong><small>Visible in the public catalog</small></article>
            <article className="panel"><span>DRAFTS</span><strong>{draftCount}</strong><small>Not published yet</small></article>
          </section>
        </>
      )}

      {!loading && !error && tracks.length === 0 && <div className="focus-home-message panel"><strong>No tracks yet.</strong><span>Create the first track to start the production flow.</span></div>}
    </section>
  );
}
