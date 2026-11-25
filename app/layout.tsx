import type { Metadata, Viewport } from 'next';
import { Geist, Manrope } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import { SITE_URL } from '@/lib/site';
import './globals.css';

// Display face for headlines. Swap this one import to change it site-wide.
const display = Geist({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Loadline AI, the workspace for commercial energy consultants', template: '%s | Loadline AI' },
  description:
    'Loadline AI is a Windows workspace for commercial energy consultants. Accounts, bills, research and follow-up share one window, with an assistant that shows its sources.',
};

export const viewport: Viewport = { themeColor: '#131313', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
