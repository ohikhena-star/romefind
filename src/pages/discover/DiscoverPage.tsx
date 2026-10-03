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
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, AlternativeDiscovery, SearchResult } from '@/types/models';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { opportunities, isLoading } = useOpportunityStore();
  const { savedOpportunities, trackedApplications, saveOpportunity, unsaveOpportunity, isSaved } = useApplicationStore();

  const [debugMode, setDebugMode] = useState(() => {
    return searchParams.get('debug') === '1' || searchParams.get('debug') === 'true';
  });

  const activeItems = useMemo(() => {
    const saved = opportunities.filter((o: Opportunity) => savedOpportunities.includes(o.id));
    return saved.slice(0, 3);
  }, [opportunities, savedOpportunities]);

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
          icon="compass-linear"
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
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
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
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-transparent",
              debugMode 
                ? "text-surface-400 dark:text-surface-500" 
                : "text-surface-300 dark:text-surface-600 hover:text-surface-500"
            )}
            title="Toggle matching signals breakdown on opportunity cards"
          >
            <SolarIcon name="bug-linear" size={14} className="w-3.5 h-3.5" />
            <span>Matching Inspector: {debugMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* Onboarding nudge: only shown if user hasn't set interests */}
      {user && !user.profile?.interests?.length && (
        <div className="rounded-xl bg-rome-50 dark:bg-rome-950/20 border border-rome-200/60 dark:border-rome-800/40 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-rome-900 dark:text-rome-100">Complete your profile for better matches</p>
            <p className="text-xs text-rome-700 dark:text-rome-300 mt-0.5">Add your interests and goals to unlock personalised recommendations.</p>
          </div>
          <Link to="/profile" className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rome-500 hover:bg-rome-600 text-white text-xs font-semibold transition-colors whitespace-nowrap">
            Update profile
          </Link>
        </div>
      )}



      {/* ─── 0. CONTINUE WHERE YOU LEFT OFF (Only if active saved/tracked) ─── */}
      {activeItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <SolarIcon name="bookmark-linear" size={16} className="text-surface-400 dark:text-surface-500" />
                Continue where you left off
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Opportunities you recently saved or began tracking.
              </p>
            </div>
            <Link to="/my-opportunities" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs">
              View all ({savedOpportunities.length}) <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeItems.map((opp: Opportunity) => (
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

      {/* ─── SECTION 1: FOR YOU (HIGH-PRECISION RECOMMENDATIONS) ─── */}
      <section id="for-you" className="space-y-4 scroll-mt-20">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-surface-900 dark:text-surface-100">
              <SolarIcon name="star-linear" size={16} className="text-surface-400 dark:text-surface-500" />
              For you
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Opportunities matching your verified skills, experience level, and goals.
            </p>
          </div>
          <Link to="/recommendations" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs">
            See all matches <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <OpportunityCard 
                key={rec.opportunity.id} 
                id={idx === 0 ? 'tour-card' : undefined}
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
            icon="compass-linear"
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
            <SolarIcon name="magic-stick-linear" size={16} className="text-surface-400 dark:text-surface-500" />
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">You might be overlooking</h2>
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
                className="cursor-pointer group relative overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 transition-all hover:shadow-card hover:border-rome-300 dark:hover:border-rome-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 group-hover:text-rome-500 transition-colors">
                    {item.alternativeType}
                  </h3>
                  <span className="text-xs text-surface-500">
                    {item.count} available
                  </span>
                </div>
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-3">
                  {item.reason}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-rome-600 dark:text-rome-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore {item.alternativeType}s</span>
                  <SolarIcon name="alt-arrow-right-linear" size={13} />
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
              <h2 className="text-xl font-semibold flex items-center gap-2 text-surface-900 dark:text-surface-100">
                <SolarIcon name="clock-circle-linear" size={16} className="text-surface-400 dark:text-surface-500" />
                Closing soon
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Upcoming deadlines in the next 45 days.
              </p>
            </div>
            <Link to="/explore?status=open" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs">
              View all deadlines <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
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
