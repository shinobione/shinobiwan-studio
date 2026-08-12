export type ContinuationReceiptSource = 'lrc-maker' | 'sonictrace' | 'track-to-market';
export type ContinuationReceiptEffect = 'canonical-write' | 'review-only';

export interface ContinuationReceipt {
  version: 1;
  trackId: string;
  source: ContinuationReceiptSource;
  operation: 'lyrics-saved' | 'analysis-saved' | 'final-pack-received';
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

const SOURCE_OPERATIONS: Record<ContinuationReceiptSource, ReadonlySet<ContinuationReceipt['operation']>> = {
  'lrc-maker': new Set(['lyrics-saved']),
  sonictrace: new Set(['analysis-saved']),
  'track-to-market': new Set(['final-pack-received']),
};

export function makeContinuationReceipt(input: Omit<ContinuationReceipt, 'version' | 'emittedAt'> & { emittedAt?: string }): ContinuationReceipt {
  if (!input.trackId.trim()) throw new Error('Continuation receipt requires a canonical trackId.');
  if (!SOURCE_OPERATIONS[input.source].has(input.operation)) {
    throw new Error(`Unsupported continuation receipt ${input.source}:${input.operation}.`);
  }
  if (input.source === 'track-to-market' && input.effect !== 'review-only') {
    throw new Error('Track-To-Market receipts are review-only until a canonical persistence contract exists.');
  }
  if (input.source !== 'track-to-market' && input.effect !== 'canonical-write') {
    throw new Error(`${input.source} completion receipts must be canonically re-read.`);
  }

  return {
    version: 1,
    trackId: input.trackId,
    source: input.source,
    operation: input.operation,
    effect: input.effect,
    summary: input.summary,
    detail: input.detail,
    sourceRevision: input.sourceRevision,
    emittedAt: input.emittedAt || new Date().toISOString(),
  };
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
    summary: 'Lyrics synchronization saved.',
    detail: 'Standalone LRC Maker reported a completed save. Studio will verify it from the canonical Track read layer.',
    sourceRevision: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  });
}

export function receiptSourceLabel(source: ContinuationReceiptSource): string {
  if (source === 'lrc-maker') return 'LRC Maker';
  if (source === 'sonictrace') return 'SonicTrace';
  return 'Track-To-Market';
}
