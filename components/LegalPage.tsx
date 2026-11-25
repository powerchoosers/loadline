import Link from 'next/link';
import PageHero from './PageHero';

export type LegalSection = { title: string; items: [string, React.ReactNode][] };

/** Shared layout for the privacy policy and terms, built on the same topic rows as the Security page. */
export default function LegalPage({ title, lede, updated, sections, other }: {
  title: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
  other: { href: string; label: string };
}) {
  return (
    <>
      <PageHero title={title} lede={lede} />

      <div className="topics">
        {sections.map((section) => (
          <section className="topic" key={section.title}>
            <h2>{section.title}</h2>
            <dl>
              {section.items.map(([name, text]) => (
                <div key={name}><dt>{name}</dt><dd>{text}</dd></div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="page-note">
        Last updated {updated}. See also the <Link className="page-note-link" href={other.href}>{other.label}</Link>.
      </p>
    </>
  );
}
