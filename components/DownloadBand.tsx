import Link from 'next/link';
import { downloadAction, type Release } from '@/lib/release';
import { LogoMark } from './panels';

/** Closing call to action shared by every page. */
export default function DownloadBand({ release }: { release: Release | null }) {
  const action = downloadAction(release);
  return (
    <section className="download">
      <div className="download-card">
        <LogoMark size={44} />
        <h2>Put Loadline AI on your desk.</h2>
        <p>
          {release
            ? `Version ${release.version} for Windows, published ${release.published}. The installer is ${release.sizeMb} MB.`
            : 'The installer is published on the Loadline AI releases page.'}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={action.href}>{action.label}</a>
          <Link className="btn btn-quiet" href="/download">Install and update help</Link>
        </div>
      </div>
    </section>
  );
}
