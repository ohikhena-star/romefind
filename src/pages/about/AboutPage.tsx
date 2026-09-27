import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  ArrowRight, Check, Compass, Search, ArrowUpRight,
  CheckCircle2, Circle, Calendar, MapPin, Users, BookOpen, Award
} from 'lucide-react';

// ── Small reusable primitives ────────────────────────────────────────────────

const Pill = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border ${light ? 'bg-white/10 text-white border-white/20' : 'bg-rome-100 dark:bg-rome-950/50 text-rome-700 dark:text-rome-300 border-rome-200 dark:border-rome-800'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{children}
  </span>
);

const Chip = ({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) => {
  const m: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', m[color] || m.blue)}>{children}</span>;
};

// ── Journey step data ────────────────────────────────────────────────────────
const JOURNEY = [
  { step: 'Discover', q: 'What possibilities are out there?' },
  { step: 'Explore', q: 'What else could fit?' },
  { step: 'Compare', q: 'How do these options differ?' },
  { step: 'Understand', q: 'What does this actually require?' },
  { step: 'Prepare', q: 'What do I need before I apply?' },
  { step: 'Apply', q: 'What is my next step?' },
  { step: 'Track', q: 'Where am I in the process?' },
  { step: 'Learn', q: 'What skills or knowledge would help?' },
  { step: 'Outcome', q: 'What happened?' },
  { step: 'Contribute', q: 'What could someone else learn from my experience?' },
];

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-surface-950 min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-sky-600 via-rome-500 to-rome-600 overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 md:py-32">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-5">About ROMEfind</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight mb-6 max-w-3xl">
            Rome wasn't built<br />in a day.<br />
            <span className="text-white/70">Neither is your path.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed mb-10">
            ROMEfind helps you find what's possible — from discovering opportunities to exploring paths you may have overlooked, understanding your options, preparing for what comes next, and learning from the journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-surface-900 font-black rounded-xl text-base transition-all shadow-lg">
              Explore opportunities <ArrowRight size={16} />
            </Link>
            <Link to="/discover"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-base transition-all backdrop-blur-sm">
              See how it works
            </Link>
          </div>
        </div>

        {/* Wave into next section */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-12">
            <path d="M0 48 L0 24 Q360 0 720 24 Q1080 48 1440 24 L1440 48 Z" fill="white" className="dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ── WHY ROMEFIND EXISTS ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white dark:bg-surface-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Pill>Why we exist</Pill>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-8">
              The right opportunity can change what comes next.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-5 text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
              <p>
                People discover opportunities through search engines, social media, group chats, newsletters, communities, random recommendations, and organization websites. The landscape is fragmented and hard to navigate.
              </p>
              <p>
                But the problem isn't simply that opportunities are hard to find. The problem is that <strong className="text-surface-900 dark:text-white font-semibold">possibility is fragmented</strong>.
              </p>
              <p>
                A person's search often becomes too narrow. Someone decides <em>"I need an internship"</em> — and searches only for internships. But the better question might be:
              </p>
              <blockquote className="border-l-4 border-rome-400 pl-5 py-1 my-6">
                <p className="text-xl font-black text-surface-900 dark:text-white not-italic leading-snug">
                  "What opportunities could move me toward where I want to go?"
                </p>
              </blockquote>
              <p>
                ROMEfind is designed around that broader question. Not to replace search — but to expand what you consider possible.
              </p>
            </div>
            <div className="space-y-3">
              {/* How people currently discover opportunities */}
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">How opportunities are currently found</p>
              {[
                { label: 'Search engines', w: '78%' },
                { label: 'Group chats & communities', w: '62%' },
                { label: 'Social media', w: '70%' },
                { label: 'Newsletters', w: '44%' },
                { label: 'Organization websites', w: '55%' },
                { label: 'Word of mouth', w: '50%' },
              ].map(({ label, w }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-surface-700 dark:text-surface-300">{label}</span>
                  </div>
                  <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-rome-400 to-rome-500" style={{ width: w }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-surface-400 mt-3 italic">Illustrative — showing the spread of how opportunities reach people today</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BELIEVE ──────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <Pill>Our philosophy</Pill>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-5">
              Your search is only<br />the beginning.
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
              A person shouldn't have to stop at <strong className="text-surface-800 dark:text-surface-200">Find → Apply</strong>. ROMEfind is designed around a longer, more supported journey.
            </p>
          </div>

          {/* Journey grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JOURNEY.map((item, i) => (
              <div key={item.step}
                className={cn(
                  'rounded-2xl border p-5 flex items-start gap-4',
                  i < 5
                    ? 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'
                    : 'bg-surface-50 dark:bg-surface-800/40 border-surface-200/60 dark:border-surface-700/60'
                )}>
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black',
                  i < 5 ? 'bg-rome-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                )}>
                  {i + 1}
                </div>
                <div>
                  <p className={cn('text-sm font-black mb-0.5', i < 5 ? 'text-surface-900 dark:text-white' : 'text-surface-600 dark:text-surface-400')}>
                    {item.step}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-500 leading-relaxed">{item.q}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-surface-400 dark:text-surface-500 max-w-lg">
            Each stage answers a different question. ROMEfind is being built to support all of them — not just the first one.
          </p>
        </div>
      </section>

      {/* ── LOOK BEYOND THE SEARCH ───────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill>Alternative paths</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-5">
                Sometimes the opportunity you need isn't the one you searched for.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-6">
                When someone searches for a UX internship, ROMEfind also surfaces fellowships, competitions, research programmes, and grants that could move them toward the same goal.
              </p>
              <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
                These aren't random recommendations. They represent different ways of moving toward a similar destination — paths that people often overlook because they didn't know to search for them.
              </p>
            </div>

            {/* Search demo visual */}
            <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 shadow-card">
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-3">Search</p>
              <div className="flex items-center gap-3 bg-white dark:bg-surface-950 border-2 border-rome-400 rounded-xl px-4 py-3 mb-5">
                <Search size={14} className="text-rome-500 flex-shrink-0" />
                <span className="text-sm font-bold text-surface-900 dark:text-white">UX internship</span>
              </div>

              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-3">Results</p>
              <div className="space-y-2 mb-5">
                {[
                  { label: 'UX Design Internship', type: 'Internship', color: 'blue', primary: true },
                  { label: 'Product Design Fellowship', type: 'Fellowship', color: 'purple', primary: false },
                  { label: 'Design Research Programme', type: 'Programme', color: 'teal', primary: false },
                ].map((r, i) => (
                  <div key={i} className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border',
                    r.primary ? 'bg-white dark:bg-surface-950 border-rome-300 dark:border-rome-700' : 'bg-white/50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-800'
                  )}>
                    <Chip color={r.color}>{r.type}</Chip>
                    <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{r.label}</span>
                    {r.primary && <Check size={13} className="text-rome-500 ml-auto flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-rome-200 dark:border-rome-800 bg-rome-50 dark:bg-rome-950/20 p-4">
                <p className="text-xs font-bold text-rome-700 dark:text-rome-300 flex items-center gap-1.5 mb-2.5">
                  <Compass size={12} /> You might also explore
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Fellowship', 'Competition', 'Research', 'Grant', 'Conference', 'Scholarship'].map(t => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-surface-900 border border-rome-300 dark:border-rome-700 text-rome-700 dark:text-rome-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE THAN A LIST OF LINKS ─────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Opportunity detail mockup */}
            <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-card">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <Chip color="purple">Fellowship</Chip>
                  <h4 className="text-base font-black text-surface-900 dark:text-white mt-2">Product Design Fellowship</h4>
                  <p className="text-xs text-surface-500 mt-0.5">Design Foundation · Global</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Funded</span>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Who it\'s for', value: 'Early-career designers & graduates' },
                  { label: 'Duration', value: '6 months' },
                  { label: 'Deadline', value: 'October 12' },
                  { label: 'Benefits', value: 'Stipend, mentorship, portfolio support' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3 py-2.5 border-b border-surface-100 dark:border-surface-800 last:border-0">
                    <span className="text-xs font-black uppercase tracking-wider text-surface-400 w-24 flex-shrink-0 mt-0.5">{row.label}</span>
                    <span className="text-sm text-surface-700 dark:text-surface-300">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rome-600 dark:text-rome-400">Community experience</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500">Not official</span>
                </div>
                <p className="text-xs text-surface-500 italic">"Start your portfolio early — the case study takes longer than you think."</p>
              </div>
            </div>

            <div>
              <Pill>Depth</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-5">
                An opportunity is more than a title and a deadline.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-6">
                ROMEfind aims to help you understand opportunities in context — not just what they are, but what they require, what you'd get, how to prepare, and what people who've been through them have to say.
              </p>
              <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-6">
                Official opportunity information and community experience are always kept clearly separate. What the provider says is different from what an applicant experienced.
              </p>
              <ul className="space-y-2">
                {['Eligibility and requirements', 'Preparation and what to expect', 'Related learning and skill gaps', 'Alternative and adjacent opportunities', 'Community experience from past applicants'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={14} className="text-rome-500 flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PEOPLE LEARN FROM PEOPLE ─────────────────────────────────────── */}
      <section className="py-24 bg-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Pill light>Community</Pill>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-5">
                Someone has probably been through it before.
              </h2>
              <p className="text-lg text-surface-400 leading-relaxed mb-6">
                People who have applied, interviewed, participated, won, lost, waited, or changed direction carry knowledge that no official opportunity listing contains.
              </p>
              <p className="text-lg text-surface-400 leading-relaxed">
                ROMEfind is building toward a community where that experience can be shared — clearly labelled as personal experience, never as official information from a provider.
              </p>
              <p className="text-sm text-surface-600 mt-6 italic">
                Community contribution features are being developed as part of what ROMEfind is building.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { dot: 'bg-emerald-400', text: '"Start your portfolio early — the case study takes longer than you think."' },
                { dot: 'bg-rome-400', text: '"They care about your process more than the final output. Document everything."' },
                { dot: 'bg-amber-400', text: '"Applied twice — the second time I got more specific about impact."' },
                { dot: 'bg-purple-400', text: '"The timeline was longer than the website suggested. Give yourself extra time."' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-surface-900 border border-surface-800">
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', item.dot)} />
                  <p className="text-sm text-surface-300 leading-relaxed italic">{item.text}</p>
                </div>
              ))}
              <p className="text-xs text-surface-600 px-2">Illustrative examples of the kind of experiences the community aims to capture</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT ────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Pill>What we're building</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight leading-tight mb-6">
              We're building for the whole journey.
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-5">
              ROMEfind is evolving beyond discovery toward a system where people can move through the entire opportunity journey in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              { title: 'Find opportunities', desc: 'Search and filter across types, fields, locations, and funding status.' },
              { title: 'Make informed comparisons', desc: 'See opportunities side by side across eligibility, requirements, and timeline.' },
              { title: 'Prepare intentionally', desc: 'Work through preparation checklists tied to specific opportunities.' },
              { title: 'Track applications', desc: 'Follow every opportunity from saved through to outcome.' },
              { title: 'Learn toward goals', desc: 'Build relevant skills connected to what you\'re actually trying to achieve.' },
              { title: 'Help others through what you learned', desc: 'Share experience that makes the path easier for the person coming next.', future: true },
            ].map(({ title, desc, future }) => (
              <div key={title} className={cn(
                'rounded-2xl border p-5',
                future ? 'bg-surface-50 dark:bg-surface-900/40 border-dashed border-surface-300 dark:border-surface-700' : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'
              )}>
                {future && <span className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2 block">Coming</span>}
                <h3 className="text-sm font-black text-surface-900 dark:text-white mb-1.5">{title}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO ROMEFIND IS FOR ───────────────────────────────────────────── */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <Pill>Who it's for</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
              ROMEfind starts with what you're looking for.
            </h2>
            <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">And helps you discover where else that search could lead.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">Opportunity types</p>
              <div className="flex flex-wrap gap-2">
                {['Internships', 'Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Competitions', 'Research roles', 'Programmes', 'Conferences', 'Volunteering'].map(t => (
                  <span key={t} className="px-3 py-1.5 text-sm font-semibold rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-4">People it can help</p>
              <ul className="space-y-2">
                {[
                  'Students and recent graduates',
                  'Early-career professionals',
                  'Career switchers exploring new directions',
                  'Researchers looking for funding or positions',
                  'Builders and founders seeking grants or programmes',
                  'People exploring a new field for the first time',
                  'Anyone looking for a meaningful next step',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <Check size={14} className="text-rome-500 flex-shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE NAME ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Pill>The name</Pill>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-8">
              Why <span className="text-rome-500">ROME</span>find?
            </h2>
            <blockquote className="border-l-4 border-rome-400 pl-6 mb-8">
              <p className="text-2xl font-black text-surface-900 dark:text-white leading-snug">
                Rome wasn't built in a day.<br />Neither is your path.
              </p>
            </blockquote>
            <div className="space-y-4 text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
              <p>
                The name is a reference to that idea. Meaningful progress is rarely a single decision or a single discovery. It's built through a series of finds, comparisons, preparations, attempts, lessons, and next steps.
              </p>
              <p>
                ROMEfind is about finding what could come next — not pretending the path is obvious or that one opportunity answers everything.
              </p>
              <p className="font-semibold text-surface-800 dark:text-surface-200">
                Find what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-b from-rome-50 to-white dark:from-rome-950/10 dark:to-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-black text-surface-900 dark:text-white tracking-tight mb-6 leading-tight">
            Your path doesn't have<br />to be obvious.
          </h2>
          <p className="text-xl text-surface-500 dark:text-surface-400 mb-10">
            Start with what you're looking for.<br className="hidden sm:block" />Discover where else it could take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-rome-500 hover:bg-rome-600 text-white font-black rounded-xl text-base transition-all shadow-lg">
              Explore opportunities <ArrowRight size={16} />
            </Link>
            <Link to="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 hover:border-rome-400 hover:text-rome-600 font-semibold rounded-xl text-base transition-all">
              How it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Pill variant for dark section
function PillLight({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 text-white/80 border border-white/20 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />{children}
    </span>
  );
}
