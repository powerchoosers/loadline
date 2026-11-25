import Link from 'next/link';
import Stage from '@/components/Stage';
import DownloadBand from '@/components/DownloadBand';
import PromptComposer from '@/components/PromptComposer';
import { downloadAction, latestRelease } from '@/lib/release';

const inside = [
  ['Lead desk', 'Accounts, contacts, suppliers, contract dates and usage in one record, shared with your team by role.'],
  ['Intelligence', 'Chat or talk through an account. Answers list the files and searches they drew on.'],
  ['Browser', 'Tabs open beside the account. Highlight anything and ask about it from the right-click menu.'],
  ['Files', 'Preview PDFs, Word documents and spreadsheets next to the chat.'],
  ['Maps and Terminal', 'Look up a site on the map, or run project commands, without switching windows.'],
];

const control = [
  ['It asks before it acts on a page.', 'Typing into a form or pressing a button in the browser waits for your approval.'],
  ['It asks before it runs a command.', 'Every command Intelligence proposes needs your go-ahead for that exact command.'],
  ['It drafts. You send.', 'Emails are prepared in Outlook for you to review. Loadline does not send them.'],
];

export default async function Page() {
  const release = await latestRelease();

  return (
    <>
      <Stage download={downloadAction(release)} />

      <section className="ask">
        <div className="ask-lead">
          <h2>Ask it the way you would ask a colleague.</h2>
          <p>No special commands. Intelligence already knows which account, file or page you have open. These are examples; pick one to see it.</p>
        </div>
        <PromptComposer />
      </section>

      <section className="inside">
        <div className="inside-lead">
          <h2>One window for the whole deal.</h2>
          <p>The work that used to live in a CRM, a browser, a PDF reader and an inbox sits side by side.</p>
          <Link className="text-link" href="/features">See every feature</Link>
        </div>
        <dl className="inside-list">
          {inside.map(([name, text]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="control">
        <h2>The assistant works for you, in the open.</h2>
        <ul>
          {control.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <Link className="text-link" href="/security">How Loadline AI keeps you in control</Link>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
