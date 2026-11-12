import { Arrow } from "./components.jsx";
export function FAQSection() {
  return (
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
  );
}
