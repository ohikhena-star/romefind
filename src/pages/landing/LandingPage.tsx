import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  ArrowRight, CheckCircle2, ChevronDown,
  Compass, Users, Award, Briefcase,
  ChevronRight,
  BookOpen, Target, X, Menu,
  ArrowUpRight, Sparkles, BarChart2, CheckCircle
} from 'lucide-react';

// ─── Pill label used above section headings (Aeline / SurfBali pattern) ─────
const Pill = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span className={cn(
    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5 transition-all',
    light
      ? 'bg-white/20 text-white border border-white/30 shadow-sm backdrop-blur-md'
      : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700 shadow-xs'
  )}>
    <span className={cn('w-2 h-2 rounded-full', light ? 'bg-[#bef264] shadow-[0_0_8px_#bef264]' : 'bg-rome-500')} />
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
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between" aria-label="Main navigation">
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

        {/* Center Nav Links (Aeline exact nav pattern) */}
        <div className={cn(
          "hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider transition-colors",
          scrolled ? "text-surface-600 dark:text-surface-300" : "text-white/90"
        )}>
          <Link to="/" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">About Us</Link>
          <Link to="/discover" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">Discover</Link>
          <Link to="/explore" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">Explore</Link>
          <Link to="/compare" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">Compare</Link>
          <Link to="/learn" className="hover:text-white dark:hover:text-white hover:text-rome-500 transition-colors">Learn</Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/login" 
            className={cn(
              "text-xs font-bold px-3.5 py-2 transition-colors uppercase tracking-wider",
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

// ─── IMAGE 3 STYLE INTERACTIVE NOTES CARD WIDGET ────────────────────────────
const InteractiveNotesWidget = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'User Interface Case Study',
      time: 'Tomorrow',
      timeBadge: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
      status: 'Incoming',
      statusBadge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
      desc: 'Showcasing new design elements, user interviews, and high-fidelity prototype flows.',
      collab: 'Collaborate with Miguel, Jhon, Hane',
      completed: true,
      avatars: ['men/32', 'women/44', 'men/75']
    },
    {
      id: 2,
      title: 'Design System & Architecture',
      time: 'Today',
      timeBadge: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
      status: 'Ongoing',
      statusBadge: 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Key components of a design system (e.g., UI components, guidelines, tokens).',
      collab: 'Collaborate with Elena, Sarah, Alex',
      completed: false,
      avatars: ['women/68', 'men/22', 'women/12']
    },
    {
      id: 3,
      title: 'Typography & Motivation Draft',
      time: 'Yesterday',
      timeBadge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      status: 'Past',
      statusBadge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      desc: 'Discussing font choices, personal statement narrative, and institutional fit.',
      collab: 'Collaborate with Miguel, Angel, Hane',
      completed: true,
      avatars: ['men/41', 'women/55']
    }
  ]);

  const [activeTab, setActiveTab] = useState('All');

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 shadow-xl">
      {/* Header matching Image 3 */}
      <div className="flex items-center justify-between pb-5 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-900 dark:text-white">
            <BookOpen size={16} />
          </div>
          <h3 className="text-lg font-black text-surface-900 dark:text-white tracking-tight">
            Notes &amp; Tasks
          </h3>
        </div>
        <button 
          onClick={() => {
            const newTask = {
              id: Date.now(),
              title: 'Letter of Recommendation',
              time: 'Next Week',
              timeBadge: 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300',
              status: 'Draft',
              statusBadge: 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300',
              desc: 'Follow up with faculty advisor regarding WHO reference submission.',
              collab: 'Collaborate with Prof. Adams',
              completed: false,
              avatars: ['men/52']
            };
            setTasks(prev => [newTask, ...prev]);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-xs font-bold text-surface-900 dark:text-white transition-colors cursor-pointer shadow-xs"
        >
          + Add Notes
        </button>
      </div>

      {/* Filter Pills row (Image 3) */}
      <div className="flex items-center gap-2 py-4 border-b border-surface-100 dark:border-surface-800">
        {['Task: All', 'Time: All', 'Status: All'].map((filter, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(filter)}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-bold transition-colors border",
              activeTab === filter 
                ? "bg-surface-900 text-white dark:bg-white dark:text-surface-950 border-surface-900 dark:border-white shadow-xs" 
                : "bg-surface-50 dark:bg-surface-800/80 text-surface-600 dark:text-surface-300 border-surface-200/80 dark:border-surface-700"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Progress Metric */}
      <div className="py-3 flex items-center justify-between text-xs font-bold text-surface-500">
        <span>Preparation Milestones</span>
        <span className="text-rome-500">{completedCount} of {tasks.length} completed ({progressPercent}%)</span>
      </div>
      <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-1.5 mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rome-500 to-[#bef264] rounded-full transition-all duration-500" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Notes Stack */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 bg-surface-50/70 dark:bg-surface-950/60 hover:bg-white dark:hover:bg-surface-900 cursor-pointer group shadow-xs",
              task.completed 
                ? "border-surface-200 dark:border-surface-800/80 opacity-85" 
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
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", task.timeBadge)}>
                  {task.time}
                </span>
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", task.statusBadge)}>
                  {task.status}
                </span>
              </div>
              <ChevronRight size={14} className="text-surface-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 pl-7 font-medium leading-relaxed">
              {task.desc}
            </p>

            <div className="flex items-center gap-2 pl-7 pt-2 border-t border-surface-200/60 dark:border-surface-800/80 text-[11px] text-surface-500 dark:text-surface-400 font-medium">
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
  <div className="py-8 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80 overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 mb-3 text-center">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-surface-500">
        Verified opportunities curated directly from global leaders
      </span>
    </div>
    <div className="flex gap-12 items-center animate-[marquee_28s_linear_infinite] whitespace-nowrap opacity-75 hover:opacity-100 transition-opacity">
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

  return (
    <div className="bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 overflow-x-hidden font-sans selection:bg-[#bef264] selection:text-surface-950">
      
      {/* ─── Custom CSS Animations for floating clouds & 3D Cylindrical Arc ─── */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        
        @keyframes floatSlow1 { 0%, 100% { transform: translateY(0px) rotateY(18deg) translateZ(-15px); } 50% { transform: translateY(-10px) rotateY(18deg) translateZ(-15px); } }
        @keyframes floatSlow2 { 0%, 100% { transform: translateY(0px) rotateY(9deg) translateZ(-4px); } 50% { transform: translateY(-14px) rotateY(9deg) translateZ(-4px); } }
        @keyframes floatSlow3 { 0%, 100% { transform: translateY(0px) translateZ(30px) scale(1.05); } 50% { transform: translateY(-16px) translateZ(30px) scale(1.05); } }
        @keyframes floatSlow4 { 0%, 100% { transform: translateY(0px) rotateY(-9deg) translateZ(-4px); } 50% { transform: translateY(-12px) rotateY(-9deg) translateZ(-4px); } }
        @keyframes floatSlow5 { 0%, 100% { transform: translateY(0px) rotateY(-18deg) translateZ(-15px); } 50% { transform: translateY(-8px) rotateY(-18deg) translateZ(-15px); } }
        
        @keyframes cloudDriftLeft {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(40px) translateY(-12px); }
        }
        @keyframes cloudDriftRight {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-35px) translateY(10px); }
        }
        
        .animate-float-1 { animation: floatSlow1 7s ease-in-out infinite; }
        .animate-float-2 { animation: floatSlow2 6s ease-in-out infinite 0.8s; }
        .animate-float-3 { animation: floatSlow3 6.5s ease-in-out infinite 1.6s; }
        .animate-float-4 { animation: floatSlow4 7.2s ease-in-out infinite 0.4s; }
        .animate-float-5 { animation: floatSlow5 6.8s ease-in-out infinite 1.2s; }

        .animate-cloud-left { animation: cloudDriftLeft 14s ease-in-out infinite; }
        .animate-cloud-right { animation: cloudDriftRight 16s ease-in-out infinite; }

        .card-perspective-stage {
          perspective: 1400px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
        }
      `}</style>

      <Nav />

      {/* ── 1. HERO — AELINE RADIANT SKY BLUE + 3D CURVED CAROUSEL ─────────── */}
      <section className="relative min-h-[96vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1b64f2] via-[#2a7bf8] to-[#4fa0ff] pt-24 pb-14 text-white">
        
        {/* Realistic Volumetric Cloud Atmosphere (Aeline Style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top Sun & Cloud Glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-white/25 rounded-full blur-3xl opacity-80" />
          
          {/* Bottom Horizon Gradient Mist */}
          <div className="absolute bottom-0 left-0 right-0 h-[380px] bg-gradient-to-t from-white/35 via-white/10 to-transparent pointer-events-none" />
          
          {/* Floating Atmospheric Cloud Left */}
          <div className="absolute top-1/4 -left-20 w-[450px] h-[350px] bg-white/30 rounded-full blur-3xl opacity-70 animate-cloud-left" />
          
          {/* Floating Atmospheric Cloud Right */}
          <div className="absolute top-1/3 -right-24 w-[550px] h-[400px] bg-sky-100/35 rounded-full blur-3xl opacity-75 animate-cloud-right" />
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full text-center flex-1 flex flex-col justify-center items-center pt-8 pb-8">
          
          {/* Main Headline (User's authentic brand text + modern typography) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6 drop-shadow-sm">
            Rome wasn't built in a day.<br className="hidden sm:block" />
            <span className="text-white">Neither is your path.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-xs font-medium">
            Your next breakthrough might be something you haven't searched for yet. Discover global fellowships, grants, research roles, and internships with multi-factor matching and verified criteria.
          </p>

          {/* Action Button Row (Aeline Dual Buttons: View Demo + Neon Lime Get Started) */}
          <div className="flex flex-row items-center justify-center gap-3.5 mb-14">
            <Link 
              to="/discover"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-surface-950/35 hover:bg-surface-950/55 text-white font-black text-xs uppercase tracking-wider rounded-full backdrop-blur-md border border-white/25 transition-all shadow-sm hover:scale-[1.02]"
            >
              View Catalog
            </Link>
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#bef264] hover:bg-[#a3e635] text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started <ArrowUpRight size={15} className="stroke-[3]" />
            </Link>
          </div>

          {/* ── 3D CURVED CAROUSEL OF 5 APP CARDS (Aeline Exact Structure) ─── */}
          <div className="w-full max-w-6xl mx-auto px-2 card-perspective-stage">
            <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-5 overflow-x-auto lg:overflow-visible py-6 no-scrollbar">
              
              {/* Card 1 — Left Outer (Tilted Inward with Nature / Verified) */}
              <div 
                className="w-52 sm:w-60 flex-shrink-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl rounded-3xl p-5 text-left shadow-2xl border border-white/50 dark:border-surface-700 transition-all duration-300 hover:scale-105 animate-float-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Fellowship</span>
                  <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">98% Match</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-surface-900 dark:text-white leading-snug mb-1">Product Design Fellowship</h4>
                <p className="text-[11px] text-surface-500 mb-4 font-medium">Design Foundation · Global</p>
                <div className="pt-2.5 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-[10px] text-surface-400 font-bold">
                  <span className="text-rome-500">Full Funding</span>
                  <span>Closes Nov 15</span>
                </div>
              </div>

              {/* Card 2 — Left Inner (Dark Card with Performance / 93+ Opps) */}
              <div 
                className="w-56 sm:w-64 flex-shrink-0 bg-surface-950/95 backdrop-blur-xl rounded-3xl p-5 text-left text-white shadow-2xl border border-surface-800 transition-all duration-300 hover:scale-105 animate-float-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3 text-[10px] text-surface-400 font-black uppercase tracking-wider">
                  <span>Performance</span>
                  <span className="text-[#bef264] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-ping" />
                    Active
                  </span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">93+</div>
                <p className="text-xs text-surface-400 mb-4 font-medium">Verified opportunities curated directly from top organizations.</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-surface-900 p-2.5 rounded-2xl border border-surface-800">
                  <div>
                    <span className="text-surface-500 block font-semibold">Orgs</span>
                    <span className="font-bold text-white">44 Global</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block font-semibold">Jobs</span>
                    <span className="font-bold text-[#bef264]">22 Verified</span>
                  </div>
                </div>
              </div>

              {/* Card 3 — Center Hero Card (Elevated & Glowing Hub - Aeline Centerpiece) */}
              <div 
                className="w-60 sm:w-72 flex-shrink-0 bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl p-6 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-2 border-white/80 transition-all duration-300 hover:scale-110 z-20 animate-float-3 cursor-pointer"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-4 shadow-inner">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <h3 className="text-base font-black tracking-tight mb-1.5">Decision Engine</h3>
                <p className="text-xs text-sky-100 font-medium leading-relaxed mb-4">
                  Multi-factor precision scoring based on your skills, goals &amp; eligibility.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-surface-950 text-[11px] font-black shadow-sm">
                  <CheckCircle size={13} className="text-emerald-500" />
                  <span>100% Verified Sources</span>
                </div>
              </div>

              {/* Card 4 — Right Inner (Dark Card with Multi-Path Strategy) */}
              <div 
                className="w-56 sm:w-64 flex-shrink-0 bg-surface-900/95 backdrop-blur-xl rounded-3xl p-5 text-left text-white shadow-2xl border border-surface-800 transition-all duration-300 hover:scale-105 animate-float-4 group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#bef264]" />
                  <span className="text-[10px] font-black text-surface-300 uppercase tracking-wider">Multi-Path Discovery</span>
                </div>
                <p className="text-xs font-semibold text-surface-200 leading-relaxed mb-4">
                  Combines Fellowships, Grants, Internships, and Research alongside traditional jobs.
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-surface-400 font-bold">
                    <span>Direct Jobs</span>
                    <span className="text-white">24%</span>
                  </div>
                  <div className="w-full bg-surface-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#bef264] h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              {/* Card 5 — Right Outer (Tilted Inward with Remote Job) */}
              <div 
                className="w-52 sm:w-60 flex-shrink-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl rounded-3xl p-5 text-left shadow-2xl border border-white/50 dark:border-surface-700 transition-all duration-300 hover:scale-105 animate-float-5 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Remote Job</span>
                  <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Verified</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-surface-900 dark:text-white leading-snug mb-1">Frontend Systems Engineer</h4>
                <p className="text-[11px] text-surface-500 mb-4 font-medium">Mozilla · 100% Remote</p>
                <div className="pt-2.5 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-[10px] text-surface-400 font-bold">
                  <span className="text-emerald-600">Competitive</span>
                  <span>Direct Apply ↗</span>
                </div>
              </div>

            </div>
          </div>

          {/* Social Proof Star Rating below the 3D Cards */}
          <div className="mt-8 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-white/95 shadow-sm">
            <div className="flex text-[#bef264] text-xs">
              {'★'.repeat(5)}
            </div>
            <span>Rated <strong>4.9/5</strong> by 1,200+ applicants worldwide</span>
          </div>

        </div>
      </section>

      {/* ── 2. LOGO MARQUEE BANNER ────────────────────────────────────────── */}
      <LogoMarquee />

      {/* ── 3. ABOUT US / BENTO GRID & METRICS (Aeline Exact Pattern) ──────── */}
      <section id="about" className="py-24 md:py-32 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Pill>• About ROMEfind</Pill>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-[1.15]">
              A global discovery partner dedicated to building{' '}
              <span className="inline-flex items-center align-middle mx-1 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-sm font-black border border-sky-300 dark:border-sky-800">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2 shadow-[0_0_6px_#0ea5e9]" />
                smarter
              </span>{' '}
              and{' '}
              <span className="inline-flex items-center align-middle mx-1 px-3 py-1 rounded-full bg-[#bef264]/40 dark:bg-[#bef264]/20 text-surface-900 dark:text-[#bef264] text-sm font-black border border-[#bef264] dark:border-[#bef264]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bef264] mr-2 shadow-[0_0_6px_#bef264]" />
                more adaptive
              </span>{' '}
              opportunity paths
            </h2>
          </div>

          {/* Bento Grid Layout (Exact Aeline Composition) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Card 1 (Left 5 Cols) — Blue Hero Photo with High-Contrast Stat Overlay */}
            <div className="lg:col-span-5 rounded-3xl overflow-hidden relative min-h-[400px] bg-gradient-to-br from-sky-600 via-sky-700 to-surface-950 text-white p-7 flex flex-col justify-between shadow-xl group border border-sky-500/30">
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

            {/* Bento Card 2 (Middle 4 Cols) — Accuracy Metric + Overlapping Avatars & Quote */}
            <div className="lg:col-span-4 rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-7 flex flex-col justify-between shadow-sm hover:border-surface-300 dark:hover:border-surface-700 transition-colors">
              <div>
                <span className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider block mb-2">
                  Commitment to measurable
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
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-surface-900 shadow-xs" 
                    />
                  ))}
                  <div className="w-9 h-9 rounded-full bg-rome-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-surface-900 shadow-xs">
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
              
              {/* Neon Lime Data Card (Exact Aeline) */}
              <div className="flex-1 rounded-3xl bg-[#bef264] text-surface-950 p-6 flex flex-col justify-between shadow-lg border border-[#a3e635] hover:scale-[1.02] transition-transform">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-surface-900/70 block mb-1">
                    Data Points
                  </span>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-surface-950 mb-2">
                    520k+
                  </div>
                </div>
                <p className="text-xs font-bold text-surface-900/90 leading-relaxed">
                  Analyzed monthly to power smarter opportunity decision strategies.
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
                Whether you're exploring today or building for tomorrow, we help you discover and apply with confidence.
              </p>
            </div>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-surface-900 hover:bg-surface-800 dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md self-start md:self-auto"
            >
              Get Started <ArrowUpRight size={14} className="stroke-[3]" />
            </Link>
          </div>

          {/* 4-Card Row (3 Feature Cards + 1 High Quality Visual Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Service 1: AI Strategy */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">AI Strategy</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  We help you pinpoint opportunities aligned with your background and funding criteria with zero noise.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-rome-600 dark:text-rome-400">
                <span>Multi-factor fit</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 2: Multi-Path Strategy */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">Multi-Path Strategy</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  Expand your opportunities with parallel tracks: fellowships, grants, research roles, and programmes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-rome-600 dark:text-rome-400">
                <span>Alternative avenues</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 3: Data & Insights */}
            <div className="rounded-3xl bg-white dark:bg-surface-900 p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex flex-col justify-between hover:border-rome-300 dark:hover:border-rome-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#bef264] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart2 size={18} className="text-surface-950" />
                </div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white mb-2">Data &amp; Insights</h3>
                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                  We turn complex eligibility requirements into clear, structured preparation roadmaps.
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

      {/* ── 5. SURFBALI STYLE — INTERACTIVE EXPERIENCE LEVEL SWITCHER ────────── */}
      <section className="py-24 bg-white dark:bg-surface-950 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rome-500 mb-2 block">
                ★ LEVELS &amp; READINESS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
                Find your path regardless<br />of your <span className="text-rome-500">experience level</span>
              </h2>
            </div>
            <Link 
              to="/discover" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-surface-900 dark:text-white hover:text-rome-500 transition-colors"
            >
              Explore All Paths <ArrowUpRight size={14} className="stroke-[3]" />
            </Link>
          </div>

          {/* 4 Interactive Level Cards (SurfBali Pattern) */}
          <ExperienceLevelSwitcher />

        </div>
      </section>

      {/* ── 6. SURFBALI STYLE — WHOLE ECOSYSTEM STACK (4 Cards with 3D Emojis) ── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-5">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rome-500 mb-2 block">
                ★ COMPLETE ECOSYSTEM
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-6">
                Preparation, funding, mentorship, and execution — <span className="text-surface-400">we've got it all</span>
              </h2>
              <p className="text-base sm:text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed font-medium">
                Opportunity discovery is not just about finding a listing. It’s about understanding the criteria, connecting with past applicants, building skills, and tracking deadlines.
              </p>
              <Link 
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-surface-900 hover:bg-surface-800 dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
              >
                Join ROMEfind <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right Stack of 4 Interactive Cards (SurfBali Pattern) */}
            <div className="lg:col-span-7 space-y-3.5">
              {[
                { emoji: '🧘', title: 'Mentorship and Guidance', sub: 'For guidance', desc: 'Connect with mentors and alumni who share application advice and portfolio reviews.' },
                { emoji: '🏛️', title: 'Global Fellowships & Funding', sub: 'For security', desc: 'Discover fully funded opportunities, stipends, living allowances, and research awards.' },
                { emoji: '🏔️', title: 'Research and Growth', sub: 'For impact', desc: 'Access university labs, independent research institutes, and scientific grants worldwide.' },
                { emoji: '🏄', title: 'Career Accelerators & Jobs', sub: 'For momentum', desc: 'Direct pipelines to verified tech roles, innovative fellowships, and high-growth opportunities.' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-5 shadow-xs hover:shadow-md hover:border-rome-300 dark:hover:border-rome-700 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="max-w-md">
                    <span className="text-[10px] font-black uppercase tracking-wider text-surface-400 block mb-1">
                      {item.sub}
                    </span>
                    <h4 className="text-base font-black text-surface-900 dark:text-white tracking-tight mb-1 group-hover:text-rome-500 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-surface-500 dark:text-surface-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                    {item.emoji}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. IMAGE 3 STYLE — NOTES & APPLICATION WORKSPACE ────────────────── */}
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
                Keep requirements, team feedback, and upcoming deadlines synced in one clean workspace. Never scramble for submission materials again.
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
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-surface-900 hover:bg-surface-800 dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
                >
                  View Workspace <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: Exact Image 3 Notes & Tasks Interactive Card */}
            <div className="lg:col-span-7">
              <InteractiveNotesWidget />
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. LEARN & PREPARATION SECTION ─────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40 border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill>• Learn &amp; Grow</Pill>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-5">
                Learn for what<br />you're trying to pursue.
              </h2>
              <p className="text-base sm:text-lg text-surface-500 dark:text-surface-400 mb-6 leading-relaxed font-medium">
                Learning in ROMEfind is connected directly to verified opportunities. Not generic course directories — targeted preparation for a specific ambition.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-3 rounded-2xl bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-800 mb-8 shadow-xs">
                <Target size={15} className="text-rome-500" />
                Opportunity → Criteria → Skill gap → Tailored Learning
              </div>
              <div>
                <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-rome-600 dark:text-rome-400 hover:text-rome-700 transition-colors">
                  Explore curated learning resources <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-7 shadow-xl">
              <Chip color="purple">Fellowship Track</Chip>
              <h4 className="text-base font-black text-surface-900 dark:text-white mt-3 mb-1">Product Design Fellowship</h4>
              <p className="text-xs text-surface-500 mb-5 font-medium">Core skills required for this fellowship path:</p>
              <div className="space-y-2 mb-6">
                {['UX Research methods & synthesis', 'Portfolio case study presentation', 'Cross-functional stakeholder alignment'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rome-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-surface-700 dark:text-surface-300">{s}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-surface-400 mb-3">Your preparation status</p>
              {[
                { skill: 'UX Research', progress: 40 },
                { skill: 'Portfolio Storytelling', progress: 85 },
                { skill: 'User Interviews', progress: 60 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300 w-36 flex-shrink-0">{item.skill}</span>
                  <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-rome-500 to-[#bef264]" style={{ width: `${item.progress}%` }} />
                  </div>
                  <Link to="/learn" className="text-xs font-bold text-rome-500 hover:underline flex-shrink-0">Study</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. COMMUNITY & OUTCOMES ────────────────────────────────────────── */}
      <section className="py-24 bg-surface-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill light>Outcomes &amp; Experience</Pill>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                Someone has been<br />through it before.
              </h2>
              <p className="text-base sm:text-lg text-surface-400 mb-8 leading-relaxed font-medium">
                People who have applied share what helped, what they'd do differently, and their outcome. Clearly labeled — separate from official provider specifications.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Award, label: 'Official opportunity requirements', sub: 'Curated directly from verified provider links' },
                  { icon: Users, label: 'Community applicant reviews', sub: 'Shared by peers who went through the exact cycle' },
                  { icon: BookOpen, label: 'Your private workspace notes', sub: 'Only visible to you during drafting' },
                ].map(({ icon: Icon, label, sub }, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl border border-surface-800 bg-surface-900/80">
                    <Icon size={16} className="text-[#bef264] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-surface-200">{label}</p>
                      <p className="text-xs text-surface-400 font-medium">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-surface-800 bg-surface-900 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-surface-400">Community Experience</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-800 text-surface-400 font-bold">Not official</span>
                </div>
                {[
                  { dot: 'bg-emerald-400', text: '"Start your portfolio early — the case study takes longer than you think."' },
                  { dot: 'bg-rome-400', text: '"They care about your thought process more than polished visuals. Document everything."' },
                  { dot: 'bg-amber-400', text: '"Applied twice — the second time I got more specific about measurable user impact."' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3.5 last:mb-0">
                    <span className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', item.dot)} />
                    <p className="text-xs sm:text-sm text-surface-300 leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
                <div className="mt-5 pt-4 border-t border-surface-800 flex flex-wrap gap-2">
                  {['Application advice', 'Portfolio tips', 'Interview experience', 'What I\'d do differently'].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-400 font-bold">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-6 py-4 rounded-3xl border border-emerald-900 bg-emerald-950/40">
                <span className="font-black text-xs px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300">🟢 ACCEPTED</span>
                <div>
                  <p className="text-xs font-black text-emerald-300">Product Design Fellowship</p>
                  <p className="text-[11px] text-emerald-500 font-medium">Shared by past fellow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ SECTION ────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white dark:bg-surface-950 scroll-mt-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <Pill>• FAQ</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-2.5">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors cursor-pointer"
                  aria-expanded={faqOpen === i}
                >
                  <span className="text-sm font-black text-surface-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown size={16} className={cn('text-surface-400 flex-shrink-0 transition-transform duration-200', faqOpen === i && 'rotate-180')} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-1 bg-white dark:bg-surface-900">
                    <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 leading-relaxed font-medium">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-rome-50 to-white dark:from-rome-950/10 dark:to-surface-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-surface-900 dark:text-white tracking-tight mb-6 leading-tight">
            Rome wasn't built in a day.<br />Neither is your path.
          </h2>
          <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 mb-10 leading-relaxed font-medium">
            Start with what you're looking for.<br className="hidden sm:block" />Discover where else it could take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-rome-500 hover:bg-rome-600 text-white font-black rounded-full text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl">
              Explore opportunities <ArrowRight size={16} />
            </Link>
            <Link to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 hover:border-rome-400 hover:text-rome-600 font-bold rounded-full text-xs uppercase tracking-wider transition-all">
              About ROMEfind
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12. FOOTER — FINEXA WORDMARK WATERMARK PATTERN ─────────────────── */}
      <footer className="bg-surface-950 border-t border-surface-800 relative overflow-hidden">
        {/* Giant wordmark watermark (Finexa) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <p className="text-[min(22vw,200px)] font-black text-surface-900 leading-none text-center whitespace-nowrap opacity-60 tracking-tight">
            ROMEfind
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 sm:col-span-3 md:col-span-1">
              <p className="font-black text-xl text-white mb-2">ROME<span className="text-[#bef264]">find</span></p>
              <p className="text-sm text-surface-400 leading-relaxed mb-3">Find what's possible.</p>
              <p className="text-xs text-surface-500 leading-relaxed">Opportunity discovery and decision support platform.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Product</p>
              <ul className="space-y-2.5">
                {['Discover', 'Explore', 'Compare', 'My Opportunities', 'Learn'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(' ', '-')}`} className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">About</p>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">About ROMEfind</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Help</p>
              <ul className="space-y-2.5">
                <li><a href="#faq" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">FAQ</a></li>
                <li><a href="mailto:romefind.support@gmail.com" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">Support</a></li>
                <li><a href="mailto:romefind.support@gmail.com" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Trust</p>
              <ul className="space-y-2.5">
                <li><Link to="/community-guidelines" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">Community Guidelines</Link></li>
                <li><Link to="/privacy" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-xs font-bold text-surface-400 hover:text-[#bef264] transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-surface-500 font-medium">© {new Date().getFullYear()} ROMEfind. All rights reserved.</p>
            <p className="text-xs text-surface-500 font-medium">Rome wasn't built in a day. Neither is your path.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
