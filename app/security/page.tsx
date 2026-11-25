import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Security and control',
  description: 'What Loadline AI asks before doing, how access works for your team, and where the limits are.',
};

const approvals = [
  ['Acting on a web page', 'Intelligence can open ordinary links it finds on the page you are viewing. Typing into fields, submitting forms and pressing page controls wait for your approval, and that approval covers only the tab and page you gave it for.'],
  ['Running a command', 'Each command Intelligence proposes needs approval for that exact command in that project. Commands you type into Terminal yourself start right away.'],
  ['Sending email', 'Loadline prepares drafts in Outlook. It does not send messages for you.'],
];

const topics = [
  {
    title: 'Your team and its data',
    items: [
      ['Roles', 'Everyone in a workspace is an owner, an admin or a member. Access rules are enforced on the server, not only in the app.'],
      ['Handoffs', 'Survey, booking and closing responsibilities are assigned separately from roles, so the right person sees the next step.'],
    ],
  },
  {
    title: 'Sign-in and Outlook',
    items: [
      ['Signing in', 'You can sign in to Loadline with your Microsoft account. Sign-in opens in your own browser, not inside the app.'],
      ['Connecting Outlook', 'Connecting your mailbox and calendar is a separate, optional step with its own Microsoft consent screen. Signing in does not connect it.'],
    ],
  },
  {
    title: 'The assistant',
    items: [
      ['Where requests go', 'Questions to Intelligence go through Loadline’s service to third-party AI model providers. The keys for those providers stay on the server and are not stored in the app on your computer.'],
      ['What it treats as instructions', 'Text inside your files, web pages and command output is treated as reference material, not as instructions to follow.'],
      ['Sources', 'Answers list the files and searches that were consulted. Treat them as a trail to check, not as proof.'],
    ],
  },
  {
    title: 'Local files and commands',
    items: [
      ['Folders you connect', 'Loadline reads project files only from folders you connect. Search skips hidden files, files that look like secrets, and dependency or build folders.'],
      ['Partial reads', 'Long or scanned documents may be read only in part. Loadline says so rather than presenting a partial read as complete.'],
      ['Command permissions', 'Commands run with your own Windows permissions and are not confined to the project folder. Approve them with the same care you would give a command you typed.'],
    ],
  },
];

export default async function SecurityPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="You stay in control of what it does."
        lede="Loadline AI is built to ask before it acts and to show its work. This page explains how that works, and where the limits are."
      />

      <section className="approvals">
        <h2>Three things it will not do on its own</h2>
        <ul>
          {approvals.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="topics">
        {topics.map((topic) => (
          <section className="topic" key={topic.title}>
            <h2>{topic.title}</h2>
            <dl>
              {topic.items.map(([name, text]) => (
                <div key={name}><dt>{name}</dt><dd>{text}</dd></div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="page-note">
        This page describes how the app behaves today. It is not a security certification or a legal agreement.
      </p>

      <DownloadBand release={release} />
    </>
  );
}
