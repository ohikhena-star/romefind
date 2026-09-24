import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  Search, ArrowRight, CheckCircle2, Circle, ChevronDown,
  MapPin, Calendar, DollarSign, Clock, ExternalLink,
  Compass, Users, Award, Globe, Briefcase, GraduationCap,
  Heart, Lightbulb, Rocket, Check, ChevronRight,
  Star, BookOpen, Target, TrendingUp, Zap, X, Menu,
  ArrowUpRight, Sparkles, BarChart2, Share2
} from 'lucide-react';

// ─── Design tokens ──────────────────────────────────────────────────────────
// sky blue = rome-500 (#0ea5e9)

// ─── Pill label used above section headings (WizardUI / Aeline pattern) ─────
const Pill = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4',
    light
      ? 'bg-white/10 text-white/80 border border-white/20'
      : 'bg-rome-100 dark:bg-rome-950/60 text-rome-700 dark:text-rome-300 border border-rome-200 dark:border-rome-800'
  )}>
    <span className={cn('w-1.5 h-1.5 rounded-full', light ? 'bg-white/60' : 'bg-rome-500')} />
    {children}
  </span>
);

// ─── Badge chip ─────────────────────────────────────────────────────────────
const Chip = ({ children, color = 'sky' }: { children: React.ReactNode; color?: string }) => {
  const map: Record<string, string> = {
    sky: 'bg-rome-100 text-rome-700 dark:bg-rome-900/40 dark:text-rome-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight', map[color] || map.sky)}>
      {children}
    </span>
  );
};

// ─── Mini opportunity card (used in product mockups) ─────────────────────────
const MiniCard = ({
  title, org, type, color, deadline, location, funded, ring = false, muted = false
}: {
  title: string; org: string; type: string; color: string;
  deadline?: string; location?: string; funded?: boolean; ring?: boolean; muted?: boolean;
}) => (
  <div className={cn(
    'rounded-2xl border bg-white dark:bg-surface-900 p-4 transition-all select-none',
    ring ? 'border-rome-400 shadow-lg shadow-rome-200/40 dark:shadow-rome-900/40 ring-2 ring-rome-200 dark:ring-rome-800/60' : 'border-surface-200 dark:border-surface-800 shadow-sm',
    muted && 'opacity-60'
  )}>
    <div className="flex items-start justify-between gap-2 mb-2.5">
      <Chip color={color}>{type}</Chip>
      {funded && <Chip color="emerald">Funded</Chip>}
    </div>
    <h4 className="text-sm font-bold text-surface-900 dark:text-white leading-snug mb-1">{title}</h4>
    <p className="text-xs text-surface-500 mb-3">{org}</p>
    {(deadline || location) && (
      <div className="flex items-center gap-3 text-xs text-surface-400">
        {deadline && <span className="flex items-center gap-1"><Calendar size={10} />{deadline}</span>}
        {location && <span className="flex items-center gap-1"><MapPin size={10} />{location}</span>}
      </div>
    )}
  </div>
);

