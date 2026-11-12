import { useContext, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Search,
  Building2,
  Zap,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { TextAnimate } from "./components/ui/text-animate";
import { BlurFade } from "./components/ui/blur-fade";
import { AnimatedBeam } from "./components/ui/animated-beam";
import { HeroVideoDialog } from "./components/ui/hero-video-dialog";
import {
  Arrow,
  Availability,
  CaptureFigure,
  Closing,
  CTA,
  SiteContext,
  WorkflowExplorer,
} from "./components.jsx";
import { FAQSection } from "./faq.jsx";

// Set this to /assets/loadline-product-film.mp4 only after the actual recording exists.
export const productFilm = {
  src: null,
  poster: "/assets/loadline-home-dark.png",
};

export function PremiumHeading({ children, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {reduce ? (
        children.split("\n").map((line, index) => (
          <span className="headline-line" key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))
      ) : (
        <TextAnimate
          as="span"
          by="line"
          animation="slideUp"
          duration={0.5}
          once
          startOnView={false}
          className="premium-heading-lines"
        >
          {children}
        </TextAnimate>
      )}
    </h1>
  );
}
export function Reveal({ children, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <BlurFade
      className={className}
      blur="0px"
      offset={8}
      duration={0.35}
      inView
    >
      {children}
    </BlurFade>
  );
}
export function ProductFilm() {
  return (
    <div className="film-stage wrap">
      <HeroVideoDialog
        animationStyle="fade"
        videoSrc={productFilm.src || ""}
        thumbnailSrc={productFilm.poster}
        thumbnailAlt="Actual Loadline browser Home. Product recording placeholder."
        triggerLabel={
          productFilm.src
            ? "Watch the Loadline product film"
            : "Preview the product film placeholder"
        }
        title={
          productFilm.src
            ? "Loadline, from research to follow-up"
            : "Product film · storyboard placeholder"
        }
        className="product-film"
      >
        {productFilm.src ? (
          <video
            className="real-product-film"
            controls
            playsInline
            preload="metadata"
            poster={productFilm.poster}
            src={productFilm.src}
          >
            <track
              kind="captions"
              src="/assets/loadline-product-film.vtt"
              srcLang="en"
              label="English"
              default
            />
          </video>
        ) : (
          <div className="film-storyboard">
            <div className="storyboard-title">
              <p className="eyebrow">Recording goes here</p>
              <h3>
                One company.
                <br />
                The next conversation.
              </h3>
              <p>
                This is the space for a real Loadline screen recording. The
                scenes below outline the film.
              </p>
            </div>
            <ol>
              <li>
                <span>01 / 00–08s</span>
                <strong>Open the company website.</strong>
                <p>Bring the relevant account into view.</p>
              </li>
              <li>
                <span>02 / 08–18s</span>
                <strong>Keep the useful context.</strong>
                <p>Review contacts, sources, and a working note.</p>
              </li>
              <li>
                <span>03 / 18–28s</span>
                <strong>Review the energy details.</strong>
                <p>Show the supplier, renewal, and usage basis.</p>
              </li>
              <li>
                <span>04 / 28–40s</span>
                <strong>Leave a clear next action.</strong>
                <p>Set a reminder linked to the account.</p>
              </li>
            </ol>
            <p className="film-placeholder-note">
              Storyboard only · No recorded video yet
            </p>
          </div>
        )}
      </HeroVideoDialog>
      <div className="film-caption">
        <span>
          {productFilm.src
            ? "From research to follow-up"
            : "Product film · preview the storyboard"}
        </span>
        <span>
          {productFilm.src
            ? "Actual browser recording"
            : "Video placeholder · recording to come"}{" "}
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

const connectedSteps = [
  {
    label: "Research",
    icon: Search,
    title: "Start where the company is.",
    body: "Research the company website and keep the source close to the record.",
    name: "accounts",
  },
  {
    label: "Account",
    icon: Building2,
    title: "Give the research a home.",
    body: "Keep company details, people, working notes, and source links together.",
    name: "accounts",
  },
  {
    label: "Energy",
    icon: Zap,
    title: "Keep the basis in view.",
    body: "Review the supplier, renewal date, facilities, and the source behind a usage figure.",
    name: "energy",
  },
  {
    label: "Follow-up",
    icon: CalendarDays,
    title: "Come back with context.",
    body: "Set a linked reminder so the next conversation starts with what is already known.",
    name: "followup",
  },
];
export function ConnectedWork() {
  const [active, setActive] = useState(0);
  const container = useRef(null),
    research = useRef(null),
    account = useRef(null),
    energy = useRef(null),
    followup = useRef(null);
  const refs = [research, account, energy, followup];
  const reduce = useReducedMotion();
  return (
    <section className="connected-work wrap" aria-labelledby="connected-title">
      <div className="section-heading">
        <p className="eyebrow">One continuous thread</p>
        <h2 id="connected-title">
          The details belong
          <br />
          <span>with the conversation.</span>
        </h2>
        <p>Choose a stage to follow the working context.</p>
      </div>
      <div
        ref={container}
        className="connection-track"
        role="tablist"
        aria-label="Connected account journey"
      >
        {connectedSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <button
              key={step.label}
              id={`journey-${index}`}
              role="tab"
              aria-selected={active === index}
              aria-controls="journey-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next;
                if (event.key === "ArrowRight") next = (index + 1) % 4;
                if (event.key === "ArrowLeft") next = (index + 3) % 4;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = 3;
                if (next !== undefined) {
                  event.preventDefault();
                  setActive(next);
                  event.currentTarget.parentElement
                    .querySelector(`#journey-${next}`)
                    .focus();
                }
              }}
            >
              <span className="connection-node" ref={refs[index]}>
                <Icon aria-hidden="true" />
              </span>
              <span className="connection-number">0{index + 1}</span>
              <strong>{step.label}</strong>
            </button>
          );
        })}
        {!reduce && (
          <div className="connection-beams" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <AnimatedBeam
                key={`${active}-${index}`}
                containerRef={container}
                fromRef={refs[index]}
                toRef={refs[index + 1]}
                pathColor="#414845"
                pathOpacity={1}
                pathWidth={1.5}
                gradientStartColor="#a1d9c2"
                gradientStopColor="#a1d9c2"
                duration={1.2}
                repeat={0}
                delay={index * 0.3}
              />
            ))}
          </div>
        )}
      </div>
      <div
        id="journey-panel"
        className="connected-panel"
        role="tabpanel"
        aria-labelledby={`journey-${active}`}
        tabIndex={0}
      >
        <div>
          <p className="eyebrow">
            0{active + 1} / {connectedSteps[active].label}
          </p>
          <h3>{connectedSteps[active].title}</h3>
          <p>{connectedSteps[active].body}</p>
          <a
            className="text-link"
            href={`/features/#${connectedSteps[active].name}`}
          >
            Explore the details <Arrow />
          </a>
        </div>
        <Reveal key={active}>
          <CaptureFigure
            name={connectedSteps[active].name}
            caption="Current development UI · Demonstration data"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function ImmersiveHome() {
  return (
    <main id="main" className="immersive-home">
      <section className="showcase-hero wrap">
        <p className="eyebrow">
          Loadline / A browser for commercial energy consultants
        </p>
        <PremiumHeading>{"Your research.\nA place to land."}</PremiumHeading>
        <p className="intro">
          The company, the people, the energy details.
          <br className="desktop-break" /> Keep the whole conversation in view.
        </p>
        <div className="hero-actions">
          <CTA />
          <a className="text-link" href="#workflow">
            Explore the working day <Arrow />
          </a>
        </div>
        <p className="micro">
          Windows 10 or 11 · 64-bit · Workspace sign-in required
        </p>
      </section>
      <Reveal>
        <ProductFilm />
      </Reveal>
      <section className="editorial-intro wrap">
        <p className="eyebrow">The web is where it starts.</p>
        <h2>
          The record is
          <br />
          <span>where it stays useful.</span>
        </h2>
        <p>
          A company website. A contact. A contract date. A note from the last
          call. Loadline gives those details a place together inside the
          browser.
        </p>
      </section>
      <WorkflowExplorer />
      <section className="intelligence-spotlight wrap">
        <div>
          <p className="eyebrow">Intelligence, beside the work</p>
          <h2>
            Ask with the
            <br />
            <span>context close.</span>
          </h2>
          <p>
            Research a question or talk it through by voice. Choose the account,
            page, or supported file you share, and review what comes back.
          </p>
          <a className="text-link" href="/features/#intelligence">
            Explore Intelligence <Arrow />
          </a>
        </div>
        <Reveal>
          <CaptureFigure
            name="intelligence"
            caption="Actual installed panel · Demo account · Dark mode"
          />
        </Reveal>
      </section>
      <FAQSection />
      <Closing>
        Keep the thread.
        <br />
        Move the work forward.
      </Closing>
    </main>
  );
}
export function ImmersiveWhy() {
  return (
    <main id="main" className="immersive-why">
      <section className="showcase-hero wrap">
        <p className="eyebrow">Why Loadline</p>
        <PremiumHeading>{"The web is only\nhalf the picture."}</PremiumHeading>
        <p className="intro">
          The useful part is what you keep—and what you do next.
        </p>
        <a className="text-link" href="#connected-title">
          Follow one account <Arrow />
        </a>
      </section>
      <ConnectedWork />
      <section className="why-editorial wrap">
        <p className="eyebrow">Built around account work</p>
        <h2>
          A working record.
          <br />
          <span>A way back to the conversation.</span>
        </h2>
        <div>
          <p>
            Company research and energy account work are connected. Keep the
            supplier, renewal timing, people, and open questions with the
            company they belong to.
          </p>
          <p>
            Loadline brings the Lead desk and Intelligence into a familiar
            Windows browser. Connected services have their own access and usage
            requirements.
          </p>
        </div>
        <Availability />
      </section>
      <Reveal>
        <ProductFilm />
      </Reveal>
      <Closing>
        Keep the context.
        <br />
        Pick up from here.
      </Closing>
    </main>
  );
}
