import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  Search, ArrowRight, CheckCircle2, Circle, ChevronDown,
  MapPin, Calendar, DollarSign, Clock, ExternalLink, Bookmark,
  BookOpen, Target, Compass, TrendingUp, Users, Award,
  Globe, Briefcase, GraduationCap, Heart, Lightbulb, Rocket,
  Check, ChevronRight, Share2, Star, AlertCircle, X, Menu
} from 'lucide-react';

// ─── Tiny reusable primitives ────────────────────────────────────────────────

const Badge = ({ children, color = 'sky' }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    sky: 'bg-rome-100 text-rome-700 dark:bg-rome-900/30 dark:text-rome-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', colors[color] || colors.sky)}>
      {children}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-rome-600 dark:text-rome-400 mb-3">{children}</p>
);

// ─── Opportunity card mockup ──────────────────────────────────────────────────

const OppCard = ({
  title, org, type, typeColor, deadline, location, funded, compact = false, highlighted = false
}: {
  title: string; org: string; type: string; typeColor: string;
  deadline?: string; location?: string; funded?: boolean; compact?: boolean; highlighted?: boolean;
}) => (
  <div className={cn(
    'rounded-2xl border bg-white dark:bg-surface-900 p-4 shadow-card transition-all',
    highlighted ? 'border-rome-400 ring-2 ring-rome-200 dark:ring-rome-800' : 'border-surface-200 dark:border-surface-800',
    compact ? 'p-3' : 'p-4'
  )}>
    <div className="flex items-start justify-between gap-2 mb-2">
      <Badge color={typeColor}>{type}</Badge>
      {funded && <Badge color="emerald">Fully Funded</Badge>}
    </div>
    <h4 className={cn('font-bold text-surface-900 dark:text-surface-50 leading-snug mb-1', compact ? 'text-sm' : 'text-sm')}>{title}</h4>
    <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">{org}</p>
    {(deadline || location) && (
      <div className="flex flex-wrap gap-3 text-xs text-surface-400 dark:text-surface-500">
        {deadline && <span className="flex items-center gap-1"><Calendar size={11} />{deadline}</span>}
        {location && <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>}
      </div>
    )}
  </div>
);

