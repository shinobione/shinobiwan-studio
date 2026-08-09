import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const workspace = read('src/components/TrackWorkspace.tsx');
const workspaceCss = read('src/workspace.css');
const foundationCss = read('src/ux-foundation.css');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');

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

assert.ok(!workspace.includes('className="health-list"'), 'Overview must not retain the long always-expanded health debug list.');
assert.ok(!workspace.includes("'PRIVATE READ' : 'PUBLIC FALLBACK'"), 'Read-source diagnostics must not remain in the primary track header.');
assert.ok(workspace.includes("'--track-accent'"));
assert.ok(workspace.includes("'--track-accent2'"));
assert.ok(workspace.includes('Cover palette accent'), 'Canonical saved cover colors should provide quiet track context.');

for (const required of [
  '.workspace-readiness-layout', '.workspace-health-pills', '.workspace-next-action', '.workspace-media-grid',
  '.workspace-release-states', '.workspace-diagnostics', '@media(max-width:590px)', '@media(max-width:390px)',
]) assert.ok(workspaceCss.includes(required), `UX-3 responsive workspace CSS is missing ${required}.`);
assert.ok(foundationCss.includes('.workspace-header { position: relative;'), 'The full workspace hero must scroll normally and never overlap content.');
assert.ok(foundationCss.includes('.workspace-tabs { position: sticky; top: 76px;'), 'Desktop local navigation must remain sticky below the global topbar.');
assert.ok(foundationCss.includes('.workspace-tabs { top: 72px;'), 'Mobile local navigation must remain sticky below the mobile topbar.');
assert.ok(workspace.includes('workspace-sticky-context'), 'Sticky navigation must retain compact track identity and readiness context.');

assert.equal(pkg.version, '0.10.9');
assert.ok(release.includes("version: '0.10.9'"));
assert.ok(release.includes('build: 31'));
assert.ok(release.includes("codename: 'phase-ux-c2-5-a-lrc-638'"));

for (const forbidden of ['phase7', 'phase-7']) assert.ok(!workspace.toLowerCase().includes(forbidden), `Phase 7 runtime marker found: ${forbidden}.`);

console.log('PHASE UX UX-3 guard passed: persistent track context, five local tools, action-led Overview, secondary diagnostics, responsive layout and Build 31 identity protected.');
