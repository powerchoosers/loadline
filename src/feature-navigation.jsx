import { useEffect, useRef, useState } from "react";

const number = (index) => String(index + 1).padStart(2, "0");

function FeatureNavigation({ sections, catalog, reading }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const links = useRef([]);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      let index = 0;
      sections.forEach((section, i) => {
        if (section.element.getBoundingClientRect().top <= 180) index = i;
      });
      setActive(index);
      const distance = catalog.offsetHeight - window.innerHeight;
      const start = catalog.getBoundingClientRect().top + window.scrollY - 160;
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / Math.max(1, distance)),
      );
      reading.style.setProperty("--reading-progress", progress);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) schedule();
    });
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections, catalog, reading]);

  useEffect(() => {
    if (!open) return;
    // Bring a low trigger up to the sticky bar so the entire menu is reachable.
    const menu = container.current.querySelector(".feature-picker-menu");
    if (menu.getBoundingClientRect().bottom > window.innerHeight - 12) {
      const nav = container.current.closest("nav");
      const stickyTop = parseFloat(getComputedStyle(nav).top);
      window.scrollBy({
        top: Math.max(0, nav.getBoundingClientRect().top - stickyTop),
        behavior: "instant",
      });
    }
    links.current[active]?.focus({ preventScroll: true });
    function outside(event) {
      if (!container.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function keyDown(event) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      trigger.current.focus({ preventScroll: true });
      return;
    }
    const index = links.current.indexOf(document.activeElement);
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? sections.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + sections.length) %
            sections.length;
    links.current[next]?.focus();
  }

  function select(event, index) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    setActive(index);
    setOpen(false);
    history.replaceState(null, "", `#${sections[index].id}`);
    sections[index].element.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
    const heading = sections[index].element.querySelector("h2");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  return (
    <div className="wrap feature-navigation-shell">
      <span className="feature-navigation-label" id="feature-navigation-label">
        Explore features
      </span>
      <div
        className="feature-picker"
        ref={container}
        onKeyDown={keyDown}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <button
          id="feature-jump"
          ref={trigger}
          className="feature-picker-trigger"
          aria-labelledby="feature-navigation-label feature-current-label"
          aria-expanded={open}
          aria-controls="feature-section-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="feature-picker-number">{number(active)}</span>
          <span id="feature-current-label">{sections[active].label}</span>
          <span className="feature-picker-count">
            / {number(sections.length - 1)}
          </span>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="m5 8 5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        {open && (
          <div id="feature-section-menu" className="feature-picker-menu">
            <p>Jump to a section</p>
            <ul>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    ref={(element) => {
                      links.current[index] = element;
                    }}
                    aria-current={index === active ? "location" : undefined}
                    onClick={(event) => select(event, index)}
                  >
                    <span className="feature-picker-number">
                      {number(index)}
                    </span>
                    <span>{section.label}</span>
                    {index === active && (
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          d="m4 10 4 4 8-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function FeatureGuide() {
  const [props, setProps] = useState(null);
  useEffect(() => {
    const catalog = document.querySelector(".feature-catalog");
    const reading = document.querySelector(".reading-progress");
    const sections = [...catalog.querySelectorAll(".feature-group")].map(
      (element) => ({
        id: element.id,
        element,
        label:
          document.querySelector(`.feature-index a[href="#${element.id}"] span`)
            ?.textContent || element.id,
      }),
    );
    setProps({ catalog, reading, sections });
  }, []);
  return (
    <nav className="feature-reading-nav" aria-label="Feature guide">
      {props && <FeatureNavigation {...props} />}
    </nav>
  );
}