// ─── Nav ─────────────────────────────────────────────────────────────────────

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Discover', href: '/discover' },
    { label: 'Explore', href: '/explore' },
    { label: 'Compare', href: '/compare' },
    { label: 'Learn', href: '/learn' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled ? 'bg-white/95 dark:bg-surface-950/95 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 shadow-sm' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="font-black text-xl tracking-tight text-surface-900 dark:text-white hover:text-rome-600 dark:hover:text-rome-400 transition-colors">
          ROME<span className="text-rome-500">find</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.label} to={l.href} className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-rome-600 dark:hover:text-rome-400 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link to="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rome-500 hover:bg-rome-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            Explore opportunities <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 px-4 pb-4 space-y-1">
          {links.map(l => (
            <Link key={l.label} to={l.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2 border-t border-surface-100 dark:border-surface-800 mt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800">Sign in</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-xl bg-rome-500 text-white text-sm font-semibold text-center hover:bg-rome-600 transition-colors">
              Explore opportunities
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

// ─── MAIN LANDING PAGE ────────────────────────────────────────────────────────

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [demoSearch, setDemoSearch] = useState('UX internship');

  const DEMO_RESULTS = [
    { title: 'UX Design Internship', org: 'Creative Labs', type: 'Internship', typeColor: 'blue', deadline: 'Oct 12', location: 'Remote', funded: false },
    { title: 'Product Design Fellowship', org: 'Design Foundation', type: 'Fellowship', typeColor: 'purple', deadline: 'Nov 1', location: 'Global', funded: true },
    { title: 'Design Research Programme', org: 'Human-Centred Institute', type: 'Programme', typeColor: 'teal', deadline: 'Oct 28', location: 'UK/Remote', funded: true },
    { title: 'UX & Innovation Competition', org: 'Creative Guild', type: 'Competition', typeColor: 'amber', deadline: 'Oct 20', location: 'Global', funded: false },
    { title: 'Research Grant – User Experience', org: 'Open Research Fund', type: 'Grant', typeColor: 'emerald', deadline: 'Dec 1', location: 'Global', funded: true },
  ];

  const JOURNEY_STEPS = ['Discover', 'Explore', 'Compare', 'Prepare', 'Apply', 'Track', 'Learn', 'Outcome', 'Contribute'];

  const CHECKLIST = [
    { label: 'Confirm eligibility', done: true },
    { label: 'Prepare CV / Resume', done: true },
    { label: 'Prepare portfolio', done: false },
    { label: 'Write personal statement', done: false },
    { label: 'Request recommendation letters', done: false },
    { label: 'Gather supporting documents', done: false },
  ];

  const TRACK_ITEMS = [
    { title: 'Product Design Fellowship', status: 'Preparing', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', next: 'Finish portfolio', deadline: 'Oct 12' },
    { title: 'Global Innovators Grant', status: 'Submitted', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', next: 'Await decision', deadline: 'Nov 5' },
    { title: 'UX Research Programme', status: 'Saved', statusColor: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400', next: 'Review requirements', deadline: 'Dec 1' },
  ];

  const FAQ_ITEMS = [
    { q: 'What is ROMEfind?', a: 'ROMEfind is an opportunity discovery and decision-support platform. It helps you find opportunities — fellowships, scholarships, jobs, grants, internships, programmes, and more — and then helps you explore, compare, prepare, track, and learn from those opportunities.' },
    { q: 'Is ROMEfind only for students?', a: 'No. ROMEfind is for anyone exploring possibilities — students, working professionals, researchers, founders, career changers, and people looking for funding or their next move.' },
    { q: 'What kinds of opportunities can I find?', a: 'Fellowships, scholarships, internships, full-time roles, grants, research positions, programmes, competitions, hackathons, volunteering roles, conferences, and more.' },
    { q: 'Where does ROMEfind get opportunities from?', a: 'Opportunities are sourced from public information and community submissions. All submissions are reviewed before being listed as verified opportunities.' },
    { q: 'Can I submit an opportunity?', a: 'Yes. You can submit an opportunity by sharing a link, uploading a screenshot or PDF, or entering details manually. Submissions are reviewed and verified before being published.' },
    { q: 'Does ROMEfind apply for opportunities for me?', a: 'No. ROMEfind helps you discover, understand, prepare, and track — but the actual application happens directly with the opportunity provider. We link to official sources.' },
    { q: 'Can I compare opportunities?', a: 'Yes. You can add opportunities to a comparison view to see deadlines, funding, location, duration, requirements, and more side by side.' },
    { q: 'Can I track my applications?', a: 'Yes. You can save, track, and update the status of opportunities — from Saved through Considering, Preparing, Applying, Submitted, and Outcome.' },
    { q: 'How does community experience work?', a: 'People who have applied to opportunities can share their experience — what helped, what they would do differently, interview tips, and outcomes. This is clearly labelled as community experience, separate from official opportunity information.' },
    { q: 'How does ROMEfind keep opportunity information current?', a: 'Opportunities can be verified, updated, reported as broken, or marked as expired. We display when an opportunity was last verified and link to the official source.' },
  ];

  return (
    <div className="bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 overflow-x-hidden">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-slate-50 to-white dark:from-surface-900 dark:to-surface-950 overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rome-50 dark:bg-rome-950/40 border border-rome-200 dark:border-rome-800 text-rome-700 dark:text-rome-300 text-xs font-semibold mb-8">
              <span className="flex h-1.5 w-1.5 rounded-full bg-rome-500"></span>
              Now in public beta — free to explore
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-surface-900 dark:text-white leading-[1.05] mb-6">
              Rome wasn't built<br className="hidden sm:block" /> in a day.
              <br />
              <span className="text-rome-500">Neither is your path.</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed mb-10">
              The right opportunity can change what comes next. ROMEfind helps you discover possibilities, explore paths you may have overlooked, compare your options, and take the next step.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-rome-500 hover:bg-rome-600 text-white font-bold rounded-xl text-base transition-colors shadow-md hover:shadow-lg">
                Explore opportunities <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-rome-400 hover:text-rome-600 dark:hover:text-rome-400 font-semibold rounded-xl text-base transition-colors bg-white dark:bg-surface-900">
                See how it works
              </a>
            </div>
          </div>

          {/* Hero product preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-elevated overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/80">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-1 text-xs text-surface-500 dark:text-surface-400 font-mono max-w-xs">
                    romefind.vercel.app/discover
                  </div>
                </div>
              </div>
              {/* Product UI inside browser */}
              <div className="p-5 md:p-8 bg-surface-50 dark:bg-surface-950/50 min-h-[300px]">
                {/* Search bar */}
                <div className="flex items-center gap-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 shadow-sm mb-6 max-w-lg">
                  <Search size={16} className="text-rome-500 flex-shrink-0" />
                  <span className="text-sm text-surface-900 dark:text-surface-100 font-medium flex-1">Product Design Fellowship</span>
                  <kbd className="hidden sm:inline-flex text-xs bg-surface-100 dark:bg-surface-800 text-surface-500 px-2 py-0.5 rounded border border-surface-200 dark:border-surface-700">⌘K</kbd>
                </div>
                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEMO_RESULTS.slice(0, 3).map((r, i) => (
                    <OppCard key={i} {...r} highlighted={i === 0} />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-surface-500">You might also explore:</span>
                  {['Research', 'Grant', 'Competition', 'Programme'].map(t => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rome-50 dark:bg-rome-950/40 text-rome-600 dark:text-rome-400 border border-rome-200 dark:border-rome-800 cursor-pointer hover:bg-rome-100 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 bg-rome-400/5 dark:bg-rome-500/5 rounded-3xl blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>The problem</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight mb-4">
              You might be searching too narrowly.
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              People often search for one type of opportunity and never discover the possibilities sitting right beside it.
            </p>
          </div>

          {/* Interactive demo */}
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 md:p-8 shadow-card">
              {/* Search input demo */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">What are you looking for?</p>
                <div className="flex items-center gap-3 bg-white dark:bg-surface-950 border-2 border-rome-400 dark:border-rome-500 rounded-xl px-4 py-3 shadow-sm">
                  <Search size={16} className="text-rome-500" />
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{demoSearch}</span>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Opportunities found</p>
                {DEMO_RESULTS.map((r, i) => (
                  <div key={i} className={cn(
                    'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white dark:bg-surface-900 transition-all',
                    i === 0 ? 'border-rome-300 dark:border-rome-700' : 'border-surface-200 dark:border-surface-800'
                  )}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge color={r.typeColor}>{r.type}</Badge>
                      <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{r.title}</span>
                    </div>
                    <span className="text-xs text-surface-400 dark:text-surface-500 flex-shrink-0">{r.org}</span>
                  </div>
                ))}
              </div>

              {/* Alternative paths callout */}
              <div className="rounded-xl border border-rome-200 dark:border-rome-800 bg-rome-50 dark:bg-rome-950/30 p-4">
                <p className="text-xs font-bold text-rome-700 dark:text-rome-300 mb-2 flex items-center gap-1.5">
                  <Compass size={13} /> You might also explore
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Fellowships', 'Research', 'Competitions', 'Grants', 'Programmes'].map(t => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-surface-900 border border-rome-300 dark:border-rome-700 text-rome-700 dark:text-rome-300">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-rome-600 dark:text-rome-400">
                  You're exploring internships. These paths can also offer experience, mentorship, research exposure, or portfolio-building opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE STATEMENT ──────────────────────────────────────────── */}
      <section className="py-24 bg-surface-950 dark:bg-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #0ea5e9 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0369a1 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Your search is only<br /> the <span className="text-rome-400">beginning.</span>
            </h2>
            <p className="text-xl text-surface-300 leading-relaxed">
              ROMEfind helps you move beyond finding an opportunity to understanding what it means, preparing for it, and deciding what comes next.
            </p>
          </div>

          {/* Journey steps */}
          <div className="flex flex-wrap items-center justify-center gap-0">
            {JOURNEY_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all',
                    i < 4
                      ? 'bg-rome-500 border-rome-400 text-white shadow-lg shadow-rome-500/20'
                      : 'bg-surface-800 border-surface-700 text-surface-400'
                  )}>
                    {i < 4 ? <Check size={14} /> : <span>{i + 1}</span>}
                  </div>
                  <span className={cn('text-xs font-bold mt-2 text-center', i < 4 ? 'text-rome-300' : 'text-surface-500')}>
                    {step}
                  </span>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <div className={cn('w-8 h-px mx-1 mb-6', i < 3 ? 'bg-rome-600' : 'bg-surface-800')} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCOVER + EXPLORE ───────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Discover & Explore</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
                See more possibilities.
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
                ROMEfind surfaces opportunities matched to your interests, goals, experience, and preferences. You also see paths you might have overlooked.
              </p>
              <ul className="space-y-3 mb-8">
                {['Personalized for your profile and goals', 'Fields you care about — including Public Health, Tech, Climate, Research', 'Alternative paths adjacent to what you\'re exploring', 'Deadlines and fully-funded highlights', 'Remote and location-flexible opportunities'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={15} className="text-rome-500 flex-shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/discover" className="inline-flex items-center gap-2 text-sm font-bold text-rome-600 dark:text-rome-400 hover:text-rome-700 dark:hover:text-rome-300 transition-colors">
                Browse opportunities <ChevronRight size={15} />
              </Link>
            </div>

            {/* Product cards mockup */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-surface-500">For You</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Global Health Leadership Fellowship', org: 'WHO Foundation', type: 'Fellowship', typeColor: 'purple', deadline: 'Nov 15', funded: true },
                  { title: 'UX Research Programme', org: 'Design Council', type: 'Programme', typeColor: 'teal', deadline: 'Oct 30', funded: true },
                  { title: 'Climate Innovation Grant', org: 'Green Future Fund', type: 'Grant', typeColor: 'emerald', deadline: 'Dec 10', funded: true },
                  { title: 'AI for Good Internship', org: 'OpenAI Foundation', type: 'Internship', typeColor: 'blue', deadline: 'Nov 1', funded: false },
                ].map((opp, i) => <OppCard key={i} {...opp} location={i % 2 === 0 ? 'Remote' : 'Global'} />)}
              </div>
              <div className="rounded-xl border border-rome-200 dark:border-rome-800 bg-rome-50 dark:bg-rome-950/20 px-4 py-3 flex items-center gap-2">
                <Compass size={14} className="text-rome-500" />
                <span className="text-xs font-semibold text-rome-700 dark:text-rome-300">You might be overlooking:</span>
                <span className="text-xs text-rome-600 dark:text-rome-400">Competitions · Research Roles · Conferences</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Compare</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
              Don't just find an opportunity.<br /> Understand your options.
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              See opportunities side by side. Compare what matters so you can make an informed decision.
            </p>
          </div>

          {/* Comparison table mockup */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-card">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-surface-200 dark:border-surface-800">
                <div className="p-4 border-r border-surface-100 dark:border-surface-800">
                  <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Criteria</span>
                </div>
                <div className="p-4 border-r border-surface-100 dark:border-surface-800 bg-rome-50 dark:bg-rome-950/20">
                  <Badge color="purple">Fellowship</Badge>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mt-1 leading-tight">Product Design Fellowship</p>
                  <p className="text-xs text-surface-500">Design Foundation</p>
                </div>
                <div className="p-4">
                  <Badge color="teal">Programme</Badge>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mt-1 leading-tight">UX Research Programme</p>
                  <p className="text-xs text-surface-500">Human-Centred Institute</p>
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
                <div key={i} className="grid grid-cols-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
                  <div className="p-3.5 border-r border-surface-100 dark:border-surface-800">
                    <span className="text-xs font-semibold text-surface-500">{row.label}</span>
                  </div>
                  <div className="p-3.5 border-r border-surface-100 dark:border-surface-800 bg-rome-50/50 dark:bg-rome-950/10">
                    <span className="text-xs text-surface-800 dark:text-surface-200">{row.a}</span>
                  </div>
                  <div className="p-3.5">
                    <span className="text-xs text-surface-800 dark:text-surface-200">{row.b}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/compare" className="inline-flex items-center gap-2 px-6 py-3 bg-rome-500 hover:bg-rome-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                Compare opportunities <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREPARE ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Checklist mockup */}
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-card order-last lg:order-first">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <Badge color="purple">Fellowship</Badge>
                  <h4 className="text-sm font-bold text-surface-900 dark:text-white mt-2">Product Design Fellowship</h4>
                  <p className="text-xs text-surface-500">Deadline: October 12</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-rome-500">67%</span>
                  <p className="text-xs text-surface-500">prepared</p>
                </div>
              </div>

              <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 mb-6">
                <div className="h-2 rounded-full bg-rome-500" style={{ width: '67%' }} />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Application preparation</p>
              <div className="space-y-2.5">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.done
                      ? <CheckCircle2 size={16} className="text-rome-500 flex-shrink-0" />
                      : <Circle size={16} className="text-surface-300 dark:text-surface-600 flex-shrink-0" />}
                    <span className={cn('text-sm', item.done ? 'text-surface-500 line-through' : 'text-surface-800 dark:text-surface-200 font-medium')}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Prepare</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
                Know what you're getting into.
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
                Every opportunity comes with a preparation checklist. See what you'll need, check your eligibility, and track your progress toward submitting.
              </p>
              <ul className="space-y-3">
                {['Eligibility check against your profile', 'Step-by-step preparation checklist', 'Deadline tracking and reminders', 'Possible gaps and what to do about them', 'Links to official application pages'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={15} className="text-rome-500 flex-shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARN ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Learn</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
                Learn for what you're trying to pursue.
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-6 leading-relaxed">
                Learning in ROMEfind is connected to real opportunities you're exploring. Not generic courses — specific preparation for a specific goal.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 rounded-xl px-4 py-3 mb-6 border border-surface-200 dark:border-surface-700">
                <Target size={14} className="text-rome-500" />
                Opportunity → Requirement → Skill gap → Learning
              </div>
              <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-rome-600 dark:text-rome-400 hover:text-rome-700 transition-colors">
                Explore learning resources <ChevronRight size={15} />
              </Link>
            </div>

            {/* Learning mockup */}
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-card">
              <Badge color="purple">Fellowship</Badge>
              <h4 className="text-sm font-bold text-surface-900 dark:text-white mt-2 mb-1">Product Design Fellowship</h4>
              <p className="text-xs text-surface-500 mb-5">You may benefit from building these skills:</p>

              <div className="space-y-3 mb-6">
                {['UX Research methods', 'User interviews & synthesis', 'Portfolio case study writing', 'Presentation & communication'].map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rome-400 flex-shrink-0" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{skill}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Your preparation</p>
              <div className="space-y-2">
                {[
                  { skill: 'UX Research', progress: 40 },
                  { skill: 'Portfolio storytelling', progress: 15 },
                  { skill: 'User interviews', progress: 60 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 w-36 flex-shrink-0">{item.skill}</span>
                    <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-rome-400" style={{ width: `${item.progress}%` }} />
                    </div>
                    <Link to="/learn" className="text-xs font-bold text-rome-500 hover:text-rome-600 transition-colors flex-shrink-0">Learn</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACK ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Track</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
              Keep moving after you find it.
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              ROMEfind stays useful after discovery. Track every opportunity through its full lifecycle.
            </p>
          </div>

          {/* Status bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {['Saved', 'Considering', 'Preparing', 'Applying', 'Submitted', 'Outcome'].map((stage, i) => (
                <React.Fragment key={stage}>
                  <div className={cn(
                    'flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold transition-all',
                    i <= 2 ? 'bg-rome-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
                  )}>{stage}</div>
                  {i < 5 && <div className={cn('w-4 h-px flex-shrink-0', i < 2 ? 'bg-rome-400' : 'bg-surface-200 dark:bg-surface-700')} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Track items */}
          <div className="max-w-3xl mx-auto space-y-3">
            {TRACK_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', item.statusColor)}>{item.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{item.title}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-surface-500">Next: <span className="font-semibold text-surface-700 dark:text-surface-300">{item.next}</span></p>
                    <p className="text-xs text-surface-400 mt-0.5 flex items-center gap-1 justify-end"><Calendar size={10} /> {item.deadline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY OUTCOMES ───────────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Community card mockup */}
            <div className="space-y-4">
              {/* Community experience card */}
              <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Community Experience</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">Not official</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xs font-black mt-0.5">●</span>
                    <p className="text-sm text-surface-700 dark:text-surface-300">"Start your portfolio early — the case study takes longer than you think."</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rome-500 text-xs font-black mt-0.5">●</span>
                    <p className="text-sm text-surface-700 dark:text-surface-300">"They ask about your process more than the final output. Document everything."</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 text-xs font-black mt-0.5">●</span>
                    <p className="text-sm text-surface-700 dark:text-surface-300">"Applied twice — the second time I got more specific about impact."</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 flex flex-wrap gap-2">
                  {['Application advice', 'Portfolio tips', 'Interview experience', 'Timeline', 'What I\'d do differently'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Outcome card */}
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">🟢 ACCEPTED</span>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Product Design Fellowship</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Shared by a past applicant</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SectionLabel>Outcomes & Community</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
                Someone has been through it before.
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-6 leading-relaxed">
                People who have applied share what helped, what they would do differently, and what they wish they knew. This is community experience — clearly separate from official information.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                  <Award size={15} className="text-rome-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-surface-700 dark:text-surface-300">Official opportunity information</p>
                    <p className="text-xs text-surface-500">From the organization or source</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-rome-50 dark:bg-rome-950/20 border border-rome-200 dark:border-rome-800">
                  <Users size={15} className="text-rome-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rome-700 dark:text-rome-300">Community experience</p>
                    <p className="text-xs text-rome-600/70 dark:text-rome-400/70">Shared by people who've been through it</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                  <BookOpen size={15} className="text-surface-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-surface-700 dark:text-surface-300">Your private notes</p>
                    <p className="text-xs text-surface-500">Only visible to you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTION ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <SectionLabel>Contribute</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white mb-4">
              Your find could become someone else's next opportunity.
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              The knowledge loop: someone discovers → applies → experiences → contributes → someone else benefits.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Globe, label: 'Paste a link', desc: 'Share the URL of an opportunity you found' },
                { icon: Share2, label: 'Upload a file', desc: 'Screenshot or PDF of an opportunity flyer' },
                { icon: Briefcase, label: 'Add manually', desc: 'Enter the details yourself' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-rome-100 dark:bg-rome-900/30 flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} className="text-rome-600 dark:text-rome-400" />
                  </div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mb-1">{label}</p>
                  <p className="text-xs text-surface-500">{desc}</p>
                </div>
              ))}
            </div>

            {/* Verification flow */}
            <div className="flex items-center justify-center gap-0 overflow-x-auto">
              {['Submitted', 'Reviewing', 'Verified', 'Published'].map((stage, i) => (
                <React.Fragment key={stage}>
                  <div className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold',
                    stage === 'Verified' || stage === 'Published' ? 'bg-rome-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                  )}>{stage}</div>
                  {i < 3 && <div className="w-6 h-px bg-surface-200 dark:bg-surface-700 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-xs text-surface-500 mt-3">Submissions are reviewed before being listed as verified opportunities</p>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-950 dark:bg-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 80%, #0ea5e9 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              ROMEfind starts with what you're looking for.
            </h2>
            <p className="text-lg text-surface-300">
              And helps you discover where else that search could lead.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'Looking for your next role?', icon: Briefcase },
              { label: 'Trying to find funding?', icon: DollarSign },
              { label: 'Building your portfolio?', icon: Star },
              { label: 'Exploring research?', icon: Rocket },
              { label: 'Looking for a fellowship?', icon: GraduationCap },
              { label: 'Changing direction?', icon: Compass },
              { label: 'Seeking study abroad?', icon: Globe },
              { label: 'Making impact?', icon: Heart },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-900 border border-surface-800 hover:border-rome-700 hover:bg-surface-800 transition-all group">
                <Icon size={15} className="text-rome-400 flex-shrink-0 group-hover:text-rome-300 transition-colors" />
                <span className="text-sm font-semibold text-surface-300 group-hover:text-white transition-colors">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white">Common questions</h2>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  aria-expanded={faqOpen === i}
                >
                  <span className="text-sm font-bold text-surface-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown size={16} className={cn('text-surface-400 flex-shrink-0 transition-transform duration-200', faqOpen === i && 'rotate-180')} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 bg-white dark:bg-surface-900">
                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-b from-rome-50 to-white dark:from-rome-950/20 dark:to-surface-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-surface-900 dark:text-white mb-6">
            Your path doesn't have<br /> to be obvious.
          </h2>
          <p className="text-xl text-surface-600 dark:text-surface-400 mb-10 leading-relaxed">
            Start with what you're looking for.<br className="hidden sm:block" /> Discover where else it could take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-rome-500 hover:bg-rome-600 text-white font-black rounded-xl text-base transition-colors shadow-lg hover:shadow-xl">
              Explore opportunities <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-rome-400 hover:text-rome-600 dark:hover:text-rome-400 font-semibold rounded-xl text-base transition-colors bg-white dark:bg-surface-900">
              See how ROMEfind works
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-surface-950 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <p className="font-black text-xl text-white mb-2">ROME<span className="text-rome-400">find</span></p>
              <p className="text-sm text-surface-400 leading-relaxed">Find what's possible.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-4">Product</p>
              <ul className="space-y-2.5">
                {['Discover', 'Explore', 'Compare', 'My Opportunities', 'Learn'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-surface-400 hover:text-rome-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-4">Resources</p>
              <ul className="space-y-2.5">
                {['FAQ', 'Support', 'Contact Us', 'Share an Opportunity'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-4">Trust & Legal</p>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms & Conditions', 'Community Guidelines'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-600">© {new Date().getFullYear()} ROMEfind. All rights reserved.</p>
            <p className="text-xs text-surface-600">Find what's possible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
