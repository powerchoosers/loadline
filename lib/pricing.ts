/*
 * Launch pricing, approved by Lewis on 2026-11-24: $79 per seat per month billed annually,
 * $99 month to month. Setting PRICING_CONFIRMED to false shows a "draft" notice on the page.
 * Still open before this page goes public: the app has no billing or trial yet, the
 * Brokerage perks are proposals, and SALES_CONTACT is empty.
 */
export const PRICING_CONFIRMED = true;

/** Where "Talk to us" should go, for example 'mailto:sales@yourdomain.com'. Empty hides the button. */
export const SALES_CONTACT = '';

export const TRIAL_DAYS = 14;

export const pro = {
  name: 'Loadline Pro',
  blurb: 'For independent consultants and small teams.',
  monthly: 99,
  annualPerMonth: 79,
  includes: [
    'The full Lead desk: accounts, contacts, lists and assignments',
    'Intelligence chat and voice, with sources',
    'Built-in browser with approvals',
    'Files: PDFs, Word and Excel',
    'Market snapshot and contract radar',
    'Outlook mail, drafts and reminders',
    'Shared workspace with owner, admin and member roles',
    'Every update as it ships',
  ],
};

export const brokerage = {
  name: 'Brokerage',
  blurb: 'For firms with ten or more seats.',
  includes: [
    'Everything in Loadline Pro',
    'Volume pricing by seat count',
    'Help moving your book into the Lead desk',
    'Onboarding for your team',
    'A named contact for support',
    'Invoicing instead of card billing',
  ],
};

export const pricingFaq = [
  ['What counts as a seat?', 'One person who signs in to your workspace. Add or remove seats as your team changes.'],
  ['Is there a free trial?', `Yes. Every new workspace gets ${TRIAL_DAYS} days with everything included, and you do not need a card to start.`],
  ['Is Intelligence usage limited?', 'Chat and voice are included under a fair-use allowance sized for a full working day of questions. It exists to stop automated abuse, not to meter normal work.'],
  ['Why is there no free plan?', 'Every Intelligence answer and voice minute has a real cost to run. A trial lets you judge the full product instead of a limited one.'],
  ['How do I upgrade?', 'Inside the app. During your trial a banner shows the days you have left with an Upgrade button, and the same option is in Settings under your account. Payment is by card through Stripe.'],
  ['What happens when the trial ends?', 'The app tells you the trial has ended and asks a workspace owner or admin to upgrade. Your accounts and files stay where they are.'],
  ['Can I switch between monthly and annual?', 'Yes. Annual billing is the lower price per month and is paid up front for the year.'],
];
