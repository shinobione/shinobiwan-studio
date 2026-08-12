export type ContinuationReceiptSource = 'lrc-maker' | 'sonictrace' | 'release-campaign';
export type ContinuationReceiptEffect = 'canonical-write' | 'review-only';
export type ContinuationReceiptOperation = 'lyrics-saved' | 'analysis-saved' | 'campaign-exported';

export interface ContinuationReceipt {
  version: 1;
  trackId: string;
  source: ContinuationReceiptSource;
  operation: ContinuationReceiptOperation;
  effect: ContinuationReceiptEffect;
  summary: string;
  detail?: string;
  sourceRevision?: string;
  emittedAt: string;
}

export type ContinuationVerificationStatus = 'verifying' | 'verified' | 'review-only' | 'verification-error';

export interface ContinuationReceiptView extends ContinuationReceipt {
  status: ContinuationVerificationStatus;
  receivedAt: string;
  verificationDetail: string;
}

export const CONTINUATION_RECEIPT_EVENT = 'shinobiwan:continuation-receipt:v1';

const SOURCE_OPERATIONS: Record<ContinuationReceiptSource, ReadonlyMap<ContinuationReceiptOperation, ContinuationReceiptEffect>> = {
  'lrc-maker': new Map([['lyrics-saved', 'canonical-write']]),
  sonictrace: new Map([['analysis-saved', 'canonical-write']]),
  'release-campaign': new Map([['campaign-exported', 'review-only']]),
};

export function makeContinuationReceipt(input: Omit<ContinuationReceipt, 'version' | 'emittedAt'> & { emittedAt?: string }): ContinuationReceipt {
  const trackId = input.trackId.trim();
  if (!trackId) throw new Error('Continuation receipt requires a canonical trackId.');

  const expectedEffect = SOURCE_OPERATIONS[input.source]?.get(input.operation);
  if (!expectedEffect || expectedEffect !== input.effect) {
    throw new Error(`Unsupported continuation receipt ${input.source}:${input.operation}:${input.effect}.`);
  }

  return {
    version: 1,
    trackId,
    source: input.source,
    operation: input.operation,
    effect: input.effect,
    summary: input.summary,
    detail: input.detail,
    sourceRevision: input.sourceRevision,
    emittedAt: input.emittedAt || new Date().toISOString(),
  };
}

export function parseContinuationReceipt(value: unknown): ContinuationReceipt | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Partial<ContinuationReceipt>;
  if (data.version !== 1 || typeof data.trackId !== 'string' || typeof data.source !== 'string' || typeof data.operation !== 'string' || typeof data.effect !== 'string' || typeof data.summary !== 'string') return null;

  try {
    return makeContinuationReceipt({
      trackId: data.trackId,
      source: data.source as ContinuationReceiptSource,
      operation: data.operation as ContinuationReceiptOperation,
      effect: data.effect as ContinuationReceiptEffect,
      summary: data.summary,
      detail: typeof data.detail === 'string' ? data.detail : undefined,
      sourceRevision: typeof data.sourceRevision === 'string' ? data.sourceRevision : undefined,
      emittedAt: typeof data.emittedAt === 'string' ? data.emittedAt : undefined,
    });
  } catch {
    return null;
  }
}

export function parseStandaloneLyricsReceipt(value: unknown): ContinuationReceipt | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as { type?: unknown; trackId?: unknown; updatedAt?: unknown };
  if (data.type !== 'shinobiwan:lyrics-saved:v1' || typeof data.trackId !== 'string' || !data.trackId.trim()) return null;

  return makeContinuationReceipt({
    trackId: data.trackId,
    source: 'lrc-maker',
    operation: 'lyrics-saved',
    effect: 'canonical-write',
    summary: 'Lyrics save completed.',
    detail: 'Standalone LRC Maker reported a save. Studio must reread the private canonical Track before verification.',
    sourceRevision: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  });
}

export function emitContinuationReceipt(receipt: ContinuationReceipt): void {
  globalThis.dispatchEvent(new CustomEvent<ContinuationReceipt>(CONTINUATION_RECEIPT_EVENT, { detail: receipt }));
}

export function receiptSourceLabel(source: ContinuationReceiptSource): string {
  if (source === 'lrc-maker') return 'LRC Maker';
  if (source === 'sonictrace') return 'SonicTrace';
  return 'Release Campaign';
}
