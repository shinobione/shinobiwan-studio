// Build125 / C6: SYNTHETIC-ONLY browser registry package lab.
// It can seal/open ONLY the three hardcoded fictional fixtures below.
// There is deliberately NO API accepting Catalogue Snapshot, registry JSON or user commercial content.
export type FictionalRegistryVariant = 'full' | 'rollback' | 'foreign';

export type FictionalRegistrySummary = {
  variant: FictionalRegistryVariant;
  registryId: string;
  revision: number;
  fingerprint: string;
  counts: {
    recordings: number;
    releases: number;
    appearances: number;
    evidence: number;
    unlinkedEvidence: number;
    pendingQa: number;
  };
};

export type FictionalRegistryComparison = {
  status: 'requires-review' | 'idempotent' | 'rollback-blocked' | 'foreign-blocked' | 'same-revision-conflict';
  canRestore: boolean;
  message: string;
};

export const FICTIONAL_REGISTRY_MAX_BYTES = 256 * 1024;
export const FICTIONAL_REGISTRY_FILE_NAMES: Record<FictionalRegistryVariant, string> = {
  full: 'fictional-commercial-registry-r1.scat',
  rollback: 'fictional-commercial-registry-r0.scat',
  foreign: 'fictional-commercial-registry-foreign.scat',
};

const FIXTURE_ID = 'invented-registry-browser-c6';
const FOREIGN_ID = 'invented-foreign-registry-browser-c6';
const MIN_ITERATIONS = 600_000;
const MAX_ITERATIONS = 1_200_000;
const ITERATIONS = MIN_ITERATIONS;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const HEADER_KEYS = ['magic', 'version', 'kdf', 'iterations', 'salt', 'cipher', 'nonce', 'tagBits', 'plaintextBytes'];
const ROOT_KEYS = ['header', 'ciphertext'];

const FULL_REGISTRY = {
  schema: 'shinocat-commercial-registry-v1',
  registryId: FIXTURE_ID,
  revision: 1,
  parentRevision: 0,
  sourceSnapshots: [
    {
      id: 'fictional-source-file',
      namespace: 'catalogue-v2-file',
      sourceRevision: 'fictional-input-revision',
      sourceSchema: 'catalogue-readonly-seed-v2',
      exporterContractVersion: 'a24b2-local-0.1.0',
      snapshotDate: '2026-01-01',
      sourceFile: 'invented-source.json',
      inputSha256: 'fictional-selected-input-digest',
      claimedWorkbookSha256: 'fictional-unverified-workbook-claim',
      digestAuthority: 'claim-only',
      coverage: 'partial',
      sections: [
        { name: 'Invented releases', sourceRows: 1, status: 'represented', bodyPreservation: 'normalized-or-counted-only', countMatchesArchivedV1: true },
        { name: 'Invented details', sourceRows: 2, status: 'partial', bodyPreservation: 'detailed-evidence', countMatchesArchivedV1: true },
        { name: 'Invented dashboard', sourceRows: 0, status: 'omitted', bodyPreservation: 'not-copied', countMatchesArchivedV1: null },
      ],
    },
    {
      id: 'fictional-source-distributor',
      namespace: 'imaginary-distributor',
      sourceRevision: 'fictional-input-revision',
      sourceSchema: 'catalogue-readonly-seed-v2',
      exporterContractVersion: 'a24b2-local-0.1.0',
      snapshotDate: '2026-01-01',
      sourceFile: 'invented-source.json',
      inputSha256: 'fictional-selected-input-digest',
      claimedWorkbookSha256: 'fictional-unverified-workbook-claim',
      digestAuthority: 'claim-only',
      coverage: 'partial',
      sections: [
        { name: 'Invented releases', sourceRows: 1, status: 'represented', bodyPreservation: 'normalized-or-counted-only', countMatchesArchivedV1: true },
        { name: 'Invented details', sourceRows: 2, status: 'partial', bodyPreservation: 'detailed-evidence', countMatchesArchivedV1: true },
        { name: 'Invented dashboard', sourceRows: 0, status: 'omitted', bodyPreservation: 'not-copied', countMatchesArchivedV1: null },
      ],
    },
  ],
  recordings: [
    { id: 'commercial-rec-A', title: 'An imaginary echo', version: null, isrc: null },
  ],
  releases: [
    {
      id: 'commercial-rel-A', title: 'Invented album', kind: 'album', upc: null,
      distributor: 'imaginary-distributor', source: 'imaginary-distributor',
      historicalDistributionStatus: 'historical-delivery-only', referenceDate: '2026-01-01',
    },
  ],
  appearances: [
    {
      id: 'commercial-app-A', releaseId: 'commercial-rel-A', position: 1,
      recordingId: 'commercial-rec-A', displayTitle: 'An imaginary echo',
      observedIsrc: null, status: 'unverified',
    },
  ],
  sourceAliases: [
    { namespace: 'imaginary-distributor', kind: 'recording', sourceId: 'imagined-rec-A', targetId: 'commercial-rec-A', snapshotId: 'fictional-source-distributor' },
    { namespace: 'imaginary-distributor', kind: 'release', sourceId: 'imagined-rel-A', targetId: 'commercial-rel-A', snapshotId: 'fictional-source-distributor' },
    { namespace: 'imaginary-distributor', kind: 'appearance', sourceId: 'imagined-app-A', targetId: 'commercial-app-A', snapshotId: 'fictional-source-distributor' },
  ],
  evidence: [
    {
      id: 'fictional-linked-detail', snapshotId: 'fictional-source-distributor',
      kind: 'distributor-detail', linkState: 'linked', sourceRecordAlias: 'fictional-detail-row-A',
      sourceLocator: 'invented-ledger/detail-A', observedAt: '2026-01-01T10:00:00Z',
      classification: 'historical-source-proof', payload: '{"Invented note":"linked fictional detail"}',
      targetKind: 'appearance', targetId: 'commercial-app-A', sourceReleaseId: 'imagined-rel-A',
      position: 1, linkIssueCode: null,
    },
    {
      id: 'fictional-unlinked-detail', snapshotId: 'fictional-source-distributor',
      kind: 'distributor-detail', linkState: 'unlinked', sourceRecordAlias: 'fictional-detail-row-B',
      sourceLocator: 'invented-ledger/detail-B', observedAt: '2026-01-01T10:05:00Z',
      classification: 'historical-source-proof', payload: '{"Invented note":"unlinked fictional detail"}',
      targetKind: null, targetId: null, sourceReleaseId: 'imagined-rel-unknown',
      position: null, linkIssueCode: 'EXACT_TARGET_NOT_FOUND',
    },
  ],
  findings: [
    {
      id: 'fictional-finding-linked', scope: 'target', sourceSnapshotId: null,
      targetKind: 'appearance', targetId: 'commercial-app-A', evidenceId: 'fictional-linked-detail',
      code: 'FICTIONAL_REVIEW_PENDING', locator: 'invented-ledger/detail-A', status: 'pending',
    },
    {
      id: 'fictional-finding-unlinked', scope: 'evidence', sourceSnapshotId: 'fictional-source-distributor',
      targetKind: null, targetId: null, evidenceId: 'fictional-unlinked-detail',
      code: 'EXACT_TARGET_NOT_FOUND', locator: 'invented-ledger/detail-B', status: 'pending',
    },
  ],
  reviewDecisions: [],
  channelEvents: [],
  audit: [
    {
      operationId: 'fictional-c6-reviewed-source-migration', revision: 1, parentRevision: 0,
      kind: 'reviewed-source-migration', targetId: FIXTURE_ID,
    },
  ],
} as const;

