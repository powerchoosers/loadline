import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Common questions about Loadline AI: what it is, how the assistant behaves, files, updates and accounts.',
};

const groups = [
  {
    title: 'The basics',
    items: [
      ['What is Loadline AI?', 'A desktop workspace for commercial energy consultants. It combines the Lead desk for your accounts, an assistant called Intelligence, a built-in browser, and file and email tools in one window.'],
      ['Which computers does it run on?', 'Windows. The download is a 64-bit Windows installer. There is no Mac or phone version at this time.'],
      ['What does it cost?', 'Loadline AI is priced per seat with every feature included. Current plans are on the pricing page.'],
      ['How is it different from the Loadline browser?', 'They are separate products. The Loadline browser has its own site at loadlinehq.com. Loadline AI is the standalone desktop app described here.'],
    ],
  },
  {
    title: 'The assistant',
    items: [
      ['Will Intelligence do things without asking me?', 'It reads and answers on its own. Before it types into a web page, presses a page control or runs a command it proposed, it asks for your approval.'],
      ['Does it send emails for me?', 'No. It prepares a draft in Outlook. You review it and send it yourself.'],
      ['How do I know where an answer came from?', 'Each answer lists the files and searches that were consulted. Click a source to open it. The list shows what was read, not a guarantee that every source supports the answer.'],
      ['Where do my questions go?', 'Through Loadline’s service to third-party AI model providers. The provider keys are kept on the server, not in the app on your computer.'],
    ],
  },
  {
    title: 'Files and projects',
    items: [
      ['What kinds of files can it read?', 'Text files, PDFs, Word documents and Excel spreadsheets. A scanned PDF without selectable text needs a separate scan.'],
      ['Does it read my whole computer?', 'No. It reads project files only from folders you connect, and search skips hidden files, files that look like secrets, and dependency or build folders.'],
      ['Are commands sandboxed?', 'No. Commands run with your own Windows permissions and are not confined to the project folder, which is why each command Intelligence proposes needs your approval.'],
    ],
  },
  {
    title: 'Accounts and updates',
    items: [
      ['Can I sign in with Microsoft?', 'Yes. Sign-in opens in your own browser. Connecting your Outlook mailbox and calendar is a separate, optional step.'],
      ['How do updates work?', 'The app checks for a new version when it starts and occasionally while idle. Nothing installs on its own; you choose when. You can also choose Help, then Check for updates.'],
      ['I am on version 0.1.0 and never see updates.', 'That first version cannot update itself. Download the current installer once and install it over the old one.'],
      ['Who can see what in my workspace?', 'Each person is an owner, an admin or a member, and access rules are enforced on the server.'],
    ],
  },
];

export default async function FaqPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero title="Questions, answered plainly." lede="What Loadline AI is, how the assistant behaves, and how installing and updating work.">
        <nav className="jump" aria-label="On this page">
          {groups.map((group, index) => <a key={group.title} href={`#faq-${index}`}>{group.title}</a>)}
        </nav>
      </PageHero>

      <div className="faq">
        {groups.map((group, index) => (
          <section className="faq-group" id={`faq-${index}`} key={group.title}>
            <h2>{group.title}</h2>
            <div>
              {group.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="guide-more">
        <h2>New to the app?</h2>
        <p>The getting started guide walks through the first few minutes.</p>
        <Link className="btn btn-quiet" href="/getting-started">Open the guide</Link>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
