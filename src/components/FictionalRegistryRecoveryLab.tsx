import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FICTIONAL_REGISTRY_FILE_NAMES,
  FICTIONAL_REGISTRY_MAX_BYTES,
  compareFictionalRegistry,
  getInitialFictionalRegistryState,
  openFictionalRegistryPackage,
  sealFictionalRegistryPackage,
  type FictionalRegistryComparison,
  type FictionalRegistrySummary,
  type FictionalRegistryVariant,
} from '../catalogue/fictionalRegistryLab';
import './fictional-registry-recovery-lab.css';

type DownloadUrls = Partial<Record<FictionalRegistryVariant, string>>;

export function FictionalRegistryRecoveryLab() {
  const [passphrase, setPassphrase] = useState('');
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState('Preparing fictional registry state…');
  const [current, setCurrent] = useState<FictionalRegistrySummary | null>(null);
  const [candidate, setCandidate] = useState<FictionalRegistrySummary | null>(null);
  const [comparison, setComparison] = useState<FictionalRegistryComparison | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<DownloadUrls>({});
  const sequence = useRef(0);
  const urls = useRef<DownloadUrls>({});
  const filePicker = useRef<HTMLInputElement>(null);

  const revokeAll = () => {
    for (const url of Object.values(urls.current)) if (url) URL.revokeObjectURL(url);
    urls.current = {};
    setDownloadUrls({});
  };

  const revokeVariant = (variant: FictionalRegistryVariant) => {
    const url = urls.current[variant];
    if (url) URL.revokeObjectURL(url);
    delete urls.current[variant];
    setDownloadUrls({ ...urls.current });
  };

  const resetState = async () => {
    const generation = ++sequence.current;
    revokeAll();
    if (filePicker.current) filePicker.current.value = '';
    setPassphrase('');
    setCandidate(null);
    setComparison(null);
    setBusy(true);
    setStatus('Resetting fictional registry state…');
    try {
      const initial = await getInitialFictionalRegistryState();
      if (sequence.current !== generation) return;
      setCurrent(initial);
      setStatus('Fictional registry is at revision 0. Nothing is persisted.');
    } catch {
      if (sequence.current === generation) setStatus('Cannot prepare fictional registry state.');
    } finally {
      if (sequence.current === generation) setBusy(false);
    }
  };

  useEffect(() => {
    void resetState();
    return () => {
      sequence.current++;
      for (const url of Object.values(urls.current)) if (url) URL.revokeObjectURL(url);
      urls.current = {};
    };
  }, []);

  const generate = async (variant: FictionalRegistryVariant) => {
    const generation = ++sequence.current;
    revokeVariant(variant);
    setBusy(true);
    setCandidate(null);
    setComparison(null);
    setStatus(
      variant === 'full'
        ? 'Encrypting full fictional commercial registry locally…'
        : variant === 'rollback'
          ? 'Encrypting older fictional rollback fixture locally…'
          : 'Encrypting foreign fictional registry fixture locally…',
    );
    try {
      const raw = await sealFictionalRegistryPackage(passphrase, variant);
      if (sequence.current !== generation) return;
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/octet-stream' }));
      urls.current[variant] = url;
      setDownloadUrls({ ...urls.current });
      setStatus(
        variant === 'full'
          ? 'Fictional revision 1 package ready. Download it, then reopen that downloaded file.'
          : 'Synthetic adversarial fixture ready for download and reopen testing.',
      );
    } catch {
      if (sequence.current === generation) setStatus('Cannot generate fictional registry package.');
    } finally {
      if (sequence.current === generation) {
        setPassphrase('');
        setBusy(false);
      }
    }
  };

  const reopen = async (file: File) => {
    const generation = ++sequence.current;
    setBusy(true);
    setCandidate(null);
    setComparison(null);
    setStatus('Authenticating selected fictional registry package locally…');
    try {
      if (!current || file.size === 0 || file.size > FICTIONAL_REGISTRY_MAX_BYTES) {
        throw new Error('Invalid fictional registry file.');
      }
      const raw = await file.text();
      if (sequence.current !== generation) return;
      const next = await openFictionalRegistryPackage(raw, passphrase);
      if (sequence.current !== generation) return;
      const result = compareFictionalRegistry(current, next);
      setCandidate(next);
      setComparison(result);
      setStatus(result.message);
    } catch {
      if (sequence.current === generation) setStatus('Cannot open or verify fictional registry package.');
    } finally {
      if (sequence.current === generation) {
        setPassphrase('');
        setBusy(false);
        if (filePicker.current) filePicker.current.value = '';
      }
    }
  };

  const approveRestore = () => {
    if (!candidate || !comparison?.canRestore) return;
    setCurrent(candidate);
    setCandidate(null);
    setComparison(null);
    setStatus(`Fictional restore applied in memory. Current revision is ${candidate.revision}. Nothing was persisted.`);
  };

  const currentCounts = useMemo(() => current?.counts ?? null, [current]);

  return (
    <section className="fictional-registry-recovery-lab" aria-label="Full fictional commercial registry recovery lab">
      <p className="commercial-catalogue-eyebrow">C6 · FULL SYNTHETIC REGISTRY RECOVERY</p>
      <h3>Rehearse a complete commercial registry restore</h3>
      <p>
        This browser flow contains one hardcoded invented registry only. It cannot ingest your Catalogue JSON,
        export your private source, or write to R2, Worker, LaunchPAD, browser storage or Studio commercial state.
      </p>

      <div className="fictional-registry-state" aria-label="Current fictional registry state">
        <div>
          <span>Current registry</span>
          <strong>{current ? `Revision ${current.revision}` : 'Preparing…'}</strong>
        </div>
        <div>
          <span>Recordings</span><strong>{currentCounts?.recordings ?? '—'}</strong>
        </div>
        <div>
          <span>Releases</span><strong>{currentCounts?.releases ?? '—'}</strong>
        </div>
        <div>
          <span>Appearances</span><strong>{currentCounts?.appearances ?? '—'}</strong>
        </div>
        <div>
          <span>Evidence</span><strong>{currentCounts?.evidence ?? '—'}</strong>
        </div>
        <div>
          <span>Unlinked</span><strong>{currentCounts?.unlinkedEvidence ?? '—'}</strong>
        </div>
        <div>
          <span>Pending QA</span><strong>{currentCounts?.pendingQa ?? '—'}</strong>
        </div>
      </div>

      <label htmlFor="fictional-registry-passphrase">
        Fictional registry test passphrase (re-enter before each open)
      </label>
      <input
        id="fictional-registry-passphrase"
        type="password"
        autoComplete="off"
        minLength={12}
        maxLength={1024}
        value={passphrase}
        onChange={event => setPassphrase(event.currentTarget.value)}
        disabled={busy}
        aria-describedby="fictional-registry-privacy"
      />

      <div className="fictional-registry-actions">
        <button
          type="button"
          disabled={busy || passphrase.length < 12}
          onClick={() => void generate('full')}
        >
          Generate full fictional revision 1
        </button>
        {downloadUrls.full && (
          <a href={downloadUrls.full} download={FICTIONAL_REGISTRY_FILE_NAMES.full}>
            Download full fictional registry
          </a>
        )}

        <label htmlFor="fictional-registry-file">Open downloaded fictional registry</label>
        <input
          ref={filePicker}
          id="fictional-registry-file"
          type="file"
          accept=".scat,application/octet-stream"
          disabled={busy || passphrase.length < 12 || !current}
          onChange={event => {
            const file = event.currentTarget.files?.[0];
            if (file) void reopen(file);
          }}
        />

        {candidate && (
          <div className="fictional-registry-candidate" aria-label="Authenticated fictional candidate">
            <span>Authenticated candidate</span>
            <strong>Revision {candidate.revision}</strong>
            <small>
              {candidate.counts.recordings} recording · {candidate.counts.releases} release ·{' '}
              {candidate.counts.appearances} appearance · {candidate.counts.unlinkedEvidence} unlinked evidence
            </small>
          </div>
        )}

        {comparison?.canRestore && (
          <button type="button" disabled={busy} onClick={approveRestore}>
            Approve fictional restore to revision {candidate?.revision}
          </button>
        )}

        <details>
          <summary>Adversarial fictional fixtures</summary>
          <p>These remain invented-only and exist to exercise rollback and foreign-registry rejection.</p>
          <div className="fictional-registry-adversarial-actions">
            <button
              type="button"
              disabled={busy || passphrase.length < 12}
              onClick={() => void generate('rollback')}
            >
              Generate revision 0 rollback fixture
            </button>
            {downloadUrls.rollback && (
              <a href={downloadUrls.rollback} download={FICTIONAL_REGISTRY_FILE_NAMES.rollback}>
                Download rollback fixture
              </a>
            )}
            <button
              type="button"
              disabled={busy || passphrase.length < 12}
              onClick={() => void generate('foreign')}
            >
              Generate foreign registry fixture
            </button>
            {downloadUrls.foreign && (
              <a href={downloadUrls.foreign} download={FICTIONAL_REGISTRY_FILE_NAMES.foreign}>
                Download foreign fixture
              </a>
            )}
          </div>
        </details>

        <button type="button" onClick={() => void resetState()}>
          Reset full fictional registry lab
        </button>
      </div>

      <p role="status" aria-live="polite" aria-atomic="true">{status}</p>
      <p id="fictional-registry-privacy">
        Downloading a synthetic file is not proof of a durable real backup. This lab keeps only transient in-memory
        fictional state and deliberately cannot encode a user-selected commercial source.
      </p>
    </section>
  );
}
