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

// ─── SURFBALI STYLE EXPERIENCE LEVEL SWITCHER ────────────────────────────────
const LEVEL_DATA = [
  {
    id: 'newbie',
    tag: 'first-time',
    title: 'Total Newbie',
    subtitle: 'Student / Transitioning',
    emoji: '🌱',
    highlight: 'Foundation Fellowships & Curated Internships',
    desc: 'You’re taking your first steps and want to discover accessible entry points with zero gatekeeping.',
    fitScore: 98,
    sampleOrg: 'WHO / Mozilla Foundation',
    funding: 'Fully Funded',
    action: 'Explore Beginner Opportunities'
  },
  {
    id: 'learning',
    tag: 'beginner',
    title: 'Still Learning',
    subtitle: 'Early Career / Graduate',
    emoji: '🚀',
    highlight: 'Funded Research Roles & Open-Source Fellowships',
    desc: 'You have foundational knowledge and want to build a standout portfolio and international credibility.',
    fitScore: 96,
    sampleOrg: 'Figma / Wikimedia Foundation',
    funding: 'Competitive Stipend',
    action: 'Explore Early Career Paths'
  },
  {
    id: 'confident',
    tag: 'intermediate',
    title: 'Pretty Confident',
    subtitle: '2–4 Yrs Experience',
    emoji: '⚡',
    highlight: 'Specialized Fellowships & Accelerator Grants',
    desc: 'You have solid execution capability and are targeting competitive global awards and high-impact roles.',
    fitScore: 94,
    sampleOrg: 'Canva / Gates Foundation',
    funding: '$45,000+ Grant',
    action: 'Explore Mid-Level Paths'
  },
  {
    id: 'pro',
    tag: 'advanced',
    title: 'Already a Pro',
    subtitle: 'Senior / Lead / PhD',
    emoji: '👑',
    highlight: 'Principal Awards & Global Leadership Grants',
    desc: 'You lead projects and seek prestigious international research grants, residencies, and leadership programs.',
    fitScore: 99,
    sampleOrg: 'CERN / OpenAI Fellowship',
    funding: 'Full Grant + Travel',
    action: 'Explore Advanced Opportunities'
  },
];

