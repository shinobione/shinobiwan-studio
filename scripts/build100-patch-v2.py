from pathlib import Path

# Reuse the already-validated bounded runtime patch recipe first.
exec(compile(Path('scripts/build100-patch-once.py').read_text(encoding='utf-8'), '<build100-base-patch>', 'exec'), {'__name__': '__main__'})

path = Path('scripts/test-phase-ux-c2-5-d-albums.mjs')
text = path.read_text(encoding='utf-8')
old = "if (pkg.version === '0.19.21') {\n  assert.ok(albumApi.includes('return verify(albumId, payload, { expectedAsset: {'), 'Build99 successor must preserve Track Manager authority while strengthening Album asset normal-success verification.');\n  assert.ok(albumApi.includes('maxAutomaticAssetUploadRetries: 0'), 'Build99 successor must retain zero automatic Album asset upload retries.');\n} else {"
new = "if (['0.19.21', '0.19.22'].includes(pkg.version)) {\n  assert.ok(albumApi.includes('return verify(albumId, payload, { expectedAsset: {'), 'Build99+ successor must preserve Track Manager authority while strengthening Album asset normal-success verification.');\n  assert.ok(albumApi.includes('maxAutomaticAssetUploadRetries: 0'), 'Build99+ successor must retain zero automatic Album asset upload retries.');\n} else {"
if text.count(old) != 1:
    raise SystemExit(f'C2.5-D Build99 successor marker mismatch: {text.count(old)}')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
print('Build100 V2 aligned C2.5-D inherited verification guard')
