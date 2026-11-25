import type { ReactNode } from 'react';

/* Simplified recreations of the Loadline AI window. All names and figures are sample data. */

export const steps = [
  {
    id: 'files',
    tab: 'Files',
    title: 'The bill is already on the account.',
    body: 'Bills, contract dates and usage stay with the record in the Lead desk, so the next call starts with the numbers.',
  },
  {
    id: 'ask',
    tab: 'Side Chat',
    title: 'Ask, and see where the answer came from.',
    body: 'Intelligence reads the bill and the account, then lists the files it used so you can open them and check.',
  },
  {
    id: 'browse',
    tab: 'Browser',
    title: 'Research the web without leaving the deal.',
    body: 'The built-in browser opens beside your work. Intelligence asks before it types or clicks on a page.',
  },
  {
    id: 'draft',
    tab: 'Side Chat',
    title: 'Leave with the follow-up drafted.',
    body: 'Loadline prepares the email in Outlook. You review it and send it yourself.',
  },
] as const;

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path
        d="M24 89h39c5 0 8-2 12-6l38-38c3-3 5-4 9-4h9l14 14v14l-14 14h-25c-4 0-7 1-10 4l-29 29c-3 3-6 4-10 4H24"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 1.5h5l3 3v10H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function FilesPanel() {
  return (
    <div className="pn pn-files">
      <div className="pn-file" data-reveal>
        <FileIcon />
        <span>Harbor Cold Storage, March bill.pdf</span>
        <em>Page 2 of 3</em>
      </div>
      <div className="pn-page" data-reveal>
        <p className="pn-page-title">Electric service summary</p>
        <dl>
          <div><dt>Billing period</dt><dd>Mar 1 to Mar 31</dd></div>
          <div><dt>Energy used</dt><dd>352,480 kWh</dd></div>
          <div className="is-marked"><dt>Peak demand</dt><dd>812 kW</dd></div>
          <div><dt>Energy charge</dt><dd>$24,321.12</dd></div>
          <div><dt>Demand charge</dt><dd>$6,902.00</dd></div>
          <div><dt>Amount due</dt><dd>$33,468.40</dd></div>
        </dl>
        <span className="pn-skel" /><span className="pn-skel short" />
      </div>
    </div>
  );
}

export function AskPanel() {
  return (
    <div className="pn pn-chat">
      <p className="pn-user" data-reveal>What was their peak demand, and when does the contract end?</p>
      <p className="pn-step" data-reveal><FileIcon /> Read March bill.pdf, page 2</p>
      <div className="pn-answer">
        <p data-reveal>Peak demand on the March bill was <strong>812 kW</strong>, set on a weekday afternoon.</p>
        <p data-reveal>The account lists Gulf Coast Power as the current supplier, with the contract ending <strong>March 31, 2027</strong>.</p>
      </div>
      <div className="pn-sources" data-reveal>
        <span>Sources</span>
        <button type="button" tabIndex={-1}><FileIcon /> March bill.pdf</button>
        <button type="button" tabIndex={-1}>Account record</button>
      </div>
      <Composer />
    </div>
  );
}

export function BrowsePanel() {
  return (
    <div className="pn pn-browser">
      <div className="pn-url" data-reveal><span className="pn-lock" />supplier-rates.example/business-plans</div>
      <div className="pn-web" data-reveal>
        <p className="pn-web-title">Business rate plans</p>
        <span className="pn-skel" /><span className="pn-skel" /><span className="pn-skel short" />
        <div className="pn-web-form">
          <span>Annual usage (kWh)</span>
          <i />
        </div>
      </div>
      <div className="pn-approve" data-reveal>
        <p>Intelligence wants to enter the annual usage on this page.</p>
        <div>
          <button type="button" tabIndex={-1} className="is-primary">Allow once</button>
          <button type="button" tabIndex={-1}>Deny</button>
        </div>
      </div>
    </div>
  );
}

export function DraftPanel() {
  return (
    <div className="pn pn-chat">
      <p className="pn-user" data-reveal>Draft a follow-up for Thursday.</p>
      <div className="pn-draft" data-reveal>
        <dl>
          <div><dt>To</dt><dd>Dana Whitfield</dd></div>
          <div><dt>Subject</dt><dd>Your March bill and the 2027 renewal</dd></div>
        </dl>
        <p>Hi Dana, thanks for sending the March bill. Your peak of 812 kW is driving a large share of the demand charge, and with the contract ending in March there is time to price options before renewal…</p>
        <div className="pn-draft-actions">
          <button type="button" tabIndex={-1} className="is-primary">Open in Outlook</button>
          <span>Draft only. Nothing is sent for you.</span>
        </div>
      </div>
      <Composer />
    </div>
  );
}

