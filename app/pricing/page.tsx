import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import PricingPlans from '@/components/PricingPlans';
import DownloadBand from '@/components/DownloadBand';
import { latestRelease } from '@/lib/release';
import { PRICING_CONFIRMED, pricingFaq } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'One plan with everything in Loadline AI, priced per seat, plus custom pricing for brokerages.',
};

const reasons = [
  ['One plan, nothing held back', 'The Lead desk, Intelligence, voice, the browser, files and market data are all in Loadline Pro. There are no feature tiers to compare.'],
  ['Priced per person', 'You pay for the people who sign in. A solo consultant and a team of eight pay the same rate per seat.'],
  ['It replaces several tools', 'A CRM, an AI assistant and a research browser usually come as separate subscriptions. Loadline AI is one.'],
];

export default async function PricingPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="One plan. Everything in it."
        lede="Loadline AI is priced per seat, with every feature included. Larger brokerages get volume pricing and help getting set up."
      />

      {!PRICING_CONFIRMED && (
        <p className="draft-note" role="note">
          Draft pricing. These plans and prices are a proposal and have not been confirmed.
        </p>
      )}

      <PricingPlans />

      <section className="approvals">
        <h2>How we think about price</h2>
        <ul>
          {reasons.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="faq">
        <section className="faq-group">
          <h2>Pricing questions</h2>
          <div>
            {pricingFaq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section className="guide-more">
        <h2>Ready to try it?</h2>
        <p>Install the app and follow the short setup guide.</p>
        <Link className="btn btn-quiet" href="/getting-started">Open the guide</Link>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
