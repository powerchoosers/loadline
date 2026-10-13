const releasesUrl = 'https://github.com/powerchoosers/loadline/releases';

// Check the published metadata before making a download link available.
// This validates the manifest contract; it does not verify the ZIP's contents.
export function normalizeRelease(release) {
  if (!release || typeof release !== 'object' || Array.isArray(release)) return null;

  const { version, platform, sizeBytes, sha256, publishedAt } = release;
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) return null;
  if (platform !== 'windows-x64') return null;
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) return null;
  if (typeof sha256 !== 'string' || !/^[a-f\d]{64}$/i.test(sha256)) return null;
  if (typeof publishedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(publishedAt)) return null;

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 19) !== publishedAt.slice(0, 19)) return null;

  const downloadUrl = `${releasesUrl}/download/v${version}/loadline-browser-windows-x64-${version}.zip`;
  if (release.downloadUrl !== downloadUrl) return null;

  const notesUrl = `${releasesUrl}/tag/v${version}`;
  return {
    version,
    platform,
    downloadUrl,
    sizeBytes,
    sha256: sha256.toLowerCase(),
    publishedAt: date.toISOString(),
    releaseNotesUrl: release.releaseNotesUrl === notesUrl ? notesUrl : null,
  };
}
