import { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import type { StudioTrackDetail } from '../types/studio';
import {
  buildMasterPrompt,
  buildMotionPrompt,
  buildReleaseCopy,
  buildVariantPrompt,
  campaignReady,
  dataUrlParts,
  extensionForMime,
  inspectAspect,
  safeCampaignName,
  type CampaignFormat,
  type CampaignImageAsset,
  type ReleaseCampaignCopy,
  type ReleaseCampaignDraft,
} from '../release-campaign';
import {
  clearReleaseCampaignDraft,
  loadReleaseCampaignDraft,
  saveReleaseCampaignDraft,
} from '../release-campaign-storage';

const PROVIDERS = ['Google Flow', 'Gemini', 'ChatGPT Images', 'Other premium provider'];

type ImageSlot = 'logo' | 'master' | 'square' | 'vertical';

function readFileDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unable to read image.'));
    reader.onerror = () => reject(reader.error || new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}

async function imageAssetFromFile(file: File): Promise<CampaignImageAsset> {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  const dataUrl = await readFileDataUrl(file);
  const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error('Unable to inspect image dimensions.'));
    image.src = dataUrl;
  });
  return {
    dataUrl,
    filename: file.name || 'artwork.png',
    mimeType: file.type || dataUrlParts(dataUrl).mimeType,
    width: dimensions.width,
    height: dimensions.height,
    importedAt: new Date().toISOString(),
  };
}

