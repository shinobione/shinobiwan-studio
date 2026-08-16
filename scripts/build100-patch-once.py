from pathlib import Path

BRANCH_VERSION = '0.19.22'


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one exact marker, got {count}')
    return text.replace(old, new, 1)


# Daily Albums UX: stage canonically unowned Tracks locally, then keep Build87 as the sole write.
p = 'src/components/AlbumsWorkspace.tsx'
t = read(p)
t = replace_once(
    t,
    "  const [moves, setMoves] = useState<Record<string, string>>({});\n  const [cover, setCover] = useState<File | null>(null);",
    "  const [moves, setMoves] = useState<Record<string, string>>({});\n  const [intakeTrackId, setIntakeTrackId] = useState('');\n  const [cover, setCover] = useState<File | null>(null);",
    'AlbumsWorkspace intake state',
)
t = replace_once(
    t,
    "  const byId = useMemo(() => new Map(tracks.map(track => [track.id, track])), [tracks]);\n  const changed = album ? JSON.stringify(ids) !== JSON.stringify(album.trackIds) : false;",
    "  const byId = useMemo(() => new Map(tracks.map(track => [track.id, track])), [tracks]);\n  const canonicalOwnerByTrackId = useMemo(() => {\n    const owners = new Map<string, string>();\n    for (const summary of albums) {\n      for (const trackId of summary.trackIds) {\n        if (!owners.has(trackId)) owners.set(trackId, summary.id);\n      }\n    }\n    return owners;\n  }, [albums]);\n  const intakeCandidates = useMemo(\n    () => tracks.filter(track => !ids.includes(track.id) && !canonicalOwnerByTrackId.has(track.id)),\n    [tracks, ids, canonicalOwnerByTrackId],\n  );\n  const changed = album ? JSON.stringify(ids) !== JSON.stringify(album.trackIds) : false;",
    'AlbumsWorkspace canonical owner map',
)
t = replace_once(
    t,
    "\n  async function saveMetadata() {",
    "\n  function stageTrackIntake() {\n    const trackId = intakeTrackId;\n    if (!trackId || !intakeCandidates.some(track => track.id === trackId)) return;\n    setIds(current => current.includes(trackId) ? current : [...current, trackId]);\n    setIntakeTrackId('');\n    setNotice(`“${byId.get(trackId)?.title || trackId}” staged locally. Nothing is written until Save tracklist.`);\n  }\n\n  async function saveMetadata() {",
    'AlbumsWorkspace staging function',
)
header = "      <div className=\"album-section-head\"><div><span className=\"eyebrow\">TRACKLIST / MEMBERSHIP</span><h3>{ids.length} ordered tracks</h3><p><code>album.trackIds</code> is the canonical membership and artistic order. Reorder here at any time.</p></div></div>\n      <ol className=\"album-tracklist\">"
replacement = "      <div className=\"album-section-head\"><div><span className=\"eyebrow\">TRACKLIST / MEMBERSHIP</span><h3>{ids.length} ordered tracks</h3><p><code>album.trackIds</code> is the canonical membership and artistic order. Reorder here at any time.</p></div></div>\n      <div className=\"album-boundary-note\"><strong>Add tracks from Singles / unassigned</strong><span>Availability is derived from canonical Album trackIds, not the Track-side display cache. Add only stages the ordered list locally. Nothing is written until Save tracklist.</span></div>\n      <div className=\"album-actions\"><div className=\"album-track-move\"><select aria-label=\"Choose an available Track to add\" value={intakeTrackId} disabled={busy || intakeCandidates.length === 0} onChange={event => setIntakeTrackId(event.target.value)}><option value=\"\">{intakeCandidates.length ? 'Choose a Track…' : 'No unassigned Tracks available'}</option>{intakeCandidates.map(track => <option key={track.id} value={track.id}>{track.title} · {track.id}</option>)}</select><button disabled={busy || !intakeTrackId} onClick={stageTrackIntake}>Add to tracklist</button></div><span>{intakeCandidates.length} canonically unowned Track{intakeCandidates.length === 1 ? '' : 's'} available</span></div>\n      <ol className=\"album-tracklist\">"
t = replace_once(t, header, replacement, 'AlbumsWorkspace intake UI')
write(p, t)

# Release identity + accepted Build99 ancestry.
p = 'src/release.ts'; t = read(p)
t = replace_once(t, "  version: '0.19.21',\n  build: 99,\n  codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth',", "  version: '0.19.22',\n  build: 100,\n  codename: 'studio-focus-slice4-phase9-album-first-track-intake',", 'release identity')
t = replace_once(t, "export const build98AncestryMarker = \"version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'\";", "export const build98AncestryMarker = \"version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'\";\nexport const build99AncestryMarker = \"version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\";", 'Build99 ancestry marker')
write(p, t)

# Package identity and Phase9 gate.
p = 'package.json'; t = read(p)
t = replace_once(t, '"version": "0.19.21"', '"version": "0.19.22"', 'package version')
t = replace_once(t, 'node scripts/test-phase9-album-asset-upload-success-verification-build99.mjs"', 'node scripts/test-phase9-album-asset-upload-success-verification-build99.mjs && node scripts/test-phase9-album-first-track-intake-build100.mjs"', 'Phase9 Build100 gate')
write(p, t)

