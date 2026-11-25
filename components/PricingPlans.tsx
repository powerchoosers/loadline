'use client';

import { useState } from 'react';
import Link from 'next/link';
import { brokerage, pro, SALES_CONTACT, TRIAL_DAYS } from '@/lib/pricing';

/** Plan cards with a monthly or annual switch. The price blurs across when the period changes. */
export default function PricingPlans() {
  const [annual, setAnnual] = useState(true);
  const price = annual ? pro.annualPerMonth : pro.monthly;
  const saving = Math.round((1 - pro.annualPerMonth / pro.monthly) * 100);

  return (
    <section className="plans">
      <div className="period" role="group" aria-label="Billing period" data-annual={annual}>
        <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>
          Annual <span>Save {saving}%</span>
        </button>
        <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button>
      </div>

      <div className="plan-grid">
        <article className="plan plan-main">
          <h2>{pro.name}</h2>
          <p className="plan-blurb">{pro.blurb}</p>
          <p className="plan-price" aria-live="polite">
            <b key={price}>${price}</b>
            <span>per seat, per month{annual ? ', billed annually' : ''}</span>
          </p>
          <Link className="btn btn-primary" href="/download">Start your {TRIAL_DAYS}-day trial</Link>
          <p className="plan-note">No card needed to start. Upgrade from inside the app when you are ready.</p>
          <ul>{pro.includes.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>

        <article className="plan">
          <h2>{brokerage.name}</h2>
          <p className="plan-blurb">{brokerage.blurb}</p>
          <p className="plan-price"><b>Custom</b><span>priced by seat count</span></p>
          {SALES_CONTACT ? (
            <a className="btn btn-quiet" href={SALES_CONTACT}>Talk to us</a>
          ) : (
            <span className="btn btn-quiet" aria-disabled="true">Talk to us</span>
          )}
          <p className="plan-note">Tell us your seat count and we will quote it.</p>
          <ul>{brokerage.includes.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}
