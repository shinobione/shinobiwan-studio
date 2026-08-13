import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const workspace = read('src/components/TrackWorkspace.tsx');
const workspaceCss = read('src/workspace.css');
const foundationCss = read('src/ux-foundation.css');
const workshopCss = read('src/studio-focus-workshop.css');
const release = read('src/release.ts');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(version) && codename.startsWith('phase-ux-');
const authorizedPhase7 = /^0\.(?:16|17)\./.test(version) && codename.startsWith('phase7-');
const authorizedStudioFocus = /^0\.(?:17|18)\./.test(version) && codename.startsWith('studio-focus-');
assert.ok(phaseUxLine || authorizedPhase7 || authorizedStudioFocus, `Workspace guard must run on validated PHASE UX lineage or an explicitly authorized Phase 7 / Studio Focus successor, got ${version} / ${codename}.`);

if (authorizedStudioFocus && build >= 57) {
  for (const tab of [
    "{ label: 'Track', href: 'overview'",
    "{ label: 'Visuals', href: 'assets'",
    "{ label: 'Lyrics', href: 'lyrics'",
    "{ label: 'Release', href: 'market'",
  ]) assert.ok(workspace.includes(tab), `Track Workshop is missing the ${tab} artist destination.`);
  assert.ok(workspace.includes("aria-current={active ? 'page' : undefined}"), 'Artist Track Workshop navigation must expose aria-current.');
  assert.ok(workspace.includes('← Back to Tracks'), 'Track Workshop must provide an obvious return to Tracks.');

  for (const required of [
    'Your track, at a glance', 'What matters next', 'Master audio', 'More track details',
    'Cover and Canvas', 'Final production check', 'View full SonicTrace analysis',
    'workspace-focus-stage-grid', 'workspace-focus-visual-grid', 'workspace-focus-release-grid',
  ]) assert.ok(workspace.includes(required), `Build 57 Track Workshop is missing ${required}.`);

  for (const integration of [
    '<MetadataValidationPanel track={track}', "kinds={['audio']}", "kinds={['cover', 'thumbnail', 'video']}",
    '<EmbeddedLyricsStudio trackId={track.id}', '<LyricsEditorPanel track={track}', '<SonicTracePanel track={track}',
    '<TrackToMarketPanel track={track}',
  ]) assert.ok(workspace.includes(integration), `Build 57 must preserve ${integration}.`);

  for (const required of [
    '.workspace-artist-tabs', '.workspace-focus-stage-grid', '.workspace-focus-visual-grid', '.workspace-focus-release-grid',
    '@media(max-width:820px)', '@media(max-width:620px)',
  ]) assert.ok(workshopCss.includes(required), `Build 57 responsive workshop CSS is missing ${required}.`);
} else {
  for (const tab of [
    "{ id: 'overview', label: 'Overview' }",
    "{ id: 'metadata', label: 'Metadata' }",
    "{ id: 'assets', label: 'Assets' }",
    "{ id: 'lyrics', label: 'Lyrics' }",
    "{ id: 'intelligence', label: 'SonicTrace' }",
  ]) assert.ok(workspace.includes(tab), `Track Workspace is missing the ${tab} local destination.`);
  assert.ok(workspace.includes("aria-current={section === tab.id ? 'page' : undefined}"), 'Active local navigation must expose aria-current.');
  assert.ok(workspace.includes('← Back to Catalog'), 'Track context must provide an obvious return to Catalog.');

  for (const required of [
    'workspace-readiness-panel', 'Finish what matters next', 'Content Health measures operational completeness only',
    'workspace-action-list', 'workspace-media-grid', 'Production media', 'Music details',
    'Release and analysis', 'Manage release →', 'Analyze track', '<details className="workspace-diagnostics">',
  ]) assert.ok(workspace.includes(required), `UX-3 Overview is missing ${required}.`);

  for (const integration of [
    '<MetadataValidationPanel track={track}', '<AssetsManager track={track}', '<EmbeddedLyricsStudio trackId={track.id}',
    '<LyricsEditorPanel track={track}', '<SonicTracePanel track={track}',
  ]) assert.ok(workspace.includes(integration), `UX-3 must preserve ${integration}.`);
}

assert.ok(!workspace.includes('className="health-list"'), 'Workspace must not retain the long always-expanded health debug list.');
assert.ok(!workspace.includes("'PRIVATE READ' : 'PUBLIC FALLBACK'"), 'Read-source diagnostics must not remain in the primary track header.');
assert.ok(workspace.includes("'--track-accent'"));
assert.ok(workspace.includes("'--track-accent2'"));
assert.ok(workspace.includes('Cover palette accent'), 'Canonical saved cover colors should provide quiet track context.');

// The accepted responsive/sticky baseline remains loaded as ancestry even after
// Build 57 adds an artist-facing workshop layer on top.
for (const required of [
  '.workspace-readiness-layout', '.workspace-health-pills', '.workspace-next-action', '.workspace-media-grid',
  '.workspace-release-states', '.workspace-diagnostics', '@media(max-width:590px)', '@media(max-width:390px)',
]) assert.ok(workspaceCss.includes(required), `UX-3 responsive workspace CSS ancestry is missing ${required}.`);
assert.ok(foundationCss.includes('.workspace-header { position: relative;'), 'The full workspace hero must scroll normally and never overlap content.');
assert.ok(foundationCss.includes('.workspace-tabs { position: sticky; top: 76px;'), 'Desktop local navigation must remain sticky below the global topbar.');
assert.ok(foundationCss.includes('.workspace-tabs { top: 72px;'), 'Mobile local navigation must remain sticky below the mobile topbar.');
assert.ok(workspace.includes('workspace-sticky-context'), 'Sticky navigation must retain compact track identity and readiness context.');

if (phaseUxLine) {
  for (const forbidden of ['phase7', 'phase-7']) assert.ok(!workspace.toLowerCase().includes(forbidden), `Unauthorized Phase 7 runtime marker found during PHASE UX: ${forbidden}.`);
} else {
  assert.ok(workspace.includes('<ContinuationReceiptBanner trackId={track.id}'), 'Authorized Phase 7-B / Studio Focus successor must preserve the contextual receipt surface.');
}

console.log('PHASE UX UX-3 guard passed: persistent track context, guarded production integrations, secondary diagnostics and responsive behavior survive the Studio Focus Track Workshop regrouping.');
