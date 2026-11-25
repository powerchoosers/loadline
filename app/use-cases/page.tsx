import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Use cases',
  description: 'How commercial energy consultants use Loadline AI before a call, on a bill, during research and after the meeting.',
};

const cases = [
  {
    when: 'Before the call',
    title: 'Walk in knowing the account.',
    text: 'Open the record and ask for a brief. Intelligence pulls the supplier, the contract end date, and the usage on file into one short read.',
    steps: ['Open the account in the Lead desk.', 'Ask Intelligence for a call brief.', 'Check the sources it lists, then dial.'],
    link: ['/features#lead-desk', 'About the Lead desk'],
  },
  {
    when: 'When a bill arrives',
    title: 'Get the numbers off the page.',
    text: 'Open the PDF in Files and ask what matters: usage, peak demand, charges, the billing period. The answer points back to the page it came from.',
    steps: ['Open the bill in the side panel.', 'Ask for the figures you need.', 'Open the cited page to confirm them.'],
    link: ['/features#files', 'About Files'],
  },
  {
    when: 'While you research',
    title: 'Keep the browser next to the deal.',
    text: 'Look up a supplier plan or a public record in a tab beside the account. Ask Intelligence to read the page, or to work through a form with your approval at each step.',
    steps: ['Open a tab from the side panel.', 'Ask about the page, or highlight a passage and right-click.', 'Approve or deny anything it wants to type or press.'],
    link: ['/features#browser', 'About the Browser'],
  },
  {
    when: 'After the meeting',
    title: 'Send the follow-up while it is fresh.',
    text: 'Ask for a draft and Loadline prepares it in Outlook from the account and the conversation. You make it yours and press send.',
    steps: ['Ask Intelligence to draft the follow-up.', 'Open the draft in Outlook.', 'Edit, then send it yourself.'],
    link: ['/features#follow-up', 'About follow-up'],
  },
  {
    when: 'Across the team',
    title: 'Hand a deal on without losing the thread.',
    text: 'Accounts are shared across your workspace by role, and handoff responsibilities for survey, booking and closing show who has the next move.',
    steps: ['Teammates work as owner, admin or member.', 'Assign who handles survey, booking and closing.', 'Pick up any account with its history intact.'],
    link: ['/security', 'About roles and access'],
  },
];

export default async function UseCasesPage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="Built around a consultant’s day."
        lede="Five moments where having the account, the paperwork and an assistant in one window saves the most time."
      />

      <div className="cases">
        {cases.map((item) => (
          <section className="case" key={item.when}>
            <p className="case-when">{item.when}</p>
            <div className="case-body">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link className="text-link" href={item.link[0]}>{item.link[1]}</Link>
            </div>
            <ol className="case-steps">
              {item.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
        ))}
      </div>

      <DownloadBand release={release} />
    </>
  );
}
