import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const read = path => fs.readFileSync(path, 'utf8');
const intakeSource = read('src/track-intake.ts');
const create = read('src/components/TrackCreatePanel.tsx');
const assets = read('src/components/AssetsManager.tsx');
const palette = read('src/components/CoverPalettePreview.tsx');
const coverPreview = read('src/components/CoverImagePreview.tsx');
const service = read('src/services/phase4-admin-api.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const workspaceCss = read('src/workspace.css');
const foundationCss = read('src/ux-foundation.css');
const release = read('src/release.ts');

const compiledIntake = ts.transpileModule(intakeSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const intake = await import(`data:text/javascript;base64,${Buffer.from(compiledIntake).toString('base64')}`);

assert.equal(intake.detectIntakeFileRole({ name: 'master.wav', type: 'audio/wav' }), 'audio');
assert.equal(intake.detectIntakeFileRole({ name: 'cover.webp', type: 'image/webp' }), 'cover');
assert.equal(intake.detectIntakeFileRole({ name: 'lyrics.txt', type: 'text/plain' }), 'lyrics');
assert.equal(intake.detectIntakeFileRole({ name: 'canvas.mp4', type: 'video/mp4' }), 'video');
assert.equal(intake.detectIntakeFileRole({ name: 'wrong.mp3', type: 'image/png' }), 'ambiguous');
assert.equal(intake.detectIntakeFileRole({ name: 'compatibility.lrc', type: 'text/plain' }), 'ignore', 'LRC must never be silently classified as canonical lyrics TXT.');
assert.match(intake.intakeRoleProblems([{ id: 'lrc', file: { name: 'compatibility.lrc' }, detectedRole: 'ignore', role: 'lyrics', note: '' }]).join(' '), /\.txt only/);

const parsed = intake.parseTrackTxt(`\uFEFFTITLE: Neon Signal\r\nALBUM: Night Work\r\nRELEASE DATE: 09/08/2026\r\nSTYLE PROMPT: dark cybertrap, romantic digital life\r\nGENRES: Hip-hop\r\nBPM: 144\r\nLYRICS:\r\n[00:01.20]First line`, 'neon-signal.txt');
assert.equal(parsed.values.title, 'Neon Signal');
assert.equal(parsed.values.slug, 'neon-signal');
assert.equal(parsed.values.albumId, 'night-work');
assert.equal(parsed.values.type, 'album-track');
assert.equal(parsed.values.releaseDate, '2026-08-09');
assert.match(parsed.values.genres, /Trap/);
assert.match(parsed.values.moods, /Dark/);
assert.match(parsed.values.themes, /Digital life/);
assert.equal(parsed.timestampCount, 1);
assert.equal(parsed.lyricsFound, true);

const current = { title: 'My manual title', slug: '', type: 'single', year: '', releaseDate: '', albumTitle: 'Singles', albumId: 'singles', languages: 'English', genres: '', tags: '', moods: '', themes: '', era: '', energy: '', bpm: '', key: '', keyConfidence: '', duration: '', explicit: 'clean', status: 'draft', accent: '', accent2: '' };
const merged = intake.mergeParsedTrackTxt(current, parsed, new Set(['title']));
assert.equal(merged.values.title, 'My manual title', 'TXT inference must not overwrite a user-entered value.');
assert.ok(merged.preserved.includes('title'));
assert.equal(merged.values.bpm, '144');

for (const marker of ['multiple', 'onDrop=', 'mergeIntakeFiles', 'parseTrackTxt', 'EXISTING USER VALUE PRESERVED', 'DETECTED FROM TXT', 'INFERRED', 'Create canonical draft']) assert.ok(create.includes(marker), `Corrective New Track intake is missing ${marker}.`);
assert.ok(create.includes("intakeFileForRole(assignments, 'lyrics')"));
assert.ok(create.includes("type=\"file\" multiple"));
assert.ok(create.indexOf('{step === 1 && <section className="intake-step-panel intake-media-step">') > -1, 'Multi-file drop must be the first New Track step.');
assert.ok(create.includes("(step === 2 && (!basicsValid || !albumReady))"), 'Metadata + canonical Album resolution must gate the transition from step two to Review.');
assert.ok(create.includes('CoverImagePreview'));

const uploadTransport = service.slice(service.indexOf('async function uploadViaFetch'), service.indexOf('export async function createAdminTrack'));
assert.ok(uploadTransport.includes('await fetch(url'));
assert.ok(uploadTransport.includes("credentials: 'include'"));
assert.ok(uploadTransport.includes('body: formData'));
assert.ok(!uploadTransport.includes('XMLHttpRequest'));
assert.ok(!uploadTransport.includes('xhr.upload'));
assert.ok(!uploadTransport.includes("'Content-Type'"), 'Browser must generate the multipart boundary and keep the upload request simple.');
assert.ok(service.includes('const reread = await getAdminTrack(trackId)'));
assert.ok(service.includes("'ASSET_UPLOAD_NOT_COMMITTED'"));
assert.ok(service.includes("'ASSET_UPLOAD_AMBIGUOUS'"));
assert.ok(service.includes('asset.size === file.size'));
assert.ok(service.includes('changedAssetFingerprint'));
assert.ok(service.includes('beforeManifest.updatedAt !== expectedUpdatedAt'));
assert.ok(service.includes('retrySafe: true'));
assert.ok(assets.includes('Retry explicit upload'));
assert.ok(!service.includes('uploadViaXhr'));

for (const marker of ['type="color"', 'cover-hex-input', 'EyeDropper', 'onChange?.(next)', 'accent', 'accent2']) assert.ok(palette.includes(marker), `Editable palette is missing ${marker}.`);
assert.ok(assets.includes('editable={Boolean(palettePreview)}'));
assert.ok(assets.includes('Saved accent / accent2 remain unchanged'));
assert.ok(coverPreview.includes('URL.createObjectURL(file)'));
assert.ok(coverPreview.includes('URL.revokeObjectURL(url)'));

assert.ok(foundationCss.includes('.workspace-header { position: relative;'));
assert.ok(foundationCss.includes('.workspace-tabs { position: sticky; top: 76px;'));
assert.ok(!foundationCss.includes('.workspace-tabs { position: sticky; top: 205px;'));
assert.ok(workspace.includes('workspace-sticky-context'));
assert.ok(workspaceCss.includes('.workspace-tab-links'));

for (const source of [create, assets, service]) {
  for (const forbidden of ['phase7', 'phase-7']) assert.ok(!source.toLowerCase().includes(forbidden), `Canonical intake/write layer acquired unauthorized Phase 7 coupling: ${forbidden}.`);
}
const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const phaseUxLine = /^0\.(?:11|12|13|14|15)\./.test(version) && codename.startsWith('phase-ux-');
const authorizedPhase7 = /^0\.(?:16|17)\./.test(version) && codename.startsWith('phase7-');
assert.ok(phaseUxLine || authorizedPhase7, `Live-smoke corrective guard must run on validated PHASE UX lineage or an explicitly authorized Phase 7 successor, got ${version} / ${codename}.`);
if (phaseUxLine) {
  for (const forbidden of ['phase7', 'phase-7']) assert.ok(!workspace.toLowerCase().includes(forbidden), `Unauthorized Phase 7 workspace marker found during PHASE UX: ${forbidden}.`);
} else {
  assert.ok(workspace.includes('<ContinuationReceiptBanner trackId={track.id}'), 'Authorized Phase 7-B may add receipt orchestration only above the previously validated corrective Workspace behavior.');
}

console.log('PHASE UX live-smoke corrective guard passed: Track Manager intake parity, canonical Album gating, simple multipart upload, canonical lost-response recovery, editable palette and non-overlapping sticky context survive the authorized Phase 7 successor.');
