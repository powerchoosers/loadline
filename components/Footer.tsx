import Link from 'next/link';
import { RELEASES } from '@/lib/release';
import { LogoMark } from './panels';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <span className="brand"><LogoMark size={20} /> Loadline AI</span>
          <p>The Windows workspace for commercial energy consultants.</p>
        </div>
        <nav aria-label="Product">
          <h2>Product</h2>
          <Link href="/features">Features</Link>
          <Link href="/lead-desk">Lead desk</Link>
          <Link href="/intelligence">Intelligence</Link>
          <Link href="/market">Market</Link>
          <Link href="/use-cases">Use cases</Link>
          <Link href="/security">Security</Link>
        </nav>
        <nav aria-label="Help">
          <h2>Help</h2>
          <Link href="/getting-started">Getting started</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <nav aria-label="Get the app">
          <h2>Get the app</h2>
          <Link href="/pricing">Pricing</Link>
          <Link href="/download">Download</Link>
          <Link href="/changelog">What’s new</Link>
          <a href={RELEASES}>All releases</a>
        </nav>
        <nav aria-label="Loadline">
          <h2>Loadline</h2>
          <a href="https://loadlinehq.com">Loadline browser</a>
        </nav>
      </div>
      <p className="site-footer-legal">© 2026 Loadline. Product screens on this site are simplified and use sample data. <Link href="/privacy">Privacy Policy</Link> <Link href="/terms">Terms of Service</Link></p>
    </footer>
  );
}
