import { useEffect, useMemo, useState } from 'react';
import { trackHref } from '../router';
import { getSonicTraceAnalysisState } from '../services/sonictrace-api';
import { buildSonicTraceArtistSummary } from '../sonictrace-artist-summary';
import type { SonicTraceAnalysisState, StudioTrackDetail } from '../types/studio';

export function SonicTraceArtistSummary({ track }: { track: StudioTrackDetail }) {
  const [state, setState] = useState<SonicTraceAnalysisState | null>(null);
  const [loading, setLoading] = useState(track.readSource === 'private' && track.audioIntelligence.available);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setState(null);
    setError(null);

    if (track.readSource !== 'private' || !track.audioIntelligence.available) {
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    getSonicTraceAnalysisState(track.id)
      .then(payload => {
        if (!active) return;
        setState(payload);
        setError(null);
      })
      .catch(reason => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : String(reason));
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [track.id, track.readSource, track.audioIntelligence.available, track.audioIntelligence.latestAnalysisId, track.audioIntelligence.outdated]);

  const model = useMemo(() => buildSonicTraceArtistSummary(state), [state]);

  if (track.readSource !== 'private') {
    return (
      <section className="panel sonic-artist-summary sonic-artist-summary--locked">
        <div className="sonic-artist-summary-head">
          <div><span className="eyebrow">SOUND / SONICTRACE</span><h3>Sound insight stays private</h3><p>Studio is on the public LaunchPAD fallback, so it does not guess or expose private SonicTrace conclusions here.</p></div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="panel sonic-artist-summary" aria-live="polite">
        <div className="sonic-artist-summary-head"><div><span className="eyebrow">SOUND / SONICTRACE</span><h3>Reading the current sound profile…</h3><p>Loading the protected canonical SonicTrace sidecar.</p></div></div>
      </section>
    );
  }

  const profileState = state?.latest ? model.state : track.audioIntelligence.outdated ? 'outdated' : null;
  const profileLabel = state?.latest ? model.profileLabel : track.audioIntelligence.outdated ? 'OUTDATED' : 'NOT ANALYZED';
  const headline = state?.latest ? model.headline : track.audioIntelligence.outdated ? 'Sound profile needs a refresh' : model.headline;
  const detail = state?.latest ? model.detail : track.audioIntelligence.outdated
    ? 'The catalog marks the previous analysis as outdated. Re-scan the current canonical audio before trusting sound conclusions.'
    : model.detail;

  return (
    <section className={`panel sonic-artist-summary sonic-artist-summary--${profileState || 'none'}`}>
      <div className="sonic-artist-summary-head">
        <div>
          <span className="eyebrow">SOUND / SONICTRACE</span>
          <div className="sonic-artist-summary-title"><h3>{headline}</h3><span className={`sonic-artist-profile ${profileState || 'none'}`}>{profileLabel}</span></div>
          <p>{error ? 'Studio could not read the protected SonicTrace sidecar. No sound conclusion is being inferred from the failed read.' : detail}</p>
        </div>
        <a className="ghost-btn" href={trackHref(track.id, 'intelligence')}>{state?.latest ? 'Details / Advanced →' : 'Analyze sound →'}</a>
      </div>

      {error && <div className="sonic-artist-warning" role="status">{error}</div>}

      {!error && model.insights.length > 0 && (
        <div className="sonic-artist-insights">
          {model.insights.map(insight => (
            <div key={`${insight.label}-${insight.value}`}>
              <span>{insight.label}</span>
              <strong>{insight.value}</strong>
              {insight.detail && <small>{insight.detail}</small>}
            </div>
          ))}
        </div>
      )}

      {!error && model.instruments.length > 0 && (
        <div className="sonic-artist-palette"><span>Palette</span><div>{model.instruments.map(item => <b key={item}>{item}</b>)}</div></div>
      )}

      {!error && model.analyzedAt && <small className="sonic-artist-freshness">Current sidecar analyzed {new Date(model.analyzedAt).toLocaleString()}</small>}
    </section>
  );
}
