import PageCurve from './PageCurve';

/** Shared top of every inner page: title, lede and the load line that ties back to the home hero. */
export default function PageHero({ title, lede, children }: { title: string; lede: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <h1>{title}</h1>
        <p>{lede}</p>
        {children}
      </div>
      <PageCurve />
    </section>
  );
}
