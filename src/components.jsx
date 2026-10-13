import { createContext, useContext, useEffect, useRef, useState } from "react";
import { normalizeRelease } from "../release-metadata.mjs";
import { workflowPanels } from "./site-content.js";

export const SiteContext = createContext(null);
const ReleaseContext = createContext(null);
export const navItems = [
  ["/features/", "Features"],
  ["/why-loadline/", "Why Loadline"],
  ["/how-it-works/", "How it works"],
  ["/workspaces/", "Workspace"],
];
export const captures = {
  home: {
    title: "Loadline Home",
    description: "Actual Windows browser screenshot",
    light: "/assets/loadline-home-light.png",
    dark: "/assets/loadline-home-dark.png",
    left: 540,
    top: 428,
  },
  accounts: {
    title: "Accounts and contacts",
    description: "Current development UI · Demonstration data",
    light: "/assets/loadline-accounts-light.webp",
    dark: "/assets/loadline-accounts-dark.webp",
  },
  energy: {
    title: "Energy details",
    description: "Current development UI · Demonstration data",
    light: "/assets/loadline-energy-light.webp",
    dark: "/assets/loadline-energy-dark.webp",
    left: 660,
    top: 185,
  },
  intelligence: {
    title: "Intelligence with account context",
    description: "Actual installed panel · Dark mode · Demonstration account",
    dark: "/assets/loadline-intelligence-dark.webp",
    top: 308,
  },
  followup: {
    title: "Linked follow-up",
    description: "Current development UI · Demonstration data",
    light: "/assets/loadline-followup-light.webp",
    dark: "/assets/loadline-followup-dark.webp",
    top: 240,
  },
};

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m16 16 4 4M10.5 7.5v6m-3-3h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Loadline home">
      <img src="/assets/loadline.svg" alt="" width="32" height="32" />
      <span>Loadline</span>
    </a>
  );
}
export function Header({ path }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const header = useRef(null);
  useEffect(() => {
    const wide = matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", resize);
    const outside = (event) => {
      if (!header.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      wide.removeEventListener("change", resize);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  return (
    <header
      ref={header}
      className={`site-header${open ? " menu-open" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          button.current.focus();
        }
      }}
    >
      <div className="nav wrap">
        <Brand />
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          onClick={() => setOpen(false)}
        >
          {navItems.map(([url, label]) => (
            <a
              key={url}
              href={url}
              aria-current={path === url.slice(0, -1) ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="nav-download"
          href="/download/"
          aria-current={path === "/download" ? "page" : undefined}
        >
          Get Loadline <Arrow />
        </a>
        <button
          ref={button}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <span
        className="reading-progress"
        hidden={path !== "/features"}
        aria-hidden="true"
      />
    </header>
  );
}
export function Footer() {
  return (
    <footer className="wrap">
      <div className="footer-brand">
        <Brand />
        <p>The browser for commercial energy consultants.</p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map(([url, label]) => (
          <a key={url} href={url}>
            {label}
          </a>
        ))}
        <a href="/download/">Download</a>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Loadline</span>
        <span>Windows desktop browser</span>
      </div>
    </footer>
  );
}
export function CTA() {
  return (
    <a className="button" href="/download/">
      Get Loadline for Windows <Arrow />
    </a>
  );
}
export function Closing({ children }) {
  return (
    <section className="closing">
      <div className="wrap">
        <p className="eyebrow">Built around your working day</p>
        <h2>
          {children || (
            <>
              Keep the context.
              <br />
              Move the conversation forward.
            </>
          )}
        </h2>
        <CTA />
        <p className="micro">Windows 10 or 11 · 64-bit</p>
      </div>
    </section>
  );
}
export function Availability() {
  return (
    <p className="availability-note">
      This product overview includes features in development. Availability
      depends on your installed version and connected services. See the{" "}
      <a href="/download/">release details</a> for the public download.
    </p>
  );
}
export function ThemeControls({ explorer = false, hidden = false }) {
  const { theme, setTheme } = useContext(SiteContext);
  return (
    <div
      className="capture-appearance"
      data-explorer-appearance={explorer ? "" : undefined}
      hidden={hidden}
      role="group"
      aria-label="App screenshot appearance"
    >
      <span>App appearance</span>
      <div>
        {["light", "dark"].map((value) => (
          <button
            type="button"
            key={value}
            data-app-theme={value}
            aria-pressed={theme === value}
            onClick={() => setTheme(value)}
          >
            {value === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>
    </div>
  );
}
export function fadeIn(node) {
  if (!node?.animate || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  node.getAnimations().forEach((animation) => animation.cancel());
  node.animate([{ opacity: 0.55 }, { opacity: 1 }], {
    duration: 180,
    easing: "ease-out",
  });
}

function CaptureVisual({ name, priority = false }) {
  const { theme, openCapture } = useContext(SiteContext);
  const visual = useRef(null);
  const lens = useRef(null);
  const frame = useRef(0);
  const capture = captures[name];
  const home = name === "home";
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reset = () => {
      cancelAnimationFrame(frame.current);
      lens.current.hidden = true;
    };
    fine.addEventListener("change", reset);
    reset();
    return () => {
      cancelAnimationFrame(frame.current);
      fine.removeEventListener("change", reset);
    };
  }, [theme]);
  function move(event) {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const pointer = { x: event.clientX, y: event.clientY };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const image = [...visual.current.querySelectorAll("img")].find(
        (node) => node.getBoundingClientRect().width > 0,
      );
      if (!image?.complete || !image.naturalWidth) return;
      const rect = image.getBoundingClientRect(),
        parent = visual.current.getBoundingClientRect();
      const x = pointer.x - rect.left,
        y = pointer.y - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lens.current.hidden = true;
        return;
      }
      const radius = Math.min(82, rect.width / 2, rect.height / 2);
      const centerX = Math.max(radius, Math.min(rect.width - radius, x));
      const centerY = Math.max(radius, Math.min(rect.height - radius, y));
      const zoom = Math.min(2, image.naturalWidth / rect.width);
      Object.assign(lens.current.style, {
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        left: `${rect.left - parent.left + centerX - radius}px`,
        top: `${rect.top - parent.top + centerY - radius}px`,
        backgroundImage: `url("${image.currentSrc}")`,
        backgroundSize: `${rect.width * zoom}px ${rect.height * zoom}px`,
        backgroundPosition: `${radius - x * zoom}px ${radius - y * zoom}px`,
      });
      lens.current.hidden = false;
    });
  }
  function pictures() {
    if (name === "intelligence")
      return (
        <img
          src="/assets/loadline-intelligence-dark-detail.webp"
          width="353"
          height="492"
          alt="Actual installed Intelligence panel with a demonstration account selected as context and chat, model, and voice controls"
          loading="lazy"
        />
      );
    const sizes = {
      home: [1917, 1198, 908, 482],
      accounts: [672, 744, 442, 659],
      energy: [369, 580],
      followup: [672, 448, 418, 452],
    }[name];
    return ["light", "dark"].map((value) => (
      <picture key={value} data-capture-theme={value} hidden={value !== theme}>
        {sizes[2] && (
          <source
            media="(max-width: 599px)"
            srcSet={`/assets/loadline-${name}-${value}-${home ? "detail.png" : "mobile.webp"}`}
            width={sizes[2]}
            height={sizes[3]}
          />
        )}
        <img
          src={
            home
              ? capture[value]
              : `/assets/loadline-${name}-${value}-${name === "accounts" ? "wide" : "detail"}.webp`
          }
          width={sizes[0]}
          height={sizes[1]}
          alt={
            home
              ? `Current Loadline Home with the Intelligence composer, model selector, and voice control in ${value} mode`
              : `${capture.title}. ${capture.description}. ${value} mode`
          }
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority && value === "light" ? "high" : undefined}
        />
      </picture>
    ));
  }
  return (
    <div
      ref={visual}
      className={
        home
          ? "screenshot"
          : `app-capture ${name === "intelligence" ? "native-intelligence" : name}`
      }
      onPointerMove={move}
      onPointerLeave={() => {
        cancelAnimationFrame(frame.current);
        lens.current.hidden = true;
      }}
    >
      {pictures()}
      <button
        type="button"
        className="capture-hit"
        aria-label={`Enlarge ${capture.title} screenshot`}
        aria-haspopup="dialog"
        onClick={(event) => openCapture(name, event.currentTarget)}
      >
        <span className="capture-inspect-label">
          <ZoomIcon />
          <span>Enlarge</span>
        </span>
      </button>
      <div ref={lens} className="capture-lens" hidden aria-hidden="true" />
    </div>
  );
}
function CaptureLink({ name, full = false }) {
  const { theme, openCapture } = useContext(SiteContext);
  return (
    <a
      className="capture-open"
      href={captures[name][theme] || captures[name].dark}
      target="_blank"
      rel="noopener"
      aria-haspopup="dialog"
      onClick={(event) => {
        if (
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        openCapture(name, event.currentTarget);
      }}
    >
      {full ? "View full screenshot" : "View screenshot"} <Arrow />
    </a>
  );
}
export function BrowserFigure({
  className = "browser-preview wrap",
  controls = true,
  priority = false,
  caption = "Current Loadline Home",
}) {
  return (
    <figure className={className}>
      <CaptureVisual name="home" priority={priority} />
      <figcaption>
        <span>
          {caption}
          {controls && (
            <>
              <br />
              <span className="capture-date">Windows browser</span>
            </>
          )}
        </span>
        {controls && <ThemeControls />}
        <CaptureLink name="home" full />
      </figcaption>
    </figure>
  );
}
export function CaptureFigure({ name, className = "", caption }) {
  return (
    <figure className={className}>
      <CaptureVisual name={name} />
      <figcaption>
        <span>{caption || captures[name].description}</span>
        <CaptureLink name={name} />
      </figcaption>
    </figure>
  );
}
function Lines({ text }) {
  return text.split("<br>").map((line, index) => (
    <span key={index} style={{ color: "inherit" }}>
      {index > 0 && <br />}
      {line}
    </span>
  ));
}
export function WorkflowExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]),
    panels = useRef([]);
  useEffect(() => {
    fadeIn(panels.current[active]);
  }, [active]);
  function choose(index, focus = false) {
    setActive(index);
    if (focus) tabs.current[index].focus();
  }
  function advance(index) {
    choose(index, true);
    tabs.current[index]
      .closest(".workflow-tabs")
      .scrollIntoView({ behavior: "instant", block: "start" });
  }
  return (
    <section
      className="product-section"
      id="workflow"
      aria-labelledby="workflow-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <p className="eyebrow">The work, brought together</p>
          <h2 id="workflow-title">
            One account.
            <br />
            <span>The whole working picture.</span>
          </h2>
          <p>Explore how Loadline keeps an account moving.</p>
          <ThemeControls explorer hidden={active === 2} />
        </div>
        <div
          className="workflow-tabs"
          role="tablist"
          aria-label="Explore the Loadline workflow"
        >
          {workflowPanels.map((item, index) => (
            <button
              key={item.key}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`tab-${item.key}`}
              aria-selected={index === active}
              aria-controls={`panel-${item.key}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => {
                const next = {
                  ArrowRight: (index + 1) % 4,
                  ArrowLeft: (index + 3) % 4,
                  Home: 0,
                  End: 3,
                }[event.key];
                if (next !== undefined) {
                  event.preventDefault();
                  choose(next, true);
                }
              }}
            >
              <span>{item.number}</span>
              {item.label}
            </button>
          ))}
        </div>
        {workflowPanels.map((item, index) => (
          <div
            key={item.key}
            ref={(node) => {
              panels.current[index] = node;
            }}
            className="workflow-panel"
            id={`panel-${item.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.key}`}
            tabIndex={0}
            hidden={index !== active}
          >
            <div className="workflow-copy">
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>
                <Lines text={item.title} />
              </h3>
              <p>{item.body}</p>
              <ul className="check-list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a className="text-link" href={`/features/#${item.key}`}>
                Explore {item.label.toLowerCase()} <Arrow />
              </a>
            </div>
            <CaptureFigure
              name={item.key}
              className="workflow-visual"
              caption={
                item.caption || "Current development UI · Demonstration data"
              }
            />
          </div>
        ))}
        <div className="workflow-controls">
          <span className="workflow-position" aria-live="polite">
            {workflowPanels[active].number} / 04 ·{" "}
            {workflowPanels[active].label}
          </span>
          <div className="workflow-actions">
            <button
              type="button"
              data-workflow-prev
              disabled={active === 0}
              onClick={() => advance(active - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              data-workflow-next
              disabled={active === 3}
              onClick={() => advance(active + 1)}
            >
              Next feature
            </button>
          </div>
        </div>
        <Availability />
      </div>
    </section>
  );
}

export function DownloadProvider({ children }) {
  const [release, setRelease] = useState(null),
    [state, setState] = useState("loading"),
    [copyStatus, setCopyStatus] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/updates/latest.json?t=${Date.now()}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Metadata unavailable");
        const verified = normalizeRelease(await response.json());
        if (!controller.signal.aborted) {
          setRelease(verified);
          setState(verified ? "ready" : "invalid");
        }
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }
    load();
    return () => controller.abort();
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopyStatus("Checksum copied.");
    } catch {
      setCopyStatus("Select the checksum above and copy it manually.");
    }
  }
  return (
    <ReleaseContext.Provider value={{ release, state, copyStatus, copy }}>
      {children}
    </ReleaseContext.Provider>
  );
}
export function DownloadValue({ field }) {
  const { release, state, copyStatus } = useContext(ReleaseContext);
  const values = {
    version: release?.version || "—",
    releaseVersion: release
      ? `Loadline ${release.version}`
      : state === "loading"
        ? "Checking…"
        : state === "invalid"
          ? "Not available"
          : "Unavailable",
    date: release
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(release.publishedAt))
      : "—",
    file: release
      ? `${Math.round(release.sizeBytes / 1048576)} MB · ZIP`
      : "Windows ZIP",
    checksum: release?.sha256 || "Available with release metadata",
    status: release
      ? `Public release · Version ${release.version}`
      : state === "loading"
        ? "Checking release availability…"
        : state === "invalid"
          ? "A complete Windows package is not available from the release metadata. Please check back later."
          : "Release information is temporarily unavailable. Refresh this page to try again.",
    copyStatus,
  };
  return values[field];
}
export function DownloadButton() {
  const { release } = useContext(ReleaseContext);
  return (
    <a
      className={`button download-primary${release ? "" : " is-disabled"}`}
      id="latest-download"
      href={release?.downloadUrl || "/download/"}
      aria-disabled={!release || undefined}
      onClick={(event) => {
        if (!release) event.preventDefault();
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Download for Windows</span>
    </a>
  );
}
export function ReleaseNotes() {
  const { release } = useContext(ReleaseContext);
  return (
    <a
      className={`text-link${release?.releaseNotesUrl ? "" : " is-disabled"}`}
      id="release-notes-link"
      href={release?.releaseNotesUrl || "/download/"}
      aria-disabled={!release?.releaseNotesUrl || undefined}
      onClick={(event) => {
        if (!release?.releaseNotesUrl) event.preventDefault();
      }}
    >
      View release notes <Arrow />
    </a>
  );
}
export function CopyChecksum() {
  const { release, copy } = useContext(ReleaseContext);
  return (
    <button
      type="button"
      className="copy-checksum"
      id="copy-checksum"
      disabled={!release}
      onClick={copy}
    >
      Copy checksum
    </button>
  );
}
export function DeviceNote() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(
      /Android|iPhone|iPad|iPod|Macintosh|Linux/i.test(navigator.userAgent),
    );
  }, []);
  return (
    <p className="device-note" id="device-note" hidden={!show}>
      You’re exploring the Windows browser. Open this page on a Windows 10 or 11
      computer to install Loadline.
    </p>
  );
}
