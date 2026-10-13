import { useContext, useEffect, useRef, useState } from "react";
import { Arrow, captures, fadeIn, SiteContext } from "./components.jsx";

export function ScreenshotViewer({ request, onClose }) {
  const { theme, setTheme } = useContext(SiteContext);
  const capture = captures[request.name];
  const appearance = capture.light ? theme : "dark";
  const source = capture[appearance];
  const [scale, setScale] = useState(() =>
    matchMedia("(max-width: 599px)").matches ? "actual" : "fit",
  );
  const [loadedSource, setLoadedSource] = useState("");
  const [errorSource, setErrorSource] = useState("");
  const dialog = useRef(null),
    stage = useRef(null),
    close = useRef(null),
    image = useRef(null);
  const position = useRef({ left: capture.left || 0, top: capture.top || 0 });
  const drag = useRef(null);
  const ready = loadedSource === source;
  const error = errorSource === source;

  useEffect(() => {
    const node = dialog.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const cancelAnimations = () => {
      if (reduce.matches)
        node
          .getAnimations({ subtree: true })
          .forEach((animation) => animation.cancel());
    };
    if (typeof node.showModal !== "function") {
      window.open(source, "_blank", "noopener");
      onClose();
      return;
    }
    document.documentElement.classList.add("capture-viewing");
    node.showModal();
    close.current.focus({ preventScroll: true });
    fadeIn(node.querySelector(".capture-dialog-shell"));
    reduce.addEventListener("change", cancelAnimations);
    return () => {
      reduce.removeEventListener("change", cancelAnimations);
      document.documentElement.classList.remove("capture-viewing");
      if (request.opener?.isConnected)
        request.opener.focus({ preventScroll: true });
    };
  }, []);

  function changeScale(next) {
    setScale(next);
    position.current = { left: 0, top: 0 };
    stage.current.scrollTo({ left: 0, top: 0, behavior: "instant" });
    if (next === "actual") stage.current.focus({ preventScroll: true });
  }
  function changeTheme(value) {
    if (scale === "actual" && ready)
      position.current = {
        left: stage.current.scrollLeft,
        top: stage.current.scrollTop,
      };
    setTheme(value);
  }
  function loaded(event) {
    event.currentTarget.style.setProperty(
      "--capture-width",
      `${event.currentTarget.naturalWidth}px`,
    );
    setLoadedSource(source);
    setErrorSource("");
    requestAnimationFrame(() => {
      if (!stage.current) return;
      if (scale === "actual")
        stage.current.scrollTo({ ...position.current, behavior: "instant" });
      fadeIn(image.current);
    });
  }
  function keyDown(event) {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialog.current.querySelectorAll('button,a[href],[tabindex="0"]'),
    ].filter(
      (node) =>
        !node.disabled &&
        node.getClientRects().length &&
        !node.closest("[hidden]"),
    );
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function stopDrag() {
    drag.current = null;
    stage.current.classList.remove("is-panning");
  }
  return (
    <dialog
      ref={dialog}
      className="capture-dialog"
      aria-labelledby="capture-dialog-title"
      aria-describedby="capture-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      onKeyDown={keyDown}
    >
      <div className="capture-dialog-shell">
        <header className="capture-dialog-header">
          <div>
            <p className="eyebrow">Inside Loadline</p>
            <h2 id="capture-dialog-title">{capture.title}</h2>
            <p id="capture-dialog-description">{capture.description}</p>
          </div>
          <button
            ref={close}
            type="button"
            className="viewer-close"
            aria-label="Close screenshot"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div
          className="capture-dialog-toolbar"
          role="group"
          aria-label="Screenshot controls"
        >
          <div
            className="viewer-theme"
            role="group"
            aria-label="App screenshot appearance"
            hidden={!capture.light}
          >
            {["light", "dark"].map((value) => (
              <button
                type="button"
                key={value}
                data-viewer-theme={value}
                aria-pressed={appearance === value}
                onClick={() => changeTheme(value)}
              >
                {value === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
          <div className="viewer-zoom" role="group" aria-label="Image size">
            <button
              type="button"
              data-viewer-fit
              aria-pressed={scale === "fit"}
              onClick={() => changeScale("fit")}
            >
              Fit
            </button>
            <button
              type="button"
              data-viewer-actual
              aria-pressed={scale === "actual"}
              disabled={!ready}
              onClick={() => changeScale("actual")}
            >
              100%
            </button>
          </div>
          <a
            className="viewer-original"
            href={source}
            target="_blank"
            rel="noopener"
          >
            Open original
          </a>
        </div>
        <div
          ref={stage}
          className="capture-stage"
          data-scale={scale}
          tabIndex={0}
          role="region"
          aria-label="Screenshot. At 100 percent, scroll to inspect details."
          aria-busy={!ready && !error}
          onPointerDown={(event) => {
            if (
              scale !== "actual" ||
              event.pointerType !== "mouse" ||
              event.button !== 0
            )
              return;
            drag.current = {
              x: event.clientX,
              y: event.clientY,
              left: stage.current.scrollLeft,
              top: stage.current.scrollTop,
            };
            stage.current.setPointerCapture(event.pointerId);
            stage.current.classList.add("is-panning");
            event.preventDefault();
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            stage.current.scrollLeft =
              drag.current.left - (event.clientX - drag.current.x);
            stage.current.scrollTop =
              drag.current.top - (event.clientY - drag.current.y);
          }}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
        >
          <div className="capture-canvas">
            <img
              ref={image}
              className="viewer-image"
              src={source}
              alt={`${capture.title}. ${capture.description}. ${appearance} appearance.`}
              hidden={!ready}
              onLoad={loaded}
              onError={() => setErrorSource(source)}
            />
          </div>
          <p className="viewer-loading" role="status" hidden={ready}>
            {error
              ? "This screenshot could not load. You can try opening the original image."
              : "Loading screenshot…"}
          </p>
        </div>
        <footer className="capture-dialog-footer">
          <p className="viewer-hint">
            {scale === "actual"
              ? "Scroll to inspect the details. Choose Fit to see the full screenshot."
              : "Choose 100% to read the details. Scroll to move around the image."}
          </p>
          <a className="viewer-download" href="/download/">
            Get Loadline for Windows <Arrow />
          </a>
        </footer>
      </div>
    </dialog>
  );
}
