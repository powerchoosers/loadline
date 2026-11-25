import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Getting started',
  description: 'Install Loadline AI, sign in, and ask your first question in a few minutes.',
};

const steps = [
  {
    title: 'Install the app',
    text: 'Download the Windows installer and run it. Loadline AI opens when setup finishes.',
    link: ['/download', 'Go to the download page'],
  },
  {
    title: 'Sign in',
    text: 'Sign in to your Loadline account. If you use your Microsoft account, the sign-in page opens in your own browser and returns you to the app.',
    link: ['/pricing', 'See plans and pricing'],
  },
  {
    title: 'Open an account',
    text: 'Pick an account in the Lead desk, or press Ctrl K and search for one. The side panel and Intelligence now follow that record.',
  },
  {
    title: 'Ask your first question',
    text: 'Try “When does this contract end, and who is the current supplier?” Check the sources listed under the answer.',
    link: ['/intelligence', 'See what Intelligence can do'],
  },
  {
    title: 'Bring in a bill',
    text: 'Open a PDF, Word document or spreadsheet in the Files tab and ask about it. If a page is a scan with no selectable text, run a scan first.',
  },
  {
    title: 'Connect Outlook, if you want drafts',
    text: 'In Settings, open Connectors and connect Microsoft 365. This is separate from signing in. After that, Intelligence can prepare follow-up emails as Outlook drafts for you to send.',
    optional: true,
  },
  {
    title: 'Connect a project folder, if you need one',
    text: 'For proposal models or scripts, connect a local folder to search its files and run its commands from the Terminal tab.',
    optional: true,
  },
];

export default async function GettingStartedPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="Up and running in a few minutes."
        lede="Seven short steps from the installer to your first drafted follow-up. The last two are optional."
      />

      <ol className="guide">
        {steps.map((step, index) => (
          <li className="guide-step" key={step.title}>
            <span className="guide-number" aria-hidden="true">{index + 1}</span>
            <div>
              <h2>{step.title}</h2>
              {step.optional && <span className="guide-optional">Optional</span>}
              <p>{step.text}</p>
              {step.link && <Link className="text-link" href={step.link[0]}>{step.link[1]}</Link>}
            </div>
          </li>
        ))}
      </ol>

      <section className="guide-more">
        <h2>Stuck on something?</h2>
        <p>The answers to common questions are on one page.</p>
        <Link className="btn btn-quiet" href="/faq">Read the FAQ</Link>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
