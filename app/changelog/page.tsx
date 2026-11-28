import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { listReleases, parseNotes, RELEASES } from '@/lib/release';

export const metadata: Metadata = {
  title: 'What’s new',
  description: 'What changed in each Loadline AI release for Windows: new features, improvements, fixes and performance.',
};

const SHOWN = 30;

export default async function ChangelogPage() {
  const all = await listReleases();
  const releases = all.slice(0, SHOWN);
  return (
    <>
      <PageHero
        title="What’s new in Loadline AI."
        lede="What changed in every public release, newest first. The app offers each one to you when it is ready."
      />

      <section className="releases">
        {releases.length === 0 ? (
          <p className="releases-empty">
            The release list could not be loaded just now. <a className="text-link" href={RELEASES}>Open the releases page</a>
          </p>
        ) : (
          <ol>
            {releases.map((release, index) => {
              // Releases published before structured notes fall back to one plain list.
              const loose = release.sections.length ? [] : parseNotes(release.notes).loose;
              return (
                <li key={release.version} id={`v${release.version}`}>
                  <div className="release-meta">
                    <h2>Version {release.version}</h2>
                    <p><time dateTime={release.publishedAt}>{release.published}</time></p>
                    {index === 0 && <span className="release-latest">Latest</span>}
                  </div>
                  <div className="release-body">
                    {release.summary && <p className="release-summary">{release.summary}</p>}
                    {release.sections.map((section) => (
                      <section className="release-section" data-kind={section.title.toLowerCase()} key={section.title}>
                        <h3>{section.title}</h3>
                        <ul>{section.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                      </section>
                    ))}
                    {loose.length > 0 && <ul className="release-loose">{loose.map((note, i) => <li key={i}>{note}</li>)}</ul>}
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
