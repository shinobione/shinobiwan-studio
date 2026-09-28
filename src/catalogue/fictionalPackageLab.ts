// Build124 / C3b: deliberately FICTIONAL-only lab codec. Not a commercial registry codec.
// The sole encryptable/decryptable plaintext is the fixed invented fixture below.
// Never pass a Catalogue Snapshot, workbook, owner evidence or real credentials here.
const FICTIONAL_PAYLOAD = JSON.stringify({
  schema: 'shinocat-fictional-lab-only',
  registry: 'invented-cartoon-registry',
  revision: 3,
  observations: ['imaginary-comet', 'pretend-orbit'],
});

export const FICTIONAL_PACKAGE_NAME = 'fictional-catalogue-lab.scat';
export const FICTIONAL_PACKAGE_MAX_BYTES = 64 * 1024;
const MIN_ITERATIONS = 600_000;
const MAX_ITERATIONS = 1_200_000;
const ITERATIONS = MIN_ITERATIONS;
const HEADER_KEYS = ['magic', 'version', 'kdf', 'iterations', 'salt', 'cipher', 'nonce', 'tagBits', 'plaintextBytes'];
const ROOT_KEYS = ['header', 'ciphertext'];
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

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
type Inspected = { header: LabHeader; salt: Uint8Array; nonce: Uint8Array; ciphertext: Uint8Array };

const failure = (): never => { throw new Error('Cannot open or verify fictional lab package.'); };
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
function inspect(raw: string): Inspected {
  if (!raw || encoder.encode(raw).byteLength > FICTIONAL_PACKAGE_MAX_BYTES) return failure();
  let root: unknown;
  try { root = JSON.parse(raw); } catch { return failure(); }
  if (!hasKeys(root, ROOT_KEYS) || JSON.stringify(root) !== raw || !hasKeys(root.header, HEADER_KEYS) ||
      typeof root.ciphertext !== 'string') return failure();
  const h = root.header;
  if (h.magic !== 'SHINOCAT-PKG' || h.version !== 1 || h.kdf !== 'PBKDF2-HMAC-SHA256' ||
      h.cipher !== 'AES-256-GCM' || h.tagBits !== 128 ||
      !Number.isSafeInteger(h.iterations) || (h.iterations as number) < MIN_ITERATIONS ||
      (h.iterations as number) > MAX_ITERATIONS ||
      h.plaintextBytes !== encoder.encode(FICTIONAL_PAYLOAD).byteLength) return failure();
  const salt = bytes(h.salt, 16), nonce = bytes(h.nonce, 12), ciphertext = bytes(root.ciphertext);
  if (ciphertext.length !== (h.plaintextBytes as number) + 16) return failure();
  return { header: h as LabHeader, salt, nonce, ciphertext };
}
async function derive(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  if (typeof passphrase !== 'string' || passphrase.length < 12 || passphrase.length > 1024) return failure();
  const original = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    original, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export async function sealFictionalPackage(passphrase: string): Promise<string> {
  if (!globalThis.isSecureContext) return failure();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const plain = encoder.encode(FICTIONAL_PAYLOAD);
  const header: LabHeader = {
    magic: 'SHINOCAT-PKG', version: 1, kdf: 'PBKDF2-HMAC-SHA256',
    iterations: ITERATIONS, salt: base64url(salt), cipher: 'AES-256-GCM',
    nonce: base64url(nonce), tagBits: 128, plaintextBytes: plain.byteLength,
  };
  const key = await derive(passphrase, salt, header.iterations);
  const sealed = new Uint8Array(await crypto.subtle.encrypt({
    name: 'AES-GCM', iv: nonce, additionalData: encoder.encode(JSON.stringify(header)), tagLength: 128,
  }, key, plain));
  const result: LabEnvelope = { header, ciphertext: base64url(sealed) };
  return JSON.stringify(result);
}

export async function openFictionalPackage(raw: string, passphrase: string): Promise<void> {
  if (!globalThis.isSecureContext) return failure();
  const input = inspect(raw); // strict preflight before a costly KDF
  try {
    const key = await derive(passphrase, input.salt, input.header.iterations);
    const opened = await crypto.subtle.decrypt({
      name: 'AES-GCM', iv: input.nonce, additionalData: encoder.encode(JSON.stringify(input.header)),
      tagLength: 128,
    }, key, input.ciphertext);
    if (decoder.decode(opened) !== FICTIONAL_PAYLOAD) return failure();
  } catch { return failure(); }
  // Never return any plaintext, commercial snapshot or mutable registry.
}
