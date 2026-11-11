import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { normalizeRelease } from '../release-metadata.mjs';

const current = JSON.parse(await readFile(new URL('../public/updates/latest.json', import.meta.url), 'utf8'));
const valid = {
  version: '0.3.326',
  platform: 'windows-x64',
  downloadUrl: 'https://github.com/powerchoosers/loadline/releases/download/v0.3.326/loadline-browser-windows-x64-0.3.326.zip',
  installerDownloadUrl: 'https://github.com/powerchoosers/loadline/releases/download/v0.3.326/Loadline-Setup-0.3.326.exe',
  sizeBytes: 508533341,
  installerSizeBytes: 520000000,
  sha256: '1ac7ff24f43dbe5d9f52c7c5a41ef539ac1996f290648e1ec47caacdb9a1aa23',
  installerSha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  publishedAt: '2026-11-11T19:20:15.1185829Z',
  releaseNotesUrl: 'https://github.com/powerchoosers/loadline/releases/tag/v0.3.326',
};

test('the existing published manifest satisfies the download contract', () => {
  const release = normalizeRelease(current);
  assert.ok(release);
  assert.equal(release.version, current.version);
  assert.equal(release.downloadUrl, current.downloadUrl);
  assert.equal(release.installerDownloadUrl, current.installerDownloadUrl);
  assert.equal(release.sizeBytes, current.sizeBytes);
  assert.equal(release.installerSizeBytes, current.installerSizeBytes);
  assert.equal(release.sha256, current.sha256.toLowerCase());
  assert.equal(release.installerSha256, current.installerSha256.toLowerCase());
  assert.equal(release.releaseNotesUrl, current.releaseNotesUrl);
});

test('valid metadata is normalized without changing the input', () => {
  const original = structuredClone(valid);
  assert.deepEqual(normalizeRelease(valid), {
    ...valid,
    sha256: valid.sha256.toLowerCase(),
    installerSha256: valid.installerSha256.toLowerCase(),
    publishedAt: '2026-11-11T19:20:15.118Z',
  });
  assert.deepEqual(valid, original);
});

test('missing or malformed release metadata cannot enable a download', () => {
  for (const value of [null, undefined, false, 'release', [], {}]) {
    assert.equal(normalizeRelease(value), null);
  }
  for (const [field, values] of Object.entries({
    version: [undefined, '', 'v0.3.326', '0.3', '0.3.326/other', 0.3326],
    platform: [undefined, 'windows', 'mac-arm64'],
    sizeBytes: [undefined, 0, -1, '508533341', 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1],
    installerSizeBytes: [undefined, 0, -1, '520000000', 1.5],
    sha256: [undefined, '', 'a'.repeat(63), 'g'.repeat(64), `${'a'.repeat(64)} `],
    installerSha256: [undefined, '', 'a'.repeat(63), 'g'.repeat(64)],
    publishedAt: [undefined, '', 'yesterday', '2026-11-11', '2026-02-31T13:16:03Z', '2026-11-11T25:16:03Z'],
  })) {
    for (const value of values) {
      assert.equal(normalizeRelease({ ...valid, [field]: value }), null, `${field}: ${String(value)}`);
    }
  }
});

test('downloads must belong to this repository and match both version and file name', () => {
  for (const downloadUrl of [
    undefined,
    '/download/',
    valid.downloadUrl.replace('https:', 'http:'),
    valid.downloadUrl.replace('.zip', '.exe'),
    `${valid.downloadUrl}?redirect=evil`,
  ]) {
    assert.equal(normalizeRelease({ ...valid, downloadUrl }), null, String(downloadUrl));
  }
  for (const installerDownloadUrl of [
    undefined,
    valid.installerDownloadUrl.replace('.exe', '.zip'),
    valid.installerDownloadUrl.replace('Loadline-Setup-0.3.326.exe', 'Loadline-Setup-0.3.325.exe'),
  ]) {
    assert.equal(normalizeRelease({ ...valid, installerDownloadUrl }), null, String(installerDownloadUrl));
  }
  assert.equal(normalizeRelease({ ...valid, version: '0.3.327' }), null);
});

test('an unsafe notes link is omitted while a valid download remains available', () => {
  const release = normalizeRelease({ ...valid, releaseNotesUrl: 'javascript:alert(1)' });
  assert.ok(release);
  assert.equal(release.releaseNotesUrl, null);
  assert.equal(release.installerDownloadUrl, valid.installerDownloadUrl);
});