# Build99 becomes a bounded accepted-predecessor guard for Build100.
p = 'scripts/test-phase9-album-asset-upload-success-verification-build99.mjs'; t = read(p)
old = """assert.equal(pkg.version, '0.19.21', 'Build99 package version must be v0.19.21.');
assert.ok(release.includes(\"version: '0.19.21'\"), 'Build99 release version mismatch.');
assert.ok(release.includes('build: 99'), 'Build99 release identity is missing.');
assert.ok(release.includes(\"codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\"), 'Build99 codename mismatch.');
assert.ok(release.includes('build98AncestryMarker'), 'Build99 must preserve accepted Build98 ancestry.');
assert.ok(release.includes(\"version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'\"), 'Accepted Build98 identity must remain immutable in Build99 ancestry.');"""
new = """assert.ok(['0.19.21', '0.19.22'].includes(pkg.version), 'Build99 guard accepts Build99 and its bounded Build100 successor.');
if (pkg.version === '0.19.21') {
  assert.ok(release.includes(\"version: '0.19.21'\"), 'Build99 release version mismatch.');
  assert.ok(release.includes('build: 99'), 'Build99 release identity is missing.');
  assert.ok(release.includes(\"codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\"), 'Build99 codename mismatch.');
}
assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 ancestry.');
assert.ok(release.includes(\"version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'\"), 'Accepted Build98 identity must remain immutable in Build99 ancestry.');
if (pkg.version === '0.19.22') {
  assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 ancestry.');
  assert.ok(release.includes(\"version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\"), 'Accepted Build99 identity must remain immutable in Build100 ancestry.');
}"""
t = replace_once(t, old, new, 'Build99 bounded successor block')
write(p, t)

# Known bounded Phase9 predecessor guards: extend only to Build100 and require accepted Build99 ancestry.
for p in [
    'scripts/test-phase9-track-metadata-validation-transient-retry-build93.mjs',
    'scripts/test-phase9-lyrics-validation-transient-retry-build94.mjs',
    'scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs',
    'scripts/test-phase9-album-create-success-verification-build96.mjs',
    'scripts/test-phase9-track-create-success-verification-build97.mjs',
    'scripts/test-phase9-tm524-duration-evidence-compat-build98.mjs',
]:
    t = read(p)
    t = t.replace("'0.19.21'].includes(pkg.version)", "'0.19.21', '0.19.22'].includes(pkg.version)")
    t = t.replace("if (pkg.version === '0.19.21')", "if (['0.19.21', '0.19.22'].includes(pkg.version))")
    marker = "const pkg = JSON.parse(read('package.json'));\n"
    if marker not in t:
        raise SystemExit(f'{p}: package marker missing')
    ancestry = "if (pkg.version === '0.19.22') assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 ancestry.');\n"
    if ancestry not in t:
        t = t.replace(marker, marker + ancestry, 1)
    if "'0.19.22'" not in t:
        raise SystemExit(f'{p}: Build100 version not added')
    write(p, t)

# Build69 owns current successor identity/codename regexes.
p = 'scripts/test-phase7-c-guided-metadata-build69.mjs'; t = read(p)
t = replace_once(t, "|20|21)'/);", "|20|21|22)'/);", 'Build69 version cap')
t = replace_once(t, "|98|99)/);", "|98|99|100)/);", 'Build69 build cap')
t = replace_once(t, "|phase9-album-asset-upload-success-verification-truth))'/,", "|phase9-album-asset-upload-success-verification-truth|phase9-album-first-track-intake))'/,", 'Build69 codename cap')
t = t.replace('|98|99)/.test(release)', '|98|99|100)/.test(release)')
t = replace_once(t, "if (/build:\\s*99/.test(release)) assert.ok(release.includes('build98AncestryMarker'), 'Build99 must preserve accepted Build98 Phase9 ancestry.');", "if (/build:\\s*(?:99|100)/.test(release)) assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 Phase9 ancestry.');\nif (/build:\\s*100/.test(release)) assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 Phase9 ancestry.');", 'Build69 Build99/100 ancestry')
write(p, t)

# Focus64-67 successor version caps only; Build100 also proves Build99 ancestry explicitly.
for p in [
    'scripts/test-studio-focus-build64-foundation-repair.mjs',
    'scripts/test-studio-focus-build65-lyrics-crash-corrective.mjs',
    'scripts/test-studio-focus-build66-asset-identity-lyrics-continuity.mjs',
    'scripts/test-studio-focus-build67-lyrics-source-anchor.mjs',
]:
    t = read(p)
    t = t.replace("if (pkg.version === '0.19.21')", "if (['0.19.21', '0.19.22'].includes(pkg.version))")
    t = t.replace("'0.19.21'].includes(pkg.version)", "'0.19.21', '0.19.22'].includes(pkg.version)")
    t = t.replace("|20|21)'/);", "|20|21|22)'/);")
    pkg_marker = "const pkg = JSON.parse(read('package.json'));\n"
    if pkg_marker not in t:
        raise SystemExit(f'{p}: package marker missing')
    ancestry = "if (pkg.version === '0.19.22') assert.ok(read('src/release.ts').includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 Phase9 ancestry.');\n"
    if ancestry not in t:
        t = t.replace(pkg_marker, pkg_marker + ancestry, 1)
    if "'0.19.22'" not in t:
        raise SystemExit(f'{p}: Build100 version not added')
    write(p, t)

print('Build100 bounded runtime/guard patch applied')
