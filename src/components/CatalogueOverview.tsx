import { useMemo } from 'react';
import type { Snapshot } from '../catalogue/import';
import { catalogueOverview } from '../catalogue/overview';
import { FINDING_LABELS } from '../catalogue/finding-labels';

export function CatalogueOverview({ snapshot, onReview }: { snapshot: Snapshot; onReview: (code: string) => void }) {
  const view = useMemo(() => catalogueOverview(snapshot), [snapshot]);
  return <section className="catalogue-overview" aria-label="Snapshot overview">
    <header className="catalogue-overview-header">
      <div><p className="commercial-catalogue-eyebrow">YOUR SELECTED SNAPSHOT</p><h3>A view of your discography.</h3>
        <p>Source date <time dateTime={snapshot.source.snapshotDate}>{snapshot.source.snapshotDate}</time> · Historical evidence</p></div>
      <span className="catalogue-session-badge">Private · Temporary</span>
    </header>
    <dl className="catalogue-overview-metrics">
      {[
        ['Recordings', view.recordings, 'Separate source identities'],
        ['Commercial Releases', view.releases, 'Singles, EPs and albums in the source'],
        ['Source Appearances', view.sourceAppearances, `${view.boundAppearances} bound · ${view.unboundAppearances} unbound`],
        ['Known ISRC', view.knownIsrc, 'Documented in the selected source'],
        ['Missing / invalid ISRC', view.missingIsrc, 'Remain unknown until reviewed'],
        ['Pending review findings', view.pending, 'No decisions applied automatically'],
      ].map(([label, count, note]) => <div key={label} className="catalogue-metric"><dt>{label}</dt><dd>{count}</dd><p>{note}</p></div>)}
    </dl>
    <section className="catalogue-review-highlights" aria-labelledby="catalogue-highlights-title">
      <div className="catalogue-highlights-heading"><div><p className="commercial-catalogue-eyebrow">REVIEW HIGHLIGHTS</p><h4 id="catalogue-highlights-title">What needs a closer look</h4></div><p>{view.pending} pending findings</p></div>
      <p>Grouped by source finding. Open a group to inspect its evidence in QA.</p>
      {view.groups.length ? <ul>{view.groups.map(group => <li key={`${group.severity}:${group.code}`}>
        <button type="button" onClick={() => onReview(group.code)}>
          <span><strong>{FINDING_LABELS[group.code] ?? 'Source evidence needs review'}</strong><small>{group.severity === 'error' ? 'Error' : 'Review'} · {group.code}</small></span>
          <span className="catalogue-finding-count">{group.count}<span className="catalogue-review-arrow" aria-hidden="true"> ↗</span></span>
        </button>
      </li>)}</ul> : <p>No pending findings in this snapshot.</p>}
    </section>
  </section>;
}
