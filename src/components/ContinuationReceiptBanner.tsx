import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONTINUATION_RECEIPT_EVENT,
  parseContinuationReceipt,
  parseStandaloneLyricsReceipt,
  receiptSourceLabel,
  type ContinuationReceipt,
  type ContinuationReceiptView,
} from '../phase7-receipts';
import { routeHref } from '../router';
import { getCatalogTrack } from '../services/catalog-api';
import { studioConfig } from '../services/config';
import { deleteAdminTrackResilient, TrackDeleteError } from '../services/track-delete-admin-api';
import type { StudioTrackDetail } from '../types/studio';

function receiptTitle(receipt: ContinuationReceiptView): string {
  if (receipt.status === 'verifying') return 'Verifying canonical state…';
  if (receipt.status === 'verified') return 'Canonical reread verified';
  if (receipt.status === 'review-only') return 'Review receipt received';
  return 'Receipt not canonically verified';
}

function verifyOperationEvidence(receipt: ContinuationReceipt, canonical: StudioTrackDetail): void {
  if (receipt.operation === 'lyrics-saved' && !canonical.assets.lyricsTxt) {
    throw new Error('Canonical private reread does not expose lyrics.txt after the reported save.');
  }
  if (receipt.operation === 'analysis-saved' && !canonical.audioIntelligence.available) {
    throw new Error('Canonical private reread does not expose a saved SonicTrace profile after the reported save.');
  }
}

