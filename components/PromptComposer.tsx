'use client';

import { useEffect, useRef, useState } from 'react';

const prompts = [
  'Give me a brief before my call with Harbor Cold Storage.',
  'What was the peak demand on the March bill?',
  'Explain the demand charge clause in this agreement.',
  'What are settlement prices doing in the Houston load zone?',
  'Draft a follow-up to Dana for Thursday.',
];

/** A composer that types example questions. Picking one shows it at once; reduced motion shows them without typing. */
export default function PromptComposer() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(prompts[0]);
  const [auto, setAuto] = useState(true);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(prompts[active]);
      return;
    }
    const text = prompts[active];
    let index = 0;
    let timer: number;
    setTyped('');
    const tick = () => {
      if (!visible.current) {
        timer = window.setTimeout(tick, 400);
        return;
      }
      index += 1;
      setTyped(text.slice(0, index));
      if (index < text.length) timer = window.setTimeout(tick, 26 + Math.random() * 34);
      else timer = window.setTimeout(() => setActive((value) => (value + 1) % prompts.length), 2400);
    };
    timer = window.setTimeout(tick, 350);
    return () => window.clearTimeout(timer);
  }, [active, auto]);

  return (
    <div className="prompt" ref={box}>
      <div className="prompt-box" aria-hidden="true">
        <p>{typed}<i /></p>
        <span />
      </div>
      <ul className="prompt-list" aria-label="Example questions">
        {prompts.map((prompt, index) => (
          <li key={prompt}>
            <button
              type="button"
              aria-pressed={index === active}
              onClick={() => {
                setAuto(false);
                setActive(index);
              }}
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
