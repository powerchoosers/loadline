'use client';

import { useEffect, useId, useRef, useState } from 'react';

/*
 * Recreation of the app's floating voice overlay card (VoiceOverlayCard) with the
 * default "Loadline original" orb: mist layers displaced by a turbulence filter,
 * drifting gas bands and a rim. In the app the orb swells with the audio level;
 * here a speech-like envelope drives the same --voice-level variable.
 */

const lines = [
  'Their March bill peaked at 812 kilowatts on a weekday afternoon.',
  'The contract with Gulf Coast Power ends on March 31, 2027.',
  'That leaves time to price a few options before renewal.',
  'Want me to draft the follow-up to Dana?',
];

const WORD_MS = 250;

export default function VoiceOverlayDemo() {
  const root = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const speakingUntil = useRef(0);
  const visible = useRef(true);
  const [line, setLine] = useState(0);
  const [motion, setMotion] = useState(false);
  const mistId = useId().replace(/:/g, '');
  const words = lines[line].split(' ');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setMotion(true);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    if (root.current) observer.observe(root.current);

    let frame = 0;
    let level = 0;
    let target = 0;
    let nextAt = 0;
    const loop = (now: number) => {
      if (visible.current && !document.hidden) {
        if (now > nextAt) {
          // Syllable-sized bursts while a line is being spoken, silence between lines.
          target = now < speakingUntil.current ? 0.25 + Math.random() * 0.75 : 0;
          nextAt = now + 70 + Math.random() * 120;
        }
        level += (target - level) * 0.22;
        orb.current?.style.setProperty('--voice-level', level.toFixed(3));
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!motion) return;
    const spoken = lines[line].split(' ').length * WORD_MS;
    speakingUntil.current = performance.now() + spoken + 150;
    const timer = window.setTimeout(() => setLine((value) => (value + 1) % lines.length), spoken + 1700);
    return () => window.clearTimeout(timer);
  }, [line, motion]);

  return (
    <div className="vo" ref={root}>
      <div className="vo-card">
        <div className="vo-header">
          <span className="vo-action">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="128" cy="128" r="40" />
              <path d="M130 206a8 8 0 0 0-5 0l-25 14a104 104 0 0 1-28-16l0-29a8 8 0 0 0-3-4 8 8 0 0 0-4-4l-28-2a104 104 0 0 1-12-30l19-22a8 8 0 0 0 0-10L25 81a104 104 0 0 1 12-30l28-2a8 8 0 0 0 4-4 8 8 0 0 0 3-4V52a104 104 0 0 1 28-16l25 14a8 8 0 0 0 5 0l25-14a104 104 0 0 1 28 16v29a8 8 0 0 0 3 4 8 8 0 0 0 4 4l28 2a104 104 0 0 1 12 30l-19 22a8 8 0 0 0 0 10l19 22a104 104 0 0 1-12 30l-28 2a8 8 0 0 0-4 4 8 8 0 0 0-3 4v29a104 104 0 0 1-28 16Z" />
            </svg>
          </span>
          <span className="vo-handle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {[7, 13].map((x) => [5, 10, 15].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />))}
            </svg>
          </span>
          <span className="vo-action">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
            </svg>
          </span>
        </div>
        <div className="vo-body">
          <div className="vo-orb" ref={orb}>
            <svg width="0" height="0" className="vo-filter">
              <defs>
                <filter id={mistId} x="-35%" y="-35%" width="170%" height="170%">
                  <feTurbulence type="fractalNoise" baseFrequency=".025 .055" numOctaves="3" seed="8" result="fog" />
                  <feDisplacementMap in="SourceGraphic" in2="fog" scale="32" xChannelSelector="R" yChannelSelector="G" />
                  <feGaussianBlur stdDeviation="0.65" />
                </filter>
              </defs>
            </svg>
            <div className="vo-clouds" style={{ filter: `url(#${mistId}) saturate(1.12) contrast(1.1)` }}>
              <div className="vo-mist vo-mist-mint" />
              <div className="vo-mist vo-mist-purple" />
              <div className="vo-mist vo-mist-white" />
            </div>
            <div className="vo-grain" />
          </div>
          <div className="vo-status">
            <strong>Listening</strong>
            <span key={line}>
              {motion
                ? words.map((word, index) => (
                    <i key={index} style={{ animationDelay: `${index * WORD_MS}ms` }}>{word} </i>
                  ))
                : lines[line]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
