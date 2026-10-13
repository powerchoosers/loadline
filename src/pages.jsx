import {
  WorkflowExplorer,
  Closing,
  BrowserFigure,
  CaptureFigure,
  DownloadButton,
  ReleaseNotes,
  CopyChecksum,
  DeviceNote,
  DownloadValue,
  Availability,
  Arrow,
} from "./components.jsx";
import { FeatureGuide } from "./feature-navigation.jsx";
export function HomePage() {
  return (
    <main id="main">
      <div className="product-intro wrap">
        <section className="hero">
          <p className="eyebrow">
            {"A Windows browser for commercial energy consultants"}
          </p>
          <h1>
            {"From company research"}
            <br /> <span>{"to the next conversation."}</span>
          </h1>
          <p className="intro">
            {
              "Research companies, keep the people and energy details with the account, and return with a clear next step."
            }
          </p>
          <div className="hero-actions">
            <a className="button" href="/download/">
              {"Get Loadline for Windows "}
              <Arrow />
            </a>
            <a className="text-link" href="#workflow">
              {"Explore the workflow "}
              <Arrow />
            </a>
          </div>
          <p className="micro">
            {"Windows 10 or 11 · 64-bit · Workspace sign-in required"}
          </p>
        </section>
        <BrowserFigure
          className="browser-preview wrap"
          controls={true}
          priority={true}
          caption="Current Loadline Home"
        />
      </div>
      <div className="product-rail wrap" aria-label="Loadline product areas">
        <span>{"One browser."}</span>
        <p>{"Web research"}</p>
        <p>{"Lead desk"}</p>
        <p>{"Energy context"}</p>
        <p>{"Intelligence"}</p>
        <p>{"Follow-up"}</p>
      </div>
      <WorkflowExplorer />
      <section className="energy-story wrap">
        <div className="section-heading">
          <p className="eyebrow">{"The details that shape the conversation"}</p>
          <h2>
            {"Energy work needs"}
            <br />
            <span>{"more than a contact name."}</span>
          </h2>
        </div>
        <div className="energy-story-body">
          <p>
            {
              "Keep the supplier, the renewal date, the facility, and the basis behind a usage figure with the account. Bring market context into the review while keeping published data distinct from a supplier quote."
            }
          </p>
          <a className="text-link" href="/features/#energy">
            {"Explore energy and Market "}
            <Arrow />
          </a>
        </div>
        <dl className="energy-fields">
          <div>
            <dt>{"Supplier & contract"}</dt>
            <dd>{"Know what is recorded."}</dd>
          </div>
          <div>
            <dt>{"Renewal timing"}</dt>
            <dd>{"Know when to return."}</dd>
          </div>
          <div>
            <dt>{"Usage & evidence"}</dt>
            <dd>{"Know the basis."}</dd>
          </div>
          <div>
            <dt>{"Facilities & Market"}</dt>
            <dd>{"Keep the wider context."}</dd>
          </div>
        </dl>
      </section>
      <section className="working-day">
        <div className="wrap">
          <div className="section-heading">
            <p className="eyebrow">{"From research to follow-through"}</p>
            <h2>
              {"A familiar browser."}
              <br />
              <span>{"A more connected working day."}</span>
            </h2>
          </div>
          <ol className="day-steps">
            <li>
              <span>{"01"}</span>
              <h3>{"Open the company site."}</h3>
              <p>
                {
                  "Start with the business you’re researching and bring its record into view."
                }
              </p>
            </li>
            <li>
              <span>{"02"}</span>
              <h3>{"Keep the useful details."}</h3>
              <p>
                {
                  "Save contacts, energy context, and a note with the source close by."
                }
              </p>
            </li>
            <li>
              <span>{"03"}</span>
              <h3>{"Set the next action."}</h3>
              <p>
                {
                  "Leave a clear next step and a reminder to return to the account."
                }
              </p>
            </li>
          </ol>
          <a className="text-link" href="/how-it-works/">
            {"Walk through the workflow "}
            <Arrow />
          </a>
        </div>
      </section>
      <section className="faq wrap">
        <div>
          <p className="eyebrow">{"Before you get started"}</p>
          <h2>
            {"A few useful"}
            <br />
            {" answers."}
          </h2>
          <a className="text-link" href="/download/">
            {"Windows release details "}
            <Arrow />
          </a>
        </div>
        <div className="faq-list">
          <details>
            <summary>{"Is Loadline a browser or a website?"}</summary>
            <p>
              {
                "Loadline is a Windows desktop browser. The Lead desk and Intelligence live inside the installed application. This website introduces the product."
              }
            </p>
          </details>
          <details>
            <summary>{"Who is it built for?"}</summary>
            <p>
              {
                "Commercial energy consultants who move between company research, contacts, supplier details, renewal dates, and follow-up."
              }
            </p>
          </details>
          <details>
            <summary>{"Do I need a Loadline account?"}</summary>
            <p>
              {
                "Sign-in is required for the current cloud workspace. Web research, Intelligence, and other connected services need an internet connection; provider and usage allowances apply."
              }
            </p>
          </details>
          <details>
            <summary>{"Can I install it on my phone or iPad?"}</summary>
            <p>
              {
                "The Loadline browser is built for Windows 10 or 11, 64-bit. You can explore this website on your phone or iPad, then open the download page on a Windows computer. Mac, Linux, iOS, and Android downloads are not currently offered."
              }
            </p>
          </details>
          <details>
            <summary>{"Does it replace my CRM or send outreach?"}</summary>
            <p>
              {
                "Loadline brings research and working records together. Email and calling shortcuts hand off to external applications. Reminders do not send follow-up, and HubSpot links or exports do not mean automatic CRM synchronization."
              }
            </p>
          </details>
        </div>
      </section>
      <Closing>
        {"Keep the context."}
        <br />
        {"Move the conversation forward."}
      </Closing>
    </main>
  );
}
export function FeaturesPage() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"Explore Loadline"}</p>
        <h1>
          {"The tools around"}
          <br />
          <span>{"your next conversation."}</span>
        </h1>
        <p className="intro">
          {
            "Research, energy account work, Intelligence, and follow-through. See how each part fits into the consultant’s working day."
          }
        </p>
        <p className="availability-note">
          {
            "This product overview includes features in development. Availability depends on your installed version and connected services. See the "
          }
          <a href="/download/">{"release details"}</a>
          {" for the public download."}
        </p>
      </section>
      <nav className="feature-index wrap" aria-label="Feature sections">
        <a href="#browser">
          {"01"}
          <span>{"Browser"}</span>
          <Arrow />
        </a>
        <a href="#accounts">
          {"02"}
          <span>{"Accounts"}</span>
          <Arrow />
        </a>
        <a href="#energy">
          {"03"}
          <span>{"Energy & Market"}</span>
          <Arrow />
        </a>
        <a href="#intelligence">
          {"04"}
          <span>{"Intelligence"}</span>
          <Arrow />
        </a>
        <a href="#followup">
          {"05"}
          <span>{"Lists & follow-up"}</span>
          <Arrow />
        </a>
        <a href="#workspace">
          {"06"}
          <span>{"Workspace"}</span>
          <Arrow />
        </a>
      </nav>
      <FeatureGuide />
      <div className="feature-catalog wrap">
        <section
          className="feature-group"
          id="browser"
          aria-labelledby="heading-browser"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"01 / browser"}</p>
            <h2 id="heading-browser">{"A browser with the work built in."}</h2>
            <p>
              {
                "The web, your Lead desk, and Intelligence within reach in one Windows application."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Familiar browsing"}</dt>
              <dd>
                {
                  "Chromium-based browsing with bookmarks, history, downloads, PDF viewing, printing, and browser settings."
                }
              </dd>
            </div>
            <div>
              <dt>{"Lead desk"}</dt>
              <dd>
                {
                  "A home for account work, contacts, lists, and reminders inside the browser."
                }
              </dd>
            </div>
            <div>
              <dt>{"Context beside the page"}</dt>
              <dd>
                {
                  "Keep selected page and account context with Intelligence while you research."
                }
              </dd>
            </div>
            <div>
              <dt>{"Appearance and updates"}</dt>
              <dd>
                {
                  "Light and dark workspace presentation, plus a version-aware update control tied to the public release."
                }
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="feature-group"
          id="accounts"
          aria-labelledby="heading-accounts"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"02 / accounts"}</p>
            <h2 id="heading-accounts">
              {"Accounts that retain the whole thread."}
            </h2>
            <p>
              {
                "Give research a place to land, with the company, people, and next action together."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Accounts and contacts"}</dt>
              <dd>
                {
                  "Keep company profiles, roles, contact methods, notes, files, and relationships together when the information is available."
                }
              </dd>
            </div>
            <div>
              <dt>{"Research with sources"}</dt>
              <dd>
                {
                  "Use connected company and contact research, retain source links, and distinguish recorded, reported, and inferred details. Apollo allowance applies."
                }
              </dd>
            </div>
            <div>
              <dt>{"Notes and files"}</dt>
              <dd>
                {
                  "Save working notes and supported attachments with the relevant account. Preview support and file limits vary by format."
                }
              </dd>
            </div>
            <div>
              <dt>{"Ready for the next conversation"}</dt>
              <dd>
                {
                  "Review recorded details and build a call brief from saved facts. A saved detail still needs your judgment."
                }
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="feature-group"
          id="energy"
          aria-labelledby="heading-energy"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"03 / Energy & Market"}</p>
            <h2 id="heading-energy">
              {"Keep the energy details with the account."}
            </h2>
            <p>
              {
                "Supplier, renewal, usage evidence, facilities, and market context belong in the same conversation."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Energy surveys"}</dt>
              <dd>
                {
                  "Record supplier, rate, renewal date, bill status, contract notes, and the next action. Associate supported contracts with facilities."
                }
              </dd>
            </div>
            <div>
              <dt>{"Usage evidence"}</dt>
              <dd>
                {
                  "Keep kWh, period, service address, source, confidence, and billed, reported, or anticipated basis together."
                }
              </dd>
            </div>
            <div>
              <dt>{"Facilities and locations"}</dt>
              <dd>
                {
                  "Review candidate locations from Google Places and choose which to save. Maps and territory context support research; territory boundaries are estimates."
                }
              </dd>
            </div>
            <div>
              <dt>{"Market and renewal review"}</dt>
              <dd>
                {
                  "Prioritize saved contract dates with published ERCOT and EIA observations, energy news, and renewal review. Rate-spread estimates depend on recorded usage and benchmark suitability. They are not savings or supplier quotes."
                }
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="feature-group"
          id="intelligence"
          aria-labelledby="heading-intelligence"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"04 / intelligence"}</p>
            <h2 id="heading-intelligence">
              {"Ask with context. Talk through the work."}
            </h2>
            <p>
              {
                "Use text or voice to work through a question with the relevant record, page, or supported file."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Chat and web research"}</dt>
              <dd>
                {
                  "Ask questions, research the public web, and follow surfaced source links. Connected provider, model, and usage allowances apply."
                }
              </dd>
            </div>
            <div>
              <dt>{"Choose the context"}</dt>
              <dd>
                {
                  "Share a selected account, supported page text, selected tabs, or compatible attachments. Control what you include in the request."
                }
              </dd>
            </div>
            <div>
              <dt>{"Live voice"}</dt>
              <dd>
                {
                  "Speak with Intelligence and keep supported transcript text in the chat flow. Microphone permission and a supported session are required."
                }
              </dd>
            </div>
            <div>
              <dt>{"Supported actions with review"}</dt>
              <dd>
                {
                  "Prepare a note, reminder, or list, or ask for supported navigation and actions on the active page. Review the proposed work. Ordinary actions may use a short countdown with cancellation; Apollo actions that consume credits require an explicit click."
                }
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="feature-group"
          id="followup"
          aria-labelledby="heading-followup"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"05 / followup"}</p>
            <h2 id="heading-followup">
              {"Make the next step easy to return to."}
            </h2>
            <p>
              {
                "Organize the work and come back to the right company or person with the thread intact."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Lists and saved views"}</dt>
              <dd>
                {
                  "Group accounts or contacts, revisit filters and stages, and keep ready-to-call work in view."
                }
              </dd>
            </div>
            <div>
              <dt>{"Imports and exports"}</dt>
              <dd>
                {
                  "Map supported CSV fields, preview import outcomes, review duplicate matches, and export supported data for a handoff."
                }
              </dd>
            </div>
            <div>
              <dt>{"Linked reminders"}</dt>
              <dd>
                {
                  "Set dates, priorities, descriptions, and supported recurrence with the account or contact attached."
                }
              </dd>
            </div>
            <div>
              <dt>{"Follow-through controls"}</dt>
              <dd>
                {
                  "Snooze, reschedule, complete, and search reminders. Notifications depend on permission and runtime availability."
                }
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="feature-group"
          id="workspace"
          aria-labelledby="heading-workspace"
        >
          <div className="feature-group-heading">
            <p className="eyebrow">{"06 / workspace"}</p>
            <h2 id="heading-workspace">
              {"A connected workspace, with clear boundaries."}
            </h2>
            <p>
              {
                "Sign in to keep working records connected and review the services used in your workflow."
              }
            </p>
          </div>
          <dl className="feature-details">
            <div>
              <dt>{"Cloud records"}</dt>
              <dd>
                {
                  "The current workspace uses authenticated cloud records for accounts, contacts, and reminders."
                }
              </dd>
            </div>
            <div>
              <dt>{"Connected services"}</dt>
              <dd>
                {
                  "Apollo, Google Places, Intelligence, and other providers have their own access, allowance, and availability requirements."
                }
              </dd>
            </div>
            <div>
              <dt>{"CRM handoff"}</dt>
              <dd>
                {
                  "Retain supported HubSpot links and import metadata, or export a file for use elsewhere. Full bidirectional CRM synchronization is not offered by these handoffs."
                }
              </dd>
            </div>
            <div>
              <dt>{"Context sharing"}</dt>
              <dd>
                {
                  "Review the page, account, and file context you share. Connected requests may send selected data to the relevant service."
                }
              </dd>
            </div>
          </dl>
        </section>
      </div>
      <Closing>
        {"A place for the research."}
        <br />
        {"A way back to the work."}
      </Closing>
    </main>
  );
}
export function DownloadPage() {
  return (
    <main id="main" className="download-page">
      <section className="download-hero wrap">
        <div className="download-copy">
          <p className="eyebrow">{"Loadline for Windows"}</p>
          <h1>
            {"A browser built"}
            <br />
            <span>{"around your work."}</span>
          </h1>
          <p className="intro">
            {
              "Bring company research, account context, and follow-up into the same working day."
            }
          </p>
          <DownloadButton />
          <p
            className="download-status"
            id="download-status"
            role="status"
            aria-live="polite"
          >
            <DownloadValue field="status" />
          </p>
          <DeviceNote />
          <dl className="download-inline-meta">
            <div>
              <dt>{"Compatibility"}</dt>
              <dd>{"Windows 10 or 11 · 64-bit"}</dd>
            </div>
            <div>
              <dt>{"Public version"}</dt>
              <dd id="download-version">
                <DownloadValue field="version" />
              </dd>
            </div>
          </dl>
        </div>
        <BrowserFigure
          className="download-product"
          controls={false}
          priority={true}
          caption="Current app preview · Public version may differ"
        />
      </section>
      <section className="release-rail">
        <div className="wrap release-facts">
          <div>
            <span>{"Public release"}</span>
            <strong id="release-version">
              <DownloadValue field="releaseVersion" />
            </strong>
          </div>
          <div>
            <span>{"Published"}</span>
            <strong id="release-date">
              <DownloadValue field="date" />
            </strong>
          </div>
          <div>
            <span>{"Package"}</span>
            <strong id="release-file">
              <DownloadValue field="file" />
            </strong>
          </div>
        </div>
      </section>
      <section className="install wrap">
        <div className="section-lead">
          <p className="eyebrow">{"Getting started"}</p>
          <h2>
            {"Download."}
            <br />
            {"Open. Get to work."}
          </h2>
          <p>
            {
              "Check the release notes for the features included in your public version."
            }
          </p>
        </div>
        <ol className="install-steps">
          <li>
            <span>{"01"}</span>
            <div>
              <h3>{"Download the Windows package."}</h3>
              <p>
                {
                  "Use the versioned ZIP linked above. Keep the published checksum if you want to confirm the file."
                }
              </p>
            </div>
          </li>
          <li>
            <span>{"02"}</span>
            <div>
              <h3>{"Extract and open Loadline."}</h3>
              <p>
                {
                  "Extract the complete package into a folder, then open Loadline.exe."
                }
              </p>
            </div>
          </li>
          <li>
            <span>{"03"}</span>
            <div>
              <h3>{"Open your working context."}</h3>
              <p>
                {
                  "Open the Lead desk and sign in for the cloud workspace. Connected research and Intelligence have their own access and usage requirements."
                }
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="requirements quiet-band">
        <div className="wrap requirements-layout">
          <div>
            <p className="eyebrow">{"Before installing"}</p>
            <h2>
              {"A Windows computer."}
              <br />
              {"An internet connection."}
            </h2>
            <p>
              {
                "Phone and iPad visitors can explore the site. The browser download is for Windows."
              }
            </p>
          </div>
          <dl>
            <div>
              <dt>{"Operating system"}</dt>
              <dd>{"Windows 10 or 11, 64-bit"}</dd>
            </div>
            <div>
              <dt>{"Workspace"}</dt>
              <dd>{"Sign-in for current cloud records"}</dd>
            </div>
            <div>
              <dt>{"Connected features"}</dt>
              <dd>{"Internet, provider access, and allowances apply"}</dd>
            </div>
            <div>
              <dt>{"Other platforms"}</dt>
              <dd>
                {"Mac, Linux, iOS, and Android downloads are not offered"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="download-help wrap">
        <div>
          <p className="eyebrow">{"Release information"}</p>
          <h2>
            {"Know which version"}
            <br />
            {"you’re getting."}
          </h2>
          <p>
            {
              "The product overview may describe features absent from this public version. Check the release notes for your download."
            }
          </p>
          <ReleaseNotes />
        </div>
        <div className="checksum-block">
          <span>{"SHA-256 checksum"}</span>
          <code id="release-checksum">
            <DownloadValue field="checksum" />
          </code>
          <CopyChecksum />
          <p id="copy-status" role="status" aria-live="polite">
            <DownloadValue field="copyStatus" />
          </p>
        </div>
      </section>
    </main>
  );
}
export function WorkspacePage() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"Your Loadline workspace"}</p>
        <h1>
          {"The company."}
          <br />
          {"The context."}
          <br />
          <span>{"Your next action."}</span>
        </h1>
        <p className="intro">
          {
            "Sign in inside the Loadline browser to access your cloud workspace. Keep account records, contacts, and reminders connected to the work."
          }
        </p>
        <a className="text-link" href="/features/#workspace">
          {"Workspace features and connections "}
          <Arrow />
        </a>
        <Availability />
      </section>
      <section className="workspace-layout wrap">
        <div className="workspace-copy">
          <p className="eyebrow">{"The Lead desk"}</p>
          <h2>
            {"A working record."}
            <br />
            {"With the details close."}
          </h2>
          <p>
            {
              "Keep company facts, people, notes, supported files, energy surveys, and follow-up in one account context."
            }
          </p>
          <ul className="check-list">
            <li>{"Accounts and contacts"}</li>
            <li>{"Energy and facility details"}</li>
            <li>{"Lists, saved views, and reminders"}</li>
          </ul>
          <p className="micro">
            {
              "Sign-in and an internet connection are required for the current cloud workspace."
            }
          </p>
        </div>
        <CaptureFigure
          name="accounts"
          className=""
          caption="Current development UI · Demonstration data"
        />
      </section>
      <section className="connection-section wrap">
        <div className="section-heading">
          <p className="eyebrow">{"Connected, with clear boundaries"}</p>
          <h2>
            {"Know what you’re"}
            <br />
            <span>{"bringing into the workflow."}</span>
          </h2>
        </div>
        <dl className="connection-list">
          <div>
            <dt>{"Intelligence"}</dt>
            <dd>
              {
                "Requests use a connected provider and compatible model. Choose the account, page, or file context you share; usage allowances apply."
              }
            </dd>
          </div>
          <div>
            <dt>{"Apollo & location research"}</dt>
            <dd>
              {
                "Company and contact lookups depend on provider access and allowance. Google Places suggests candidate facilities for you to review and save."
              }
            </dd>
          </div>
          <div>
            <dt>{"HubSpot & external applications"}</dt>
            <dd>
              {
                "Supported record links and CSV exports help with handoffs. Calling and email shortcuts open external applications."
              }
            </dd>
          </div>
        </dl>
      </section>
      <section className="quiet-band">
        <div className="wrap split-section">
          <div>
            <p className="eyebrow">{"Your context, your control"}</p>
            <h2>
              {"Share deliberately."}
              <br />
              {"Review what comes back."}
            </h2>
          </div>
          <div>
            <p>
              {
                "Connected requests may send selected information to the relevant service. Source links and confidence labels help you assess working details; they do not independently verify them."
              }
            </p>
            <a className="text-link" href="/features/">
              {"Read the full product overview "}
              <Arrow />
            </a>
          </div>
        </div>
      </section>
      <Closing>
        {"Keep the context."}
        <br />
        {"Move the conversation forward."}
      </Closing>
    </main>
  );
}
export function WhyPage() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"Why Loadline"}</p>
        <h1>
          {"Your browser is already"}
          <br />
          <span>{"part of the work."}</span>
        </h1>
        <p className="intro">
          {
            "Company websites, contact research, renewal notes, and follow-up all connect to the same account. Loadline gives that work a place inside the browser."
          }
        </p>
        <Availability />
      </section>
      <section className="editorial-list wrap">
        <article>
          <span className="step">{"01 / RESEARCH WITH CONTEXT"}</span>
          <div>
            <h2>
              {"Keep the company"}
              <br />
              {"and the record close."}
            </h2>
            <p>
              {
                "A useful detail shouldn’t disappear when you close a tab. Keep company information, contacts, notes, and the source alongside the account you’re working."
              }
            </p>
          </div>
        </article>
        <article>
          <span className="step">{"02 / ENERGY ACCOUNT WORK"}</span>
          <div>
            <h2>
              {"Retain the details"}
              <br />
              {"that change the conversation."}
            </h2>
            <p>
              {
                "Supplier, renewal timing, usage evidence, and facility context help you decide what to ask next. Keep what is reported distinct from what is documented."
              }
            </p>
          </div>
        </article>
        <article>
          <span className="step">{"03 / INTELLIGENCE WITH CONTEXT"}</span>
          <div>
            <h2>
              {"Ask a better question."}
              <br />
              {"Keep your judgment."}
            </h2>
            <p>
              {
                "Ask using the page, account, or document you choose to share. Use surfaced sources and review controls to assess the answer and proposed next action."
              }
            </p>
          </div>
        </article>
        <article>
          <span className="step">{"04 / FOLLOW-THROUGH"}</span>
          <div>
            <h2>
              {"Return to the account."}
              <br />
              {"Keep the thread."}
            </h2>
            <p>
              {
                "Lists, recorded next actions, and linked reminders help you pick up the bill request, contact question, or renewal conversation you left open."
              }
            </p>
          </div>
        </article>
      </section>
      <section className="quiet-band">
        <div className="wrap split-section">
          <div>
            <p className="eyebrow">{"Designed around a real working day"}</p>
            <h2>
              {"For consultants."}
              <br />
              {"Built around accounts."}
            </h2>
          </div>
          <div>
            <p>
              {
                "Loadline is focused on commercial energy consulting. Keep the company, the energy details, and the next conversation connected throughout your working day."
              }
            </p>
            <a className="text-link" href="/features/">
              {"Explore the product "}
              <Arrow />
            </a>
          </div>
        </div>
      </section>
      <Closing>
        {"Keep the context."}
        <br />
        {"Move the conversation forward."}
      </Closing>
    </main>
  );
}
export function HowPage() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"How it works"}</p>
        <h1>
          {"One account."}
          <br />
          <span>{"A clearer next step."}</span>
        </h1>
        <p className="intro">
          {
            "A simple journey from company research to a useful note and a follow-up you can return to."
          }
        </p>
        <Availability />
      </section>
      <section className="process-section wrap">
        <ol className="process-list">
          <li>
            <span>{"01"}</span>
            <div>
              <p className="eyebrow">{"Start with the business"}</p>
              <h2>{"Open the company website."}</h2>
              <p>
                {
                  "Research what the company does and where it operates. Bring its Loadline account record into view, or create a working record for the company."
                }
              </p>
              <span className="process-result">
                {"The company and your research are in context."}
              </span>
            </div>
          </li>
          <li>
            <span>{"02"}</span>
            <div>
              <p className="eyebrow">{"Build the working picture"}</p>
              <h2>{"Review the people and energy details."}</h2>
              <p>
                {
                  "Check the saved contacts, supplier, renewal date, and facility information. Use connected research to fill in gaps, then review what to keep."
                }
              </p>
              <span className="process-result">
                {"Useful facts, open questions, and sources stay together."}
              </span>
            </div>
          </li>
          <li>
            <span>{"03"}</span>
            <div>
              <p className="eyebrow">{"Save what matters"}</p>
              <h2>{"Leave a useful note."}</h2>
              <p>
                {
                  "Record what you learned, who said it, and what still needs confirmation. Attach a supported file or source so you can revisit the basis later."
                }
              </p>
              <span className="process-result">
                {"You can pick up without starting over."}
              </span>
            </div>
          </li>
          <li>
            <span>{"04"}</span>
            <div>
              <p className="eyebrow">{"Close with a next action"}</p>
              <h2>{"Set the follow-up."}</h2>
              <p>
                {
                  "Save the next question, bill request, or meeting step. Add a reminder linked to the account or contact and return with the context close at hand."
                }
              </p>
              <span className="process-result">
                {"The account has a clear next step."}
              </span>
            </div>
          </li>
        </ol>
        <CaptureFigure
          name="accounts"
          className="process-visual"
          caption="Current development UI · Demonstration data"
        />
      </section>
      <section className="quiet-band">
        <div className="wrap split-section">
          <div>
            <p className="eyebrow">{"Intelligence when it helps"}</p>
            <h2>
              {"Ask with the work"}
              <br />
              {"in front of you."}
            </h2>
          </div>
          <div>
            <p>
              {
                "Ask a question by text or voice with selected account, page, or supported file context. Review the answer, its sources, and any proposed actions before relying on the result."
              }
            </p>
            <a className="text-link" href="/features/#intelligence">
              {"Explore Intelligence "}
              <Arrow />
            </a>
          </div>
        </div>
      </section>
      <Closing>
        {"Keep the context."}
        <br />
        {"Move the conversation forward."}
      </Closing>
    </main>
  );
}
export const pages = {
  "/": HomePage,
  "/features": FeaturesPage,
  "/download": DownloadPage,
  "/workspaces": WorkspacePage,
  "/why-loadline": WhyPage,
  "/how-it-works": HowPage,
};
