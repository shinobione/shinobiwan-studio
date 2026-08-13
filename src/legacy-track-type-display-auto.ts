import { installLegacyTrackTypeDisplay } from './legacy-track-type-display';

installLegacyTrackTypeDisplay();

function exposeMissingLyricsSourceControl(): void {
  const shell = document.querySelector<HTMLElement>('.workspace-lyrics-shell');
  if (!shell) return;
  const heading = shell.querySelector<HTMLElement>('.workspace-lyrics-status h3');
  const details = shell.querySelector<HTMLDetailsElement>('details.workspace-lyrics-plain');
  if (!heading || !details || heading.textContent?.trim() !== 'Add lyrics to begin') return;
  details.open = true;
  const summary = details.querySelector<HTMLElement>('summary');
  if (summary) summary.textContent = 'Add lyrics.txt / plain-text editor';
}

function installBuild64PresentationRepair(): void {
  exposeMissingLyricsSourceControl();
  const observer = new MutationObserver(() => exposeMissingLyricsSourceControl());
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installBuild64PresentationRepair, { once: true });
} else {
  installBuild64PresentationRepair();
}
