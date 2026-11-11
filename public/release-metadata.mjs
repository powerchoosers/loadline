const releasesUrl = 'https://github.com/powerchoosers/loadline/releases';

function expectedZipUrl(version) {
  return `${releasesUrl}/download/v${version}/loadline-browser-windows-x64-${version}.zip`;
}

function expectedInstallerUrl(version) {
  return `${releasesUrl}/download/v${version}/Loadline-Setup-${version}.exe`;
}

// Validate the published manifest before exposing download links.
// downloadUrl remains the portable ZIP for in-browser update prompts.
export function normalizeRelease(release) {
  if (!release || typeof release !== 'object' || Array.isArray(release)) return null;

  const {
    version,
    platform,
    sizeBytes,
    sha256,
    installerSizeBytes,
    installerSha256,
    publishedAt,
  } = release;
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) return null;
  if (platform !== 'windows-x64') return null;
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) return null;
  if (typeof sha256 !== 'string' || !/^[a-f\d]{64}$/i.test(sha256)) return null;
  if (!Number.isSafeInteger(installerSizeBytes) || installerSizeBytes <= 0) return null;
  if (typeof installerSha256 !== 'string' || !/^[a-f\d]{64}$/i.test(installerSha256)) return null;
  if (typeof publishedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(publishedAt)) return null;

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 19) !== publishedAt.slice(0, 19)) return null;

  const downloadUrl = expectedZipUrl(version);
  const installerDownloadUrl = expectedInstallerUrl(version);
  if (release.downloadUrl !== downloadUrl) return null;
  if (release.installerDownloadUrl !== installerDownloadUrl) return null;

  const notesUrl = `${releasesUrl}/tag/v${version}`;
  return {
    version,
    platform,
    downloadUrl,
    installerDownloadUrl,
    sizeBytes,
    sha256: sha256.toLowerCase(),
    installerSizeBytes,
    installerSha256: installerSha256.toLowerCase(),
    publishedAt: date.toISOString(),
    releaseNotesUrl: release.releaseNotesUrl === notesUrl ? notesUrl : null,
  };
}
