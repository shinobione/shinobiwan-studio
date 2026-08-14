import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const storage = read('src/release-campaign-storage.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /build:\s*81/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase8-semantic-truth-cleanup'"));
assert.ok(release.includes('build80AncestryMarker'), 'Build81 must preserve accepted Build80 ancestry.');

assert.ok(workspace.includes("{ label: 'Sonic'"), 'Track production stage must use Sonic wording.');
assert.ok(!workspace.includes("{ label: 'Sound'"), 'Legacy Sound stage wording must not return.');
assert.ok(workspace.includes('TRACK / SONIC'), 'Full intelligence page must use Sonic wording.');
assert.ok(!workspace.includes('TRACK / SOUND'), 'Legacy Track / Sound eyebrow must not return.');

assert.ok(panel.includes("const CAMPAIGN_HANDOFF_PROVENANCE = 'provider-agnostic external image handoff'"), 'Release Campaign provenance must state provider-agnostic truth.');
assert.ok(panel.includes('PROVIDER-AGNOSTIC'), 'Provider-agnostic truth must be visible in the Release Campaign UI.');
assert.ok(panel.includes('Google Flow is a convenience shortcut only; Studio does not alter prompt semantics by provider.'), 'Flow shortcut semantics must be explicit.');
assert.ok(!panel.includes('const PROVIDERS ='), 'Decorative provider list must be removed.');
assert.ok(!panel.includes('Premium provider'), 'Decorative Premium provider control must be removed.');
assert.ok(!panel.includes("useState('Google Flow')"), 'Provider choice must not remain fake state.');
assert.ok(!panel.includes('setProvider('), 'Provider choice must not remain mutable UI state.');
assert.ok(!panel.includes('draft.provider'), 'Old draft provider provenance must not be interpreted as current prompt behavior.');
assert.ok(panel.includes('provider: CAMPAIGN_HANDOFF_PROVENANCE'), 'Browser-local draft/export provenance must remain explicit.');
assert.ok(panel.includes("const GOOGLE_FLOW_URL = 'https://labs.google/fx/fr/tools/flow/'"), 'Google Flow convenience shortcut must remain available.');
assert.ok(panel.includes('Open Google Flow ↗'), 'Google Flow shortcut must remain visible.');
assert.ok(panel.includes('target="_blank"') && panel.includes('rel="noopener noreferrer"'), 'External Flow shortcut safety must remain intact.');
assert.ok(panel.includes('Copy MASTER handoff'), 'MASTER handoff action must remain provider-neutral.');

assert.ok(engine.includes('provider: string;'), 'Draft schema must retain provider field for backwards-compatible IndexedDB restore/export.');
assert.ok(engine.includes('export function buildFreshMasterPrompt(track: StudioTrackDetail, hasLogo: boolean, conceptIndex = 0)'), 'MASTER prompt builder must remain provider-agnostic.');
assert.ok(engine.includes("export function buildVariantPrompt(track: StudioTrackDetail, format: '1:1' | '9:16')"), 'Variant prompt builder must remain provider-agnostic.');
assert.ok(engine.includes('export function buildMotionPrompt(track: StudioTrackDetail)'), 'Motion prompt builder must remain provider-agnostic.');
assert.ok(storage.includes('loadReleaseCampaignDraft'), 'Existing browser-local drafts must remain loadable.');
assert.ok(storage.includes('saveReleaseCampaignDraft'), 'Browser-local draft persistence must remain intact.');

for (const forbidden of ['fetch(', 'uploadTrackAsset', 'replaceTrackAsset', 'deleteTrackAsset', 'saveTrackMetadata', 'phase4-admin-api', 'admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build81 semantic cleanup must remain browser-local/non-canonical: ${forbidden}`);
}
assert.ok(panel.includes('canonicalWrite: false'), 'Release Campaign export must remain explicitly non-canonical.');
assert.ok(panel.includes("buildVariantPrompt(track, '1:1')") && panel.includes("buildVariantPrompt(track, '9:16')"), 'MASTER sibling derivative contract must remain intact.');
assert.ok(pkg.scripts['check:phase8']?.includes('test-phase8-semantic-truth-build81.mjs'), 'Build81 guard must run in check:phase8.');

console.log('Build81 semantic truth guard passed: Sonic wording is canonical, provider selector is removed, Flow remains convenience-only, Release Campaign remains provider-agnostic and non-canonical.');
