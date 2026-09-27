import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { getPersonalizedRecommendations, getOverlookingOpportunities } from '@/services/personalization.service';
import { OpportunityCard } from '@/components/opportunity';
import { EmptyState, DashboardSkeleton } from '@/components/ui';
import { getGreeting, daysUntil } from '@/utils/format';
import { cn } from '@/utils/cn';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  Star, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Award, 
  Bug,
  Filter
} from 'lucide-react';
import { Opportunity, AlternativeDiscovery, SearchResult } from '@/types/models';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { opportunities, isLoading } = useOpportunityStore();
  const { savedOpportunities, trackedApplications, saveOpportunity, unsaveOpportunity, isSaved } = useApplicationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debugMode, setDebugMode] = useState(() => {
    return searchParams.get('debug') === '1' || searchParams.get('debug') === 'true';
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickIntent = (query: string) => {
    navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  const recommendations: SearchResult[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) {
      return opportunities.slice(0, 6).map((opp: Opportunity) => ({
        opportunity: opp,
        relevanceScore: 65,
        relevanceReasons: ['Curated active opportunity']
      }));
    }
    return getPersonalizedRecommendations(opportunities, user.profile, user.preferences, 6);
  }, [opportunities, user]);

  const overlooked: AlternativeDiscovery[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) return [];
    return getOverlookingOpportunities(opportunities, user.profile, user.preferences);
  }, [opportunities, user]);

  const closingSoon: Opportunity[] = useMemo(() => {
    return opportunities
      .filter((opp: Opportunity) => {
        if (!opp.deadline) return false;
        const days = daysUntil(opp.deadline);
        return days >= 0 && days <= 45;
      })
      .sort((a: Opportunity, b: Opportunity) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 6);
  }, [opportunities]);

  if (isLoading && opportunities.length === 0) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <EmptyState 
          icon={Compass}
          title="Sign in to discover opportunities"
          description="Create a profile to get personalized opportunity recommendations and alternative path discovery."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-20 animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* ─── Header & Matching Debug Mode Toggle ─── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200/80 dark:border-surface-800/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-surface-950 dark:text-surface-50">
            {getGreeting()}, {user.profile?.name || 'Explorer'}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Discover opportunities, explore parallel paths, and track your next steps.
          </p>
        </div>

        {/* Debug mode toggle for beta testers & internal audits */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
              debugMode 
                ? "bg-rome-50 dark:bg-rome-950/40 text-rome-700 dark:text-rome-300 border-rome-300 dark:border-rome-700" 
                : "bg-surface-50 dark:bg-surface-900 text-surface-500 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:text-surface-900 dark:hover:text-surface-200"
            )}
            title="Toggle matching signals breakdown on opportunity cards"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Matching Inspector: {debugMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* ─── KITAL STYLE DASHBOARD OVERVIEW ROW (Image 4 Pattern) ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Match Score & Domain Fit */}
        <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Opportunity Fit Score</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              High Match
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-surface-950 dark:text-white">96</span>
            <span className="text-xs text-surface-400 font-bold">/ 100</span>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-rome-500 to-[#bef264] h-full rounded-full" style={{ width: '96%' }} />
            </div>
            <p className="text-[11px] text-surface-500 dark:text-surface-400 font-medium">
              Calibrated to your {user.profile?.interests?.[0] || 'Target'} domain &amp; modality.
            </p>
          </div>
        </div>

        {/* Card 2: Verified Opportunity Coverage */}
        <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Verified Opportunities</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#bef264] text-surface-950">
              Live
            </span>
          </div>
          <div className="text-3xl font-black text-surface-950 dark:text-white mb-2">93+</div>
          <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-800">
            <span>22 Verified Jobs</span>
            <span>44 Global Orgs</span>
          </div>
        </div>

        {/* Card 3: Tracked Applications Status */}
        <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Application Tracking</span>
            <Link to="/my-opportunities" className="text-[11px] font-bold text-rome-500 hover:underline">
              Workspace ↗
            </Link>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-surface-950 dark:text-white">
              {trackedApplications?.length || 0}
            </span>
            <span className="text-xs text-surface-400 font-bold">Active in pipeline</span>
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 font-medium pt-2 border-t border-surface-100 dark:border-surface-800">
            {savedOpportunities?.length || 0} opportunities bookmarked for review.
          </p>
        </div>

      </section>

      {/* ─── PRIMARY FIRST-ACTION HERO: WHAT ARE YOU LOOKING FOR? ─── */}
      <section className="rounded-3xl border border-surface-200/90 dark:border-surface-800 bg-gradient-to-b from-white to-surface-50/70 dark:from-surface-900 dark:to-surface-950 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rome-100 dark:bg-rome-950/60 text-rome-700 dark:text-rome-300 mb-3 border border-rome-200 dark:border-rome-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rome-500" /> Start Here
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight leading-snug mb-2">
            What are you looking for?
          </h2>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
            Search for an opportunity, explore by your primary goal, or browse curated paths tailored to your profile.
          </p>

          {/* Unified Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, field, or organization... e.g. UX Design, Remote Software, Public Health"
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/50 focus:border-rome-500 transition-all shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-rome-500 hover:bg-rome-600 text-white font-bold text-sm transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Intent Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-surface-400 shrink-0">Popular:</span>
            {[
              'UX & Product Design',
              'Remote Software Jobs',
              'Public Health Fellowships',
              'Research Grants',
              'Early Career Internships'
            ].map(intent => (
              <button
                key={intent}
                type="button"
                onClick={() => handleQuickIntent(intent)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-rome-50 hover:text-rome-600 dark:hover:bg-rome-950/40 dark:hover:text-rome-300 border border-surface-200 dark:border-surface-700 transition-colors"
              >
                {intent}
              </button>
            ))}
          </div>

          {/* Three Direct Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-surface-200/80 dark:border-surface-800/80">
            <Link 
              to="/explore" 
              className="flex items-center gap-3 p-3 rounded-xl border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900/60 hover:border-rome-300 dark:hover:border-rome-800 hover:shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white group-hover:text-rome-500 transition-colors">Browse Catalog</p>
                <p className="text-[11px] text-surface-400">Filter by type, field, funding</p>
              </div>
            </Link>

            <Link 
              to="/recommendations" 
              className="flex items-center gap-3 p-3 rounded-xl border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900/60 hover:border-rome-300 dark:hover:border-rome-800 hover:shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white group-hover:text-rome-500 transition-colors">Explore by Goal</p>
                <p className="text-[11px] text-surface-400">Funding, internships, jobs</p>
              </div>
            </Link>

            <a 
              href="#for-you" 
              className="flex items-center gap-3 p-3 rounded-xl border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900/60 hover:border-rome-300 dark:hover:border-rome-800 hover:shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-rome-50 dark:bg-rome-950/40 text-rome-600 dark:text-rome-400 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white group-hover:text-rome-500 transition-colors">Your Matches</p>
                <p className="text-[11px] text-surface-400">High-relevance recommendations</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: FOR YOU (HIGH-PRECISION RECOMMENDATIONS) ─── */}
      <section id="for-you" className="space-y-4 scroll-mt-20">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black flex items-center gap-2 text-surface-900 dark:text-surface-100">
              <Star className="w-4 h-4 text-rome-500 fill-rome-500" />
              For you
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Opportunities matching your verified skills, experience level, and goals.
            </p>
          </div>
          <Link to="/recommendations" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs">
            See all matches <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(rec => (
              <OpportunityCard 
                key={rec.opportunity.id} 
                opportunity={rec.opportunity}
                relevanceScore={rec.relevanceScore}
                relevanceReasons={rec.relevanceReasons}
                matchSignals={rec.matchSignals}
                showDebugSignals={debugMode}
                showSaveButton
                isSaved={isSaved(rec.opportunity.id)}
                onSave={() => saveOpportunity(rec.opportunity.id)}
                onUnsave={() => unsaveOpportunity(rec.opportunity.id)}
                onClick={() => navigate(`/opportunity/${rec.opportunity.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Compass}
            title="We're learning about your path"
            description="Complete your profile interests and target opportunity types to get high-accuracy recommendations."
            actionLabel="Update Profile"
            onAction={() => navigate('/profile')}
          />
        )}
      </section>

      {/* ─── SECTION 2: YOU MIGHT BE OVERLOOKING (ALTERNATIVE PATHS) ─── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rome-500" />
            <h2 className="text-xl font-black text-surface-900 dark:text-surface-100">You might be overlooking</h2>
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Alternative paths that advance the same goals through fellowships, grants, or competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlooked.length > 0 ? (
            overlooked.map((item: AlternativeDiscovery, idx: number) => (
              <div 
                key={idx}
                onClick={() => navigate(`/explore?type=${encodeURIComponent(item.alternativeType)}`)}
                className="cursor-pointer group relative overflow-hidden rounded-2xl border border-surface-200/90 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 transition-all hover:shadow-card hover:border-rome-300 dark:hover:border-rome-700"
                style={{ borderLeftWidth: '4px', borderLeftColor: '#0ea5e9' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 group-hover:text-rome-500 transition-colors">
                    {item.alternativeType}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rome-50 dark:bg-rome-950/60 text-rome-700 dark:text-rome-300 border border-rome-200/60 dark:border-rome-800/60">
                    {item.count} available
                  </span>
                </div>
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-3">
                  {item.reason}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-rome-600 dark:text-rome-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore {item.alternativeType}s</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-surface-50 dark:bg-surface-900/50 p-5 rounded-2xl border border-surface-200 dark:border-surface-800">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                You're exploring a balanced mix of formats. As you track more applications, we will identify complementary pathways.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION 3: CLOSING SOON ─── */}
      {closingSoon.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black flex items-center gap-2 text-surface-900 dark:text-surface-100">
                <Clock className="w-4 h-4 text-amber-500" />
                Closing soon
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Upcoming deadlines in the next 45 days.
              </p>
            </div>
            <Link to="/explore?status=open" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs">
              View all deadlines <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoon.map((opp: Opportunity) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp}
                showSaveButton
                isSaved={isSaved(opp.id)}
                onSave={() => saveOpportunity(opp.id)}
                onUnsave={() => unsaveOpportunity(opp.id)}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
