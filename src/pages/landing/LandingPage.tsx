import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  Search, ArrowRight, CheckCircle2, Circle, ChevronDown,
  MapPin, Calendar, DollarSign, Clock, ExternalLink,
  Compass, Users, Award, Globe, Briefcase, GraduationCap,
  Heart, Lightbulb, Rocket, Check, ChevronRight,
  Star, BookOpen, Target, TrendingUp, Zap, X, Menu,
  ArrowUpRight, Sparkles, BarChart2, Share2, ShieldCheck, CheckCircle
} from 'lucide-react';

// ─── Pill label used above section headings (Aeline / WizardUI pattern) ─────
const Pill = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4',
    light
      ? 'bg-white/15 text-white border border-white/25 shadow-xs backdrop-blur-sm'
      : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700'
  )}>
    <span className={cn('w-1.5 h-1.5 rounded-full', light ? 'bg-[#bef264]' : 'bg-rome-500')} />
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
    lime: 'bg-[#bef264] text-surface-950 font-bold',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight', map[color] || map.sky)}>
      {children}
    </span>
  );
};

// ─── Sticky Nav (Aeline Style) ──────────────────────────────────────────────
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
      scrolled 
        ? 'bg-white/95 dark:bg-surface-950/95 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-800/80 shadow-xs' 
        : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between" aria-label="Main navigation">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
          <span className={cn(
            "font-black text-xl tracking-tight transition-colors",
            scrolled ? "text-surface-900 dark:text-white" : "text-white"
          )}>
            ROME<span className={scrolled ? "text-rome-500" : "text-[#bef264]"}>find</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className={cn(
          "hidden md:flex items-center gap-8 text-sm font-semibold transition-colors",
          scrolled ? "text-surface-600 dark:text-surface-300" : "text-white/90"
        )}>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
          <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
          <Link to="/learn" className="hover:text-white transition-colors">Learn</Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/login" 
            className={cn(
              "text-sm font-bold px-3.5 py-2 transition-colors",
              scrolled ? "text-surface-600 hover:text-surface-900 dark:text-surface-300" : "text-white hover:text-white/80"
            )}
          >
            Sign in
          </Link>
          <Link 
            to="/signup"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#bef264] hover:bg-[#a3e635] text-surface-950 text-xs font-black uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started <ArrowUpRight size={14} className="stroke-[3]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-xl text-white focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface-900/98 backdrop-blur-xl border-b border-surface-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          {['Discover', 'Explore', 'Compare', 'Learn', 'About'].map(l => (
            <Link 
              key={l} 
              to={l === 'About' ? '/about' : `/${l.toLowerCase()}`} 
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-base font-bold text-white/90 hover:text-[#bef264] transition-colors border-b border-surface-800/80"
            >
              {l}
            </Link>
          ))}
          <div className="pt-2 space-y-2.5">
            <Link 
              to="/login" 
              onClick={() => setMenuOpen(false)} 
              className="block py-3 text-center text-sm font-bold text-white border border-surface-700 rounded-xl"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              onClick={() => setMenuOpen(false)} 
              className="block py-3 text-center text-sm font-black text-surface-950 bg-[#bef264] rounded-xl"
            >
              Get Started ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Provider Logos Marquee ──────────────────────────────────────────────────
const PARTNERS = [
  { name: 'Google', category: 'Technology' },
  { name: 'Mozilla', category: 'Open Source' },
  { name: 'WHO', category: 'Global Health' },
  { name: 'UNICEF', category: 'International' },
  { name: 'Figma', category: 'Design' },
  { name: 'Canva', category: 'Creativity' },
  { name: 'CERN', category: 'Research' },
  { name: 'Y Combinator', category: 'Ventures' },
  { name: 'Gates Foundation', category: 'Philanthropy' },
  { name: 'Datadog', category: 'Cloud' },
  { name: 'Wikimedia', category: 'Knowledge' },
  { name: 'Khan Academy', category: 'Education' }
];

