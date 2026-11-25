export const RELEASES = 'https://github.com/powerchoosers/loadline-ai-releases/releases';
const API = 'https://api.github.com/repos/powerchoosers/loadline-ai-releases/releases';

export type Release = {
  version: string;
  href: string;
  sizeMb: number;
  published: string;
  notes: string;
  page: string;
};

type Raw = {
  tag_name?: string;
  published_at?: string;
  body?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  assets?: { browser_download_url?: string; size?: number }[];
};

function normalize(data: Raw): Release | null {
  const version = String(data.tag_name ?? '').replace(/^v/, '');
  if (!/^\d+\.\d+\.\d+$/.test(version) || data.draft || data.prerelease) return null;
  const expected = `${RELEASES}/download/v${version}/Loadline-AI-Setup-${version}.exe`;
  const asset = (data.assets ?? []).find((item) => item.browser_download_url === expected);
  if (!asset || !Number.isSafeInteger(asset.size) || (asset.size ?? 0) <= 0) return null;
  const date = new Date(data.published_at ?? '');
  if (Number.isNaN(date.getTime())) return null;
  return {
    version,
    href: expected,
    sizeMb: Math.round((asset.size as number) / 1048576),
    published: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    notes: (data.body ?? '').trim(),
    page: `${RELEASES}/tag/v${version}`,
  };
}

async function read(path: string): Promise<unknown> {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: 600 },
  });
  if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);
  return response.json();
}

/** Latest public installer, or null when it cannot be confirmed. */
export async function latestRelease(): Promise<Release | null> {
  try {
    return normalize((await read('/latest')) as Raw);
  } catch {
    return null;
  }
}

/** Recent public releases with a matching installer. Empty when the list cannot be read. */
export async function listReleases(): Promise<Release[]> {
  try {
    const data = (await read('?per_page=30')) as Raw[];
    return Array.isArray(data) ? data.map(normalize).filter((item): item is Release => item !== null) : [];
  } catch {
    return [];
  }
}

export function downloadAction(release: Release | null) {
  return release
    ? { href: release.href, label: 'Download for Windows', note: `Version ${release.version}, ${release.sizeMb} MB installer` }
    : { href: RELEASES, label: 'Get the latest release', note: 'Opens the Loadline AI releases page' };
}
