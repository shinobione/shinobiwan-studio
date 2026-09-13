import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const pkg = JSON.parse(read('package.json'));
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const storagePath = 'src/release-campaign-storage.ts';
const storage = fs.existsSync(storagePath) ? read(storagePath) : '';

assert.match(release, /build:\s*81/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase8-semantic-truth-cleanup'"));
assert.ok(release.includes('build80AncestryMarker'), 'Build81 must preserve accepted Build80 ancestry.');

assert.ok(workspace.includes("{ label: 'Sonic'"), 'Track production stage must use Sonic wording.');
assert.ok(!workspace.includes("{ label: 'Sound'"), 'Legacy Sound stage wording must not return.');
assert.ok(workspace.includes('TRACK / SONIC'), 'Full intelligence page must use Sonic wording.');
assert.ok(!workspace.includes('TRACK / SOUND'), 'Legacy Track / Sound eyebrow must not return.');

assert.ok(!panel.includes('const PROVIDERS ='), 'Decorative provider list must be removed.');
assert.ok(!panel.includes('Premium provider'), 'Decorative Premium provider control must be removed.');
assert.ok(!panel.includes("useState('Google Flow')"), 'Provider choice must not remain fake state.');
assert.ok(!panel.includes('setProvider('), 'Provider choice must not remain mutable UI state.');
assert.ok(!panel.includes('draft.provider'), 'Old draft provider provenance must not be interpreted as current prompt behavior.');
assert.ok(panel.includes("const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/'"), 'Google Flow shortcut must remain available.');
assert.ok(panel.includes('Open Google Flow ↗'), 'Google Flow shortcut must remain visible.');
assert.ok(panel.includes('target="_blank"') && panel.includes('rel="noopener noreferrer"'), 'External Flow shortcut safety must remain intact.');

assert.ok(engine.includes('export function buildFreshMasterPrompt'), 'MASTER prompt builder must remain independent from a provider API.');
assert.ok(engine.includes("export function buildVariantPrompt(track: StudioTrackDetail, format: '1:1' | '9:16')"), 'Variant prompt builder must remain independent from a provider API.');
assert.ok(engine.includes('export function buildMotionPrompt(track: StudioTrackDetail)'), 'Motion prompt builder must remain independent from a provider API.');

if (releaseBuild < 111) {
  assert.ok(panel.includes("const CAMPAIGN_HANDOFF_PROVENANCE = 'provider-agnostic external image handoff'"), 'Historical Release Campaign provenance must state provider-agnostic truth.');
  assert.ok(panel.includes('PROVIDER-AGNOSTIC'), 'Historical provider-agnostic truth must be visible in the Release Campaign UI.');
  assert.ok(panel.includes('Google Flow is a convenience shortcut only; Studio does not alter prompt semantics by provider.'), 'Historical Flow shortcut semantics must stay explicit.');
  assert.ok(panel.includes('provider: CAMPAIGN_HANDOFF_PROVENANCE'), 'Historical browser-local draft/export provenance must remain explicit.');
  assert.ok(storage.includes('loadReleaseCampaignDraft'), 'Historical browser-local drafts must remain loadable.');
  assert.ok(storage.includes('saveReleaseCampaignDraft'), 'Historical browser-local draft persistence must remain intact.');
  assert.ok(panel.includes('canonicalWrite: false'), 'Historical Release Campaign export must remain explicitly non-canonical.');
} else {
  assert.equal(storage, '', 'Build111 intentionally retires obsolete browser-local image campaign storage.');
  assert.ok(panel.includes('RELEASE / VISUAL HANDOFF'), 'Build111 must expose the simplified visual handoff surface.');
  assert.ok(panel.includes('Prompts ready for Flow'), 'Build111 must make the actual Flow handoff obvious.');
  assert.ok(!panel.includes('provider:'), 'Build111 must not preserve obsolete provider provenance state after local campaign packaging is removed.');
  assert.ok(!panel.includes('PROVIDER-AGNOSTIC'), 'Build111 must not add provider jargon back into the human-facing surface.');
  assert.ok(!panel.includes('canonicalWrite: false'), 'Build111 has no local export manifest and must not expose obsolete manifest jargon.');
}

for (const forbidden of ['fetch(', 'uploadTrackAsset', 'replaceTrackAsset', 'deleteTrackAsset', 'saveTrackMetadata', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build81 semantic cleanup must remain non-canonical: ${forbidden}`);
}
assert.ok(panel.includes("buildVariantPrompt(track, '1:1')") && panel.includes("buildVariantPrompt(track, '9:16')"), 'MASTER sibling derivative contract must remain intact.');
assert.ok(pkg.scripts['check:phase8']?.includes('test-phase8-semantic-truth-build81.mjs'), 'Build81 guard must run in check:phase8.');

console.log(`Build81 semantic truth guard passed under Build${releaseBuild}: Sonic wording remains canonical, fake provider selection stays removed, Flow handoff remains explicit and Release stays non-canonical.`);
