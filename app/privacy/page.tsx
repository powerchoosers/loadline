import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What information Loadline collects, how it is used, who processes it, and the choices you have.',
};

const sections: LegalSection[] = [
  {
    title: 'Who this covers',
    items: [
      ['Scope', 'This policy covers the Loadline AI desktop app, the online services behind it, and this website. “Loadline”, “we” and “us” mean the operator of those services.'],
      ['Workspaces', 'If you join a team workspace, its owners and admins manage that workspace. People in it can see information according to their role and the access they have been given.'],
    ],
  },
  {
    title: 'Signing in with Google',
    items: [
      ['What we request', 'Only the basic sign-in permissions: openid, email and profile. Google shares an account identifier, your email address, and basic profile details such as your name and profile picture.'],
      ['How we use it', 'Only to sign you in, to create and identify your Loadline account, and to keep that account secure. Your email address and name can be shown to people in your workspace so they know who you are.'],
      ['What we do not access', 'Google sign-in does not give Loadline access to your Gmail, Google Drive, Google Calendar or Google contacts.'],
      ['Limits', 'We do not sell Google account information, use it for advertising, or use it to train AI models. We share it only with the providers that run sign-in and account storage for us, or when the law requires it.'],
      ['Removing access', <>You can remove Loadline from your Google account at any time at <a className="page-note-link" href="https://myaccount.google.com/connections">myaccount.google.com/connections</a>. That stops future Google sign-ins. To delete the Loadline account itself, send us a request as described below.</>],
      ['Google’s rules', <>Loadline’s use of information received from Google APIs follows the <a className="page-note-link" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including its Limited Use requirements.</>],
    ],
  },
  {
    title: 'What else we collect',
    items: [
      ['Your account', 'Your email address, your name, a profile photo if you add one, your preferences, and your workspace role. If you create a password, our sign-in provider stores it in hashed form.'],
      ['Your work', 'Records you or your team add, such as accounts, contacts, lead lists, reminders, notes, handoffs, workflows and files you choose to save to Loadline.'],
      ['Microsoft 365', 'You can sign in with Microsoft. Connecting Outlook is a separate, optional step. If you connect it, Loadline accesses your mail and calendar to provide email and calendar features, including sending messages that you send or schedule. If email tracking is on, Loadline records when a tracked message is loaded or a tracked link is opened.'],
      ['Phone features', 'If you use calling, we process phone numbers, call history, voicemails and, when those features are used, recordings, transcripts and call summaries.'],
      ['Assistant requests', 'Your questions to Intelligence, voice audio when you use voice, and the page, record or file content included to answer a request.'],
      ['Billing', 'If you buy a plan, our payment processor handles your card details. We keep subscription and billing status.'],
      ['Technical information', 'Our hosting and service providers keep ordinary logs, such as IP address, time and request details, to run and protect the service. We also keep feedback you send us.'],
    ],
  },
  {
    title: 'How we use it',
    items: [
      ['Running the service', 'To provide the features you use, keep your workspace in sync, support your team, process payments, fix problems and prevent abuse.'],
      ['What we do not do', 'We do not sell your personal information or use it to show you third-party advertising.'],
    ],
  },
  {
    title: 'Who processes it',
    items: [
      ['Hosting and sign-in', 'Supabase stores accounts and workspace data and runs sign-in. Vercel hosts this website.'],
      ['AI providers', 'Requests to Intelligence go through Loadline’s service to third-party AI model providers, including OpenRouter, the model providers it connects to, and OpenAI.'],
      ['Connected features', 'Depending on what you use, information needed for a feature goes to services such as Microsoft, Google Maps Platform, Twilio for calling, Apollo for contact data, Stripe for payments, and apps you choose to connect.'],
      ['Other sharing', 'We may disclose information when the law requires it, to protect people or the service, or as part of a merger or sale of the business.'],
    ],
  },
  {
    title: 'On your computer',
    items: [
      ['Local files', 'Loadline reads project files only from folders you connect. When you ask the assistant to work with them, the relevant content is sent for processing.'],
      ['Browser', 'The built-in browser keeps website data on your computer. Sites you visit receive information under their own privacy policies.'],
    ],
  },
  {
    title: 'Your choices',
    items: [
      ['Keeping data', 'We keep information while your account or workspace is active, and longer only when needed for legal, security or billing reasons.'],
      ['Access and deletion', 'You can ask for a copy of your information, ask us to correct it, or ask us to delete your account. For records that belong to a team workspace, we may need to involve its owner. You may have other rights depending on where you live.'],
      ['Connections', 'You can disconnect Outlook and other connected apps, and you can stop using any optional feature.'],
      ['Security', 'Connections to our services are encrypted, and access to workspace data is enforced on the server. No system is completely secure.'],
    ],
  },
  {
    title: 'Changes and contact',
    items: [
      ['Changes', 'We will post updates here and change the date below. If a change is significant, we will tell you in the app or by email.'],
      ['Children', 'Loadline is a business tool and is not intended for anyone under 18.'],
      ['Contact', 'For privacy questions or requests, write to the support email shown for Loadline on Google’s sign-in screen. Select the app or developer name on that screen to see it.'],
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede="What Loadline collects, why, who processes it, and the choices you have."
      updated="November 25, 2026"
      sections={sections}
      other={{ href: '/terms', label: 'Terms of Service' }}
    />
  );
}
