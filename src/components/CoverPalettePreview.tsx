import { useEffect, useState } from 'react';
import { COVER_PALETTE_FIELDS, type CoverPalette } from '../cover-palette';

type EyeDropperConstructor = new () => { open: () => Promise<{ sRGBHex: string }> };
const validHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

export function CoverPalettePreview({
  palette,
  title = 'Cover palette',
  note,
  busy = false,
  actionLabel = 'Recalculate palette',
  onRecalculate,
  editable = false,
  onChange,
  fieldLabels,
}: {
  palette: CoverPalette | null;
  title?: string;
  note?: string;
  busy?: boolean;
  actionLabel?: string;
  onRecalculate?: () => void;
  editable?: boolean;
  onChange?: (palette: CoverPalette) => void;
  fieldLabels?: Partial<Record<keyof CoverPalette, string>>;
}) {
  const [drafts, setDrafts] = useState<CoverPalette>(palette || { accent: '#1db954', accent2: '#556bff' });
  const [pickerError, setPickerError] = useState<string | null>(null);
  const eyeDropper = (globalThis as typeof globalThis & { EyeDropper?: EyeDropperConstructor }).EyeDropper;

  useEffect(() => { if (palette) setDrafts(palette); }, [palette]);

  function commit(field: keyof CoverPalette, value: string) {
    const normalized = value.trim().toLowerCase();
    if (!validHex(normalized)) { setDrafts(palette || drafts); return; }
    const next = { ...(palette || drafts), [field]: normalized };
    setDrafts(next);
    onChange?.(next);
  }

  async function sample(field: keyof CoverPalette) {
    if (!eyeDropper) return;
    setPickerError(null);
    try {
      const result = await new eyeDropper().open();
      commit(field, result.sRGBHex);
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError') return;
      setPickerError('Color sampling was cancelled or unavailable. Use the color or HEX input instead.');
    }
  }

  return (
    <div className="cover-palette-preview" aria-live="polite">
      <div className="cover-palette-head">
        <div><strong>{title}</strong><span>{note || 'LaunchPAD theme colors from the canonical manifest.'}</span></div>
        {onRecalculate && <button className="ghost-btn compact" type="button" disabled={busy} onClick={onRecalculate}>{busy ? 'Extracting…' : actionLabel}</button>}
      </div>
      {palette ? (
        <div className="cover-palette-swatches" data-palette-fields={COVER_PALETTE_FIELDS.join(',')}>
          {COVER_PALETTE_FIELDS.map(field => {
            const label = fieldLabels?.[field] || field;
            return editable ? (
              <div className="cover-palette-swatch cover-palette-swatch--editable" key={field}>
                <input className="cover-color-input" type="color" aria-label={`${label} color picker`} value={validHex(drafts[field]) ? drafts[field] : palette[field]} onChange={event => commit(field, event.target.value)} />
                <label><b>{label}</b><input className="cover-hex-input" value={drafts[field]} inputMode="text" spellCheck={false} aria-label={`${label} HEX value`} onChange={event => setDrafts(previous => ({ ...previous, [field]: event.target.value }))} onBlur={event => commit(field, event.target.value)} onKeyDown={event => { if (event.key === 'Enter') commit(field, event.currentTarget.value); }} /></label>
                {eyeDropper && <button className="ghost-btn compact cover-eyedropper" type="button" onClick={() => void sample(field)} aria-label={`Sample ${label} from the screen`}>Sample</button>}
              </div>
            ) : (
              <div className="cover-palette-swatch" key={field}>
                <i style={{ backgroundColor: palette[field] }} aria-hidden="true" />
                <span><b>{label}</b><code>{palette[field]}</code></span>
              </div>
            );
          })}
        </div>
      ) : <p className="cover-palette-empty">Select a valid cover to preview both colors.</p>}
      {editable && !eyeDropper && <p className="cover-palette-support">Native eyedropper is not available in this browser. Color picker and HEX editing remain available.</p>}
      {pickerError && <p className="cover-palette-support warn">{pickerError}</p>}
    </div>
  );
}