export function AccountCard() {
  return (
    <div className="pn pn-account">
      <div className="pn-account-head">
        <div>
          <p className="pn-account-name">Harbor Cold Storage</p>
          <p className="pn-account-sub">Corpus Christi, Texas</p>
        </div>
        <span>Proposal</span>
      </div>
      <dl className="pn-account-facts">
        <div><dt>Current supplier</dt><dd>Gulf Coast Power</dd></div>
        <div><dt>Contract end date</dt><dd>Mar 31, 2027</dd></div>
        <div><dt>Annual usage</dt><dd>4.2 GWh</dd></div>
        <div><dt>Handoff</dt><dd>Survey complete</dd></div>
      </dl>
      <div className="pn-account-people">
        <span><i>DW</i>Dana Whitfield, Facilities director</span>
        <span><i>RO</i>Ray Okafor, Controller</span>
      </div>
    </div>
  );
}

export function TerminalPanel() {
  return (
    <div className="pn pn-terminal">
      <div className="pn-term">
        <p><b>harbor-proposal</b> &gt; npm run build-proposal</p>
        <p className="dim">Reading usage export… 12 months</p>
        <p className="dim">Wrote proposal/harbor-2027.pdf</p>
        <p><b>harbor-proposal</b> &gt; <i /></p>
      </div>
      <div className="pn-approve">
        <p>Intelligence wants to run <code>npm run check-rates</code> in this project.</p>
        <div>
          <button type="button" tabIndex={-1} className="is-primary">Allow once</button>
          <button type="button" tabIndex={-1}>Deny</button>
        </div>
      </div>
    </div>
  );
}

export function SelectionPanel() {
  const items = ['Ask Intelligence', 'Explain selection', 'Summarize selection', 'Copy', 'Search Loadline', 'Search Web'];
  return (
    <div className="pn pn-select">
      <div className="pn-select-doc">
        <p>Service agreement, section 4</p>
        <p>
          Customer shall pay a monthly demand charge based on the <mark>highest fifteen-minute average demand recorded
          during the billing period</mark>, subject to the ratchet described in section 4.3.
        </p>
        <span className="pn-skel" /><span className="pn-skel short" />
      </div>
      <ul className="pn-select-menu">
        {items.map((item, index) => <li key={item} data-first={index === 0}>{item}</li>)}
      </ul>
    </div>
  );
}

function Composer() {
  return (
    <div className="pn-composer" aria-hidden="true">
      <span>Ask Intelligence</span>
      <i />
    </div>
  );
}

export const panels: ReactNode[] = [
  <FilesPanel key="files" />,
  <AskPanel key="ask" />,
  <BrowsePanel key="browse" />,
  <DraftPanel key="draft" />,
];

export function AppWindow({ chartRef }: { chartRef: React.Ref<HTMLDivElement> }) {
  const tabs = ['Side Chat', 'Browser', 'Files'];
  return (
    <div className="win" role="img" aria-label="Simplified Loadline AI window showing an account, its load shape and the side panel. Sample data.">
      <div className="win-bar" aria-hidden="true">
        <div className="win-menus"><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></div>
        <div className="win-ctl"><i className="min" /><i className="max" /><i className="close" /></div>
      </div>
      <div className="win-top" aria-hidden="true">
        <span className="win-brand"><LogoMark size={16} /> Loadline</span>
        <span className="win-crumb">Accounts <b>/</b> Harbor Cold Storage</span>
        <span className="win-search">Search <kbd>Ctrl K</kbd></span>
      </div>
      <div className="win-body" aria-hidden="true">
        <aside className="win-side">
          <span className="win-side-new">New chat</span>
          <span>Harbor renewal options</span>
          <span>Demand charge questions</span>
          <span>Thursday call prep</span>
          <span>Coastal Packaging bill</span>
        </aside>
        <main className="win-main">
          <div className="acct-head">
            <div>
              <p className="acct-name">Harbor Cold Storage</p>
              <p className="acct-sub">Corpus Christi, Texas</p>
            </div>
            <span className="acct-stage">Proposal</span>
          </div>
          <dl className="acct-facts">
            <div><dt>Current supplier</dt><dd>Gulf Coast Power</dd></div>
            <div><dt>Contract end date</dt><dd>Mar 31, 2027</dd></div>
            <div><dt>Annual usage</dt><dd>4.2 GWh</dd></div>
          </dl>
          <div className="acct-chart">
            <div className="acct-chart-head">
              <span>Sample load shape, 28 days</span>
              <span className="legend"><i className="mint" />Load<i className="amber" />Peak window</span>
            </div>
            <div className="acct-chart-area" ref={chartRef} />
            <div className="acct-chart-axis"><span>12 am</span><span>6 am</span><span>12 pm</span><span>6 pm</span><span>12 am</span></div>
          </div>
        </main>
        <aside className="win-panel">
          <div className="win-tabs">
            {tabs.map((tab) => (
              <span key={tab} data-tab={tab} data-active={tab === 'Files'}>{tab}</span>
            ))}
          </div>
          <div className="win-panel-body">
            {panels.map((panel, index) => (
              <div className="win-panel-layer" data-panel={index} key={steps[index].id}>{panel}</div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
