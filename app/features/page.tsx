import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { AccountCard, AskPanel, BrowsePanel, DraftPanel, FilesPanel, TerminalPanel } from '@/components/panels';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Features',
  description: 'The Lead desk, Intelligence, the built-in browser, files, follow-up and project tools in Loadline AI.',
};

const features = [
  {
    id: 'lead-desk',
    name: 'Lead desk',
    title: 'Every account, with its energy facts attached.',
    text: 'The Lead desk is the record of your book: accounts, contacts, suppliers, contract end dates and usage. Whatever you open, Intelligence and the side panel follow along.',
    points: ['Saved views keep your working lists one click away.', 'Search everything with Ctrl K.', 'Owners, admins and members see what their role allows.'],
    visual: <AccountCard />,
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    title: 'Ask about the account in front of you.',
    text: 'Chat or talk. Intelligence reads the open record and the files you point it at, then answers with the sources it consulted listed underneath.',
    points: ['Open any source to check it yourself.', 'Highlight text anywhere and choose Ask, Explain or Summarize.', 'Sources show what was read. They are not proof that every file supports the answer.'],
    visual: <AskPanel />,
  },
  {
    id: 'browser',
    name: 'Browser',
    title: 'A real browser, beside the deal.',
    text: 'Supplier sites, utility portals and public records open in tabs next to the account. Intelligence can read the page you are on and work through steps with you.',
    points: ['It can follow ordinary links it finds on the page.', 'Typing, form entry and button presses wait for your approval.', 'Approval applies to that tab and page only.'],
    visual: <BrowsePanel />,
  },
  {
    id: 'files',
    name: 'Files',
    title: 'Bills and contracts open where you work.',
    text: 'Preview PDFs, Word documents and spreadsheets in the side panel, page through them, and ask questions about what they say.',
    points: ['Connect a project folder to browse it as a tree.', 'Edit supported text files in place.', 'A scanned PDF with no selectable text needs a separate scan, and Loadline tells you when a read was partial.'],
    visual: <FilesPanel />,
  },
  {
    id: 'follow-up',
    name: 'Follow-up',
    title: 'The next email is drafted before you hang up.',
    text: 'Connect Outlook and Intelligence prepares the follow-up from the account and the conversation so far.',
    points: ['The draft opens in Outlook for you to edit.', 'Loadline prepares drafts. It does not send them.', 'The Outlook connection is separate from your Loadline sign-in.'],
    visual: <DraftPanel />,
  },
  {
    id: 'projects',
    name: 'Projects and Terminal',
    title: 'For the technical work behind a proposal.',
    text: 'Point Loadline at a local project folder to search it, read it and run its commands from the Terminal tab.',
    points: ['Commands you type start right away.', 'Commands Intelligence proposes need your approval, one command at a time.', 'Commands run with your own Windows permissions. They are not sandboxed to the project folder.'],
    visual: <TerminalPanel />,
  },
];

const also = [
  ['Voice', 'Talk to Intelligence instead of typing.'],
  ['Maps', 'A Google Maps tab in the side panel for looking up a site.'],
  ['History', 'Find a page you visited earlier.'],
  ['Side Chat', 'Keep a past conversation open next to your current work.'],
];

export default async function FeaturesPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="Everything a deal needs, in one window."
        lede="Loadline AI brings the account, the assistant, the browser and the paperwork together, so the context never leaves the screen."
      >
        <nav className="jump" aria-label="On this page">
          {features.map((feature) => <a key={feature.id} href={`#${feature.id}`}>{feature.name}</a>)}
        </nav>
      </PageHero>

      <div className="features">
        {features.map((feature) => (
          <section className="feature" id={feature.id} key={feature.id}>
            <div className="feature-copy">
              <p className="feature-name">{feature.name}</p>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
              <ul>{feature.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div className="feature-visual" role="img" aria-label={`Simplified ${feature.name} view with sample data`}>
              <div aria-hidden="true">{feature.visual}</div>
            </div>
          </section>
        ))}
      </div>

      <section className="also">
        <h2>Also in the window</h2>
        <dl>
          {also.map(([name, text]) => (
            <div key={name}><dt>{name}</dt><dd>{text}</dd></div>
          ))}
        </dl>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
