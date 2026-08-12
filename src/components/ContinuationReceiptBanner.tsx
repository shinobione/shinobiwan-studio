import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONTINUATION_RECEIPT_EVENT,
  parseContinuationReceipt,
  parseStandaloneLyricsReceipt,
  receiptSourceLabel,
  type ContinuationReceipt,
  type ContinuationReceiptView,
} from '../phase7-receipts';
import { getCatalogTrack } from '../services/catalog-api';
import { studioConfig } from '../services/config';
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

  if (!receipt) return null;

  return (
    <aside className={`continuation-receipt ${receipt.status}`} role="status" aria-live="polite">
      <i className="continuation-receipt-dot" aria-hidden="true" />
      <div className="continuation-receipt-copy">
        <span>{receiptSourceLabel(receipt.source)} / {receipt.operation.replaceAll('-', ' ')}</span>
        <strong>{receiptTitle(receipt)}</strong>
        <small>{receipt.summary} {receipt.verificationDetail}</small>
      </div>
      <button className="continuation-receipt-dismiss" type="button" aria-label="Dismiss continuation receipt" onClick={() => setReceipt(null)}>×</button>
    </aside>
  );
}
