import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { listReleases, RELEASES } from '@/lib/release';

export const metadata: Metadata = {
  title: 'What’s new',
  description: 'Recent Loadline AI releases for Windows.',
};

/** Turns release notes into plain lines. Notes are shown as text, never as HTML. */
function lines(notes: string): string[] {
  return notes
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*+]|#{1,6})\s+/, '').replace(/[*_`]/g, '').trim())
    .filter(Boolean)
    .slice(0, 12);
}

export default async function ChangelogPage() {
  const all = await listReleases();
  const releases = all.slice(0, 12);
  return (
    <>
      <PageHero
        title="What’s new in Loadline AI."
        lede="Every public release, newest first. The app offers each one to you when it is ready."
      />

      <section className="releases">
        {releases.length === 0 ? (
          <p className="releases-empty">
            The release list could not be loaded just now. <a className="text-link" href={RELEASES}>Open the releases page</a>
          </p>
        ) : (
          <ol>
            {releases.map((release, index) => {
              const notes = lines(release.notes);
              return (
                <li key={release.version}>
                  <div className="release-meta">
                    <h2>Version {release.version}</h2>
                    <p>{release.published}</p>
                    {index === 0 && <span className="release-latest">Latest</span>}
                  </div>
                  <div className="release-body">
                    {notes.length > 0 && <ul>{notes.map((note, i) => <li key={i}>{note}</li>)}</ul>}
                    <p className="release-links">
                      <a className="text-link" href={release.href}>Download installer, {release.sizeMb} MB</a>
                      <a className="text-link" href={release.page}>Release page</a>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {all.length > releases.length && (
          <a className="text-link" href={RELEASES}>See older releases</a>
        )}
      </section>

      <DownloadBand release={releases[0] ?? null} />
    </>
  );
}
