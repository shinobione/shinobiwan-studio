import { useMemo, useState } from 'react';
import type { StudioTrackDetail } from '../types/studio';
import {
  SHINOBIWAN_LOGO_RULE,
  buildFreshMasterPrompt,
  buildMasterPrompt,
  buildMotionPrompt,
  buildVariantPrompt,
} from '../release-campaign';

const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/';

type PromptKey = 'master' | 'square' | 'vertical' | 'motion';

function FlowLink() {
  return <a className="secondary-btn" href={GOOGLE_FLOW_URL} target="_blank" rel="noopener noreferrer">Open Google Flow ↗</a>;
}

export function TrackToMarketPanel({ track }: { track: StudioTrackDetail }) {
  const [masterConceptIndex, setMasterConceptIndex] = useState(0);
  const [masterPrompt, setMasterPrompt] = useState(() => buildMasterPrompt(track));
  const [squarePrompt, setSquarePrompt] = useState(() => buildVariantPrompt(track, '1:1'));
  const [verticalPrompt, setVerticalPrompt] = useState(() => buildVariantPrompt(track, '9:16'));
  const [copied, setCopied] = useState<PromptKey | null>(null);
  const motionPrompt = useMemo(() => buildMotionPrompt(track), [track]);

  const copyText = async (text: string, key: PromptKey) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const newMasterConcept = () => {
    const nextConceptIndex = masterConceptIndex + 1;
    setMasterConceptIndex(nextConceptIndex);
    setMasterPrompt(buildFreshMasterPrompt(track, true, nextConceptIndex));
  };

  return <section className="release-campaign-workspace release-handoff-build111">
    <article className="panel rc-hero">
      <div>
        <span className="eyebrow">RELEASE / VISUAL HANDOFF</span>
        <h3>Prompts ready for Flow</h3>
        <p>Copy the prompt, attach the required reference image(s) in Flow, generate. Studio no longer asks you to re-import returned artwork or package duplicate release copy.</p>
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
          <button className="secondary-btn" type="button" onClick={newMasterConcept}>New MASTER concept</button>
        </div>
        <label className="rc-handoff"><span>MASTER prompt · concept {masterConceptIndex + 1}</span><textarea value={masterPrompt} onChange={event => setMasterPrompt(event.target.value)} /></label>
        <div className="rc-button-row">
          <button className="primary-btn" type="button" onClick={() => { void copyText(masterPrompt, 'master'); }}>{copied === 'master' ? 'Copied ✓' : 'Copy 16:9 prompt'}</button>
          <FlowLink />
        </div>
      </div>
    </article>

    <div className="rc-prompt-grid">
      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">02</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">1:1 ADAPTATION</span><h3>Square</h3><p>Attach the accepted 16:9 MASTER + official SHINOBIWAN logo in Flow.</p></div></div>
          <label className="rc-handoff"><span>1:1 prompt</span><textarea value={squarePrompt} onChange={event => setSquarePrompt(event.target.value)} /></label>
          <div className="rc-button-row">
            <button className="primary-btn" type="button" onClick={() => { void copyText(squarePrompt, 'square'); }}>{copied === 'square' ? 'Copied ✓' : 'Copy 1:1 prompt'}</button>
            <FlowLink />
          </div>
        </div>
      </article>

      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">03</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">9:16 ADAPTATION</span><h3>Vertical</h3><p>Attach the accepted 16:9 MASTER + official SHINOBIWAN logo in Flow.</p></div></div>
          <label className="rc-handoff"><span>9:16 prompt</span><textarea value={verticalPrompt} onChange={event => setVerticalPrompt(event.target.value)} /></label>
          <div className="rc-button-row">
            <button className="primary-btn" type="button" onClick={() => { void copyText(verticalPrompt, 'vertical'); }}>{copied === 'vertical' ? 'Copied ✓' : 'Copy 9:16 prompt'}</button>
            <FlowLink />
          </div>
        </div>
      </article>
    </div>

    <details className="panel rc-motion">
      <summary>Optional Spotify Canvas / 8s loop prompt</summary>
      <p>Use the accepted artwork as the visual anchor. The same permanent SHINOBIWAN logo hierarchy rule is already included.</p>
      <textarea value={motionPrompt} readOnly />
      <div className="rc-button-row">
        <button className="secondary-btn" type="button" onClick={() => { void copyText(motionPrompt, 'motion'); }}>{copied === 'motion' ? 'Copied ✓' : 'Copy 8s loop prompt'}</button>
        <FlowLink />
      </div>
    </details>
  </section>;
}
