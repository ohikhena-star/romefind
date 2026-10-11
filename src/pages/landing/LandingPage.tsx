import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useApplicationStore } from '@/store/applicationStore';
import { opportunities } from '@/data/opportunities';
import { Button } from '@/components/ui/Button';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { cn } from '@/utils/cn';
import { Opportunity } from '@/types/models';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handlePrimaryCta = () => {
    if (isAuthenticated) {
      navigate('/discover');
    } else {
      navigate('/signup');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Curated, verified live opportunities with active deadlines
  const featuredIds = ['opp-pm-01', 'opp-cx-01', 'opp-sch-01', 'opp-tech-03'];
  const featuredOpportunities: Opportunity[] = featuredIds
    .map(id => opportunities.find(o => o.id === id))
    .filter(Boolean) as Opportunity[];

  const workflowSteps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Filter by what matters',
      description: 'Search curated programs by living stipend, remote modality, and your academic or career discipline.',
      accent: 'border-l-burgundy text-burgundy dark:text-rome-400'
    },
    {
      number: '02',
      title: 'Understand',
      tagline: 'Check requirements upfront',
      description: 'Review education prerequisites, citizenship or regional eligibility, and experience levels before investing hours in applications.',
      accent: 'border-l-amber-600 text-amber-700 dark:text-amber-400'
    },
    {
      number: '03',
      title: 'Compare',
      tagline: 'Weigh trade-offs side-by-side',
      description: 'Evaluate commitments, duration, funding levels, and requirements across 2 to 4 shortlisted options.',
      accent: 'border-l-emerald-600 text-emerald-700 dark:text-emerald-400'
    },
    {
      number: '04',
      title: 'Pursue',
      tagline: 'Apply on official portals',
      description: 'Navigate directly to official institutional application pages and track your deadlines in a private workspace.',
      accent: 'border-l-rome-600 text-rome-600 dark:text-rome-400'
    }
  ];

  const practicalFeatures = [
    {
      icon: 'scale-linear',
      title: 'Side-by-Side Comparison',
      description: 'Compare duration, stipends, location requirements, and prerequisites side by side before deciding where to focus your effort.'
    },
    {
      icon: 'book-2-linear',
      title: 'Connected Skill Preparation',
      description: 'Identify technical and writing skills connected to opportunities you want to pursue and review targeted learning materials.'
    },
    {
      icon: 'heart-linear',
      title: 'Personal Shortlist',
      description: 'Save opportunities to monitor active deadlines, rolling admission windows, and upcoming recruitment cycles.'
    },
    {
      icon: 'case-linear',
      title: 'Application Milestones',
      description: 'Organize personal checklists, draft notes, reference letters, and outcomes in one calm, private workspace.'
    }
  ];

  const faqs = [
    {
      q: 'Is ROMEfind free to use?',
      a: 'Yes. Discovering opportunities, comparing options side-by-side, accessing curated skill materials, and tracking applications in your workspace are completely free for students, graduates, and individual explorers.'
    },
    {
      q: 'Where do the application links take me?',
      a: 'Every application button points directly to the host organization’s official application portal—such as universities, foundations, research institutes, or verified company career portals. ROMEfind does not charge application fees or act as an intermediary.'
    },
    {
      q: 'How are opportunities selected and verified?',
      a: 'We focus on high-impact fellowships, funded research placements, internships, and grants with transparent stipends and active submission cycles. We verify host institutions, deadlines, and direct destination URLs before publishing.'
    },
    {
      q: 'Can I compare opportunities from different fields?',
      a: 'Yes. Our comparison view allows you to place multiple opportunities side-by-side to evaluate differences in funding amounts, duration, location modality, and requirements across varied career pathways.'
    }
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-950 text-ink dark:text-surface-50 font-sans selection:bg-burgundy selection:text-white transition-colors">
      
      {/* ─── 1. Header (Sticky, Editorial Warm Cream) ─── */}
      <header className="sticky top-0 z-40 bg-cream/90 dark:bg-surface-950/90 backdrop-blur-md border-b border-editorial-ink dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-1 group" aria-label="ROMEfind home">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-burgundy dark:text-rome-400">
              ROME
            </span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
              find
            </span>
          </Link>

          {/* Desktop Nav Links (In-Page Anchors) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink/80 dark:text-surface-300">
            <button 
              onClick={() => scrollToSection('opportunities')} 
              className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer"
            >
              Opportunities
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-ink/70 hover:text-ink dark:text-surface-400 dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={18} /> : <SolarIcon name="moon-linear" size={18} />}
            </button>

            {isAuthenticated ? (
              <Button
                variant="default"
                size="default"
                className="bg-burgundy hover:bg-burgundy-700 text-white text-sm font-semibold h-10 min-h-[40px] px-5 rounded-xl shadow-xs"
                onClick={() => navigate('/discover')}
              >
                <span>Go to App</span>
                <SolarIcon name="alt-arrow-right-linear" size={15} />
              </Button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-semibold text-ink/80 dark:text-surface-200 hover:text-ink dark:hover:text-white px-3.5 py-2 transition-colors rounded-xl hover:bg-black/5 dark:hover:bg-surface-800"
                >
                  Sign in
                </Link>
                <Button
                  variant="default"
                  size="default"
                  className="bg-burgundy hover:bg-burgundy-700 text-white text-sm font-semibold h-10 min-h-[40px] px-5 rounded-xl shadow-xs"
                  onClick={handlePrimaryCta}
                >
                  <span>Find opportunities</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-ink/70 dark:text-surface-300 hover:bg-black/5 dark:hover:bg-surface-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={20} /> : <SolarIcon name="moon-linear" size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-ink/80 dark:text-surface-200 hover:bg-black/5 dark:hover:bg-surface-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <SolarIcon name={mobileMenuOpen ? "close-circle-linear" : "hamburger-menu-linear"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cream dark:bg-surface-900 border-b border-editorial-ink dark:border-surface-800 px-5 py-6 space-y-4 animate-in slide-in-from-top-2">
            <nav className="space-y-1">
              <button 
                onClick={() => scrollToSection('opportunities')}
                className="w-full text-left text-base font-semibold text-ink dark:text-surface-200 py-2.5 cursor-pointer min-h-[44px] flex items-center"
              >
                Opportunities
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="w-full text-left text-base font-semibold text-ink dark:text-surface-200 py-2.5 cursor-pointer min-h-[44px] flex items-center"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="w-full text-left text-base font-semibold text-ink dark:text-surface-200 py-2.5 cursor-pointer min-h-[44px] flex items-center"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="w-full text-left text-base font-semibold text-ink dark:text-surface-200 py-2.5 cursor-pointer min-h-[44px] flex items-center"
              >
                FAQ
              </button>
            </nav>

            <div className="pt-4 border-t border-editorial-ink dark:border-surface-800 space-y-2.5">
              {isAuthenticated ? (
                <Button
                  variant="default"
                  size="default"
                  className="w-full py-3 text-sm font-semibold bg-burgundy hover:bg-burgundy-700 text-white rounded-xl shadow-xs min-h-[48px]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/discover');
                  }}
                >
                  <span>Go to App</span>
                  <SolarIcon name="alt-arrow-right-linear" size={16} />
                </Button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm font-semibold border border-ink/20 dark:border-surface-700 rounded-xl text-ink dark:text-surface-100 hover:bg-black/5 dark:hover:bg-surface-800 transition-colors min-h-[48px]"
                  >
                    Sign in
                  </Link>
                  <Button
                    variant="default"
                    size="default"
                    className="w-full py-3 text-sm font-semibold bg-burgundy hover:bg-burgundy-700 text-white rounded-xl shadow-xs min-h-[48px]"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handlePrimaryCta();
                    }}
                  >
                    <span>Find opportunities</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section (Editorial Discovery + Human Personality) ─── */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-editorial-ink dark:border-surface-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-left space-y-6">
            
            {/* Brand Line Stamp */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-burgundy/10 dark:bg-burgundy/20 border border-burgundy/20 dark:border-burgundy/40 text-burgundy dark:text-rome-300 text-xs font-bold tracking-wide">
              <span>✦</span>
              <span>Rome wasn’t built in a day…</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink dark:text-surface-50 leading-[1.12]">
              Your next move shouldn’t be a guessing game.
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-ink/80 dark:text-surface-300 leading-relaxed max-w-2xl font-normal">
              Find what’s possible. Discover curated fellowships, paid internships, research residencies, and grants worth pursuing—with transparent stipends, active deadlines, and verified requirements.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="default"
                size="default"
                className="bg-burgundy hover:bg-burgundy-700 text-white text-base font-semibold h-12 sm:h-13 min-h-[48px] px-7 rounded-xl shadow-md hover:shadow-lg transition-all justify-center cursor-pointer"
                onClick={handlePrimaryCta}
              >
                <span>Find opportunities</span>
                <SolarIcon name="alt-arrow-right-linear" size={17} />
              </Button>

              <button 
                onClick={() => scrollToSection('opportunities')}
                className="inline-flex items-center justify-center text-sm font-semibold text-ink/80 dark:text-surface-300 hover:text-ink dark:hover:text-white px-5 py-3 h-12 min-h-[48px] rounded-xl hover:bg-black/5 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                Browse live listings ↓
              </button>
            </div>

            {/* Factual Trust Indicators (Truthful Provenance) */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-ink/70 dark:text-surface-400 font-medium">
              <span className="flex items-center gap-1.5">
                <SolarIcon name="check-circle-linear" size={15} className="text-burgundy dark:text-rome-400" />
                Direct links to official host portals
              </span>
              <span className="flex items-center gap-1.5">
                <SolarIcon name="check-circle-linear" size={15} className="text-burgundy dark:text-rome-400" />
                Transparent stipends & salaries
              </span>
              <span className="flex items-center gap-1.5">
                <SolarIcon name="check-circle-linear" size={15} className="text-burgundy dark:text-rome-400" />
                Active submission deadlines
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. Live Opportunities Section (First Scroll: Real Data Proof) ─── */}
      <section id="opportunities" className="py-16 sm:py-24 border-b border-editorial-ink dark:border-surface-800 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400 block mb-1.5">
                ★ Live Listings
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-surface-50">
                Opportunities open right now.
              </h2>
              <p className="text-sm sm:text-base text-ink/70 dark:text-surface-300 mt-1 max-w-xl">
                A selection of active programs from our verified catalog. Review funding, location, and prerequisites before you apply.
              </p>
            </div>

            <Button
              variant="outline"
              size="default"
              className="self-start sm:self-auto border-ink/20 dark:border-surface-700 bg-white/70 dark:bg-surface-900 text-ink dark:text-surface-100 hover:bg-white dark:hover:bg-surface-800 text-xs sm:text-sm font-semibold h-10 min-h-[40px] px-4 rounded-xl shrink-0 cursor-pointer"
              onClick={handlePrimaryCta}
            >
              <span>Explore all in app</span>
              <SolarIcon name="alt-arrow-right-linear" size={14} />
            </Button>
          </div>

          {/* 4 Real Opportunity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {featuredOpportunities.map((opp) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              const isItemSaved = isSaved(opp.id);

              return (
                <div 
                  key={opp.id}
                  className="bg-white dark:bg-surface-900 border border-editorial-ink dark:border-surface-800 rounded-2xl p-5 sm:p-6 text-left shadow-xs transition-all duration-200 md:hover:-translate-y-0.5 md:hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Organization & Type Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400">
                        {orgName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cream dark:bg-surface-800 text-ink dark:text-surface-200 border border-editorial-ink dark:border-surface-700">
                        {opp.type}
                      </span>
                    </div>

                    {/* Opportunity Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-ink dark:text-white mb-2 leading-snug">
                      {opp.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-ink/70 dark:text-surface-300 leading-relaxed mb-4 line-clamp-2">
                      {opp.shortDescription || opp.description}
                    </p>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-editorial-ink dark:border-surface-800/80 mb-4 bg-cream/30 dark:bg-surface-850/30 px-3 rounded-xl">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-ink/50 dark:text-surface-400 font-semibold block">Location</span>
                        <span className="font-semibold text-ink dark:text-surface-100 truncate block">
                          {opp.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-ink/50 dark:text-surface-400 font-semibold block">Deadline</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400 truncate block">
                          {opp.deadline || 'Rolling basis'}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-editorial-ink dark:border-surface-800/60 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-ink/50 dark:text-surface-400 font-semibold">Compensation</span>
                        <span className="font-bold text-ink dark:text-surface-50 text-xs truncate">
                          {opp.funding || 'Funded'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <a
                      href={opp.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-burgundy dark:text-rome-400 hover:underline"
                    >
                      <span>Official application portal</span>
                      <SolarIcon name="arrow-right-up-linear" size={14} />
                    </a>

                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          if (isItemSaved) unsaveOpportunity(opp.id);
                          else saveOpportunity(opp.id);
                        } else {
                          navigate('/signup');
                        }
                      }}
                      className={cn(
                        "w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer",
                        isItemSaved
                          ? "bg-burgundy text-white border-burgundy shadow-2xs"
                          : "bg-cream dark:bg-surface-800 text-ink/60 dark:text-surface-300 border-editorial-ink dark:border-surface-700 hover:text-burgundy"
                      )}
                      aria-label={isItemSaved ? "Remove from saved" : "Save opportunity"}
                      title={isAuthenticated ? (isItemSaved ? "Saved" : "Save to workspace") : "Sign up to save"}
                    >
                      <SolarIcon name={isItemSaved ? "heart-bold" : "heart-linear"} size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 4. The 4-Step Journey (How It Works) ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-editorial-ink dark:border-surface-800 scroll-mt-16 bg-cream/40 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400 block mb-1.5">
              ★ The Discovery Journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-surface-50">
              Clear steps. No endless searching.
            </h2>
            <p className="text-base text-ink/70 dark:text-surface-300 mt-2 leading-relaxed">
              Finding the right opportunity shouldn't feel like guessing. We guide you through four intentional phases:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workflowSteps.map((step) => (
              <div 
                key={step.number}
                className="bg-white dark:bg-surface-900 border border-editorial-ink dark:border-surface-800 rounded-2xl p-6 text-left shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-ink/20 dark:text-surface-700 block mb-3">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-ink dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-burgundy dark:text-rome-400 uppercase tracking-wide mb-3">
                    {step.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-ink/70 dark:text-surface-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 5. Practical Utility (Compare, Learn, Save, Track) ─── */}
      <section id="features" className="py-16 sm:py-24 border-b border-editorial-ink dark:border-surface-800 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400 block mb-1.5">
              ★ Built for Decision-Making
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-surface-50">
              Tools to evaluate before you apply.
            </h2>
            <p className="text-base text-ink/70 dark:text-surface-300 mt-2 leading-relaxed">
              ROMEfind helps you evaluate realistic options and organize your preparation in one calm workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {practicalFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-surface-900 border border-editorial-ink dark:border-surface-800 rounded-2xl p-6 text-left shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cream dark:bg-surface-800 text-burgundy dark:text-rome-400 flex items-center justify-center border border-editorial-ink dark:border-surface-700">
                  <SolarIcon name={feat.icon} size={20} />
                </div>
                <h3 className="text-base font-bold text-ink dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 dark:text-surface-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. Frequently Asked Questions (Clean Accordion) ─── */}
      <section id="faq" className="py-16 sm:py-24 border-b border-editorial-ink dark:border-surface-800 scroll-mt-16 bg-cream/40 dark:bg-surface-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400 block mb-1.5">
              ★ Honest Answers
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink dark:text-surface-50">
              Frequently asked questions.
            </h2>
            <p className="text-base text-ink/70 dark:text-surface-300 mt-2 leading-relaxed">
              Clear information about how ROMEfind curates opportunities and links to host institutions.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-editorial-ink dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-ink dark:text-white cursor-pointer hover:text-burgundy dark:hover:text-rome-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <SolarIcon 
                      name={isOpen ? "alt-arrow-up-linear" : "alt-arrow-down-linear"} 
                      size={18} 
                      className="shrink-0 text-ink/50 dark:text-surface-400"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-ink/70 dark:text-surface-300 leading-relaxed border-t border-editorial-ink dark:border-surface-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 7. Final Invitation & Closing ─── */}
      <section className="py-16 sm:py-24 bg-cream dark:bg-surface-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rome-400 block">
            ✦ ROMEfind
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink dark:text-surface-50">
            Find what’s possible.
          </h2>
          <p className="text-base sm:text-lg text-ink/70 dark:text-surface-300 max-w-xl mx-auto leading-relaxed">
            Start discovering realistic opportunities, evaluate requirements, and figure out your next step.
          </p>
          <div className="pt-2 flex justify-center">
            <Button
              variant="default"
              size="default"
              className="bg-burgundy hover:bg-burgundy-700 text-white text-base font-semibold h-13 min-h-[50px] px-8 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              onClick={handlePrimaryCta}
            >
              <span>Start exploring opportunities</span>
              <SolarIcon name="alt-arrow-right-linear" size={17} />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 8. Minimal Editorial Footer ─── */}
      <footer className="bg-cream dark:bg-surface-950 border-t border-editorial-ink dark:border-surface-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tight text-burgundy dark:text-rome-400">ROME</span>
            <span className="text-xl font-bold tracking-tight text-ink dark:text-white">find</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-ink/70 dark:text-surface-400">
            <button onClick={() => scrollToSection('opportunities')} className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer">Opportunities</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-burgundy dark:hover:text-white transition-colors cursor-pointer">FAQ</button>
            <Link to="/community-guidelines" className="hover:text-burgundy dark:hover:text-white transition-colors">Community Guidelines</Link>
            <Link to="/privacy" className="hover:text-burgundy dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-burgundy dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <p className="text-xs text-ink/50 dark:text-surface-500">
            &copy; {new Date().getFullYear()} ROMEfind. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
