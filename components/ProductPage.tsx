import type { ReactNode } from 'react';
import PageHero from './PageHero';
import DownloadBand from './DownloadBand';
import { latestRelease } from '@/lib/release';

export type ProductRow = { id: string; name: string; title: string; text: string; points: string[]; visual: ReactNode };

/** Shared layout for product pages: hero, alternating copy and panel rows, an optional short list, download. */
export default async function ProductPage({
  title,
  lede,
  rows,
  also,
  alsoTitle = 'Also here',
}: {
  title: string;
  lede: string;
  rows: ProductRow[];
  also?: string[][];
  alsoTitle?: string;
}) {
  const release = await latestRelease();
  return (
    <>
      <PageHero title={title} lede={lede}>
        <nav className="jump" aria-label="On this page">
          {rows.map((row) => <a key={row.id} href={`#${row.id}`}>{row.name}</a>)}
        </nav>
      </PageHero>

      <div className="features">
        {rows.map((row) => (
          <section className="feature" id={row.id} key={row.id}>
            <div className="feature-copy">
              <p className="feature-name">{row.name}</p>
              <h2>{row.title}</h2>
              <p>{row.text}</p>
              <ul>{row.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div className="feature-visual" role="img" aria-label={`Simplified view with sample data: ${row.name}`}>
              <div aria-hidden="true">{row.visual}</div>
            </div>
          </section>
        ))}
      </div>

      {also && (
        <section className="also">
          <h2>{alsoTitle}</h2>
          <dl>
            {also.map(([name, text]) => (
              <div key={name}><dt>{name}</dt><dd>{text}</dd></div>
            ))}
          </dl>
        </section>
      )}

      <DownloadBand release={release} />
    </>
  );
}