const LogoMarquee = () => (
  <div className="py-7 bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800/80 overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 mb-3 text-center">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-400 dark:text-surface-500">
        Verified opportunities curated directly from global leaders
      </span>
    </div>
    <div className="flex gap-12 items-center animate-[marquee_28s_linear_infinite] whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
      {[...PARTNERS, ...PARTNERS].map((p, i) => (
        <div key={i} className="flex items-center gap-2.5 flex-shrink-0 text-surface-700 dark:text-surface-300 font-extrabold text-sm tracking-tight">
          <div className="w-2 h-2 rounded-full bg-rome-400/60" />
          <span>{p.name}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-900 text-surface-400">
            {p.category}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ─── LANDING PAGE COMPONENT ──────────────────────────────────────────────────
export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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

  const CHECKLIST = [
    { label: 'Confirm eligibility criteria', done: true },
    { label: 'Prepare CV & Experience summaries', done: true },
    { label: 'Draft tailored personal statement', done: false },
    { label: 'Request recommendation letters', done: false },
    { label: 'Review official application guidelines', done: false }
  ];

  return (
    <div className="bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 overflow-x-hidden font-sans">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.6 } 50% { opacity: 0.9 } }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .card-perspective-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
      `}</style>

      <Nav />

      {/* ── 1. HERO — AELINE RADIANT SKY BLUE + 3D CURVED CAROUSEL ─────────── */}
      <section className="relative min-h-[96vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1d63ed] via-[#2a7bf8] to-[#4096ff] pt-24 pb-12 text-white">
        {/* Soft volumetric atmospheric cloud layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Cloud Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/20 rounded-full blur-3xl opacity-70" />
          
          {/* Atmospheric Horizon Light */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white/30 via-white/10 to-transparent pointer-events-none" />
          
          {/* Soft Left Cloud Accent */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-white/25 rounded-full blur-2xl opacity-60" />
          
          {/* Soft Right Cloud Accent */}
          <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-3xl opacity-70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full text-center flex-1 flex flex-col justify-center items-center pt-8 pb-10">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6 drop-shadow-sm">
            Discover your future with<br className="hidden sm:block" />
            <span className="text-white">clarity and strategy</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-xs font-medium">
            We help ambitious individuals unlock opportunities and expand their potential through verified global data and intelligent multi-factor matching.
          </p>

          {/* Action Button Row (Aeline Dual Buttons) */}
          <div className="flex flex-row items-center justify-center gap-3.5 mb-14">
            <Link 
              to="/discover"
              className="inline-flex items-center justify-center px-6 py-3 bg-surface-950/40 hover:bg-surface-950/60 text-white font-bold text-xs uppercase tracking-wider rounded-full backdrop-blur-md border border-white/20 transition-all shadow-sm hover:scale-[1.02]"
            >
              View Catalog
            </Link>
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#bef264] hover:bg-[#a3e635] text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started <ArrowUpRight size={15} className="stroke-[3]" />
            </Link>
          </div>

          {/* ── 3D CURVED CAROUSEL OF 5 APP CARDS (Aeline Exact Structure) ─── */}
          <div className="w-full max-w-6xl mx-auto px-4 card-perspective-container">
            <div className="flex items-center justify-center gap-3 md:gap-5 overflow-x-auto lg:overflow-visible py-4 no-scrollbar">
              
              {/* Card 1 — Left Outer (Tilted Inward) */}
              <div 
                className="w-52 sm:w-60 flex-shrink-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl rounded-2xl p-4 text-left shadow-2xl border border-white/40 dark:border-surface-700 transition-all duration-300 hover:scale-105"
                style={{ 
                  transform: 'rotateY(16deg) translateZ(-20px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">Fellowship</span>
                  <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">98% Match</span>
                </div>
                <h4 className="text-xs font-black text-surface-900 dark:text-white leading-snug mb-1">Product Design Fellowship</h4>
                <p className="text-[11px] text-surface-500 mb-3 font-medium">Design Foundation · Global</p>
                <div className="pt-2 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-[10px] text-surface-400 font-semibold">
                  <span>Full Funding</span>
                  <span>Closes Nov 15</span>
                </div>
              </div>

              {/* Card 2 — Left Inner (Subtle Angle) */}
              <div 
                className="w-56 sm:w-64 flex-shrink-0 bg-surface-950/95 backdrop-blur-xl rounded-2xl p-5 text-left text-white shadow-2xl border border-surface-800 transition-all duration-300 hover:scale-105"
                style={{ 
                  transform: 'rotateY(8deg) translateZ(-5px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-center justify-between mb-3 text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                  <span>Performance</span>
                  <span className="text-[#bef264]">Active</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">93+</div>
                <p className="text-xs text-surface-400 mb-4 font-medium">Verified opportunities curated directly from top organizations.</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-surface-900 p-2.5 rounded-xl border border-surface-800">
                  <div>
                    <span className="text-surface-500 block">Orgs</span>
                    <span className="font-bold text-white">44 Global</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">Jobs</span>
                    <span className="font-bold text-[#bef264]">22 Verified</span>
                  </div>
                </div>
              </div>

              {/* Card 3 — Center Hero Card (Elevated & Glowing Hub) */}
              <div 
                className="w-60 sm:w-72 flex-shrink-0 bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl p-6 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-white/60 transition-all duration-300 scale-105 z-20"
                style={{ 
                  transform: 'translateZ(30px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-4 shadow-inner">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <h3 className="text-base font-black tracking-tight mb-1.5">Decision Engine</h3>
                <p className="text-xs text-sky-100 font-medium leading-relaxed mb-4">
                  Multi-factor precision scoring based on your skills, goals & eligibility.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-surface-900 text-[11px] font-black shadow-xs">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span>100% Verified Sources</span>
                </div>
              </div>

              {/* Card 4 — Right Inner (Subtle Angle) */}
              <div 
                className="w-56 sm:w-64 flex-shrink-0 bg-surface-900/95 backdrop-blur-xl rounded-2xl p-5 text-left text-white shadow-2xl border border-surface-800 transition-all duration-300 hover:scale-105"
                style={{ 
                  transform: 'rotateY(-8deg) translateZ(-5px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#bef264]" />
                  <span className="text-[10px] font-bold text-surface-300 uppercase tracking-wider">Multi-Path Discovery</span>
                </div>
                <p className="text-xs font-semibold text-surface-200 leading-relaxed mb-4">
                  Combines Fellowships, Grants, Internships, and Research alongside traditional jobs.
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-surface-400">
                    <span>Direct Jobs</span>
                    <span className="text-white font-bold">24%</span>
                  </div>
                  <div className="w-full bg-surface-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#bef264] h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              {/* Card 5 — Right Outer (Tilted Inward) */}
              <div 
                className="w-52 sm:w-60 flex-shrink-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl rounded-2xl p-4 text-left shadow-2xl border border-white/40 dark:border-surface-700 transition-all duration-300 hover:scale-105"
                style={{ 
                  transform: 'rotateY(-16deg) translateZ(-20px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">Remote Job</span>
                  <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
                <h4 className="text-xs font-black text-surface-900 dark:text-white leading-snug mb-1">Frontend Systems Engineer</h4>
                <p className="text-[11px] text-surface-500 mb-3 font-medium">Mozilla · 100% Remote</p>
                <div className="pt-2 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-[10px] text-surface-400 font-semibold">
                  <span>Competitive</span>
                  <span>Direct Apply ↗</span>
                </div>
              </div>

            </div>
          </div>

          {/* Social Proof Star Rating below the 3D Cards */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90">
            <div className="flex text-[#bef264] text-xs">
              {'★'.repeat(5)}
            </div>
            <span>Rated <strong>4.9/5</strong> by 1,200+ applicants worldwide</span>
          </div>

        </div>
      </section>

      {/* ── 2. LOGO MARQUEE BANNER ────────────────────────────────────────── */}
      <LogoMarquee />

      {/* ── 3. ABOUT US / BENTO GRID & METRICS (Aeline Pattern) ─────────── */}
      <section id="about" className="py-24 md:py-32 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Pill>• About ROMEfind</Pill>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-[1.15]">
              A global discovery engine dedicated to building{' '}
              <span className="inline-flex items-center align-middle mx-1 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-sm font-extrabold border border-sky-300 dark:border-sky-800">
                <span className="w-2 h-2 rounded-full bg-sky-500 mr-1.5 animate-pulse" />
                smarter
              </span>{' '}
              and{' '}
              <span className="inline-flex items-center align-middle mx-1 px-2.5 py-0.5 rounded-full bg-[#bef264]/40 dark:bg-[#bef264]/20 text-surface-900 dark:text-[#bef264] text-sm font-black border border-[#bef264] dark:border-[#bef264]/40">
                <span className="w-2 h-2 rounded-full bg-[#bef264] mr-1.5" />
                more adaptive
              </span>{' '}
              career paths
            </h2>
          </div>

          {/* Bento Grid Layout (Exact Aeline Composition) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Card 1 (Left 5 Cols) — Photo with High-Contrast Stat Overlay */}
            <div className="lg:col-span-5 rounded-3xl overflow-hidden relative min-h-[380px] bg-gradient-to-br from-sky-600 via-sky-700 to-surface-950 text-white p-7 flex flex-col justify-between shadow-xl group border border-sky-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent z-10" />
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 mix-blend-overlay"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80')` }}
              />
              <div className="relative z-20 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  ROMEfind · Verified
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
              </div>
              <div className="relative z-20 pt-20">
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">93+</div>
                <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-sm">
                  Curated and verified opportunities from leading global tech, research, health, and policy institutions.
                </p>
              </div>
            </div>

            {/* Bento Card 2 (Middle 4 Cols) — Accuracy Metric + Quote */}
            <div className="lg:col-span-4 rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-7 flex flex-col justify-between shadow-sm hover:border-surface-300 dark:hover:border-surface-700 transition-colors">
              <div>
                <span className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider block mb-2">
                  Commitment to accuracy
                </span>
                <div className="text-4xl sm:text-5xl font-black text-surface-900 dark:text-white tracking-tight mb-6">
                  100%
                </div>
              </div>
              <div>
                <div className="flex items-center -space-x-2 mb-4">
                  {['men/32', 'women/44', 'men/75', 'women/68'].map((id, idx) => (
                    <img 
                      key={idx} 
                      src={`https://randomuser.me/api/portraits/thumb/${id}.jpg`} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-900 shadow-xs" 
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-rome-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-surface-900 shadow-xs">
                    +1k
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 italic leading-relaxed font-medium">
                  "Their multi-factor matching completely reshaped how we discover opportunities. It's efficient, intelligent, and seamless."
                </p>
              </div>
            </div>

            {/* Bento Card 3 & 4 (Right 3 Cols) — Vibrant Neon Lime Card & Dark Pill */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              
              {/* Neon Lime Data Card */}
              <div className="flex-1 rounded-3xl bg-[#bef264] text-surface-950 p-6 flex flex-col justify-between shadow-lg border border-[#a3e635] hover:scale-[1.02] transition-transform">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-surface-900/70 block mb-1">
                    Verified Coverage
                  </span>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-surface-950 mb-2">
                    93+ Opps
                  </div>
                </div>
                <p className="text-xs font-bold text-surface-900/90 leading-relaxed">
                  Analyzed directly from official provider sources to power smarter decision pathways.
                </p>
              </div>

              {/* Dark Pill / Metrics Card */}
              <div className="rounded-3xl bg-surface-950 text-white p-5 border border-surface-800 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block">Continents</span>
                    <span className="text-xl font-black text-white">6+ Global</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block">Fully Funded</span>
                    <span className="text-xl font-black text-[#bef264]">70%+</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 4. SERVICES & INTELLIGENCE — 4-COLUMN CARDS ROW (Aeline Pattern) ── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* Section Header with CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <Pill>• Platform Services</Pill>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight max-w-2xl">
                Comprehensive discovery<br />and intelligent innovation
              </h2>
              <p className="mt-4 text-base sm:text-lg text-surface-500 dark:text-surface-400 max-w-xl leading-relaxed">
                Whether you're optimizing your applications today or building for tomorrow, we help you discover and apply with confidence.
              </p>
            </div>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface-900 hover:bg-surface-800 dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md self-start md:self-auto"
            >
              Get Started <ArrowUpRight size={14} className="stroke-[3]" />
            </Link>
          </div>

          {/* 4-Card Row (3 Feature Cards + 1 High Quality Visual Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Service 1 */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">Opportunity AI</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  We help you discover tailored matches for your field, skills, and funding requirements without clutter.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-rome-600 dark:text-rome-400">
                <span>Multi-factor fit</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 2 */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">Multi-Path Strategy</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  Expand your opportunities with parallel fellowships, research positions, grants, and programmes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-rome-600 dark:text-rome-400">
                <span>Alternative avenues</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 3 */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart2 size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">Data & Insights</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  We turn opportunity requirements into clear preparation milestones using verified criteria and historical data.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-rome-600 dark:text-rome-400">
                <span>Decision comparison</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 4 — Visual Photo Card */}
            <div className="rounded-3xl overflow-hidden relative min-h-[260px] shadow-sm border border-surface-200 dark:border-surface-800 group">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Applicants collaborating" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#bef264] mb-1">Collaborative Community</span>
                <p className="text-xs font-bold leading-snug">
                  Learn from real application experiences and outcomes shared by peers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. NEARO PRODUCT UI PREVIEW & WIDGETS ──────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Pill>• Platform Preview</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight">
              Features designed for your success
            </h2>
            <p className="mt-3 text-base text-surface-500 dark:text-surface-400">
              Explore the decision tools built to keep your opportunity discovery organized and on track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Widget 1: Task Checklist */}
            <div className="rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-surface-400 uppercase tracking-wider">
                  <span>Application Tasks</span>
                  <span className="text-emerald-500">2 of 4 done</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-3 rounded-2xl border border-surface-200/80 dark:border-surface-800 flex items-center gap-2.5 shadow-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-surface-800 dark:text-surface-200 line-through">Confirm Eligibility</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-3 rounded-2xl border border-surface-200/80 dark:border-surface-800 flex items-center gap-2.5 shadow-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-surface-800 dark:text-surface-200 line-through">Draft Statement</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-3 rounded-2xl border border-rome-300 dark:border-rome-700 flex items-center gap-2.5 shadow-xs">
                  <Circle size={16} className="text-rome-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-surface-900 dark:text-white">Request Recommendations</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-surface-900 dark:text-white mb-1">Task Management</h4>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Stay on top of every requirement, from eligibility checks to final submission.
                </p>
              </div>
            </div>

            {/* Widget 2: Countdown & Deadline Timer */}
            <div className="rounded-3xl bg-gradient-to-b from-sky-500 to-sky-600 text-white p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-4 backdrop-blur-sm">
                  <Clock size={12} />
                  <span>Closing Soon</span>
                </div>
                <h4 className="text-sm font-black leading-snug mb-4">WHO Global Health Internship</h4>
                
                {/* Glassmorphic Countdown Blocks */}
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 border border-white/30">
                    <span className="text-xl font-black block leading-tight">24</span>
                    <span className="text-[9px] uppercase tracking-wider text-sky-100 font-bold">Days</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 border border-white/30">
                    <span className="text-xl font-black block leading-tight">08</span>
                    <span className="text-[9px] uppercase tracking-wider text-sky-100 font-bold">Hours</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 border border-white/30">
                    <span className="text-xl font-black block leading-tight">45</span>
                    <span className="text-[9px] uppercase tracking-wider text-sky-100 font-bold">Mins</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-white mb-1">Deadline Tracking</h4>
                <p className="text-xs text-sky-100 leading-relaxed font-medium">
                  Never miss an application cycle with automated alerts and time tracking.
                </p>
              </div>
            </div>

            {/* Widget 3: Multi-Factor Match Engine */}
            <div className="rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-surface-400 uppercase tracking-wider">
                  <span>Match Signals</span>
                  <span className="text-sky-500 font-black">96% Fit</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-2.5 rounded-xl border border-surface-200/80 dark:border-surface-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-surface-700 dark:text-surface-300">Field Domain</span>
                  <span className="font-bold text-emerald-500">✓ Strong (+35)</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-2.5 rounded-xl border border-surface-200/80 dark:border-surface-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-surface-700 dark:text-surface-300">Modality (Remote)</span>
                  <span className="font-bold text-emerald-500">✓ 100% (+10)</span>
                </div>
                <div className="bg-white dark:bg-surface-950 p-2.5 rounded-xl border border-surface-200/80 dark:border-surface-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-surface-700 dark:text-surface-300">Full Funding</span>
                  <span className="font-bold text-emerald-500">✓ Stipend (+5)</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-surface-900 dark:text-white mb-1">Decision Intelligence</h4>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Transparent scoring signals show you exactly why an opportunity fits your goals.
                </p>
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
      <section id="faq" className="py-24 bg-white dark:bg-surface-950 scroll-mt-12">
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
            <Link to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 hover:border-rome-400 hover:text-rome-600 dark:hover:text-rome-400 font-semibold rounded-xl text-base transition-all">
              About ROMEfind
            </Link>
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

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 sm:col-span-3 md:col-span-1">
              <p className="font-black text-xl text-white mb-2">ROME<span className="text-rome-400">find</span></p>
              <p className="text-sm text-surface-400 leading-relaxed mb-3">Find what's possible.</p>
              <p className="text-xs text-surface-500 leading-relaxed">Opportunity discovery and decision support platform.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Product</p>
              <ul className="space-y-2.5">
                {['Discover', 'Explore', 'Compare', 'My Opportunities', 'Learn'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-surface-400 hover:text-rome-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">About</p>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">About ROMEfind</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Help</p>
              <ul className="space-y-2.5">
                <li><a href="#faq" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">FAQ</a></li>
                <li><a href="mailto:romefind.support@gmail.com" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">Support</a></li>
                <li><a href="mailto:romefind.support@gmail.com" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Trust</p>
              <ul className="space-y-2.5">
                <li><Link to="/community-guidelines" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">Community Guidelines</Link></li>
                <li><Link to="/privacy" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-surface-400 hover:text-rome-400 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-surface-500">© {new Date().getFullYear()} ROMEfind. All rights reserved.</p>
            <p className="text-xs text-surface-500">Rome wasn't built in a day. Neither is your path.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
