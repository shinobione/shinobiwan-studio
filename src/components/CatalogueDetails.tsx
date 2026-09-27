import { useEffect, useRef, useState } from 'react';
import { appearanceLabel, contextFindings, recordingDetail, type CatalogueContext, type CatalogueIndex } from '../catalogue/recordings';
import { CatalogueReleaseDetail, EvidenceDisclosure } from './CatalogueReleases';
import { FINDING_LABELS } from '../catalogue/finding-labels';

export function CatalogueDetails({ index, target, onClose, onReview }: { index: CatalogueIndex; target: CatalogueContext; onClose: () => void; onReview: (target: CatalogueContext) => void }) {
  const [trail, setTrail] = useState([target]);
  const current = trail[trail.length - 1];
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const navigating = useRef(false);
  useEffect(() => {
    const element = dialog.current!;
    const opener = document.activeElement;
    element.showModal();
    return () => { element.close(); if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    if (navigating.current) { content.current?.focus(); dialog.current?.scrollTo({ top: 0, behavior: 'instant' }); navigating.current = false; }
  }, [trail]);
  const open = (next: CatalogueContext) => { navigating.current = true; setTrail(previous => [...previous, next]); };
  const detail = current.kind === 'recording' ? recordingDetail(index, current.id) : null;
  const appearance = current.kind === 'appearance' ? index.appearanceById.get(current.id) : null;
  const findings = contextFindings(index, current);
  return <dialog ref={dialog} className="catalogue-release-dialog" aria-labelledby="catalogue-detail-label" onCancel={e => { e.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), summary, [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey ? document.activeElement === first || !controls.includes(document.activeElement as HTMLElement) : document.activeElement === last) {
      event.preventDefault(); (event.shiftKey ? last : first)?.focus();
    }
  }}>
    <header className="release-detail-header"><p id="catalogue-detail-label" className="commercial-catalogue-eyebrow">PRIVATE {current.kind.toUpperCase()} DETAIL</p><button type="button" autoFocus onClick={onClose}>Close detail</button>
      {trail.length > 1 && <button type="button" onClick={() => { navigating.current = true; setTrail(previous => previous.slice(0, -1)); }}>Back to previous detail</button>}
    </header>
    <div ref={content} tabIndex={-1} className="catalogue-detail-content" role="group" aria-label={`${current.kind} evidence`}>
      {current.kind === 'release' ? <CatalogueReleaseDetail embedded index={index} releaseId={current.id} onClose={onClose} onRecording={id => open({ kind: 'recording', id })} onReview={() => onReview(current)} onAppearance={id => open({ kind: 'appearance', id })} /> : <>
        {current.kind === 'recording' ? !detail ? <h3>Recording not found.</h3> : <>
          <h3>{detail.recording.title}</h3><p className="recording-detail-isrc">ISRC: {detail.recording.isrc ?? 'Unknown / not documented'}</p>
          <p>No reviewed Studio Track binding. Proposed source links remain unreviewed evidence only.</p>
          <EvidenceDisclosure ids={detail.recording.evidenceIds} index={index} />
          <section className="release-detail-section"><h4>Across Releases</h4><p>{detail.appearances.length} bound appearances · {detail.releaseCount} distinct Releases</p>
            {!detail.appearances.length && <p>No bound appearances documented for this Recording.</p>}
            <ol className="release-appearances">{detail.appearances.map(a => {
              const release = index.releaseById.get(a.releaseId);
              return <li key={a.appearanceId}><p className="release-position">{appearanceLabel(a)}</p><h5>{release?.title ?? 'Referenced Release unavailable'}</h5><p>Appearance title: {a.displayTitle ?? 'Not documented'}</p><p>Historical reference date: {release?.referenceDate ?? 'Not documented'}</p><p>Exact source reference · Binding unreviewed · Publication unknown</p>
                {release && <button type="button" onClick={() => open({ kind: 'release', id: release.releaseId })}>View Release</button>}
                <button type="button" onClick={() => open({ kind: 'appearance', id: a.appearanceId })}>Review appearance</button><EvidenceDisclosure ids={a.evidenceIds} index={index} />
              </li>;
            })}</ol><p>Unbound appearances are excluded even when their title or observed ISRC matches.</p>
          </section>
        </> : !appearance ? <h3>Appearance not found.</h3> : <>
          <h3>{appearanceLabel(appearance)}</h3><p>{appearance.displayTitle ?? 'Appearance title not documented'}</p>
          <p>{appearance.recordingId === null ? 'Unbound appearance · No Recording association documented.' : 'Bound by exact source reference · Unreviewed'}</p>
          {index.releaseById.has(appearance.releaseId) && <button type="button" onClick={() => open({ kind: 'release', id: appearance.releaseId })}>View Release</button>}
          {appearance.recordingId !== null && index.recordingById.has(appearance.recordingId) && <button type="button" onClick={() => open({ kind: 'recording', id: appearance.recordingId! })}>View Recording</button>}
          <EvidenceDisclosure ids={appearance.evidenceIds} index={index} />
        </>}
        <section className="release-detail-section"><h4>Pending review</h4><p>{findings.length} exact findings. No decisions are applied.</p>
          <button type="button" onClick={() => onReview(current)}>Review contextual findings</button>
          {findings.length > 0 && <details><summary>Inspect linked findings</summary><ul>{findings.map((f, i) => <li key={i}>{FINDING_LABELS[f.code] ?? 'Source evidence needs review'} · {f.code} · {f.locator}</li>)}</ul></details>}
          <p>Workbook coverage is incomplete. Other source findings remain in global QA; current publication remains unknown.</p>
        </section>
      </>}
    </div>
  </dialog>;
}
