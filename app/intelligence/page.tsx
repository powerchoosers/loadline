import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadBand from '@/components/DownloadBand';
import { AskPanel, BrowsePanel, SelectionPanel } from '@/components/panels';
import VoiceOverlayDemo from '@/components/VoiceOverlayDemo';
import { latestRelease } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Intelligence',
  description: 'The assistant inside Loadline AI: it reads the account and your files, shows its sources, and asks before it acts.',
};

const rows = [
  {
    id: 'context',
    name: 'In context',
    title: 'It already knows which account you mean.',
    text: 'Intelligence follows the record you have open. Ask a plain question and it answers from the account and the files you point it at, with the sources it consulted listed underneath.',
    points: ['Click a source to open the file it came from.', 'Keep an earlier conversation open beside your work as a Side Chat.'],
    visual: <AskPanel />,
  },
  {
    id: 'voice',
    name: 'Voice',
    title: 'Talk it through when your hands are full.',
    text: 'Start a voice conversation and speak your question. It is the same assistant with the same context, and what it says appears as captions while it talks.',
    points: ['The voice card floats over your work and can be dragged out of the way.', 'Choose from several voices in its settings.', 'If it needs to look something up, it tells you it is working.'],
    visual: <VoiceOverlayDemo />,
  },
  {
    id: 'selection',
    name: 'On anything you highlight',
    title: 'Select a clause. Ask what it means.',
    text: 'Highlight text anywhere in the workspace and right-click. Ask about it, have it explained or summarized, or search Loadline and the web for it.',
    points: ['Works on text across the workspace.', 'The menu is the same everywhere, so it becomes a habit.'],
    visual: <SelectionPanel />,
  },
  {
    id: 'browser',
    name: 'In the browser',
    title: 'It can do the legwork, with your say-so.',
    text: 'Ask Intelligence to look something up and it works through the page beside you. It reads and follows ordinary links on its own, and stops to ask before it types or presses anything.',
    points: ['Each approval covers one tab and one page.', 'It checks every step against what is actually on the page.'],
    visual: <BrowsePanel />,
  },
];

const honest = [
  ['Sources are a trail, not a verdict', 'The list under an answer shows what was read or searched. It does not guarantee that every file supports the answer, so open the ones that matter.'],
  ['Long documents are read in parts', 'For a long file, Intelligence reads the beginning, the end and the lines that match your question. It says so when a read was partial.'],
  ['Scanned pages need a scan', 'A PDF with no selectable text cannot be read as text. A separate scan can read page images, and it tells you how much it covered.'],
  ['Your files are not its boss', 'Instructions written inside a document, a web page or command output are treated as content to read, never as orders to follow.'],
];

export default async function IntelligencePage() {
  const release = await latestRelease();
  return (
    <>
      <PageHero
        title="An assistant that shows its work."
        lede="Intelligence is the assistant inside Loadline AI. It reads what you are working on, tells you where its answers came from, and asks before it acts."
      />

      <div className="features">
        {rows.map((row) => (
          <section className="feature" id={row.id} key={row.id}>
            <div className="feature-copy">
              <p className="feature-name">{row.name}</p>
              <h2>{row.title}</h2>
              <p>{row.text}</p>
              <ul>{row.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div className="feature-visual" role="img" aria-label={`Simplified view with sample data: ${row.name}`}>
              <div aria-hidden="true">{row.visual}</div>
            </div>
          </section>
        ))}
      </div>

      <section className="topics">
        <div className="topic">
          <h2>What it will be straight with you about</h2>
          <dl>
            {honest.map(([name, text]) => (
              <div key={name}><dt>{name}</dt><dd>{text}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <DownloadBand release={release} />
    </>
  );
}
