export const RELEASES = 'https://github.com/powerchoosers/loadline-ai-releases/releases';
const API = 'https://api.github.com/repos/powerchoosers/loadline-ai-releases/releases';
/** Written by the app's release workflow and attached to the newest release. Not subject to GitHub API limits. */
const FEED = `${RELEASES}/latest/download/changelog.json`;
const REVALIDATE = 300;

export const SECTION_TITLES = ['New', 'Improved', 'Fixed', 'Performance'] as const;
export type SectionTitle = (typeof SECTION_TITLES)[number];
export type ReleaseSection = { title: SectionTitle; items: string[] };

export type Release = {
  version: string;
  href: string;
  sizeMb: number;
  published: string;
  /** ISO date, for the time element. */
  publishedAt: string;
  notes: string;
  summary: string;
  sections: ReleaseSection[];
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

type FeedItem = { version?: unknown; publishedAt?: unknown; installerSize?: unknown; notes?: unknown };

/** Notes are shown as text, never as HTML. Inline markdown marks are dropped. */
function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
}

/**
 * Splits release notes into an opening summary and the New, Improved, Fixed and Performance lists.
 * Notes without those headings become one untitled list, so older releases still read cleanly.
 */
export function parseNotes(notes: string): { summary: string; sections: ReleaseSection[]; loose: string[] } {
  const summary: string[] = [];
  const sections: ReleaseSection[] = [];
  const loose: string[] = [];
  let current: ReleaseSection | null = null;
  let structured = false;
  for (const raw of notes.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const heading = /^#{1,6}\s+(.+?)\s*$/.exec(line);
    if (heading) {
      const title = SECTION_TITLES.find((name) => name.toLowerCase() === plain(heading[1]).toLowerCase());
      current = title ? { title, items: [] } : null;
      if (current) { sections.push(current); structured = true; }
      continue;
    }
    const bullet = /^[-*+]\s+(.+)$/.exec(line);
    const text = plain(bullet ? bullet[1] : line);
    if (!text) continue;
    if (bullet && current) current.items.push(text);
    else if (!structured && !bullet) summary.push(text);
    else loose.push(text);
  }
  const filled = sections.filter((section) => section.items.length > 0).map((section) => ({ ...section, items: section.items.slice(0, 16) }));
  if (!filled.length) return { summary: '', sections: [], loose: [...summary, ...loose].slice(0, 12) };
  return { summary: summary.join(' '), sections: filled, loose: [] };
}

function build(version: string, size: number, publishedAt: string, notes: string): Release | null {
  if (!/^\d+\.\d+\.\d+$/.test(version) || !Number.isSafeInteger(size) || size <= 0) return null;
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  const parsed = parseNotes(notes);
  return {
    version,
    href: `${RELEASES}/download/v${version}/Loadline-AI-Setup-${version}.exe`,
    sizeMb: Math.round(size / 1048576),
    published: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    publishedAt: date.toISOString(),
    notes: notes.trim(),
    summary: parsed.summary,
    sections: parsed.sections,
    page: `${RELEASES}/tag/v${version}`,
  };
}

function normalize(data: Raw): Release | null {
  const version = String(data.tag_name ?? '').replace(/^v/, '');
  if (data.draft || data.prerelease) return null;
  const expected = `${RELEASES}/download/v${version}/Loadline-AI-Setup-${version}.exe`;
  const asset = (data.assets ?? []).find((item) => item.browser_download_url === expected);
  if (!asset) return null;
  return build(version, asset.size ?? 0, data.published_at ?? '', data.body ?? '');
}

async function read(path: string): Promise<unknown> {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: REVALIDATE },
  });
  if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);
  return response.json();
}

/** The changelog feed, newest first. Empty when it cannot be read or holds nothing usable. */
async function readFeed(): Promise<Release[]> {
  try {
    const response = await fetch(FEED, { next: { revalidate: REVALIDATE } });
    if (!response.ok) return [];
    const data = (await response.json()) as { releases?: FeedItem[] };
    if (!Array.isArray(data?.releases)) return [];
    return data.releases
      .map((item) => build(String(item?.version ?? ''), Number(item?.installerSize), String(item?.publishedAt ?? ''), typeof item?.notes === 'string' ? item.notes : ''))
      .filter((item): item is Release => item !== null);
  } catch {
    return [];
  }
}

/** Latest public installer, or null when it cannot be confirmed. */
export async function latestRelease(): Promise<Release | null> {
  const feed = await readFeed();
  if (feed.length) return feed[0];
  try {
    return normalize((await read('/latest')) as Raw);
  } catch {
    return null;
  }
}

/** Recent public releases with a matching installer. Empty when the list cannot be read. */
export async function listReleases(): Promise<Release[]> {
  const feed = await readFeed();
  if (feed.length) return feed;
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
