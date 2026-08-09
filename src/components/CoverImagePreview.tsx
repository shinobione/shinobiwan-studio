import { useEffect, useState } from 'react';

export function CoverImagePreview({ file, canonicalUrl, alt }: { file?: File | null; canonicalUrl?: string | null; alt: string }) {
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setLocalUrl(null); return undefined; }
    const url = URL.createObjectURL(file);
    setLocalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const source = localUrl || canonicalUrl || null;
  return (
    <figure className="cover-image-preview">
      {source ? <img src={source} alt={alt} /> : <div aria-hidden="true">NO COVER</div>}
      <figcaption>{file ? `Local preview · ${file.name}` : canonicalUrl ? 'Current canonical cover' : 'Select a cover to preview it here.'}</figcaption>
    </figure>
  );
}
