import { installLegacyTrackTypeDisplay } from './legacy-track-type-display';

installLegacyTrackTypeDisplay();

function exposeMissingLyricsSourceControl(): void {
  const shell = document.querySelector<HTMLElement>('.workspace-lyrics-shell');
  if (!shell) return;
  const heading = shell.querySelector<HTMLElement>('.workspace-lyrics-status h3');
  const details = shell.querySelector<HTMLDetailsElement>('details.workspace-lyrics-plain');
  if (!heading || !details || heading.textContent?.trim() !== 'Add lyrics to begin') return;

  if (!details.open) details.open = true;

  const summary = details.querySelector<HTMLElement>('summary');
  if (summary && summary.textContent?.trim() !== 'Add lyrics.txt / plain-text editor') {
    summary.textContent = 'Add lyrics.txt / plain-text editor';
  }
}

function installBuild65MissingLyricsPresentation(): void {
  exposeMissingLyricsSourceControl();
  const observer = new MutationObserver(() => exposeMissingLyricsSourceControl());
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installBuild65MissingLyricsPresentation, { once: true });
} else {
  installBuild65MissingLyricsPresentation();
}
