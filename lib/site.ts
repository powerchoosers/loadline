/** Public address of the site. Set NEXT_PUBLIC_SITE_URL when deploying; local preview is the fallback. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100').replace(/\/$/, '');

export const ROUTES = [
  '', '/features', '/lead-desk', '/intelligence', '/market', '/use-cases', '/pricing',
  '/security', '/getting-started', '/faq', '/download', '/changelog', '/privacy', '/terms',
];
