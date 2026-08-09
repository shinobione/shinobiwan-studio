import { COVER_PALETTE_FIELDS, type CoverPalette } from '../cover-palette';

export function CoverPalettePreview({
  palette,
  title = 'Cover palette',
  note,
  busy = false,
  actionLabel = 'Recalculate palette',
  onRecalculate,
}: {
  palette: CoverPalette | null;
  title?: string;
  note?: string;
  busy?: boolean;
  actionLabel?: string;
  onRecalculate?: () => void;
}) {
  return (
    <div className="cover-palette-preview" aria-live="polite">
      <div className="cover-palette-head">
        <div><strong>{title}</strong><span>{note || 'LaunchPAD theme colors from the canonical manifest.'}</span></div>
        {onRecalculate && <button className="ghost-btn compact" type="button" disabled={busy} onClick={onRecalculate}>{busy ? 'Extracting…' : actionLabel}</button>}
      </div>
      {palette ? (
        <div className="cover-palette-swatches" data-palette-fields={COVER_PALETTE_FIELDS.join(',')}>
          {COVER_PALETTE_FIELDS.map(field => (
            <div className="cover-palette-swatch" key={field}>
              <i style={{ backgroundColor: palette[field] }} aria-hidden="true" />
              <span><b>{field}</b><code>{palette[field]}</code></span>
            </div>
          ))}
        </div>
      ) : <p className="cover-palette-empty">Select a valid cover to preview both colors.</p>}
    </div>
  );
}
