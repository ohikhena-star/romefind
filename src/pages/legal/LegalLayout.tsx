import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ChevronDown, ChevronRight, ArrowLeft, Menu, X } from 'lucide-react';

// ─── Shared layout wrapper for all legal pages ────────────────────────────────

interface Section {
  id: string;
  title: string;
}

interface LegalPageProps {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalPage({ title, intro, lastUpdated, sections, children }: LegalPageProps) {
  const [activeId, setActiveId] = useState('');
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      {/* Page header */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 md:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-rome-600 dark:hover:text-rome-400 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to ROMEfind
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-rome-500 mb-2">Legal & Trust</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-xs font-medium text-surface-400 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0">
              Last updated: {lastUpdated}
            </p>
          </div>
          <p className="mt-5 text-lg text-surface-600 dark:text-surface-400 max-w-2xl leading-relaxed">
            {intro}
          </p>
        </div>
      </div>

      {/* Mobile ToC toggle */}
      <div className="lg:hidden border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-surface-700 dark:text-surface-300"
          aria-expanded={tocOpen}
        >
          Contents
          <ChevronDown size={15} className={cn('transition-transform', tocOpen && 'rotate-180')} />
        </button>
        {tocOpen && (
          <nav className="px-5 pb-4 space-y-1" aria-label="Table of contents">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setTocOpen(false)}
                className="block py-1.5 text-sm text-surface-500 hover:text-rome-600 dark:hover:text-rome-400 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 md:py-16 flex gap-12">
        {/* Sticky sidebar ToC — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Contents</p>
            <nav className="space-y-1" aria-label="Table of contents">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    'block py-1.5 text-sm transition-colors leading-snug',
                    activeId === s.id
                      ? 'text-rome-600 dark:text-rome-400 font-semibold'
                      : 'text-surface-500 hover:text-rome-600 dark:hover:text-rome-400'
                  )}
                >
                  {s.title}
                </a>
              ))}
            </nav>

            {/* Legal cross-links */}
            <div className="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-3">Also</p>
              <Link to="/privacy" className="block text-sm text-surface-500 hover:text-rome-600 dark:hover:text-rome-400 transition-colors py-1">Privacy Policy</Link>
              <Link to="/terms" className="block text-sm text-surface-500 hover:text-rome-600 dark:hover:text-rome-400 transition-colors py-1">Terms & Conditions</Link>
              <Link to="/community-guidelines" className="block text-sm text-surface-500 hover:text-rome-600 dark:hover:text-rome-400 transition-colors py-1">Community Guidelines</Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main ref={contentRef} className="flex-1 min-w-0">
          <div className="prose-legal">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Shared section components ────────────────────────────────────────────────

export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      <h2 className="text-xl font-black text-surface-900 dark:text-white mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
        {title}
      </h2>
      <div className="space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed text-[0.9375rem]">
        {children}
      </div>
    </section>
  );
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{children}</p>;
}

export function LegalUl({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-surface-600 dark:text-surface-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rome-400 flex-shrink-0 mt-2" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LegalCallout({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warn' }) {
  return (
    <div className={cn(
      'rounded-xl border px-5 py-4 text-sm leading-relaxed',
      variant === 'warn'
        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
        : 'bg-rome-50 dark:bg-rome-950/20 border-rome-200 dark:border-rome-800 text-rome-800 dark:text-rome-200'
    )}>
      {children}
    </div>
  );
}

export function LegalContact() {
  return (
    <div className="mt-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-5 space-y-2">
      <p className="text-sm text-surface-700 dark:text-surface-300">
        Email:{' '}
        <a href="mailto:romefind.support@gmail.com" className="font-semibold text-rome-600 dark:text-rome-400 hover:underline">
          romefind.support@gmail.com
        </a>
      </p>
      <p className="text-sm text-surface-700 dark:text-surface-300">
        WhatsApp / Phone:{' '}
        <a href="https://wa.me/2347016657016" className="font-semibold text-rome-600 dark:text-rome-400 hover:underline" target="_blank" rel="noreferrer">
          +234 701 665 7016
        </a>
      </p>
    </div>
  );
}