// ─── Sticky Nav ──────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 dark:bg-surface-950/95 backdrop-blur-lg border-b border-surface-200/80 dark:border-surface-800/80' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="font-black text-xl tracking-tight text-surface-900 dark:text-white">
          ROME<span className="text-rome-500">find</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {['Discover', 'Explore', 'Compare', 'Learn'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`}
              className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-rome-600 dark:hover:text-rome-400 transition-colors">
              {l}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors px-3 py-2">Sign in</Link>
          <Link to="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface-900 dark:bg-white hover:bg-surface-800 dark:hover:bg-surface-100 text-white dark:text-surface-900 text-sm font-bold rounded-xl transition-colors">
            Get started <ArrowRight size={13} />
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} className="text-surface-700 dark:text-surface-300" /> : <Menu size={20} className="text-surface-700 dark:text-surface-300" />}
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 px-5 pb-5">
          {['Discover', 'Explore', 'Compare', 'Learn'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-semibold text-surface-700 dark:text-surface-300 border-b border-surface-100 dark:border-surface-800 last:border-0">
              {l}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 text-center text-sm font-semibold text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 rounded-xl">Sign in</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2.5 text-center text-sm font-bold text-white bg-surface-900 dark:bg-white dark:text-surface-900 rounded-xl">Get started</Link>
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Marquee strip (WizardUI pattern) ────────────────────────────────────────
const PATHS = ['Fellowships', 'Scholarships', 'Internships', 'Research Roles', 'Grants & Funding', 'Competitions', 'Programmes', 'Volunteering', 'Full-time Jobs', 'Conferences'];
const Marquee = () => (
  <div className="py-5 border-y border-surface-200 dark:border-surface-800 overflow-hidden bg-surface-50/60 dark:bg-surface-900/30">
    <div className="flex gap-8 animate-[marquee_22s_linear_infinite] whitespace-nowrap">
      {[...PATHS, ...PATHS].map((p, i) => (
        <span key={i} className="flex items-center gap-2 text-sm font-semibold text-surface-400 dark:text-surface-600 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rome-400" />{p}
        </span>
      ))}
    </div>
  </div>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const DEMO_RESULTS = [
    { title: 'Product Design Fellowship', org: 'Design Foundation', type: 'Fellowship', color: 'purple', deadline: 'Nov 1', location: 'Global', funded: true },
    { title: 'UX Design Internship', org: 'Creative Labs', type: 'Internship', color: 'blue', deadline: 'Oct 12', location: 'Remote', funded: false },
    { title: 'Design Research Programme', org: 'Human-Centred Institute', type: 'Programme', color: 'teal', deadline: 'Oct 28', location: 'UK', funded: true },
    { title: 'UX Innovation Competition', org: 'Creative Guild', type: 'Competition', color: 'amber', deadline: 'Oct 20', location: 'Global', funded: false },
  ];

  const CHECKLIST = [
    { label: 'Confirm eligibility', done: true },
    { label: 'Prepare CV / Resume', done: true },
    { label: 'Prepare portfolio', done: false },
    { label: 'Write personal statement', done: false },
    { label: 'Request recommendation letters', done: false },
  ];

  const FAQ_ITEMS = [
    { q: 'What is ROMEfind?', a: 'ROMEfind is an opportunity discovery and decision-support platform. It helps you find opportunities — fellowships, scholarships, jobs, grants, internships, programmes, and more — and then helps you explore, compare, prepare, track, and learn.' },
    { q: 'Is ROMEfind only for students?', a: 'No. ROMEfind is for anyone exploring possibilities — students, working professionals, researchers, founders, career changers, and people looking for funding or their next move.' },
    { q: 'What kinds of opportunities can I find?', a: 'Fellowships, scholarships, internships, full-time roles, grants, research positions, programmes, competitions, hackathons, volunteering, conferences, and more.' },
    { q: 'Where does ROMEfind get opportunities from?', a: 'Opportunities are sourced from public information and community submissions. All submissions are reviewed before being listed as verified opportunities.' },
    { q: 'Can I submit an opportunity?', a: 'Yes. You can submit by sharing a link, uploading a PDF, or entering details manually. Submissions are reviewed and verified before being published.' },
    { q: 'Does ROMEfind apply for opportunities for me?', a: 'No. ROMEfind helps you discover, understand, prepare, and track — the actual application happens directly with the opportunity provider via official links.' },
    { q: 'Can I compare opportunities?', a: 'Yes. Add opportunities to a comparison view and see deadline, funding, location, duration, requirements and more side by side.' },
    { q: 'How does community experience work?', a: 'People who have applied share what helped, what they\'d do differently, and their outcome. This is clearly labelled as community experience — separate from official information.' },
    { q: 'How does ROMEfind keep opportunity information current?', a: 'Opportunities can be verified, updated, reported as broken, or marked expired. We display when an opportunity was last verified and link to the official source.' },
  ];

  return (
    <div className="bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 overflow-x-hidden">
      {/* Marquee keyframe injected inline */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @media (prefers-reduced-motion: reduce) { .animate-\\[marquee_22s_linear_infinite\\] { animation: none } }
      `}</style>

      <Nav />

      {/* ── HERO — full-bleed sky blue (Aeline + Payno) ─────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-sky-600 via-rome-500 to-rome-600 pt-20">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        {/* Soft radial glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Pill label */}
            <Pill light>Now in public beta</Pill>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.03] tracking-tight mb-6">
              Rome wasn't built<br />in a day.<br />
              <span className="text-white/70">Neither is your path.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed mb-10">
              The right opportunity can change what comes next. ROMEfind helps you discover possibilities, explore paths you may have overlooked, and take the next step.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-surface-900 font-black rounded-xl text-base transition-all shadow-lg hover:shadow-xl">
                Explore opportunities <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-base transition-all backdrop-blur-sm">
                See how it works
              </a>
            </div>
          </div>

          {/* Floating UI cards — 3D perspective (Aeline pattern) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-[480px] pr-8"
            style={{ perspective: '1000px' }}>
            <div style={{ transform: 'rotateY(-8deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}
              className="space-y-3">
              {DEMO_RESULTS.map((r, i) => (
                <div key={i} style={{ transform: `translateZ(${i * 8}px)` }}>
                  <MiniCard {...r} ring={i === 0} muted={i === 3} />
                </div>
              ))}
              {/* Alternative paths badge floating below */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/90 dark:bg-surface-900/90 border border-rome-200 dark:border-rome-800 backdrop-blur-sm shadow-lg">
                <Compass size={14} className="text-rome-500 flex-shrink-0" />
                <span className="text-xs font-bold text-rome-700 dark:text-rome-300">You might also explore:</span>
                <span className="text-xs text-rome-500">Research · Grants · Programmes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" className="dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ── MARQUEE (WizardUI pattern) ───────────────────────────────────── */}
      <Marquee />

      {/* ── PROBLEM — bento grid (HiBob + Aeline) ───────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <Pill>The problem</Pill>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
              You might be searching<br />
              <span className="text-surface-400 dark:text-surface-600">too narrowly.</span>
            </h2>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-lg leading-relaxed">
              People search for what they know. ROMEfind shows you what you might be missing — paths that sit right beside what you're already looking for.
            </p>
          </div>

          {/* Bento grid layout (HiBob / Aeline) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left — search demo, spans 3 cols */}
            <div className="lg:col-span-3 rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3">What are you looking for?</p>
              <div className="flex items-center gap-3 bg-white dark:bg-surface-950 border-2 border-rome-400 dark:border-rome-500 rounded-xl px-4 py-3 mb-5 shadow-sm">
                <Search size={15} className="text-rome-500 flex-shrink-0" />
                <span className="text-sm font-bold text-surface-900 dark:text-white">UX internship</span>
                <span className="ml-auto w-0.5 h-4 bg-rome-400 animate-pulse" />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3">Opportunities found</p>
              <div className="space-y-2">
                {[
                  { label: 'UX Design Internship', type: 'Internship', color: 'blue' },
                  { label: 'Product Design Fellowship', type: 'Fellowship', color: 'purple' },
                  { label: 'Design Research Programme', type: 'Programme', color: 'teal' },
                  { label: 'UX Innovation Competition', type: 'Competition', color: 'amber' },
                  { label: 'Research Grant – User Experience', type: 'Grant', color: 'emerald' },
                ].map((r, i) => (
                  <div key={i} className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border',
                    i === 0 ? 'bg-white dark:bg-surface-950 border-rome-300 dark:border-rome-700' : 'bg-white/50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-800'
                  )}>
                    <Chip color={r.color}>{r.type}</Chip>
                    <span className="text-sm font-semibold text-surface-800 dark:text-surface-200 flex-1 truncate">{r.label}</span>
                    {i === 0 && <Check size={13} className="text-rome-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 2 tall cards stacked, spans 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Alternative paths card */}
              <div className="flex-1 rounded-3xl border border-rome-200 dark:border-rome-800/60 bg-rome-50 dark:bg-rome-950/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-rome-500 flex items-center justify-center">
                    <Compass size={15} className="text-white" />
                  </div>
                  <span className="text-sm font-black text-rome-800 dark:text-rome-200">You might also explore</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Fellowships', 'Research', 'Competitions', 'Grants', 'Programmes'].map(t => (
                    <span key={t} className="px-3 py-1 text-xs font-bold rounded-full bg-white dark:bg-surface-900 border border-rome-300 dark:border-rome-700 text-rome-700 dark:text-rome-300">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-rome-600 dark:text-rome-400 leading-relaxed">
                  You're exploring internships. These paths can also offer experience, mentorship, research exposure, or portfolio-building opportunities.
                </p>
              </div>

              {/* Stat card — no fake numbers, descriptive instead */}
              <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-900 dark:bg-surface-900 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Opportunity types</p>
                <div className="space-y-2">
                  {[
                    { label: 'Fellowships', w: '80%', color: 'bg-purple-400' },
                    { label: 'Grants', w: '60%', color: 'bg-emerald-400' },
                    { label: 'Internships', w: '75%', color: 'bg-rome-400' },
                    { label: 'Programmes', w: '50%', color: 'bg-teal-400' },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-surface-300">{r.label}</span>
                      </div>
                      <div className="w-full bg-surface-800 rounded-full h-1.5">
                        <div className={cn('h-1.5 rounded-full', r.color)} style={{ width: r.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE STATEMENT — dark full-bleed (Finexa / Aeline) ──────── */}
      <section className="py-24 bg-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rome-400 mb-6">Your search is only the beginning</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            From discovery<br />
            <span className="text-rome-400">to outcome.</span>
          </h2>
          <p className="text-xl text-surface-400 max-w-xl mx-auto leading-relaxed mb-16">
            ROMEfind stays with you from the moment you find an opportunity to the moment you share your experience with the next person.
          </p>

          {/* Journey steps — horizontal scrollable on mobile, row on desktop */}
          <div className="flex items-center justify-center overflow-x-auto pb-2 gap-0 -mx-5 px-5 sm:mx-0 sm:px-0">
            {['Discover', 'Explore', 'Compare', 'Prepare', 'Apply', 'Track', 'Learn', 'Outcome', 'Contribute'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 mb-2',
                    i < 5 ? 'bg-rome-500 border-rome-400 text-white' : 'bg-surface-800 border-surface-700 text-surface-500'
                  )}>
                    {i < 5 ? <Check size={13} /> : i + 1}
                  </div>
                  <span className={cn('text-xs font-bold', i < 5 ? 'text-rome-300' : 'text-surface-600')}>{step}</span>
                </div>
                {i < 8 && <div className={cn('w-6 h-px flex-shrink-0 mx-1 mb-5', i < 4 ? 'bg-rome-700' : 'bg-surface-800')} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-STEP HOW IT WORKS (WizardUI pattern) ──────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-16">
            <Pill>How it works</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight">Simple steps,<br />real results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01', icon: Search, label: 'Discover possibilities',
                desc: 'Tell ROMEfind what you\'re looking for. Explore opportunities matched to your profile, field, and goals — plus paths you may not have considered.',
                bg: 'bg-rome-50 dark:bg-rome-950/20', border: 'border-rome-200 dark:border-rome-800',
                iconBg: 'bg-rome-500',
              },
              {
                step: '02', icon: BarChart2, label: 'Compare & decide',
                desc: 'Add opportunities to your comparison view. See deadlines, funding, requirements, and effort side-by-side to make an informed decision.',
                bg: 'bg-surface-50 dark:bg-surface-900', border: 'border-surface-200 dark:border-surface-800',
                iconBg: 'bg-surface-800 dark:bg-white',
              },
              {
                step: '03', icon: Target, label: 'Prepare & track',
                desc: 'Work through your preparation checklist, track your application through every status, and record your outcome when the time comes.',
                bg: 'bg-surface-50 dark:bg-surface-900', border: 'border-surface-200 dark:border-surface-800',
                iconBg: 'bg-surface-800 dark:bg-white',
              },
            ].map(({ step, icon: Icon, label, desc, bg, border, iconBg }) => (
              <div key={step} className={cn('rounded-3xl border p-7 relative overflow-hidden', bg, border)}>
                <span className="absolute top-5 right-6 text-5xl font-black text-surface-200/40 dark:text-surface-700/40 leading-none select-none">{step}</span>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-5', iconBg)}>
                  <Icon size={18} className={iconBg.includes('rome-500') ? 'text-white' : 'text-white dark:text-surface-900'} />
                </div>
                <h3 className="text-base font-black text-surface-900 dark:text-white mb-2">{label}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCOVER — text left / cards right (Payno alternating) ─────── */}
      <section className="py-20 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill>Discover & Explore</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-5">
                See more possibilities.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
                ROMEfind surfaces opportunities matched to your interests, goals, experience, and preferences — and shows you adjacent paths you might have overlooked.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Personalized to your field and goals',
                  'Alternative paths adjacent to your search',
                  'Deadlines, funding status, and location at a glance',
                  'Remote and globally accessible opportunities',
                  'Public health, tech, climate, research, and more',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={14} className="text-rome-500 flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
              <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm font-bold text-rome-600 dark:text-rome-400 hover:text-rome-700 dark:hover:text-rome-300 transition-colors">
                Browse opportunities <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Global Health Leadership Fellowship', org: 'WHO Foundation', type: 'Fellowship', color: 'purple', deadline: 'Nov 15', funded: true },
                { title: 'Climate Innovation Grant', org: 'Green Future Fund', type: 'Grant', color: 'emerald', deadline: 'Dec 10', funded: true },
                { title: 'UX Research Programme', org: 'Design Council', type: 'Programme', color: 'teal', deadline: 'Oct 30', funded: true },
                { title: 'AI for Good Internship', org: 'OpenAI Foundation', type: 'Internship', color: 'blue', deadline: 'Nov 1', funded: false },
              ].map((opp, i) => (
                <MiniCard key={i} {...opp} location="Remote" ring={i === 0} />
              ))}
              <div className="col-span-2 flex items-center gap-2 px-4 py-3 rounded-2xl border border-rome-200 dark:border-rome-800 bg-rome-50 dark:bg-rome-950/20">
                <Compass size={14} className="text-rome-500 flex-shrink-0" />
                <span className="text-xs font-bold text-rome-700 dark:text-rome-300">You might be overlooking:</span>
                <span className="text-xs text-rome-500 dark:text-rome-400">Competitions · Research · Conferences</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE — product UI center (Payno pricing layout) ───────────── */}
      <section className="py-20 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <Pill>Compare</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-4">
              Don't just find an opportunity.<br />Understand your options.
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg">See opportunities side by side. Compare what matters.</p>
          </div>
          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-surface-200 dark:border-surface-800 shadow-elevated">
            {/* Column headers */}
            <div className="grid grid-cols-3">
              <div className="p-5 border-r border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
                <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Compare</span>
              </div>
              {/* Highlighted center (Payno pattern) */}
              <div className="p-5 border-r border-rome-200 dark:border-rome-800 bg-rome-500 text-white">
                <Chip color="sky"><span className="text-white font-bold">Fellowship</span></Chip>
                <p className="text-sm font-black mt-2 leading-tight">Product Design Fellowship</p>
                <p className="text-xs text-rome-100 mt-1">Design Foundation</p>
              </div>
              <div className="p-5 bg-surface-50 dark:bg-surface-900">
                <Chip color="teal">Programme</Chip>
                <p className="text-sm font-black text-surface-900 dark:text-white mt-2 leading-tight">UX Research Programme</p>
                <p className="text-xs text-surface-500 mt-1">Human-Centred Inst.</p>
              </div>
            </div>
            {[
              { label: 'Deadline', a: 'October 12', b: 'October 28' },
              { label: 'Duration', a: '6 months', b: '3 months' },
              { label: 'Funding', a: '✓ Fully funded + stipend', b: '✓ Fully funded' },
              { label: 'Location', a: 'Remote (Global)', b: 'UK / Remote' },
              { label: 'Level', a: 'Early-career / Graduate', b: 'Student / Graduate' },
              { label: 'Application', a: 'CV, Portfolio, Essay', b: 'CV, Research proposal' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-t border-surface-100 dark:border-surface-800">
                <div className="px-5 py-3.5 border-r border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
                  <span className="text-xs font-semibold text-surface-500">{row.label}</span>
                </div>
                <div className="px-5 py-3.5 border-r border-rome-100 dark:border-rome-900 bg-rome-50/60 dark:bg-rome-950/10">
                  <span className="text-xs font-semibold text-rome-800 dark:text-rome-200">{row.a}</span>
                </div>
                <div className="px-5 py-3.5 bg-white dark:bg-surface-950">
                  <span className="text-xs text-surface-700 dark:text-surface-300">{row.b}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/compare" className="inline-flex items-center gap-2 px-6 py-3 bg-surface-900 dark:bg-white hover:bg-surface-800 dark:hover:bg-surface-100 text-white dark:text-surface-900 font-bold rounded-xl text-sm transition-colors shadow-sm">
              Compare opportunities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PREPARE — right UI, left text (alternating Payno) ────────────── */}
      <section className="py-20 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Checklist UI mockup */}
            <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-7 shadow-card">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <Chip color="purple">Fellowship</Chip>
                  <h4 className="text-sm font-black text-surface-900 dark:text-white mt-2">Product Design Fellowship</h4>
                  <p className="text-xs text-surface-500 mt-0.5">Deadline: October 12</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-rome-500">67%</span>
                  <p className="text-xs text-surface-500">prepared</p>
                </div>
              </div>
              <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 mb-6 overflow-hidden">
                <div className="h-2 rounded-full bg-gradient-to-r from-rome-400 to-rome-500 transition-all" style={{ width: '67%' }} />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-surface-400 mb-4">Application checklist</p>
              <div className="space-y-3">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.done
                      ? <CheckCircle2 size={16} className="text-rome-500 flex-shrink-0" />
                      : <Circle size={16} className="text-surface-300 dark:text-surface-600 flex-shrink-0" />}
                    <span className={cn('text-sm', item.done ? 'text-surface-400 line-through' : 'text-surface-800 dark:text-surface-200 font-medium')}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Pill>Prepare</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-5">
                Know what you're getting into.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
                Every opportunity in ROMEfind comes with a preparation checklist, deadline tracker, and guidance on what you'll need to apply.
              </p>
              <ul className="space-y-3">
                {['Eligibility check against your profile', 'Step-by-step preparation checklist', 'What you\'ll need to apply', 'Possible gaps and how to address them', 'Links to official application pages'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={14} className="text-rome-500 flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARN — text left / mockup right ────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill>Learn</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-5">
                Learn for what<br />you're trying to pursue.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
                Learning in ROMEfind is connected to real opportunities. Not generic courses — specific preparation for a specific goal.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 mb-8">
                <Target size={14} className="text-rome-500" />
                Opportunity → Requirement → Skill gap → Learning
              </div>
              <div>
                <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm font-bold text-rome-600 dark:text-rome-400 hover:text-rome-700 transition-colors">
                  Explore learning resources <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-7 shadow-card">
              <Chip color="purple">Fellowship</Chip>
              <h4 className="text-sm font-black text-surface-900 dark:text-white mt-2 mb-1">Product Design Fellowship</h4>
              <p className="text-xs text-surface-500 mb-5">Skills you may need for this opportunity:</p>
              <div className="space-y-1.5 mb-6">
                {['UX Research methods', 'User interviews & synthesis', 'Portfolio case study writing', 'Presentation & storytelling'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rome-400 flex-shrink-0" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{s}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-surface-400 mb-3">Your preparation</p>
              {[
                { skill: 'UX Research', progress: 40 },
                { skill: 'Portfolio storytelling', progress: 15 },
                { skill: 'User interviews', progress: 60 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 w-36 flex-shrink-0">{item.skill}</span>
                  <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-rome-400" style={{ width: `${item.progress}%` }} />
                  </div>
                  <Link to="/learn" className="text-xs font-bold text-rome-500 hover:text-rome-600 flex-shrink-0">Learn</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACK ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
            <Pill>Track</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-4">
              Keep moving after you find it.
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg">ROMEfind tracks every opportunity from saved to submitted.</p>
          </div>
          {/* Status bar */}
          <div className="flex items-center gap-0 overflow-x-auto pb-2 max-w-2xl mx-auto mb-10 justify-center">
            {['Saved', 'Considering', 'Preparing', 'Applying', 'Submitted', 'Outcome'].map((stage, i) => (
              <React.Fragment key={stage}>
                <div className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold',
                  i <= 2 ? 'bg-rome-500 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
                )}>{stage}</div>
                {i < 5 && <div className={cn('w-4 h-px flex-shrink-0', i < 2 ? 'bg-rome-400' : 'bg-surface-200 dark:bg-surface-700')} />}
              </React.Fragment>
            ))}
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { title: 'Product Design Fellowship', status: 'Preparing', col: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', next: 'Finish portfolio', deadline: 'Oct 12' },
              { title: 'Global Innovators Grant', status: 'Submitted', col: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', next: 'Await decision', deadline: 'Nov 5' },
              { title: 'UX Research Programme', status: 'Saved', col: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400', next: 'Review requirements', deadline: 'Dec 1' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-card">
                <div>
                  <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full', item.col)}>{item.status}</span>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mt-1.5">{item.title}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-surface-500">Next: <span className="font-semibold text-surface-700 dark:text-surface-300">{item.next}</span></p>
                  <p className="text-xs text-surface-400 mt-0.5 flex items-center gap-1 justify-end"><Calendar size={10} />{item.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY — dark editorial (Finexa tone) ─────────────────────── */}
      <section className="py-24 bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill light>Outcomes & Community</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5">
                Someone has been<br />through it before.
              </h2>
              <p className="text-lg text-surface-400 mb-8 leading-relaxed">
                People who have applied share what helped, what they'd do differently, and their outcome. Clearly labelled — separate from official information.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Award, label: 'Official opportunity information', sub: 'From the organization or source', bg: 'bg-surface-800', accent: '' },
                  { icon: Users, label: 'Community experience', sub: 'Shared by people who\'ve been through it', bg: 'bg-rome-950/60', accent: 'border-rome-800' },
                  { icon: BookOpen, label: 'Your private notes', sub: 'Only visible to you', bg: 'bg-surface-800', accent: '' },
                ].map(({ icon: Icon, label, sub, bg, accent }) => (
                  <div key={label} className={cn('flex items-start gap-3 p-3.5 rounded-xl border border-surface-800', bg, accent)}>
                    <Icon size={14} className="text-rome-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-surface-200">{label}</p>
                      <p className="text-xs text-surface-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-surface-800 bg-surface-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Community Experience</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-surface-500">Not official</span>
                </div>
                {[
                  { dot: 'bg-emerald-400', text: '"Start your portfolio early — the case study takes longer than you think."' },
                  { dot: 'bg-rome-400', text: '"They care about your process more than the final output. Document everything."' },
                  { dot: 'bg-amber-400', text: '"Applied twice — the second time I got more specific about impact."' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 mb-3 last:mb-0">
                    <span className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', item.dot)} />
                    <p className="text-sm text-surface-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-surface-800 flex flex-wrap gap-2">
                  {['Application advice', 'Portfolio tips', 'Interview experience', 'What I\'d do differently'].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface-800 text-surface-500">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-emerald-900 bg-emerald-950/30">
                <span className="font-black text-sm px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300">🟢 ACCEPTED</span>
                <div>
                  <p className="text-xs font-semibold text-emerald-300">Product Design Fellowship</p>
                  <p className="text-xs text-emerald-600">Shared by a past applicant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTION ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <Pill>Contribute</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-4">
              Your find could become<br />someone else's next opportunity.
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg max-w-xl mx-auto">
              The knowledge loop: discover → apply → experience → contribute → someone else benefits.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            {[
              { icon: Globe, label: 'Paste a link', desc: 'Share the URL of an opportunity you found' },
              { icon: Share2, label: 'Upload a file', desc: 'Screenshot or PDF of an opportunity flyer' },
              { icon: Briefcase, label: 'Add manually', desc: 'Enter the details yourself' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-2xl border border-surface-200 dark:border-surface-800 p-5 text-center bg-surface-50 dark:bg-surface-900">
                <div className="w-10 h-10 rounded-xl bg-rome-100 dark:bg-rome-900/30 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-rome-600 dark:text-rome-400" />
                </div>
                <p className="text-sm font-black text-surface-900 dark:text-white mb-1">{label}</p>
                <p className="text-xs text-surface-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-0 max-w-lg mx-auto overflow-x-auto pb-1">
            {['Submitted', 'Reviewing', 'Verified', 'Published'].map((stage, i) => (
              <React.Fragment key={stage}>
                <div className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold',
                  stage === 'Verified' || stage === 'Published' ? 'bg-rome-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                )}>{stage}</div>
                {i < 3 && <div className="w-5 h-px bg-surface-200 dark:bg-surface-700 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-surface-400 mt-3">Submissions reviewed before being listed as verified opportunities</p>
        </div>
      </section>

      {/* ── WHO IT'S FOR — bento (Aeline pattern) ────────────────────────── */}
      <section className="py-24 bg-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(ellipse 60% 40% at 80% 100%, #0ea5e9, transparent)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              ROMEfind starts with<br />what you're looking for.
            </h2>
            <p className="text-lg text-surface-400">And helps you discover where else that search could lead.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: 'Looking for your next role?', icon: Briefcase },
              { label: 'Trying to find funding?', icon: DollarSign },
              { label: 'Building your portfolio?', icon: Star },
              { label: 'Exploring research?', icon: Rocket },
              { label: 'Looking for a fellowship?', icon: GraduationCap },
              { label: 'Changing direction?', icon: Compass },
              { label: 'Seeking study abroad?', icon: Globe },
              { label: 'Making an impact?', icon: Heart },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-surface-900 border border-surface-800 hover:border-rome-700 hover:bg-surface-800/80 transition-all group cursor-default">
                <Icon size={14} className="text-rome-400 flex-shrink-0 mt-0.5 group-hover:text-rome-300 transition-colors" />
                <span className="text-xs font-semibold text-surface-400 group-hover:text-surface-200 transition-colors leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <Pill>FAQ</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors"
                  aria-expanded={faqOpen === i}
                >
                  <span className="text-sm font-bold text-surface-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown size={16} className={cn('text-surface-400 flex-shrink-0 transition-transform duration-200', faqOpen === i && 'rotate-180')} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-1 bg-white dark:bg-surface-900">
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — editorial, confident ────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-rome-50 to-white dark:from-rome-950/10 dark:to-surface-950">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-surface-900 dark:text-white tracking-tight mb-6 leading-tight">
            Your path doesn't<br />have to be obvious.
          </h2>
          <p className="text-xl text-surface-500 dark:text-surface-400 mb-10 leading-relaxed">
            Start with what you're looking for.<br className="hidden sm:block" />Discover where else it could take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-rome-500 hover:bg-rome-600 text-white font-black rounded-xl text-base transition-all shadow-lg hover:shadow-xl">
              Explore opportunities <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 hover:border-rome-400 hover:text-rome-600 dark:hover:text-rome-400 font-semibold rounded-xl text-base transition-all">
              See how ROMEfind works
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER — Finexa wordmark watermark pattern ───────────────────── */}
      <footer className="bg-surface-950 border-t border-surface-800 relative overflow-hidden">
        {/* Giant wordmark watermark (Finexa) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <p className="text-[min(22vw,200px)] font-black text-surface-900 leading-none text-center whitespace-nowrap opacity-60 tracking-tight">
            ROMEfind
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <p className="font-black text-xl text-white mb-2">ROME<span className="text-rome-400">find</span></p>
              <p className="text-sm text-surface-500 leading-relaxed">Find what's possible.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-600 mb-4">Product</p>
              <ul className="space-y-2.5">
                {['Discover', 'Explore', 'Compare', 'My Opportunities', 'Learn'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-surface-500 hover:text-rome-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-600 mb-4">Resources</p>
              <ul className="space-y-2.5">
                {['FAQ', 'Support', 'Contact Us', 'Share an Opportunity'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-surface-500 hover:text-rome-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-600 mb-4">Legal</p>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms & Conditions', 'Community Guidelines'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-surface-500 hover:text-rome-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-surface-700">© {new Date().getFullYear()} ROMEfind. All rights reserved.</p>
            <p className="text-xs text-surface-700">Find what's possible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
