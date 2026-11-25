import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you use the Loadline AI app, its online services and this website.',
};

const sections: LegalSection[] = [
  {
    title: 'Using Loadline',
    items: [
      ['Agreement', <>These terms apply to the Loadline AI desktop app, its online services and this website. By using them you agree to these terms and acknowledge the <Link className="page-note-link" href="/privacy">Privacy Policy</Link>. If you use Loadline for a company, you confirm that you can accept these terms for it.</>],
      ['Who can use it', 'You must be at least 18. Loadline is a tool for business use.'],
      ['Your account', 'Give accurate information, keep your sign-in secure, and tell us if you think someone else has used your account. You are responsible for activity under it.'],
      ['Workspaces', 'Workspace owners and admins control membership and access, and are responsible for how their team uses the workspace.'],
    ],
  },
  {
    title: 'Acceptable use',
    items: [
      ['Follow the law', 'Do not use Loadline to break the law, infringe anyone’s rights, send spam, harass people, or collect data you are not allowed to collect.'],
      ['Calls and email', 'You are responsible for following the rules that apply to your calls, texts and email, including consent to record a call, notice about email tracking, do-not-call lists and opt-out requests.'],
      ['Protect the service', 'Do not probe or bypass security, disrupt the service, access another customer’s data, or copy or resell the service without permission.'],
    ],
  },
  {
    title: 'The assistant',
    items: [
      ['Check its work', 'AI answers, summaries, research, estimates and drafts can be wrong or incomplete. Verify them before you rely on them or send them. They are not legal, financial or engineering advice.'],
      ['Actions and commands', 'Review what you approve. Commands run with your own computer permissions, and you are responsible for the actions you allow or start.'],
    ],
  },
  {
    title: 'Content and services',
    items: [
      ['Your content', 'You keep your rights in the information and files you put into Loadline. You give us permission to store and process them as needed to provide the service. You confirm that you have the right to use them this way.'],
      ['Loadline', 'The app, website and Loadline brand belong to Loadline or its licensors. While you follow these terms, you may use them for your business.'],
      ['Third parties', 'Features that rely on other services, such as Google, Microsoft, AI providers or calling and data providers, are also subject to those services’ terms and can change or become unavailable.'],
    ],
  },
  {
    title: 'Plans and payment',
    items: [
      ['Paid plans', 'If you buy a plan or use a paid feature, the price, billing period, any trial and renewal terms shown at purchase apply. You can cancel to stop future renewals. Fees already paid are not refunded unless the purchase terms say so or the law requires it.'],
    ],
  },
  {
    title: 'Legal terms',
    items: [
      ['Ending access', 'You can stop using Loadline at any time. We may suspend or end access if you break these terms, create a risk for others, or fail to pay. We may also change or discontinue parts of the service.'],
      ['No warranty', 'To the extent the law allows, Loadline is provided “as is” and “as available”, without warranties of any kind. We do not promise that it will be uninterrupted, free of errors, or that its results are accurate.'],
      ['Limit of liability', 'To the extent the law allows, Loadline is not liable for indirect, incidental, special or consequential damages, or for lost profits, revenue or data. Our total liability for any claim is limited to the greater of the amount you paid for Loadline in the 12 months before the claim, or 100 US dollars.'],
      ['Changes', 'We may update these terms. We will post the new version here and change the date below. Continuing to use Loadline after a change means you accept it.'],
      ['Contact', 'For questions about these terms, write to the support email shown for Loadline on Google’s sign-in screen. Select the app or developer name on that screen to see it.'],
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lede="The rules for using Loadline, written to be read."
      updated="November 25, 2026"
      sections={sections}
      other={{ href: '/privacy', label: 'Privacy Policy' }}
    />
  );
}
