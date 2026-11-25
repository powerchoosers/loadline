import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function NotFound() {
  return (
    <PageHero title="This page is off the grid." lede="The address may have changed, or the page never existed.">
      <div className="hero-actions">
        <Link className="btn btn-primary" href="/">Go to the home page</Link>
        <Link className="btn btn-quiet" href="/features">See features</Link>
      </div>
    </PageHero>
  );
}