const ROLLBACK_REGISTRY = {
  schema: 'shinocat-commercial-registry-v1',
  registryId: FIXTURE_ID,
  revision: 0,
  parentRevision: null,
  sourceSnapshots: [],
  recordings: [],
  releases: [],
  appearances: [],
  sourceAliases: [],
  evidence: [],
  findings: [],
  reviewDecisions: [],
  channelEvents: [],
  audit: [],
} as const;

const FOREIGN_REGISTRY = {
  ...FULL_REGISTRY,
  registryId: FOREIGN_ID,
  audit: [
    {
      operationId: 'fictional-c6-foreign-migration', revision: 1, parentRevision: 0,
      kind: 'reviewed-source-migration', targetId: FOREIGN_ID,
    },
  ],
} as const;

const FIXTURES: Record<FictionalRegistryVariant, string> = {
  full: JSON.stringify(FULL_REGISTRY),
  rollback: JSON.stringify(ROLLBACK_REGISTRY),
  foreign: JSON.stringify(FOREIGN_REGISTRY),
};

type LabHeader = {
  magic: string;
  version: number;
  kdf: string;
  iterations: number;
  salt: string;
  cipher: string;
  nonce: string;
  tagBits: number;
  plaintextBytes: number;
};
type LabEnvelope = { header: LabHeader; ciphertext: string };

const failure = (): never => { throw new Error('Cannot open or verify fictional registry package.'); };
const hasKeys = (value: unknown, fields: readonly string[]): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) &&
  JSON.stringify(Object.keys(value)) === JSON.stringify(fields);

