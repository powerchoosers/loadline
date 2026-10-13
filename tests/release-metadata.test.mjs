import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { normalizeRelease } from '../release-metadata.mjs';

const current = JSON.parse(await readFile(new URL('../public/updates/latest.json', import.meta.url), 'utf8'));
const valid = {
  version: '0.3.91',
  platform: 'windows-x64',
  downloadUrl: 'https://github.com/powerchoosers/loadline/releases/download/v0.3.91/loadline-browser-windows-x64-0.3.91.zip',
  sizeBytes: 493160414,
  sha256: '2DA1EB84D2DA57C14FEDB5DBD0C9A05377850865AFB4A5CEBA85A7219666CB85',
  publishedAt: '2026-09-19T13:16:03.7659819Z',
  releaseNotesUrl: 'https://github.com/powerchoosers/loadline/releases/tag/v0.3.91',
};

test('the existing published manifest satisfies the download contract', () => {
  const release = normalizeRelease(current);
  assert.ok(release);
  assert.equal(release.version, current.version);
  assert.equal(release.downloadUrl, current.downloadUrl);
  assert.equal(release.sizeBytes, current.sizeBytes);
  assert.equal(release.sha256, current.sha256.toLowerCase());
  assert.equal(release.releaseNotesUrl, current.releaseNotesUrl);
});

test('valid metadata is normalized without changing the input', () => {
  const original = structuredClone(valid);
  assert.deepEqual(normalizeRelease(valid), {
    ...valid,
    sha256: valid.sha256.toLowerCase(),
    publishedAt: '2026-09-19T13:16:03.765Z',
  });
  assert.deepEqual(valid, original);
});

test('missing or malformed release metadata cannot enable a download', () => {
  for (const value of [null, undefined, false, 'release', [], {}]) {
    assert.equal(normalizeRelease(value), null);
  }
  for (const [field, values] of Object.entries({
    version: [undefined, '', 'v0.3.91', '0.3', '0.3.91/other', 0.391],
    platform: [undefined, 'windows', 'mac-arm64'],
    sizeBytes: [undefined, 0, -1, '493160414', 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1],
    sha256: [undefined, '', 'a'.repeat(63), 'g'.repeat(64), `${'a'.repeat(64)} `],
    publishedAt: [undefined, '', 'yesterday', '2026-09-19', '2026-02-31T13:16:03Z', '2026-09-19T25:16:03Z'],
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
    valid.downloadUrl.replace('github.com', 'github.com.evil.example'),
    valid.downloadUrl.replace('github.com', 'evil.example@github.com'),
    valid.downloadUrl.replace('powerchoosers/loadline', 'other/loadline'),
    valid.downloadUrl.replace('/v0.3.91/', '/v0.3.90/'),
    valid.downloadUrl.replace('-0.3.91.zip', '-0.3.90.zip'),
    valid.downloadUrl.replace('.zip', '.exe'),
    `${valid.downloadUrl}?redirect=evil`,
    `${valid.downloadUrl}#fragment`,
    'javascript:alert(1)',
  ]) {
    assert.equal(normalizeRelease({ ...valid, downloadUrl }), null, String(downloadUrl));
  }
  assert.equal(normalizeRelease({ ...valid, version: '0.3.92' }), null);
});

test('an unsafe notes link is omitted while a valid download remains available', () => {
  for (const releaseNotesUrl of [
    undefined,
    '',
    '/download/',
    'javascript:alert(1)',
    valid.releaseNotesUrl.replace('powerchoosers/loadline', 'other/loadline'),
    valid.releaseNotesUrl.replace('v0.3.91', 'v0.3.90'),
    `${valid.releaseNotesUrl}?redirect=evil`,
  ]) {
    const release = normalizeRelease({ ...valid, releaseNotesUrl });
    assert.ok(release);
    assert.equal(release.releaseNotesUrl, null);
    assert.equal(release.downloadUrl, valid.downloadUrl);
  }
});
