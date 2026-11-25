'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from './panels';

const product = [
  { href: '/features', label: 'Overview', text: 'Everything in the window' },
  { href: '/lead-desk', label: 'Lead desk', text: 'Accounts, lists and assignments' },
  { href: '/intelligence', label: 'Intelligence', text: 'The assistant that shows its sources' },
  { href: '/market', label: 'Market', text: 'Prices, demand and contract radar' },
];

const links = [
  { href: '/use-cases', label: 'Use cases' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/security', label: 'Security' },
  { href: '/getting-started', label: 'Get started' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const inProduct = product.some((item) => item.href === pathname);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProductOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !productOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      setProductOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (productRef.current && !productRef.current.contains(event.target as Node)) setProductOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open, productOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || open} data-open={open}>
      <div className="site-header-bar">
        <Link className="brand" href="/" aria-label="Loadline AI home">
          <LogoMark /> <span>Loadline AI</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <div
            className="nav-product"
            ref={productRef}
            data-open={productOpen}
            onPointerEnter={(event) => event.pointerType === 'mouse' && setProductOpen(true)}
            onPointerLeave={(event) => event.pointerType === 'mouse' && setProductOpen(false)}
          >
            <button
              type="button"
              aria-expanded={productOpen}
              aria-controls="product-menu"
              data-current={inProduct}
              onClick={() => setProductOpen((value) => !value)}
            >
              Product <i aria-hidden="true" />
            </button>
            <div className="nav-product-menu" id="product-menu" inert={!productOpen}>
              {product.map((item) => (
                <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
                  <b>{item.label}</b>
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="site-header-end">
          <Link className="btn btn-primary btn-small" href="/download">Download</Link>
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <i /><i />
          </button>
        </div>
      </div>
      <nav className="site-menu" id="site-menu" aria-label="Main, small screens" inert={!open}>
        {[...product.map((item) => ({ href: item.href, label: item.href === '/features' ? 'Features' : item.label })), ...links].map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
