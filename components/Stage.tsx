'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { createCurve, fallbackPath, type CurveHandle } from '@/lib/curve';
import { AppWindow, panels, steps } from './panels';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PINNED = '(min-width: 1000px) and (prefers-reduced-motion: no-preference)';

type Props = {
  download: { href: string; label: string; note: string };
};

export default function Stage({ download }: Props) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rectA = useRef<HTMLDivElement>(null);
  const rectB = useRef<HTMLDivElement>(null);
  const curve = useRef<CurveHandle | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const morph = useRef(0);
  const [noWebgl, setNoWebgl] = useState(false);

  // While the story is pinned, "See how it works" scrolls to the first settled step.
  const showStory = (event: React.MouseEvent) => {
    const tl = timeline.current;
    const trigger = tl?.scrollTrigger;
    if (!tl || !trigger) return;
    event.preventDefault();
    window.scrollTo({ top: trigger.labelToScroll('first'), behavior: 'smooth' });
  };

  useEffect(() => {
    if (!canvas.current || !rectA.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let handle: CurveHandle;
    try {
      handle = createCurve(canvas.current, {
        rectA: rectA.current,
        rectB: rectB.current,
        count: window.innerWidth < 1000 ? 2600 : 6500,
        animate: !reduced,
      });
    } catch {
      setNoWebgl(true);
      return;
    }
    curve.current = handle;
    handle.setMorph(morph.current);
    const state = { g: 0 };
    const intro = reduced
      ? null
      : gsap.to(state, { g: 1, duration: 2.6, ease: 'power2.out', onUpdate: () => handle.setGather(state.g) });
    return () => {
      intro?.kill();
      curve.current = null;
      handle.dispose();
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-copy > *', { y: 24, autoAlpha: 0, filter: 'blur(12px)', duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.2, clearProps: 'filter' });
      });

      mm.add(PINNED, () => {
        const captions = gsap.utils.toArray<HTMLElement>('.caption');
        const layers = gsap.utils.toArray<HTMLElement>('.win-panel-layer');
        const tabs = gsap.utils.toArray<HTMLElement>('.win-tabs span');
        const ticks = gsap.utils.toArray<HTMLElement>('.rail i');
        const state = { m: 0 };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            pin: pin.current,
            start: 'top top',
            end: '+=420%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo('.hero-copy', { filter: 'blur(0px)' }, { autoAlpha: 0, y: -48, filter: 'blur(10px)', duration: 0.45 }, 0)
          .to('.curve-axis', { autoAlpha: 0, duration: 0.3 }, 0)
          .fromTo('.window-wrap', { autoAlpha: 0, scale: 0.9, y: 80 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.2)
          .to(state, { m: 1, duration: 1, ease: 'power2.inOut', onUpdate: () => { morph.current = state.m; curve.current?.setMorph(state.m); } }, 0)
          .fromTo('.rail', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.8)
          .fromTo(captions[0], { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.3 }, 0.8)
          .set(ticks[0], { attr: { 'data-active': 'true' } }, 0.8);

        steps.forEach((step, index) => {
          if (index === 0) return;
          const at = 1.6 + (index - 1) * 1.05;
          const reveals = layers[index].querySelectorAll('[data-reveal]');
          tl.to(captions[index - 1], { autoAlpha: 0, y: -24, filter: 'blur(8px)', duration: 0.25 }, at)
            .fromTo(layers[index - 1], { filter: 'blur(0px)' }, { autoAlpha: 0, filter: 'blur(6px)', duration: 0.2 }, at)
            .set(tabs, { attr: { 'data-active': 'false' } }, at + 0.2)
            .set(tabs.filter((tab) => tab.dataset.tab === step.tab), { attr: { 'data-active': 'true' } }, at + 0.2)
            .set(ticks[index], { attr: { 'data-active': 'true' } }, at + 0.2)
            .fromTo(captions[index], { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.25 }, at + 0.2)
            .fromTo(layers[index], { autoAlpha: 0, filter: 'blur(6px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.2 }, at + 0.2)
            .from(reveals, { autoAlpha: 0, y: 10, duration: 0.16, stagger: 0.09 }, at + 0.3);
        });
        tl.to({}, { duration: 0.7 }).addLabel('first', 1.3);
        timeline.current = tl;

        return () => {
          timeline.current = null;
          morph.current = 0;
          curve.current?.setMorph(0);
        };
      });
    },
    { scope: root },
  );

  return (
    <section className="stage" ref={root} aria-label="Introduction">
      <div className="stage-pin" ref={pin}>
        <div className="hero">
          {noWebgl ? (
            <svg className="curve-fallback" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
              <path d={fallbackPath()} />
            </svg>
          ) : (
            <canvas className="curve-canvas" ref={canvas} aria-hidden="true" />
          )}
          <div className="hero-copy">
            <h1>Know the load before you make the call.</h1>
            <p className="hero-lede">
              Loadline AI is a Windows workspace for commercial energy consultants. Accounts, bills, research and
              follow-up share one window, with an assistant that shows its sources.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={download.href}>{download.label}</a>
              <a className="btn btn-quiet" href="#how" onClick={showStory}>See how it works</a>
            </div>
            <p className="hero-note">{download.note}</p>
          </div>
          <div className="curve-rect" ref={rectA} aria-hidden="true" />
          <div className="curve-axis" aria-hidden="true">
            <div className="curve-hours"><span>12 am</span><span>6 am</span><span>12 pm</span><span>6 pm</span><span>12 am</span></div>
            <p className="legend"><i className="mint" />Sample building load, 28 days<i className="amber" />Peak demand window</p>
          </div>
        </div>

        <div className="window-wrap">
          <AppWindow chartRef={rectB} />
          <p className="window-note">Simplified view with sample data.</p>
        </div>

        <div className="rail" aria-hidden="true">{steps.map((step) => <i key={step.id} data-active="false" />)}</div>
        <ol className="captions" id="how">
          {steps.map((step, index) => (
            <li className="caption" key={step.id}>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
              <div className="caption-panel">{panels[index]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
