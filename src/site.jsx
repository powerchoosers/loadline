import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  confirmationCopy,
  consumeAuthReturn,
  verifySignupAccessToken,
} from "../auth-return.mjs";
import {
  Header,
  Footer,
  SiteContext,
  DownloadProvider,
  Arrow,
} from "./components.jsx";
import { ScreenshotViewer } from "./screenshot-viewer.jsx";
import { pages } from "./pages.jsx";
import { titles, descriptions } from "./site-content.js";

const path = location.pathname.replace(/\/$/, "") || "/";
function NotFound() {
  return (
    <main id="main" className="page-hero wrap">
      <p className="eyebrow">404</p>
      <h1>
        This page
        <br />
        <span>isn’t here.</span>
      </h1>
      <p className="intro">Head back to the product and pick up from there.</p>
      <a className="button" href="/">
        Back to Loadline <Arrow />
      </a>
    </main>
  );
}

function Site() {
  const [theme, setTheme] = useState("light");
  const [request, setRequest] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const Page = pages[path] || NotFound;
  useEffect(() => {
    document.title = titles[path] || "Page not found — Loadline";
    document.querySelector('meta[name="description"]').content =
      descriptions[path] || "Explore the Loadline Windows browser.";
    let disposed = false;
    consumeAuthReturn(
      location.search,
      location.hash,
      () => history.replaceState({}, document.title, location.pathname),
      verifySignupAccessToken,
    ).then((result) => {
      if (result && !disposed) setConfirmation(confirmationCopy(result));
    });
    let sectionId;
    try {
      sectionId = decodeURIComponent(location.hash.slice(1));
    } catch {
      sectionId = "";
    }
    document.fonts.ready.then(() => {
      if (!disposed && sectionId)
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => {
      disposed = true;
    };
  }, []);
  const content =
    path === "/download" ? (
      <DownloadProvider>
        <Page />
      </DownloadProvider>
    ) : (
      <Page />
    );
  return (
    <SiteContext.Provider
      value={{
        theme,
        setTheme,
        openCapture: (name, opener) => setRequest({ name, opener }),
      }}
    >
      <Header path={path} />
      {confirmation && (
        <section className="auth-return wrap" role="status" aria-live="polite">
          <p className="eyebrow">Loadline account</p>
          <h2>{confirmation.title}</h2>
          <p className="intro">{confirmation.message}</p>
        </section>
      )}
      {content}
      <Footer />
      {request && (
        <ScreenshotViewer request={request} onClose={() => setRequest(null)} />
      )}
    </SiteContext.Provider>
  );
}

createRoot(document.getElementById("site")).render(<Site />);