function base64url(value: Uint8Array): string {
  let raw = '';
  for (const byte of value) raw += String.fromCharCode(byte);
  return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function bytes(value: unknown, exactLength?: number): Uint8Array {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return failure();
  try {
    const decoded = Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    if (base64url(decoded) !== value || (exactLength !== undefined && decoded.length !== exactLength)) return failure();
    return decoded;
  } catch { return failure(); }
}
async function derive(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  if (typeof passphrase !== 'string' || passphrase.length < 12 || passphrase.length > 1024) return failure();
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  );
}
async function digest(text: string): Promise<string> {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
  return Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
}
function variantForPlaintext(plain: string): FictionalRegistryVariant {
  for (const variant of Object.keys(FIXTURES) as FictionalRegistryVariant[]) {
    if (plain === FIXTURES[variant]) return variant;
  }
  return failure();
}
async function summarize(variant: FictionalRegistryVariant): Promise<FictionalRegistrySummary> {
  const plain = FIXTURES[variant];
  const registry = JSON.parse(plain) as typeof FULL_REGISTRY;
  return {
    variant,
    registryId: registry.registryId,
    revision: registry.revision,
    fingerprint: await digest(plain),
    counts: {
      recordings: registry.recordings.length,
      releases: registry.releases.length,
      appearances: registry.appearances.length,
      evidence: registry.evidence.length,
      unlinkedEvidence: registry.evidence.filter(row => row.linkState === 'unlinked').length,
      pendingQa: registry.findings.filter(row => row.status === 'pending').length,
    },
  };
}

export async function getInitialFictionalRegistryState(): Promise<FictionalRegistrySummary> {
  return summarize('rollback');
}

export async function sealFictionalRegistryPackage(
  passphrase: string,
  variant: FictionalRegistryVariant = 'full',
): Promise<string> {
  if (!globalThis.isSecureContext) return failure();
  const plain = encoder.encode(FIXTURES[variant]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const header: LabHeader = {
    magic: 'SHINOCAT-PKG', version: 1, kdf: 'PBKDF2-HMAC-SHA256',
    iterations: ITERATIONS, salt: base64url(salt), cipher: 'AES-256-GCM',
    nonce: base64url(nonce), tagBits: 128, plaintextBytes: plain.byteLength,
  };
  const key = await derive(passphrase, salt, ITERATIONS);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
    name: 'AES-GCM', iv: nonce, additionalData: encoder.encode(JSON.stringify(header)), tagLength: 128,
  }, key, plain));
  const envelope: LabEnvelope = { header, ciphertext: base64url(ciphertext) };
  return JSON.stringify(envelope);
}

export async function openFictionalRegistryPackage(
  raw: string,
  passphrase: string,
): Promise<FictionalRegistrySummary> {
  if (!globalThis.isSecureContext || !raw || encoder.encode(raw).byteLength > FICTIONAL_REGISTRY_MAX_BYTES) return failure();
  let root: unknown;
  try { root = JSON.parse(raw); } catch { return failure(); }
  if (!hasKeys(root, ROOT_KEYS) || JSON.stringify(root) !== raw || !hasKeys(root.header, HEADER_KEYS) ||
      typeof root.ciphertext !== 'string') return failure();
  const h = root.header;
  if (h.magic !== 'SHINOCAT-PKG' || h.version !== 1 || h.kdf !== 'PBKDF2-HMAC-SHA256' ||
      h.cipher !== 'AES-256-GCM' || h.tagBits !== 128 ||
      !Number.isSafeInteger(h.iterations) || (h.iterations as number) < MIN_ITERATIONS ||
      (h.iterations as number) > MAX_ITERATIONS ||
      !Number.isSafeInteger(h.plaintextBytes) || (h.plaintextBytes as number) < 1 ||
      (h.plaintextBytes as number) > FICTIONAL_REGISTRY_MAX_BYTES) return failure();
  const salt = bytes(h.salt, 16), nonce = bytes(h.nonce, 12), ciphertext = bytes(root.ciphertext);
  if (ciphertext.length !== (h.plaintextBytes as number) + 16) return failure();
  try {
    const key = await derive(passphrase, salt, h.iterations as number);
    const opened = await crypto.subtle.decrypt({
      name: 'AES-GCM', iv: nonce, additionalData: encoder.encode(JSON.stringify(h)), tagLength: 128,
    }, key, ciphertext);
    const plain = decoder.decode(opened);
    const variant = variantForPlaintext(plain);
    return summarize(variant);
  } catch { return failure(); }
}

export function compareFictionalRegistry(
  current: FictionalRegistrySummary,
  candidate: FictionalRegistrySummary,
): FictionalRegistryComparison {
  if (candidate.registryId !== current.registryId) {
    return { status: 'foreign-blocked', canRestore: false, message: 'Blocked foreign fictional registry.' };
  }
  if (candidate.revision < current.revision) {
    return { status: 'rollback-blocked', canRestore: false, message: `Blocked fictional rollback: revision ${candidate.revision} is older than current revision ${current.revision}.` };
  }
  if (candidate.revision === current.revision) {
    if (candidate.fingerprint === current.fingerprint) {
      return { status: 'idempotent', canRestore: false, message: 'Candidate authenticated. Same verified fictional revision; no restore needed.' };
    }
    return { status: 'same-revision-conflict', canRestore: false, message: 'Blocked fictional same-revision conflict.' };
  }
  return {
    status: 'requires-review', canRestore: true,
    message: `Candidate authenticated. Fictional revision ${candidate.revision} requires explicit restore review.`,
  };
}