const ExperienceLevelSwitcher = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = LEVEL_DATA[activeIdx];

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid (SurfBali Pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEVEL_DATA.map((lvl, idx) => {
          const isSelected = activeIdx === idx;
          return (
            <button
              key={lvl.id}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "rounded-3xl p-6 text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px] cursor-pointer",
                isSelected
                  ? "bg-white dark:bg-surface-900 border-2 border-rome-500 shadow-xl scale-[1.02] ring-4 ring-rome-100 dark:ring-rome-950/60"
                  : "bg-white/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 hover:bg-white dark:hover:bg-surface-900 shadow-xs"
              )}
            >
              <div className="flex items-center justify-between w-full mb-6">
                <div className="w-10 h-10 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-lg shadow-xs">
                  {lvl.emoji}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full",
                  isSelected
                    ? "bg-[#bef264] text-surface-950"
                    : "bg-surface-100 dark:bg-surface-800 text-surface-500"
                )}>
                  {lvl.tag}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-surface-900 dark:text-white tracking-tight leading-snug">
                  {lvl.title}
                </h4>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 font-medium">
                  {lvl.subtitle}
                </p>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rome-400 via-rome-500 to-[#bef264]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Detail Card Below Active Tab */}
      <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-300">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rome-500 bg-rome-50 dark:bg-rome-950/60 px-3 py-0.5 rounded-full border border-rome-200 dark:border-rome-800">
              Matched Pathway
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
              {active.fitScore}% Match Fit
            </span>
          </div>
          <h3 className="text-xl font-black text-surface-900 dark:text-white tracking-tight mb-2">
            {active.highlight}
          </h3>
          <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed font-medium">
            {active.desc} Includes verified opportunities from <strong className="text-surface-900 dark:text-white">{active.sampleOrg}</strong> with <strong className="text-rome-500">{active.funding}</strong>.
          </p>
        </div>

        <Link
          to="/discover"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#bef264] hover:bg-[#a3e635] text-surface-950 text-xs font-black uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg flex-shrink-0"
        >
          {active.action} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// ─── IMAGE 3 STYLE INTERACTIVE WORKSPACE WIDGET ─────────────────────────────
const InteractiveWorkspaceWidget = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'UX Portfolio Case Study',
      time: 'Tomorrow',
      timeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      status: 'Incoming',
      statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      desc: 'Highlight end-to-end design research & user synthesis for WHO Fellowship.',
      collab: 'Collaborate with Miguel, Jhon, Hane',
      completed: true,
      avatars: ['men/32', 'women/44', 'men/75']
    },
    {
      id: 2,
      title: 'Personal Statement & Motivation',
      time: 'Today',
      timeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      status: 'Ongoing',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      desc: 'Align research goals with Mozilla open source accessibility initiatives.',
      collab: 'Review with Elena, Sarah, Alex',
      completed: false,
      avatars: ['women/68', 'men/22', 'women/12']
    },
    {
      id: 3,
      title: 'Academic Transcripts & Verification',
      time: 'Yesterday',
      timeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      status: 'Verified',
      statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      desc: 'Official registrar certified documents uploaded and verified.',
      collab: 'Verified by University Registrar',
      completed: true,
      avatars: ['men/41', 'women/55']
    }
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 md:p-8 shadow-xl">
      {/* Top Header Row (Exact Image 3 Style) */}
      <div className="flex items-center justify-between pb-5 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-surface-900 dark:text-white" />
          <h3 className="text-base font-black text-surface-900 dark:text-white tracking-tight">
            Application Milestones
          </h3>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-bold text-surface-800 dark:text-surface-200 shadow-xs hover:bg-surface-100 transition-colors">
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Filter Tabs (Task: All, Time: All, Status: All) */}
      <div className="flex items-center gap-2 pt-4 pb-4 overflow-x-auto">
        {['Task: All', 'Time: All', 'Status: Active', 'Verified'].map((filter, i) => (
          <span 
            key={i} 
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer",
              i === 0 
                ? "bg-white dark:bg-surface-800 text-surface-900 dark:text-white border-surface-300 dark:border-surface-700 shadow-xs" 
                : "bg-surface-100 dark:bg-surface-800/60 text-surface-500 border-transparent hover:border-surface-200"
            )}
          >
            {filter}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-5 bg-white dark:bg-surface-950 p-3.5 rounded-2xl border border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-surface-600 dark:text-surface-400">Preparation Progress</span>
          <span className="text-rome-500 font-extrabold">{progressPercent}% Ready</span>
        </div>
        <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rome-500 to-[#bef264] rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Tasks Stack (Exact Image 3 iOS/macOS card style) */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 bg-white dark:bg-surface-950 cursor-pointer group shadow-xs",
              task.completed 
                ? "border-surface-200 dark:border-surface-800/80 opacity-80" 
                : "border-rome-300 dark:border-rome-800 shadow-md ring-1 ring-rome-200/50 dark:ring-rome-900/30"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center border text-xs font-black transition-colors",
                  task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900"
                )}>
                  {task.completed && "✓"}
                </div>
                <h4 className={cn("text-xs sm:text-sm font-black text-surface-900 dark:text-white", task.completed && "line-through text-surface-400 dark:text-surface-500")}>
                  {task.title}
                </h4>
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", task.timeColor)}>
                  {task.time}
                </span>
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", task.statusColor)}>
                  {task.status}
                </span>
              </div>
              <ChevronRight size={14} className="text-surface-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 pl-7 font-medium leading-relaxed">
              {task.desc}
            </p>

            <div className="flex items-center gap-2 pl-7 pt-2 border-t border-surface-100 dark:border-surface-800/80 text-[11px] text-surface-400 font-medium">
              <div className="flex -space-x-1.5">
                {task.avatars.map((av, i) => (
                  <img 
                    key={i} 
                    src={`https://randomuser.me/api/portraits/thumb/${av}.jpg`} 
                    alt="Peer" 
                    className="w-5 h-5 rounded-full border border-white dark:border-surface-900" 
                  />
                ))}
              </div>
              <span className="truncate">{task.collab}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
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

      {/* ── 6. SURFBALI STYLE — INTERACTIVE EXPERIENCE LEVEL SWITCHER ────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rome-500 mb-2 block">
                ★ LEVELS &amp; READINESS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
                Find the right opportunity regardless<br />of your <span className="text-rome-500">experience level</span>
              </h2>
            </div>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-surface-900 dark:text-white hover:text-rome-500 transition-colors"
            >
              Explore All Paths <ArrowUpRight size={14} className="stroke-[3]" />
            </Link>
          </div>

          {/* 4 Interactive Level Cards (SurfBali Pattern) */}
          <ExperienceLevelSwitcher />

        </div>
      </section>

      {/* ── 7. IMAGE 3 STYLE — COLLABORATIVE NOTES & APPLICATION WORKSPACE ─── */}
      <section className="py-24 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5">
              <Pill>• Application Workspace</Pill>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-6">
                Organize every milestone with precision
              </h2>
              <p className="text-base sm:text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed font-medium">
                Keep requirements, team feedback, and upcoming deadlines synced in one clean dashboard. Never scramble for submission materials again.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: 'Verified Requirement Checklists', desc: 'Auto-populated from official provider specifications.' },
                  { title: 'Peer & Mentor Collaboration', desc: 'Gather feedback on statements, case studies, and CV drafts.' },
                  { title: 'Multi-Cycle Deadline Timers', desc: 'Live alerts before application portals close.' },
                ].map((f, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#bef264]/50 text-surface-950 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-surface-900 dark:text-white">{f.title}</h4>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link 
                  to="/my-opportunities"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface-900 hover:bg-surface-800 dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
                >
                  View Workspace <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: Exact Image 3 Notes & Tasks Interactive Card */}
            <div className="lg:col-span-7">
              <InteractiveWorkspaceWidget />
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
