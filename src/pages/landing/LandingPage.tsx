import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Search, Compass, Target, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-surface-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rome-100 dark:bg-rome-900/30 text-rome-700 dark:text-rome-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-rome-500"></span>
            Now in public beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Find what's <span className="text-transparent bg-clip-text bg-gradient-to-r from-rome-500 to-rome-400">possible.</span>
          </h1>
          <p className="text-xl text-surface-600 dark:text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Opportunities are everywhere. Knowing which ones are worth pursuing is the hard part. ROMEfind helps you discover possibilities, understand your options, and build your path forward.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8">
                Start exploring
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                See how it works
              </Button>
            </a>
          </div>
        </div>

        {/* Decorative Floating Cards Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-12 transform -rotate-12 opacity-60 dark:opacity-30 blur-[1px]">
            <OpportunityCardMockup type="Fellowship" color="purple" title="Global Innovators Fellowship" org="Tech Foundation" />
          </div>
          <div className="absolute top-1/3 -right-8 transform rotate-6 opacity-60 dark:opacity-30 blur-[1px]">
            <OpportunityCardMockup type="Grant" color="green" title="Open Source Research Grant" org="Dev Alliance" />
          </div>
          <div className="absolute -bottom-12 left-1/3 transform -rotate-6 opacity-60 dark:opacity-30 blur-[1px]">
            <OpportunityCardMockup type="Program" color="teal" title="Future Leaders Academy" org="Global Institute" />
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-6">
                You search for what you know.<br />
                <span className="text-surface-400">You miss what you don't.</span>
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
                Most platforms operate like search engines: they show you exactly what you typed. But the best opportunities are often the ones you didn't even know existed. We replace the search bar with discovery.
              </p>
              <ul className="space-y-4">
                {[
                  "Discover opportunities across disciplines",
                  "Understand real requirements before applying",
                  "Compare options side-by-side"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-surface-700 dark:text-surface-300">
                    <CheckCircle2 className="text-rome-500 h-5 w-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual */}
            <div className="relative rounded-2xl bg-surface-100 dark:bg-surface-900 p-8 border border-surface-200 dark:border-surface-800 shadow-xl">
              <div className="mb-4 bg-white dark:bg-surface-800 rounded-lg p-3 flex items-center gap-3 border border-surface-200 dark:border-surface-700 shadow-sm opacity-50">
                <Search className="text-surface-400" size={20} />
                <span className="text-surface-500 font-mono text-sm">Search: "marketing internships"</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-rome-500 text-white rounded-full p-3 shadow-lg shadow-rome-500/30">
                    <Compass size={24} />
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-rome-400 to-transparent my-8"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">Found</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">Growth Fellowship</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider block mb-1">Found</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">Creator Grant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover More Section */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            There's more you could pursue.
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-12 max-w-2xl mx-auto">
            Stop limiting yourself to one category. Our engine connects adjacent opportunities across domains.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <CategoryBadge count={12} label="Fellowships" color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" />
            <CategoryBadge count={8} label="Competitions" color="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800" />
            <CategoryBadge count={15} label="Grants" color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" />
            <CategoryBadge count={6} label="Programmes" color="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800" />
          </div>
        </div>
      </section>

      {/* Path Section */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-16">
            Build your path forward.
          </h2>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-surface-100 dark:bg-surface-800 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              <PathStep icon={Compass} title="Discover" desc="Expand your options" active />
              <PathStep icon={Target} title="Decide" desc="Compare and choose" />
              <PathStep icon={BookOpen} title="Prepare" desc="Learn what you need" />
              <PathStep icon={ChevronRight} title="Apply" desc="Submit with confidence" />
              <PathStep icon={CheckCircle2} title="Track" desc="Manage your progress" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-rome-600 dark:bg-surface-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Your next opportunity might be something you haven't searched for yet.
          </h2>
          <Link to="/signup">
            <Button className="bg-white text-rome-600 hover:bg-surface-50 text-lg px-10 py-4 h-auto font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              Find yours today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

// Sub-components for Landing Page
const OpportunityCardMockup = ({ type, color, title, org }: { type: string, color: string, title: string, org: string }) => {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50',
    green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50',
    teal: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50',
  };

  return (
    <div className="bg-white dark:bg-surface-800 p-5 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 w-72 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className={cn("inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border mb-3", colorMap[color])}>
        {type}
      </div>
      <h3 className="font-bold text-surface-900 dark:text-white text-lg leading-tight mb-1">{title}</h3>
      <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">{org}</p>
      <div className="h-2 w-full bg-surface-100 dark:bg-surface-700 rounded-full mb-2"></div>
      <div className="h-2 w-2/3 bg-surface-100 dark:bg-surface-700 rounded-full"></div>
    </div>
  );
};

const CategoryBadge = ({ count, label, color }: { count: number, label: string, color: string }) => (
  <div className={cn("px-6 py-4 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[140px] shadow-sm hover:shadow-md transition-shadow", color)}>
    <span className="text-3xl font-black mb-1">{count}</span>
    <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
  </div>
);

const PathStep = ({ icon: Icon, title, desc, active = false }: { icon: any, title: string, desc: string, active?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className={cn(
      "w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 border-4 transition-colors",
      active 
        ? "bg-rome-500 border-rome-100 dark:border-rome-900 text-white" 
        : "bg-white dark:bg-surface-800 border-surface-100 dark:border-surface-700 text-surface-400 dark:text-surface-500"
    )}>
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-surface-500 dark:text-surface-400">{desc}</p>
  </div>
);

export default LandingPage;
