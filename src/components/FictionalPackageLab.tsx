import { useEffect, useRef, useState } from 'react';
import {
  FICTIONAL_PACKAGE_MAX_BYTES, FICTIONAL_PACKAGE_NAME,
  openFictionalPackage, sealFictionalPackage,
} from '../catalogue/fictionalPackageLab';
import './fictional-package-lab.css';
import { FictionalRegistryRecoveryLab } from './FictionalRegistryRecoveryLab';

// Intentionally separate from CatalogueImport and its private Snapshot.
// There is NO prop or path that can feed actual commercial data into this lab.
export function FictionalPackageLab() {
  const [passphrase, setPassphrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('No fictional package generated or opened.');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const sequence = useRef(0);
  const currentUrl = useRef<string | null>(null);
  const filePicker = useRef<HTMLInputElement>(null);

  const revoke = () => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
    setDownloadUrl(null);
  };
  useEffect(() => () => {
    sequence.current++;
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
  }, []);

  const reset = () => {
    sequence.current++;
    revoke();
    if (filePicker.current) filePicker.current.value = '';
    setPassphrase('');
    setBusy(false);
    setStatus('No fictional package generated or opened.');
  };
  const generate = async () => {
    const generation = ++sequence.current;
    revoke();
    setBusy(true);
    setStatus('Encrypting the invented fixture locally…');
    try {
      // The codec takes ONLY the passphrase; it cannot accept a real Catalogue Snapshot.
      const raw = await sealFictionalPackage(passphrase);
      if (sequence.current !== generation) return;
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/octet-stream' }));
      currentUrl.current = url;
      setDownloadUrl(url);
      setStatus('Fictional encrypted package ready. Download it, then reopen the downloaded file.');
    } catch {
      if (sequence.current === generation) setStatus('Cannot generate fictional package.');
    } finally {
      if (sequence.current === generation) { setPassphrase(''); setBusy(false); }
    }
  };
  const reopen = async (file: File) => {
    const generation = ++sequence.current;
    setBusy(true);
    setStatus('Opening and checking selected fictional file locally…');
    try {
      if (file.size === 0 || file.size > FICTIONAL_PACKAGE_MAX_BYTES) throw new Error('Invalid fictional lab file.');
      const raw = await file.text();
      if (sequence.current !== generation) return;
      await openFictionalPackage(raw, passphrase);
      if (sequence.current === generation) setStatus('Verified fictional package. No commercial Catalogue data changed.');
    } catch {
      if (sequence.current === generation) setStatus('Cannot open or verify fictional lab package.');
    } finally {
      if (sequence.current === generation) { setPassphrase(''); setBusy(false); }
    }
  };

  return <section className="fictional-package-lab" aria-label="Fictional encrypted package lab">
    <p className="commercial-catalogue-eyebrow">C3B · SYNTHETIC-ONLY PACKAGE LAB</p>
    <h3>Test a local encrypted file</h3>
    <p>This is a contained test with invented data. It cannot export your imported Catalogue, connect to R2 or change a Studio Track, Album or commercial record.</p>
    <p><strong>Entering this lab unloads any previously selected commercial source.</strong> Your real JSON must stay in the normal read-only Catalogue importer.</p>
    <label htmlFor="fictional-lab-passphrase">Fictional test passphrase (enter it again when reopening)</label>
    <input id="fictional-lab-passphrase" type="password" autoComplete="off" minLength={12} maxLength={1024}
      value={passphrase} onChange={event => setPassphrase(event.currentTarget.value)}
      disabled={busy} aria-describedby="fictional-lab-privacy" />
    <div className="fictional-package-actions">
      <button type="button" disabled={busy || passphrase.length < 12} onClick={generate}>Generate fictional encrypted package</button>
      {downloadUrl && <a className="fictional-package-download" href={downloadUrl} download={FICTIONAL_PACKAGE_NAME}>Download fictional encrypted file</a>}
      <label htmlFor="fictional-lab-file">Open downloaded fictional file</label>
      <input ref={filePicker} id="fictional-lab-file" type="file" accept=".scat,application/octet-stream" disabled={busy || passphrase.length < 12}
        onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (file) void reopen(file);
        }} />
      <button type="button" onClick={reset}>Reset fictional lab</button>
    </div>
    <p role="status" aria-live="polite" aria-atomic="true">{status}</p>
    <p id="fictional-lab-privacy">Nothing is uploaded or stored by STUDIO. A completed browser download does not prove a recoverable backup until the selected file is independently reopened. No recovery key is held by the service.</p>
    <FictionalRegistryRecoveryLab />
  </section>;
}