export function ContinuationReceiptBanner({ trackId, onCanonicalVerified }: { trackId: string; onCanonicalVerified: (track: StudioTrackDetail) => void }) {
  const [receipt, setReceipt] = useState<ContinuationReceiptView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const verificationEpoch = useRef(0);

  const handleReceipt = useCallback(async (next: ContinuationReceipt) => {
    if (next.trackId !== trackId) return;
    const epoch = ++verificationEpoch.current;
    const receivedAt = new Date().toISOString();

    if (next.effect === 'review-only') {
      setReceipt({
        ...next,
        status: 'review-only',
        receivedAt,
        verificationDetail: 'Review-only result. No canonical write is expected or authorized.',
      });
      return;
    }

    setReceipt({
      ...next,
      status: 'verifying',
      receivedAt,
      verificationDetail: 'Re-reading the canonical private Track through Track Manager.',
    });

    try {
      const canonical = await getCatalogTrack(next.trackId);
      if (epoch !== verificationEpoch.current) return;
      if (canonical.id !== trackId) throw new Error('Canonical reread returned a different trackId.');
      if (canonical.readSource !== 'private') throw new Error('Private canonical reread is unavailable. Public fallback cannot verify a write receipt.');
      verifyOperationEvidence(next, canonical);
      onCanonicalVerified(canonical);
      setReceipt({
        ...next,
        status: 'verified',
        receivedAt,
        verificationDetail: 'Track Manager private reread succeeded. Studio is displaying canonical state, not optimistic child state.',
      });
    } catch (reason) {
      if (epoch !== verificationEpoch.current) return;
      setReceipt({
        ...next,
        status: 'verification-error',
        receivedAt,
        verificationDetail: reason instanceof Error ? reason.message : String(reason),
      });
    }
  }, [onCanonicalVerified, trackId]);

  useEffect(() => {
    verificationEpoch.current += 1;
    setReceipt(null);
    setDeleteError(null);
    setDeleting(false);
  }, [trackId]);

  useEffect(() => {
    const onInternalReceipt = (event: Event) => {
      const candidate = parseContinuationReceipt((event as CustomEvent<unknown>).detail);
      if (candidate) void handleReceipt(candidate);
    };

    let lrcOrigin: string | null = null;
    try {
      lrcOrigin = new URL(studioConfig.lrcMakerUrl).origin;
    } catch {
      lrcOrigin = null;
    }

    const onStandaloneLyrics = (event: MessageEvent) => {
      if (!lrcOrigin || event.origin !== lrcOrigin) return;
      const candidate = parseStandaloneLyricsReceipt(event.data);
      if (candidate) void handleReceipt(candidate);
    };

    globalThis.addEventListener(CONTINUATION_RECEIPT_EVENT, onInternalReceipt);
    globalThis.addEventListener('message', onStandaloneLyrics);
    return () => {
      globalThis.removeEventListener(CONTINUATION_RECEIPT_EVENT, onInternalReceipt);
      globalThis.removeEventListener('message', onStandaloneLyrics);
    };
  }, [handleReceipt]);

  async function deleteCurrentTrack() {
    if (deleting) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      const canonical = await getCatalogTrack(trackId);
      if (canonical.id !== trackId || canonical.readSource !== 'private' || !canonical.updatedAt) {
        throw new TrackDeleteError('Safe Track Delete requires the exact current Track from the private canonical read layer.', null, 'TRACK_DELETE_PRIVATE_READ_REQUIRED');
      }

      const typed = globalThis.prompt(
        `Delete canonical Track “${canonical.title}”\n\nType the exact canonical Track ID to continue:\n${canonical.id}`,
      );
      if (typed === null) return;
      if (typed.trim() !== canonical.id) {
        throw new TrackDeleteError(`Track ID confirmation does not match “${canonical.id}”. Nothing was sent.`, null, 'TRACK_DELETE_CONFIRMATION_MISMATCH');
      }

      const confirmed = globalThis.confirm(
        `Permanently delete “${canonical.title}” (${canonical.id})?\n\nThis removes the Track manifest and every Track-scoped asset. If a canonical Album still owns this Track, Track Manager will BLOCK the deletion instead of changing Album membership implicitly.`,
      );
      if (!confirmed) return;

      const result = await deleteAdminTrackResilient(canonical.id, canonical.updatedAt);
      if (!result.clientVerified) {
        throw new TrackDeleteError(result.verificationWarning || 'Track deletion could not be canonically verified.', null, 'TRACK_DELETE_UNVERIFIED');
      }
      globalThis.location.assign(routeHref('catalog'));
    } catch (reason) {
      if (reason instanceof TrackDeleteError) {
        const owner = reason.code === 'TRACK_DELETE_ALBUM_OWNED' && reason.albumId
          ? ` Remove it from canonical Album “${reason.albumTitle || reason.albumId}” (${reason.albumId}) first.`
          : '';
        const retry = reason.retrySafe ? ' An explicit retry is safe after connectivity or Access is restored.' : '';
        setDeleteError(`${reason.message}${owner}${retry}${reason.code ? ` [${reason.code}]` : ''}`);
      } else {
        setDeleteError(reason instanceof Error ? reason.message : String(reason));
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {receipt && (
        <aside className={`continuation-receipt ${receipt.status}`} role="status" aria-live="polite">
          <i className="continuation-receipt-dot" aria-hidden="true" />
          <div className="continuation-receipt-copy">
            <span>{receiptSourceLabel(receipt.source)} / {receipt.operation.replaceAll('-', ' ')}</span>
            <strong>{receiptTitle(receipt)}</strong>
            <small>{receipt.summary} {receipt.verificationDetail}</small>
          </div>
          <button className="continuation-receipt-dismiss" type="button" aria-label="Dismiss continuation receipt" onClick={() => setReceipt(null)}>×</button>
        </aside>
      )}

      <section className="panel workspace-focus-handoff" aria-label="Current Track actions">
        <div>
          <span className="eyebrow">TRACK ACTIONS</span>
          <h3>Current Track</h3>
          <p>Permanent deletion is available here on the Track itself. Exact ID confirmation and canonical verification are required.</p>
        </div>
        <button className="ghost-btn" type="button" disabled={deleting} onClick={() => void deleteCurrentTrack()}>{deleting ? 'Checking…' : 'Delete Track…'}</button>
      </section>
      {deleteError && <div className="album-error" role="alert">{deleteError}</div>}
    </>
  );
}
