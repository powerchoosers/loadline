'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Blocks that blur into focus as they scroll into view. The pinned home story is left out on purpose.
const TARGETS = [
  '.plan', '.ask-lead', '.prompt', '.inside-lead', '.inside-list > div', '.control > h2', '.control li', '.download-card',
  '.feature-copy', '.feature-visual', '.also', '.case', '.approvals li', '.topic',
  '.dl-grid > *', '.releases > ol > li', '.guide-step', '.guide-more', '.faq-group',
].join(',');

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-blur', 'in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    // Only content still below the fold waits; anything already on screen stays as it is.
    document.querySelectorAll<HTMLElement>(TARGETS).forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      element.setAttribute('data-blur', 'wait');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
