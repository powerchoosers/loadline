import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { TextAnimate } from "./components/ui/text-animate";
import { Lens } from "./components/ui/lens";
import { ConnectedWork, ProductFilm } from "./magic-experience.jsx";

export function DesignLab() {
  const [animation, setAnimation] = useState("slideUp");
  const [zoom, setZoom] = useState(1.4);
  const [maximum, setMaximum] = useState(2);
  const preview = useRef(null);
  const reduce = useReducedMotion();
  function measure() {
    const image = preview.current?.querySelector("img");
    if (!image?.naturalWidth) return;
    const limit = Math.max(
      1,
      Math.floor(
        Math.min(2, image.naturalWidth / image.getBoundingClientRect().width) *
          10,
      ) / 10,
    );
    setMaximum(limit);
    setZoom((value) => Math.min(value, limit));
  }
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    observer.observe(preview.current);
    measure();
    return () => observer.disconnect();
  }, []);
  return (
    <main id="main" className="design-lab">
      <section className="wrap page-hero">
        <p className="eyebrow">Local design experiment</p>
        <h1>
          Try the components.
          <br />
          <span>Find the right intensity.</span>
        </h1>
        <p className="intro">
          These are the installed Magic UI registry components, using real
          Loadline imagery. This page is for evaluating the design tools.
        </p>
        <div className="lab-heading-control">
          <p>Text Animate / Motion</p>
          <div role="group" aria-label="Heading animation">
            {[
              ["fadeIn", "Fade"],
              ["slideUp", "Slide"],
              ["blurInUp", "Blur"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={animation === value}
                onClick={() => setAnimation(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {reduce ? (
          <h2 className="lab-motion-heading">
            Keep the whole conversation in view.
          </h2>
        ) : (
          <TextAnimate
            key={animation}
            as="h2"
            by="word"
            animation={animation}
            duration={0.6}
            startOnView={false}
            once
            className="lab-motion-heading"
          >
            Keep the whole conversation in view.
          </TextAnimate>
        )}
        <p className="micro">
          {reduce
            ? "Your reduced-motion setting is active. Content is shown without entrance effects."
            : "Choose a setting to replay the headline. Reduced-motion preferences are respected."}
        </p>
      </section>
      <section className="lab-lens wrap">
        <div className="lab-section-title">
          <div>
            <p className="eyebrow">Lens / Motion</p>
            <h2>Inspect the real pixels.</h2>
          </div>
          <label>
            Magnification{" "}
            <input
              type="range"
              min="1"
              max={maximum}
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <output>{zoom.toFixed(1)}×</output>
          </label>
        </div>
        <div ref={preview} onLoadCapture={measure}>
          <Lens
            zoomFactor={zoom}
            duration={reduce ? 0 : 0.08}
            lensSize={180}
            ariaLabel="Magic UI Lens example: Loadline Home"
          >
            <img
              src="/assets/loadline-home-dark.png"
              alt="Actual Loadline browser Home screenshot"
              width="1917"
              height="1198"
            />
          </Lens>
        </div>
        <p className="micro">
          Move a mouse over the screenshot to inspect it. On touch, use the
          marketing site's Enlarge controls for full-size inspection.
        </p>
      </section>
      <ConnectedWork />
      <section className="wrap lab-section-title">
        <div>
          <p className="eyebrow">Hero Video Dialog / Motion</p>
          <h2>The film, before the film.</h2>
        </div>
        <p>
          Open the real registry dialog to inspect its storyboard placeholder,
          keyboard focus, and transition.
        </p>
      </section>
      <ProductFilm />
    </main>
  );
}
