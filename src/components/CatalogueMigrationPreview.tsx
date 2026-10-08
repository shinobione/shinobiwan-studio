import { useEffect, useRef, useState } from 'react';
import { createC7aSession, type C7aState } from '../catalogue/c7a-preview-session';
import type { C7aReport } from '../catalogue/c7a-preview';
import './catalogue-migration-preview.css';

const REJECTION_COPY: Record<Extract<C7aReport, { status: 'rejected' }>['code'], string> = {
  JSON_ONLY: 'Only a local JSON file is accepted.',
  FILE_EMPTY: 'The selected file is empty.',
  FILE_TOO_LARGE: 'The selected file exceeds the 10 MiB limit.',
  V2_ONLY: 'This preflight accepts only the previously reviewed v2 source format.',
  SOURCE_NOT_ACCEPTED: 'The v2 source did not pass the accepted structural checks.',
  UNREADABLE_SOURCE: 'The selected local file cannot be read.',
  LOCAL_PREVIEW_FAILED: 'The local preview could not be completed.',
};

export function CatalogueMigrationPreview() {
  const [state, setState] = useState<C7aState>({ phase: 'empty' });
  const session = useRef<ReturnType<typeof createC7aSession> | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = createC7aSession(
      () => new Worker(new URL('../catalogue/c7a-preview.worker.ts', import.meta.url), { type: 'module' }),
      setState,
    );
    session.current = current;
    const unload = () => current.reset();
    globalThis.addEventListener('pagehide', unload);
    return () => {
      globalThis.removeEventListener('pagehide', unload);
      current.dispose();
      session.current = null;
    };
  }, []);

  const report = state.phase === 'complete' ? state.report : null;
  const counts = report?.status === 'accepted' ? report.counts : null;

  return <section className="catalogue-migration-preview" aria-label="C7a local migration preflight">
    <p className="commercial-catalogue-eyebrow">C7a · PRIVATE V2 MIGRATION PREFLIGHT</p>
    <h3>Preview migration requirements — no commercial writes</h3>
    <p>Choose your existing v2 JSON locally. An isolated worker validates it with the accepted reader,
      then shows <strong>aggregate review requirements only</strong>. Titles, source IDs, hashes and evidence
      bodies never enter this panel. No registry is created, saved, exported or synchronized.</p>

    <div className="c7a-preview-controls">
      <label htmlFor="c7a-preview-file">Select private v2 JSON for local migration preview</label>
      <input
        ref={picker}
        id="c7a-preview-file"
        type="file"
        accept=".json,application/json"
        aria-describedby="c7a-preview-privacy"
        onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (file) session.current?.select(file);
        }}
      />
      <button type="button" onClick={() => {
        session.current?.reset();
        if (picker.current) picker.current.value = '';
        picker.current?.focus();
      }}>Reset / discard C7a preview</button>
    </div>

    <div role="status" aria-live="polite" aria-atomic="true">
      {state.phase === 'empty' && <p>No C7a source loaded.</p>}
      {state.phase === 'reading' && <p>Validating v2 locally… No source rows will be displayed or transmitted.</p>}
      {report?.status === 'rejected' && <p><strong>Local preview rejected.</strong> {REJECTION_COPY[report.code]} Nothing was promoted.</p>}
      {counts && <p><strong>Structurally accepted v2 for aggregate preflight only.</strong> Every commercial identity still needs independent human review.</p>}
    </div>

    {counts && <>
      <div className="c7a-preview-metrics" aria-label="C7a aggregate source review counts">
        {([
          ['Recordings', counts.recordings],
          ['Releases', counts.releases],
          ['Appearances', counts.appearances],
          ['Unbound appearances', counts.unboundAppearances],
          ['Evidence', counts.evidence],
          ['Linked historical details', counts.linkedDistributorDetails],
          ['Unlinked historical details', counts.unlinkedDistributorDetails],
          ['Pending QA findings', counts.pendingQa],
          ['Known ISRC', counts.knownIsrc],
          ['Missing / invalid ISRC', counts.missingIsrc],
          ['Source aliases requiring human review', counts.sourceAliasesRequiringHumanReview],
          ['New commercial entities', counts.newCommercialEntities],
        ] as const).map(([label, value]) => <div className="c7a-preview-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <section aria-label="C7a source coverage audit" className="c7a-preview-coverage">
        <h4>Source coverage — historical, not complete by assumption</h4>
        <dl>
          {([
            ['Sections', counts.sections],
            ['Represented', counts.represented],
            ['Partial', counts.partial],
            ['Omitted', counts.omitted],
            ['Contradictory', counts.contradictory],
            ['Unverified', counts.unverified],
          ] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <p>The original workbook fingerprint in v2 remains <strong>claim-only</strong>.
          No original workbook bytes were independently verified here.</p>
      </section>
      <section className="c7a-preview-hold" aria-label="C7a migration authority">
        <h4>Migration status: HOLD — human mappings required</h4>
        <p>This view has not matched any source to a new commercial registry ID.
          Titles, ISRC/UPC and ordering cannot authorize a match. Unlinked details stay unresolved,
          QA stays pending, and current DSP availability remains unknown.</p>
        <p><strong>Zero creations · Zero writes · Zero uploads · No export.</strong>
          C7b encrypted commercial backup is a separate future permission.</p>
      </section>
    </>}

    <p id="c7a-preview-privacy">Local selection only · JSON v2 only · 10 MiB maximum.
      Selecting a replacement terminates the previous worker. Leaving this tab, Reset or refreshing
      discards the preview. Existing shared-origin browser storage from other apps is not deleted.
      For privacy validation, compare Network and Storage before/after this action.</p>
  </section>;
}
