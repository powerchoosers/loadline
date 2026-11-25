import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { downloadAction, latestRelease, RELEASES } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Download',
  description: 'Download the Loadline AI installer for Windows and see how installing and updating work.',
};

const install = [
  'Download the installer and open it.',
  'Follow the setup steps. Loadline AI opens when it finishes.',
  'Sign in, or create your workspace.',
];

const updates = [
  ['It checks for you', 'Loadline AI looks for a new version when it starts and from time to time while it is idle.'],
  ['You decide when', 'Nothing downloads or installs on its own. The app tells you an update is ready and waits for you.'],
  ['Check any time', 'Choose Help, then Check for updates.'],
];

export default async function DownloadPage() {
  const release = await latestRelease();
  const action = downloadAction(release);
  return (
    <>
      <PageHero
        title="Download Loadline AI."
        lede="One installer for Windows. Updates arrive inside the app, and you choose when to install them."
      >
        <div className="hero-actions">
          <a className="btn btn-primary" href={action.href}>{action.label}</a>
          <a className="btn btn-quiet" href={RELEASES}>All releases</a>
        </div>
      </PageHero>

      <section className="dl-grid">
        <div className="dl-facts">
          <h2>This release</h2>
          {release ? (
            <dl>
              <div><dt>Version</dt><dd>{release.version}</dd></div>
              <div><dt>Published</dt><dd>{release.published}</dd></div>
              <div><dt>Installer size</dt><dd>{release.sizeMb} MB</dd></div>
              <div><dt>Platform</dt><dd>Windows, 64-bit</dd></div>
              <div><dt>File</dt><dd>Loadline-AI-Setup-{release.version}.exe</dd></div>
            </dl>
          ) : (
            <p>The latest release could not be confirmed just now. You can still get the installer from the releases page.</p>
          )}
          <Link className="text-link" href="/changelog">See what’s new</Link>
          <br />
          <Link className="text-link" href="/pricing">See plans and pricing</Link>
        </div>

        <div className="dl-steps">
          <h2>Install</h2>
          <ol>{install.map((step) => <li key={step}>{step}</li>)}</ol>
          <p className="dl-hint">
            Upgrading from version 0.1.0? That version cannot update itself. Install the current version over it once, and updates work from then on.
          </p>
        </div>
      </section>

      <section className="approvals">
        <h2>How updates work</h2>
        <ul>
          {updates.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
