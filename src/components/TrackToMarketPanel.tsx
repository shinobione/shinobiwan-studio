import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { StudioTrackDetail } from '../types/studio';
import {
  SHINOBIWAN_LOGO_RULE,
  buildFreshMasterPrompt,
  buildMasterPrompt,
  buildMotionPrompt,
  buildVariantPrompt,
} from '../release-campaign';
import {
  compareMusicPackIdentity,
  loadLocalMusicPack,
  parseMusicPackJson,
  removeLocalMusicPack,
  saveLocalMusicPack,
  type MusicPackIdentityMismatch,
  type MusicPackV1,
  type StoredMusicPackV1,
} from '../services/music-pack';

const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/';

type PendingPack = {
  pack: MusicPackV1;
  mismatches: MusicPackIdentityMismatch[];
};

function FlowLink() {
  return <a className="secondary-btn" href={GOOGLE_FLOW_URL} target="_blank" rel="noopener noreferrer">Open Google Flow ↗</a>;
}

function readableTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function copyableValue(value: string | string[]) {
  return Array.isArray(value) ? value.join(', ') : value;
}

function MusicPackCopyField({
  label,
  value,
  copyKey,
  copied,
  onCopy,
  multiline = false,
}: {
  label: string;
  value: string | string[];
  copyKey: string;
  copied: string | null;
  onCopy: (value: string, key: string) => void;
  multiline?: boolean;
}) {
  const text = copyableValue(value);
  return <div className="rc-pack-field">
    <div className="rc-pack-field-head">
      <span>{label}</span>
      <button className="rc-copy-mini" type="button" disabled={!text} onClick={() => onCopy(text, copyKey)}>
        {copied === copyKey ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
    {multiline ? <pre>{text || '—'}</pre> : <p>{text || '—'}</p>}
  </div>;
}

function MusicPackDetails({
  stored,
  copied,
  onCopy,
}: {
  stored: StoredMusicPackV1;
  copied: string | null;
  onCopy: (value: string, key: string) => void;
}) {
  const pack = stored.payload;
  const highlight = pack.soundcloud.highlight;
  const excerpt = pack.release.recommendedExcerpt;
  const highlightText = highlight.start || highlight.end
    ? `${highlight.start || '—'} → ${highlight.end || '—'}${highlight.durationSeconds == null ? '' : ` · ${highlight.durationSeconds}s`}`
    : '';
  const excerptText = excerpt.start || excerpt.end
    ? `${excerpt.start || '—'} → ${excerpt.end || '—'}${excerpt.durationSeconds == null ? '' : ` · ${excerpt.durationSeconds}s`}${excerpt.reason ? ` · ${excerpt.reason}` : ''}`
    : '';

  return <>
    <article className="panel rc-soundcloud-priority">
      <div className="rc-soundcloud-head">
        <div>
          <span className="eyebrow">SOUNDCLOUD · FROM MUSIC PACK</span>
          <h3>Ready to publish</h3>
          <p>Description, tags and the selected highlight come directly from the approved MUSIC Pack. Studio does not regenerate them.</p>
        </div>
        <span className="rc-pack-revision">r{pack.pack.revision}</span>
      </div>
      <div className="rc-soundcloud-grid">
        <section>
          <MusicPackCopyField label="Title" value={pack.soundcloud.title} copyKey="sc-title" copied={copied} onCopy={onCopy} />
          <MusicPackCopyField label="Description" value={pack.soundcloud.description} copyKey="sc-description" copied={copied} onCopy={onCopy} multiline />
        </section>
        <section>
          <MusicPackCopyField label="Tags" value={pack.soundcloud.tags} copyKey="sc-tags" copied={copied} onCopy={onCopy} />
          <MusicPackCopyField label="Highlight · 20s target" value={highlightText} copyKey="sc-highlight" copied={copied} onCopy={onCopy} />
        </section>
      </div>
    </article>

    <details className="panel rc-music-pack-details">
      <summary>More from PACK COMPLET · Social / Release / Production</summary>
      <div className="rc-pack-detail-grid">
        <section>
          <span className="eyebrow">SOCIAL</span>
          <MusicPackCopyField label="Short caption" value={pack.social.shortCaption} copyKey="social-short" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Long caption" value={pack.social.longCaption} copyKey="social-long" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Hashtags" value={pack.social.hashtags} copyKey="social-tags" copied={copied} onCopy={onCopy} />
        </section>
        <section>
          <span className="eyebrow">RELEASE</span>
          <MusicPackCopyField label="Hook" value={pack.release.hook} copyKey="release-hook" copied={copied} onCopy={onCopy} />
          <MusicPackCopyField label="One-liner" value={pack.release.oneLiner} copyKey="release-line" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Recommended excerpt" value={excerptText} copyKey="release-excerpt" copied={copied} onCopy={onCopy} />
          <MusicPackCopyField label="Notes" value={pack.release.notes} copyKey="release-notes" copied={copied} onCopy={onCopy} multiline />
        </section>
        {pack.production ? <section>
          <span className="eyebrow">PRODUCTION</span>
          <MusicPackCopyField label="Style prompt" value={pack.production.stylePrompt} copyKey="prod-style" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Hook" value={pack.production.hook} copyKey="prod-hook" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Structure" value={pack.production.structure} copyKey="prod-structure" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Lyrics" value={pack.production.lyrics} copyKey="prod-lyrics" copied={copied} onCopy={onCopy} multiline />
          <MusicPackCopyField label="Notes" value={pack.production.notes} copyKey="prod-notes" copied={copied} onCopy={onCopy} multiline />
        </section> : null}
      </div>
    </details>
  </>;
}

export function TrackToMarketPanel({ track }: { track: StudioTrackDetail }) {
  const [masterConceptIndex, setMasterConceptIndex] = useState(0);
  const [masterPrompt, setMasterPrompt] = useState(() => buildMasterPrompt(track));
  const [squarePrompt, setSquarePrompt] = useState(() => buildVariantPrompt(track, '1:1'));
  const [verticalPrompt, setVerticalPrompt] = useState(() => buildVariantPrompt(track, '9:16'));
  const [storedPack, setStoredPack] = useState<StoredMusicPackV1 | null>(() => loadLocalMusicPack(track.id));
  const [pendingPack, setPendingPack] = useState<PendingPack | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const generatedMotionPrompt = useMemo(() => buildMotionPrompt(track), [track.id, track.title]);

  useEffect(() => {
    setStoredPack(loadLocalMusicPack(track.id));
    setPendingPack(null);
    setImportError(null);
    setImportErrors([]);
    setImportNotice(null);
    setMasterConceptIndex(0);
    setMasterPrompt(buildMasterPrompt(track));
    setSquarePrompt(buildVariantPrompt(track, '1:1'));
    setVerticalPrompt(buildVariantPrompt(track, '9:16'));
  }, [track.id, track.title]);

  const importedPack = storedPack?.payload ?? null;
  const activeMasterPrompt = importedPack?.visuals.master16x9.prompt ?? masterPrompt;
  const activeSquarePrompt = importedPack?.visuals.square1x1.prompt ?? squarePrompt;
  const activeVerticalPrompt = importedPack?.visuals.vertical9x16.prompt ?? verticalPrompt;
  const activeMotionPrompt = importedPack?.visuals.canvas.prompt ?? generatedMotionPrompt;

  const copyText = async (text: string, key: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const newMasterConcept = () => {
    if (importedPack) return;
    const nextConceptIndex = masterConceptIndex + 1;
    setMasterConceptIndex(nextConceptIndex);
    setMasterPrompt(buildFreshMasterPrompt(track, true, nextConceptIndex));
  };

  const attachPack = (pack: MusicPackV1, mismatchAccepted = false) => {
    const previousRevision = storedPack?.payload.pack.revision ?? null;
    const stored = saveLocalMusicPack(track.id, pack);
    setStoredPack(stored);
    setPendingPack(null);
    setImportError(null);
    setImportErrors([]);
    setImportNotice(`${mismatchAccepted ? 'Mismatch accepted · ' : ''}${pack.pack.status === 'validated' ? 'Validated' : 'Draft'} MUSIC Pack r${pack.pack.revision} attached${previousRevision == null ? '' : ` · replaced local r${previousRevision}`}.`);
  };

  const importMusicPack = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImportError(null);
    setImportErrors([]);
    setImportNotice(null);
    setPendingPack(null);

    const result = parseMusicPackJson(await file.text());
    if (!result.ok) {
      setImportError(result.message);
      setImportErrors(result.errors);
      return;
    }

    const mismatches = compareMusicPackIdentity(result.pack, track);
    if (mismatches.length) {
      setPendingPack({ pack: result.pack, mismatches });
      return;
    }

    attachPack(result.pack);
  };

  const clearMusicPack = () => {
    if (!window.confirm(`Remove the browser-local MUSIC Pack from “${track.title}”?`)) return;
    removeLocalMusicPack(track.id);
    setStoredPack(null);
    setPendingPack(null);
    setImportNotice('Local MUSIC Pack removed. Studio fallback prompts are active again.');
  };

  return <section className="release-campaign-workspace release-handoff-build111 music-pack-build112 soundcloud-priority-build113">
    <article className="panel rc-music-pack-import">
      <div className="rc-pack-import-main">
        <span className="eyebrow">MUSIC PACK</span>
        <h3>{storedPack ? `${storedPack.payload.pack.status === 'validated' ? 'Validated' : 'Draft'} PACK COMPLET · r${storedPack.payload.pack.revision}` : 'Import PACK COMPLET JSON'}</h3>
        <p>{storedPack
          ? `Generated ${readableTimestamp(storedPack.payload.source.generatedAt)} · imported ${readableTimestamp(storedPack.importedAt)}. Stored only in this browser for this Track.`
          : 'Import the JSON exported by the ChatGPT MUSIC project. Studio validates it before attaching anything.'}</p>
      </div>
      <div className="rc-pack-actions">
        <label className="secondary-btn rc-import-btn">{storedPack ? 'Replace MUSIC Pack JSON' : 'Import MUSIC Pack JSON'}<input type="file" accept="application/json,.json" onChange={event => { void importMusicPack(event); }} /></label>
        {storedPack ? <button className="secondary-btn" type="button" onClick={clearMusicPack}>Remove local pack</button> : null}
      </div>
    </article>

    {importNotice ? <div className="rc-pack-notice" role="status">{importNotice}</div> : null}
    {importError ? <article className="panel rc-pack-error" role="alert">
      <strong>{importError}</strong>
      {importErrors.length ? <ul>{importErrors.slice(0, 8).map(error => <li key={error}>{error}</li>)}</ul> : null}
    </article> : null}

    {pendingPack ? <article className="panel rc-pack-mismatch" role="alert">
      <div>
        <span className="eyebrow">TRACK MISMATCH</span>
        <h3>This Pack does not identify the selected Track exactly</h3>
        <p>Nothing has been attached yet. Review the mismatch below; attaching anyway will still never modify the Track itself.</p>
        <div className="rc-mismatch-grid">
          {pendingPack.mismatches.map(mismatch => <div key={mismatch.field}><strong>{mismatch.field}</strong><span>Studio: {mismatch.selected || '—'}</span><span>MUSIC Pack: {mismatch.incoming || '—'}</span></div>)}
        </div>
      </div>
      <div className="rc-pack-actions">
        <button className="primary-btn" type="button" onClick={() => attachPack(pendingPack.pack, true)}>Attach pack to this Track anyway</button>
        <button className="secondary-btn" type="button" onClick={() => setPendingPack(null)}>Cancel</button>
      </div>
    </article> : null}

    {storedPack ? <MusicPackDetails stored={storedPack} copied={copied} onCopy={(value, key) => { void copyText(value, key); }} /> : null}

    <article className="panel rc-hero">
      <div>
        <span className="eyebrow">RELEASE / VISUAL HANDOFF</span>
        <h3>{importedPack ? 'MUSIC Pack prompts ready for Flow' : 'Prompts ready for Flow'}</h3>
        <p>{importedPack
          ? 'The prompts below come directly from the imported MUSIC Pack. Studio does not regenerate or rewrite them.'
          : 'No MUSIC Pack is attached yet. Studio fallback prompts remain available for older Tracks; attach a Pack to use the approved MUSIC output.'}</p>
      </div>
      <FlowLink />
    </article>

    <article className="panel rc-brand-rule">
      <div><span className="eyebrow">SHINOBIWAN BRAND RULE</span><h3>Logo reference is mandatory in every visual prompt</h3></div>
      <p>{SHINOBIWAN_LOGO_RULE}</p>
    </article>

    <article className="panel rc-step rc-master-step">
      <div className="rc-step-number">01</div>
      <div className="rc-step-main">
        <div className="rc-section-head">
          <div><span className="eyebrow">MASTER 16:9</span><h3>{track.title}</h3><p>Attach the official SHINOBIWAN logo in Flow. The logo is always integrated coherently and always smaller than the track title.</p></div>
          {!importedPack ? <button className="secondary-btn" type="button" onClick={newMasterConcept}>New MASTER concept</button> : null}
        </div>
        <label className="rc-handoff"><span>{importedPack ? `MUSIC Pack r${importedPack.pack.revision} · MASTER prompt` : `MASTER prompt · concept ${masterConceptIndex + 1}`}</span><textarea value={activeMasterPrompt} readOnly={Boolean(importedPack)} onChange={event => setMasterPrompt(event.target.value)} /></label>
        <div className="rc-button-row">
          <button className="primary-btn" type="button" onClick={() => { void copyText(activeMasterPrompt, 'master'); }}>{copied === 'master' ? 'Copied ✓' : 'Copy 16:9 prompt'}</button>
          <FlowLink />
        </div>
      </div>
    </article>

    <div className="rc-prompt-grid">
      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">02</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">1:1 ADAPTATION</span><h3>Square</h3><p>Attach the accepted 16:9 MASTER + official SHINOBIWAN logo in Flow.</p></div></div>
          <label className="rc-handoff"><span>1:1 prompt</span><textarea value={activeSquarePrompt} readOnly={Boolean(importedPack)} onChange={event => setSquarePrompt(event.target.value)} /></label>
          <div className="rc-button-row">
            <button className="primary-btn" type="button" onClick={() => { void copyText(activeSquarePrompt, 'square'); }}>{copied === 'square' ? 'Copied ✓' : 'Copy 1:1 prompt'}</button>
            <FlowLink />
          </div>
        </div>
      </article>

      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">03</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">9:16 ADAPTATION</span><h3>Vertical</h3><p>Attach the accepted 16:9 MASTER + official SHINOBIWAN logo in Flow.</p></div></div>
          <label className="rc-handoff"><span>9:16 prompt</span><textarea value={activeVerticalPrompt} readOnly={Boolean(importedPack)} onChange={event => setVerticalPrompt(event.target.value)} /></label>
          <div className="rc-button-row">
            <button className="primary-btn" type="button" onClick={() => { void copyText(activeVerticalPrompt, 'vertical'); }}>{copied === 'vertical' ? 'Copied ✓' : 'Copy 9:16 prompt'}</button>
            <FlowLink />
          </div>
        </div>
      </article>
    </div>

    <details className="panel rc-motion">
      <summary>Optional Spotify Canvas / 8s loop prompt</summary>
      <p>{importedPack ? 'This Canvas prompt comes directly from the MUSIC Pack.' : 'Use the accepted artwork as the visual anchor. The same permanent SHINOBIWAN logo hierarchy rule is already included.'}</p>
      <textarea value={activeMotionPrompt} readOnly />
      <div className="rc-button-row">
        <button className="secondary-btn" type="button" onClick={() => { void copyText(activeMotionPrompt, 'motion'); }}>{copied === 'motion' ? 'Copied ✓' : 'Copy 8s loop prompt'}</button>
        <FlowLink />
      </div>
    </details>
  </section>;
}
