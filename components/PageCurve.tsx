'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * The load line under each inner page's title. Every few seconds it reshapes into a
 * different sample building profile, and the amber section moves to that profile's peak.
 */

type Profile = { name: string; on: number; off: number; plateau: number; center: number; width: number; peak: number };

const profiles: Profile[] = [
  { name: 'Office, weekday', on: 0.27, off: 0.8, plateau: 0.4, center: 0.62, width: 0.075, peak: 0.27 },
  { name: 'Manufacturer, day shift', on: 0.23, off: 0.7, plateau: 0.48, center: 0.41, width: 0.05, peak: 0.19 },
  { name: 'Bakery, early shift', on: 0.16, off: 0.6, plateau: 0.34, center: 0.3, width: 0.065, peak: 0.33 },
  { name: 'Restaurant, dinner service', on: 0.4, off: 0.93, plateau: 0.32, center: 0.79, width: 0.06, peak: 0.35 },
  { name: 'Cold storage, two shifts', on: 0.2, off: 0.9, plateau: 0.46, center: 0.48, width: 0.11, peak: 0.16 },
];

const W = 1200;
const H = 120;
const STEPS = 160;
const HOLD_MS = 4200;
const MORPH_MS = 1900;

const sig = (x: number) => 1 / (1 + Math.exp(-x));
const value = (u: number, p: Profile) =>
  0.24 + p.plateau * (sig((u - p.on) / 0.03) - sig((u - p.off) / 0.035)) + p.peak * Math.exp(-(((u - p.center) / p.width) ** 2));

function paths(p: Profile) {
  const values: number[] = [];
  let max = 0;
  for (let i = 0; i <= STEPS; i += 1) {
    const v = value(i / STEPS, p);
    values.push(v);
    if (v > max) max = v;
  }
  const point = (i: number) => `${((i / STEPS) * W).toFixed(1)} ${(H - 6 - values[i] * (H - 12)).toFixed(1)}`;
  let load = '';
  let peak = '';
  for (let i = 0; i <= STEPS; i += 1) {
    load += `${i ? 'L' : 'M'}${point(i)}`;
    // The peak window is the stretch within reach of the day's highest demand.
    if (values[i] > max - 0.13) peak += `${peak ? 'L' : 'M'}${point(i)}`;
  }
  return { load, peak };
}

const mix = (a: Profile, b: Profile, t: number): Profile => ({
  name: b.name,
  on: a.on + (b.on - a.on) * t,
  off: a.off + (b.off - a.off) * t,
  plateau: a.plateau + (b.plateau - a.plateau) * t,
  center: a.center + (b.center - a.center) * t,
  width: a.width + (b.width - a.width) * t,
  peak: a.peak + (b.peak - a.peak) * t,
});

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function PageCurve() {
  const root = useRef<HTMLDivElement>(null);
  const loadPath = useRef<SVGPathElement>(null);
  const peakPath = useRef<SVGPathElement>(null);
  const [label, setLabel] = useState(profiles[0].name);
  const first = paths(profiles[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let index = 0;
    let frame = 0;
    let timer = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (root.current) observer.observe(root.current);

    const morph = () => {
      if (!visible || document.hidden) {
        timer = window.setTimeout(morph, 800);
        return;
      }
      const from = profiles[index];
      index = (index + 1) % profiles.length;
      const to = profiles[index];
      setLabel(to.name);
      const startedAt = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startedAt) / MORPH_MS);
        const next = paths(mix(from, to, ease(t)));
        loadPath.current?.setAttribute('d', next.load);
        peakPath.current?.setAttribute('d', next.peak);
        if (t < 1) frame = requestAnimationFrame(step);
        else timer = window.setTimeout(morph, HOLD_MS);
      };
      frame = requestAnimationFrame(step);
    };
    timer = window.setTimeout(morph, HOLD_MS);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="page-curve-wrap" ref={root} aria-hidden="true">
      <p className="page-curve-label">
        <span key={label}>{label}</span>
      </p>
      <svg className="page-curve" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path className="page-curve-load" ref={loadPath} d={first.load} />
        <path className="page-curve-peak" ref={peakPath} d={first.peak} />
      </svg>
    </div>
  );
}