function downloadDataUrl(asset: CampaignImageAsset, filename?: string) {
  const anchor = document.createElement('a');
  anchor.href = asset.dataUrl;
  anchor.download = filename || asset.filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function ratioLabel(asset: CampaignImageAsset | null, format: CampaignFormat) {
  if (!asset) return { label: 'MISSING', ok: false, detail: 'No image imported' };
  const inspected = inspectAspect(asset, format);
  return {
    label: inspected.ok ? 'FORMAT OK' : 'CHECK RATIO',
    ok: inspected.ok,
    detail: `${asset.width}×${asset.height} · ${(asset.width / asset.height).toFixed(3)}`,
  };
}

function ImagePreview({ asset, format, title }: { asset: CampaignImageAsset | null; format: CampaignFormat; title: string }) {
  const status = ratioLabel(asset, format);
  return <div className={`rc-preview rc-preview-${format.replace(':', 'x')}`}>
    {asset ? <img src={asset.dataUrl} alt={`${title} ${format}`} /> : <div className="rc-preview-empty"><span>{format}</span><small>Awaiting provider output</small></div>}
    <div className="rc-preview-meta">
      <strong>{format}</strong>
      <span>{status.detail}</span>
      <em className={status.ok ? 'is-ok' : 'is-warn'}>{status.label}</em>
    </div>
  </div>;
}

export function TrackToMarketPanel({ track }: { track: StudioTrackDetail }) {
  const [provider, setProvider] = useState('Google Flow');
  const [logo, setLogo] = useState<CampaignImageAsset | null>(null);
  const [master, setMaster] = useState<CampaignImageAsset | null>(null);
  const [square, setSquare] = useState<CampaignImageAsset | null>(null);
  const [vertical, setVertical] = useState<CampaignImageAsset | null>(null);
  const [masterPrompt, setMasterPrompt] = useState(() => buildMasterPrompt(track, false));
  const [squarePrompt, setSquarePrompt] = useState(() => buildVariantPrompt(track, '1:1'));
  const [verticalPrompt, setVerticalPrompt] = useState(() => buildVariantPrompt(track, '9:16'));
  const [copyPack, setCopyPack] = useState<ReleaseCampaignCopy>(() => buildReleaseCopy(track));
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('Native campaign draft · browser-local only · canonical assets untouched.');
  const [copied, setCopied] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const logoInput = useRef<HTMLInputElement>(null);
  const masterInput = useRef<HTMLInputElement>(null);
  const squareInput = useRef<HTMLInputElement>(null);
  const verticalInput = useRef<HTMLInputElement>(null);

  const ready = campaignReady({ master, square, vertical });
  const motionPrompt = useMemo(() => buildMotionPrompt(track), [track]);

  useEffect(() => {
    let cancelled = false;
    setHydrated(false);
    void loadReleaseCampaignDraft(track.id).then(draft => {
      if (cancelled) return;
      if (draft?.version === 1 && draft.trackId === track.id) {
        setProvider(draft.provider || 'Google Flow');
        setLogo(draft.logo || null);
        setMaster(draft.master || null);
        setSquare(draft.square || null);
        setVertical(draft.vertical || null);
        setMasterPrompt(draft.masterPrompt || buildMasterPrompt(track, Boolean(draft.logo)));
        setSquarePrompt(draft.squarePrompt || buildVariantPrompt(track, '1:1'));
        setVerticalPrompt(draft.verticalPrompt || buildVariantPrompt(track, '9:16'));
        setCopyPack(draft.copy || buildReleaseCopy(track));
        setNotice('Browser-local Release Campaign draft restored. Nothing was read from or written to canonical R2 campaign assets.');
      } else {
        setProvider('Google Flow');
        setLogo(null);
        setMaster(null);
        setSquare(null);
        setVertical(null);
        setMasterPrompt(buildMasterPrompt(track, false));
        setSquarePrompt(buildVariantPrompt(track, '1:1'));
        setVerticalPrompt(buildVariantPrompt(track, '9:16'));
        setCopyPack(buildReleaseCopy(track));
        setNotice('New browser-local Release Campaign draft. Start with the 16:9 MASTER.');
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [track]);

  useEffect(() => {
    if (!hydrated) return;
    const draft: ReleaseCampaignDraft = {
      version: 1,
      trackId: track.id,
      provider,
      masterPrompt,
      squarePrompt,
      verticalPrompt,
      logo,
      master,
      square,
      vertical,
      copy: copyPack,
      updatedAt: new Date().toISOString(),
    };
    const timer = window.setTimeout(() => {
      void saveReleaseCampaignDraft(draft).catch(() => setNotice('Local draft could not be saved. Current browser session remains usable.'));
    }, 450);
    return () => window.clearTimeout(timer);
  }, [copyPack, hydrated, logo, master, masterPrompt, provider, square, squarePrompt, track.id, vertical, verticalPrompt]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const importSlot = async (slot: ImageSlot, file?: File) => {
    if (!file) return;
    try {
      const asset = await imageAssetFromFile(file);
      if (slot === 'logo') {
        setLogo(asset);
        setMasterPrompt(buildMasterPrompt(track, true));
        setNotice('Logo reference loaded locally. Attach this same file in the premium provider for the MASTER handoff.');
        return;
      }
      if (slot === 'master') {
        setMaster(asset);
        setSquare(null);
        setVertical(null);
        setNotice('MASTER 16:9 imported unchanged. Variant handoffs are now unlocked and both will reference this MASTER directly.');
        return;
      }
      if (slot === 'square') {
        setSquare(asset);
        setNotice('1:1 derivative imported. It remains independent from the 9:16 derivative.');
        return;
      }
      setVertical(asset);
      setNotice('9:16 derivative imported. Campaign completeness is recalculated from actual dimensions.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : String(error));
    }
  };

  const resetDraft = async () => {
    if (!globalThis.confirm('Reset the browser-local Release Campaign draft for this track? Canonical assets will not be touched.')) return;
    await clearReleaseCampaignDraft(track.id);
    setProvider('Google Flow');
    setLogo(null);
    setMaster(null);
    setSquare(null);
    setVertical(null);
    setMasterPrompt(buildMasterPrompt(track, false));
    setSquarePrompt(buildVariantPrompt(track, '1:1'));
    setVerticalPrompt(buildVariantPrompt(track, '9:16'));
    setCopyPack(buildReleaseCopy(track));
    setNotice('Local draft reset. Canonical track assets remain untouched.');
  };

  const exportCampaign = async () => {
    if (!master) {
      setNotice('Import a MASTER 16:9 before exporting.');
      return;
    }
    setExporting(true);
    try {
      const zip = new JSZip();
      const visuals = zip.folder('visuals');
      const references = zip.folder('references');
      const prompts = zip.folder('prompts');
      const copy = zip.folder('copy');

      const addImage = (folder: JSZip | null, name: string, asset: CampaignImageAsset | null) => {
        if (!folder || !asset) return;
        const { base64 } = dataUrlParts(asset.dataUrl);
        folder.file(`${name}.${extensionForMime(asset.mimeType)}`, base64, { base64: true });
      };

      addImage(visuals, 'master-16x9', master);
      addImage(visuals, 'square-1x1', square);
      addImage(visuals, 'vertical-9x16', vertical);
      addImage(references, 'shinobiwan-logo-reference', logo);

      prompts?.file('master-16x9.txt', masterPrompt);
      prompts?.file('variant-1x1.txt', squarePrompt);
      prompts?.file('variant-9x16.txt', verticalPrompt);
      prompts?.file('motion-8s-followup.txt', motionPrompt);
      copy?.file('soundcloud.txt', copyPack.soundcloud);
      copy?.file('social.txt', copyPack.social);
      copy?.file('tags.txt', copyPack.tags.join(', '));

      const manifest = {
        schemaVersion: 1,
        kind: 'shinobiwan-release-campaign',
        trackId: track.id,
        title: track.title,
        provider,
        status: ready ? 'campaign-complete' : 'partial-campaign',
        exportedAt: new Date().toISOString(),
        canonicalWrite: false,
        visualContract: {
          master: '16:9',
          square: '1:1 anchored directly to master-16x9',
          vertical: '9:16 anchored directly to master-16x9',
        },
        assets: {
          master: master && { filename: master.filename, width: master.width, height: master.height, importedAt: master.importedAt },
          square: square && { filename: square.filename, width: square.width, height: square.height, importedAt: square.importedAt },
          vertical: vertical && { filename: vertical.filename, width: vertical.width, height: vertical.height, importedAt: vertical.importedAt },
          logo: logo && { filename: logo.filename, width: logo.width, height: logo.height, importedAt: logo.importedAt },
        },
      };
      zip.file('release-campaign.json', JSON.stringify(manifest, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${safeCampaignName(track.title)}_Release_Campaign.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setNotice(ready ? 'Complete 16:9 + 1:1 + 9:16 campaign exported.' : 'Partial campaign exported. Missing/incorrect variants remain clearly marked in the manifest.');
    } catch (error) {
      setNotice(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setExporting(false);
    }
  };

  const masterStatus = ratioLabel(master, '16:9');
  const squareStatus = ratioLabel(square, '1:1');
  const verticalStatus = ratioLabel(vertical, '9:16');

  return <section className="release-campaign-workspace">
    <input ref={logoInput} type="file" accept="image/*" hidden onChange={event => { void importSlot('logo', event.target.files?.[0]); event.currentTarget.value = ''; }} />
    <input ref={masterInput} type="file" accept="image/*" hidden onChange={event => { void importSlot('master', event.target.files?.[0]); event.currentTarget.value = ''; }} />
    <input ref={squareInput} type="file" accept="image/*" hidden onChange={event => { void importSlot('square', event.target.files?.[0]); event.currentTarget.value = ''; }} />
    <input ref={verticalInput} type="file" accept="image/*" hidden onChange={event => { void importSlot('vertical', event.target.files?.[0]); event.currentTarget.value = ''; }} />

    <article className="panel rc-hero">
      <div>
        <span className="eyebrow">RELEASE CAMPAIGN / NATIVE STUDIO · BUILD 48</span>
        <h3>MASTER → coherent formats</h3>
        <p>The standalone Track-To-Market step is removed from the primary workflow. Studio now owns the browser-local campaign draft while canonical R2/Track Manager authority remains unchanged.</p>
      </div>
      <div className="rc-hero-actions">
        <span className={`rc-campaign-badge ${ready ? 'is-ready' : ''}`}>{ready ? 'CAMPAIGN READY' : 'IN PROGRESS'}</span>
        <button className="secondary-btn" type="button" onClick={() => { void resetDraft(); }}>Reset local draft</button>
      </div>
    </article>

    <div className="rc-notice"><span>{hydrated ? 'LOCAL DRAFT' : 'RESTORING'}</span><p>{notice}</p></div>

    <article className="panel rc-context-card">
      <div className="rc-section-head">
        <div><span className="eyebrow">CANONICAL INPUT / READ ONLY</span><h3>{track.title}</h3></div>
        <label className="rc-provider-field"><span>Premium provider</span><select value={provider} onChange={event => setProvider(event.target.value)}>{PROVIDERS.map(item => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="ttm-context-grid">
        <div><span>Genres</span><strong>{track.genres.join(', ') || 'Unclassified'}</strong></div>
        <div><span>Mood</span><strong>{track.moods.join(', ') || '—'}</strong></div>
        <div><span>Theme</span><strong>{track.themes.join(', ') || '—'}</strong></div>
        <div><span>Track ID</span><strong>{track.id}</strong></div>
      </div>
    </article>

    <article className="panel rc-step rc-master-step">
      <div className="rc-step-number">01</div>
      <div className="rc-step-main">
        <div className="rc-section-head">
          <div><span className="eyebrow">MASTER / PREMIUM FINAL</span><h3>Generate + import the 16:9 MASTER</h3><p>This is the campaign source of truth for visual derivatives — not a canonical R2 write.</p></div>
          <span className={`rc-format-state ${masterStatus.ok ? 'is-ok' : ''}`}>{masterStatus.label}</span>
        </div>
        <div className="rc-master-grid">
          <div className="rc-handoff">
            <label><span>MASTER handoff · editable</span><textarea value={masterPrompt} onChange={event => setMasterPrompt(event.target.value)} /></label>
            <div className="rc-button-row">
              <button className="primary-btn" type="button" onClick={() => { void copyText(masterPrompt, 'master'); }}>{copied === 'master' ? 'Copied ✓' : `Copy MASTER handoff for ${provider}`}</button>
              <button className="secondary-btn" type="button" onClick={() => logoInput.current?.click()}>{logo ? 'Replace logo reference' : 'Load SHINOBIWAN logo'}</button>
              {logo && <button className="secondary-btn" type="button" onClick={() => downloadDataUrl(logo, `SHINOBIWAN_Logo_Reference.${extensionForMime(logo.mimeType)}`)}>Download logo reference</button>}
            </div>
            <p className="rc-helper">{logo ? 'Logo ready: attach this exact file with the MASTER prompt in the provider.' : 'Optional but recommended: load the authoritative SHINOBIWAN logo, then attach it as a provider reference image.'}</p>
          </div>
          <div className="rc-import-panel">
            <ImagePreview asset={master} format="16:9" title={track.title} />
            <button className="primary-btn" type="button" onClick={() => masterInput.current?.click()}>{master ? 'Replace MASTER 16:9' : 'Import MASTER 16:9'}</button>
            {master && <button className="secondary-btn" type="button" onClick={() => downloadDataUrl(master, `${safeCampaignName(track.title)}_MASTER_16x9.${extensionForMime(master.mimeType)}`)}>Download MASTER reference</button>}
          </div>
        </div>
      </div>
    </article>

    <div className={`rc-variant-grid ${master ? '' : 'is-locked'}`}>
      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">02</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">ANCHORED DERIVATIVE</span><h3>1:1 Square</h3><p>Reference = accepted MASTER 16:9. Recompose, never crude-crop.</p></div><span className={`rc-format-state ${squareStatus.ok ? 'is-ok' : ''}`}>{squareStatus.label}</span></div>
          <ImagePreview asset={square} format="1:1" title={track.title} />
          <label className="rc-variant-prompt"><span>Provider instruction</span><textarea value={squarePrompt} onChange={event => setSquarePrompt(event.target.value)} disabled={!master} /></label>
          <div className="rc-button-stack">
            <button className="primary-btn" type="button" disabled={!master} onClick={() => { void copyText(squarePrompt, 'square'); }}>{copied === 'square' ? 'Copied ✓' : 'Copy coherent 1:1 prompt'}</button>
            <button className="secondary-btn" type="button" disabled={!master} onClick={() => master && downloadDataUrl(master, `${safeCampaignName(track.title)}_MASTER_REFERENCE_16x9.${extensionForMime(master.mimeType)}`)}>Download MASTER reference</button>
            <button className="secondary-btn" type="button" disabled={!master} onClick={() => squareInput.current?.click()}>{square ? 'Replace 1:1' : 'Import returned 1:1'}</button>
          </div>
        </div>
      </article>

      <article className="panel rc-step rc-variant-step">
        <div className="rc-step-number">03</div>
        <div className="rc-step-main">
          <div className="rc-section-head"><div><span className="eyebrow">ANCHORED DERIVATIVE</span><h3>9:16 Vertical</h3><p>Reference = the same MASTER 16:9, independently from the square.</p></div><span className={`rc-format-state ${verticalStatus.ok ? 'is-ok' : ''}`}>{verticalStatus.label}</span></div>
          <ImagePreview asset={vertical} format="9:16" title={track.title} />
          <label className="rc-variant-prompt"><span>Provider instruction</span><textarea value={verticalPrompt} onChange={event => setVerticalPrompt(event.target.value)} disabled={!master} /></label>
          <div className="rc-button-stack">
            <button className="primary-btn" type="button" disabled={!master} onClick={() => { void copyText(verticalPrompt, 'vertical'); }}>{copied === 'vertical' ? 'Copied ✓' : 'Copy coherent 9:16 prompt'}</button>
            <button className="secondary-btn" type="button" disabled={!master} onClick={() => master && downloadDataUrl(master, `${safeCampaignName(track.title)}_MASTER_REFERENCE_16x9.${extensionForMime(master.mimeType)}`)}>Download MASTER reference</button>
            <button className="secondary-btn" type="button" disabled={!master} onClick={() => verticalInput.current?.click()}>{vertical ? 'Replace 9:16' : 'Import returned 9:16'}</button>
          </div>
        </div>
      </article>
    </div>

    <article className="panel rc-review-card">
      <div className="rc-section-head"><div><span className="eyebrow">CAMPAIGN REVIEW</span><h3>One visual identity · three intentional compositions</h3></div><span className={`rc-campaign-badge ${ready ? 'is-ready' : ''}`}>{ready ? '3/3 VALID' : `${[masterStatus.ok, squareStatus.ok, verticalStatus.ok].filter(Boolean).length}/3 VALID`}</span></div>
      <div className="rc-review-grid">
        <ImagePreview asset={master} format="16:9" title={track.title} />
        <ImagePreview asset={square} format="1:1" title={track.title} />
        <ImagePreview asset={vertical} format="9:16" title={track.title} />
      </div>
      <p className="rc-review-note">The 1:1 and 9:16 variants are sibling derivatives of the MASTER. Neither is allowed to become the visual source of truth for the other.</p>
    </article>

    <div className="rc-bottom-grid">
      <article className="panel rc-copy-card">
        <div className="rc-section-head"><div><span className="eyebrow">RELEASE COPY</span><h3>Platform text</h3></div><button className="secondary-btn" type="button" onClick={() => setCopyPack(buildReleaseCopy(track))}>Reset copy</button></div>
        <label><span>SoundCloud · max 140</span><textarea value={copyPack.soundcloud} maxLength={140} onChange={event => setCopyPack(current => ({ ...current, soundcloud: event.target.value }))} /><small>{copyPack.soundcloud.length}/140</small></label>
        <label><span>Social</span><textarea value={copyPack.social} onChange={event => setCopyPack(current => ({ ...current, social: event.target.value }))} /></label>
        <label><span>Tags · comma separated</span><textarea value={copyPack.tags.join(', ')} onChange={event => setCopyPack(current => ({ ...current, tags: event.target.value.split(',').map(value => value.trim()).filter(Boolean).slice(0, 20) }))} /></label>
      </article>

      <article className="panel rc-export-card">
        <span className="eyebrow">EXPORT / NON-CANONICAL</span>
        <h3>{ready ? 'Campaign ready to package' : 'Partial campaign'}</h3>
        <p>ZIP includes available visual formats, prompts, logo reference, release copy, provenance and an explicit `canonicalWrite: false` manifest.</p>
        <button className="primary-btn" type="button" disabled={!master || exporting} onClick={() => { void exportCampaign(); }}>{exporting ? 'Building ZIP…' : ready ? 'Export complete Release Campaign ZIP' : 'Export partial campaign ZIP'}</button>
        <button className="secondary-btn" type="button" onClick={() => { void copyText(motionPrompt, 'motion'); }}>{copied === 'motion' ? 'Motion prompt copied ✓' : 'Copy optional 8s MASTER-anchored loop prompt'}</button>
        <small>Motion is recorded for the next slice; Build 48 does not pretend a provider video has been generated inside Studio.</small>
      </article>
    </div>
  </section>;
}
