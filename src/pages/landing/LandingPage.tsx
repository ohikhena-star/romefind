import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { cn } from '@/utils/cn';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCtaClick = () => {
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

  const pathways = [
    {
      title: 'Fellowships & Residencies',
      badge: 'Fully Funded',
      description: 'Prestigious global cohorts with full living stipends, dedicated mentorship, and research freedom.',
      icon: 'graduation-cap-linear'
    },
    {
      title: 'Internships & Co-ops',
      badge: 'Paid Roles',
      description: 'Hands-on industry and technical experience at pioneering research labs, scaleups, and companies.',
      icon: 'case-linear'
    },
    {
      title: 'Grants & Seed Funding',
      badge: 'Non-Dilutive',
      description: 'Financial backing to conduct independent research, build open-source projects, or prototype ideas.',
      icon: 'dollar-minimalistic-linear'
    },
    {
      title: 'Research Placements',
      badge: 'Academic Labs',
      description: 'Collaborate with top faculty and global institutes on cutting-edge scientific investigations.',
      icon: 'test-tube-linear'
    },
    {
      title: 'Competitions & Hackathons',
      badge: 'Prizes & Recognition',
      description: 'High-visibility technical challenges offering cash prizes, peer networking, and venture backing.',
      icon: 'cup-star-linear'
    },
    {
      title: 'Programmes & Accelerators',
      badge: 'Intensive Cohorts',
      description: 'Structured sprints and incubators designed to rapidly advance your skills and trajectory.',
      icon: 'rocket-linear'
    },
  ];

  const pillars = [
    {
      title: 'Verified Eligibility',
      description: 'Clear criteria on experience levels, degree requirements, and regional citizenship rules.',
      icon: 'check-circle-linear'
    },
    {
      title: 'Transparent Funding',
      description: 'Immediate visibility into stipends, salaries, grants, or self-funded commitments.',
      icon: 'dollar-minimalistic-linear'
    },
    {
      title: 'Actionable Deadlines',
      description: 'Urgency indicators and rolling submission windows so you never miss an application cycle.',
      icon: 'clock-circle-linear'
    },
    {
      title: 'Official Sources',
      description: 'Direct verified links to institutional application portals and program guidelines.',
      icon: 'arrow-right-up-linear'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Discover',
      description: 'Find curated opportunities matching your verified background, interests, and target destinations.'
    },
    {
      step: '02',
      title: 'Compare',
      description: 'Evaluate commitments, funding, duration, and prerequisites side by side to make confident choices.'
    },
    {
      step: '03',
      title: 'Prepare',
      description: 'Identify skill gaps and follow tailored learning recommendations before submission.'
    },
    {
      step: '04',
      title: 'Track',
      description: 'Manage checklist items, essays, deadlines, and acceptance outcomes in your personal workspace.'
    }
  ];

  const faqs = [
    {
      q: 'What makes ROMEfind different from generic job boards?',
      a: 'ROMEfind focuses on holistic opportunity discovery. Instead of just listing standard vacancies, we curate high-impact fellowships, funded research residencies, grants, accelerators, and student opportunities with verified eligibility criteria and transparent stipends.'
    },
    {
      q: 'Is ROMEfind free to use for students and researchers?',
      a: 'Yes. Discovering opportunities, comparing options side-by-side, accessing curated learning resources, and tracking your applications in the personal workspace are completely free for individual explorers.'
    },
    {
      q: 'How does opportunity personalization work?',
      a: 'During onboarding, you share your interests, target locations, education level, and career goals. ROMEfind calculates dynamic match scores and highlights parallel pathways you might have otherwise overlooked.'
    },
    {
      q: 'How are deadlines and application links verified?',
      a: 'Every opportunity is directly linked to its official institutional application portal and checked for verified status, rolling windows, and active deadlines.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 font-sans selection:bg-rome-500 selection:text-white transition-colors">
      {/* ─── Public Navigation Bar ─── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-950/90 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group" aria-label="ROMEfind home">
            <span className="text-2xl font-bold tracking-tight text-rome-500">ROME</span>
            <span className="text-2xl font-bold tracking-tight text-surface-950 dark:text-white">find</span>
          </Link>

          {/* Desktop Nav Links (Smooth Scroll on Landing Page) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-surface-600 dark:text-surface-300">
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={18} /> : <SolarIcon name="moon-linear" size={18} />}
            </button>
            {isAuthenticated ? (
              <Link to="/discover">
                <Button
                  variant="default"
                  size="default"
                  className="bg-rome-500 hover:bg-rome-600 text-white text-sm font-semibold h-10 min-h-[40px] px-5 rounded-xl shadow-xs"
                >
                  <span>Go to App</span>
                  <SolarIcon name="alt-arrow-right-linear" size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-semibold text-surface-700 dark:text-surface-200 hover:text-surface-950 dark:hover:text-white px-3.5 py-2 transition-colors rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  Sign in
                </Link>
                <Link to="/signup">
                  <Button
                    variant="default"
                    size="default"
                    className="bg-rome-500 hover:bg-rome-600 text-white text-sm font-semibold h-10 min-h-[40px] px-5 rounded-xl shadow-xs"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={20} /> : <SolarIcon name="moon-linear" size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <SolarIcon name={mobileMenuOpen ? "close-circle-linear" : "hamburger-menu-linear"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-5 py-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="space-y-3">
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-base font-semibold text-surface-800 dark:text-surface-200 py-2 cursor-pointer min-h-[44px] flex items-center"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left text-base font-semibold text-surface-800 dark:text-surface-200 py-2 cursor-pointer min-h-[44px] flex items-center"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left text-base font-semibold text-surface-800 dark:text-surface-200 py-2 cursor-pointer min-h-[44px] flex items-center"
              >
                FAQ
              </button>
            </div>
            <div className="pt-4 border-t border-surface-100 dark:border-surface-800 space-y-2.5">
              {isAuthenticated ? (
                <Link
                  to="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold bg-rome-500 hover:bg-rome-600 text-white rounded-xl shadow-xs transition-colors min-h-[48px]"
                >
                  <span>Go to App</span>
                  <SolarIcon name="alt-arrow-right-linear" size={16} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm font-semibold border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors min-h-[48px]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm font-semibold bg-rome-500 hover:bg-rome-600 text-white rounded-xl shadow-xs transition-colors min-h-[48px]"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-surface-200/60 dark:border-surface-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100 dark:bg-surface-850 text-surface-800 dark:text-surface-200 text-xs font-bold uppercase tracking-wider border border-surface-200/80 dark:border-surface-700/80">
                <span className="w-2 h-2 rounded-full bg-rome-500" />
                <span>Opportunity Discovery & Decision Support</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 leading-[1.15]">
                Rome wasn’t built in a day. <br className="hidden sm:inline" />
                <span className="text-rome-500">Neither is your path.</span>
              </h1>

              <p className="text-base sm:text-lg text-surface-600 dark:text-surface-300 leading-relaxed max-w-xl">
                Discover opportunities you might not have found on your own. ROMEfind surfaces high-impact fellowships, internships, grants, research programs, and skill accelerators tailored to what you want to achieve.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="default"
                  size="default"
                  className="bg-rome-500 hover:bg-rome-600 text-white text-base font-semibold h-12 sm:h-13 min-h-[48px] px-7 rounded-xl shadow-md hover:shadow-lg transition-all justify-center"
                  onClick={handleCtaClick}
                >
                  <span>Explore opportunities</span>
                  <SolarIcon name="alt-arrow-right-linear" size={18} />
                </Button>

                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="inline-flex items-center justify-center text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-surface-950 dark:hover:text-white px-5 py-3 h-12 min-h-[48px] rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors cursor-pointer"
                >
                  See how it works
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-surface-500 dark:text-surface-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <SolarIcon name="check-circle-linear" size={16} className="text-rome-500" />
                  Verified Deadlines & Eligibility
                </span>
                <span className="flex items-center gap-1.5">
                  <SolarIcon name="check-circle-linear" size={16} className="text-rome-500" />
                  Transparent Stipends & Funding
                </span>
                <span className="flex items-center gap-1.5">
                  <SolarIcon name="check-circle-linear" size={16} className="text-rome-500" />
                  Official Application Portals
                </span>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 sm:p-7 shadow-xl shadow-surface-950/5 relative overflow-hidden text-left">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center justify-center">
                      <SolarIcon name="buildings-2-linear" size={13} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-500">
                      Stanford University
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    Fully Funded
                  </span>
                </div>

                <h3 className="text-xl font-bold text-surface-950 dark:text-white leading-snug mb-2">
                  Knight-Hennessy Scholars Program
                </h3>

                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700">
                    Fellowship
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-100/60 dark:bg-surface-800/60 text-surface-600 dark:text-surface-400">
                    Leadership & Public Policy
                  </span>
                </div>

                <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
                  Full tuition, stipend, and leadership development across all graduate degree disciplines at Stanford.
                </p>

                {/* Structured Metadata (Direct on Card Surface) */}
                <div className="grid grid-cols-2 gap-2.5 text-xs py-3 border-y border-surface-100 dark:border-surface-800/80 mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-semibold block mb-0.5">Location</span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">Stanford, CA, USA</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-semibold block mb-0.5">Deadline</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Oct 07, 2026</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-surface-100 dark:border-surface-800/60 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-semibold">Funding</span>
                    <span className="font-semibold text-surface-900 dark:text-surface-100">100% Tuition + Living Stipend</span>
                  </div>
                </div>

                {/* Decorative Opportunity Preview Footer (Illustrative - does not navigate) */}
                <div className="flex items-center gap-2">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-center text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default select-none border border-surface-200/50 dark:border-surface-700/50">
                    <span>Verified Opportunity Preview</span>
                    <SolarIcon name="check-circle-linear" size={14} className="text-rome-500" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Section: About (In-Page Section) ─── */}
      <section id="about" className="py-16 sm:py-24 border-b border-surface-200/60 dark:border-surface-800/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 block">
                ★ About ROMEfind
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 leading-tight">
                Designed to help you uncover paths you never knew existed.
              </h2>
              <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
                Most discovery platforms operate like conventional job boards—showing you only the standard roles everyone already knows about.
              </p>
              <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
                ROMEfind was built on a different principle: that ambitious paths are made possible through non-linear combinations of fellowships, research placements, seed grants, and intensive programmes. We provide the structured clarity and decision support to help you navigate them.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/40 text-left space-y-2">
                <span className="text-2xl font-bold text-rome-500">100%</span>
                <h3 className="font-bold text-base text-surface-950 dark:text-white">Curated & Verified</h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">All opportunities are vetted for genuine funding and authentic application links.</p>
              </div>
              <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/40 text-left space-y-2">
                <span className="text-2xl font-bold text-rome-500">Global</span>
                <h3 className="font-bold text-base text-surface-950 dark:text-white">Worldwide Scope</h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Opportunities spanning the US, UK, Europe, Africa, Asia, and remote worldwide.</p>
              </div>
              <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/40 text-left space-y-2">
                <span className="text-2xl font-bold text-rome-500">Smart</span>
                <h3 className="font-bold text-base text-surface-950 dark:text-white">Side-by-Side Compare</h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Evaluate duration, stipends, and requirements side-by-side before applying.</p>
              </div>
              <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/40 text-left space-y-2">
                <span className="text-2xl font-bold text-rome-500">Private</span>
                <h3 className="font-bold text-base text-surface-950 dark:text-white">Personal Workspace</h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Track deadlines, checklists, and outcomes in one focused command center.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 1: Find Possibilities Across Different Paths ─── */}
      <section id="pathways" className="py-16 sm:py-24 border-b border-surface-200/60 dark:border-surface-800/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 block mb-2">
              ★ Discover Pathways
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 mb-3">
              Find possibilities across different paths.
            </h2>
            <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
              There are more opportunities and career trajectories available than people usually discover. Explore curated formats structured for high growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pathways.map((path, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 transition-all duration-200 md:hover:-translate-y-0.5 md:hover:shadow-card-hover md:hover:border-surface-300 dark:md:hover:border-surface-700 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 flex items-center justify-center">
                      <SolarIcon name={path.icon} size={20} />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                      {path.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-surface-950 dark:text-white mb-2">
                    {path.title}
                  </h3>

                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 2: Don't Just Find Opportunities. Understand Them ─── */}
      <section className="py-16 sm:py-24 border-b border-surface-200/60 dark:border-surface-800/60 bg-surface-50/50 dark:bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 block mb-2">
              ★ Clarity & Decision Support
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 mb-3">
              Don’t just find opportunities. Understand them.
            </h2>
            <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
              Every opportunity in ROMEfind is broken down into structured, actionable intelligence before you invest your time applying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 text-left space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-rome-50 dark:bg-rome-950/50 text-rome-600 dark:text-rome-400 flex items-center justify-center border border-rome-200/60 dark:border-rome-800/60">
                  <SolarIcon name={pillar.icon} size={20} />
                </div>
                <h3 className="text-base font-bold text-surface-950 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 3: The ROMEMethod Loop (How It Works) ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-surface-200/60 dark:border-surface-800/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 block mb-2">
              ★ The Complete Loop
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 mb-3">
              Explore. Compare. Prepare. Track.
            </h2>
            <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
              From initial spark to accepted offer, navigate every step of your trajectory with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 text-left space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-black text-surface-200 dark:text-surface-800 block">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-surface-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section: FAQ (In-Page Section) ─── */}
      <section id="faq" className="py-16 sm:py-24 border-b border-surface-200/60 dark:border-surface-800/60 bg-surface-50/50 dark:bg-surface-900/40 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 block mb-2">
              ★ Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50 mb-3">
              Everything you need to know.
            </h2>
            <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed">
              Answers to common questions about opportunity curation, matching, and tracking on ROMEfind.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-surface-950 dark:text-white cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <SolarIcon 
                      name={isOpen ? "alt-arrow-up-linear" : "alt-arrow-down-linear"} 
                      size={18} 
                      className="shrink-0 text-surface-400"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-surface-600 dark:text-surface-300 leading-relaxed border-t border-surface-100 dark:border-surface-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Final CTA ─── */}
      <section className="py-16 sm:py-24 bg-surface-50/60 dark:bg-surface-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-surface-950 dark:text-surface-50">
            Find what’s possible.
          </h2>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of ambitious students, researchers, and professionals discovering and securing their next breakthrough.
          </p>
          <div className="pt-3 flex justify-center">
            <Button
              variant="default"
              size="default"
              className="bg-rome-500 hover:bg-rome-600 text-white text-base font-semibold h-13 min-h-[50px] px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={handleCtaClick}
            >
              <span>Start exploring opportunities</span>
              <SolarIcon name="alt-arrow-right-linear" size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Clean Minimal Footer ─── */}
      <footer className="bg-white dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-rome-500">ROME</span>
            <span className="text-xl font-bold tracking-tight text-surface-950 dark:text-white">find</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-surface-600 dark:text-surface-400">
            <button onClick={() => scrollToSection('about')} className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer">FAQ</button>
            <Link to="/community-guidelines" className="hover:text-surface-950 dark:hover:text-white transition-colors">Community Guidelines</Link>
            <Link to="/privacy" className="hover:text-surface-950 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-surface-950 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <p className="text-xs text-surface-400 dark:text-surface-500">
            &copy; {new Date().getFullYear()} ROMEfind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
